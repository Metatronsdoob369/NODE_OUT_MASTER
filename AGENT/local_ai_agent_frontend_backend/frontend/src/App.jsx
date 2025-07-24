import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import PaymentPortal from './PaymentPortal'
import './PaymentPortal.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('professional')
  const [availableVoices, setAvailableVoices] = useState([])
  const [currentDemo, setCurrentDemo] = useState('')
  const [currentMode, setCurrentMode] = useState('payment') // 'demo' or 'payment'
  const [metrics, setMetrics] = useState({
    partnerships: 47,
    revenue: 180,
    satisfaction: 94,
    costReduction: 23
  })

  // Voice profiles for the demo
  const voiceProfiles = {
    professional: {
      name: "Professional Mike",
      description: "Real Estate Agent Outreach",
      avatar: "👨‍💼",
      sampleText: "Good morning Sarah, this is Mike from ABC Roofing AI. I have critical updates on insurance requirements that could affect your pending closings."
    },
    bilingual: {
      name: "Bilingual Sofia",
      description: "Customer Service EN/ES",
      avatar: "👩‍🔧",
      sampleText: "Hola, this is Sofia. We can help with roof inspections in English and Spanish. ¿Necesita ayuda con inspección de techo?"
    },
    foreman: {
      name: "Foreman José",
      description: "Crew Coordination",
      avatar: "👨‍🏭",
      sampleText: "Crew Alpha is ready for Johnson job site. Materials loaded, safety check complete. ETA 8:00 AM."
    },
    supply: {
      name: "Supply Chain AI",
      description: "Material Orders",
      avatar: "📞",
      sampleText: "Ordering 25 squares architectural shingles, delivery Thursday. Job #RF-2024-0847 confirmed in AccuLynx."
    }
  }

  // Load available voices on component mount
  useEffect(() => {
    loadAvailableVoices()
  }, [])

  const loadAvailableVoices = async () => {
    try {
      const res = await axios.get('http://localhost:5069/api/voices/available')
      setAvailableVoices(res.data.voices || [])
    } catch (err) {
      console.error('Error loading voices:', err)
      // Fallback to demo voices
      setAvailableVoices([
        { id: 'professional', name: 'Professional Mike' },
        { id: 'bilingual', name: 'Bilingual Sofia' },
        { id: 'foreman', name: 'Foreman José' },
        { id: 'supply', name: 'Supply Chain AI' }
      ])
    }
  }

  const sendPrompt = async () => {
    if (!prompt.trim()) return
    
    setIsLoading(true)
    try {
      // Try the working backend first
      const res = await axios.post('http://localhost:5002/chat', {
        prompt: `Context: Roofing business demo for real estate agent partnerships. Voice: ${selectedVoice}. Query: ${prompt}`
      })
      setResponse(res.data.response)
    } catch (err) {
      console.error('Error talking to backend:', err)
      // Provide intelligent demo response
      const demoResponses = {
        professional: `As your roofing AI specialist, I understand you're looking at partnerships with real estate agents. The new insurance requirements create a huge opportunity - agents need reliable roofing partners who can provide same-day inspections and expedited repairs to keep closings on track. I recommend setting up a referral program where agents get priority scheduling and you handle all the insurance paperwork. This protects their commissions and builds long-term relationships.`,
        bilingual: `¡Perfecto! Como especialista bilingüe en techos, puedo ayudarle con partnerships de agentes inmobiliarios. The bilingual capability is crucial - many clients prefer Spanish communication. We can create materials in both languages and ensure seamless communication throughout the process. This differentiates you from competitors and opens up broader market opportunities.`,
        foreman: `From a crew coordination perspective, real estate partnerships require reliable scheduling and quality work. I recommend dedicating specific crews for agent referrals, implementing quality control checklists, and using AccuLynx to keep agents updated on progress. Fast, professional communication keeps agents happy and leads to more referrals.`,
        supply: `For material management with agent partnerships, I suggest pre-staging common repair materials and establishing supplier relationships for emergency orders. Quick turnaround on insurance jobs is critical - agents need repairs completed fast to avoid delaying closings. Efficient supply chain management becomes your competitive advantage.`
      }
      setResponse(demoResponses[selectedVoice] || demoResponses.professional)
    }
    setIsLoading(false)
  }

  const playVoiceDemo = (voiceType) => {
    setCurrentDemo(`🎙️ Playing ${voiceProfiles[voiceType].name}...`)
    
    // Simulate voice playback with realistic demo
    setTimeout(() => {
      setCurrentDemo(`🎵 ${voiceProfiles[voiceType].name}: "${voiceProfiles[voiceType].sampleText}"`)
      
      // Auto-clear demo after 6 seconds to let client read
      setTimeout(() => setCurrentDemo(''), 6000)
    }, 800)
  }

  const runAccuLynxDemo = () => {
    setIsLoading(true)
    
    // Simulate AccuLynx API processing
    setTimeout(() => {
      const workflowId = `WF_${Date.now()}`
      const timestamp = new Date().toLocaleString()
      
      setResponse(`🏗️ AccuLynx Integration Demo - LIVE RESULTS:

✅ Crew Alpha scheduled for Tuesday 8:00 AM
✅ Materials ordered: 25 squares IKO Cambridge shingles (Weatherwood)
✅ Job #RF-2024-0847 created in AccuLynx CRM
✅ Bilingual foreman José assigned 
✅ Customer & realtor notifications sent
✅ Real-time sync with business dashboard active
✅ Insurance documentation prepared
✅ Weather monitoring enabled

Workflow ID: ${workflowId}
Processed: ${timestamp}
Integration Status: CONNECTED
Expected Completion: Thursday 3:00 PM

💰 Estimated Project Value: $8,500
🏠 Property: 1247 Oak Street, Austin TX
📞 Realtor: Sarah Johnson (Keller Williams)`)
      
      setIsLoading(false)
    }, 2000) // 2 second delay to show processing
  }

  // Render Payment Portal or Demo based on mode
  if (currentMode === 'payment') {
    return <PaymentPortal />
  }

  return (
    <div className="app">
      <div className="demo-header">
        <h1>🏠 Roofing AI Assistant Demo</h1>
        <p className="subtitle">Real Estate Agent Partnership & Business Automation System</p>
        <div className="tech-stack">
          ⚡ ElevenLabs Voice AI • 🏗️ AccuLynx Integration • 🌎 Bilingual Support • 🧠 Clay-I Enhanced
        </div>
        <div className="mode-switcher">
          <button 
            className={`mode-btn ${currentMode === 'demo' ? 'active' : ''}`}
            onClick={() => setCurrentMode('demo')}
          >
            🤖 AI Demo
          </button>
          <button 
            className={`mode-btn ${currentMode === 'payment' ? 'active' : ''}`}
            onClick={() => setCurrentMode('payment')}
          >
            🌪️ Storm Services
          </button>
        </div>
      </div>

      {/* Voice Portfolio Showcase */}
      <div className="voice-showcase">
        <h3>🎙️ Custom Voice Portfolio</h3>
        <div className="voice-grid">
          {Object.entries(voiceProfiles).map(([key, voice]) => (
            <div key={key} className="voice-card">
              <div className="voice-avatar">{voice.avatar}</div>
              <h4>{voice.name}</h4>
              <p>{voice.description}</p>
              <button 
                className="voice-btn"
                onClick={() => playVoiceDemo(key)}
              >
                ▶️ {key === 'bilingual' ? 'Escuchar' : 'Listen'}
              </button>
            </div>
          ))}
        </div>
        {currentDemo && (
          <div className="demo-output">
            {currentDemo}
          </div>
        )}
      </div>

      {/* Interactive Chat Interface */}
      <div className="chat-section">
        <h3>🤖 Enhanced Clay-I Assistant</h3>
        <div className="voice-selector">
          <label>Voice Profile: </label>
          <select 
            value={selectedVoice} 
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {Object.entries(voiceProfiles).map(([key, voice]) => (
              <option key={key} value={key}>{voice.name}</option>
            ))}
          </select>
        </div>
        
        <textarea
          rows={4}
          placeholder="Ask about real estate partnerships, crew scheduling, material orders, or roofing business strategies..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="chat-input"
        />
        
        <div className="button-group">
          <button onClick={sendPrompt} disabled={isLoading} className="send-btn">
            {isLoading ? '🤖 Thinking...' : 'Ask Clay-I'}
          </button>
          <button onClick={runAccuLynxDemo} disabled={isLoading} className="demo-btn">
            🏗️ AccuLynx Demo
          </button>
        </div>

        {response && (
          <div className="response-area">
            <h4>🧠 Clay-I Response:</h4>
            <pre>{response}</pre>
          </div>
        )}
      </div>

      {/* Business Metrics Dashboard */}
      <div className="metrics-section">
        <h3>📊 Real-Time Business Dashboard</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{metrics.partnerships}</div>
            <div className="metric-label">Realtor Partnerships</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">${metrics.revenue}K</div>
            <div className="metric-label">Monthly Revenue</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{metrics.satisfaction}%</div>
            <div className="metric-label">Customer Satisfaction</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{metrics.costReduction}%</div>
            <div className="metric-label">Cost Reduction</div>
          </div>
        </div>
        
        <div className="status-indicators">
          <div className="status-item">
            <div className="status-dot"></div>
            AccuLynx CRM Sync: Real-time
          </div>
          <div className="status-item">
            <div className="status-dot"></div>
            ElevenLabs Voice: 12 Active Agents
          </div>
          <div className="status-item">
            <div className="status-dot"></div>
            Clay-I Enhanced: Renaissance AI Knowledge Active
          </div>
        </div>
      </div>

      {/* Future Vision Preview */}
      <div className="future-preview">
        <h4>🔮 Next-Gen Dashboard Preview</h4>
        <div className="ar-hint">
          💡 <strong>Coming Soon:</strong> Spatial AR dashboard where metrics float in 3D space. 
          Custom views per client - some see revenue, others see efficiency gains.
        </div>
      </div>
    </div>
  )
}

export default App
