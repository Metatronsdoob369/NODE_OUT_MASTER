import React, { useState, useEffect, useRef } from 'react';
import { useAppState, useAppDispatch, actions } from '../contexts/AppContext';

const MetasploitConsole = () => {
  const { sessions } = useAppState();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('exploits');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'info', text: 'Metasploit Framework Console v6.3.25-dev', timestamp: new Date() },
    { type: 'info', text: 'Welcome to the Kali Dashboard Metasploit Interface', timestamp: new Date() },
    { type: 'prompt', text: 'msf6 > ', timestamp: new Date() }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleRef = useRef(null);

  // Mock exploit modules
  const exploitModules = [
    {
      name: 'exploit/windows/smb/ms17_010_eternalblue',
      description: 'MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption',
      rank: 'average',
      date: '2017-03-14',
      targets: ['Windows 7', 'Windows Server 2008', 'Windows Server 2012'],
      references: ['CVE-2017-0143', 'CVE-2017-0144', 'CVE-2017-0145']
    },
    {
      name: 'exploit/multi/handler',
      description: 'Generic Payload Handler',
      rank: 'manual',
      date: '2003-07-14',
      targets: ['Generic'],
      references: []
    },
    {
      name: 'exploit/linux/http/apache_mod_cgi_bash_env_exec',
      description: 'Apache mod_cgi Bash Environment Variable Code Injection (Shellshock)',
      rank: 'excellent',
      date: '2014-09-24',
      targets: ['Linux', 'Unix'],
      references: ['CVE-2014-6271', 'CVE-2014-6278']
    },
    {
      name: 'exploit/windows/rdp/cve_2019_0708_bluekeep_rce',
      description: 'CVE-2019-0708 BlueKeep RDP Remote Windows Kernel Use After Free',
      rank: 'manual',
      date: '2019-05-14',
      targets: ['Windows 7', 'Windows Server 2008'],
      references: ['CVE-2019-0708']
    },
    {
      name: 'exploit/windows/http/rejetto_hfs_exec',
      description: 'Rejetto HttpFileServer Remote Command Execution',
      rank: 'excellent',
      date: '2014-09-11',
      targets: ['Windows'],
      references: ['CVE-2014-6287']
    }
  ];

  // Mock payload modules
  const payloadModules = [
    {
      name: 'windows/x64/meterpreter/reverse_tcp',
      description: 'Windows x64 Meterpreter (Reflective Injection), Reverse TCP Stager',
      size: 510,
      platform: 'Windows x64'
    },
    {
      name: 'windows/meterpreter/reverse_tcp',
      description: 'Windows Meterpreter (Reflective Injection), Reverse TCP Stager',
      size: 354,
      platform: 'Windows x86'
    },
    {
      name: 'linux/x64/meterpreter/reverse_tcp',
      description: 'Linux Mettle x64, Reverse TCP Stager',
      size: 130,
      platform: 'Linux x64'
    },
    {
      name: 'cmd/windows/reverse_powershell',
      description: 'Windows Command Shell, Reverse TCP (via Powershell)',
      size: 1285,
      platform: 'Windows'
    },
    {
      name: 'php/meterpreter_reverse_tcp',
      description: 'PHP Meterpreter, Reverse TCP Inline',
      size: 1112,
      platform: 'PHP'
    }
  ];

  // Mock active sessions
  const mockSessions = [
    {
      id: 1,
      type: 'meterpreter',
      host: '192.168.1.100',
      platform: 'Windows Server 2019',
      user: 'SYSTEM',
      established: new Date(Date.now() - 30 * 60 * 1000),
      lastActivity: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 2,
      type: 'shell',
      host: '192.168.1.50',
      platform: 'Linux Ubuntu 20.04',
      user: 'www-data',
      established: new Date(Date.now() - 15 * 60 * 1000),
      lastActivity: new Date(Date.now() - 2 * 60 * 1000)
    }
  ];

  const tabs = [
    { id: 'exploits', name: 'Exploits', count: exploitModules.length },
    { id: 'payloads', name: 'Payloads', count: payloadModules.length },
    { id: 'sessions', name: 'Sessions', count: mockSessions.length },
    { id: 'console', name: 'Console', count: null }
  ];

  // Filter modules based on search term
  const filteredExploits = exploitModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayloads = payloadModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock command execution
  const executeCommand = (command) => {
    const newOutput = [...consoleOutput];
    newOutput.push({ type: 'command', text: `msf6 > ${command}`, timestamp: new Date() });

    // Mock command responses
    if (command.startsWith('use ')) {
      const moduleName = command.substring(4);
      newOutput.push({ type: 'success', text: `Using module: ${moduleName}`, timestamp: new Date() });
      setSelectedModule(moduleName);
    } else if (command === 'show options') {
      newOutput.push({ type: 'info', text: 'Module options (exploit/windows/smb/ms17_010_eternalblue):', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '   Name     Current Setting  Required  Description', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '   ----     ---------------  --------  -----------', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '   RHOSTS                    yes       The target host(s)', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '   RPORT    445              yes       The target port', timestamp: new Date() });
    } else if (command.startsWith('set ')) {
      const [, option, value] = command.split(' ');
      newOutput.push({ type: 'success', text: `${option} => ${value}`, timestamp: new Date() });
    } else if (command === 'exploit' || command === 'run') {
      newOutput.push({ type: 'info', text: '[*] Started reverse TCP handler on 192.168.1.10:4444', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '[*] 192.168.1.100:445 - Connecting to target for exploitation.', timestamp: new Date() });
      newOutput.push({ type: 'success', text: '[+] 192.168.1.100:445 - Connection established for exploitation.', timestamp: new Date() });
      newOutput.push({ type: 'success', text: '[*] Meterpreter session 3 opened (192.168.1.10:4444 -> 192.168.1.100:49158)', timestamp: new Date() });
      
      // Add mock session
      dispatch(actions.addSession({
        id: Date.now(),
        type: 'meterpreter',
        host: '192.168.1.100',
        platform: 'Windows',
        user: 'SYSTEM',
        established: new Date()
      }));
    } else if (command === 'sessions -l') {
      newOutput.push({ type: 'info', text: 'Active sessions', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '===============', timestamp: new Date() });
      mockSessions.forEach(session => {
        newOutput.push({ 
          type: 'info', 
          text: `  ${session.id}  ${session.type}  ${session.host}  ${session.user}  ${session.platform}`, 
          timestamp: new Date() 
        });
      });
    } else if (command === 'help') {
      newOutput.push({ type: 'info', text: 'Core Commands', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '=============', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    Command       Description', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    -------       -----------', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    use           Select a module', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    show          Show module information', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    set           Set a variable value', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    exploit       Launch the exploit', timestamp: new Date() });
      newOutput.push({ type: 'info', text: '    sessions      Manage sessions', timestamp: new Date() });
    } else if (command.trim() === '') {
      // Empty command, just show prompt
    } else {
      newOutput.push({ type: 'error', text: `Unknown command: ${command}`, timestamp: new Date() });
    }

    newOutput.push({ type: 'prompt', text: 'msf6 > ', timestamp: new Date() });
    setConsoleOutput(newOutput);

    // Add to command history
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    executeCommand(commandInput);
    setCommandInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommandInput('');
        } else {
          setHistoryIndex(newIndex);
          setCommandInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const getRankColor = (rank) => {
    switch (rank) {
      case 'excellent': return 'text-kali-green';
      case 'great': return 'text-blue-400';
      case 'good': return 'text-kali-cyan';
      case 'normal': return 'text-yellow-400';
      case 'average': return 'text-orange-400';
      case 'low': return 'text-red-400';
      case 'manual': return 'text-kali-gray-400';
      default: return 'text-kali-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Metasploit Console</h1>
          <p className="text-kali-gray-400 mt-1">
            Exploit development and penetration testing framework
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-kali-green rounded-full animate-pulse"></div>
            <span className="text-sm text-kali-gray-400">Framework Ready</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-kali-gray-800">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-kali-green text-kali-green'
                  : 'border-transparent text-kali-gray-400 hover:text-kali-gray-300 hover:border-kali-gray-300'
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className="ml-2 bg-kali-gray-800 text-kali-gray-300 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'exploits' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Exploit Modules</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search exploits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field text-sm py-1 px-3 w-64"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredExploits.map((exploit, index) => (
                  <div key={index} className="p-4 border border-kali-gray-700 rounded-lg hover:border-kali-green/50 transition-colors cursor-pointer"
                       onClick={() => executeCommand(`use ${exploit.name}`)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-mono text-sm">{exploit.name}</h4>
                        <p className="text-kali-gray-300 text-sm mt-1">{exploit.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${getRankColor(exploit.rank)} bg-current/10`}>
                            {exploit.rank}
                          </span>
                          <span className="text-xs text-kali-gray-500">{exploit.date}</span>
                          <span className="text-xs text-kali-gray-500">{exploit.targets.join(', ')}</span>
                        </div>
                      </div>
                      <button className="btn-primary text-xs px-3 py-1">
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payloads' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Payload Modules</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field text-sm py-1 px-3 w-64"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPayloads.map((payload, index) => (
                  <div key={index} className="p-4 border border-kali-gray-700 rounded-lg hover:border-kali-cyan/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-mono text-sm">{payload.name}</h4>
                        <p className="text-kali-gray-300 text-sm mt-1">{payload.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-kali-cyan bg-kali-cyan/10 px-2 py-1 rounded">
                            {payload.size} bytes
                          </span>
                          <span className="text-xs text-kali-gray-500">{payload.platform}</span>
                        </div>
                      </div>
                      <button className="btn-secondary text-xs px-3 py-1">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                <button 
                  onClick={() => executeCommand('sessions -l')}
                  className="btn-secondary text-xs px-3 py-1"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-3">
                {mockSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-kali-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-kali-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-kali-gray-400">No active sessions</p>
                  </div>
                ) : (
                  mockSessions.map((session) => (
                    <div key={session.id} className="p-4 border border-kali-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-kali-green/20 rounded-full flex items-center justify-center">
                            <span className="text-kali-green font-bold">{session.id}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{session.host}</h4>
                            <p className="text-kali-gray-400 text-sm">{session.platform} - {session.user}</p>
                            <p className="text-kali-gray-500 text-xs">
                              Established: {session.established.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`status-indicator ${
                            session.type === 'meterpreter' ? 'status-online' : 'status-warning'
                          }`}>
                            {session.type}
                          </span>
                          <button className="btn-primary text-xs px-3 py-1">
                            Interact
                          </button>
                          <button className="btn-danger text-xs px-3 py-1">
                            Kill
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Metasploit Console</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-kali-green rounded-full animate-pulse"></div>
                  <span className="text-sm text-kali-gray-400">Interactive</span>
                </div>
              </div>

              <div className="bg-black rounded-lg p-4 font-mono text-sm">
                <div ref={consoleRef} className="h-96 overflow-y-auto mb-4">
                  {consoleOutput.map((line, index) => (
                    <div key={index} className={`${
                      line.type === 'command' ? 'text-white' :
                      line.type === 'success' ? 'text-kali-green' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'prompt' ? 'text-kali-green' :
                      'text-kali-gray-300'
                    }`}>
                      {line.text}
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleCommandSubmit} className="flex items-center">
                  <span className="text-kali-green mr-2">msf6 &gt;</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white outline-none"
                    placeholder="Enter command..."
                    autoFocus
                  />
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => executeCommand('help')}
                className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-kali-gray-300">Show Help</span>
                  <svg className="w-4 h-4 text-kali-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </button>
              
              <button 
                onClick={() => executeCommand('sessions -l')}
                className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-kali-gray-300">List Sessions</span>
                  <svg className="w-4 h-4 text-kali-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>
              
              <button className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-kali-gray-300">Update Framework</span>
                  <svg className="w-4 h-4 text-kali-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Module Info */}
          {selectedModule && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Selected Module</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-kali-gray-400 mb-1">Module:</div>
                  <div className="text-sm text-white font-mono">{selectedModule}</div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => executeCommand('show options')}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Show Options
                  </button>
                  <button 
                    onClick={() => executeCommand('exploit')}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    Exploit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Framework Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Framework Stats</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Exploits:</span>
                <span className="text-white">{exploitModules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Payloads:</span>
                <span className="text-white">{payloadModules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Active Sessions:</span>
                <span className="text-kali-green">{mockSessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Framework Version:</span>
                <span className="text-white">6.3.25-dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetasploitConsole;
