# CRITICAL INSTRUCTIONS FOR CURSOR:
# 1. Replace the ENTIRE /demo endpoint in CLAUDE_CLEAN_12.py with this code
# 2. This is a COMPLETE replacement - delete the old childish interface entirely
# 3. This implements Apple Liquid Glass effects with SVG distortion filters
# 4. DO NOT modify the CSS - it's precisely calibrated for glass effects
# 5. DO NOT add emojis - use only the specified SVG icons
# 6. Ensure proper Python string escaping with triple quotes
# 7. This creates a PREMIUM ENTERPRISE interface for roofing executives

@app.route('/demo', methods=['GET'])
def demo_interface():
    """Premium Apple Liquid Glass Demo Interface for Roofing AI Platform"""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roofing AI Platform - Executive Demo</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Apple Liquid Glass Variables */
        :root {
            --lg-bg-color: rgba(255, 255, 255, 0.15);
            --lg-highlight: rgba(255, 255, 255, 0.4);
            --lg-text: #ffffff;
            --lg-hover-glow: rgba(255, 255, 255, 0.25);
            --lg-accent: #007AFF;
            --lg-success: #34C759;
            --lg-warning: #FF9500;
            --lg-gradient-1: rgba(120, 119, 198, 0.3);
            --lg-gradient-2: rgba(255, 119, 198, 0.2);
            --lg-gradient-3: rgba(120, 219, 255, 0.3);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--lg-text);
            background: linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 25%, #16213E 50%, #0F3460 75%, #0E4B99 100%);
            background-attachment: fixed;
            min-height: 100vh;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 50%, var(--lg-gradient-1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, var(--lg-gradient-2) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, var(--lg-gradient-3) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }

        /* ========== GLASS CONTAINER SYSTEM ========== */
        .glass-container {
            position: relative;
            display: flex;
            flex-direction: column;
            font-weight: 500;
            color: var(--lg-text);
            cursor: pointer;
            background: transparent;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.3),
                0 1px 1px rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-container:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.4),
                0 1px 1px rgba(255, 255, 255, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .glass-container--large {
            min-width: 420px;
            padding: 32px;
        }

        .glass-container--medium {
            min-width: 380px;
            padding: 28px;
        }

        .glass-container--status {
            padding: 20px 32px;
            margin-bottom: 32px;
            flex-direction: row;
            align-items: center;
            gap: 16px;
        }

        /* ========== GLASS LAYERS ========== */
        .glass-filter {
            position: absolute;
            inset: 0;
            z-index: 0;
            backdrop-filter: blur(20px);
            filter: url(#lg-dist);
            isolation: isolate;
        }

        .glass-overlay {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: var(--lg-bg-color);
        }

        .glass-specular {
            position: absolute;
            inset: 0;
            z-index: 2;
            border-radius: inherit;
            overflow: hidden;
            box-shadow: 
                inset 1px 1px 0 var(--lg-highlight),
                inset 0 0 8px rgba(255, 255, 255, 0.1);
        }

        .glass-content {
            position: relative;
            z-index: 3;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* ========== LAYOUT SYSTEM ========== */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 32px;
            position: relative;
            z-index: 5;
        }

        .header {
            text-align: center;
            padding: 64px 32px;
            position: relative;
            z-index: 10;
        }

        .header h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 700;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #ffffff 0%, #a8b2f0 50%, #7c9ff0 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.02em;
        }

        .header .subtitle {
            font-size: 1.25rem;
            font-weight: 400;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }

        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 32px;
            margin-bottom: 64px;
        }

        /* ========== DEMO CONTENT ========== */
        .demo-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .demo-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--lg-accent), #5856D6);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .demo-description {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 24px;
            font-size: 15px;
            line-height: 1.6;
        }

        .feature-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }

        .feature-tag {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.9);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: all 0.3s ease;
        }

        .feature-tag:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
        }

        /* ========== BUTTONS ========== */
        .button-group {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
        }

        button {
            background: linear-gradient(135deg, var(--lg-accent), #5856D6);
            color: #ffffff;
            border: none;
            padding: 14px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
            position: relative;
            overflow: hidden;
        }

        button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0, 122, 255, 0.4);
        }

        button:hover::before {
            left: 100%;
        }

        .button-secondary {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .button-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
        }

        /* ========== STATUS INDICATOR ========== */
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--lg-success);
            box-shadow: 0 0 20px rgba(52, 199, 89, 0.6);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        .status.error .status-indicator {
            background: #FF3B30;
            box-shadow: 0 0 20px rgba(255, 59, 48, 0.6);
        }

        .status.warning .status-indicator {
            background: var(--lg-warning);
            box-shadow: 0 0 20px rgba(255, 149, 0, 0.6);
        }

        /* ========== RESPONSE CONTAINER ========== */
        .response {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            color: #e2e8f0;
            padding: 24px;
            border-radius: 16px;
            margin-top: 24px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .loading {
            display: none;
            color: var(--lg-accent);
            font-style: italic;
            margin-top: 16px;
            padding: 16px;
            background: rgba(0, 122, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid rgba(0, 122, 255, 0.3);
            text-align: center;
        }

        /* ========== SARAH VOICE CONTAINER ========== */
        .sarah-voice-container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 32px;
            margin: 24px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .sarah-voice-container::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--lg-gradient-1), var(--lg-gradient-2), var(--lg-gradient-3));
            border-radius: 20px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .sarah-voice-container:hover::before {
            opacity: 1;
        }

        .voice-title {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            display: block;
            margin-bottom: 16px;
            font-size: 18px;
        }

        .sarah-voice-container elevenlabs-convai {
            position: static !important;
            transform: none !important;
            bottom: auto !important;
            right: auto !important;
            width: 100% !important;
            max-width: none !important;
            display: block !important;
            margin: 0 auto !important;
            transition: none !important;
        }

        .sarah-voice-container elevenlabs-convai * {
            position: static !important;
            transform: none !important;
            transition: none !important;
        }

        /* ========== SCROLLBAR ========== */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 768px) {
            .demo-grid {
                grid-template-columns: 1fr;
                gap: 24px;
            }

            .container {
                padding: 0 16px;
            }

            .glass-container--large,
            .glass-container--medium {
                min-width: unset;
                padding: 24px;
            }

            .header {
                padding: 48px 16px;
            }

            .glass-container:hover {
                transform: translateY(-4px) scale(1.01);
            }
        }
    </style>
