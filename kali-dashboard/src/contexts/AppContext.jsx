import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: {
    username: 'kali',
    role: 'admin',
    isAuthenticated: true,
    avatar: null
  },
  theme: 'dark',
  sidebarCollapsed: false,
  activeScans: [],
  sessions: [],
  notifications: [],
  systemStats: {
    activeScans: 3,
    activeSessions: 2,
    vulnerabilitiesFound: 47,
    uptime: '2d 14h 32m'
  }
};

// Action types
const actionTypes = {
  SET_USER: 'SET_USER',
  TOGGLE_THEME: 'TOGGLE_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_SCAN: 'ADD_SCAN',
  UPDATE_SCAN: 'UPDATE_SCAN',
  REMOVE_SCAN: 'REMOVE_SCAN',
  ADD_SESSION: 'ADD_SESSION',
  REMOVE_SESSION: 'REMOVE_SESSION',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  UPDATE_SYSTEM_STATS: 'UPDATE_SYSTEM_STATS'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    
    case actionTypes.TOGGLE_THEME:
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case actionTypes.ADD_SCAN:
      return { 
        ...state, 
        activeScans: [...state.activeScans, action.payload],
        systemStats: { 
          ...state.systemStats, 
          activeScans: state.activeScans.length + 1 
        }
      };
    
    case actionTypes.UPDATE_SCAN:
      return {
        ...state,
        activeScans: state.activeScans.map(scan =>
          scan.id === action.payload.id ? { ...scan, ...action.payload } : scan
        )
      };
    
    case actionTypes.REMOVE_SCAN:
      return {
        ...state,
        activeScans: state.activeScans.filter(scan => scan.id !== action.payload),
        systemStats: { 
          ...state.systemStats, 
          activeScans: Math.max(0, state.systemStats.activeScans - 1)
        }
      };
    
    case actionTypes.ADD_SESSION:
      return { 
        ...state, 
        sessions: [...state.sessions, action.payload],
        systemStats: { 
          ...state.systemStats, 
          activeSessions: state.sessions.length + 1 
        }
      };
    
    case actionTypes.REMOVE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload),
        systemStats: { 
          ...state.systemStats, 
          activeSessions: Math.max(0, state.systemStats.activeSessions - 1)
        }
      };
    
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10) // Keep only last 10
      };
    
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    
    case actionTypes.UPDATE_SYSTEM_STATS:
      return {
        ...state,
        systemStats: { ...state.systemStats, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-save state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('kali-dashboard-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: actionTypes.SET_USER, payload: parsed.user });
        if (parsed.theme) {
          document.documentElement.className = parsed.theme;
        }
      } catch (error) {
        console.warn('Failed to load saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kali-dashboard-state', JSON.stringify({
      user: state.user,
      theme: state.theme
    }));
    
    // Update document class for theme
    document.documentElement.className = state.theme;
  }, [state.user, state.theme]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Custom hooks
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}

// Action creators
export const actions = {
  setUser: (userData) => ({ type: actionTypes.SET_USER, payload: userData }),
  toggleTheme: () => ({ type: actionTypes.TOGGLE_THEME }),
  toggleSidebar: () => ({ type: actionTypes.TOGGLE_SIDEBAR }),
  addScan: (scanData) => ({ type: actionTypes.ADD_SCAN, payload: scanData }),
  updateScan: (scanData) => ({ type: actionTypes.UPDATE_SCAN, payload: scanData }),
  removeScan: (scanId) => ({ type: actionTypes.REMOVE_SCAN, payload: scanId }),
  addSession: (sessionData) => ({ type: actionTypes.ADD_SESSION, payload: sessionData }),
  removeSession: (sessionId) => ({ type: actionTypes.REMOVE_SESSION, payload: sessionId }),
  addNotification: (notification) => ({ 
    type: actionTypes.ADD_NOTIFICATION, 
    payload: { 
      id: Date.now(), 
      timestamp: new Date().toISOString(), 
      ...notification 
    } 
  }),
  removeNotification: (notificationId) => ({ type: actionTypes.REMOVE_NOTIFICATION, payload: notificationId }),
  updateSystemStats: (stats) => ({ type: actionTypes.UPDATE_SYSTEM_STATS, payload: stats })
};
