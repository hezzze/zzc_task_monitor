import React from 'react';
import { TaskData } from '../types';

interface ImageGalleryProps {
  tasks: Map<string, TaskData>;
  onTaskClick: (taskData: TaskData) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ tasks, onTaskClick }) => {
  // Convert tasks map to array for easier processing
  const taskArray = Array.from(tasks.values());
  
  // Calculate statistics
  const completedCount = taskArray.filter(task => task.status === 'completed').length;
  const failedCount = taskArray.filter(task => task.status === 'failed').length;
  const totalCount = taskArray.length;

  // Calculate stats from images
  const stats = {
    totalImages: totalCount,
    completedImages: completedCount,
    failedImages: failedCount
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Generated Images</h1>
        <div className="stats">
          <span>Total: <span>{stats.totalImages}</span></span>
          <span>Completed: <span>{stats.completedImages}</span></span>
          <span>Failed: <span>{stats.failedImages}</span></span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        {taskArray.length === 0 ? (
          <div className="empty-state">
            <p>No images generated yet. Run a test to see results here.</p>
          </div>
        ) : (
          taskArray.map((task, index) => {
            // Get the first image URL if available
            const imageUrl = task.result?.images?.[0];

            return (
              <div 
                key={task.id || index} 
                className={`image-item ${task.status}`}
                onClick={() => onTaskClick(task)}
              >
              {(() => {
                switch (task.status) {
                  case 'completed':
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={`Generated: ${task.prompt}`}
                        className="gallery-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    ) : (
                      <div className="status-image completed">
                        <div className="status-icon">✅</div>
                        <div className="status-text">Completed</div>
                      </div>
                    );
                  case 'failed':
                  case 'timeout':
                    return (
                      <div className="status-image failed">
                        <div className="status-icon">⚠️</div>
                        <div className="status-text">Failed</div>
                      </div>
                    );
                  case 'processing':
                  case 'running':
                    return (
                      <div className="status-image processing">
                        <div className="status-icon spinning">⚙️</div>
                        <div className="status-text">Processing</div>
                      </div>
                    );
                  case 'pending':
                  default:
                    return (
                      <div className="status-image pending">
                        <div className="status-icon">⏳</div>
                        <div className="status-text">Pending</div>
                      </div>
                    );
                }
              })()}
              <div className="image-info">
                <div className="image-id">ID: {task.id}</div>
                <div className="image-prompt">{task.prompt}</div>
                <div className={`image-status ${task.status}`}>
                  {task.status.toUpperCase()}
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

export default ImageGallery;