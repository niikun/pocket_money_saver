# 🐷 音声貯金箱 - Voice Piggy Bank

**子供が楽しく貯金を学べる音声対話型アプリ**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![GitHub Stars](https://img.shields.io/github/stars/niikun/pocket_money_saver?style=social)](https://github.com/niikun/pocket_money_saver)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🎵 **OpenAI novaボイス**で話しかけてくれる可愛い動物と一緒に、楽しく貯金を学びましょう！貯金額に応じて動物が進化していく仕組みで、子供のモチベーションを自然に向上させます。

![Demo GIF](https://via.placeholder.com/600x300/ff6b9d/ffffff?text=🐷+Voice+Piggy+Bank+Demo)

## ✨ 主な機能

- 🎤 **音声認識**: 「100円貯金した」「50円お菓子に使った」などの自然な日本語を理解
- 🎵 **可愛い音声**: OpenAI APIで自然で可愛い女性の声（novaボイス）
- 🐣 **動物の進化**: 貯金額に応じて🥚→🐣→🐶→🐺→🦁→🐉へ進化
- 💾 **データ保存**: ブラウザにデータを自動保存
- 📱 **レスポンシブ**: スマホ・タブレット対応

## 🌐 オンラインデモ

🎯 **今すぐ試す**: [https://voice-piggy-bank.onrender.com](https://voice-piggy-bank.onrender.com)

> 音声認識とOpenAI novaボイスの魅力を体験してください！

## 🚀 ローカル環境でのセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- OpenAI APIキー（可愛い音声用）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/niikun/pocket_money_saver.git
cd pocket_money_saver/voice-piggy-bank

# 依存関係をインストール
npm install

# 環境変数を設定（オプション）
cp .env.example .env
# .envファイルにOpenAI APIキーを設定

# アプリを起動
npm run start:server  # OpenAI音声版（推奨）
# または
npm run dev          # 開発版（ブラウザ標準音声）
```

| 起動方法 | ポート | 音声 | 用途 |
|---------|-------|------|------|
| `npm run start:server` | 3002 | 🎵 OpenAI nova | **本番・デモ用** |
| `npm run dev` | 3000 | 🔊 ブラウザ標準 | 開発・テスト用 |

## 🎵 可愛い音声の設定（推奨）

OpenAI APIを使用すると、とても自然で可愛い女性の声になります：

1. [OpenAI Platform](https://platform.openai.com/)でAPIキーを取得
2. `.env`ファイルを作成：
```bash
REACT_APP_OPENAI_API_KEY=your_api_key_here
REACT_APP_VOICE_NAME=nova
```
3. アプリを再起動

詳細は [SETUP_OPENAI.md](./SETUP_OPENAI.md) をご覧ください。

## 🎮 使い方

1. **🎤ボタン**をクリックして音声認識開始
2. 話しかける例：
   - 「100円貯金した」
   - 「50円お菓子に使った」
   - 「いくら貯まった？」
3. 動物が可愛い声で返事してくれます
4. 貯金額が増えると動物が進化！

## 🐉 進化システム

| 貯金額 | 動物 | 説明 |
|--------|------|------|
| 0円〜 | 🥚 たまご | まだ生まれていません |
| 100円〜 | 🐣 ひよこ | 元気いっぱいの赤ちゃん！ |
| 500円〜 | 🐶 こいぬ | 活発に動き回ります |
| 1000円〜 | 🐺 おおかみ | 賢くて強くなりました |
| 2000円〜 | 🦁 ライオン | 百獣の王になりました！ |
| 5000円〜 | 🐉 ドラゴン | 伝説の存在です！ |

## 🧪 テスト機能

音声認識がうまく動かない場合は、テストボタンで動作確認できます：
- 🧪 100円テスト
- 🧪 50円使うテスト  
- 🧪 質問テスト

## 🛠️ 技術スタック

### フロントエンド
- **React 19** + **TypeScript**: モダンなUI開発
- **Framer Motion**: 滑らかなアニメーション
- **Web Speech API**: ブラウザ音声認識
- **CSS3**: レスポンシブデザイン

### バックエンド
- **Express.js**: プロキシサーバー
- **OpenAI TTS API**: 高品質音声合成
- **Node.js 18+**: サーバーサイド実行

### インフラ・デプロイ
- **Render**: 本番環境ホスティング
- **GitHub**: ソースコード管理
- **LocalStorage**: クライアントサイドデータ永続化

### 音声技術
| 機能 | 技術 | 特徴 |
|------|------|------|
| 音声認識 | Web Speech API | ブラウザネイティブ |
| 音声合成 | OpenAI TTS (nova) | 自然で可愛い女性の声 |
| フォールバック | SpeechSynthesis API | ブラウザ標準音声 |

## 📁 プロジェクト構造

```
src/
├── components/
│   └── AnimalCharacter.tsx    # 動物キャラクターコンポーネント
├── utils/
│   ├── evolutionSystem.ts     # 進化システム
│   ├── speechUtils.ts         # 音声認識
│   └── openaiSpeech.ts        # OpenAI音声合成
├── App.tsx                    # メインアプリ
└── App.css                    # スタイル
```

## 🐛 トラブルシューティング

### 音声認識が動かない
- ブラウザでマイクのアクセス許可を確認
- HTTPSまたはlocalhostで実行されているか確認

### 音声が出ない
- ブラウザで音声の自動再生が許可されているか確認
- 開発者ツール（F12）のコンソールでエラーを確認

### OpenAI音声が使えない
- `.env`ファイルにAPIキーが正しく設定されているか確認
- APIキーの残高を確認
- 自動的にブラウザ音声にフォールバックされます

## 🚀 Renderへのデプロイ

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### 簡単3ステップでデプロイ

1. **Renderアカウント作成**: [render.com](https://render.com)
2. **GitHubリポジトリ接続**: `niikun/pocket_money_saver`
3. **環境変数設定**: 
   - `OPENAI_API_KEY`: あなたのOpenAI APIキー
   - `VOICE_NAME`: `nova`
   - `ROOT_DIRECTORY`: `voice-piggy-bank`

詳細は [DEPLOY.md](./DEPLOY.md) をご覧ください。

## 💰 料金情報

### 開発・テスト
- **完全無料**: ブラウザ標準音声使用時

### 本番運用（OpenAI音声使用時）
- **Render**: 無料プラン（750時間/月）
- **OpenAI TTS**: $15.00 / 1M文字（月数十円程度）

## 🌟 今後の拡張予定

- [ ] 🎯 目標貯金額設定機能
- [ ] 📊 貯金履歴グラフ・統計
- [ ] 🎨 複数のキャラクター選択
- [ ] 👨‍👩‍👧‍👦 親向け管理画面
- [ ] 🗣️ 音声コマンドの拡張
- [ ] 🏆 貯金チャレンジ機能
- [ ] 📱 PWA対応（アプリ化）
- [ ] 🌍 多言語対応

## 🤝 コントリビューション

プルリクエストやIssueを歓迎します！

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - [LICENSE](./LICENSE) ファイルを参照

## 📞 サポート・お問い合わせ

- 🐛 **バグ報告**: [GitHub Issues](https://github.com/niikun/pocket_money_saver/issues)
- 💡 **機能リクエスト**: [GitHub Discussions](https://github.com/niikun/pocket_money_saver/discussions)
- 📧 **その他**: README内の情報をご参照ください

---

## 🎉 最後に

**音声貯金箱**で、お子様の金融リテラシーを楽しく育みましょう！

貯金が楽しくなる魔法のアプリで、素敵な貯金体験をお楽しみください！🐷✨

[![GitHub Stars](https://img.shields.io/github/stars/niikun/pocket_money_saver?style=social&label=Star)](https://github.com/niikun/pocket_money_saver)
[![Tweet](https://img.shields.io/twitter/url?style=social&url=https%3A//github.com/niikun/pocket_money_saver)](https://twitter.com/intent/tweet?text=🐷音声貯金箱アプリ%20-%20子供が楽しく貯金を学べる！&url=https://github.com/niikun/pocket_money_saver)