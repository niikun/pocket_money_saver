import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import AnimalCharacter from './components/AnimalCharacter';
import { getCurrentStage, getNextStage, getProgressToNextStage, calculateHappiness } from './utils/evolutionSystem';
import { SpeechRecognitionService, parseVoiceCommand, VoiceCommand } from './utils/speechUtils';
import { HybridSpeechService } from './utils/openaiSpeech';

interface Transaction {
  id: string;
  type: 'savings' | 'spending';
  amount: number;
  reason: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastInteraction, setLastInteraction] = useState<Date>(new Date());
  const [speechRecognition] = useState(() => new SpeechRecognitionService());
  const [speechSynthesis] = useState(() => new HybridSpeechService());
  const [statusMessage, setStatusMessage] = useState<string>('こんにちは！音声で話しかけてね！');

  // 現在のステージとハピネスを計算
  const currentStage = getCurrentStage(totalSavings);
  const nextStage = getNextStage(currentStage);
  const progress = getProgressToNextStage(totalSavings, currentStage);
  const recentActivity = transactions
    .filter(t => Date.now() - t.timestamp.getTime() < 24 * 60 * 60 * 1000)
    .reduce((sum, t) => sum + (t.type === 'savings' ? t.amount : -t.amount), 0);
  const happiness = calculateHappiness(totalSavings, recentActivity, Date.now() - lastInteraction.getTime());

  // データの永続化
  useEffect(() => {
    const savedData = localStorage.getItem('piggyBankData');
    if (savedData) {
      const { totalSavings: saved, transactions: savedTransactions, lastInteraction: savedLastInteraction } = JSON.parse(savedData);
      setTotalSavings(saved || 0);
      setTransactions(savedTransactions?.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) })) || []);
      setLastInteraction(new Date(savedLastInteraction || Date.now()));
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      totalSavings,
      transactions,
      lastInteraction
    };
    localStorage.setItem('piggyBankData', JSON.stringify(dataToSave));
  }, [totalSavings, transactions, lastInteraction]);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    setStatusMessage(text);
    
    await speechSynthesis.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (error) => {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setStatusMessage('音声で話すことができませんでした');
      }
    );
  }, [speechSynthesis]);

  const handleVoiceCommand = useCallback((command: VoiceCommand) => {
    console.log('handleVoiceCommand 実行:', command);
    setLastInteraction(new Date());
    
    if (command.action === 'savings' && command.amount && command.amount > 0) {
      console.log('貯金処理を開始:', command.amount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'savings',
        amount: command.amount,
        reason: command.reason,
        timestamp: new Date()
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      setTotalSavings(prev => prev + command.amount!);
      
      const messages = [
        `わあ！${command.amount}円も貯金してくれたの！えらいね！`,
        `${command.amount}円の貯金、ありがとう！とても嬉しいよ！`,
        `すごい！${command.amount}円も貯められたんだね！`
      ];
      
      speak(messages[Math.floor(Math.random() * messages.length)]);
      
    } else if (command.action === 'spending' && command.amount && command.amount > 0) {
      if (command.amount > totalSavings) {
        speak('あれ？お金が足りないみたい。もう少し貯金してからにしようね！');
        return;
      }
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'spending',
        amount: command.amount,
        reason: command.reason,
        timestamp: new Date()
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      setTotalSavings(prev => prev - command.amount!);
      
      const messages = [
        `${command.amount}円を${command.reason}に使ったのね。楽しかった？`,
        `${command.reason}に${command.amount}円かあ。大切に使えてえらいね！`,
        `${command.amount}円、${command.reason}のために使ったんだね！`
      ];
      
      speak(messages[Math.floor(Math.random() * messages.length)]);
      
    } else if (command.action === 'question') {
      const responses = [
        `今、${totalSavings}円貯まってるよ！次は${nextStage?.name}になれるかも！`,
        `きみの貯金箱には${totalSavings}円入ってるよ！すごいでしょ？`,
        `今日も貯金がんばってる？今は${totalSavings}円だよ！`
      ];
      
      speak(responses[Math.floor(Math.random() * responses.length)]);
      
    } else {
      speak('ごめんね、よく聞こえなかった。もう一度言ってくれる？');
    }
  }, [totalSavings, nextStage, speak]);

  const startListening = useCallback(() => {
    if (!speechRecognition.isSupported()) {
      setStatusMessage('音声認識がサポートされていません');
      return;
    }

    speechRecognition.startListening(
      (transcript) => {
        setStatusMessage(`聞こえました: "${transcript}"`);
        const command = parseVoiceCommand(transcript);
        console.log('音声認識結果:', transcript);
        console.log('解析されたコマンド:', command);
        handleVoiceCommand(command);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setStatusMessage('音声が聞き取れませんでした。もう一度試してください。');
        setIsListening(false);
      },
      () => {
        setIsListening(true);
        setStatusMessage('聞いています...何か話してね！');
      },
      () => {
        setIsListening(false);
        setStatusMessage('音声を待っています。ボタンを押して話しかけてね！');
      }
    );
  }, [speechRecognition, handleVoiceCommand]);

  const stopListening = useCallback(() => {
    speechRecognition.stopListening();
    setIsListening(false);
  }, [speechRecognition]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>音声貯金箱</h1>
        <p>かわいい動物と一緒にお金を貯めよう！</p>
      </header>

      <main className="app-main">
        <AnimalCharacter 
          currentStage={currentStage}
          isListening={isListening}
          isSpeaking={isSpeaking}
          happiness={happiness}
        />

        <div className="savings-info">
          <div className="savings-display">
            <h2>貯金額: {totalSavings}円</h2>
            {nextStage && (
              <div className="evolution-progress">
                <p>次の進化まで: {nextStage.minSavings - totalSavings}円</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="next-stage">次: {nextStage.name} {nextStage.emoji}</p>
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          <button 
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
          >
            {isListening ? '🔊 聞いています...' : '🎤 話しかける'}
          </button>

          {/* 音声API情報表示 */}
          <div style={{ margin: '15px 0', padding: '10px', background: 'rgba(255,255,255,0.7)', borderRadius: '10px', fontSize: '14px' }}>
            <div>
              🎵 音声: {process.env.REACT_APP_OPENAI_API_KEY ? 
                `OpenAI (${process.env.REACT_APP_VOICE_NAME || 'nova'} - 可愛い女性の声)` : 
                'ブラウザ標準音声 (OpenAI APIキーを設定すると可愛い声になります)'
              }
            </div>
            {!process.env.REACT_APP_OPENAI_API_KEY && (
              <div style={{ color: '#666', marginTop: '5px' }}>
                .envファイルにREACT_APP_OPENAI_API_KEYを設定してください
              </div>
            )}
          </div>
          
          <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => handleVoiceCommand(parseVoiceCommand('100円たまった'))}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', background: 'white' }}
            >
              🧪 100円テスト
            </button>
            <button 
              onClick={() => handleVoiceCommand(parseVoiceCommand('50円お菓子に使った'))}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', background: 'white' }}
            >
              🧪 50円使うテスト
            </button>
            <button 
              onClick={() => handleVoiceCommand(parseVoiceCommand('いくら貯まった？'))}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', background: 'white' }}
            >
              🧪 質問テスト
            </button>
          </div>
          
          <div className="status-message">
            {statusMessage}
          </div>
        </div>

        <div className="recent-transactions">
          <h3>最近の記録</h3>
          <div className="transaction-list">
            {transactions.slice(-5).reverse().map(transaction => (
              <div key={transaction.id} className={`transaction ${transaction.type}`}>
                <span className="transaction-type">
                  {transaction.type === 'savings' ? '💰' : '💸'}
                </span>
                <span className="transaction-amount">
                  {transaction.type === 'savings' ? '+' : '-'}{transaction.amount}円
                </span>
                <span className="transaction-reason">
                  {transaction.reason}
                </span>
                <span className="transaction-time">
                  {transaction.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="no-transactions">まだ記録がありません</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
