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
  const [videoImageName, setVideoImageName] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('5af10b3f62e2df59aaeb47a04015a015a9ebfa8bbca6b5f8776a5a8db6d0d03d.mp4');
  const [isSingleVideoTestRunning, setIsSingleVideoTestRunning] = useState<boolean>(false);

  // Custom hooks
  const { showToast } = useToastContext();
  const { getRandomPrompt, createWorkflow, createVideoWorkflow, submitTask, monitorTask } = useTaskManagerContext();

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
      const task = await submitTask(workflow, prompt, schedulerUrl);
      
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
        const task = await submitTask(workflow, prompt, schedulerUrl);
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

  // Run single video test
  const runSingleVideoTest = useCallback(async () => {
    if (!isConnected) {
      showToast('Please connect to scheduler first', 'warning');
      return;
    }
    
    if (!videoImageName || !videoFileName) {
      showToast('Please provide both image and video filenames', 'warning');
      return;
    }
    
    setIsSingleVideoTestRunning(true);
    
    try {
      const workflow = await createVideoWorkflow(videoImageName, videoFileName);
      const task = await submitTask(workflow, `Video: ${videoImageName} + ${videoFileName}`, schedulerUrl);
      
      showToast(`Video task submitted: ${task.id}`, 'success');
      monitorTask(task.id, `Video: ${videoImageName} + ${videoFileName}`, schedulerUrl);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit video task: ${error.message}`, 'error');
    } finally {
      setIsSingleVideoTestRunning(false);
    }
  }, [isConnected, videoImageName, videoFileName, createVideoWorkflow, submitTask, monitorTask, showToast, loadExistingTasks, sortOptions, schedulerUrl]);
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
            <input 
              type="text" 
              placeholder="Input image filename (e.g., image.jpg)"
              value={videoImageName}
              onChange={(e) => setVideoImageName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Input video filename (e.g., video.mp4)"
              value={videoFileName}
              onChange={(e) => setVideoFileName(e.target.value)}
            />
            <button 
              onClick={runSingleVideoTest}
              disabled={isSingleVideoTestRunning || !videoImageName || !videoFileName}
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