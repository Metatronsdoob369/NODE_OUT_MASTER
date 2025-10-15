import React, { useState, useEffect } from 'react';
import { useAppState } from '../../contexts/AppContext';

const Footer = () => {
  const { activeScans, sessions, systemStats } = useAppState();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSystemStatus = () => {
    if (activeScans.length > 0) return { status: 'scanning', color: 'text-kali-green' };
    if (sessions.length > 0) return { status: 'active', color: 'text-kali-cyan' };
    return { status: 'idle', color: 'text-kali-gray-400' };
  };

  const systemStatus = getSystemStatus();

  return (
    <footer className="bg-kali-gray-900/90 backdrop-blur-sm border-t border-kali-gray-800 px-6 py-3">
      <div className="flex items-center justify-between text-sm">
        {/* Left side - System status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              systemStatus.status === 'scanning' ? 'bg-kali-green animate-pulse' :
              systemStatus.status === 'active' ? 'bg-kali-cyan animate-pulse' :
              'bg-kali-gray-500'
            }`}></div>
            <span className={`font-medium ${systemStatus.color}`}>
              System {systemStatus.status.charAt(0).toUpperCase() + systemStatus.status.slice(1)}
            </span>
          </div>

          {/* Active operations */}
          {activeScans.length > 0 && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-kali-green animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-kali-green">
                {activeScans.length} scan{activeScans.length !== 1 ? 's' : ''} running
              </span>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-kali-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-kali-cyan">
                {sessions.length} session{sessions.length !== 1 ? 's' : ''} active
              </span>
            </div>
          )}
        </div>

        {/* Center - Progress indicators for active scans */}
        <div className="hidden md:flex items-center space-x-4">
          {activeScans.slice(0, 3).map((scan) => (
            <div key={scan.id} className="flex items-center space-x-2">
              <div className="w-16 bg-kali-gray-800 rounded-full h-1.5">
                <div 
                  className="bg-kali-green h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${scan.progress || 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-kali-gray-400 min-w-0">
                {scan.target || 'Unknown'}
              </span>
            </div>
          ))}
          {activeScans.length > 3 && (
            <span className="text-xs text-kali-gray-400">
              +{activeScans.length - 3} more
            </span>
          )}
        </div>

        {/* Right side - System info and time */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-4 text-xs text-kali-gray-400">
            <span>CPU: 23%</span>
            <span>RAM: 1.2GB</span>
            <span>Uptime: {systemStats.uptime}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-kali-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-kali-gray-300 font-mono text-xs">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile progress indicators */}
      {activeScans.length > 0 && (
        <div className="md:hidden mt-2 pt-2 border-t border-kali-gray-800">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-kali-gray-400">Active scans:</span>
            <div className="flex-1 flex space-x-2">
              {activeScans.slice(0, 2).map((scan) => (
                <div key={scan.id} className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-kali-gray-400 truncate">
                      {scan.target || 'Unknown'}
                    </span>
                    <span className="text-kali-green">
                      {scan.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-kali-gray-800 rounded-full h-1">
                    <div 
                      className="bg-kali-green h-1 rounded-full transition-all duration-300"
                      style={{ width: `${scan.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
