import React, { useState } from 'react';
import { useAppState, useAppDispatch, actions } from '../../contexts/AppContext';

const Header = () => {
  const { user, sidebarCollapsed, notifications, systemStats } = useAppState();
  const dispatch = useAppDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(actions.setUser({ isAuthenticated: false }));
    setShowUserMenu(false);
  };

  return (
    <header className="bg-kali-gray-900/80 backdrop-blur-sm border-b border-kali-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and breadcrumb */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(actions.toggleSidebar())}
            className="lg:hidden p-2 rounded-lg hover:bg-kali-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <span className="text-kali-gray-400">Kali Linux</span>
            <svg className="w-4 h-4 text-kali-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Control Panel</span>
          </div>
        </div>

        {/* Right side - System stats, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* System stats */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kali-green rounded-full animate-pulse"></div>
              <span className="text-kali-gray-300">
                {systemStats.activeScans} scans
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kali-cyan rounded-full animate-pulse"></div>
              <span className="text-kali-gray-300">
                {systemStats.activeSessions} sessions
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-kali-gray-300">
                {systemStats.vulnerabilitiesFound} vulns
              </span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-kali-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-kali-gray-900 border border-kali-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-kali-gray-700">
                  <h3 className="text-white font-medium">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-kali-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-kali-gray-800 hover:bg-kali-gray-800/50">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-kali-green' :
                            notification.type === 'warning' ? 'bg-yellow-400' :
                            notification.type === 'error' ? 'bg-red-500' : 'bg-kali-cyan'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{notification.message}</p>
                            <p className="text-kali-gray-400 text-xs mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => dispatch(actions.toggleTheme())}
            className="p-2 rounded-lg hover:bg-kali-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-kali-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-kali-green rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-white text-sm font-medium">{user.username}</div>
                <div className="text-kali-gray-400 text-xs">{user.role}</div>
              </div>
              <svg className="w-4 h-4 text-kali-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-kali-gray-900 border border-kali-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-white hover:bg-kali-gray-800 rounded-lg transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-white hover:bg-kali-gray-800 rounded-lg transition-colors">
                    Preferences
                  </button>
                  <hr className="my-2 border-kali-gray-700" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-kali-gray-800 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
