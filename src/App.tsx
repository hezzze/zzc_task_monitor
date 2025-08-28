import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import SchedulerMonitor from './pages/SchedulerMonitor';
import Playground from './pages/Playground';
import { ToastProvider } from './contexts/ToastContext';
import { TaskManagerProvider } from './contexts/TaskManagerContext';
import ToastNotifications from './components/ToastNotifications';
import { useToastContext } from './contexts/ToastContext';

const AppContent: React.FC = () => {
  const { toasts } = useToastContext();

  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/zzc_task_monitor' : ''}>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/scheduler_monitor" replace />} />
          <Route path="/scheduler_monitor" element={<SchedulerMonitor />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
        <ToastNotifications toasts={toasts} />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <TaskManagerProvider>
        <AppContent />
      </TaskManagerProvider>
    </ToastProvider>
  );
};

export default App;