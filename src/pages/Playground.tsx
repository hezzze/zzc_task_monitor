import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import ToastNotifications from '../components/ToastNotifications';

const Playground: React.FC = () => {
  const [text, setText] = useState<string>('救命啊救命啊');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string>('happy');
  const [enableEmotion, setEnableEmotion] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toasts, showToast } = useToast();

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const testTTSAPI = async () => {
    if (!text.trim()) {
      showToast('请输入要转换的文本', 'warning');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.zzcreation.com/web/custom_tts', {
        method: 'POST',
        headers: {
          'x-api-key': 'zzc-test',
          'referer': 'http://localhost:8000/',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          api_type: 'doubao',
          double_audio_extra_config: {
            emotion: emotion,
            enable_emotion: enableEmotion
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('audio/mpeg')) {
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
    <div className="container">
      <div className="playground-content">
        <h1>API Playground</h1>
        
        <div className="tts-tester">
          <h2>TTS API 测试器</h2>
          
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
            <label htmlFor="emotion-select">情感类型:</label>
            <select
              id="emotion-select"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="emotion-select"
            >
              <option value="happy">开心</option>
              <option value="sad">悲伤</option>
              <option value="angry">愤怒</option>
              <option value="surprised">惊讶</option>
              <option value="fear">恐惧</option>
              <option value="hate">憎恶</option>
              <option value="excited">兴奋</option>
              <option value="coldness">冷漠</option>
              <option value="neutral">中立</option>
            </select>
          </div>

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
            <p><strong>API Key:</strong> zzc-test</p>
            <p><strong>响应类型:</strong> audio/mpeg</p>
          </div>
        </div>
      </div>

      <ToastNotifications toasts={toasts} />
      
      <style>{`
        .playground-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
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
        
        .text-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          resize: vertical;
        }
        
        .emotion-select {
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