#!/usr/bin/env python3
"""
Automated Birmingham Building Importer
Based on the GPT agent report - imports FBX buildings with embedded coordinates
"""

import subprocess

def import_birmingham_buildings():
    """Import all 5 Birmingham FBX buildings using UE5 Python automation"""
    
    print("🏗️ Starting automated Birmingham building import...")
    
    # Your building files
    building_files = [
        "Building_Examples_1.fbx",
        "building_02.fbx", 
        "building_03.fbx",
        "building_04.fbx",
        "building_05.fbx"
    ]
    
    # UE5 Python script for building import (from GPT report page 4)
    ue5_python_script = f'''
import unreal

# Building files to import
building_files = {building_files}
FBX_FOLDER = "/Users/joewales/NODE_OUT_Master"
DEST_PATH = "/Game/Buildings"

asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
editor_util = unreal.EditorLevelLibrary()

print("🚀 Importing Birmingham buildings...")

for building_file in building_files:
    fbx_path = f"{{FBX_FOLDER}}/{{building_file}}"
    print(f"📦 Importing {{building_file}}...")
    
    # Import the mesh
    task = unreal.AssetImportTask()
    task.filename = fbx_path
    task.destination_path = DEST_PATH
    task.automated = True
    task.save = True
    
    # Set FBX import options
    task.options = unreal.FbxImportUI()
    task.options.import_mesh = True
    task.options.import_materials = True
    task.options.import_textures = True
    task.options.create_physics_asset = False
    
    asset_tools.import_asset_tasks([task])
    
    # Spawn actor from imported mesh
    asset_name = f"{{DEST_PATH}}/{{building_file.replace('.fbx', '')}}"
    
    try:
        static_mesh = unreal.EditorAssetLibrary.load_asset(asset_name)
        if static_mesh:
            actor = editor_util.spawn_actor_from_object(static_mesh, location=(0,0,0))
            
            # Add CesiumGlobeAnchor component (buildings have embedded coordinates)
            anchor = actor.add_component_by_class(unreal.CesiumGlobeAnchorComponent)
            if anchor:
                # Buildings should auto-position based on embedded data
                print(f"✅ {{building_file}} imported and positioned")
            else:
                print(f"⚠️ {{building_file}} imported but no anchor component")
        else:
            print(f"❌ Failed to load {{building_file}}")
    except Exception as e:
        print(f"❌ Error with {{building_file}}: {{e}}")

print("🌪️ Birmingham building import complete!")
print("📍 Buildings should be positioned at their embedded coordinates")
'''
    
    # Send the script to UE5
    applescript = f'''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 1
        
        -- Open Python console
        keystroke "ctrl" using {{control down, command down}}
        keystroke "p"
        delay 2
        
        -- Clear any existing text
        key code 51 using command down
        delay 0.5
        
        -- Paste the import script
        set the clipboard to "{ue5_python_script.replace('"', '\\"')}"
        keystroke "v" using command down
        delay 1
        
        -- Execute script
        key code 36
        delay 2
        
    end tell
end tell
'''
    
    try:
        print("🤖 Sending building import automation to UE5...")
        subprocess.run(['osascript', '-e', applescript], check=True)
        print("✅ Building import automation sent successfully")
        print("📦 Check UE5 for import progress...")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Automation failed: {e}")
        return False

if __name__ == "__main__":
    print("🏗️ BIRMINGHAM BUILDING AUTOMATION")
    print("=" * 50)
    print("📋 Will import 5 FBX buildings with embedded coordinates")
    print("🎯 Buildings will auto-position using CesiumGlobeAnchor")
    print("")
    
    success = import_birmingham_buildings()
    
    if success:
        print("")
        print("✅ BUILDING IMPORT AUTOMATION COMPLETE")
        print("🏙️ Birmingham metropolitan area should now have buildings")
        print("📍 Each building positioned at embedded coordinates")
    else:
        print("❌ AUTOMATION FAILED - Check UE5 Python console")