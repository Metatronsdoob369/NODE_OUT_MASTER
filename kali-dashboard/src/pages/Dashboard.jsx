import React, { useState, useEffect } from 'react';
import { useAppState, useAppDispatch, actions } from '../contexts/AppContext';
import MetricsCard from '../components/Dashboard/MetricsCard';
import ActivityTimeline from '../components/Dashboard/ActivityTimeline';
import VulnerabilityHeatmap from '../components/Dashboard/VulnerabilityHeatmap';
import QuickActions from '../components/Dashboard/QuickActions';

const Dashboard = () => {
  const { systemStats, activeScans, sessions, notifications } = useAppState();
  const dispatch = useAppDispatch();
  const [recentActivity, setRecentActivity] = useState([]);

  // Mock recent activity data
  useEffect(() => {
    const mockActivity = [
      {
        id: 1,
        type: 'scan_completed',
        title: 'Nmap scan completed',
        description: 'Network scan of 192.168.1.0/24 finished',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: 2,
        type: 'vulnerability_found',
        title: 'Critical vulnerability detected',
        description: 'CVE-2023-1234 found on 192.168.1.100:22',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'critical'
      },
      {
        id: 3,
        type: 'session_established',
        title: 'Meterpreter session opened',
        description: 'Session 1 established on target 192.168.1.50',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: 4,
        type: 'scan_started',
        title: 'Port scan initiated',
        description: 'TCP SYN scan started on 10.0.0.0/16',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'info'
      },
      {
        id: 5,
        type: 'exploit_attempt',
        title: 'Exploit attempt failed',
        description: 'ms17_010_eternalblue failed on 192.168.1.25',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'warning'
      }
    ];
    setRecentActivity(mockActivity);
  }, []);

  const metricsData = [
    {
      title: 'Active Scans',
      value: systemStats.activeScans,
      change: '+2',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'kali-green'
    },
    {
      title: 'Active Sessions',
      value: systemStats.activeSessions,
      change: '+1',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'kali-cyan'
    },
    {
      title: 'Vulnerabilities Found',
      value: systemStats.vulnerabilitiesFound,
      change: '+12',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'red-500'
    },
    {
      title: 'System Uptime',
      value: systemStats.uptime,
      change: 'Stable',
      changeType: 'stable',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'kali-gray-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-kali-gray-400 mt-1">
            Welcome back, {systemStats.uptime} system uptime
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="btn-secondary"
            onClick={() => dispatch(actions.addNotification({
              type: 'info',
              message: 'Dashboard refreshed successfully'
            }))}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activity Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimeline activities={recentActivity} />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Section - Vulnerability Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <VulnerabilityHeatmap />
        
        {/* System Resources */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">System Resources</h3>
            <span className="status-indicator status-online">Online</span>
          </div>
          
          <div className="space-y-4">
            {/* CPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-kali-gray-300">CPU Usage</span>
                <span className="text-sm text-white font-medium">23%</span>
              </div>
              <div className="w-full bg-kali-gray-800 rounded-full h-2">
                <div className="bg-kali-green h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-kali-gray-300">Memory Usage</span>
                <span className="text-sm text-white font-medium">1.2GB / 8GB</span>
              </div>
              <div className="w-full bg-kali-gray-800 rounded-full h-2">
                <div className="bg-kali-cyan h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            {/* Disk Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-kali-gray-300">Disk Usage</span>
                <span className="text-sm text-white font-medium">45GB / 256GB</span>
              </div>
              <div className="w-full bg-kali-gray-800 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            {/* Network Activity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-kali-gray-300">Network Activity</span>
                <span className="text-sm text-white font-medium">↑ 2.3MB/s ↓ 1.1MB/s</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 bg-kali-gray-800 rounded-full h-2">
                  <div className="bg-kali-green h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <div className="flex-1 bg-kali-gray-800 rounded-full h-2">
                  <div className="bg-kali-cyan h-2 rounded-full animate-pulse" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
