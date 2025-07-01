import React from 'react';

interface TestControlsProps {
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  isSingleTestRunning: boolean;
  runSingleTest: () => void;
  batchSize: number;
  setBatchSize: (size: number) => void;
  useRandomPrompts: boolean;
  setUseRandomPrompts: (useRandom: boolean) => void;
  isBatchTestRunning: boolean;
  runBatchTest: () => void;
  batchProgress: string | null;
  isConnected?: boolean;
}

const TestControls: React.FC<TestControlsProps> = ({
  customPrompt,
  setCustomPrompt,
  isSingleTestRunning,
  runSingleTest,
  batchSize,
  setBatchSize,
  useRandomPrompts,
  setUseRandomPrompts,
  isBatchTestRunning,
  runBatchTest,
  batchProgress
}) => {
  return (
    <>
      {/* Single Test */}
      <div className="section">
        <h3>Single Test</h3>
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

      {/* Batch Test */}
      <div className="section">
        <h3>Batch Test</h3>
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
  );
};

export default TestControls;