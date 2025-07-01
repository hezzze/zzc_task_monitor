import React from 'react';
import { SystemInfo as SystemInfoType } from '../types';

interface SystemInfoProps {
  systemInfo: SystemInfoType;
  refreshSystemInfo: () => void;
}

const SystemInfo: React.FC<SystemInfoProps> = ({ systemInfo, refreshSystemInfo }) => {
  return (
    <div className="section">
      <h3>System Info</h3>
      <div className="system-info">
        <div>Workers: <span>{systemInfo.workerCount}</span></div>
        <div>Queue: <span>{systemInfo.queueLength}</span></div>
        <div>Total Tasks: <span>{systemInfo.totalTasks}</span></div>
      </div>
      <button onClick={refreshSystemInfo}>Refresh</button>
    </div>
  );
};

export default SystemInfo;