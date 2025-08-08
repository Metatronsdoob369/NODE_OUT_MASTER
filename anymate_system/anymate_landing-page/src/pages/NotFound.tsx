import React from 'react';

const NotFound: React.FC = () => {
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
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ color: '#b7c0cd', marginBottom: '2rem' }}>Page not found</p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          background: 'linear-gradient(90deg, #ff6a00, #1f7fef)',
          border: 'none',
          borderRadius: '12px',
          padding: '1rem 2rem',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;