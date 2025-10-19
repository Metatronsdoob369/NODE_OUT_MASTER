import React, { useState, useEffect } from 'react'
import { Terminal, Zap, Server, Shield, AlertTriangle } from 'lucide-react'

function MetasploitConsole() {
  const [activeTab, setActiveTab] = useState('console')
  const [consoleOutput, setConsoleOutput] = useState([
    'msf6 > ',
    'Metasploit Framework Console - Ready for commands',
    'Type "help" for available commands',
    ''
  ])
  const [command, setCommand] = useState('')
  const [sessions, setSessions] = useState([])
  const [exploits, setExploits] = useState([])

  const tabs = [
    { id: 'console', name: 'Console', icon: Terminal },
    { id: 'exploits', name: 'Exploits', icon: Zap },
    { id: 'sessions', name: 'Sessions', icon: Server },
    { id: 'payloads', name: 'Payloads', icon: Shield }
  ]

  const handleCommand = async (cmd) => {
    // Simulate Metasploit command execution
    const newOutput = [...consoleOutput]

    if (cmd.toLowerCase() === 'help') {
      newOutput.push('> help')
      newOutput.push('Available commands:')
      newOutput.push('  use <module>     - Select a module')
      newOutput.push('  show options     - Show module options')
      newOutput.push('  set <option>     - Set module option')
      newOutput.push('  exploit          - Run the exploit')
      newOutput.push('  sessions -l      - List active sessions')
      newOutput.push('  sessions -i <id> - Interact with session')
      newOutput.push('')
    } else if (cmd.startsWith('use ')) {
      const module = cmd.split(' ')[1]
      newOutput.push(`> ${cmd}`)
      newOutput.push(`[*] Using ${module}`)
      newOutput.push('[*] Module options:')
      newOutput.push('')
      newOutput.push('Name       Current Setting  Required  Description')
      newOutput.push('----       ---------------  --------  -----------')
      newOutput.push('RHOSTS                      yes       The target host(s)')
      newOutput.push('RPORT      445              yes       The target port')
      newOutput.push('')
    } else if (cmd === 'show exploits') {
      newOutput.push('> show exploits')
      newOutput.push('[*] Loading exploit modules...')
      // Simulate loading exploits
      setTimeout(() => {
        setExploits([
          { name: 'exploit/windows/smb/ms17_010_eternalblue', description: 'EternalBlue SMB Remote Windows Kernel Pool Corruption' },
          { name: 'exploit/multi/http/struts2_content_type_ognl', description: 'Apache Struts2 Content-Type Header OGNL Injection' },
          { name: 'exploit/unix/webapp/php_exec', description: 'PHP CGI Argument Injection' }
        ])
      }, 1000)
    } else {
      newOutput.push(`> ${cmd}`)
      newOutput.push(`[*] Command executed: ${cmd}`)
      newOutput.push('')
    }

    newOutput.push('msf6 > ')
    setConsoleOutput(newOutput)
    setCommand('')
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-green-600">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Metasploit Framework Console
        </h2>
        <p className="text-sm text-gray-400 mt-1">3500+ exploits • Session management • Payload generation</p>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-black'
                    : 'text-green-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'console' && (
          <div className="h-full flex flex-col">
            {/* Console Output */}
            <div className="flex-1 p-4 overflow-auto bg-black font-mono text-sm">
              {consoleOutput.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>

            {/* Command Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (command.trim()) handleCommand(command.trim())
                }}
                className="flex gap-2"
              >
                <span className="text-green-400 font-mono">msf6 &gt;</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                  placeholder="Enter Metasploit command..."
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 text-black rounded text-sm hover:bg-green-700"
                >
                  Execute
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'exploits' && (
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search exploits..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-green-400"
              />
            </div>
            <div className="space-y-2">
              {exploits.length > 0 ? (
                exploits.map((exploit, i) => (
                  <div key={i} className="bg-gray-800 p-3 rounded border border-gray-700">
                    <div className="font-semibold text-green-400">{exploit.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{exploit.description}</div>
                    <button className="mt-2 px-3 py-1 bg-green-600 text-black rounded text-sm hover:bg-green-700">
                      Use Exploit
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Type "show exploits" in console to load modules</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
            {sessions.length > 0 ? (
              <div className="space-y-2">
                {sessions.map((session, i) => (
                  <div key={i} className="bg-gray-800 p-3 rounded border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">Session {session.id}</span>
                        <span className="ml-2 text-sm text-gray-400">{session.type}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Interact
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          Kill
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active sessions</p>
                <p className="text-sm mt-2">Run exploits to create sessions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payloads' && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Payload Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <h4 className="font-semibold mb-3">Windows Payloads</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600">
                    windows/meterpreter/reverse_tcp
                  </button>
                  <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600">
                    windows/shell/reverse_tcp
                  </button>
                  <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600">
                    windows/x64/meterpreter/reverse_https
                  </button>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <h4 className="font-semibold mb-3">Linux Payloads</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600">
                    linux/x64/meterpreter/reverse_tcp
                  </button>
                  <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600">
                    linux/x86/shell/reverse_tcp
                  </button>
                  <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600">
                    linux/x64/shell/reverse_tcp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetasploitConsole
