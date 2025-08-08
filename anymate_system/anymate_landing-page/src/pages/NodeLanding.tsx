import React, { useState } from 'react';

const NodeLanding: React.FC = () => {
  const [showActivate, setShowActivate] = useState(false);

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
      <div style={{
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          background: 'linear-gradient(90deg, #ff6a00, #1f7fef)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          ANYM⁸
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#b7c0cd',
          marginBottom: '3rem'
        }}>
          Math-powered 3D asset generation and marketplace
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowActivate(true)}
            style={{
              background: 'linear-gradient(90deg, #ff6a00, #1f7fef)',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            ACTIVATE
          </button>
          
          <button
            onClick={() => window.location.href = '/waitlist'}
            style={{
              background: 'transparent',
              border: '2px solid #1f7fef',
              borderRadius: '12px',
              padding: '1rem 2rem',
              color: '#1f7fef',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Join Waitlist
          </button>
        </div>
      </div>
      
      {showActivate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#161a22',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '90vw',
            maxHeight: '90vh',
            position: 'relative',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowActivate(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center' }}>
              <h2>PATHsassin 3D Scene</h2>
              <p style={{ color: '#b7c0cd' }}>3D visualization would render here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeLanding;