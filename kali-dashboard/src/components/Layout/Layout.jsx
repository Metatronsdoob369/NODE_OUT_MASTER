import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAppState } from '../../contexts/AppContext';

const Layout = () => {
  const { sidebarCollapsed } = useAppState();

  return (
    <div className="flex h-screen bg-kali-dark overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } lg:ml-0`}>
        {/* Header */}
        <Header />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-kali-dark p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
