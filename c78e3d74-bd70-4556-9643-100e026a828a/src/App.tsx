import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(0);

  const agents = [
    { name: 'Professional', style: 'confident and consultative' },
    { name: 'Consultative', style: 'analytical and strategic' },
    { name: 'Executive', style: 'decisive and authoritative' },
    { name: 'Technical', style: 'precise and detailed' }
  ];

  return (
    <div className="App">
      <div className="glass-container">
        <div className="hero-section">
          <h1 className="hero-title">NOda_Mates</h1>
          <p className="hero-subtitle">Enterprise AI Automation Platform</p>
          <div className="clay-i-indicator">Clay-I Integration Active</div>
        </div>
        
        <div className="voice-section">
          <h2>VOICE STYLES</h2>
          <div className="voice-agents">
            {agents.map((agent, index) => (
              <div 
                key={index} 
                className={`voice-card ${selectedAgent === index ? 'active' : ''}`}
                onClick={() => setSelectedAgent(index)}
              >
                <div className="agent-icon"></div>
                <h3>{agent.name}</h3>
                <p>{agent.style}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="automation-section">
          <h2>AUTOMATION WALKTHROUGH</h2>
          <div className="workflow-visualization">
            <div className="workflow-node">
              <div className="node-hub"></div>
              <div className="node-connections"></div>
            </div>
          </div>
        </div>

        <div className="clay-i-status">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            Clay-I Learning System Active
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
