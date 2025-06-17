// 音声認識のユーティリティ
export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'ja-JP';
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  startListening(
    onResult: (text: string) => void,
    onError: (error: string) => void,
    onStart: () => void,
    onEnd: () => void
  ): void {
    if (!this.recognition || this.isListening) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      onStart();
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(`音声認識エラー: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError('音声認識を開始できませんでした');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
}

// 音声合成のユーティリティ
export class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    if (this.voices.length === 0) {
      // 音声が読み込まれるまで待機
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): void {
    if (!this.isSupported()) {
      onError?.('音声合成がサポートされていません');
      return;
    }

    // 既存の音声を停止
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 日本語の音声を選択
    const japaneseVoice = this.voices.find(voice => 
      voice.lang.includes('ja') || voice.name.includes('Japanese')
    );
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }

    utterance.rate = 0.9; // 少しゆっくり
    utterance.pitch = 1.1; // 少し高め（子供向け）
    utterance.volume = 0.8;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (event) => {
      onError?.(`音声合成エラー: ${event.error}`);
    };

    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth.cancel();
  }
}

// 音声コマンドを解析する関数
export interface VoiceCommand {
  action: 'savings' | 'spending' | 'question' | null;
  amount: number | null;
  reason: string;
  originalText: string;
}

export const parseVoiceCommand = (text: string): VoiceCommand => {
  const normalizedText = text.toLowerCase();
  
  // 金額の抽出
  const moneyPatterns = [
    /(\d+)\s*円/,
    /(\d+)\s*えん/,
    /(\d+)\s*エン/,
  ];
  
  let amount: number | null = null;
  for (const pattern of moneyPatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      amount = parseInt(match[1]);
      break;
    }
  }

  // アクションの判定
  let action: 'savings' | 'spending' | 'question' | null = null;
  let reason = '';

  if (normalizedText.includes('貯金') || normalizedText.includes('ためる') || normalizedText.includes('ためた') || 
      normalizedText.includes('たまった') || normalizedText.includes('もらった') || normalizedText.includes('入れた') ||
      normalizedText.includes('はいった') || normalizedText.includes('増えた') || normalizedText.includes('もらう')) {
    action = 'savings';
    reason = '貯金';
  } else if (normalizedText.includes('使っ') || normalizedText.includes('買っ') || normalizedText.includes('支出')) {
    action = 'spending';
    
    // 支出の理由を特定
    const spendingReasons = [
      { keywords: ['お菓子', 'おかし', 'スナック'], category: 'お菓子' },
      { keywords: ['ゲーム'], category: 'ゲーム' },
      { keywords: ['本', 'ほん'], category: '本' },
      { keywords: ['おもちゃ'], category: 'おもちゃ' },
      { keywords: ['食べ物', 'たべもの', '食事'], category: '食べ物' },
      { keywords: ['文房具', 'ぶんぼうぐ'], category: '文房具' },
    ];

    for (const { keywords, category } of spendingReasons) {
      if (keywords.some(keyword => normalizedText.includes(keyword))) {
        reason = category;
        break;
      }
    }

    if (!reason) {
      reason = '支出';
    }
  } else {
    action = 'question';
    reason = '質問';
  }

  return {
    action,
    amount,
    reason,
    originalText: text
  };
};