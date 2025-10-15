import React, { useState, useEffect } from 'react'
import { Shield, Zap, Target, Network, AlertTriangle, CheckCircle, Clock, Server, Terminal, Wifi, Lock, Database, Key } from 'lucide-react'
import MetasploitConsole from './components/MetasploitConsole.jsx'
import WiresharkViewer from './components/WiresharkViewer.jsx'
import BurpSuite from './components/BurpSuite.jsx'
import SQLMapInterface from './components/SQLMapInterface.jsx'
import PasswordCracker from './components/PasswordCracker.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [mcpStatus, setMcpStatus] = useState({
    'security-education': 'unknown',
    'kali-info': 'unknown',
    'mcp-auditor': 'unknown',
    'nmap-scanner': 'unknown'
  })

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'nmap', name: 'Nmap Scanner', icon: Network },
    { id: 'metasploit', name: 'Metasploit', icon: Terminal },
    { id: 'wireshark', name: 'Wireshark', icon: Wifi },
    { id: 'burp', name: 'Burp Suite', icon: Lock },
    { id: 'sqlmap', name: 'SQLMap', icon: Database },
    { id: 'password', name: 'Password Cracker', icon: Key },
    { id: 'auditor', name: 'MCP Auditor', icon: Target },
    { id: 'education', name: 'Security Education', icon: Zap },
    { id: 'kali', name: 'Kali Info', icon: Server }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10" />
            Kali Dashboard
          </h1>
          <p className="text-green-300">MCP Security Toolkit - Renegade Runner Integration</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
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
        <div className="bg-gray-800 rounded-lg p-6 border border-green-600">
          {activeTab === 'overview' && <OverviewTab mcpStatus={mcpStatus} />}
          {activeTab === 'nmap' && <NmapTab />}
          {activeTab === 'metasploit' && <MetasploitConsole />}
          {activeTab === 'wireshark' && <WiresharkViewer />}
          {activeTab === 'burp' && <BurpSuite />}
          {activeTab === 'sqlmap' && <SQLMapInterface />}
          {activeTab === 'password' && <PasswordCracker />}
          {activeTab === 'auditor' && <AuditorTab />}
          {activeTab === 'education' && <EducationTab />}
          {activeTab === 'kali' && <KaliTab />}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ mcpStatus }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>

      {/* MCP Server Status */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">MCP Server Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(mcpStatus).map(([server, status]) => (
            <div key={server} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{server}</span>
                <div className={`w-3 h-3 rounded-full ${
                  status === 'connected' ? 'bg-green-500' :
                  status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
              </div>
              <span className="text-sm text-gray-400 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Metrics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Security Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">OWASP Compliance</span>
            </div>
            <span className="text-2xl font-bold text-green-500">100%</span>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Scan Efficiency</span>
            </div>
            <span className="text-2xl font-bold text-blue-500">O(n)</span>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-red-500" />
              <span className="font-medium">Vuln Closure</span>
            </div>
            <span className="text-2xl font-bold text-red-500">99%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <div className="bg-gray-700 p-3 rounded flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Nmap triad augmentation completed</span>
            <span className="text-gray-400 text-sm ml-auto">2 min ago</span>
          </div>
          <div className="bg-gray-700 p-3 rounded flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Multi-chain RPC validation successful</span>
            <span className="text-gray-400 text-sm ml-auto">5 min ago</span>
          </div>
          <div className="bg-gray-700 p-3 rounded flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Grover quantum optimization deployed</span>
            <span className="text-gray-400 text-sm ml-auto">8 min ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NmapTab() {
  const [target, setTarget] = useState('')
  const [options, setOptions] = useState('-sS -p 80,443')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const runScan = async () => {
    setLoading(true)
    // Simulate MCP call
    setTimeout(() => {
      setResults({
        target,
        ports: [
          { port: 80, state: 'open', service: 'http' },
          { port: 443, state: 'open', service: 'https' },
          { port: 22, state: 'closed', service: 'ssh' }
        ],
        risk: 'LOW',
        timestamp: new Date().toISOString()
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Nmap Network Scanner</h2>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Target</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="192.168.1.0/24 or example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Options</label>
            <input
              type="text"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="-sS -p 80,443"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={runScan}
          disabled={loading || !target}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium transition-colors"
        >
          {loading ? 'Scanning...' : 'Run Scan'}
        </button>
      </div>

      {results && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Scan Results</h3>
          <div className="mb-3">
            <span className="text-gray-400">Target:</span> {results.target}
          </div>
          <div className="mb-3">
            <span className="text-gray-400">Risk Level:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              results.risk === 'LOW' ? 'bg-green-600' :
              results.risk === 'MEDIUM' ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {results.risk}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Open Ports:</span>
            <div className="mt-2 space-y-1">
              {results.ports.map((port, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-16">Port {port.port}</span>
                  <span className={`px-2 py-1 rounded ${
                    port.state === 'open' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {port.state}
                  </span>
                  <span>{port.service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Placeholder components for other tabs
function AuditorTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">MCP Security Auditor</h2>
      <p className="text-gray-400">Security auditing tools for MCP servers...</p>
    </div>
  )
}

function EducationTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Security Education</h2>
      <p className="text-gray-400">Educational resources and security training...</p>
    </div>
  )
}

function KaliTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kali Linux Information</h2>
      <p className="text-gray-400">Kali Linux tools and penetration testing resources...</p>
    </div>
  )
}

export default App