</head>
<body>
    <!-- SVG Distortion Filter for Liquid Glass Effect -->
    <svg style="display: none">
        <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </svg>

    <div class="header">
        <h1>Roofing AI Platform</h1>
        <p class="subtitle">Enterprise-Grade Intelligence for the Roofing Industry</p>
    </div>
    
    <div class="container">
        <!-- System Status -->
        <div class="glass-container glass-container--status" id="status">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="status-indicator"></div>
            <span id="statusText">Initializing AI systems...</span>
        </div>

        <div class="demo-grid">
            <!-- Social Media Demo -->
            <div class="glass-container glass-container--large">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>
                <div class="glass-content">
                    <div class="demo-title">
                        <div class="demo-icon">SM</div>
                        Social Media Content Creation
                    </div>
                    <p class="demo-description">Generate professional social media content with industry-specific messaging, compliance considerations, and optimized calls-to-action.</p>
                    
                    <div class="feature-tags">
                        <span class="feature-tag">Instant Content</span>
                        <span class="feature-tag">Industry Expertise</span>
                        <span class="feature-tag">Conversion Optimized</span>
                    </div>
                    
                    <div class="button-group">
                        <button onclick="runSocialDemo()">Generate Content</button>
                        <button class="button-secondary" onclick="showBackupSocial()">View Sample</button>
                    </div>
                    
                    <div class="loading" id="socialLoading">AI generating professional content...</div>
                    <div class="response" id="socialResponse" style="display: none;"></div>
                </div>
            </div>

            <!-- Automated Calls Demo -->
            <div class="glass-container glass-container--large">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>
                <div class="glass-content">
                    <div class="demo-title">
                        <div class="demo-icon">AC</div>
                        Automated Call Scripts
                    </div>
                    <p class="demo-description">Create professional outreach scripts incorporating current insurance regulations, market trends, and partnership value propositions.</p>
                    
                    <div class="feature-tags">
                        <span class="feature-tag">Relationship Building</span>
                        <span class="feature-tag">Insurance Expertise</span>
                        <span class="feature-tag">Professional Scripts</span>
                    </div>
                    
                    <div class="button-group">
                        <button onclick="runCallDemo()">Generate Script</button>
                        <button class="button-secondary" onclick="showBackupCall()">View Sample</button>
                    </div>
                    
                    <div class="loading" id="callLoading">AI crafting call strategy...</div>
                    <div class="response" id="callResponse" style="display: none;"></div>
                </div>
            </div>

            <!-- ACULinx Integration Demo -->
            <div class="glass-container glass-container--large">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>
                <div class="glass-content">
                    <div class="demo-title">
                        <div class="demo-icon">AL</div>
                        ACULinx Lead Processing
                    </div>
                    <p class="demo-description">Automatically process and prioritize leads with intelligent scheduling, insurance documentation, and comprehensive follow-up workflows.</p>
                    
                    <div class="feature-tags">
                        <span class="feature-tag">Instant Processing</span>
                        <span class="feature-tag">Priority Scheduling</span>
                        <span class="feature-tag">Insurance Documentation</span>
                    </div>
                    
                    <div class="button-group">
                        <button onclick="runWorkflowDemo()">Process Lead</button>
                        <button class="button-secondary" onclick="showBackupWorkflow()">View Sample</button>
                    </div>
                    
                    <div class="loading" id="workflowLoading">AI processing lead workflow...</div>
                    <div class="response" id="workflowResponse" style="display: none;"></div>
                </div>
            </div>

            <!-- Agent Management Demo -->
            <div class="glass-container glass-container--large">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>
                <div class="glass-content">
                    <div class="demo-title">
                        <div class="demo-icon">MA</div>
                        Multi-Agent Orchestration
                    </div>
                    <p class="demo-description">Dynamic agent switching with specialized expertise for sales, technical support, partnerships, and customer service scenarios.</p>
                    
                    <div class="feature-tags">
                        <span class="feature-tag">5 Specialized Agents</span>
                        <span class="feature-tag">Instant Switching</span>
                        <span class="feature-tag">Contextual Intelligence</span>
                    </div>
                    
                    <div class="button-group">
                        <button onclick="showAgents()">List Agents</button>
                        <button onclick="switchToSales()">Switch to Sales</button>
                    </div>
                    
                    <div class="loading" id="agentLoading">Managing agent ecosystem...</div>
                    <div class="response" id="agentResponse" style="display: none;"></div>
                </div>
            </div>

            <!-- Sarah Voice Demo -->
            <div class="glass-container glass-container--large">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>
                <div class="glass-content">
                    <div class="demo-title">
                        <div class="demo-icon">SC</div>
                        Sarah - AI Voice Specialist
                    </div>
                    <p class="demo-description">Experience live voice interaction with our advanced conversational AI trained specifically on roofing industry expertise, insurance regulations, and partnership strategies.</p>
                    
                    <div class="feature-tags">
                        <span class="feature-tag">Live Voice Interface</span>
                        <span class="feature-tag">Industry Expert Knowledge</span>
                        <span class="feature-tag">Real-time Responses</span>
                    </div>
                    
                    <div class="sarah-voice-container">
                        <span class="voice-title">Start Voice Conversation with Sarah</span>
                        <elevenlabs-convai agent-id="agent_01k0ah7ah0f2etf8mmxdrwc0zd"></elevenlabs-convai>
                        <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = 'http://localhost:5002';

        window.onload = function() {
            checkStatus();
        };

        async function checkStatus() {
            try {
                const response = await fetch(`${API_BASE}/api/status`);
                const data = await response.json();
                
                const statusEl = document.getElementById('status');
                const statusTextEl = document.getElementById('statusText');
                
                if (data.connected) {
                    statusTextEl.textContent = 'AI Systems Online - Enterprise Platform Ready';
                    statusEl.className = 'glass-container glass-container--status';
                } else {
                    statusTextEl.textContent = 'AI Processing Offline - Demo Mode Active';
                    statusEl.className = 'glass-container glass-container--status warning';
                }
            } catch (error) {
                const statusEl = document.getElementById('status');
                const statusTextEl = document.getElementById('statusText');
                statusTextEl.textContent = 'Platform Offline - Demonstration Mode Only';
                statusEl.className = 'glass-container glass-container--status error';
            }
        }

        async function runSocialDemo() {
            showLoading('socialLoading');
            try {
                const response = await fetch(`${API_BASE}/api/agents/content_creator`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        message: "Create a Facebook post about storm damage roof inspections for homeowners after the recent storm season"
                    })
                });
                const data = await response.json();
                showResponse('socialResponse', data);
            } catch (error) {
                showBackupSocial();
            }
            hideLoading('socialLoading');
        }

        function showBackupSocial() {
            const backup = {
                response: "STORM DAMAGE ROOF INSPECTION ALERT\\n\\nHomeowners: Don't wait until it's too late! Recent storms may have caused damage that's not visible from the ground but could lead to costly leaks and insurance claim denials.\\n\\n• FREE 15-minute inspection\\n• Insurance claim documentation included\\n• Same-day emergency repairs available\\n• Licensed & bonded professionals\\n\\nDid you know? Insurance companies require inspections within 30 days of storm damage for full coverage. We handle all the paperwork and work directly with your adjuster.\\n\\nCall now: [Your Phone]\\nSchedule online: [Your Website]\\n\\n#StormDamage #RoofRepair #InsuranceClaims #YourCityRoofing",
                agent_type: "content_creator",
                source: "backup_response"
            };
            showResponse('socialResponse', backup);
        }

        async function runCallDemo() {
            showLoading('callLoading');
            try {
                const response = await fetch(`${API_BASE}/api/agents/roofing_specialist`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        message: "Create a script for calling real estate agents about new insurance law changes affecting roof claims"
                    })
                });
                const data = await response.json();
                showResponse('callResponse', data);
            } catch (error) {
                showBackupCall();
            }
            hideLoading('callLoading');
        }

        function showBackupCall() {
            const backup = {
                response: "Hi [Agent Name], this is [Your Name] from [Company]. I'm reaching out because there are significant insurance law changes affecting roof claims that directly impact your listings and client transactions.\\n\\nHere's what's changed:\\n• New 30-day inspection requirements for storm damage claims\\n• Updated documentation standards that many contractors don't know about\\n• Pre-listing roof certifications now required for homes over 15 years\\n\\nThis affects your deals because:\\n• Buyers' insurance companies are requiring pre-purchase roof inspections\\n• Sellers need proper documentation to avoid claim denials\\n• Failed inspections can kill deals at closing\\n\\nI'd like to offer your clients:\\n• Complimentary pre-listing roof assessments\\n• 24-hour inspection reports for your transactions\\n• Direct communication with insurance adjusters\\n• Priority scheduling for your referrals\\n\\nCan we schedule 15 minutes this week to discuss how this partnership can help your deals close faster and protect your clients from insurance issues?",
                agent_type: "roofing_specialist",
                source: "backup_response"
            };
            showResponse('callResponse', backup);
        }

        async function runWorkflowDemo() {
            showLoading('workflowLoading');
            try {
                const response = await fetch(`${API_BASE}/api/workflow/execute`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        workflow_type: "complete_system",
                        input: "Process a new roof inspection lead from ACULinx: homeowner John Smith, storm damage claim, needs inspection within 48 hours"
                    })
                });
                const data = await response.json();
                showResponse('workflowResponse', data);
            } catch (error) {
                showBackupWorkflow();
            }
            hideLoading('workflowLoading');
        }

        function showBackupWorkflow() {
            const backup = {
                response: "LEAD PROCESSING COMPLETE - PRIORITY: HIGH\\n\\nLEAD DETAILS:\\nCustomer: John Smith\\nSource: ACULinx\\nIssue: Storm damage claim\\nUrgency: 48-hour requirement\\nStatus: PROCESSED & SCHEDULED\\n\\nACTIONS TAKEN:\\n• Lead prioritized as HIGH (storm damage = insurance deadline)\\n• Appointment scheduled within 24 hours (tomorrow 2:00 PM)\\n• Insurance documentation packet prepared\\n• Storm damage assessment checklist ready\\n• Follow-up sequence activated\\n\\nBUSINESS INTELLIGENCE:\\n• Customer qualified for emergency service rates\\n• Insurance claim value estimated: $8,000-15,000\\n• Probability of conversion: 85% (storm damage)\\n• Upsell opportunities: Gutters, siding inspection\\n\\nNEXT STEPS:\\n1. Inspector dispatch confirmed for tomorrow\\n2. Insurance adjuster contact attempted\\n3. Follow-up call scheduled for post-inspection\\n4. Estimate delivery within 24 hours of inspection\\n\\nLead processing time: 3.2 seconds\\nExpected close rate: 85%\\nProjected revenue: $12,500",
                workflow_type: "complete_system",
                source: "backup_response"
            };
            showResponse('workflowResponse', backup);
        }

        async function showAgents() {
            showLoading('agentLoading');
            try {
                const response = await fetch(`${API_BASE}/api/commands`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({command: "get_agents"})
                });
                const data = await response.json();
                showResponse('agentResponse', data);
            } catch (error) {
                const backup = {
                    available_agents: {
                        "pathsassin": "Learning and mastery development agent",
                        "sales_agent": "Sales and persuasion specialist",
                        "roofing_specialist": "Roofing industry expert with insurance law knowledge",
                        "content_creator": "Content creation and messaging specialist",
                        "relationship_agent": "Networking and relationship building expert"
                    },
                    success: true,
                    source: "backup_response"
                };
                showResponse('agentResponse', backup);
            }
            hideLoading('agentLoading');
        }

        async function switchToSales() {
            showLoading('agentLoading');
            try {
                const response = await fetch(`${API_BASE}/api/commands`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        command: "switch_agent",
                        params: {agent_type: "sales_agent"}
                    })
                });
                const data = await response.json();
                showResponse('agentResponse', data);
            } catch (error) {
                const backup = {
                    success: true,
                    new_agent: "sales_agent",
                    message: "Switched to sales_agent agent",
                    agent_capabilities: ["persuasion", "objection_handling", "closing", "relationship_building"],
                    source: "backup_response"
                };
                showResponse('agentResponse', backup);
            }
            hideLoading('agentLoading');
        }

        function showLoading(id) {
            document.getElementById(id).style.display = 'block';
        }

        function hideLoading(id) {
            document.getElementById(id).style.display = 'none';
        }

        function showResponse(id, data) {
            const element = document.getElementById(id);
            element.style.display = 'block';
            element.textContent = JSON.stringify(data, null, 2);
        }
    </script>
</body>
</html>'''