import React from 'react';

const MetricsCard = ({ title, value, change, changeType, icon, color }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-kali-green';
      case 'decrease':
        return 'text-red-400';
      case 'stable':
        return 'text-kali-gray-400';
      default:
        return 'text-kali-gray-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'decrease':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card hover:border-kali-green/30 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-kali-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
                {getChangeIcon()}
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`text-${color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
          {icon}
        </div>
      </div>
      
      {/* Progress indicator for active metrics */}
      {(title.includes('Active') || title.includes('Vulnerabilities')) && (
        <div className="mt-4">
          <div className="w-full bg-kali-gray-800 rounded-full h-1">
            <div 
              className={`bg-${color} h-1 rounded-full transition-all duration-500 animate-pulse`}
              style={{ 
                width: title.includes('Scans') ? '60%' : 
                       title.includes('Sessions') ? '40%' : 
                       title.includes('Vulnerabilities') ? '85%' : '0%' 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsCard;
