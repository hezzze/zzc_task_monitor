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
  const [testMode, setTestMode] = useState<'image' | 'video'>('image');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(5);
  const [useRandomPrompts, setUseRandomPrompts] = useState<boolean>(true);
  const [batchProgress, setBatchProgress] = useState<string>('');
  const [isSingleTestRunning, setIsSingleTestRunning] = useState<boolean>(false);
  const [isBatchTestRunning, setIsBatchTestRunning] = useState<boolean>(false);

  const [videoImageFile, setVideoImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isSingleVideoTestRunning, setIsSingleVideoTestRunning] = useState<boolean>(false);

  // Custom hooks
  const { showToast } = useToastContext();
  const { getRandomPrompt, createWorkflow, submitTask, submitVideoTask, monitorTask } = useTaskManagerContext();

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
  const runSingleVideoTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    if (!videoImageFile || !videoFile) {
      showToast('Please provide both image and video files', 'warning');
      return;
    }
    
    setIsSingleVideoTestRunning(true);
    
    try {
      const task = await submitVideoTask(videoImageFile, videoFile);
      
      showToast(`Video task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `Video: ${videoImageFile.name} + ${videoFile.name}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit video task: ${error.message}`, 'error');
    } finally {
      setIsSingleVideoTestRunning(false);
    }
  }, [isConnected, videoImageFile, videoFile, submitVideoTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);
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
      ) : (
        <>
          {/* Video Single Test */}
          <div className="section">
            <h3>Single Video Test</h3>
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
              onClick={runSingleVideoTest}
              disabled={isSingleVideoTestRunning || !videoImageFile || !videoFile}
            >
              {isSingleVideoTestRunning ? 'Running...' : 'Run Single Video Test'}
            </button>
          </div>


        </>
      )}
    </>
  );
};

export default TestControls;