import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useToastContext } from '../contexts/ToastContext';

import { ApiType } from '../types/tts';
import { VOICE_TYPES_DATA } from '../constants/voiceTypes';
import { EMOTION_OPTIONS, MINIMAX_EMOTION_OPTIONS } from '../types/tts';

const Playground: React.FC = () => {
  const [text, setText] = useState<string>('救命啊救命啊');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string>('happy');
  const [enableEmotion, setEnableEmotion] = useState<boolean>(true);
  const [apiType, setApiType] = useState<ApiType>('minimax');
  const [voiceType, setVoiceType] = useState<string>('male-qn-qingse');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { showToast } = useToastContext();

  // Memoize voice types for performance
  const voiceTypes = useMemo(() => VOICE_TYPES_DATA, []);

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Update voice type when API type changes
  useEffect(() => {
    const currentVoiceTypes = voiceTypes[apiType];
    const firstCategory = Object.keys(currentVoiceTypes)[0];
    const firstVoice = currentVoiceTypes[firstCategory][0];
    setVoiceType(firstVoice.value);
  }, [apiType, voiceTypes]);

  const testTTSAPI = async () => {
    if (!text.trim()) {
      showToast('请输入要转换的文本', 'warning');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare request body based on API type
      const requestBody: any = {
        text: text,
        api_type: apiType,
        voice_type: voiceType
      };

      // Only add doubao_audio_extra_config for doubao API
      if (apiType === 'doubao') {
        requestBody.doubao_audio_extra_config = {
          emotion: emotion,
          enable_emotion: enableEmotion
        };
      }

      // Only add minimax_extra_config for minimax API
      if (apiType === 'minimax') {
        requestBody.minimax_extra_config = {
          voice_setting: {
            emotion: emotion
          }
        };
      }

      const response = await fetch('https://api.zzcreation.com/web/custom_tts', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.REACT_APP_API_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !(contentType.includes('audio/mpeg') || contentType.includes('audio/wav'))) {
        throw new Error('响应不是音频格式');
      }

      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);
      
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(newAudioUrl);
      showToast('音频生成成功！', 'success');
      
      // Auto play the audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.warn('Auto-play failed:', err);
            showToast('音频已生成，请手动播放', 'info');
          });
        }
      }, 100);
      
    } catch (error: any) {
      console.error('TTS API Error:', error);
      showToast(`TTS API 调用失败: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('音频下载开始', 'success');
    }
  };

  return (
    <div className="playground-container">
      <div className="playground-content">
        <h1>API Playground</h1>
        
        <div className="tts-tester">
          <h2>TTS API 测试器</h2>
          
          <div className="form-group">
            <label htmlFor="api-type-select">API 类型:</label>
            <div className="api-type-selector">
              <button
                type="button"
                className={`api-type-button ${apiType === 'doubao' ? 'active' : ''}`}
                onClick={() => setApiType('doubao')}
              >
                豆包 API
              </button>
              <button
                type="button"
                className={`api-type-button ${apiType === 'azure' ? 'active' : ''}`}
                onClick={() => setApiType('azure')}
              >
                Azure API
              </button>
              <button
                type="button"
                className={`api-type-button ${apiType === 'minimax' ? 'active' : ''}`}
                onClick={() => setApiType('minimax')}
              >
                Minimax API
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="text-input">输入文本:</label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入要转换为语音的文本..."
              rows={4}
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="voice-type-select">音色类型:</label>
            <select
              id="voice-type-select"
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
              className="voice-type-select"
            >
              {Object.entries(voiceTypes[apiType]).map(([category, voices]) => (
                <optgroup key={category} label={category}>
                  {voices.map((voice) => (
                    <option key={voice.value} value={voice.value}>
                      {voice.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {(apiType === 'doubao' || apiType === 'minimax') && (
            <>
              <div className="form-group">
                <label htmlFor="emotion-select">情感类型:</label>
                <select
                  id="emotion-select"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  className="emotion-select"
                >
                  {(apiType === 'minimax' ? MINIMAX_EMOTION_OPTIONS : EMOTION_OPTIONS).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {apiType === 'doubao' && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={enableEmotion}
                      onChange={(e) => setEnableEmotion(e.target.checked)}
                    />
                    启用情感
                  </label>
                </div>
              )}
            </>
          )}

          <button
            onClick={testTTSAPI}
            disabled={isLoading}
            className="test-button"
          >
            {isLoading ? '生成中...' : '生成语音'}
          </button>

          {audioUrl && (
            <div className="audio-section">
              <h3>生成的音频:</h3>
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="audio-player"
              >
                您的浏览器不支持音频播放。
              </audio>
              <button
                onClick={downloadAudio}
                className="download-button"
              >
                下载音频
              </button>
            </div>
          )}
        </div>

        <div className="api-info">
          <h3>API 信息</h3>
          <div className="api-details">
            <p><strong>端点:</strong> https://api.zzcreation.com/web/custom_tts</p>
            <p><strong>方法:</strong> POST</p>
            <p><strong>支持的 API 类型:</strong> 豆包 (doubao) / Azure / Minimax</p>
            <p><strong>响应类型:</strong> audio/mpeg</p>
            <p><strong>特殊功能:</strong> 豆包 API 支持情感控制，Azure API 提供多种方言版本，Minimax API 支持丰富的音色和情感控制</p>
          </div>
        </div>
      </div>


      
      <style>{`
        .playground-container {
          height: 100vh;
          overflow-y: auto;
          padding: 20px;
        }
        
        .playground-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .tts-tester {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .api-type-selector {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }
        
        .api-type-button {
          flex: 1;
          padding: 10px 20px;
          border: 2px solid #007bff;
          background: white;
          color: #007bff;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .api-type-button:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
        }
        
        .api-type-button.active {
          background: #007bff;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
        }
        
        .text-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          resize: vertical;
        }
        
        .emotion-select,
        .voice-type-select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .test-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .test-button:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .test-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .audio-section {
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        
        .audio-player {
          width: 100%;
          margin: 10px 0;
        }
        
        .download-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 10px;
        }
        
        .download-button:hover {
          background: #218838;
        }
        
        .api-info {
          background: #e9ecef;
          padding: 15px;
          border-radius: 8px;
        }
        
        .api-details p {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default Playground;