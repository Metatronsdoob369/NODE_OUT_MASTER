import React, { useState, useEffect } from 'react'
import { Shield, Zap, Target, Network, AlertTriangle, CheckCircle, Clock, Server, Terminal, Wifi, Lock, Database, Key, Bot, Bell, Settings, Moon, Sun } from 'lucide-react'
import MetasploitConsole from './components/MetasploitConsole.jsx'
import WiresharkViewer from './components/WiresharkViewer.jsx'
import BurpSuite from './components/BurpSuite.jsx'
import SQLMapInterface from './components/SQLMapInterface.jsx'
import PasswordCracker from './components/PasswordCracker.jsx'
import AIAssistant from './components/AIAssistant.jsx'
import NotificationSystem from './components/NotificationSystem.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
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

  const addNotification = (notification) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { ...notification, id }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  useEffect(() => {
    // Welcome notification
    addNotification({
      type: 'success',
      title: 'AI Dashboard Loaded',
      message: 'Enhanced security dashboard with AI assistance is ready!'
    })
  }, [])

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-gray-100 via-white to-gray-50'} ${darkMode ? 'text-green-400' : 'text-gray-800'} font-mono relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-green-400 drop-shadow-lg animate-pulse" />
                <div className="absolute inset-0 w-12 h-12 bg-green-400/20 rounded-full blur-xl"></div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  Kali Dashboard
                </h1>
                <p className={`text-lg ${darkMode ? 'text-green-300/80' : 'text-gray-600'} flex items-center gap-2`}>
                  <Bot className="w-5 h-5" />
                  AI-Enhanced Security Toolkit - Renegade Runner Integration
                </p>
              </div>
            </div>
            
            {/* Control Panel */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                className={`p-3 rounded-xl transition-all duration-300 ${aiAssistantOpen ? 'bg-green-500/20 text-green-400' : darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-100/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-105 shadow-lg`}
                title="AI Assistant"
              >
                <Bot className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-100/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-105 shadow-lg`}
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button className={`p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-100/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-105 shadow-lg`}>
                  <Bell className="w-5 h-5" />
                </button>
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce">
                    {notifications.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="mb-8">
          <nav className={`flex flex-wrap gap-2 p-2 rounded-2xl backdrop-blur-sm border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'} shadow-lg`}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                      : darkMode 
                      ? 'text-green-400 hover:bg-gray-700/50 hover:text-green-300' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  } ${isActive ? 'animate-pulse' : ''}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-spin' : ''}`} />
                  <span className="font-medium">{tab.name}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Enhanced Content Area */}
        <div className={`backdrop-blur-sm rounded-2xl p-8 border shadow-2xl transition-all duration-500 ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-black/50' 
            : 'bg-white/50 border-gray-200 shadow-gray-500/20'
        }`}>
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

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onClose={() => setAiAssistantOpen(false)}
        darkMode={darkMode}
        addNotification={addNotification}
      />

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        darkMode={darkMode}
      />
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
