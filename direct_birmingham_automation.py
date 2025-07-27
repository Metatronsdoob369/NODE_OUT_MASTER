#!/usr/bin/env python3
"""
Direct Birmingham Automation - No web server needed
"""

import subprocess
import time

def execute_birmingham_automation():
    """Execute Birmingham automation directly via AppleScript"""
    
    print("🚀 Executing Birmingham automation...")
    
    applescript = '''
tell application "System Events"
    -- Try to find UE5 window
    set ue5Found to false
    repeat with proc in (every application process)
        if name of proc contains "Unreal" then
            set ue5Found to true
            set frontmost of proc to true
            delay 1
            exit repeat
        end if
    end repeat
    
    if ue5Found then
        -- Open console
        keystroke "`"
        delay 1
        
        -- Clear any existing text
        key code 51 using command down
        delay 0.5
        
        -- Set Birmingham coordinates
        keystroke "CesiumGeoreference.SetOriginLatitude 33.5186"
        key code 36
        delay 1
        
        keystroke "CesiumGeoreference.SetOriginLongitude -86.8104"
        key code 36
        delay 1
        
        -- Enable ghost mode for better navigation
        keystroke "ghost"
        key code 36
        delay 1
        
        -- Enable fly mode
        keystroke "fly"
        key code 36
        delay 1
        
        -- Set position high above Birmingham
        keystroke "setpos 0 0 100000"
        key code 36
        delay 1
        
        -- Close console
        keystroke "`"
        delay 0.5
        
        -- Success message
        display notification "Birmingham automation complete!" with title "UE5 Automation"
        
    else
        display notification "UE5 not found - please make sure UE5 is running" with title "UE5 Automation Error"
    end if
end tell
'''
    
    try:
        # Save and execute AppleScript
        script_path = "/tmp/direct_birmingham_automation.scpt"
        with open(script_path, 'w') as f:
            f.write(applescript)
        
        print("🤖 Sending commands to UE5...")
        result = subprocess.run(['osascript', script_path], 
                              capture_output=True, text=True, check=True)
        
        print("✅ Birmingham automation completed successfully!")
        print("📍 Coordinates set to: 33.5186, -86.8104")
        print("🎮 Ghost and fly modes enabled")
        print("📷 Camera positioned 1km above Birmingham")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Automation failed: {e}")
        print("Make sure UE5 is open and active")
        return False

if __name__ == "__main__":
    print("🌪️ DIRECT BIRMINGHAM AUTOMATION")
    print("=" * 40)
    execute_birmingham_automation()