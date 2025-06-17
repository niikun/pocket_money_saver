// OpenAI音声合成サービス
export class OpenAISpeechService {
  private apiKey: string;
  private model: string;
  private voice: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.model = process.env.REACT_APP_VOICE_MODEL || 'tts-1';
    this.voice = process.env.REACT_APP_VOICE_NAME || 'nova';
  }

  isSupported(): boolean {
    return this.apiKey.length > 0;
  }

  async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('OpenAI Speech Service - speak() called with:', { text, apiKey: this.apiKey ? '設定済み' : '未設定' });
    
    if (!this.isSupported()) {
      console.log('OpenAI API not supported, API key missing');
      onError?.('OpenAI APIキーが設定されていません');
      return;
    }

    try {
      console.log('OpenAI API呼び出し開始...');
      onStart?.();

      // プロキシサーバー経由でOpenAI APIを呼び出し
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: this.voice,
          model: this.model
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API Error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      console.log('OpenAI API成功、音声データ取得中...');
      const audioBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedAudio = await audioContext.decodeAudioData(audioBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        onEnd?.();
      };
      
      source.start(0);

    } catch (error) {
      console.error('OpenAI speech error:', error);
      onError?.(`音声生成エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  stop(): void {
    // OpenAI APIの場合、再生中の音声を停止するのは複雑なので、
    // ブラウザの音声停止機能にフォールバック
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.close();
    } catch (error) {
      console.log('Audio context close failed:', error);
    }
  }
}

// フォールバック用の音声サービス（OpenAI APIが使えない場合）
export class HybridSpeechService {
  private openaiService: OpenAISpeechService;
  private browserService: SpeechSynthesisService;

  constructor() {
    this.openaiService = new OpenAISpeechService();
    this.browserService = new SpeechSynthesisService();
  }

  isSupported(): boolean {
    return this.openaiService.isSupported() || this.browserService.isSupported();
  }

  async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('HybridSpeechService - 音声サービス選択中...');
    console.log('OpenAI API利用可能:', this.openaiService.isSupported());
    
    if (this.openaiService.isSupported()) {
      // OpenAI APIを優先使用
      console.log('OpenAI APIを使用して音声生成します');
      try {
        await this.openaiService.speak(text, onStart, onEnd, onError);
      } catch (error) {
        console.error('OpenAI APIでエラー、ブラウザ音声にフォールバック:', error);
        this.browserService.speak(text, onStart, onEnd, onError);
      }
    } else {
      // フォールバックとしてブラウザの音声合成を使用
      console.log('OpenAI APIが使用できないため、ブラウザ音声合成を使用します');
      this.browserService.speak(text, onStart, onEnd, onError);
    }
  }

  stop(): void {
    this.openaiService.stop();
    this.browserService.stop();
  }
}

// ブラウザの音声合成サービス（既存のコードから移動）
class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
        console.log('利用可能な音声:', this.voices.map(v => `${v.name} (${v.lang})`));
      };
    } else {
      console.log('利用可能な音声:', this.voices.map(v => `${v.name} (${v.lang})`));
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

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // より良い日本語音声を選択
    const japaneseVoices = this.voices.filter(voice => 
      voice.lang.includes('ja') || voice.name.includes('Japanese') || 
      voice.name.includes('Kyoko') || voice.name.includes('Otoya') || voice.name.includes('Samantha')
    );
    
    console.log('日本語音声候補:', japaneseVoices.map(v => `${v.name} (${v.lang})`));
    
    // 優先順位で音声を選択
    let selectedVoice = null;
    const priorities = [
      'Kyoko',      // macOS日本語女性音声
      'Otoya',      // macOS日本語男性音声  
      'Samantha',   // 英語だが自然な女性音声
      'Google 日本語', // Google Chrome日本語
      'Microsoft Ayumi', // Windows日本語女性
      'Microsoft Haruka', // Windows日本語女性
    ];
    
    for (const priority of priorities) {
      selectedVoice = japaneseVoices.find(voice => voice.name.includes(priority));
      if (selectedVoice) break;
    }
    
    // フォールバック: 任意の日本語音声
    if (!selectedVoice && japaneseVoices.length > 0) {
      selectedVoice = japaneseVoices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('選択された音声:', selectedVoice.name);
    } else {
      console.log('日本語音声が見つかりません、デフォルト音声を使用');
    }

    // 女性らしい声に調整
    utterance.rate = 0.85;  // 少しゆっくり
    utterance.pitch = 1.3;  // 高めのピッチで可愛らしく
    utterance.volume = 0.9;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (event) => onError?.(`音声合成エラー: ${event.error}`);

    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth.cancel();
  }
}