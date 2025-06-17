# OpenAI可愛い音声設定ガイド 🎵

## 1. OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウント作成/ログイン
3. API Keys画面で「Create new secret key」をクリック
4. キーをコピー（一度だけ表示されます）

## 2. 環境変数の設定

`.env`ファイルを編集して、APIキーを設定：

```bash
# .envファイル
REACT_APP_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxx
REACT_APP_VOICE_MODEL=tts-1
REACT_APP_VOICE_NAME=nova
```

## 3. 利用可能な音声

OpenAI Text-to-Speechでは以下の音声が使用できます：

### 女性の声（推奨）
- **nova** 🌟 - 若い女性、温かく魅力的（デフォルト）
- **shimmer** ✨ - 優しく穏やかな女性の声

### 男性の声
- **onyx** - 深みのある男性の声
- **echo** - 男性的でクリアな声

### その他
- **alloy** - バランスの取れた中性的な声
- **fable** - 表現力豊かな声

## 4. 音声の変更方法

`.env`ファイルの`REACT_APP_VOICE_NAME`を変更：

```bash
# 例：shimmerに変更
REACT_APP_VOICE_NAME=shimmer
```

## 5. 料金について

- TTS-1モデル: $15.00 / 1M文字
- 子供の貯金箱アプリでは1ヶ月数十円程度の使用料

## 6. トラブルシューティング

### APIキーが認識されない
- `.env`ファイルがプロジェクトルートにあることを確認
- `npm start`でサーバーを再起動

### 音声が再生されない
- ブラウザで音声の自動再生が許可されているか確認
- コンソール（F12）でエラーメッセージを確認

### フォールバック機能
APIキーが設定されていない場合、自動的にブラウザの標準音声合成にフォールバックされます。

## 7. 使用例

設定完了後、アプリで：
1. 「100円貯金した」と話しかける
2. 可愛いnovaの声で「わあ！100円も貯金してくれたの！えらいね！」と返答

楽しい音声貯金箱体験をお楽しみください！🎉