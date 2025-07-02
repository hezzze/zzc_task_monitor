import React, { useState, useCallback, useEffect } from 'react';
import ConnectionPanel from '../components/ConnectionPanel';
import SystemInfo from '../components/SystemInfo';
import TestControls from '../components/TestControls';
import ControlPanel from '../components/ControlPanel';
import ImageGallery from '../components/ImageGallery';
import TaskModal from '../components/TaskModal';
import ToastNotifications from '../components/ToastNotifications';
import { useToast } from '../hooks/useToast';
import { useTaskManager } from '../hooks/useTaskManager';
import { useConnection } from '../hooks/useConnection';
import { TaskData, SortOptions } from '../types';

const SchedulerMonitor: React.FC = () => {
  const [schedulerUrl, setSchedulerUrl] = useState<string>('https://api.zzcreation.com/scheduler');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(5);
  const [useRandomPrompts, setUseRandomPrompts] = useState<boolean>(true);
  const [batchProgress, setBatchProgress] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSingleTestRunning, setIsSingleTestRunning] = useState<boolean>(false);
  const [isBatchTestRunning, setIsBatchTestRunning] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Custom hooks
  const { toasts, showToast } = useToast();
  const { tasks, getRandomPrompt, createWorkflow, submitTask, monitorTask, loadExistingTasks, clearGallery } = useTaskManager(schedulerUrl, showToast);
  const { isConnected, isConnecting, systemInfo, connect, refreshSystemInfo } = useConnection(schedulerUrl, showToast, () => loadExistingTasks(sortOptions));

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
      const task = await submitTask(workflow, prompt);
      
      showToast(`Task submitted: ${task.id}`, 'success');
      monitorTask(task.id, prompt);
      // Reload tasks to maintain sort order
      await loadExistingTasks(sortOptions);
    } catch (error: any) {
      showToast(`Failed to submit task: ${error.message}`, 'error');
    } finally {
      setIsSingleTestRunning(false);
    }
  }, [isConnected, customPrompt, getRandomPrompt, createWorkflow, submitTask, monitorTask, showToast, loadExistingTasks, sortOptions]);

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
        const task = await submitTask(workflow, prompt);
        tasks.push({ id: task.id, prompt });
        
        setBatchProgress(`Submitted ${i + 1}/${batchSize} tasks`);
        showToast(`Batch task ${i + 1}/${batchSize} submitted: ${task.id}`, 'info');
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Monitor all tasks
      tasks.forEach(({ id, prompt }) => {
        monitorTask(id, prompt);
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
  }, [isConnected, batchSize, useRandomPrompts, customPrompt, getRandomPrompt, createWorkflow, submitTask, monitorTask, showToast, loadExistingTasks, sortOptions]);

  // Export results
  const exportResults = useCallback(() => {
    const taskArray = Array.from(tasks.values());
    const data = {
      timestamp: new Date().toISOString(),
      schedulerUrl,
      systemInfo,
      tasks: taskArray,
      summary: {
        totalTasks: tasks.size,
        completedTasks: taskArray.filter(t => t.status === 'completed').length,
        failedTasks: taskArray.filter(t => t.status === 'failed').length,
        totalImages: taskArray.reduce((count, task) => count + (task.result?.images?.length || 0), 0),
        successfulImages: taskArray.filter(t => t.status === 'completed' && t.result?.images?.length).length
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduler-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Results exported successfully', 'success');
  }, [schedulerUrl, systemInfo, tasks, showToast]);

  // Show task details modal
  const handleTaskClick = useCallback((taskData: TaskData) => {
    setSelectedTask(taskData);
    setIsModalOpen(true);
  }, []);

  // Close modal
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  // Auto-refresh system info every 30 seconds
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshSystemInfo, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, refreshSystemInfo]);

  return (
    <div className="container">
      <div className="side-panel">
        <ConnectionPanel
          schedulerUrl={schedulerUrl}
          setSchedulerUrl={setSchedulerUrl}
          isConnected={isConnected}
          isConnecting={isConnecting}
          connect={connect}
        />

        <SystemInfo
          systemInfo={systemInfo}
          refreshSystemInfo={refreshSystemInfo}
        />

        <TestControls
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          useRandomPrompts={useRandomPrompts}
          setUseRandomPrompts={setUseRandomPrompts}
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          batchProgress={batchProgress}
          isConnected={isConnected}
          isSingleTestRunning={isSingleTestRunning}
          isBatchTestRunning={isBatchTestRunning}
          runSingleTest={runSingleTest}
          runBatchTest={runBatchTest}
        />

        <ControlPanel
          loadExistingTasks={loadExistingTasks}
          clearGallery={clearGallery}
          exportResults={exportResults}
        />
      </div>

      <div className="main-content">
        <ImageGallery
          tasks={tasks}
          onTaskClick={handleTaskClick}
          sortOptions={sortOptions}
          onSortChange={(newSortOptions) => {
            setSortOptions(newSortOptions);
            loadExistingTasks(newSortOptions);
          }}
        />
      </div>

      <TaskModal
        isModalOpen={isModalOpen}
        selectedTask={selectedTask}
        closeModal={handleModalClose}
      />

      <ToastNotifications toasts={toasts} />
    </div>
  );
};

export default SchedulerMonitor;