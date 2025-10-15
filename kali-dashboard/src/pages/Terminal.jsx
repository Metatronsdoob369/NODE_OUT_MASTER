import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, actions } from '../contexts/AppContext';

const Terminal = () => {
  const dispatch = useAppDispatch();
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'Kali Linux Terminal Emulator v1.0', timestamp: new Date() },
    { type: 'info', text: 'Welcome to the Kali Dashboard Terminal Interface', timestamp: new Date() },
    { type: 'info', text: 'Type "help" for available commands', timestamp: new Date() },
    { type: 'prompt', text: 'kali@dashboard:~$ ', timestamp: new Date() }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('/home/kali');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Mock file system
  const fileSystem = {
    '/': {
      type: 'directory',
      contents: ['home', 'etc', 'var', 'usr', 'tmp']
    },
    '/home': {
      type: 'directory',
      contents: ['kali']
    },
    '/home/kali': {
      type: 'directory',
      contents: ['Desktop', 'Documents', 'Downloads', 'scripts', '.bashrc', '.profile']
    },
    '/home/kali/Desktop': {
      type: 'directory',
      contents: ['notes.txt', 'scan_results.json']
    },
    '/home/kali/scripts': {
      type: 'directory',
      contents: ['port_scanner.py', 'hash_cracker.sh', 'network_enum.py']
    },
    '/home/kali/Documents': {
      type: 'directory',
      contents: ['report.pdf', 'targets.txt']
    },
    '/home/kali/Downloads': {
      type: 'directory',
      contents: ['exploit.py', 'wordlist.txt', 'payload.exe']
    }
  };

  // Mock processes
  const mockProcesses = [
    { pid: 1234, name: 'nmap', cpu: '15.2%', mem: '2.1%', command: 'nmap -sS 192.168.1.0/24' },
    { pid: 5678, name: 'metasploit', cpu: '8.7%', mem: '12.3%', command: 'msfconsole' },
    { pid: 9012, name: 'wireshark', cpu: '3.4%', mem: '8.9%', command: 'wireshark -i eth0' },
    { pid: 3456, name: 'burpsuite', cpu: '5.1%', mem: '15.6%', command: 'java -jar burpsuite.jar' }
  ];

  // Execute command
  const executeCommand = (command) => {
    const newOutput = [...terminalOutput];
    const prompt = `kali@dashboard:${currentDirectory}$ `;
    newOutput.push({ type: 'command', text: `${prompt}${command}`, timestamp: new Date() });

    const args = command.trim().split(' ');
    const cmd = args[0].toLowerCase();

    try {
      switch (cmd) {
        case '':
          // Empty command
          break;

        case 'help':
          newOutput.push({ type: 'info', text: 'Available commands:', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  ls, ll          - List directory contents', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  cd <dir>        - Change directory', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  pwd             - Print working directory', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  cat <file>      - Display file contents', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  ps              - List running processes', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  whoami          - Display current user', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  uname -a        - System information', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  ifconfig        - Network interface info', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  netstat -tulpn  - Network connections', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  nmap <target>   - Network scan (stub)', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  clear           - Clear terminal', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  history         - Command history', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '  exit            - Exit terminal', timestamp: new Date() });
          break;

        case 'ls':
        case 'll':
          const currentDir = fileSystem[currentDirectory];
          if (currentDir && currentDir.type === 'directory') {
            if (cmd === 'll') {
              newOutput.push({ type: 'info', text: 'total 8', timestamp: new Date() });
              currentDir.contents.forEach(item => {
                const isDir = fileSystem[`${currentDirectory}/${item}`]?.type === 'directory';
                const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = isDir ? '4096' : Math.floor(Math.random() * 10000);
                const date = 'Oct 15 17:30';
                newOutput.push({ 
                  type: 'info', 
                  text: `${permissions} 1 kali kali ${size.toString().padStart(8)} ${date} ${item}`, 
                  timestamp: new Date() 
                });
              });
            } else {
              const items = currentDir.contents.join('  ');
              newOutput.push({ type: 'info', text: items, timestamp: new Date() });
            }
          } else {
            newOutput.push({ type: 'error', text: 'ls: cannot access directory', timestamp: new Date() });
          }
          break;

        case 'pwd':
          newOutput.push({ type: 'info', text: currentDirectory, timestamp: new Date() });
          break;

        case 'cd':
          const targetDir = args[1];
          if (!targetDir || targetDir === '~') {
            setCurrentDirectory('/home/kali');
          } else if (targetDir === '..') {
            const parentDir = currentDirectory.split('/').slice(0, -1).join('/') || '/';
            setCurrentDirectory(parentDir);
          } else if (targetDir.startsWith('/')) {
            if (fileSystem[targetDir]?.type === 'directory') {
              setCurrentDirectory(targetDir);
            } else {
              newOutput.push({ type: 'error', text: `cd: ${targetDir}: No such file or directory`, timestamp: new Date() });
            }
          } else {
            const fullPath = currentDirectory === '/' ? `/${targetDir}` : `${currentDirectory}/${targetDir}`;
            if (fileSystem[fullPath]?.type === 'directory') {
              setCurrentDirectory(fullPath);
            } else {
              newOutput.push({ type: 'error', text: `cd: ${targetDir}: No such file or directory`, timestamp: new Date() });
            }
          }
          break;

        case 'whoami':
          newOutput.push({ type: 'info', text: 'kali', timestamp: new Date() });
          break;

        case 'uname':
          if (args[1] === '-a') {
            newOutput.push({ type: 'info', text: 'Linux kali 5.18.0-kali7-amd64 #1 SMP PREEMPT_DYNAMIC Debian 5.18.16-1kali1 (2022-08-18) x86_64 GNU/Linux', timestamp: new Date() });
          } else {
            newOutput.push({ type: 'info', text: 'Linux', timestamp: new Date() });
          }
          break;

        case 'ps':
          newOutput.push({ type: 'info', text: '  PID TTY          TIME CMD', timestamp: new Date() });
          mockProcesses.forEach(proc => {
            newOutput.push({ 
              type: 'info', 
              text: `${proc.pid.toString().padStart(5)} pts/0    00:00:01 ${proc.name}`, 
              timestamp: new Date() 
            });
          });
          break;

        case 'ifconfig':
          newOutput.push({ type: 'info', text: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '        RX packets 1234  bytes 567890 (554.5 KiB)', timestamp: new Date() });
          newOutput.push({ type: 'info', text: '        TX packets 987  bytes 123456 (120.5 KiB)', timestamp: new Date() });
          break;

        case 'netstat':
          if (args.includes('-tulpn')) {
            newOutput.push({ type: 'info', text: 'Active Internet connections (only servers)', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN      5678/node', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      9012/apache2', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'udp        0      0 0.0.0.0:53              0.0.0.0:*                           3456/dnsmasq', timestamp: new Date() });
          } else {
            newOutput.push({ type: 'info', text: 'Active Internet connections', timestamp: new Date() });
          }
          break;

        case 'nmap':
          const target = args[1];
          if (!target) {
            newOutput.push({ type: 'error', text: 'nmap: missing target specification', timestamp: new Date() });
          } else {
            newOutput.push({ type: 'info', text: `Starting Nmap scan on ${target}...`, timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'This is a stub - use the Nmap Scanner page for full functionality', timestamp: new Date() });
            
            // Add notification
            dispatch(actions.addNotification({
              type: 'info',
              message: `Nmap scan stub executed for ${target}. Use Nmap Scanner page for full scans.`
            }));
          }
          break;

        case 'cat':
          const filename = args[1];
          if (!filename) {
            newOutput.push({ type: 'error', text: 'cat: missing file operand', timestamp: new Date() });
          } else if (filename === '.bashrc') {
            newOutput.push({ type: 'info', text: '# ~/.bashrc: executed by bash(1) for non-login shells.', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'export PATH=$PATH:/usr/local/bin', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'alias ll="ls -alF"', timestamp: new Date() });
            newOutput.push({ type: 'info', text: 'alias la="ls -A"', timestamp: new Date() });
          } else if (filename === 'notes.txt') {
            newOutput.push({ type: 'info', text: 'Penetration Testing Notes', timestamp: new Date() });
            newOutput.push({ type: 'info', text: '========================', timestamp: new Date() });
            newOutput.push({ type: 'info', text: '- Target network: 192.168.1.0/24', timestamp: new Date() });
            newOutput.push({ type: 'info', text: '- Found open ports: 22, 80, 443', timestamp: new Date() });
            newOutput.push({ type: 'info', text: '- Potential vulnerabilities identified', timestamp: new Date() });
          } else {
            newOutput.push({ type: 'error', text: `cat: ${filename}: No such file or directory`, timestamp: new Date() });
          }
          break;

        case 'history':
          commandHistory.forEach((cmd, index) => {
            newOutput.push({ type: 'info', text: `${(index + 1).toString().padStart(4)} ${cmd}`, timestamp: new Date() });
          });
          break;

        case 'clear':
          setTerminalOutput([
            { type: 'prompt', text: `kali@dashboard:${currentDirectory}$ `, timestamp: new Date() }
          ]);
          return;

        case 'exit':
          newOutput.push({ type: 'info', text: 'Terminal session ended.', timestamp: new Date() });
          dispatch(actions.addNotification({
            type: 'info',
            message: 'Terminal session ended'
          }));
          break;

        default:
          newOutput.push({ type: 'error', text: `${cmd}: command not found`, timestamp: new Date() });
          break;
      }
    } catch (error) {
      newOutput.push({ type: 'error', text: `Error executing command: ${error.message}`, timestamp: new Date() });
    }

    // Add new prompt
    newOutput.push({ type: 'prompt', text: `kali@dashboard:${currentDirectory}$ `, timestamp: new Date() });
    setTerminalOutput(newOutput);

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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for directories
      const currentDir = fileSystem[currentDirectory];
      if (currentDir && commandInput.startsWith('cd ')) {
        const partial = commandInput.substring(3);
        const matches = currentDir.contents.filter(item => 
          item.startsWith(partial) && fileSystem[`${currentDirectory}/${item}`]?.type === 'directory'
        );
        if (matches.length === 1) {
          setCommandInput(`cd ${matches[0]}`);
        }
      }
    }
  };

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Terminal</h1>
          <p className="text-kali-gray-400 mt-1">
            Interactive command-line interface
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-kali-dark' : ''}`}>
        <div className="card h-full">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-kali-green rounded-full"></div>
              </div>
              <span className="text-sm text-kali-gray-400 ml-4">kali@dashboard: {currentDirectory}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kali-green rounded-full animate-pulse"></div>
              <span className="text-sm text-kali-gray-400">Active</span>
            </div>
          </div>

          <div 
            className={`bg-black rounded-lg p-4 font-mono text-sm cursor-text ${
              isFullscreen ? 'h-full' : 'h-96'
            }`}
            onClick={handleTerminalClick}
          >
            <div ref={terminalRef} className="h-full overflow-y-auto mb-4">
              {terminalOutput.map((line, index) => (
                <div key={index} className={`${
                  line.type === 'command' ? 'text-white' :
                  line.type === 'error' ? 'text-red-400' :
                  line.type === 'prompt' ? 'text-kali-green' :
                  'text-kali-gray-300'
                } ${line.type === 'prompt' && index === terminalOutput.length - 1 ? 'flex items-center' : ''}`}>
                  {line.type === 'prompt' && index === terminalOutput.length - 1 ? (
                    <form onSubmit={handleCommandSubmit} className="flex items-center w-full">
                      <span className="text-kali-green mr-2">{line.text}</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-white outline-none"
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <span className="text-white animate-terminal-blink">█</span>
                    </form>
                  ) : (
                    line.text
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Info */}
      {!isFullscreen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Commands */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Quick Commands</h3>
            </div>
            
            <div className="space-y-2">
              {[
                { cmd: 'ls -la', desc: 'List all files with details' },
                { cmd: 'ps aux', desc: 'Show running processes' },
                { cmd: 'netstat -tulpn', desc: 'Show network connections' },
                { cmd: 'ifconfig', desc: 'Network interface info' },
                { cmd: 'whoami', desc: 'Current user' },
                { cmd: 'pwd', desc: 'Current directory' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCommandInput(item.cmd);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-kali-green text-sm">{item.cmd}</code>
                    <span className="text-xs text-kali-gray-500">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">System Information</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-kali-gray-400">OS:</span>
                <span className="text-white">Kali Linux 2023.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Kernel:</span>
                <span className="text-white">5.18.0-kali7-amd64</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Shell:</span>
                <span className="text-white">bash 5.1.16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">User:</span>
                <span className="text-white">kali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Directory:</span>
                <span className="text-white font-mono text-xs">{currentDirectory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kali-gray-400">Commands:</span>
                <span className="text-white">{commandHistory.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;
