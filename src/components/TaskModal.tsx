import React from 'react';
import { TaskData } from '../types';

interface TaskModalProps {
  isModalOpen: boolean;
  selectedTask: TaskData | null;
  closeModal: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isModalOpen, selectedTask, closeModal }) => {
  if (!isModalOpen || !selectedTask) return null;

  // Format timestamps
  const formatTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  // Calculate actual duration from API timestamps
  const calculateDuration = (): string => {
    if (selectedTask.startedAt && selectedTask.completedAt) {
      const duration = (new Date(selectedTask.completedAt).getTime() - new Date(selectedTask.startedAt).getTime()) / 1000;
      return `${duration.toFixed(2)}s`;
    }
    if (selectedTask.startTime && selectedTask.endTime) {
      const duration = (selectedTask.endTime - selectedTask.startTime) / 1000;
      return `${duration.toFixed(2)}s`;
    }
    return 'In progress';
  };

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Task Details</h2>
        <div className="task-details">
          <div className="detail-section">
            <h4>Task Information</h4>
            <div className="detail-item">
              <span className="detail-label">Task ID:</span>
              <span className="detail-value">{selectedTask.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status">{selectedTask.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Priority:</span>
              <span className="detail-value">{selectedTask.priority || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Timeout:</span>
              <span className="detail-value">{selectedTask.timeout ? `${selectedTask.timeout}s` : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned Worker:</span>
              <span className="detail-value">{selectedTask.workerId || 'Not assigned'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Prompt:</span>
              <span className="detail-value">{selectedTask.prompt}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Timing Information</h4>
            <div className="detail-item">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{formatTimestamp(selectedTask.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Started At:</span>
              <span className="detail-value">{formatTimestamp(selectedTask.startedAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Completed At:</span>
              <span className="detail-value">{formatTimestamp(selectedTask.completedAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{formatTimestamp(selectedTask.updatedAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">{calculateDuration()}</span>
            </div>
          </div>
          
          {selectedTask.result && ((selectedTask.result.images?.length || 0) > 0 || (selectedTask.result.videos?.length || 0) > 0) && (
            <div className="detail-section">
              <h4>Generated Media ({(selectedTask.result?.images?.length || 0) + (selectedTask.result?.videos?.length || 0)})</h4>
              
              {selectedTask.result.images && selectedTask.result.images.length > 0 && (
                <div className="media-subsection">
                  <h5>🖼️ Images ({selectedTask.result.images.length})</h5>
                  <ul className="image-urls">
                    {selectedTask.result.images.map((url, index) => (
                      <li key={`image-${index}`}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedTask.result.videos && selectedTask.result.videos.length > 0 && (
                <div className="media-subsection">
                  <h5>📹 Videos ({selectedTask.result.videos.length})</h5>
                  <ul className="image-urls">
                    {selectedTask.result.videos.map((url, index) => (
                      <li key={`video-${index}`}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {selectedTask.result && (
            <div className="detail-section">
              <h4>Result Summary</h4>
              <div className="detail-item">
                <span className="detail-label">Outputs:</span>
                <span className="detail-value">{Object.keys(selectedTask.result.outputs || {}).length} items</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Log Entries:</span>
                <span className="detail-value">{(selectedTask.result.logs || []).length} entries</span>
              </div>
            </div>
          )}
          
          {selectedTask.error && (
            <div className="detail-section">
              <h4>Error Details</h4>
              <div className="detail-item">
                <span className="detail-value" style={{color: '#e74c3c'}}>{selectedTask.error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;