#!/bin/bash
# Birmingham Automation Startup Script

echo "🚀 Starting Birmingham Zero-Click Automation System"

# Start automation server in background
cd /Users/joewales/NODE_OUT_Master/agents
python3 birmingham_automation_server.py &

# Open HTML interface
open file:///Users/joewales/NODE_OUT_Master/birmingham_storm_live_interface.html

echo "✅ Automation system ready"
echo "🌐 HTML Interface: file:///Users/joewales/NODE_OUT_Master/birmingham_storm_live_interface.html"
echo "🤖 Click 'ZERO-CLICK BIRMINGHAM AUTOMATION' button to execute"
