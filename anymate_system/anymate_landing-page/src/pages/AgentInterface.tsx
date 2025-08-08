import React from 'react';

const AgentInterface: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      color: '#f4f6fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1>Agent Interface</h1>
      <p style={{ color: '#b7c0cd', textAlign: 'center', maxWidth: '600px' }}>
        AI agent interface would be rendered here.
      </p>
    </div>
  );
};

export default AgentInterface;