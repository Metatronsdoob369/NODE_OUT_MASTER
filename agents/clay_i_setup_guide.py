#!/usr/bin/env python3
"""
Clay-I Setup Guide - Authentication Requirements
Tells Clay-I exactly what credentials are needed to get started
"""

import os
import json
from datetime import datetime

class ClayISetupGuide:
    """Guide for setting up Clay-I with real-world triggers"""
    
    def __init__(self):
        self.required_credentials = self.get_required_credentials()
        self.setup_steps = self.get_setup_steps()
        
    def get_required_credentials(self):
        """Get all required authentication credentials"""
        return {
            'email_monitoring': {
                'gmail_address': {
                    'description': 'Gmail address for monitoring content requests',
                    'example': 'yourbusiness@gmail.com',
                    'required': True,
                    'setup_url': 'https://support.google.com/accounts/answer/185833',
                    'notes': 'Use App Password, not regular password'
                },
                'gmail_app_password': {
                    'description': 'Gmail App Password for secure access',
                    'example': 'abcd efgh ijkl mnop',
                    'required': True,
                    'setup_url': 'https://myaccount.google.com/apppasswords',
                    'notes': 'Generate in Google Account settings'
                }
            },
            'phone_monitoring': {
                'twilio_sid': {
                    'description': 'Twilio Account SID for phone call monitoring',
                    'example': 'AC1234567890abcdef1234567890abcdef',
                    'required': False,
                    'setup_url': 'https://www.twilio.com/console',
                    'notes': 'Optional - for advanced phone call triggers'
                },
                'twilio_auth_token': {
                    'description': 'Twilio Auth Token for phone call monitoring',
                    'example': '1234567890abcdef1234567890abcdef',
                    'required': False,
                    'setup_url': 'https://www.twilio.com/console',
                    'notes': 'Optional - for advanced phone call triggers'
                },
                'business_phone_number': {
                    'description': 'Your business phone number for monitoring',
                    'example': '+1234567890',
                    'required': False,
                    'setup_url': 'https://www.twilio.com/phone-numbers',
                    'notes': 'Optional - Twilio phone number for webhooks'
                }
            },
            'social_media_monitoring': {
                'twitter_bearer_token': {
                    'description': 'Twitter Bearer Token for mention monitoring',
                    'example': 'AAAAAAAAAAAAAAAAAAAAA...',
                    'required': False,
                    'setup_url': 'https://developer.twitter.com/en/portal/dashboard',
                    'notes': 'Optional - for Twitter mention monitoring'
                },
                'linkedin_access_token': {
                    'description': 'LinkedIn Access Token for message monitoring',
                    'example': 'AQVJ...',
                    'required': False,
                    'setup_url': 'https://www.linkedin.com/developers/',
                    'notes': 'Optional - for LinkedIn message monitoring'
                },
                'instagram_access_token': {
                    'description': 'Instagram Access Token for mention monitoring',
                    'example': 'IGQVJ...',
                    'required': False,
                    'setup_url': 'https://developers.facebook.com/docs/instagram-basic-display-api/',
                    'notes': 'Optional - for Instagram mention monitoring'
                }
            },
            'calendar_integration': {
                'google_calendar_webhook_url': {
                    'description': 'Google Calendar webhook URL for event monitoring',
                    'example': 'https://your-domain.com/api/trigger/calendar/webhook',
                    'required': False,
                    'setup_url': 'https://developers.google.com/calendar/api/guides/push',
                    'notes': 'Optional - for calendar event triggers'
                }
            },
            'workflow_platform': {
                'n8n_webhook_url': {
                    'description': 'N8N webhook URL for workflow execution',
                    'example': 'https://your-n8n-instance.com/webhook/clay-i-trigger',
                    'required': False,
                    'setup_url': 'https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/',
                    'notes': 'Optional - for direct N8N integration'
                }
            }
        }
    
    def get_setup_steps(self):
        """Get step-by-step setup instructions"""
        return [
            {
                'step': 1,
                'title': 'Essential Setup (Required)',
                'description': 'Set up email monitoring for content requests',
                'actions': [
                    'Create Gmail App Password',
                    'Set environment variables',
                    'Test email monitoring'
                ],
                'time_estimate': '10 minutes'
            },
            {
                'step': 2,
                'title': 'Time-Based Triggers (Recommended)',
                'description': 'Set up daily/weekly content creation schedules',
                'actions': [
                    'Configure daily content creation time',
                    'Set weekly planning schedule',
                    'Test time triggers'
                ],
                'time_estimate': '5 minutes'
            },
            {
                'step': 3,
                'title': 'Phone Call Monitoring (Optional)',
                'description': 'Set up Twilio for phone call triggers',
                'actions': [
                    'Create Twilio account',
                    'Get phone number',
                    'Configure webhooks'
                ],
                'time_estimate': '15 minutes'
            },
            {
                'step': 4,
                'title': 'Social Media Monitoring (Optional)',
                'description': 'Set up social media mention monitoring',
                'actions': [
                    'Create Twitter Developer account',
                    'Get LinkedIn API access',
                    'Configure Instagram API'
                ],
                'time_estimate': '20 minutes'
            },
            {
                'step': 5,
                'title': 'Calendar Integration (Optional)',
                'description': 'Set up Google Calendar event monitoring',
                'actions': [
                    'Configure Google Calendar API',
                    'Set up webhook endpoint',
                    'Test calendar triggers'
                ],
                'time_estimate': '15 minutes'
            }
        ]
    
    def generate_environment_file(self):
        """Generate .env file template"""
        env_template = """# Clay-I Real-World Triggers Environment Variables
# Copy this to .env file and fill in your credentials

# Email Monitoring (REQUIRED)
GMAIL_ADDRESS=your-business@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here

# Phone Call Monitoring (OPTIONAL)
TWILIO_SID=your-twilio-sid
TWILIO_TOKEN=your-twilio-auth-token
BUSINESS_PHONE=+1234567890

# Social Media Monitoring (OPTIONAL)
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
LINKEDIN_ACCESS_TOKEN=your-linkedin-access-token
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token

# Calendar Integration (OPTIONAL)
GOOGLE_CALENDAR_WEBHOOK_URL=https://your-domain.com/api/trigger/calendar/webhook

# N8N Integration (OPTIONAL)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/clay-i-trigger

# Clay-I Configuration
CLAY_I_SERVER_PORT=5002
CLAY_I_DEBUG_MODE=true
"""
        return env_template
    
    def generate_setup_script(self):
        """Generate setup script for Clay-I"""
        setup_script = """#!/bin/bash
# Clay-I Setup Script
echo "🚀 Clay-I Real-World Triggers Setup"
echo "=================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your credentials first."
    exit 1
fi

# Load environment variables
source .env

# Check required credentials
echo "🔍 Checking required credentials..."

if [ -z "$GMAIL_ADDRESS" ] || [ -z "$GMAIL_APP_PASSWORD" ]; then
    echo "❌ Missing required Gmail credentials!"
    echo "Please set GMAIL_ADDRESS and GMAIL_APP_PASSWORD in .env file"
    exit 1
fi

echo "✅ Required credentials found"

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Start Clay-I server
echo "🚀 Starting Clay-I server..."
python clay_i_server.py

echo "🎉 Clay-I is ready to respond to real-world events!"
"""
        return setup_script
    
    def print_setup_guide(self):
        """Print complete setup guide"""
        print("🧠 CLAY-I SETUP GUIDE")
        print("=" * 50)
        print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        print("🎯 WHAT CLAY-I NEEDS FROM YOU:")
        print("-" * 40)
        
        # Print required credentials
        for category, credentials in self.required_credentials.items():
            print(f"\n📋 {category.upper().replace('_', ' ')}:")
            for cred_name, cred_info in credentials.items():
                status = "🔴 REQUIRED" if cred_info['required'] else "🟡 OPTIONAL"
                print(f"  {status} {cred_name}:")
                print(f"    Description: {cred_info['description']}")
                print(f"    Example: {cred_info['example']}")
                print(f"    Setup: {cred_info['setup_url']}")
                print(f"    Notes: {cred_info['notes']}")
                print()
        
        print("📝 SETUP STEPS:")
        print("-" * 40)
        
        for step in self.setup_steps:
            print(f"\n{step['step']}. {step['title']} ({step['time_estimate']})")
            print(f"   {step['description']}")
            print("   Actions:")
            for action in step['actions']:
                print(f"   • {action}")
        
        print("\n🚀 QUICK START:")
        print("-" * 40)
        print("1. Create .env file with your credentials")
        print("2. Run: python clay_i_setup_guide.py --setup")
        print("3. Test with: python clay_i_setup_guide.py --test")
        print("4. Start server: python clay_i_server.py")
        
        print("\n📞 SUPPORT:")
        print("-" * 40)
        print("• Email monitoring issues: Check Gmail App Password")
        print("• Phone call issues: Verify Twilio credentials")
        print("• Social media issues: Check API tokens")
        print("• General issues: Check .env file format")

