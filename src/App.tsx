import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import SchedulerMonitor from './pages/SchedulerMonitor';
import Playground from './pages/Playground';

const App: React.FC = () => {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/zzc_task_monitor' : ''}>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/scheduler_monitor" replace />} />
          <Route path="/scheduler_monitor" element={<SchedulerMonitor />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;