import { useState } from 'react';
import ProxyControl from '../components/ProxyControl';
import QuickScanTools from '../components/QuickScanTools';
import SecurityMonitoring from '../components/SecurityMonitoring';

const SecurityCenter = () => {
  const [activeTab, setActiveTab] = useState('monitoring');

  const tabs = [
    {
      id: 'monitoring',
      name: 'Security Monitoring',
      icon: '🛡️',
      component: SecurityMonitoring
    },
    {
      id: 'proxy',
      name: 'Proxy Control',
      icon: '🚫',
      component: ProxyControl
    },
    {
      id: 'scanning',
      name: 'Quick Scan Tools',
      icon: '⚡',
      component: QuickScanTools
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SecurityMonitoring;

  return (
    <div className="min-h-screen bg-kali-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-kali-green mb-2">
            🔒 Security Operations Center
          </h1>
          <p className="text-gray-400">
            Comprehensive security monitoring, threat detection, and network control
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-kali-green text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="transition-all duration-300">
          <ActiveComponent />
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-kali-green mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg text-sm font-semibold transition-all duration-200">
              🚨 Emergency Lockdown
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-semibold transition-all duration-200">
              🔄 Refresh All Status
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-sm font-semibold transition-all duration-200">
              📊 Generate Report
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-sm font-semibold transition-all duration-200">
              ⚙️ System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
