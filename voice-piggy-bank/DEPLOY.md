# 🚀 Renderへのデプロイ手順

## 📋 事前準備

### 1. GitHubリポジトリ作成
```bash
git init
git add .
git commit -m "Initial commit: Voice Piggy Bank App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voice-piggy-bank.git
git push -u origin main
```

### 2. OpenAI APIキーの準備
- [OpenAI Platform](https://platform.openai.com/)でAPIキーを取得
- `sk-`で始まる文字列をコピー

## 🌐 Renderデプロイ手順

### 1. Renderアカウント作成
1. [Render.com](https://render.com)にアクセス
2. GitHubアカウントでサインアップ

### 2. 新しいWebサービス作成
1. ダッシュボードで「New +」→「Web Service」
2. GitHubリポジトリを選択
3. 以下の設定を入力：

#### 基本設定
- **Name**: `voice-piggy-bank`
- **Environment**: `Node`
- **Region**: `Tokyo` (日本向け)
- **Branch**: `main`

#### ビルド設定
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### 環境変数
以下を追加（Environment Variables）:
```
OPENAI_API_KEY=sk-your_actual_api_key_here
VOICE_MODEL=tts-1
VOICE_NAME=nova
PORT=10000
```

### 3. デプロイ実行
1. 「Create Web Service」をクリック
2. 自動デプロイが開始されます（約5-10分）

### 4. 完成
- デプロイ完了後、`https://your-app-name.onrender.com`でアクセス可能
- 可愛いnovaボイスでの音声貯金箱アプリが利用できます！

## 🔒 セキュリティ注意事項

- ✅ `.env`ファイルはGitHubにアップロードされません
- ✅ APIキーはRenderの環境変数で安全に管理
- ✅ `.gitignore`で機密情報を除外済み

## 🐛 トラブルシューティング

### ビルドエラー
- Node.jsバージョンが18以上であることを確認
- 依存関係の問題: `npm install`でパッケージを確認

### 音声が出ない
- 環境変数`OPENAI_API_KEY`が正しく設定されているか確認
- APIキーの残高を確認

### 接続エラー
- Renderのログを確認（Dashboard → Logs）
- ポート設定が正しいか確認

## 💰 料金について

### Render
- 無料プラン: 750時間/月（十分な使用量）
- スリープ機能: 15分非アクティブ後に停止

### OpenAI
- TTS料金: $15.00 / 1M文字
- 一般的な使用で月数十円程度

楽しい音声貯金箱ライフをお楽しみください！🐷✨