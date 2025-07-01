import React from 'react';

interface ControlPanelProps {
  loadExistingTasks: () => void;
  clearGallery: () => void;
  exportResults: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ loadExistingTasks, clearGallery, exportResults }) => {
  return (
    <div className="section">
      <h3>Controls</h3>
      <button onClick={loadExistingTasks}>Load Tasks</button>
      <button onClick={clearGallery}>Clear Gallery</button>
      <button onClick={exportResults}>Export Results</button>
    </div>
  );
};

export default ControlPanel;