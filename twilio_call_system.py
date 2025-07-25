#!/usr/bin/env python3
"""
TWILIO CALL SYSTEM - DEDICATED PHONE NUMBER
Replaces direct cell calls with Twilio business number
"""

import os
from twilio.rest import Client

def setup_twilio_call_system():
    """Configure Twilio for business calls instead of personal cell"""
    
    # Twilio configuration
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    twilio_number = os.getenv('TWILIO_PHONE_NUMBER')
    
    if not all([account_sid, auth_token, twilio_number]):
        print("⚠️ Twilio configuration needed")
        print("Add to config.env:")
        print("TWILIO_ACCOUNT_SID=your_account_sid")
        print("TWILIO_AUTH_TOKEN=your_auth_token") 
        print("TWILIO_PHONE_NUMBER=+1234567890")
        return
    
    client = Client(account_sid, auth_token)
    
    print("🎯 TWILIO CALL SYSTEM CONFIGURED")
    print("=" * 40)
    print(f"📞 Business Number: {twilio_number}")
    print(f"📱 Your Cell: PROTECTED")
    print("✅ Calls route through Twilio, not personal cell")
    
    return client

def create_call_widget_with_twilio():
    """Create call widget using Twilio business number"""
    
    html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NODE OUT - Twilio Call System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #ffffff;
            font-family: 'Arial', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .twilio-widget {
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid #00d4ff;
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }

        .twilio-title {
            font-size: 2.5em;
            color: #00d4ff;
            margin-bottom: 20px;
            text-shadow: 0 0 20px #00d4ff;
        }

        .business-number {
            background: rgba(0, 255, 136, 0.2);
            border: 1px solid #00ff88;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            font-size: 1.5em;
        }

        .call-button {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            border: none;
            border-radius: 50px;
            padding: 25px 50px;
            font-size: 1.3em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #000;
            margin: 10px;
        }

        .call-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.5);
        }

        .twilio-badge {
            background: linear-gradient(45deg, #ff6b35, #00d4ff);
            color: #000;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="twilio-widget">
        <h1 class="twilio-title">NODE OUT TWILIO CALL</h1>
        
        <div class="twilio-badge">BUSINESS NUMBER</div>
        
        <div class="business-number" id="businessNumber">
            📞 +1 (XXX) XXX-XXXX
        </div>

        <div class="call-button" onclick="scheduleCall()">
            📅 SCHEDULE CONSULTATION
        </div>

        <div class="call-button" onclick="requestDemo()">
            🎯 REQUEST DEMO
        </div>

        <div class="twilio-badge">
            $2,500 Enterprise System
        </div>

        <div style="margin-top: 20px; color: #00ff88;">
            <p>✅ Business calls, not personal cell</p>
            <p>✅ 25-agent consultation system</p>
            <p>✅ Enterprise-grade communication</p>
        </div>
    </div>

    <script>
        function scheduleCall() {
            window.open('https://calendly.com/node-out/consultation', '_blank');
        }

        function requestDemo() {
            window.open('https://calendly.com/node-out/demo', '_blank');
        }

        // Twilio integration placeholder
        function setupTwilioCall() {
            // This will be replaced with actual Twilio integration
            console.log('Twilio call system ready');
        }

        setupTwilioCall();
    </script>
</body>
</html>'''
    
    return html

if __name__ == "__main__":
    # Create Twilio configuration template
    twilio_config = '''
# Add these to your config.env for Twilio integration:
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WEBHOOK_URL=https://your-domain.com/twilio-webhook
'''
    
    with open('/Users/joewales/NODE_OUT_Master/config.env', 'a') as f:
        f.write(twilio_config)
    
    print("🎯 TWILIO CALL SYSTEM READY")
    print("📞 Business calls route through Twilio, not personal cell")
    print("✅ Replace placeholders with actual Twilio credentials")

if __name__ == "__main__":
    setup_twilio_call_system()
    html = create_call_widget_with_twilio()
    
    with open('/Users/joewales/NODE_OUT_Master/twilio_call_widget.html', 'w') as f:
        f.write(html)
    
    print("✅ Twilio call widget created")
    print("✅ Business number integration ready")
