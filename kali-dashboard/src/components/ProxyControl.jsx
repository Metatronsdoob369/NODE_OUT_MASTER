import { useState, useEffect } from 'react';

const ProxyControl = () => {
  const [proxyStatus, setProxyStatus] = useState('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  // Mock proxy status check
  useEffect(() => {
    checkProxyStatus();
  }, []);

  const checkProxyStatus = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProxyStatus(Math.random() > 0.5 ? 'active' : 'blocked');
      setIsLoading(false);
    }, 1000);
  };

  const blockProxy = async () => {
    setIsLoading(true);
    addLog('Initiating proxy block...', 'warning');
    
    // Simulate blocking process
    setTimeout(() => {
      setProxyStatus('blocked');
      setIsLoading(false);
      addLog('✅ Proxy successfully blocked', 'success');
      addLog('🛡️ All suspicious traffic filtered', 'info');
    }, 2000);
  };

  const unblockProxy = async () => {
    setIsLoading(true);
    addLog('Removing proxy restrictions...', 'warning');
    
    setTimeout(() => {
      setProxyStatus('active');
      setIsLoading(false);
      addLog('✅ Proxy access restored', 'success');
    }, 1500);
  };

  const emergencyBlock = async () => {
    setIsLoading(true);
    addLog('🚨 EMERGENCY BLOCK ACTIVATED', 'error');
    
    setTimeout(() => {
      setProxyStatus('emergency_blocked');
      setIsLoading(false);
      addLog('🔒 All network traffic suspended', 'error');
      addLog('🛡️ System in lockdown mode', 'error');
    }, 500);
  };

  const addLog = (message, type) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), { message, type, timestamp }]);
  };

  const getStatusColor = () => {
    switch (proxyStatus) {
      case 'active': return 'text-green-400';
      case 'blocked': return 'text-red-400';
      case 'emergency_blocked': return 'text-red-600 animate-pulse';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (proxyStatus) {
      case 'active': return '🟢 PROXY ACTIVE';
      case 'blocked': return '🔴 PROXY BLOCKED';
      case 'emergency_blocked': return '🚨 EMERGENCY LOCKDOWN';
      default: return '⚪ STATUS UNKNOWN';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-kali-green flex items-center">
          🛡️ Proxy Control Center
        </h2>
        <div className={`font-mono text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={blockProxy}
          disabled={isLoading || proxyStatus === 'blocked'}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <span>🚫</span>
              <span>Block Proxy</span>
            </>
          )}
        </button>

        <button
          onClick={unblockProxy}
          disabled={isLoading || proxyStatus === 'active'}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <span>✅</span>
              <span>Unblock Proxy</span>
            </>
          )}
        </button>

        <button
          onClick={emergencyBlock}
          disabled={isLoading}
          className="bg-red-800 hover:bg-red-900 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-red-600"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <span>🚨</span>
              <span>EMERGENCY</span>
            </>
          )}
        </button>
      </div>

      {/* Status Refresh */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={checkProxyStatus}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh Status</span>
        </button>
        
        <button
          onClick={() => setLogs([])}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2"
        >
          <span>🗑️</span>
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Activity Log */}
      <div className="bg-black rounded-lg p-4 h-48 overflow-y-auto">
        <div className="text-kali-green text-sm font-mono mb-2">
          📋 Activity Log
        </div>
        {logs.length === 0 ? (
          <div className="text-gray-500 text-sm">No recent activity...</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono flex items-start space-x-2">
                <span className="text-gray-400 text-xs">[{log.timestamp}]</span>
                <span className={`
                  ${log.type === 'success' ? 'text-green-400' : ''}
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'warning' ? 'text-yellow-400' : ''}
                  ${log.type === 'info' ? 'text-blue-400' : ''}
                `}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-kali-green text-lg font-bold">247</div>
          <div className="text-gray-400 text-xs">Blocked Requests</div>
        </div>
        <div className="bg-gray-800 rounded p-3">
          <div className="text-blue-400 text-lg font-bold">1.2s</div>
          <div className="text-gray-400 text-xs">Response Time</div>
        </div>
        <div className="bg-gray-800 rounded p-3">
          <div className="text-yellow-400 text-lg font-bold">12</div>
          <div className="text-gray-400 text-xs">Active Rules</div>
        </div>
      </div>
    </div>
  );
};

export default ProxyControl;