def main():
    """Main function to run setup guide"""
    import sys
    
    guide = ClayISetupGuide()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--setup':
            print("🔧 CLAY-I SETUP MODE")
            print("=" * 30)
            
            # Generate .env file
            env_content = guide.generate_environment_file()
            with open('.env', 'w') as f:
                f.write(env_content)
            print("✅ Created .env file template")
            
            # Generate setup script
            setup_script = guide.generate_setup_script()
            with open('setup_clay_i.sh', 'w') as f:
                f.write(setup_script)
            os.chmod('setup_clay_i.sh', 0o755)
            print("✅ Created setup script: setup_clay_i.sh")
            
            print("\n📋 NEXT STEPS:")
            print("1. Edit .env file with your actual credentials")
            print("2. Run: ./setup_clay_i.sh")
            print("3. Clay-I will be ready to respond to real events!")
            
        elif sys.argv[1] == '--test':
            print("🧪 CLAY-I TEST MODE")
            print("=" * 25)
            
            # Test environment variables
            required_vars = ['GMAIL_ADDRESS', 'GMAIL_APP_PASSWORD']
            missing_vars = []
            
            for var in required_vars:
                if not os.getenv(var):
                    missing_vars.append(var)
            
            if missing_vars:
                print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
                print("Please set these in your .env file")
            else:
                print("✅ All required environment variables found")
                print("🎉 Clay-I is ready to start!")
                
        elif sys.argv[1] == '--credentials':
            print("🔑 CLAY-I CREDENTIALS SUMMARY")
            print("=" * 35)
            
            for category, credentials in guide.required_credentials.items():
                print(f"\n📋 {category.upper().replace('_', ' ')}:")
                for cred_name, cred_info in credentials.items():
                    status = "🔴" if cred_info['required'] else "🟡"
                    print(f"  {status} {cred_name}: {cred_info['description']}")
    else:
        guide.print_setup_guide()

if __name__ == "__main__":
    main() 