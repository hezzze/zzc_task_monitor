// TTS API related types and interfaces

export type ApiType = 'doubao' | 'azure' | 'minimax';

export interface VoiceOption {
  value: string;
  label: string;
}

export interface VoiceTypes {
  [category: string]: VoiceOption[];
}

export interface TTSRequestBody {
  text: string;
  api_type: ApiType;
  voice_type: string;
  doubao_audio_extra_config?: {
    emotion: string;
    enable_emotion: boolean;
  };
  minimax_extra_config?: {
    voice_setting: {
      emotion: string;
    };
  };
}

export interface EmotionOption {
  value: string;
  label: string;
}

export const EMOTION_OPTIONS: EmotionOption[] = [
  { value: 'happy', label: '开心' },
  { value: 'sad', label: '悲伤' },
  { value: 'angry', label: '愤怒' },
  { value: 'surprised', label: '惊讶' },
  { value: 'fear', label: '恐惧' },
  { value: 'hate', label: '憎恶' },
  { value: 'excited', label: '兴奋' },
  { value: 'coldness', label: '冷漠' },
  { value: 'neutral', label: '中立' },
];

// Minimax specific emotion options
export const MINIMAX_EMOTION_OPTIONS: EmotionOption[] = [
  { value: 'happy', label: '高兴' },
  { value: 'sad', label: '悲伤' },
  { value: 'angry', label: '愤怒' },
  { value: 'fearful', label: '害怕' },
  { value: 'disgusted', label: '厌恶' },
  { value: 'surprised', label: '惊讶' },
  { value: 'calm', label: '中性' },
];

export const API_CONFIG = {
  endpoint: 'https://api.zzcreation.com/web/custom_tts',
  apiKey: 'zzc-test',
  referer: 'http://localhost:8000/',
  contentType: 'application/json',
  expectedResponseType: 'audio/mpeg',
} as const;