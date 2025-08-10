import React, { useState } from 'react';
import { AgentTileProps } from './types';

const AgentTile: React.FC<AgentTileProps> = ({ 
  agent, 
  onSelect, 
  onDeploy, 
  onTerminate 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#00FF41'; // matrix green
      case 'busy':
        return '#FFB000'; // amber
      case 'offline':
        return '#FF3333'; // red
      default:
        return '#8B9A82'; // tactical gray-green
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'OPERATIONAL';
      case 'busy':
        return 'ACTIVE';
      case 'offline':
        return 'OFFLINE';
      default:
        return 'UNKNOWN';
    }
  };

  const formatUptime = (deploymentTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - deploymentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <>
      <div
        className={`
          relative bg-cosine-charcoal border border-cosine-tactical/30 
          transition-all duration-300 cursor-pointer group
          hover:border-cosine-matrix/50 hover:bg-cosine-charcoal/80 hover:shadow-lg hover:shadow-cosine-matrix/20
          min-h-[120px] flex flex-col
          ${isHovered ? 'transform scale-105 z-20 border-cosine-matrix/70' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setShowDetails(true);
          onSelect?.(agent);
        }}
      >
        {/* Status Indicator */}
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: getStatusColor(agent.status) }}
        >
          {agent.status === 'online' && (
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{ backgroundColor: getStatusColor(agent.status) }}
            />
          )}
        </div>

        {/* Agent Info */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono text-cosine-tactical tracking-wider">
              {agent.id}
            </div>
            <div className="text-xs font-mono text-cosine-tactical/70">
              {agent.specialization.split(' ')[0]}
            </div>
          </div>

          {/* Callsign */}
          <div className="text-sm font-mono text-cosine-light font-bold mb-2 tracking-wider">
            {agent.callsign}
          </div>

          {/* Status */}
          <div 
            className="text-xs font-mono mb-2 tracking-wider font-bold"
            style={{ color: getStatusColor(agent.status) }}
          >
            {getStatusText(agent.status)}
          </div>

          {/* Current Task */}
          <div className="text-xs font-mono text-cosine-light/70 mb-2 truncate flex-1">
            {agent.currentTask}
          </div>

          {/* Performance Metrics Row */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cosine-tactical tracking-wider">PERFORMANCE</span>
              <span className={`text-xs font-mono font-bold ${
                agent.performanceMetric >= 90 ? 'text-cosine-matrix' :
                agent.performanceMetric >= 70 ? 'text-[#FFB000]' : 'text-[#FF3333]'
              }`}>
                {agent.performanceMetric}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-cosine-void/50 h-1.5 overflow-hidden border border-cosine-tactical/20">
              <div 
                className={`h-full transition-all duration-500 ${
                  agent.performanceMetric >= 90 ? 'bg-cosine-matrix' :
                  agent.performanceMetric >= 70 ? 'bg-[#FFB000]' : 'bg-[#FF3333]'
                }`}
                style={{ width: `${agent.performanceMetric}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        {isHovered && (
          <div className="absolute inset-0 border border-cosine-matrix/30 pointer-events-none" />
        )}
      </div>

      {/* Detailed Modal/Overlay */}
      {showDetails && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="bg-cosine-charcoal border border-cosine-matrix/50 p-6 w-96 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-mono text-cosine-matrix">
                  AGENT {agent.callsign}
                </h3>
                <p className="text-sm text-cosine-tactical">{agent.id}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-cosine-tactical hover:text-cosine-light"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-mono text-cosine-tactical mb-1">STATUS</div>
                <div 
                  className="text-sm font-mono"
                  style={{ color: getStatusColor(agent.status) }}
                >
                  {getStatusText(agent.status)}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-cosine-tactical mb-1">UPTIME</div>
                <div className="text-sm font-mono text-cosine-light">
                  {formatUptime(agent.deploymentTime)}
                </div>
              </div>
            </div>

            {/* Current Task */}
            <div className="mb-4">
              <div className="text-xs font-mono text-cosine-tactical mb-1">CURRENT TASK</div>
              <div className="text-sm font-mono text-cosine-light">
                {agent.currentTask}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-mono text-cosine-tactical mb-1">SUCCESS RATE</div>
                <div className="text-sm font-mono text-cosine-matrix">
                  {agent.successRate}%
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-cosine-tactical mb-1">TASKS</div>
                <div className="text-sm font-mono text-cosine-light">
                  {agent.completedTasks}/{agent.totalTasks}
                </div>
              </div>
            </div>

            {/* System Resources */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-mono text-cosine-tactical mb-1">CPU</div>
                <div className="text-sm font-mono text-cosine-light">
                  {agent.cpuUsage}%
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-cosine-tactical mb-1">MEMORY</div>
                <div className="text-sm font-mono text-cosine-light">
                  {agent.memoryUsage}%
                </div>
              </div>
            </div>

            {/* Last Seen */}
            <div className="mb-6">
              <div className="text-xs font-mono text-cosine-tactical mb-1">LAST SEEN</div>
              <div className="text-sm font-mono text-cosine-light">
                {formatLastSeen(agent.lastSeen)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onDeploy?.(agent.id)}
                className="flex-1 px-4 py-2 bg-cosine-matrix/20 border border-cosine-matrix text-cosine-matrix text-sm font-mono hover:bg-cosine-matrix/30 transition-colors"
              >
                DEPLOY
              </button>
              <button
                onClick={() => onTerminate?.(agent.id)}
                className="flex-1 px-4 py-2 bg-red-900/20 border border-red-500 text-red-500 text-sm font-mono hover:bg-red-900/30 transition-colors"
              >
                TERMINATE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentTile;