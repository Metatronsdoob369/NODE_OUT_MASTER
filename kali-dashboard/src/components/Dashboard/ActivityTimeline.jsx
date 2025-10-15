import React, { useState } from 'react';

const ActivityTimeline = ({ activities }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-kali-green border-kali-green bg-kali-green/10';
      case 'critical':
        return 'text-red-400 border-red-400 bg-red-400/10';
      case 'warning':
        return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'info':
        return 'text-kali-cyan border-kali-cyan bg-kali-cyan/10';
      default:
        return 'text-kali-gray-400 border-kali-gray-400 bg-kali-gray-400/10';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'scan_completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'vulnerability_found':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'session_established':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'scan_started':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'exploit_attempt':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-kali-green rounded-full animate-pulse"></div>
          <span className="text-sm text-kali-gray-400">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-kali-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-kali-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-kali-gray-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-kali-gray-800"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Status indicator */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(activity.status)}`}>
                  {getStatusIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium truncate">{activity.title}</h4>
                    <span className="text-xs text-kali-gray-400 flex-shrink-0 ml-2">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-kali-gray-300 mt-1 line-clamp-2">
                    {activity.description}
                  </p>

                  {/* Expandable details */}
                  {activity.details && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleExpanded(activity.id)}
                        className="text-xs text-kali-green hover:text-kali-green/80 transition-colors"
                      >
                        {expandedItems.has(activity.id) ? 'Show less' : 'Show details'}
                      </button>
                      
                      {expandedItems.has(activity.id) && (
                        <div className="mt-2 p-3 bg-kali-gray-800/50 rounded-lg border border-kali-gray-700">
                          <pre className="text-xs text-kali-gray-300 font-mono whitespace-pre-wrap">
                            {activity.details}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons for certain activity types */}
                  {(activity.type === 'vulnerability_found' || activity.type === 'session_established') && (
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-kali-green/20 text-kali-green px-2 py-1 rounded hover:bg-kali-green/30 transition-colors">
                        {activity.type === 'vulnerability_found' ? 'Investigate' : 'Connect'}
                      </button>
                      <button className="text-xs bg-kali-gray-800 text-kali-gray-300 px-2 py-1 rounded hover:bg-kali-gray-700 transition-colors">
                        Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load more button */}
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-kali-gray-800">
          <button className="w-full text-sm text-kali-gray-400 hover:text-white transition-colors py-2">
            Load more activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
