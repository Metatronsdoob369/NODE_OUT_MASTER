import { useState, useEffect } from 'react';

const SecurityMonitoring = () => {
  const [threats, setThreats] = useState([]);
  const [systemStatus, setSystemStatus] = useState('secure');
  const [alerts, setAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time threat detection
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Randomly generate threats
      if (Math.random() < 0.3) {
        generateThreat();
      }
      
      // Update system status
      updateSystemStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateThreat = () => {
    const threatTypes = [
      {
        type: 'Port Scan',
        icon: '🔍',
        severity: 'medium',
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        description: 'Suspicious port scanning activity detected'
      },
      {
        type: 'Brute Force',
        icon: '🔨',
        severity: 'high',
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        description: 'Multiple failed login attempts detected'
      },
      {
        type: 'Malware',
        icon: '🦠',
        severity: 'critical',
        source: 'Internal',
        description: 'Suspicious file behavior detected'
      },
      {
        type: 'DDoS',
        icon: '🌊',
        severity: 'high',
        source: 'Multiple IPs',
        description: 'Distributed denial of service attack detected'
      },
      {
        type: 'Phishing',
        icon: '🎣',
        severity: 'medium',
        source: 'Email',
        description: 'Suspicious email attachment detected'
      }
    ];

    const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const newThreat = {
      id: Date.now(),
      ...threat,
      timestamp: new Date(),
      status: 'active'
    };

    setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
    
    // Add to alerts
    addAlert(`${threat.icon} ${threat.type} detected from ${threat.source}`, threat.severity);
  };

  const updateSystemStatus = () => {
    const activeThreats = threats.filter(t => t.status === 'active');
    const criticalThreats = activeThreats.filter(t => t.severity === 'critical');
    const highThreats = activeThreats.filter(t => t.severity === 'high');

    if (criticalThreats.length > 0) {
      setSystemStatus('critical');
    } else if (highThreats.length > 2) {
      setSystemStatus('high-risk');
    } else if (activeThreats.length > 0) {
      setSystemStatus('monitoring');
    } else {
      setSystemStatus('secure');
    }
  };

  const addAlert = (message, severity) => {
    const alert = {
      id: Date.now(),
      message,
      severity,
      timestamp: new Date()
    };
    setAlerts(prev => [alert, ...prev.slice(0, 4)]);
  };

  const blockThreat = (threatId) => {
    setThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'blocked' } : t
    ));
    addAlert('🛡️ Threat successfully blocked', 'success');
  };

  const ignoreThreat = (threatId) => {
    setThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'ignored' } : t
    ));
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'secure': return 'text-green-400';
      case 'monitoring': return 'text-yellow-400';
      case 'high-risk': return 'text-orange-400';
      case 'critical': return 'text-red-400 animate-pulse';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'secure': return '🟢 SYSTEM SECURE';
      case 'monitoring': return '🟡 MONITORING THREATS';
      case 'high-risk': return '🟠 HIGH RISK DETECTED';
      case 'critical': return '🔴 CRITICAL THREATS';
      default: return '⚪ STATUS UNKNOWN';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-500';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500';
      case 'success': return 'text-green-400 bg-green-900/20 border-green-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-900/10';
      case 'high': return 'border-l-orange-500 bg-orange-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-900/10';
      case 'success': return 'border-l-green-500 bg-green-900/10';
      default: return 'border-l-gray-500 bg-gray-900/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-kali-green flex items-center">
            🛡️ Security Monitoring
          </h2>
          <div className={`font-mono text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? '⏸️ Pause Monitoring' : '▶️ Start Monitoring'}
          </button>
          
          <button
            onClick={() => setThreats([])}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            🗑️ Clear Threats
          </button>
          
          <button
            onClick={() => setAlerts([])}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            🔔 Clear Alerts
          </button>
        </div>
      </div>

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-kali-green mb-4">🚨 Real-time Alerts</h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`border-l-4 p-3 rounded ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{alert.message}</span>
                  <span className="text-gray-400 text-xs">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Threats */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-kali-green">⚠️ Detected Threats</h3>
          <div className="text-sm text-gray-400">
            Active: {threats.filter(t => t.status === 'active').length} | 
            Blocked: {threats.filter(t => t.status === 'blocked').length}
          </div>
        </div>

        {threats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🛡️</div>
            <div>No threats detected</div>
            <div className="text-sm">System is secure</div>
          </div>
        ) : (
          <div className="space-y-3">
            {threats.map((threat) => (
              <div 
                key={threat.id} 
                className={`border rounded-lg p-4 ${getSeverityColor(threat.severity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{threat.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{threat.type}</div>
                      <div className="text-sm text-gray-400">Source: {threat.source}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {threat.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-300 mb-3">
                  {threat.description}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {threat.status === 'active' && (
                      <>
                        <button
                          onClick={() => blockThreat(threat.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          🚫 Block
                        </button>
                        <button
                          onClick={() => ignoreThreat(threat.id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        >
                          👁️ Ignore
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="text-xs">
                    {threat.status === 'blocked' && (
                      <span className="text-red-400">🛡️ BLOCKED</span>
                    )}
                    {threat.status === 'ignored' && (
                      <span className="text-gray-400">👁️ IGNORED</span>
                    )}
                    {threat.status === 'active' && (
                      <span className="text-yellow-400 animate-pulse">⚠️ ACTIVE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl text-red-400 font-bold">
            {threats.filter(t => t.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-400">Critical Threats</div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl text-orange-400 font-bold">
            {threats.filter(t => t.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-400">High Risk</div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl text-green-400 font-bold">
            {threats.filter(t => t.status === 'blocked').length}
          </div>
          <div className="text-sm text-gray-400">Blocked</div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl text-kali-green font-bold">
            {isMonitoring ? '🟢' : '🔴'}
          </div>
          <div className="text-sm text-gray-400">
            {isMonitoring ? 'Monitoring' : 'Paused'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoring;
