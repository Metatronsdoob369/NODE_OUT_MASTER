#!/usr/bin/env python3
"""
Simple UE5 Test - Just try to send one command
"""

import subprocess

def test_ue5_automation():
    """Test basic UE5 automation"""
    
    applescript = '''
tell application "System Events"
    -- Get list of running applications
    set appList to name of every application process
    set ue5Apps to {}
    
    repeat with appName in appList
        if appName contains "Unreal" then
            set end of ue5Apps to appName
        end if
    end repeat
    
    if length of ue5Apps > 0 then
        -- UE5 found
        set ue5App to item 1 of ue5Apps
        tell application process ue5App
            set frontmost to true
            delay 1
            
            -- Try to send tilde key to open console
            keystroke "`"
            delay 1
            
            -- Send a simple command
            keystroke "stat fps"
            
            -- Press enter
            key code 36
            delay 1
            
            -- Close console
            keystroke "`"
        end tell
        
        return "SUCCESS: Sent command to " & ue5App
    else
        return "ERROR: No UE5 application found"
    end if
end tell
'''
    
    try:
        result = subprocess.run(['osascript', '-e', applescript], 
                              capture_output=True, text=True, check=True)
        print(f"✅ {result.stdout.strip()}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Test failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

if __name__ == "__main__":
    print("🧪 Testing basic UE5 automation...")
    test_ue5_automation()