#!/usr/bin/env python3
"""
Send Birmingham commands to UE5
"""

import subprocess
import time

def send_birmingham_commands():
    """Send Birmingham setup commands to UE5"""
    
    commands = [
        "CesiumGeoreference.SetOriginLatitude 33.5186",
        "CesiumGeoreference.SetOriginLongitude -86.8104", 
        "ghost",
        "fly",
        "setpos 0 0 100000"
    ]
    
    for i, command in enumerate(commands):
        print(f"🤖 Sending command {i+1}/{len(commands)}: {command}")
        
        applescript = f'''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 0.5
        
        -- Open console
        keystroke "`"
        delay 0.5
        
        -- Send command
        keystroke "{command}"
        key code 36
        delay 1
        
        -- Close console
        keystroke "`"
        delay 0.5
    end tell
end tell
'''
        
        try:
            subprocess.run(['osascript', '-e', applescript], check=True)
            print(f"✅ Command sent successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Command failed: {e}")
        
        time.sleep(1)  # Wait between commands
    
    print("🌪️ Birmingham automation complete!")
    print("📍 You should now be at Birmingham coordinates")
    print("🎮 Ghost/fly mode enabled for easy navigation")

if __name__ == "__main__":
    print("🚀 SENDING BIRMINGHAM COMMANDS TO UE5")
    print("=" * 40)
    send_birmingham_commands()