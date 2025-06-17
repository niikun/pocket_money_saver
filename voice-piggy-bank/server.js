// 簡易プロキシサーバー
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// ビルドディレクトリの確認とビルド実行
const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

console.log('🔍 Current directory:', __dirname);
console.log('🔍 Expected build path:', buildPath);

// buildディレクトリが存在しない、またはindex.htmlがない場合はビルドを実行
if (!fs.existsSync(buildPath) || !fs.existsSync(indexPath)) {
  console.log('⚠️ Build directory or index.html not found. Building...');
  
  // 同期的にビルドを実行
  const { execSync } = require('child_process');
  try {
    console.log('🏗️ Running build command...');
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Build directory found');
}

// 静的ファイル配信
app.use(express.static(buildPath));

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
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 サーバーが http://localhost:${PORT} で起動しました`);
  console.log('🎤 音声貯金箱アプリをお楽しみください！');
});

module.exports = app;