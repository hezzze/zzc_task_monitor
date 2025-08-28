import React, { useState, useCallback, useEffect } from 'react';
import ConnectionPanel from '../components/ConnectionPanel';
import SystemInfo from '../components/SystemInfo';
import TestControls from '../components/TestControls';
import ControlPanel from '../components/ControlPanel';
import ImageGallery from '../components/ImageGallery';
import TaskModal from '../components/TaskModal';

import { useToastContext } from '../contexts/ToastContext';
import { useTaskManagerContext } from '../contexts/TaskManagerContext';
import { useConnection } from '../hooks/useConnection';
import { TaskData, SortOptions } from '../types';

const SchedulerMonitor: React.FC = () => {
  const [schedulerUrl, setSchedulerUrl] = useState<string>('https://api.zzcreation.com/scheduler');
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Custom hooks
  const { showToast } = useToastContext();
  const { tasks, loadExistingTasks, clearGallery } = useTaskManagerContext();
  const { isConnected, isConnecting, systemInfo, connect, refreshSystemInfo } = useConnection(schedulerUrl, showToast, () => loadExistingTasks(schedulerUrl, sortOptions));

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
          schedulerUrl={schedulerUrl}
          isConnected={isConnected}
          loadExistingTasks={(sortOptions) => loadExistingTasks(schedulerUrl, sortOptions)}
          sortOptions={sortOptions}
        />

        <ControlPanel
          loadExistingTasks={() => loadExistingTasks(schedulerUrl, sortOptions)}
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
            loadExistingTasks(schedulerUrl, newSortOptions);
          }}
        />
      </div>

      <TaskModal
        isModalOpen={isModalOpen}
        selectedTask={selectedTask}
        closeModal={handleModalClose}
      />


    </div>
  );
};

export default SchedulerMonitor;