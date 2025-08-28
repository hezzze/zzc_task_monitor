import React from 'react';
import { TaskData, SortOptions } from '../types';

interface ImageGalleryProps {
  tasks: Map<string, TaskData>;
  onTaskClick: (taskData: TaskData) => void;
  sortOptions: SortOptions;
  onSortChange: (sortOptions: SortOptions) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ tasks, onTaskClick, sortOptions, onSortChange }) => {
  // Convert tasks map to array for easier processing
  const taskArray = Array.from(tasks.values());
  
  // Calculate statistics
  const completedCount = taskArray.filter(task => task.status === 'completed').length;
  const failedCount = taskArray.filter(task => task.status === 'failed').length;
  const totalCount = taskArray.length;

  // Calculate media counts
  const totalMediaCount = taskArray.reduce((count, task) => {
    const imageCount = task.result?.images?.length || 0;
    const videoCount = task.result?.videos?.length || 0;
    return count + imageCount + videoCount;
  }, 0);

  const completedMediaCount = taskArray
    .filter(task => task.status === 'completed')
    .reduce((count, task) => {
      const imageCount = task.result?.images?.length || 0;
      const videoCount = task.result?.videos?.length || 0;
      return count + imageCount + videoCount;
    }, 0);

  // Calculate stats from tasks and media
  const stats = {
    totalTasks: totalCount,
    completedTasks: completedCount,
    failedTasks: failedCount,
    totalMedia: totalMediaCount,
    completedMedia: completedMediaCount
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Generated Media</h1>
        <div className="header-controls">
          <div className="stats">
            <span>Tasks: <span>{stats.totalTasks}</span></span>
            <span>Completed: <span>{stats.completedTasks}</span></span>
            <span>Failed: <span>{stats.failedTasks}</span></span>
            <span>Media: <span>{stats.totalMedia}</span></span>
          </div>
          <div className="sort-controls">
            <label htmlFor="sort-by">Sort by:</label>
            <select 
              id="sort-by"
              value={sortOptions.sortBy} 
              onChange={(e) => onSortChange({ ...sortOptions, sortBy: e.target.value as SortOptions['sortBy'] })}
            >
              <option value="created_at">Created</option>
              <option value="updated_at">Updated</option>
              <option value="started_at">Started</option>
              <option value="completed_at">Completed</option>
            </select>
            <button 
              className={`sort-order-btn ${sortOptions.sortOrder}`}
              onClick={() => onSortChange({ ...sortOptions, sortOrder: sortOptions.sortOrder === 'asc' ? 'desc' : 'asc' })}
              title={`Sort ${sortOptions.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOptions.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        {taskArray.length === 0 ? (
          <div className="empty-state">
            <p>No media generated yet. Run a test to see results here.</p>
          </div>
        ) : (
          taskArray.map((task, index) => {
            // Get the first image or video URL if available
            const imageUrl = task.result?.images?.[0];
            const videoUrl = task.result?.videos?.[0];

            return (
              <div 
                key={task.id || index} 
                className={`image-item ${task.status}`}
                onClick={() => onTaskClick(task)}
              >
              {(() => {
                switch (task.status) {
                  case 'completed':
                    if (videoUrl) {
                      return (
                        <video 
                          src={videoUrl} 
                          className="gallery-image"
                          controls
                          muted
                          preload="metadata"
                          onError={(e) => {
                            const videoElement = e.target as HTMLVideoElement;
                            videoElement.style.display = 'none';
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'status-image failed';
                            errorDiv.innerHTML = '<div class="status-icon">⚠️</div><div class="status-text">Video not available</div>';
                            videoElement.parentNode?.appendChild(errorDiv);
                          }}
                        />
                      );
                    } else if (imageUrl) {
                      return (
                        <img 
                          src={imageUrl} 
                          alt={`Generated: ${task.prompt}`}
                          className="gallery-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      );
                    } else {
                      return (
                        <div className="status-image completed">
                          <div className="status-icon">✅</div>
                          <div className="status-text">Completed</div>
                        </div>
                      );
                    }
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
                {videoUrl && <div className="media-type">📹 VIDEO</div>}
                {imageUrl && !videoUrl && <div className="media-type">🖼️ IMAGE</div>}
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