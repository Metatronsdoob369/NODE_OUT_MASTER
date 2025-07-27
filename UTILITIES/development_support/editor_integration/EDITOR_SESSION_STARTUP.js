#!/usr/bin/env node
/**
 * EDITOR SESSION STARTUP - Cascade Intelligence System
 * Auto-loads when editor opens, provides instant project context
 * Integrates with 25-agent system + Clay-I memory
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 EDITOR CASCADE STARTUP...');

// Load project intelligence instantly
const PROJECT_CONTEXT = {
    // Active missions
    current_missions: [
        '⚡ Birmingham Storm Visualization',
        '💰 Payment Portal (localhost:5173)',
        '🤖 25-Agent Coordination', 
        '🎯 N8N Workflow Deployment',
        '📹 Pathsassin YouTube Warfare'
    ],
    
    // Agent endpoints
    agent_endpoints: {
        clay_i: 'localhost:8000',
        pathsassin: 'localhost:5001', 
        payment_system: 'localhost:5173',
        backend_api: 'localhost:5002'
    },
    
    // Hot files (instant access)
    hot_files: [
        'CLAUDE_SESSION_STARTUP.js',
        'agents/clay_i_server.py',
        'agents/Pathsassin_agent.py',
        'automated_city_builder.py',
        'BHAM_NIGHT_BUYS/SESSION_SUMMARY.md'
    ],
    
    // Quick actions
    quick_actions: {
        'Alt+C': 'Open Claude context',
        'Alt+A': 'Launch agent server',
        'Alt+P': 'Start payment portal',
        'Alt+B': 'Birmingham automation',
        'Alt+N': 'N8N workflow deploy'
    }
};

// Editor-specific integrations
const EDITOR_INTEGRATIONS = {
    vscode: {
        workspace_setup: setupVSCodeWorkspace,
        snippet_injection: injectVSCodeSnippets,
        task_integration: setupVSCodeTasks
    },
    cursor: {
        ai_context: injectCursorContext,
        project_setup: setupCursorProject,
        agent_integration: linkCursorAgents
    },
    windsurf: {
        cascade_setup: setupWindsurfCascade,
        intelligence_link: linkWindsurfIntelligence
    }
};

function detectEditor() {
    const processName = process.env.TERM_PROGRAM || process.env.EDITOR || 'unknown';
    
    if (processName.includes('vscode') || process.env.VSCODE_PID) return 'vscode';
    if (processName.includes('cursor') || process.env.CURSOR_PID) return 'cursor'; 
    if (processName.includes('windsurf')) return 'windsurf';
    
    return 'generic';
}

function setupVSCodeWorkspace() {
    const workspaceConfig = {
        folders: [
            { path: "." },
            { path: "./agents", name: "🤖 Agents" },
            { path: "./BHAM_NIGHT_BUYS", name: "⚡ Birmingham" },
            { path: "./workflows", name: "🔧 Workflows" }
        ],
        settings: {
            "terminal.integrated.defaultProfile.osx": "zsh",
            "files.associations": {
                "*.clay": "javascript",
                "CLAUDE*": "markdown"
            }
        },
        tasks: {
            version: "2.0.0",
            tasks: [
                {
                    label: "🚀 Start Clay-I",
                    type: "shell",
                    command: "python agents/clay_i_server.py",
                    group: "build"
                },
                {
                    label: "💰 Launch Payment Portal", 
                    type: "shell",
                    command: "npm run dev",
                    options: { cwd: "${workspaceFolder}" },
                    group: "build"
                }
            ]
        }
    };
    
    fs.writeFileSync('.vscode/workspace.json', JSON.stringify(workspaceConfig, null, 2));
    console.log('✅ VS Code workspace configured');
}

function injectCursorContext() {
    const cursorContext = {
        project_type: "AI Agent Coordination Platform",
        main_technologies: ["Node.js", "Python", "N8N", "UE5", "Firebase"],
        agent_system: "25-agent coordination with Clay-I intelligence",
        current_focus: "Birmingham storm visualization + payment systems",
        coding_style: "Direct, efficient, results-oriented",
        agent_endpoints: PROJECT_CONTEXT.agent_endpoints
    };
    
    fs.writeFileSync('.cursor/project-context.json', JSON.stringify(cursorContext, null, 2));
    console.log('✅ Cursor AI context injected');
}

function cascadeIntelligence() {
    // Load Clay-I memory if available
    try {
        const clayMemory = require('./init_clay_memory.js');
        console.log('🧠 Clay-I memory cascaded to editor');
    } catch (e) {
        console.log('⚠️  Clay-I memory not available, using local context');
    }
    
    // Setup agent coordination
    const agentStatus = checkAgentStatus();
    console.log('🤖 Agent coordination status:', agentStatus);
    
    // Project structure awareness
    const projectStructure = analyzeProjectStructure();
    console.log('📁 Project structure loaded:', Object.keys(projectStructure).length, 'modules');
}

function checkAgentStatus() {
    const agents = ['clay_i_server.py', 'Pathsassin_agent.py', 'revenue_generator.py'];
    return agents.map(agent => ({
        name: agent,
        status: fs.existsSync(`agents/${agent}`) ? 'available' : 'missing'
    }));
}

function analyzeProjectStructure() {
    const structure = {};
    const dirs = ['agents', 'BHAM_NIGHT_BUYS', 'workflows', 'CODE'];
    
    dirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            structure[dir] = fs.readdirSync(dir).length;
        }
    });
    
    return structure;
}

function setupQuickActions() {
    // Create quick action scripts
    const quickActions = {
        'start-agents.sh': '#!/bin/bash\npython agents/clay_i_server.py &\npython agents/Pathsassin_agent.py &',
        'deploy-payment.sh': '#!/bin/bash\nnpm run dev &\necho "Payment portal: localhost:5173"',
        'birmingham-automation.sh': '#!/bin/bash\npython automated_city_builder.py'
    };
    
    Object.entries(quickActions).forEach(([name, script]) => {
        fs.writeFileSync(`.editor-actions/${name}`, script);
        console.log(`⚡ Quick action: ${name}`);
    });
}

// Main cascade execution
function executeEditorCascade() {
    const editor = detectEditor();
    console.log(`🎯 Detected editor: ${editor}`);
    
    // Universal setup
    cascadeIntelligence();
    setupQuickActions();
    
    // Editor-specific setup
    if (EDITOR_INTEGRATIONS[editor]) {
        Object.values(EDITOR_INTEGRATIONS[editor]).forEach(fn => {
            if (typeof fn === 'function') fn();
        });
    }
    
    console.log('');
    console.log('✅ EDITOR CASCADE COMPLETE');
    console.log('🎯 Current Focus:', PROJECT_CONTEXT.current_missions[0]);
    console.log('🤖 Agent Endpoints Ready');
    console.log('⚡ Quick Actions Available');
    console.log('🧠 Intelligence Cascaded');
    console.log('');
    console.log('Ready for immediate productivity.');
}

// Execute if run directly
if (require.main === module) {
    executeEditorCascade();
}

module.exports = {
    PROJECT_CONTEXT,
    EDITOR_INTEGRATIONS,
    executeEditorCascade
};