import React, { useState, useEffect, useCallback } from 'react';
import AgentTile from './AgentTile';
import { AgentGridProps, AgentStatus } from './types';
import { mockAgents } from './mockData';

const AgentGrid: React.FC<AgentGridProps> = ({
  agents: providedAgents,
  className = '',
  onAgentSelect,
  onAgentDeploy,
  onAgentTerminate,
  realTimeUpdates = true
}) => {
  const [agents, setAgents] = useState<AgentStatus[]>(providedAgents || mockAgents);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const updateInterval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          // Small chance to change status
          if (Math.random() < 0.05) {
            let newStatus = agent.status;
            
            // Prefer online status, but allow transitions
            if (Math.random() < 0.7) {
              newStatus = 'online';
            } else if (Math.random() < 0.5) {
              newStatus = 'busy';
            } else {
              newStatus = 'offline';
            }

            return {
              ...agent,
              status: newStatus,
              lastSeen: new Date()
            };
          }

          // Update performance metrics slightly
          if (Math.random() < 0.3) {
            const performanceChange = (Math.random() - 0.5) * 10; // ±5%
            const newPerformance = Math.max(0, Math.min(100, agent.performanceMetric + performanceChange));
            
            return {
              ...agent,
              performanceMetric: Math.floor(newPerformance),
              cpuUsage: Math.max(0, Math.min(100, agent.cpuUsage + (Math.random() - 0.5) * 20)),
              memoryUsage: Math.max(0, Math.min(100, agent.memoryUsage + (Math.random() - 0.5) * 15)),
              lastSeen: new Date()
            };
          }

          return agent;
        })
      );
      setLastUpdate(new Date());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(updateInterval);
  }, [realTimeUpdates]);

  const handleAgentSelect = useCallback((agent: AgentStatus) => {
    onAgentSelect?.(agent);
  }, [onAgentSelect]);

  const handleAgentDeploy = useCallback((agentId: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, status: 'online' as const, lastSeen: new Date() }
          : agent
      )
    );
    onAgentDeploy?.(agentId);
  }, [onAgentDeploy]);

  const handleAgentTerminate = useCallback((agentId: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, status: 'offline' as const, lastSeen: new Date() }
          : agent
      )
    );
    onAgentTerminate?.(agentId);
  }, [onAgentTerminate]);

  // Calculate status counts for header
  const statusCounts = agents.reduce(
    (acc, agent) => {
      acc[agent.status]++;
      return acc;
    },
    { online: 0, busy: 0, offline: 0 }
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-4 border-b border-cosine-tactical/20 pb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-cosine-tactical/10 border border-cosine-tactical/30 flex items-center justify-center">
              <div className="w-2 h-2 bg-cosine-matrix rounded-full"></div>
            </div>
            <h3 className="text-lg font-mono text-cosine-matrix tracking-wider font-bold">
              AGENT DEPLOYMENT GRID [25]
            </h3>
          </div>
          {realTimeUpdates && (
            <div className="flex items-center space-x-2 px-2 py-1 bg-cosine-matrix/10 border border-cosine-matrix/30">
              <div className="w-2 h-2 bg-cosine-matrix rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-cosine-matrix tracking-wider">LIVE TACTICAL FEED</span>
            </div>
          )}
        </div>
        
        {/* Status Summary */}
        <div className="flex items-center space-x-6 bg-cosine-charcoal/50 px-4 py-2 border border-cosine-tactical/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-cosine-light">OPERATIONAL</span>
            <span className="text-sm font-mono text-[#00FF41] font-bold">{statusCounts.online}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#FFB000] rounded-full"></div>
            <span className="text-xs font-mono text-cosine-light">ACTIVE</span>
            <span className="text-sm font-mono text-[#FFB000] font-bold">{statusCounts.busy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#FF3333] rounded-full"></div>
            <span className="text-xs font-mono text-cosine-light">OFFLINE</span>
            <span className="text-sm font-mono text-[#FF3333] font-bold">{statusCounts.offline}</span>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className={`
        grid gap-3
        grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5
        md:grid-rows-5
        auto-rows-fr
        min-h-[500px]
        relative
      `}>
        {agents.map((agent) => (
          <AgentTile
            key={agent.id}
            agent={agent}
            onSelect={handleAgentSelect}
            onDeploy={handleAgentDeploy}
            onTerminate={handleAgentTerminate}
          />
        ))}
      </div>

      {/* Grid Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cosine-tactical/20">
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-cosine-tactical rounded-full"></div>
            <span className="text-cosine-tactical tracking-wider">{agents.length} AGENTS DEPLOYED</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-cosine-matrix rounded-full"></div>
            <span className="text-cosine-light">GRID STATUS: OPERATIONAL</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="w-1 h-1 bg-cosine-matrix rounded-full animate-pulse"></div>
          <span className="text-cosine-tactical tracking-wider">
            LAST UPDATE: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentGrid;