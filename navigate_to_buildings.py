#!/usr/bin/env python3
"""
Navigate to Birmingham Buildings - CEO doesn't need to know UE5 buttons
"""

import subprocess

def navigate_to_birmingham_buildings():
    """Navigate to see the imported Birmingham buildings"""
    
    print("🎯 Navigating to Birmingham buildings...")
    
    applescript = '''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 1
        
        -- Open console
        keystroke "`"
        delay 0.5
        
        -- Jump to Birmingham center where buildings should be
        keystroke "setpos 0 0 50000"
        key code 36
        delay 1
        
        -- Look down to see buildings
        keystroke "camera pitch -90"
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
        print("✅ Navigated to Birmingham buildings view")
        print("🏗️ You should now see your imported buildings below")
        return True
    except:
        print("❌ Navigation failed")
        return False

if __name__ == "__main__":
    print("🏗️ CEO BUILDING INSPECTION MODE")
    print("=" * 40)
    navigate_to_birmingham_buildings()