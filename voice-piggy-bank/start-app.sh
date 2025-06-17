#!/bin/bash
echo "🎯 音声貯金箱アプリを起動中..."
echo "📁 プロジェクトディレクトリ: $(pwd)"
echo "🔧 Node.js バージョン: $(node --version)"
echo "📦 npm バージョン: $(npm --version)"
echo ""
echo "🏗️  ビルドテスト中..."
npm run build
echo ""
if [ $? -eq 0 ]; then
    echo "✅ ビルド成功！"
    echo ""
    echo "🚀 開発サーバーを起動..."
    echo "ブラウザで http://localhost:3000 を開いてください"
    echo ""
    echo "使い方："
    echo "1. 🎤ボタンをクリック"
    echo "2. '100円貯金した' または '50円お菓子に使った' と話しかける"
    echo "3. 動物が進化するのを楽しむ！"
    echo ""
    npm start
else
    echo "❌ ビルドに失敗しました"
    exit 1
fi