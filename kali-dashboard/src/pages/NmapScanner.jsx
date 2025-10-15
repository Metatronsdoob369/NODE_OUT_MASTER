import React, { useState, useEffect, useRef } from 'react';
import { useAppState, useAppDispatch, actions } from '../contexts/AppContext';

const NmapScanner = () => {
  const { activeScans } = useAppState();
  const dispatch = useAppDispatch();
  const [scanForm, setScanForm] = useState({
    target: '192.168.1.0/24',
    scanType: '-sS',
    ports: '',
    timing: '-T4',
    outputFormat: 'normal'
  });
  const [scanResults, setScanResults] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const abortControllerRef = useRef(null);

  // Mock scan results data
  const mockScanResults = [
    {
      ip: '192.168.1.1',
      hostname: 'router.local',
      status: 'up',
      ports: [
        { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.2' },
        { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'nginx 1.18.0' },
        { port: 443, protocol: 'tcp', state: 'open', service: 'https', version: 'nginx 1.18.0' }
      ]
    },
    {
      ip: '192.168.1.100',
      hostname: 'workstation.local',
      status: 'up',
      ports: [
        { port: 135, protocol: 'tcp', state: 'open', service: 'msrpc', version: 'Microsoft Windows RPC' },
        { port: 139, protocol: 'tcp', state: 'open', service: 'netbios-ssn', version: 'Microsoft Windows netbios-ssn' },
        { port: 445, protocol: 'tcp', state: 'open', service: 'microsoft-ds', version: 'Windows Server 2019' },
        { port: 3389, protocol: 'tcp', state: 'open', service: 'ms-wbt-server', version: 'Microsoft Terminal Services' }
      ]
    },
    {
      ip: '192.168.1.50',
      hostname: 'server.local',
      status: 'up',
      ports: [
        { port: 21, protocol: 'tcp', state: 'open', service: 'ftp', version: 'vsftpd 3.0.3' },
        { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 7.4' },
        { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache httpd 2.4.6' },
        { port: 3306, protocol: 'tcp', state: 'open', service: 'mysql', version: 'MySQL 5.7.34' }
      ]
    }
  ];

  const scanTypes = [
    { value: '-sS', label: 'TCP SYN Scan (Stealth)', description: 'Half-open scan, stealthy and fast' },
    { value: '-sT', label: 'TCP Connect Scan', description: 'Full TCP connection, more reliable' },
    { value: '-sU', label: 'UDP Scan', description: 'Scan UDP ports' },
    { value: '-sV', label: 'Version Detection', description: 'Detect service versions' },
    { value: '-sC', label: 'Script Scan', description: 'Run default NSE scripts' },
    { value: '-A', label: 'Aggressive Scan', description: 'OS detection, version detection, script scanning' }
  ];

  const timingTemplates = [
    { value: '-T0', label: 'Paranoid (T0)', description: 'Very slow, IDS evasion' },
    { value: '-T1', label: 'Sneaky (T1)', description: 'Slow, IDS evasion' },
    { value: '-T2', label: 'Polite (T2)', description: 'Slow, less bandwidth' },
    { value: '-T3', label: 'Normal (T3)', description: 'Default timing' },
    { value: '-T4', label: 'Aggressive (T4)', description: 'Fast, assumes reliable network' },
    { value: '-T5', label: 'Insane (T5)', description: 'Very fast, may miss results' }
  ];

  // Mock scan execution with progress simulation
  const startScan = async () => {
    if (isScanning) return;

    // Validate input
    if (!scanForm.target.trim()) {
      dispatch(actions.addNotification({
        type: 'error',
        message: 'Please enter a target IP or range'
      }));
      return;
    }

    setIsScanning(true);
    abortControllerRef.current = new AbortController();

    const scanId = Date.now();
    const newScan = {
      id: scanId,
      target: scanForm.target,
      type: scanForm.scanType,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      command: `nmap ${scanForm.scanType} ${scanForm.timing} ${scanForm.ports ? `-p ${scanForm.ports}` : ''} ${scanForm.target}`.trim()
    };

    dispatch(actions.addScan(newScan));
    setSelectedScan(scanId);

    try {
      // Simulate scan progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 15 + 5) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Scan aborted');
        }

        const currentProgress = Math.min(100, Math.round(progress));
        dispatch(actions.updateScan({
          id: scanId,
          progress: currentProgress
        }));

        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      }

      // Complete scan
      dispatch(actions.updateScan({
        id: scanId,
        status: 'completed',
        progress: 100,
        endTime: new Date().toISOString()
      }));

      // Set mock results
      setScanResults(mockScanResults);

      dispatch(actions.addNotification({
        type: 'success',
        message: `Scan completed: ${mockScanResults.length} hosts discovered`
      }));

    } catch (error) {
      dispatch(actions.updateScan({
        id: scanId,
        status: 'failed',
        error: error.message
      }));

      dispatch(actions.addNotification({
        type: 'error',
        message: `Scan failed: ${error.message}`
      }));
    } finally {
      setIsScanning(false);
      abortControllerRef.current = null;
    }
  };

  const stopScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const exportResults = (format) => {
    if (scanResults.length === 0) {
      dispatch(actions.addNotification({
        type: 'warning',
        message: 'No scan results to export'
      }));
      return;
    }

    const data = format === 'json' ? JSON.stringify(scanResults, null, 2) : 
                  scanResults.map(host => 
                    `Host: ${host.ip} (${host.hostname})\nStatus: ${host.status}\nPorts:\n${
                      host.ports.map(p => `  ${p.port}/${p.protocol} ${p.state} ${p.service} ${p.version}`).join('\n')
                    }\n\n`
                  ).join('');

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nmap_scan_${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);

    dispatch(actions.addNotification({
      type: 'success',
      message: `Results exported as ${format.toUpperCase()}`
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Nmap Scanner</h1>
          <p className="text-kali-gray-400 mt-1">
            Network discovery and security auditing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isScanning && (
            <button onClick={stopScan} className="btn-danger">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
              </svg>
              Stop Scan
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scan Configuration */}
        <div className="xl:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Scan Configuration</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); startScan(); }} className="space-y-4">
              {/* Target */}
              <div>
                <label className="block text-sm font-medium text-kali-gray-300 mb-2">
                  Target (IP/CIDR)
                </label>
                <input
                  type="text"
                  value={scanForm.target}
                  onChange={(e) => setScanForm({ ...scanForm, target: e.target.value })}
                  className="input-field w-full"
                  placeholder="192.168.1.0/24"
                  disabled={isScanning}
                />
                <p className="text-xs text-kali-gray-500 mt-1">
                  Examples: 192.168.1.1, 10.0.0.0/16, scanme.nmap.org
                </p>
              </div>

              {/* Scan Type */}
              <div>
                <label className="block text-sm font-medium text-kali-gray-300 mb-2">
                  Scan Type
                </label>
                <select
                  value={scanForm.scanType}
                  onChange={(e) => setScanForm({ ...scanForm, scanType: e.target.value })}
                  className="input-field w-full"
                  disabled={isScanning}
                >
                  {scanTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-kali-gray-500 mt-1">
                  {scanTypes.find(t => t.value === scanForm.scanType)?.description}
                </p>
              </div>

              {/* Port Range */}
              <div>
                <label className="block text-sm font-medium text-kali-gray-300 mb-2">
                  Port Range (Optional)
                </label>
                <input
                  type="text"
                  value={scanForm.ports}
                  onChange={(e) => setScanForm({ ...scanForm, ports: e.target.value })}
                  className="input-field w-full"
                  placeholder="1-1000, 22,80,443"
                  disabled={isScanning}
                />
                <p className="text-xs text-kali-gray-500 mt-1">
                  Leave empty for default ports
                </p>
              </div>

              {/* Timing */}
              <div>
                <label className="block text-sm font-medium text-kali-gray-300 mb-2">
                  Timing Template
                </label>
                <select
                  value={scanForm.timing}
                  onChange={(e) => setScanForm({ ...scanForm, timing: e.target.value })}
                  className="input-field w-full"
                  disabled={isScanning}
                >
                  {timingTemplates.map((timing) => (
                    <option key={timing.value} value={timing.value}>
                      {timing.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-kali-gray-500 mt-1">
                  {timingTemplates.find(t => t.value === scanForm.timing)?.description}
                </p>
              </div>

              {/* Command Preview */}
              <div className="bg-kali-gray-900 rounded-lg p-3 border border-kali-gray-700">
                <div className="text-xs text-kali-gray-400 mb-1">Command Preview:</div>
                <code className="text-kali-green font-mono text-sm">
                  nmap {scanForm.scanType} {scanForm.timing} {scanForm.ports ? `-p ${scanForm.ports}` : ''} {scanForm.target}
                </code>
              </div>

              {/* Start Scan Button */}
              <button
                type="submit"
                disabled={isScanning}
                className={`w-full ${isScanning ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              >
                {isScanning ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Start Scan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Scans */}
          {activeScans.length > 0 && (
            <div className="card mt-6">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Active Scans</h3>
              </div>
              <div className="space-y-3">
                {activeScans.map((scan) => (
                  <div key={scan.id} className="p-3 bg-kali-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">{scan.target}</span>
                      <span className="text-xs text-kali-gray-400">{scan.progress}%</span>
                    </div>
                    <div className="w-full bg-kali-gray-800 rounded-full h-2">
                      <div 
                        className="bg-kali-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scan.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-kali-gray-500">{scan.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        scan.status === 'running' ? 'bg-kali-green/20 text-kali-green' :
                        scan.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {scan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scan Results */}
        <div className="xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Scan Results</h3>
              {scanResults.length > 0 && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => exportResults('json')}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Export JSON
                  </button>
                  <button 
                    onClick={() => exportResults('txt')}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Export TXT
                  </button>
                </div>
              )}
            </div>

            {scanResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-kali-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-kali-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-kali-gray-400">No scan results yet</p>
                <p className="text-kali-gray-500 text-sm mt-1">Configure and start a scan to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scanResults.map((host, index) => (
                  <div key={index} className="border border-kali-gray-700 rounded-lg overflow-hidden">
                    {/* Host Header */}
                    <div className="bg-kali-gray-800/50 px-4 py-3 border-b border-kali-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium font-mono">{host.ip}</h4>
                          <p className="text-kali-gray-400 text-sm">{host.hostname}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`status-indicator ${
                            host.status === 'up' ? 'status-online' : 'status-offline'
                          }`}>
                            {host.status}
                          </span>
                          <span className="text-sm text-kali-gray-400">
                            {host.ports.length} ports
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ports Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-kali-gray-900/50">
                          <tr>
                            <th className="text-left py-2 px-4 text-kali-gray-300">Port</th>
                            <th className="text-left py-2 px-4 text-kali-gray-300">Protocol</th>
                            <th className="text-left py-2 px-4 text-kali-gray-300">State</th>
                            <th className="text-left py-2 px-4 text-kali-gray-300">Service</th>
                            <th className="text-left py-2 px-4 text-kali-gray-300">Version</th>
                          </tr>
                        </thead>
                        <tbody>
                          {host.ports.map((port, portIndex) => (
                            <tr key={portIndex} className="border-t border-kali-gray-800 hover:bg-kali-gray-800/30">
                              <td className="py-2 px-4 text-white font-mono">{port.port}</td>
                              <td className="py-2 px-4 text-kali-gray-300">{port.protocol}</td>
                              <td className="py-2 px-4">
                                <span className={`status-indicator ${
                                  port.state === 'open' ? 'status-online' :
                                  port.state === 'closed' ? 'status-offline' :
                                  'status-warning'
                                }`}>
                                  {port.state}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-kali-gray-300">{port.service}</td>
                              <td className="py-2 px-4 text-kali-gray-400 text-xs">{port.version}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NmapScanner;
