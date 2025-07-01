import React from 'react';
import { Toast } from '../types';

interface ToastNotificationsProps {
  toasts: Toast[];
}

const ToastNotifications: React.FC<ToastNotificationsProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastNotifications;