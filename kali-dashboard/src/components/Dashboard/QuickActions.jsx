import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, actions } from '../../contexts/AppContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const quickActions = [
    {
      title: 'Quick Nmap Scan',
      description: 'Scan local network',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'kali-green',
      action: () => {
        // Mock quick scan
        const scanId = Date.now();
        dispatch(actions.addScan({
          id: scanId,
          target: '192.168.1.0/24',
          type: 'quick',
          status: 'running',
          progress: 0,
          startTime: new Date().toISOString()
        }));
        dispatch(actions.addNotification({
          type: 'info',
          message: 'Quick network scan started on 192.168.1.0/24'
        }));
        navigate('/nmap');
      }
    },
    {
      title: 'Open Terminal',
      description: 'Launch command interface',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'kali-cyan',
      action: () => navigate('/terminal')
    },
    {
      title: 'Metasploit Console',
      description: 'Access exploit framework',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'red-500',
      action: () => navigate('/metasploit')
    },
    {
      title: 'System Status',
      description: 'View system health',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'yellow-400',
      action: () => {
        dispatch(actions.addNotification({
          type: 'info',
          message: 'System status: All services operational'
        }));
      }
    }
  ];

  const recentTargets = [
    { ip: '192.168.1.100', status: 'vulnerable', ports: 3 },
    { ip: '10.0.0.50', status: 'scanned', ports: 12 },
    { ip: '172.16.1.25', status: 'active', ports: 8 }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg border border-kali-gray-700 hover:border-${action.color}/50 bg-kali-gray-800/30 hover:bg-kali-gray-800/60 transition-all duration-200 text-left group`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{action.title}</h4>
                  <p className="text-kali-gray-400 text-xs mt-1">{action.description}</p>
                </div>
                <svg className="w-4 h-4 text-kali-gray-600 group-hover:text-kali-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Targets */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Recent Targets</h3>
          <button className="text-xs text-kali-green hover:text-kali-green/80 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTargets.map((target, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-kali-gray-800/30 hover:bg-kali-gray-800/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  target.status === 'vulnerable' ? 'bg-red-500' :
                  target.status === 'scanned' ? 'bg-kali-green' :
                  'bg-kali-cyan'
                } animate-pulse`}></div>
                <div>
                  <p className="text-white font-mono text-sm">{target.ip}</p>
                  <p className="text-kali-gray-400 text-xs capitalize">{target.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-kali-gray-300 text-sm">{target.ports}</p>
                <p className="text-kali-gray-500 text-xs">ports</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Shortcuts */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">System</h3>
        </div>
        
        <div className="space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm text-kali-gray-300">Update Tools</span>
              <svg className="w-4 h-4 text-kali-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </button>
          
          <button className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm text-kali-gray-300">Export Reports</span>
              <svg className="w-4 h-4 text-kali-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </button>
          
          <button className="w-full text-left p-2 rounded hover:bg-kali-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm text-kali-gray-300">Settings</span>
              <svg className="w-4 h-4 text-kali-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
