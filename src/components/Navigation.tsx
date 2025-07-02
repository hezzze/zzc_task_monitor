import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>ZZC Web Tester</h2>
        </div>
        <div className="nav-links">
          <Link 
            to="/scheduler_monitor" 
            className={`nav-link ${location.pathname === '/scheduler_monitor' ? 'active' : ''}`}
          >
            Scheduler Monitor
          </Link>
          <Link 
            to="/playground" 
            className={`nav-link ${location.pathname === '/playground' ? 'active' : ''}`}
          >
            API Playground
          </Link>
        </div>
      </div>
      
      <style>{`
        .navigation {
          background: #343a40;
          color: white;
          padding: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }
        
        .nav-brand h2 {
          margin: 0;
          color: #fff;
          font-size: 1.5rem;
        }
        
        .nav-links {
          display: flex;
          gap: 20px;
        }
        
        .nav-link {
          color: #adb5bd;
          text-decoration: none;
          padding: 15px 20px;
          display: block;
          transition: color 0.2s, background-color 0.2s;
          border-radius: 4px;
        }
        
        .nav-link:hover {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .nav-link.active {
          color: #fff;
          background-color: #007bff;
        }
        
        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            padding: 10px;
          }
          
          .nav-brand {
            margin-bottom: 10px;
          }
          
          .nav-links {
            gap: 10px;
          }
          
          .nav-link {
            padding: 10px 15px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;