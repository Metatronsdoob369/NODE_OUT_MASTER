import React, { useState, useEffect } from 'react'
import { Key, Wifi, Hash, Play, Square, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

function PasswordCracker() {
  const [activeTab, setActiveTab] = useState('john')
  const [hashInput, setHashInput] = useState('')
  const [hashType, setHashType] = useState('md5')
  const [wordlist, setWordlist] = useState('rockyou.txt')
  const [isCracking, setIsCracking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentAttempt, setCurrentAttempt] = useState('')
  const [results, setResults] = useState([])
  const [wifiNetworks, setWifiNetworks] = useState([])
  const [targetNetwork, setTargetNetwork] = useState('')
  const [captureFile, setCaptureFile] = useState('')

  const tabs = [
    { id: 'john', name: 'John the Ripper', icon: Key },
    { id: 'aircrack', name: 'Aircrack-ng', icon: Wifi },
    { id: 'hashcat', name: 'Hashcat', icon: Hash }
  ]

  const hashTypes = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'bcrypt', label: 'bcrypt' },
    { value: 'ntlm', label: 'NTLM' }
  ]

  const wordlists = [
    'rockyou.txt',
    'darkweb2017-top10000.txt',
    'phpbb.txt',
    'mysql.txt',
    'custom.txt'
  ]

  // Simulate hash cracking
  const startHashCracking = async () => {
    if (!hashInput) return

    setIsCracking(true)
    setProgress(0)
    setResults([])
    setCurrentAttempt('')

    const attempts = [
      'password',
      '123456',
      'admin',
      'letmein',
      'qwerty',
      'monkey',
      'dragon',
      'baseball',
      'football',
      'michael',
      'superman',
      'trustno1',
      'jennifer',
      'jordan',
      'harley'
    ]

    for (let i = 0; i < attempts.length; i++) {
      setCurrentAttempt(`Trying: ${attempts[i]}`)
      setProgress(((i + 1) / attempts.length) * 100)

      // Simulate cracking time
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

      // Random success on some attempts
      if (Math.random() > 0.7) {
        const result = {
          hash: hashInput,
          password: attempts[i],
          hashType: hashType,
          time: Math.floor(Math.random() * 300) + 10,
          method: 'Dictionary attack'
        }
        setResults([result])
        setIsCracking(false)
        return
      }
    }

    setResults([{
      hash: hashInput,
      password: 'Not found in wordlist',
      hashType: hashType,
      time: attempts.length * 0.75,
      method: 'Dictionary attack'
    }])

    setIsCracking(false)
  }

  // Simulate WiFi network scanning
  const scanWifiNetworks = () => {
    const mockNetworks = [
      { bssid: '00:11:22:33:44:55', ssid: 'HomeNetwork', channel: 6, encryption: 'WPA2', signal: -45 },
      { bssid: 'AA:BB:CC:DD:EE:FF', ssid: 'OfficeWiFi', channel: 11, encryption: 'WPA3', signal: -52 },
      { bssid: '11:22:33:44:55:66', ssid: 'GuestNetwork', channel: 1, encryption: 'WPA2', signal: -38 },
      { bssid: '77:88:99:AA:BB:CC', ssid: 'PublicWiFi', channel: 9, encryption: 'WEP', signal: -65 }
    ]
    setWifiNetworks(mockNetworks)
  }

  // Simulate WPA cracking
  const startWpaCracking = async () => {
    if (!targetNetwork || !captureFile) return

    setIsCracking(true)
    setProgress(0)
    setResults([])
    setCurrentAttempt('Initializing attack...')

    const phases = [
      'Loading capture file...',
      'Analyzing handshake...',
      'Preparing wordlist attack...',
      'Starting dictionary attack...',
      'Trying common passwords...'
    ]

    for (let i = 0; i < phases.length; i++) {
      setCurrentAttempt(phases[i])
      setProgress(((i + 1) / phases.length) * 100)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Random success
    if (Math.random() > 0.6) {
      setResults([{
        network: targetNetwork,
        password: 'password123',
        time: Math.floor(Math.random() * 1800) + 300,
        method: 'Dictionary attack',
        keyType: 'WPA2'
      }])
    } else {
      setResults([{
        network: targetNetwork,
        password: 'Not found',
        time: 3600,
        method: 'Dictionary attack',
        keyType: 'WPA2'
      }])
    }

    setIsCracking(false)
  }

  const exportResults = () => {
    const data = JSON.stringify(results, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cracking-results-${new Date().toISOString().slice(0, 19)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-green-600">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Key className="w-6 h-6" />
          Password Cracking Suite
        </h2>
        <p className="text-sm text-gray-400 mt-1">John the Ripper • Aircrack-ng • Hashcat integration</p>
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
        {activeTab === 'john' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">John the Ripper - Hash Cracking</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hash Input</label>
                <textarea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Enter hash(es) - one per line"
                  className="w-full h-24 bg-gray-800 border border-gray-600 rounded px-3 py-2 font-mono text-sm focus:border-green-500 focus:outline-none"
                  disabled={isCracking}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hash Type</label>
                  <select
                    value={hashType}
                    onChange={(e) => setHashType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                    disabled={isCracking}
                  >
                    {hashTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Wordlist</label>
                  <select
                    value={wordlist}
                    onChange={(e) => setWordlist(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                    disabled={isCracking}
                  >
                    {wordlists.map(list => (
                      <option key={list} value={list}>{list}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={startHashCracking}
                disabled={!hashInput || isCracking}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-medium"
              >
                {isCracking ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isCracking ? 'Stop Cracking' : 'Start Cracking'}
              </button>

              {results.length > 0 && (
                <button
                  onClick={exportResults}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
              )}
            </div>

            {isCracking && (
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{currentAttempt}</span>
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'aircrack' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aircrack-ng - WiFi Cracking</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Network Scan</h4>
                  <button
                    onClick={scanWifiNetworks}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    <Wifi className="w-4 h-4" />
                    Scan
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-auto">
                  {wifiNetworks.map((network, i) => (
                    <div
                      key={i}
                      onClick={() => setTargetNetwork(network.ssid)}
                      className={`p-2 rounded cursor-pointer border ${
                        targetNetwork === network.ssid
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{network.ssid}</div>
                          <div className="text-xs text-gray-400">
                            {network.bssid} • Ch {network.channel} • {network.encryption}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{network.signal}dBm</div>
                          <div className={`w-2 h-2 rounded-full ${
                            network.signal > -50 ? 'bg-green-500' :
                            network.signal > -70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Attack Configuration</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Target Network</label>
                    <input
                      type="text"
                      value={targetNetwork}
                      onChange={(e) => setTargetNetwork(e.target.value)}
                      placeholder="Select from scan results"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                      disabled={isCracking}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Capture File</label>
                    <input
                      type="text"
                      value={captureFile}
                      onChange={(e) => setCaptureFile(e.target.value)}
                      placeholder="handshake.cap"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                      disabled={isCracking}
                    />
                  </div>

                  <button
                    onClick={startWpaCracking}
                    disabled={!targetNetwork || !captureFile || isCracking}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-medium"
                  >
                    {isCracking ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isCracking ? 'Stop Attack' : 'Start WPA Attack'}
                  </button>
                </div>
              </div>
            </div>

            {isCracking && (
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{currentAttempt}</span>
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hashcat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hashcat - GPU Accelerated Cracking</h3>

            <div className="bg-yellow-900/20 border border-yellow-600 rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-yellow-400">GPU Support Required</span>
              </div>
              <p className="text-sm text-yellow-300">
                Hashcat requires CUDA/OpenCL compatible GPU for optimal performance.
                This demo shows CPU-only simulation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hash File</label>
                <input
                  type="text"
                  placeholder="hashes.txt"
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Attack Mode</label>
                <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none">
                  <option>Dictionary Attack</option>
                  <option>Brute Force</option>
                  <option>Mask Attack</option>
                  <option>Hybrid Attack</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <h4 className="font-medium mb-3">GPU Status</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">GPU:</span>
                  <div>NVIDIA RTX 3080</div>
                </div>
                <div>
                  <span className="text-gray-400">Memory:</span>
                  <div>10GB GDDR6X</div>
                </div>
                <div>
                  <span className="text-gray-400">Utilization:</span>
                  <div>0%</div>
                </div>
                <div>
                  <span className="text-gray-400">Temperature:</span>
                  <div>45°C</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Cracking Results</h3>
            <div className="space-y-3">
              {results.map((result, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    {result.password !== 'Not found' && result.password !== 'Not found in wordlist' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {result.hash ? `Hash: ${result.hash.substring(0, 16)}...` : `Network: ${result.network}`}
                      </div>
                      <div className="text-sm text-gray-400">
                        Method: {result.method} • Time: {result.time}s
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Result:</span>
                      <div className={`font-mono mt-1 ${
                        result.password === 'Not found' || result.password === 'Not found in wordlist'
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}>
                        {result.password}
                      </div>
                    </div>
                    {result.hashType && (
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <div className="mt-1">{result.hashType.toUpperCase()}</div>
                      </div>
                    )}
                    {result.keyType && (
                      <div>
                        <span className="text-gray-400">Key Type:</span>
                        <div className="mt-1">{result.keyType}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PasswordCracker
