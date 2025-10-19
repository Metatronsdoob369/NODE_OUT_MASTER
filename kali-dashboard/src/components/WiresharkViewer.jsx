import React, { useState, useEffect } from 'react'
import { Network, Play, Square, Download, Filter, Eye, Zap } from 'lucide-react'

function WiresharkViewer() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [packets, setPackets] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedPacket, setSelectedPacket] = useState(null)
  const [captureStats, setCaptureStats] = useState({
    total: 0,
    tcp: 0,
    udp: 0,
    http: 0,
    https: 0
  })

  // Simulate packet capture
  useEffect(() => {
    if (isCapturing) {
      const interval = setInterval(() => {
        const newPacket = generateRandomPacket()
        setPackets(prev => [newPacket, ...prev.slice(0, 99)]) // Keep last 100 packets
        setCaptureStats(prev => ({
          ...prev,
          total: prev.total + 1,
          [newPacket.protocol.toLowerCase()]: prev[newPacket.protocol.toLowerCase()] + 1
        }))
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isCapturing])

  const generateRandomPacket = () => {
    const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP']
    const sources = ['192.168.1.100', '10.0.0.5', '172.16.0.10', '192.168.1.200']
    const destinations = ['8.8.8.8', '1.1.1.1', '208.67.222.222', '192.168.1.1']

    return {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      length: Math.floor(Math.random() * 1500) + 64,
      info: `Packet from ${sources[Math.floor(Math.random() * sources.length)]}`,
      details: {
        srcPort: Math.floor(Math.random() * 65535),
        dstPort: Math.floor(Math.random() * 65535),
        flags: ['SYN', 'ACK', 'PSH', 'FIN'][Math.floor(Math.random() * 4)],
        seq: Math.floor(Math.random() * 1000000),
        ack: Math.floor(Math.random() * 1000000)
      }
    }
  }

  const filteredPackets = packets.filter(packet =>
    filter === '' ||
    packet.protocol.toLowerCase().includes(filter.toLowerCase()) ||
    packet.source.includes(filter) ||
    packet.destination.includes(filter)
  )

  const toggleCapture = () => {
    setIsCapturing(!isCapturing)
    if (!isCapturing) {
      // Reset stats when starting new capture
      setCaptureStats({ total: 0, tcp: 0, udp: 0, http: 0, https: 0 })
      setPackets([])
    }
  }

  const exportCapture = () => {
    const data = JSON.stringify({ packets, stats: captureStats }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wireshark-capture-${new Date().toISOString().slice(0, 19)}.json`
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
          <Network className="w-6 h-6" />
          Wireshark Packet Analyzer
        </h2>
        <p className="text-sm text-gray-400 mt-1">Live packet capture • Protocol analysis • Traffic visualization</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCapture}
              className={`flex items-center gap-2 px-4 py-2 rounded font-medium ${
                isCapturing
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-black'
              }`}
            >
              {isCapturing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isCapturing ? 'Stop Capture' : 'Start Capture'}
            </button>

            <button
              onClick={exportCapture}
              disabled={packets.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter packets..."
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-2xl font-bold text-blue-400">{captureStats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-2xl font-bold text-green-400">{captureStats.tcp}</div>
            <div className="text-xs text-gray-400">TCP</div>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-2xl font-bold text-yellow-400">{captureStats.udp}</div>
            <div className="text-xs text-gray-400">UDP</div>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-2xl font-bold text-purple-400">{captureStats.http}</div>
            <div className="text-xs text-gray-400">HTTP</div>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-2xl font-bold text-red-400">{captureStats.https}</div>
            <div className="text-xs text-gray-400">HTTPS</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Packet List */}
        <div className="w-1/2 border-r border-gray-700 overflow-auto">
          <div className="p-2">
            <div className="bg-gray-800 rounded p-2 mb-2 font-mono text-xs text-gray-300 border-b border-gray-600">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-2">Time</div>
                <div className="col-span-3">Source</div>
                <div className="col-span-3">Destination</div>
                <div className="col-span-2">Protocol</div>
                <div className="col-span-1">Length</div>
                <div className="col-span-1">Info</div>
              </div>
            </div>
            {filteredPackets.map((packet) => (
              <div
                key={packet.id}
                onClick={() => setSelectedPacket(packet)}
                className={`p-2 mb-1 rounded cursor-pointer font-mono text-xs hover:bg-gray-700 ${
                  selectedPacket?.id === packet.id ? 'bg-green-600 text-black' : 'text-green-400'
                }`}
              >
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-2">{packet.timestamp.split(' ')[1]}</div>
                  <div className="col-span-3">{packet.source}</div>
                  <div className="col-span-3">{packet.destination}</div>
                  <div className="col-span-2 font-bold">{packet.protocol}</div>
                  <div className="col-span-1">{packet.length}</div>
                  <div className="col-span-1 truncate">{packet.info.slice(0, 10)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packet Details */}
        <div className="w-1/2 overflow-auto">
          {selectedPacket ? (
            <div className="p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Packet Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-sm text-gray-400">Source</div>
                    <div className="font-mono">{selectedPacket.source}:{selectedPacket.details.srcPort}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-sm text-gray-400">Destination</div>
                    <div className="font-mono">{selectedPacket.destination}:{selectedPacket.details.dstPort}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-sm text-gray-400">Protocol</div>
                    <div className="font-bold">{selectedPacket.protocol}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-sm text-gray-400">Length</div>
                    <div>{selectedPacket.length} bytes</div>
                  </div>
                </div>

                {selectedPacket.protocol === 'TCP' && (
                  <div className="bg-gray-800 p-4 rounded">
                    <h4 className="font-semibold mb-2">TCP Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Flags:</span> {selectedPacket.details.flags}
                      </div>
                      <div>
                        <span className="text-gray-400">Seq:</span> {selectedPacket.details.seq}
                      </div>
                      <div>
                        <span className="text-gray-400">Ack:</span> {selectedPacket.details.ack}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-800 p-4 rounded">
                  <h4 className="font-semibold mb-2">Raw Data</h4>
                  <pre className="text-xs font-mono bg-black p-2 rounded overflow-x-auto">
{`Frame ${selectedPacket.id}:
${selectedPacket.protocol} packet
Source: ${selectedPacket.source}
Destination: ${selectedPacket.destination}
Length: ${selectedPacket.length} bytes

[Raw hex dump would appear here]`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Select a packet to view details</p>
                <p className="text-sm">Click on any packet in the list to see its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WiresharkViewer
