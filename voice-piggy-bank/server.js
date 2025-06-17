// 簡易プロキシサーバー
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

// ビルド状態の管理
let isBuildReady = false;
const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

console.log('🔍 Current directory:', __dirname);
console.log('🔍 Expected build path:', buildPath);

// ビルドチェック
function checkBuildStatus() {
  const buildExists = fs.existsSync(buildPath) && fs.existsSync(indexPath);
  isBuildReady = buildExists;
  return buildExists;
}

// 初期ビルドチェック
checkBuildStatus();

// 静的ファイル配信
app.use(express.static(buildPath));

// 健全性チェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    build: checkBuildStatus() ? 'ready' : 'building',
    buildPath: buildPath
  });
});

// ビルド開始エンドポイント
app.post('/build', async (req, res) => {
  if (isBuildReady) {
    return res.json({ message: 'Build already ready' });
  }
  
  console.log('🏗️ Manual build triggered...');
  const { exec } = require('child_process');
  
  exec('npm run build', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error.message);
      return;
    }
    console.log('✅ Build completed successfully');
    checkBuildStatus();
  });
  
  res.json({ message: 'Build started' });
});

// OpenAI音声API プロキシ
app.post('/api/speech', async (req, res) => {
  try {
    const { text, voice = 'nova', model = 'tts-1' } = req.body;
    // 環境変数からAPIキーを取得（Render本番用）
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }

    console.log(`🎵 Generating speech: "${text}" with voice: ${voice}`);

    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        response_format: 'mp3',
        speed: 1.0
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI API Error:', error);
      return res.status(response.status).json({ error });
    }

    const audioBuffer = await response.buffer();
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=31536000', // 1年キャッシュ
    });
    
    console.log(`✅ Speech generated successfully (${audioBuffer.length} bytes)`);
    res.send(audioBuffer);
  } catch (error) {
    console.error('💥 Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// React アプリケーション配信
app.get('*', (req, res) => {
  // ビルド状態をリアルタイムでチェック
  checkBuildStatus();
  
  if (isBuildReady) {
    res.sendFile(indexPath);
  } else {
    // ビルド中の待機ページ
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🐷 音声貯金箱 - ビルド中</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            margin: 50px;
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .emoji { font-size: 4rem; margin: 20px; }
          .loading { animation: spin 2s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="emoji loading">🏗️</div>
          <h1>🐷 音声貯金箱</h1>
          <p>アプリをビルド中です...</p>
          <p>完了まで少々お待ちください 🎵</p>
          <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px; border: none; border-radius: 10px; background: #667eea; color: white; cursor: pointer;">
            🔄 更新
          </button>
          <button onclick="buildApp()" style="padding: 10px 20px; margin: 10px; border: none; border-radius: 10px; background: #ff6b6b; color: white; cursor: pointer;">
            ⚡ ビルド開始
          </button>
        </div>
        <script>
          function buildApp() {
            fetch('/build', { method: 'POST' })
              .then(() => setTimeout(() => location.reload(), 3000));
          }
          setTimeout(() => location.reload(), 10000);
        </script>
      </body>
      </html>
    `);
  }
});

// サーバー起動（即座にポートをバインド）
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 サーバーが http://${HOST}:${PORT} で起動しました`);
  console.log('🎤 音声貯金箱アプリをお楽しみください！');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? '設定済み' : '未設定'}`);
  
  // サーバー起動後にビルドをバックグラウンドで開始
  if (!isBuildReady) {
    console.log('⚡ Starting background build...');
    setTimeout(() => {
      const { exec } = require('child_process');
      exec('npm run build', { 
        cwd: __dirname,
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=200' }
      }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Background build failed:', error.message);
        } else {
          console.log('✅ Background build completed');
          checkBuildStatus();
        }
      });
    }, 1000);
  }
});

module.exports = app;