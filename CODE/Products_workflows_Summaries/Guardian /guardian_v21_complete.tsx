    /* ==============================================
       TYPOGRAPHY SYSTEM
       ============================================== */import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Cpu, GitBranch, Layers, CheckSquare, FileText, Lightbulb, ChevronsUpDown, Sparkles, Bot, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Guardian Digital Forest v2.1 - Refined Tactical Edition
const GuardianV21Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

    :root {
      --forest-black: #0a0f0a;
      --forest-deep: #0d1910;
      --forest-canopy: #1a2f20;
      --forest-moss: #2d4a35;
      --forest-emerald: #3d6b4a;
      --forest-sage: #5a8a67;
      --guardian-mint: #7bc299;
      --phosphor-lime: #a8f5c4;
      --bio-spark: #d4ffdc;
      --brushed-emerald: #4a7c59;
      --metallic-emerald: #5d8f6a;
      --gem-emerald: #6ba876;
      --titanium-base: #8892b0;
      --titanium-light: #a4afc7;
      --titanium-bright: #c5d2e8;
      --neon-accent: #64ffda;
      --data-gold: #ffd700;
      --data-amber: #ffb347;
    }

    body {
      background: var(--forest-black) !important;
    }

    /* ==============================================
       ENHANCED BENTO BOX SYSTEM
       ============================================== */

    .guardian-bento {
      background: rgba(22, 27, 34, 0.8);
      border: 1px solid rgba(124, 194, 153, 0.2);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      text-align: center;
    }

    .guardian-bento::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, 
        rgba(124, 194, 153, 0.1) 0%, 
        transparent 50%, 
        rgba(168, 245, 196, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      border-radius: 18px;
    }

    .guardian-bento:hover {
      border-color: rgba(124, 194, 153, 0.5);
      box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(124, 194, 153, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .guardian-bento:hover::before {
      opacity: 1;
    }

    /* ==============================================
       CONTROL PANEL SYSTEM CORE
       ============================================== */

    .guardian-control-panel {
      background: linear-gradient(135deg, 
        rgba(16, 20, 16, 0.95) 0%, 
        rgba(22, 27, 34, 0.9) 50%,
        rgba(26, 47, 32, 0.85) 100%);
      border: 3px solid #4a7c59;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 
        0 15px 50px rgba(0, 0, 0, 0.6),
        0 0 40px rgba(124, 194, 153, 0.3),
        inset 0 2px 0 rgba(255, 255, 255, 0.1),
        inset 0 -2px 0 rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(15px);
      position: relative;
      text-align: center;
    }

    .guardian-control-panel::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, 
        #4a7c59 0%, 
        #7bc299 25%, 
        #a8f5c4 50%, 
        #7bc299 75%, 
        #4a7c59 100%);
      background-size: 200% 200%;
      border-radius: 22px;
      z-index: -1;
      animation: control-panel-glow 4s ease-in-out infinite;
    }

    .control-panel-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(124, 194, 153, 0.3);
    }

    .control-panel-indicator {
      width: 12px;
      height: 12px;
      background: radial-gradient(circle, 
        var(--phosphor-lime) 0%, 
        var(--guardian-mint) 100%);
      border-radius: 50%;
      box-shadow: 
        0 0 10px rgba(168, 245, 196, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      animation: indicator-pulse 2s ease-in-out infinite;
    }

    .control-panel-content {
      position: relative;
    }

    @keyframes control-panel-glow {
      0%, 100% { 
        background-position: 0% 50%;
        opacity: 0.8;
      }
      50% { 
        background-position: 100% 50%;
        opacity: 1;
      }
    }

    @keyframes indicator-pulse {
      0%, 100% { 
        box-shadow: 
          0 0 10px rgba(168, 245, 196, 0.8),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }
      50% { 
        box-shadow: 
          0 0 20px rgba(168, 245, 196, 1),
          0 0 30px rgba(168, 245, 196, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }
    }

    .guardian-title {
      font-family: 'Orbitron', monospace;
      font-weight: 800;
      font-size: 2.5rem;
      text-align: center;
      text-transform: uppercase;
      color: var(--phosphor-lime);
      text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.9),
        0 0 15px rgba(168, 245, 196, 0.8);
      letter-spacing: 0.1em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }

    .guardian-core-header {
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      font-size: 1.5rem;
      text-align: center;
      text-transform: uppercase;
      color: var(--phosphor-lime);
      text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.9),
        0 0 15px rgba(168, 245, 196, 0.8);
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }

    .guardian-section-header {
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      font-size: 0.875rem;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, 
        var(--neon-accent), 
        var(--phosphor-lime));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }

    .guardian-section-header.matte {
      background: none;
      color: var(--forest-sage);
      background-clip: initial;
      -webkit-background-clip: initial;
      -webkit-text-fill-color: initial;
      opacity: 0.9;
    }

    .guardian-data-value {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 2rem;
      text-align: center;
      color: var(--data-gold);
      background: linear-gradient(145deg, 
        var(--data-gold), 
        var(--data-amber));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
      transition: all 0.3s ease;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
      margin: 0.5rem 0;
    }

    .guardian-status {
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      font-size: 1.5rem;
      text-align: center;
      animation: tactical-pulse 8s ease-in-out infinite;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .guardian-status.healthy {
      color: var(--phosphor-lime);
      text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.9),
        0 0 15px rgba(168, 245, 196, 0.8);
      animation: tactical-pulse 8s ease-in-out infinite;
    }

    .guardian-ai-text {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.6;
      text-align: center;
      color: #e2e8f0;
      background: linear-gradient(135deg, 
        #e2e8f0, 
        var(--neon-accent));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 8px rgba(100, 255, 218, 0.3);
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8));
    }

    .guardian-ai-text.italic {
      font-style: italic;
      background: linear-gradient(135deg, 
        var(--forest-sage), 
        var(--guardian-mint));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .guardian-metadata {
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
      font-size: 0.875rem;
      text-align: center;
      color: var(--forest-sage);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.8;
      transition: all 0.3s ease;
    }

    .guardian-metadata:hover {
      opacity: 1;
      color: var(--guardian-mint);
      text-shadow: 0 0 8px rgba(124, 194, 153, 0.4);
    }

    /* ==============================================
       INTEGRATED LOGO SYSTEM
       ============================================== */

    .guardian-logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .guardian-logo-box {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(145deg, 
        #c0c0c0, 
        #e8e8e8, 
        #f5f5f5);
      border: 3px solid #d0d0d0;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 
        0 12px 32px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(168, 245, 196, 0.6),
        inset 0 3px 0 rgba(255, 255, 255, 0.4),
        inset 0 -3px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .guardian-logo-box::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      right: 3px;
      bottom: 3px;
      background: linear-gradient(145deg, 
        rgba(124, 194, 153, 0.15), 
        rgba(168, 245, 196, 0.1));
      border-radius: 12px;
      opacity: 1;
    }

    .guardian-logo-box::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 3rem;
      height: 3rem;
      background: radial-gradient(circle, 
        rgba(168, 245, 196, 0.3) 0%, 
        transparent 70%);
      border-radius: 50%;
      animation: logo-pulse 3s ease-in-out infinite;
    }

    .guardian-logo {
      color: #2d4a35;
      filter: drop-shadow(0 0 8px rgba(124, 194, 153, 0.8));
      transition: all 0.3s ease;
      z-index: 2;
      position: relative;
    }

    .guardian-integrated-logo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .guardian-logo-text-top, .guardian-logo-text-bottom {
      font-family: 'Orbitron', monospace;
      font-weight: 800;
      font-size: 1.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      line-height: 0.9;
    }

    .guardian-logo-text-top {
      color: var(--phosphor-lime);
      text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.9),
        0 0 15px rgba(168, 245, 196, 0.8);
    }

    .guardian-logo-text-bottom {
      color: #c0c0c0;
      text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.9),
        0 0 10px rgba(192, 192, 192, 0.6);
      margin-left: 0.5rem;
    }

    @keyframes logo-pulse {
      0%, 100% { 
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1);
      }
      50% { 
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
      }
    }

    /* ==============================================
       TACTICAL BUTTON SYSTEM
       ============================================== */

    .guardian-button {
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: linear-gradient(135deg, 
        var(--forest-emerald) 0%, 
        var(--brushed-emerald) 50%, 
        var(--metallic-emerald) 100%);
      border: 2px solid var(--metallic-emerald);
      color: white;
      text-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.8),
        0 0 8px rgba(168, 245, 196, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    }

    .guardian-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(212, 255, 220, 0.3), 
        transparent);
      transition: left 0.6s ease;
    }

    .guardian-button:hover::before {
      left: 100%;
    }

    .guardian-button:hover {
      background: linear-gradient(135deg, 
        var(--metallic-emerald) 0%, 
        var(--gem-emerald) 50%, 
        var(--phosphor-lime) 100%);
      border-color: var(--phosphor-lime);
      box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.5),
        0 0 25px rgba(168, 245, 196, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .guardian-button:active {
      transform: translateY(0) scale(0.98);
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.6),
        inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .guardian-button-secondary {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: linear-gradient(135deg, 
        rgba(45, 74, 53, 0.8) 0%, 
        rgba(74, 124, 89, 0.6) 100%);
      border: 1px solid var(--brushed-emerald);
      color: var(--guardian-mint);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .guardian-button-secondary:hover {
      background: linear-gradient(135deg, 
        rgba(74, 124, 89, 0.9) 0%, 
        rgba(107, 168, 118, 0.7) 100%);
      border-color: var(--guardian-mint);
      color: var(--phosphor-lime);
      text-shadow: 0 0 8px rgba(168, 245, 196, 0.5);
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.4),
        0 0 15px rgba(124, 194, 153, 0.2);
      transform: translateY(-1px);
    }

    /* ==============================================
       ENHANCED PROGRESS & STATUS
       ============================================== */

    .guardian-progress-bar {
      background: linear-gradient(90deg, 
        var(--forest-moss), 
        var(--forest-emerald));
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
    }

    .guardian-progress-fill {
      background: linear-gradient(90deg, 
        var(--data-gold) 0%, 
        var(--data-amber) 50%,
        var(--phosphor-lime) 100%);
      height: 100%;
      border-radius: 12px;
      box-shadow: 
        0 0 15px rgba(255, 215, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .guardian-progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%);
      animation: tactical-shimmer 2.5s infinite;
    }

    /* ==============================================
       ANIMATIONS
       ============================================== */

    @keyframes tactical-pulse {
      0%, 100% { 
        text-shadow: 
          0 2px 4px rgba(0, 0, 0, 0.9),
          0 0 15px rgba(168, 245, 196, 0.8);
      }
      50% { 
        text-shadow: 
          0 2px 4px rgba(0, 0, 0, 0.9),
          0 0 20px rgba(168, 245, 196, 1);
      }
    }

    @keyframes tactical-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .guardian-icon-glow {
      filter: drop-shadow(0 0 8px currentColor);
      transition: all 0.3s ease;
    }

    .guardian-icon-glow:hover {
      filter: drop-shadow(0 0 16px currentColor);
      transform: scale(1.05);
    }

    .guardian-modal-enhanced {
      background: linear-gradient(135deg, 
        rgba(10, 15, 10, 0.98) 0%, 
        rgba(26, 47, 32, 0.95) 100%);
      border: 2px solid rgba(124, 194, 153, 0.4);
      backdrop-filter: blur(25px);
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.6),
        0 0 50px rgba(124, 194, 153, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .guardian-footer {
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
      text-align: center;
      color: var(--forest-sage);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    /* ==============================================
       RESPONSIVE SCALING
       ============================================== */

    @media (max-width: 768px) {
      .guardian-title { font-size: 2rem; }
      .guardian-core-header { font-size: 1.25rem; }
      .guardian-data-value { font-size: 1.5rem; }
      .guardian-status { font-size: 1.25rem; }
    }
  `}</style>
);

const BentoBox = ({ children, className = '' }) => (
  <div className={`guardian-bento ${className}`}>
    {children}
  </div>
);

const STATUS_CONFIG = {
  healthy: { icon: ShieldCheck, color: 'text-emerald-400', label: 'Healthy' },
  caution: { icon: ShieldAlert, color: 'text-yellow-400', label: 'Caution' },
  blocked: { icon: ShieldX, color: 'text-red-400', label: 'Blocked' },
};

const Header = () => (
  <header className="text-center pb-8 mb-8 border-b border-emerald-500/20">
    <div className="guardian-logo-container">
      <div className="guardian-logo-box">
        <Cpu className="w-8 h-8 guardian-logo" />
      </div>
      <div className="guardian-integrated-logo">
        <div className="guardian-logo-text-top">GUARDIAN</div>
        <div className="guardian-logo-text-bottom">DASHBOARD</div>
      </div>
    </div>
    <div className="mt-4">
      <span className="guardian-metadata">Default System Core</span>
      <ChevronsUpDown size={14} className="inline ml-2 text-emerald-500/60" />
    </div>
  </header>
);

const SystemCoreView = () => (
  <div className="guardian-control-panel">
    <div className="control-panel-header">
      <div className="control-panel-indicator"></div>
      <h2 className="guardian-core-header">System Core: Default System Core</h2>
      <div className="control-panel-indicator"></div>
    </div>
    <div className="control-panel-content">
      <p className="guardian-section-header mb-6">Guardian's primary objective is to protect this asset</p>
      <div className="pt-6 border-t border-emerald-500/20">
        <p className="guardian-section-header mb-3">Guardian's Predicted Vision</p>
        <p className="guardian-ai-text italic text-lg">"Awaiting project import for analysis."</p>
      </div>
    </div>
  </div>
);

const CoreStatusCard = () => {
  const Status = STATUS_CONFIG.healthy;
  return (
    <BentoBox>
      <h3 className="guardian-section-header mb-2">Core Integrity</h3>
      <p className="guardian-metadata mb-6">Real-time health status</p>
      <div className="flex flex-col items-center gap-4">
        <div className="p-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30">
          <Status.icon className="w-12 h-12 text-emerald-400 guardian-icon-glow" />
        </div>
        <span className="guardian-status healthy">{Status.label}</span>
      </div>
    </BentoBox>
  );
};

const AIToolsCard = ({ onQuickEstimate, onNewProposal }) => (
  <BentoBox>
    <h3 className="guardian-section-header mb-2">AI Toolkit</h3>
    <p className="guardian-metadata mb-6">Engage with Guardian</p>
    <div className="flex flex-col gap-4">
      <button 
        onClick={onQuickEstimate} 
        className="w-full flex items-center justify-center gap-3 p-4 rounded-lg guardian-button-secondary transition-all duration-150 ease-in-out"
      >
        <Lightbulb className="text-emerald-400 guardian-icon-glow" size={18} /> 
        <span className="guardian-ai-text font-semibold text-sm">Quick Estimate</span>
      </button>
      <button 
        onClick={onNewProposal} 
        className="w-full flex items-center justify-center gap-3 p-4 rounded-lg guardian-button-secondary transition-all duration-150 ease-in-out"
      >
        <FileText className="text-emerald-400 guardian-icon-glow" size={18} /> 
        <span className="guardian-ai-text font-semibold text-sm">New Proposal</span>
      </button>
    </div>
  </BentoBox>
);

const ModuleCard = ({ project }) => {
  const Status = STATUS_CONFIG[project.status];
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.completed).length || 0;

  return (
    <BentoBox className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="guardian-ai-text font-bold text-lg">{project.name}</h4>
        <Status.icon className={`w-6 h-6 ${Status.color} guardian-icon-glow`} />
      </div>
      <p className="guardian-metadata mb-4">Goal: {project.goal}</p>
      
      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="guardian-metadata flex items-center gap-2">
              <CheckSquare size={14}/> Tasks
            </span>
            <span className="guardian-data-value text-base">{completedTasks} / {totalTasks}</span>
          </div>
          <div className="guardian-progress-bar h-2">
            <div 
              className="guardian-progress-fill h-2 transition-all duration-500" 
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <button className="w-full flex items-center justify-center gap-3 guardian-button text-sm font-bold py-3 px-4 rounded-lg transition-all duration-150 ease-in-out">
        <Sparkles size={16} className="guardian-icon-glow" />
        <span>Generate Tasks</span>
      </button>
    </BentoBox>
  );
};

const ModulesView = () => {
  const sampleProjects = [
    {
      id: 1,
      name: "Clay-I System Architecture",
      goal: "Semi-autonomous assistant for creative project management",
      status: "healthy",
      tasks: [
        { text: "Firebase integration setup", completed: true },
        { text: "OpenAI API configuration", completed: true },
        { text: "Thought Cores data structure", completed: false },
        { text: "n8n automation workflow", completed: false }
      ]
    },
    {
      id: 2,
      name: "Real-time Analytics Engine", 
      goal: "Process and visualize integration risk data",
      status: "caution",
      tasks: [
        { text: "Risk assessment algorithm", completed: true },
        { text: "Integration point analysis", completed: false },
        { text: "Security vulnerability scan", completed: false }
      ]
    }
  ];

  return (
    <BentoBox>
      <h3 className="guardian-section-header mb-2 flex items-center justify-center gap-3">
        <GitBranch className="text-emerald-400/70 guardian-icon-glow" size={20} />
        Active Modules
      </h3>
      <p className="guardian-metadata mb-6">Code analysis and integration projects</p>
      <div>
        {sampleProjects.map(p => <ModuleCard key={p.id} project={p} />)}
      </div>
    </BentoBox>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="guardian-modal-enhanced rounded-2xl shadow-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const ProposalModal = ({ isOpen, onClose }) => {
  const [proposal, setProposal] = useState({
    name: '',
    goal: '',
    integrationPoints: '',
    techStack: '',
    dependencies: '',
    userContext: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProposal(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="guardian-core-header mb-4">Module Integration Proposal</h2>
        <p className="guardian-metadata mb-8">This specification will be submitted to Guardian for automated analysis</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block guardian-ai-text font-semibold mb-2">Module Name</label>
              <input 
                type="text" 
                name="name" 
                value={proposal.name}
                onChange={handleChange}
                className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors backdrop-blur-sm" 
                placeholder="e.g., Real-time Analytics Engine"
                required
              />
            </div>
            <div>
              <label className="block guardian-ai-text font-semibold mb-2">Primary Goal</label>
              <input 
                type="text" 
                name="goal" 
                value={proposal.goal}
                onChange={handleChange}
                className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors backdrop-blur-sm" 
                placeholder="e.g., To process and visualize user data"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block guardian-ai-text font-semibold mb-2">Integration Points & Endpoints</label>
            <textarea 
              name="integrationPoints" 
              value={proposal.integrationPoints}
              onChange={handleChange}
              rows="3" 
              className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors backdrop-blur-sm" 
              placeholder="e.g., Hooks into onUserLogin event, triggers onSummaryComplete..."
              required
            />
            <p className="guardian-metadata mt-2">Define the 'plugs' on your module</p>
          </div>
          
          <div>
            <label className="block guardian-ai-text font-semibold mb-2">Core Technologies & Dependencies</label>
            <textarea 
              name="techStack" 
              value={proposal.techStack}
              onChange={handleChange}
              rows="3" 
              className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors backdrop-blur-sm" 
              placeholder="e.g., TypeScript, React, Firebase, d3.js..."
              required
            />
            <p className="guardian-metadata mt-2">List languages, frameworks, and key libraries</p>
          </div>
          
          <div className="mt-10 flex justify-center gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="py-3 px-6 guardian-button-secondary rounded-lg font-semibold transition-all duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="py-3 px-8 guardian-button rounded-lg font-bold transition-all duration-150 ease-in-out"
            >
              Submit for Guardian Analysis
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const QuickEstimateModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-8">
      <h2 className="guardian-core-header mb-4">Quick Module Estimate</h2>
      <p className="guardian-metadata mb-8">Pitch an idea to your intelligent realist for a quick gut-check</p>
      
      <div className="space-y-6">
        <div>
          <h4 className="guardian-section-header mb-3">Feasibility Assessment:</h4>
          <p className="guardian-ai-text italic text-lg">"This integration approach is architecturally sound. The Firebase + OpenAI stack provides solid foundations for real-time thought capture and AI processing."</p>
        </div>
        <div>
          <h4 className="guardian-section-header mb-3" style={{ color: 'var(--data-amber)' }}>Potential Risk Factors:</h4>
          <p className="guardian-ai-text italic text-lg">"Watch for API rate limits under heavy usage. OpenAI dependency creates single point of failure. Consider implementing graceful degradation."</p>
        </div>
        <div className="mt-10 flex justify-center">
          <button 
            onClick={onClose} 
            className="py-3 px-6 guardian-button-secondary rounded-lg font-semibold transition-all duration-150 ease-in-out"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  </Modal>
);

export default function GuardianV21Complete() {
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900 text-gray-300 font-sans overflow-hidden">
      <GuardianV21Styles />
      
      {/* Deep Forest Background Layers */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-emerald-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(74,124,89,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,194,153,0.05)_0%,transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Header />
          <main className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-4">
                <SystemCoreView />
              </div>
              <div className="lg:col-span-2">
                <ModulesView />
              </div>
              <div className="lg:col-span-1">
                <CoreStatusCard />
              </div>
              <div className="lg:col-span-1">
                <AIToolsCard 
                  onQuickEstimate={() => setShowEstimateModal(true)} 
                  onNewProposal={() => setShowProposalModal(true)} 
                />
              </div>
            </div>
          </main>
          
          <footer className="text-center mt-16 guardian-footer">
            <p className="text-lg">Guardian Dashboard | Where creativity never gets out of hand.</p>
            <p className="mt-2 text-sm opacity-70">Digital Forest v2.1 - Refined Tactical Edition</p>
          </footer>
        </div>
      </div>
      
      <ProposalModal isOpen={showProposalModal} onClose={() => setShowProposalModal(false)} />
      <QuickEstimateModal isOpen={showEstimateModal} onClose={() => setShowEstimateModal(false)} />
    </div>
  );
}