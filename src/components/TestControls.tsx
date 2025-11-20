import React, { useState, useCallback } from 'react';
import { useTaskManagerContext } from '../contexts/TaskManagerContext';
import { useToastContext } from '../contexts/ToastContext';
import { SortOptions } from '../types';

interface TestControlsProps {
  schedulerUrl: string;
  isConnected: boolean;
  loadExistingTasks: (sortOptions: SortOptions) => Promise<void>;
  sortOptions: SortOptions;
}

const TestControls: React.FC<TestControlsProps> = ({
  schedulerUrl,
  isConnected,
  loadExistingTasks,
  sortOptions
}) => {
  // Internal state management
  const [testMode, setTestMode] = useState<'image' | 'video' | 'infinite_talk'>('image');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(5);
  const [useRandomPrompts, setUseRandomPrompts] = useState<boolean>(true);
  const [batchProgress, setBatchProgress] = useState<string>('');
  const [isSingleTestRunning, setIsSingleTestRunning] = useState<boolean>(false);
  const [isBatchTestRunning, setIsBatchTestRunning] = useState<boolean>(false);
  const [isT2ITestRunning, setIsT2ITestRunning] = useState<boolean>(false);

  const [videoImageFile, setVideoImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isVaceControlVideoTestRunning, setIsVaceControlVideoTestRunning] = useState<boolean>(false);

  // Text-to-video state
  const [t2vPrompt, setT2vPrompt] = useState<string>('');
  const [isT2VTestRunning, setIsT2VTestRunning] = useState<boolean>(false);

  // Image-to-video state
  const [i2vImageFile, setI2vImageFile] = useState<File | null>(null);
  const [i2vImagePreviewUrl, setI2vImagePreviewUrl] = useState<string | null>(null);
  const [isI2VTestRunning, setIsI2VTestRunning] = useState<boolean>(false);

  // Infinite talk state
  const [talkImageFile, setTalkImageFile] = useState<File | null>(null);
  const [talkImagePreviewUrl, setTalkImagePreviewUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isSingleTalkTestRunning, setIsSingleTalkTestRunning] = useState<boolean>(false);

  // Faceswap state
  const [faceswapImageFile, setFaceswapImageFile] = useState<File | null>(null);
  const [faceswapImagePreviewUrl, setFaceswapImagePreviewUrl] = useState<string | null>(null);
  const [faceswapVideoFileKey, setFaceswapVideoFileKey] = useState<string>('peterparker.mp4');
  const [isFaceSwapTestRunning, setIsFaceSwapTestRunning] = useState<boolean>(false);

  // Custom hooks
  const { showToast } = useToastContext();
  const { getRandomPrompt, createWorkflow, submitTask, submitVaceControlVideoTask, submitInfiniteTalkTask, submitT2ITask, submitT2VTask, submitI2VTask, submitFaceSwapTask, monitorTask } = useTaskManagerContext();

  // Run single test
  const runSingleTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    setIsSingleTestRunning(true);
    
    try {
      const prompt = customPrompt.trim() || getRandomPrompt();
      const workflow = await createWorkflow(prompt);
      const task = await submitTask(workflow, schedulerUrl);
      
      showToast(`Task submitted: ${task.id}`, 'success');
      monitorTask(task.id, prompt, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit task: ${error.message}`, 'error');
    } finally {
      setIsSingleTestRunning(false);
    }
  }, [isConnected, customPrompt, getRandomPrompt, createWorkflow, submitTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);

  // Run batch test
  const runBatchTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    setIsBatchTestRunning(true);
    setBatchProgress('');
    
    try {
      const tasks = [];
      
      for (let i = 0; i < batchSize; i++) {
        const prompt = useRandomPrompts ? getRandomPrompt() : (customPrompt.trim() || getRandomPrompt());
        const workflow = await createWorkflow(prompt);
        const task = await submitTask(workflow, schedulerUrl);
        tasks.push({ id: task.id, prompt });
        
        setBatchProgress(`Submitted ${i + 1}/${batchSize} tasks`);
        showToast(`Batch task ${i + 1}/${batchSize} submitted: ${task.id}`, 'info');
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Monitor all tasks
      tasks.forEach(({ id, prompt }) => {
        monitorTask(id, prompt, schedulerUrl);
      });
      
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
      
      setBatchProgress(`All ${batchSize} tasks submitted and monitoring started`);
      showToast(`Batch test completed: ${batchSize} tasks submitted`, 'success');
    } catch (error: any) {
      showToast(`Batch test failed: ${error.message}`, 'error');
    } finally {
      setIsBatchTestRunning(false);
    }
  }, [isConnected, batchSize, useRandomPrompts, customPrompt, getRandomPrompt, createWorkflow, submitTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);

    // Run single text-to-image test
  const runSingleT2ITest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    const prompt = customPrompt.trim() || getRandomPrompt();
    if (!prompt) {
      showToast('Please provide a prompt for text-to-image generation', 'warning');
      return;
    }
    
    setIsT2ITestRunning(true);
    
    try {
      const task = await submitT2ITask(prompt);
      
      showToast(`Text-to-image task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `T2I: ${prompt}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit text-to-image task: ${error.message}`, 'error');
    } finally {
      setIsT2ITestRunning(false);
    }
  }, [isConnected, customPrompt, getRandomPrompt, submitT2ITask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);


  // Handle image file upload
  const handleImageFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoImageFile(null);
      setImagePreviewUrl(null);
    }
  }, []);

  // Handle video file upload
  const handleVideoFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      
      // Create preview URL for video
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    } else {
      setVideoFile(null);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setVideoPreviewUrl(null);
    }
  }, [videoPreviewUrl]);

  // Run single video test
  const runVaceControlVideoTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    if (!videoImageFile || !videoFile) {
      showToast('Please provide both image and video files', 'warning');
      return;
    }
    
    setIsVaceControlVideoTestRunning(true);
    
    try {
      const task = await submitVaceControlVideoTask(videoImageFile, videoFile);
      
      showToast(`Video task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `Video: ${videoImageFile.name} + ${videoFile.name}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit video task: ${error.message}`, 'error');
    } finally {
      setIsVaceControlVideoTestRunning(false);
    }
  }, [isConnected, videoImageFile, videoFile, submitVaceControlVideoTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);

  // Handle talk image file upload
  const handleTalkImageFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTalkImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setTalkImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setTalkImageFile(null);
      setTalkImagePreviewUrl(null);
    }
  }, []);

  // Handle audio file upload
  const handleAudioFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      
      // Create preview URL for audio
      const url = URL.createObjectURL(file);
      setAudioPreviewUrl(url);
    } else {
      setAudioFile(null);
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      setAudioPreviewUrl(null);
    }
  }, [audioPreviewUrl]);

  // Run single infinite talk test
  const runSingleTalkTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    if (!talkImageFile || !audioFile) {
      showToast('Please provide both image and audio files', 'warning');
      return;
    }
    
    setIsSingleTalkTestRunning(true);
    
    try {
      const task = await submitInfiniteTalkTask(talkImageFile, audioFile);
      
      showToast(`Infinite talk task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `Infinite Talk: ${talkImageFile.name} + ${audioFile.name}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit infinite talk task: ${error.message}`, 'error');
    } finally {
      setIsSingleTalkTestRunning(false);
    }
  }, [isConnected, talkImageFile, audioFile, submitInfiniteTalkTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);

  // Run single text-to-video test
  const runSingleT2VTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    const prompt = t2vPrompt.trim() || getRandomPrompt();
    if (!prompt) {
      showToast('Please provide a prompt for text-to-video generation', 'warning');
      return;
    }
    
    setIsT2VTestRunning(true);
    
    try {
      const task = await submitT2VTask(prompt, schedulerUrl);
      
      showToast(`Text-to-video task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `T2V: ${prompt}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit text-to-video task: ${error.message}`, 'error');
    } finally {
      setIsT2VTestRunning(false);
    }
  }, [isConnected, t2vPrompt, getRandomPrompt, submitT2VTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);

  // Handle i2v image file upload
  const handleI2vImageFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setI2vImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setI2vImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setI2vImageFile(null);
      setI2vImagePreviewUrl(null);
    }
  }, []);

  // Handle faceswap image file upload
  const handleFaceswapImageFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFaceswapImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaceswapImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFaceswapImageFile(null);
      setFaceswapImagePreviewUrl(null);
    }
  }, []);

  // Run single image-to-video test
  const runSingleI2VTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    if (!i2vImageFile) {
      showToast('Please provide an image file', 'warning');
      return;
    }
    
    setIsI2VTestRunning(true);
    
    try {
      const task = await submitI2VTask(i2vImageFile, schedulerUrl);
      
      showToast(`Image-to-video task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `I2V: ${i2vImageFile.name}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit image-to-video task: ${error.message}`, 'error');
    } finally {
      setIsI2VTestRunning(false);
    }
  }, [isConnected, i2vImageFile, submitI2VTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);

  // Run faceswap test
  const runFaceSwapTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    if (!faceswapImageFile) {
      showToast('Please provide an image file', 'warning');
      return;
    }
    
    if (!faceswapVideoFileKey.trim()) {
      showToast('Please provide a video file key', 'warning');
      return;
    }
    
    setIsFaceSwapTestRunning(true);
    
    try {
      const task = await submitFaceSwapTask(faceswapImageFile, faceswapVideoFileKey);
      
      showToast(`Faceswap task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `FaceSwap: ${faceswapImageFile.name} + ${faceswapVideoFileKey}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit faceswap task: ${error.message}`, 'error');
    } finally {
      setIsFaceSwapTestRunning(false);
    }
  }, [isConnected, faceswapImageFile, faceswapVideoFileKey, submitFaceSwapTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);
  return (
    <>
      {/* Mode Tabs */}
      <div className="section">
        <h3>Test Mode</h3>
        <div className="tab-buttons">
          <button 
            className={testMode === 'image' ? 'active' : ''}
            onClick={() => setTestMode('image')}
          >
            Image Tests
          </button>
          <button 
            className={testMode === 'video' ? 'active' : ''}
            onClick={() => setTestMode('video')}
          >
            Video Tests
          </button>
          <button 
            className={testMode === 'infinite_talk' ? 'active' : ''}
            onClick={() => setTestMode('infinite_talk')}
          >
            Infinite Talk
          </button>
        </div>
      </div>

      {testMode === 'image' ? (
        <>
          {/* Image Single Test */}
          <div className="section">
            <h3>Single Image Test</h3>
            <textarea 
              placeholder="Enter custom prompt or leave empty for random"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            <button 
              onClick={runSingleTest}
              disabled={isSingleTestRunning}
            >
              {isSingleTestRunning ? 'Running...' : 'Run Single Test'}
            </button>

            <button 
              onClick={runSingleT2ITest}
              disabled={isT2ITestRunning}
            >
              {isT2ITestRunning ? 'Generating...' : 'Generate with Qwen Image'}
            </button>
          </div>

          {/* Image Batch Test */}
          <div className="section">
            <h3>Batch Image Test</h3>
            <input 
              type="number" 
              placeholder="Number of tasks" 
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 5)}
              min="1" 
              max="50"
            />
            <label>
              <input 
                type="checkbox" 
                checked={useRandomPrompts}
                onChange={(e) => setUseRandomPrompts(e.target.checked)}
              />
              Use random prompts
            </label>
            <button 
              onClick={runBatchTest}
              disabled={isBatchTestRunning}
            >
              {isBatchTestRunning ? 'Running Batch...' : 'Run Batch Test'}
            </button>
            {batchProgress && <div className="batch-progress">{batchProgress}</div>}
          </div>
        </>
      ) : testMode === 'video' ? (
        <>
          
          {/* Text-to-Video Test */}
          <div className="section">
            <h3>Text-to-Video Generation</h3>
            <textarea 
              placeholder="Enter prompt for video generation or leave empty for random"
              value={t2vPrompt}
              onChange={(e) => setT2vPrompt(e.target.value)}
              rows={3}
            />
            <button 
              onClick={runSingleT2VTest}
              disabled={isT2VTestRunning}
            >
              {isT2VTestRunning ? 'Generating...' : 'Generate Video from Text'}
            </button>
          </div>

          {/* Image-to-Video Test */}
          <div className="section">
            <h3>Image-to-Video Generation</h3>
            <div className="file-upload-section">
              <div className="upload-area">
                <label htmlFor="i2v-image-upload" className="upload-label">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="upload-text">
                      {i2vImageFile ? 'Change Image' : 'Upload Image File'}
                    </span>
                    <span className="upload-hint">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="i2v-image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleI2vImageFileChange}
                  className="upload-input"
                />
              </div>
              
              {i2vImageFile && (
                <div className="file-preview-section">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{i2vImageFile.name}</span>
                      <span className="file-size">({(i2vImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                  
                  {i2vImagePreviewUrl && (
                    <div className="image-preview">
                      <img 
                        src={i2vImagePreviewUrl} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={runSingleI2VTest}
              disabled={isI2VTestRunning || !i2vImageFile}
            >
              {isI2VTestRunning ? 'Generating...' : 'Generate Video from Image'}
            </button>
          </div>

          {/* wan 2.2 vace fun control test */}
          <div className="section">
            <h3>Wan 2.2 Vace Fun Control Test</h3>
            <div className="file-upload-section">
              <div className="upload-area">
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="upload-text">
                      {videoImageFile ? 'Change Image' : 'Upload Image File'}
                    </span>
                    <span className="upload-hint">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="upload-input"
                />
              </div>
              
              {videoImageFile && (
                <div className="file-preview-section">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{videoImageFile.name}</span>
                      <span className="file-size">({(videoImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                  
                  {imagePreviewUrl && (
                    <div className="image-preview">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="file-upload-section">
              <div className="upload-area">
                <label htmlFor="video-upload" className="upload-label">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="upload-text">
                      {videoFile ? 'Change Video' : 'Upload Video File'}
                    </span>
                    <span className="upload-hint">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="video-upload"
                  type="file" 
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="upload-input"
                />
              </div>
              
              {videoFile && (
                <div className="file-preview-section">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{videoFile.name}</span>
                      <span className="file-size">({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                  
                  {videoPreviewUrl && (
                    <div className="video-preview">
                      <video 
                        src={videoPreviewUrl} 
                        controls
                        className="preview-video"
                        style={{ maxWidth: '300px', maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={runVaceControlVideoTest}
              disabled={isVaceControlVideoTestRunning || !videoImageFile || !videoFile}
            >
              {isVaceControlVideoTestRunning ? 'Running...' : 'Run Single Video Test'}
            </button>
          </div>

          {/* FaceSwap Test */}
          <div className="section">
            <h3>FaceSwap Generation</h3>
            <div className="file-upload-section">
              <div className="upload-area">
                <label htmlFor="faceswap-image-upload" className="upload-label">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="upload-text">
                      {faceswapImageFile ? 'Change Image' : 'Upload Image File'}
                    </span>
                    <span className="upload-hint">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="faceswap-image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleFaceswapImageFileChange}
                  className="upload-input"
                />
              </div>
              
              {faceswapImageFile && (
                <div className="file-preview-section">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{faceswapImageFile.name}</span>
                      <span className="file-size">({(faceswapImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                  
                  {faceswapImagePreviewUrl && (
                    <div className="image-preview">
                      <img 
                        src={faceswapImagePreviewUrl} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="input-section">
              <input 
                type="text" 
                placeholder="Enter video file key (e.g., path/to/video.mp4)"
                value={faceswapVideoFileKey}
                onChange={(e) => setFaceswapVideoFileKey(e.target.value)}
                className="video-key-input"
              />
            </div>
            
            <button 
              onClick={runFaceSwapTest}
              disabled={isFaceSwapTestRunning || !faceswapImageFile || !faceswapVideoFileKey.trim()}
            >
              {isFaceSwapTestRunning ? 'Processing...' : 'Generate FaceSwap Video'}
            </button>
          </div>

        </>
      ) : (
        <>
          {/* Infinite Talk Single Test */}
          <div className="section">
            <h3>Single Infinite Talk Test</h3>
            <div className="file-upload-section">
              <div className="upload-area">
                <label htmlFor="talk-image-upload" className="upload-label">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="upload-text">
                      {talkImageFile ? 'Change Image' : 'Upload Image File'}
                    </span>
                    <span className="upload-hint">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="talk-image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleTalkImageFileChange}
                  className="upload-input"
                />
              </div>
              
              {talkImageFile && (
                <div className="file-preview-section">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{talkImageFile.name}</span>
                      <span className="file-size">({(talkImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                  
                  {talkImagePreviewUrl && (
                    <div className="image-preview">
                      <img 
                        src={talkImagePreviewUrl} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="file-upload-section">
              <div className="upload-area">
                <label htmlFor="audio-upload" className="upload-label">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="upload-text">
                      {audioFile ? 'Change Audio' : 'Upload Audio File'}
                    </span>
                    <span className="upload-hint">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="audio-upload"
                  type="file" 
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  className="upload-input"
                />
              </div>
              
              {audioFile && (
                <div className="file-preview-section">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{audioFile.name}</span>
                      <span className="file-size">({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                  
                  {audioPreviewUrl && (
                    <div className="audio-preview">
                      <audio 
                        src={audioPreviewUrl} 
                        controls
                        className="preview-audio"
                        style={{ width: '100%', maxWidth: '300px' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={runSingleTalkTest}
              disabled={isSingleTalkTestRunning || !talkImageFile || !audioFile}
            >
              {isSingleTalkTestRunning ? 'Running...' : 'Run Single Infinite Talk Test'}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TestControls;