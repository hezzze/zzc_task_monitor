import { useState, useCallback } from 'react';
import { SystemInfo, HealthResponse, StatsResponse } from '../types';

type ShowToastFunction = (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
type LoadExistingTasksFunction = () => Promise<void>;

export const useConnection = (
  schedulerUrl: string, 
  showToast: ShowToastFunction, 
  loadExistingTasks: LoadExistingTasksFunction
) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    workerCount: '-',
    queueLength: '-',
    totalTasks: '-'
  });

  // Refresh system info
  const refreshSystemInfo = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const [healthResponse, statsResponse] = await Promise.all([
        fetch(`${schedulerUrl}/health`),
        fetch(`${schedulerUrl}/api/v1/stats`)
      ]);
      
      if (healthResponse.ok && statsResponse.ok) {
        const health: HealthResponse = await healthResponse.json();
        const stats: StatsResponse = await statsResponse.json();
        
        setSystemInfo({
          workerCount: `${health.online_workers}/${health.total_workers}`,
          queueLength: stats.queue_length,
          totalTasks: stats.total_tasks
        });
      }
    } catch (error: any) {
      showToast(`Failed to refresh system info: ${error.message}`, 'error');
    }
  }, [isConnected, schedulerUrl, showToast]);

  // Connect to scheduler
  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      const response = await fetch(`${schedulerUrl}/health`);
      if (response.ok) {
        setIsConnected(true);
        showToast('Connected to scheduler service', 'success');
        await refreshSystemInfo();
        await loadExistingTasks();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      setIsConnected(false);
      showToast(`Connection failed: ${error.message}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  }, [schedulerUrl, showToast, refreshSystemInfo, loadExistingTasks]);

  return {
    isConnected,
    isConnecting,
    systemInfo,
    connect,
    refreshSystemInfo
  };
};