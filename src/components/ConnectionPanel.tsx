import React from 'react';

interface ConnectionPanelProps {
  schedulerUrl: string;
  setSchedulerUrl: (url: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  schedulerUrl,
  setSchedulerUrl,
  isConnected,
  isConnecting,
  connect
}) => {
  return (
    <div className="section">
      <h3>Connection</h3>
      <input 
        type="text" 
        placeholder="Scheduler URL" 
        value={schedulerUrl}
        onChange={(e) => setSchedulerUrl(e.target.value)}
      />
      <button 
        onClick={connect}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect'}
      </button>
      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnecting ? 'Connecting...' : (isConnected ? 'Connected' : 'Disconnected')}
      </div>
    </div>
  );
};

export default ConnectionPanel;