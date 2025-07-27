#!/usr/bin/env python3
"""
Check Birmingham city building progress
"""

import subprocess

def check_city_progress():
    """Check if city buildings are being generated"""
    
    print("🔍 Checking Birmingham city building progress...")
    
    # Simple UE5 check script
    check_script = '''
import unreal

# Count actors in the level
world = unreal.EditorLevelLibrary.get_editor_world()
all_actors = unreal.EditorLevelLibrary.get_all_level_actors()

building_actors = 0
for actor in all_actors:
    actor_name = actor.get_name()
    if "building" in actor_name.lower():
        building_actors += 1

print(f"🏗️ Current buildings in level: {building_actors}")

if building_actors > 10:
    print("✅ City generation is working!")
elif building_actors > 4:
    print("⚡ City generation in progress...")
else:
    print("⚠️ Few buildings found - may need to restart generation")

# Also list some actor names to see what's there
print("\\n📋 Recent actors:")
for i, actor in enumerate(all_actors[-10:]):
    print(f"   {actor.get_name()}")
'''
    
    # Send to UE5
    applescript = f'''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 1
        
        -- Open Python console
        keystroke "ctrl" using {{control down, command down}}
        keystroke "p"
        delay 1
        
        -- Clear and run check
        key code 51 using command down
        delay 0.5
        
        set the clipboard to "{check_script.replace('"', '\\"')}"
        keystroke "v" using command down
        delay 0.5
        
        key code 36
        
    end tell
end tell
'''
    
    try:
        subprocess.run(['osascript', '-e', applescript], check=True)
        print("✅ Progress check sent to UE5")
        print("📊 Check UE5 Python console for building count")
        
    except:
        print("❌ Check failed")

if __name__ == "__main__":
    check_city_progress()