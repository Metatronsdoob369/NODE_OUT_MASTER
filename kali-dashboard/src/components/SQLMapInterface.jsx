import React, { useState, useEffect } from 'react'
import { Database, Target, Zap, CheckCircle, AlertTriangle, Play, Settings } from 'lucide-react'

function SQLMapInterface() {
  const [targetUrl, setTargetUrl] = useState('')
  const [scanOptions, setScanOptions] = useState({
    level: 1,
    risk: 1,
    threads: 1,
    dbms: '',
    dump: false,
    batch: true
  })
  const [scanResults, setScanResults] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState('')

  const sqlInjectionTests = [
    { name: 'Boolean-based blind', type: 'boolean', status: 'pending' },
    { name: 'Error-based', type: 'error', status: 'pending' },
    { name: 'Union query-based', type: 'union', status: 'pending' },
    { name: 'Stacked queries', type: 'stacked', status: 'pending' },
    { name: 'Time-based blind', type: 'time', status: 'pending' }
  ]

  const [testStatuses, setTestStatuses] = useState(sqlInjectionTests)

  const startScan = async () => {
    if (!targetUrl) return

    setIsScanning(true)
    setScanProgress(0)
    setScanResults([])
    setTestStatuses(sqlInjectionTests.map(test => ({ ...test, status: 'pending' })))

    // Simulate SQLMap scanning process
    const tests = [...testStatuses]
    let completedTests = 0

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setCurrentTest(`Testing: ${test.name}`)
      setTestStatuses(prev => prev.map((t, idx) =>
        idx === i ? { ...t, status: 'running' } : t
      ))

      // Simulate test execution time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

      // Random success/failure
      const success = Math.random() > 0.3
      const status = success ? 'vulnerable' : 'not_vulnerable'

      setTestStatuses(prev => prev.map((t, idx) =>
        idx === i ? { ...t, status } : t
      ))

      if (success) {
        // Add vulnerability to results
        const vulnerability = generateVulnerability(test, targetUrl)
        setScanResults(prev => [...prev, vulnerability])
      }

      completedTests++
      setScanProgress((completedTests / tests.length) * 100)
    }

    setIsScanning(false)
    setCurrentTest('Scan completed')
  }

  const generateVulnerability = (test, url) => {
    const payloads = [
      "' OR '1'='1' --",
      "' UNION SELECT database() --",
      "' AND SLEEP(5) --",
      "'; DROP TABLE users; --",
      "' AND 1=1 --"
    ]

    return {
      id: Date.now() + Math.random(),
      url: url,
      type: test.name,
      parameter: ['id', 'user', 'search', 'page'][Math.floor(Math.random() * 4)],
      payload: payloads[Math.floor(Math.random() * payloads.length)],
      dbms: ['MySQL', 'PostgreSQL', 'MSSQL', 'Oracle'][Math.floor(Math.random() * 4)],
      confidence: Math.floor(Math.random() * 40) + 60, // 60-99%
      severity: test.type === 'union' ? 'High' : test.type === 'error' ? 'Medium' : 'Low'
    }
  }

  const runDump = async () => {
    if (scanResults.length === 0) return

    setCurrentTest('Attempting database dump...')

    // Simulate dump process
    await new Promise(resolve => setTimeout(resolve, 3000))

    const dumpResult = {
      id: Date.now(),
      type: 'Database Dump',
      database: 'target_db',
      tables: ['users', 'admin_logs', 'sensitive_data'],
      records: Math.floor(Math.random() * 1000) + 100,
      status: 'partial'
    }

    setScanResults(prev => [...prev, dumpResult])
    setCurrentTest('Dump attempt completed')
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-green-600">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6" />
          SQLMap - SQL Injection Scanner
        </h2>
        <p className="text-sm text-gray-400 mt-1">Automated SQL injection detection • Database fingerprinting • Data extraction</p>
      </div>

      {/* Scan Configuration */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Target URL</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://target.com/page.php?id=1"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
              disabled={isScanning}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Database Type</label>
            <select
              value={scanOptions.dbms}
              onChange={(e) => setScanOptions(prev => ({ ...prev, dbms: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
              disabled={isScanning}
            >
              <option value="">Auto-detect</option>
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mssql">MSSQL</option>
              <option value="oracle">Oracle</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Level (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={scanOptions.level}
              onChange={(e) => setScanOptions(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center"
              disabled={isScanning}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Risk (1-3)</label>
            <input
              type="number"
              min="1"
              max="3"
              value={scanOptions.risk}
              onChange={(e) => setScanOptions(prev => ({ ...prev, risk: parseInt(e.target.value) }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center"
              disabled={isScanning}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Threads</label>
            <input
              type="number"
              min="1"
              max="10"
              value={scanOptions.threads}
              onChange={(e) => setScanOptions(prev => ({ ...prev, threads: parseInt(e.target.value) }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center"
              disabled={isScanning}
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={scanOptions.dump}
                onChange={(e) => setScanOptions(prev => ({ ...prev, dump: e.target.checked }))}
                disabled={isScanning}
              />
              Auto-dump
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={startScan}
              disabled={!targetUrl || isScanning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-medium"
            >
              <Play className="w-4 h-4" />
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </button>

            {scanResults.length > 0 && (
              <button
                onClick={runDump}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
              >
                <Database className="w-4 h-4" />
                Dump Data
              </button>
            )}
          </div>

          {isScanning && (
            <div className="flex items-center gap-3">
              <div className="text-sm">{currentTest}</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="text-sm">{Math.round(scanProgress)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Test Status */}
      {isScanning && (
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <h3 className="font-semibold mb-3">Injection Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {testStatuses.map((test, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                  test.status === 'vulnerable' ? 'bg-red-500' :
                  test.status === 'not_vulnerable' ? 'bg-green-500' :
                  test.status === 'running' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                }`} />
                <span className={test.status === 'running' ? 'text-yellow-400' : ''}>
                  {test.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-auto p-4">
        <h3 className="font-semibold mb-4">Scan Results ({scanResults.length})</h3>

        {scanResults.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No vulnerabilities detected yet</p>
            <p className="text-sm">Configure a target URL and start scanning</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scanResults.map((result) => (
              <div key={result.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      result.severity === 'High' ? 'text-red-500' :
                      result.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <div className="font-semibold">{result.type}</div>
                      <div className="text-sm text-gray-400">{result.url}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    result.severity === 'High' ? 'bg-red-600' :
                    result.severity === 'Medium' ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {result.severity}
                  </div>
                </div>

                {result.parameter && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-400">Parameter:</span>
                      <div className="font-mono">{result.parameter}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">DBMS:</span>
                      <div>{result.dbms}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <div>{result.confidence}%</div>
                    </div>
                    {result.records && (
                      <div>
                        <span className="text-gray-400">Records:</span>
                        <div>{result.records}</div>
                      </div>
                    )}
                  </div>
                )}

                {result.payload && (
                  <div className="mb-3">
                    <span className="text-gray-400 text-sm">Payload:</span>
                    <div className="font-mono text-green-400 bg-gray-900 p-2 rounded mt-1 text-sm">
                      {result.payload}
                    </div>
                  </div>
                )}

                {result.tables && (
                  <div>
                    <span className="text-gray-400 text-sm">Dumped Tables:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.tables.map((table, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {table}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SQLMapInterface
