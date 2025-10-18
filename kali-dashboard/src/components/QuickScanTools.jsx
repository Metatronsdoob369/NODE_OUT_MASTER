import { useState, useEffect } from 'react';

const QuickScanTools = () => {
  const [activeScans, setActiveScans] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanTypes = [
    {
      id: 'port-scan',
      name: 'Port Scan',
      icon: '🔍',
      description: 'Quick TCP port discovery',
      duration: 3000,
      color: 'bg-blue-600'
    },
    {
      id: 'vuln-scan',
      name: 'Vulnerability Scan',
      icon: '🛡️',
      description: 'Check for common vulnerabilities',
      duration: 5000,
      color: 'bg-red-600'
    },
    {
      id: 'network-scan',
      name: 'Network Discovery',
      icon: '🌐',
      description: 'Discover active hosts',
      duration: 4000,
      color: 'bg-green-600'
    },
    {
      id: 'service-scan',
      name: 'Service Detection',
      icon: '⚙️',
      description: 'Identify running services',
      duration: 3500,
      color: 'bg-purple-600'
    }
  ];

  const startScan = async (scanType) => {
    const scanId = Date.now();
    const scan = {
      id: scanId,
      type: scanType.id,
      name: scanType.name,
      icon: scanType.icon,
      startTime: new Date(),
      progress: 0,
      status: 'running'
    };

    setActiveScans(prev => [...prev, scan]);
    setIsScanning(true);

    // Simulate scan progress
    const progressInterval = setInterval(() => {
      setActiveScans(prev => prev.map(s => 
        s.id === scanId 
          ? { ...s, progress: Math.min(s.progress + Math.random() * 20, 95) }
          : s
      ));
    }, 200);

    // Complete scan after duration
    setTimeout(() => {
      clearInterval(progressInterval);
      
      setActiveScans(prev => prev.map(s => 
        s.id === scanId 
          ? { ...s, progress: 100, status: 'completed' }
          : s
      ));

      // Generate mock results
      const results = generateMockResults(scanType);
      setScanResults(prev => [results, ...prev.slice(0, 4)]);

      // Remove from active scans after 2 seconds
      setTimeout(() => {
        setActiveScans(prev => prev.filter(s => s.id !== scanId));
        if (activeScans.length <= 1) setIsScanning(false);
      }, 2000);

    }, scanType.duration);
  };

  const generateMockResults = (scanType) => {
    const baseResult = {
      id: Date.now(),
      type: scanType.id,
      name: scanType.name,
      icon: scanType.icon,
      timestamp: new Date(),
      target: '192.168.1.0/24'
    };

    switch (scanType.id) {
      case 'port-scan':
        return {
          ...baseResult,
          findings: [
            { port: 22, service: 'SSH', status: 'open', risk: 'low' },
            { port: 80, service: 'HTTP', status: 'open', risk: 'medium' },
            { port: 443, service: 'HTTPS', status: 'open', risk: 'low' },
            { port: 3389, service: 'RDP', status: 'filtered', risk: 'high' }
          ]
        };
      
      case 'vuln-scan':
        return {
          ...baseResult,
          findings: [
            { vuln: 'CVE-2023-1234', severity: 'HIGH', service: 'Apache 2.4.41' },
            { vuln: 'CVE-2023-5678', severity: 'MEDIUM', service: 'OpenSSH 8.2' },
            { vuln: 'Weak SSL Cipher', severity: 'LOW', service: 'HTTPS' }
          ]
        };
      
      case 'network-scan':
        return {
          ...baseResult,
          findings: [
            { ip: '192.168.1.1', hostname: 'router.local', mac: '00:11:22:33:44:55', status: 'up' },
            { ip: '192.168.1.10', hostname: 'server.local', mac: '00:11:22:33:44:66', status: 'up' },
            { ip: '192.168.1.15', hostname: 'workstation.local', mac: '00:11:22:33:44:77', status: 'up' }
          ]
        };
      
      case 'service-scan':
        return {
          ...baseResult,
          findings: [
            { service: 'Apache httpd 2.4.41', port: 80, version: '2.4.41', confidence: '95%' },
            { service: 'OpenSSH', port: 22, version: '8.2p1', confidence: '99%' },
            { service: 'MySQL', port: 3306, version: '8.0.25', confidence: '87%' }
          ]
        };
      
      default:
        return baseResult;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'text-red-400 bg-red-900/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20';
      case 'LOW': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Scan Buttons */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-kali-green mb-4 flex items-center">
          ⚡ Quick Scan Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scanTypes.map((scanType) => (
            <button
              key={scanType.id}
              onClick={() => startScan(scanType)}
              disabled={isScanning}
              className={`${scanType.color} hover:opacity-80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-4 rounded-lg transition-all duration-200 text-left`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{scanType.icon}</span>
                <span className="font-semibold">{scanType.name}</span>
              </div>
              <p className="text-sm opacity-80">{scanType.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Scans */}
      {activeScans.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-kali-green mb-4">🔄 Active Scans</h3>
          <div className="space-y-3">
            {activeScans.map((scan) => (
              <div key={scan.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{scan.icon}</span>
                    <span className="font-semibold text-white">{scan.name}</span>
                    <span className="text-sm text-gray-400">
                      Started: {scan.startTime.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-kali-green font-mono">
                    {scan.progress.toFixed(0)}%
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      scan.status === 'completed' ? 'bg-green-500' : 'bg-kali-green'
                    }`}
                    style={{ width: `${scan.progress}%` }}
                  ></div>
                </div>
                
                {scan.status === 'completed' && (
                  <div className="mt-2 text-green-400 text-sm flex items-center">
                    ✅ Scan completed successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {scanResults.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-kali-green">📊 Recent Scan Results</h3>
            <button
              onClick={() => setScanResults([])}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-4">
            {scanResults.map((result) => (
              <div key={result.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{result.icon}</span>
                    <span className="font-semibold text-white">{result.name}</span>
                    <span className="text-sm text-gray-400">
                      Target: {result.target}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <div className="bg-black rounded p-3 max-h-32 overflow-y-auto">
                  {result.type === 'port-scan' && (
                    <div className="space-y-1 text-sm font-mono">
                      {result.findings.map((finding, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-300">
                            Port {finding.port} ({finding.service})
                          </span>
                          <span className={`${getRiskColor(finding.risk)} font-semibold`}>
                            {finding.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.type === 'vuln-scan' && (
                    <div className="space-y-2 text-sm">
                      {result.findings.map((finding, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-300">{finding.vuln}</span>
                          <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(finding.severity)}`}>
                            {finding.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.type === 'network-scan' && (
                    <div className="space-y-1 text-sm font-mono">
                      {result.findings.map((finding, idx) => (
                        <div key={idx} className="text-gray-300">
                          <span className="text-kali-green">{finding.ip}</span> - {finding.hostname}
                        </div>
                      ))}
                    </div>
                  )}

                  {result.type === 'service-scan' && (
                    <div className="space-y-1 text-sm font-mono">
                      {result.findings.map((finding, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300">
                          <span>{finding.service}</span>
                          <span className="text-blue-400">{finding.version}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickScanTools;
