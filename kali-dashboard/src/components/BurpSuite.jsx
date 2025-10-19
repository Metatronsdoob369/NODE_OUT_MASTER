import React, { useState, useEffect } from 'react'
import { Shield, Zap, Globe, Send, Eye, AlertTriangle, CheckCircle, X, Play, Square } from 'lucide-react'

function BurpSuite() {
  const [activeTab, setActiveTab] = useState('proxy')
  const [proxyRunning, setProxyRunning] = useState(false)
  const [interceptedRequests, setInterceptedRequests] = useState([])
  const [scannerResults, setScannerResults] = useState([])
  const [intruderPayloads, setIntruderPayloads] = useState([])
  const [collaboratorUrl, setCollaboratorUrl] = useState('')

  const tabs = [
    { id: 'proxy', name: 'Proxy', icon: Globe },
    { id: 'scanner', name: 'Scanner', icon: Shield },
    { id: 'intruder', name: 'Intruder', icon: Zap },
    { id: 'repeater', name: 'Repeater', icon: Send },
    { id: 'collaborator', name: 'Collaborator', icon: Eye }
  ]

  // Simulate proxy interception
  useEffect(() => {
    if (proxyRunning) {
      const interval = setInterval(() => {
        const mockRequest = generateMockRequest()
        setInterceptedRequests(prev => [mockRequest, ...prev.slice(0, 9)]) // Keep last 10
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [proxyRunning])

  const generateMockRequest = () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE']
    const hosts = ['example.com', 'api.target.com', 'admin.target.com', 'login.target.com']
    const paths = ['/', '/api/users', '/admin/panel', '/login', '/api/data']

    return {
      id: Date.now(),
      method: methods[Math.floor(Math.random() * methods.length)],
      url: `https://${hosts[Math.floor(Math.random() * hosts.length)]}${paths[Math.floor(Math.random() * paths.length)]}`,
      headers: {
        'Host': hosts[Math.floor(Math.random() * hosts.length)],
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*'
      },
      body: Math.random() > 0.7 ? '{"username":"admin","password":"password"}' : '',
      timestamp: new Date().toLocaleTimeString(),
      intercepted: true
    }
  }

  const toggleProxy = () => {
    setProxyRunning(!proxyRunning)
    if (!proxyRunning) {
      setInterceptedRequests([])
    }
  }

  const runScanner = () => {
    const mockResults = [
      { url: 'https://target.com/login', issue: 'SQL Injection', severity: 'High', confidence: 'Certain' },
      { url: 'https://target.com/api/users', issue: 'Cross-Site Scripting', severity: 'Medium', confidence: 'Firm' },
      { url: 'https://target.com/admin', issue: 'Directory Listing', severity: 'Low', confidence: 'Tentative' }
    ]
    setScannerResults(mockResults)
  }

  const runIntruder = () => {
    const payloads = [
      "' OR '1'='1",
      "<script>alert('xss')</script>",
      "../../../etc/passwd",
      "admin'--",
      "<img src=x onerror=alert(1)>"
    ]
    setIntruderPayloads(payloads)
  }

  const generateCollaborator = () => {
    const randomId = Math.random().toString(36).substring(2, 15)
    setCollaboratorUrl(`https://${randomId}.burpcollaborator.net`)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-green-600">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Burp Suite Professional
        </h2>
        <p className="text-sm text-gray-400 mt-1">Web vulnerability scanner • Proxy interceptor • Attack automation</p>
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
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'proxy' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Proxy Interceptor</h3>
              <button
                onClick={toggleProxy}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium ${
                  proxyRunning
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {proxyRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {proxyRunning ? 'Stop Intercept' : 'Start Intercept'}
              </button>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Proxy Configuration</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Listen Interface: 127.0.0.1:8080</div>
                <div>Upstream Proxy: None</div>
                <div>SSL Pass Through: Enabled</div>
                <div>Status: {proxyRunning ? 'Running' : 'Stopped'}</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h4 className="font-semibold">Intercepted Requests ({interceptedRequests.length})</h4>
              </div>
              <div className="max-h-96 overflow-auto">
                {interceptedRequests.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start proxy interception to see requests</p>
                  </div>
                ) : (
                  interceptedRequests.map((req) => (
                    <div key={req.id} className="p-4 border-b border-gray-700 hover:bg-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            req.method === 'GET' ? 'bg-blue-600' :
                            req.method === 'POST' ? 'bg-green-600' :
                            'bg-yellow-600'
                          }`}>
                            {req.method}
                          </span>
                          <span className="font-mono text-sm">{req.url}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                            Forward
                          </button>
                          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                            Drop
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {req.timestamp} • {Object.keys(req.headers).length} headers
                        {req.body && ` • ${req.body.length} bytes body`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Scanner</h3>
              <button
                onClick={runScanner}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white"
              >
                <Shield className="w-4 h-4" />
                Run Scan
              </button>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Scan Configuration</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Target: https://target.com</div>
                <div>Scan Type: Active</div>
                <div>Issue Threshold: Information</div>
                <div>Thread Count: 10</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h4 className="font-semibold">Scan Results ({scannerResults.length})</h4>
              </div>
              <div className="max-h-96 overflow-auto">
                {scannerResults.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Run active scan to see vulnerabilities</p>
                  </div>
                ) : (
                  scannerResults.map((result, i) => (
                    <div key={i} className="p-4 border-b border-gray-700 hover:bg-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className={`w-5 h-5 ${
                            result.severity === 'High' ? 'text-red-500' :
                            result.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                          }`} />
                          <div>
                            <div className="font-semibold">{result.issue}</div>
                            <div className="text-sm text-gray-400">{result.url}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            result.severity === 'High' ? 'bg-red-600' :
                            result.severity === 'Medium' ? 'bg-yellow-600' : 'bg-blue-600'
                          }`}>
                            {result.severity}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{result.confidence}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'intruder' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Intruder</h3>
              <button
                onClick={runIntruder}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white"
              >
                <Zap className="w-4 h-4" />
                Start Attack
              </button>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Attack Configuration</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Target: https://target.com/login</div>
                <div>Attack Type: Sniper</div>
                <div>Payload Count: {intruderPayloads.length}</div>
                <div>Thread Count: 5</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h4 className="font-semibold">Payloads ({intruderPayloads.length})</h4>
              </div>
              <div className="max-h-96 overflow-auto">
                {intruderPayloads.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Configure payloads and start attack</p>
                  </div>
                ) : (
                  intruderPayloads.map((payload, i) => (
                    <div key={i} className="p-3 border-b border-gray-700 hover:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm text-green-400">
                          {payload}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Status: Pending</span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'repeater' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Repeater</h3>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Request</label>
                <textarea
                  className="w-full h-32 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-green-400 font-mono text-sm"
                  defaultValue={`GET /api/users HTTP/1.1
Host: target.com
User-Agent: Mozilla/5.0
Accept: application/json`}
                />
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white">
                Send Request
              </button>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="mb-2">
                <span className="text-sm font-medium">Response</span>
              </div>
              <div className="bg-gray-900 p-3 rounded font-mono text-sm text-green-400 max-h-64 overflow-auto">
                {`HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 42

{"users": [{"id": 1, "name": "admin"}]}`}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collaborator' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Collaborator</h3>
              <button
                onClick={generateCollaborator}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white"
              >
                <Eye className="w-4 h-4" />
                Generate URL
              </button>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Collaborator URL</div>
              <div className="font-mono text-green-400 bg-gray-900 p-3 rounded border border-gray-600">
                {collaboratorUrl || 'Click "Generate URL" to create a Collaborator payload'}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="mb-2">
                <span className="text-sm font-medium">Interactions (0)</span>
              </div>
              <div className="text-center py-8 text-gray-400">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Collaborator interactions will appear here</p>
                <p className="text-sm mt-2">Use the generated URL in your payloads</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BurpSuite
