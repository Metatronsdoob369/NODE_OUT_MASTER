import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NmapScanner from './pages/NmapScanner';
import MetasploitConsole from './pages/MetasploitConsole';
import Terminal from './pages/Terminal';
import SecurityCenter from './pages/SecurityCenter';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-kali-dark text-white">
        <Routes>
          {/* Protected routes with layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="nmap" element={<NmapScanner />} />
            <Route path="metasploit" element={<MetasploitConsole />} />
            <Route path="terminal" element={<Terminal />} />
            <Route path="security" element={<SecurityCenter />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
