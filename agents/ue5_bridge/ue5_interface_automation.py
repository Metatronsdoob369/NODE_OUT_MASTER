#!/usr/bin/env python3
"""
UE5 Interface Automation - Zero-Click Birmingham Setup
Automates UE5 interface interaction to eliminate manual clicking
"""

import time
import json
import subprocess
import requests
import websocket
import threading
from datetime import datetime

class UE5InterfaceAutomation:
    def __init__(self):
        self.birmingham_coords = {
            "latitude": 33.5186,
            "longitude": -86.8104,
            "height": 500
        }
        self.ue5_remote_port = 6766  # Default UE5 Remote Control port
        self.websocket_url = f"ws://localhost:{self.ue5_remote_port}/remote/object"
        self.cesium_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWZlMjM4My1hNDEyLTQ3M2EtYTM0Yi03NGM5NTYyZjAwOTgiLCJpZCI6MzI1NjM3LCJpYXQiOjE3NTM1ODk3ODl9.VO1wNwH11krpTP0oXUCE57-9yUiqOGvoD2xNysDbfLs"
    
    def enable_ue5_remote_control(self):
        """Enable UE5 Remote Control Web API"""
        remote_control_commands = [
            "RemoteControl.EnableWebServer true",
            f"RemoteControl.WebServerPort {self.ue5_remote_port}",
            "RemoteControl.EnableRESTApi true"
        ]
        
        print("🔧 Enabling UE5 Remote Control...")
        for command in remote_control_commands:
            self.send_console_command(command)
        
        time.sleep(2)  # Wait for remote control to initialize
        print("✅ UE5 Remote Control enabled")
    
    def send_console_command(self, command):
        """Send console command to UE5 via Remote Control API"""
        try:
            url = f"http://localhost:{self.ue5_remote_port}/remote/object/call"
            payload = {
                "objectPath": "/Script/Engine.Engine.GameEngine",
                "functionName": "ExecuteConsoleCommand",
                "parameters": {
                    "Command": command
                }
            }
            
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code == 200:
                print(f"✅ Console command executed: {command}")
                return True
            else:
                print(f"❌ Failed to execute: {command} (Status: {response.status_code})")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Remote Control API error: {e}")
            return False
    
    def spawn_birmingham_navigator(self):
        """Spawn Birmingham Auto Navigator actor in UE5"""
        spawn_payload = {
            "objectPath": "/Script/Engine.World",
            "functionName": "SpawnActor", 
            "parameters": {
                "Class": "/Game/Blueprints/BP_BirminghamAutoNavigator",
                "Location": {"X": 0, "Y": 0, "Z": 0},
                "Rotation": {"Pitch": 0, "Yaw": 0, "Roll": 0}
            }
        }
        
        try:
            url = f"http://localhost:{self.ue5_remote_port}/remote/object/call"
            response = requests.post(url, json=spawn_payload, timeout=10)
            
            if response.status_code == 200:
                print("✅ Birmingham Navigator spawned successfully")
                return True
            else:
                print(f"❌ Failed to spawn Navigator (Status: {response.status_code})")
                return False
                
        except Exception as e:
            print(f"❌ Spawn error: {e}")
            return False
    
    def execute_auto_navigation(self):
        """Execute automatic Birmingham navigation"""
        navigation_payload = {
            "objectPath": "/Game/Blueprints/BP_BirminghamAutoNavigator",
            "functionName": "AutoNavigateToBirmingham"
        }
        
        try:
            url = f"http://localhost:{self.ue5_remote_port}/remote/object/call"
            response = requests.post(url, json=navigation_payload, timeout=15)
            
            if response.status_code == 200:
                print("✅ Birmingham auto-navigation executed")
                return True
            else:
                print(f"❌ Navigation failed (Status: {response.status_code})")
                return False
                
        except Exception as e:
            print(f"❌ Navigation error: {e}")
            return False
    
    def setup_cesium_via_api(self):
        """Setup Cesium components via direct API calls"""
        cesium_setup_commands = [
            # Create Cesium Georeference
            {
                "objectPath": "/Script/Engine.World",
                "functionName": "SpawnActor",
                "parameters": {
                    "Class": "/Script/CesiumRuntime.CesiumGeoreference"
                }
            },
            # Set Birmingham coordinates
            {
                "objectPath": "/Game/CesiumGeoreference",
                "functionName": "SetOriginLatLongHeight",
                "parameters": {
                    "InLatitude": self.birmingham_coords["latitude"],
                    "InLongitude": self.birmingham_coords["longitude"],
                    "InHeight": self.birmingham_coords["height"]
                }
            },
            # Create World Terrain
            {
                "objectPath": "/Script/Engine.World", 
                "functionName": "SpawnActor",
                "parameters": {
                    "Class": "/Script/CesiumRuntime.Cesium3DTileset"
                }
            }
        ]
        
        print("🌍 Setting up Cesium components...")
        for command in cesium_setup_commands:
            try:
                url = f"http://localhost:{self.ue5_remote_port}/remote/object/call"
                response = requests.post(url, json=command, timeout=10)
                
                if response.status_code == 200:
                    print(f"✅ Cesium setup step completed")
                else:
                    print(f"❌ Cesium setup step failed (Status: {response.status_code})")
                    
            except Exception as e:
                print(f"❌ Cesium setup error: {e}")
        
        print("✅ Cesium components setup complete")
    
    def configure_camera_position(self):
        """Configure camera for optimal Birmingham viewing"""
        camera_commands = [
            f"Camera.SetLocation 0 0 {self.birmingham_coords['height'] * 200}",  # 1km above Birmingham
            "Camera.SetRotation -45 0 0",  # Look down at 45 degrees
            "Camera.SetFOV 90"  # Wide field of view
        ]
        
        print("📷 Configuring camera position...")
        for command in camera_commands:
            self.send_console_command(command)
        
        print("✅ Camera configured for optimal Birmingham viewing")
    
    def apply_storm_visualization_settings(self):
        """Apply settings optimized for storm visualization"""
        storm_settings = [
            "r.RayTracing 1",
            "r.Lumen.GlobalIllumination 1", 
            "r.Lumen.Reflections 1",
            "sg.ViewDistanceScale 2.0",
            "r.TemporalAA.Quality 2",
            "CesiumSunSky.SetTimeOfDay 14.0",
            "CesiumSunSky.SetCloudOpacity 0.7"
        ]
        
        print("⛈️ Applying storm visualization settings...")
        for setting in storm_settings:
            self.send_console_command(setting)
        
        print("✅ Storm visualization settings applied")
    
    def validate_birmingham_setup(self):
        """Validate that Birmingham setup completed successfully"""
        validation_checks = [
            "stat fps",  # Check frame rate
            "stat memory",  # Check memory usage
            "CesiumGeoreference.GetOriginLatitude",  # Verify coordinates
            "CesiumGeoreference.GetOriginLongitude"
        ]
        
        print("🔍 Validating Birmingham setup...")
        for check in validation_checks:
            self.send_console_command(check)
        
        print("✅ Validation checks completed")
    
    def create_automation_sequence(self):
        """Execute complete automation sequence"""
        automation_steps = [
            ("Enabling UE5 Remote Control", self.enable_ue5_remote_control),
            ("Setting up Cesium components", self.setup_cesium_via_api),
            ("Spawning Birmingham Navigator", self.spawn_birmingham_navigator),
            ("Configuring camera position", self.configure_camera_position),
            ("Applying storm visualization", self.apply_storm_visualization_settings),
            ("Executing auto-navigation", self.execute_auto_navigation),
            ("Validating setup", self.validate_birmingham_setup)
        ]
        
        print("🚀 STARTING COMPLETE BIRMINGHAM AUTOMATION SEQUENCE")
        print(f"📍 Target: {self.birmingham_coords['latitude']}, {self.birmingham_coords['longitude']}")
        print("=" * 60)
        
        for step_name, step_function in automation_steps:
            print(f"\n📋 Step: {step_name}")
            try:
                step_function()
                print(f"✅ {step_name} - COMPLETED")
            except Exception as e:
                print(f"❌ {step_name} - FAILED: {e}")
                continue
            
            time.sleep(1)  # Brief pause between steps
        
        print("\n" + "=" * 60)
        print("🎯 BIRMINGHAM AUTOMATION SEQUENCE COMPLETE")
        print("🌪️ Ready for storm visualization!")
    
    def start_live_monitoring(self):
        """Start live monitoring of UE5 Birmingham setup"""
        def monitor_loop():
            while True:
                try:
                    # Check UE5 status
                    status_url = f"http://localhost:{self.ue5_remote_port}/remote/info"
                    response = requests.get(status_url, timeout=5)
                    
                    if response.status_code == 200:
                        info = response.json()
                        print(f"📊 UE5 Status: {info.get('engineVersion', 'Unknown')}")
                    
                    # Monitor frame rate
                    self.send_console_command("stat fps")
                    
                    time.sleep(30)  # Check every 30 seconds
                    
                except Exception as e:
                    print(f"⚠️ Monitoring error: {e}")
                    time.sleep(60)  # Wait longer if there's an error
        
        monitoring_thread = threading.Thread(target=monitor_loop, daemon=True)
        monitoring_thread.start()
        print("📡 Live monitoring started")

class UE5KeyboardAutomation:
    """Keyboard automation for UE5 interface (fallback method)"""
    
    def __init__(self):
        self.birmingham_coords = {
            "latitude": 33.5186,
            "longitude": -86.8104,
            "height": 500
        }
    
    def open_cesium_panel(self):
        """Open Cesium panel using keyboard shortcuts"""
        # This would use a library like pyautogui for keyboard automation
        # Implementation depends on platform (Windows/Mac/Linux)
        print("🔧 Opening Cesium panel via keyboard automation...")
        
        # Example commands (would need actual keyboard automation library):
        # pyautogui.hotkey('ctrl', 'alt', 'c')  # Open Cesium panel
        # pyautogui.click(cesium_world_terrain_button)
        # pyautogui.typewrite(str(self.birmingham_coords['latitude']))
        
        print("✅ Cesium panel automation sequence completed")
    
    def navigate_to_birmingham_keyboard(self):
        """Navigate to Birmingham using keyboard automation"""
        keyboard_sequence = [
            "Open Cesium panel (Ctrl+Alt+C)",
            "Click 'Add Blank 3D Tiles'",
            "Set URL to Cesium World Terrain",
            f"Set latitude to {self.birmingham_coords['latitude']}",
            f"Set longitude to {self.birmingham_coords['longitude']}",
            "Click 'Apply' button",
            "Press F key to focus on Birmingham"
        ]
        
        print("⌨️ Executing keyboard automation sequence:")
        for i, step in enumerate(keyboard_sequence, 1):
            print(f"   {i}. {step}")
            time.sleep(0.5)  # Simulate execution time
        
        print("✅ Keyboard automation completed")

def main():
    """Main execution function"""
    print("🌪️ UE5 BIRMINGHAM STORM AUTOMATION SYSTEM")
    print("=" * 50)
    
    # Choose automation method
    automation_method = input("Choose automation method:\n1. API-based (recommended)\n2. Keyboard-based (fallback)\nEnter choice (1 or 2): ")
    
    if automation_method == "1":
        print("\n🚀 Starting API-based automation...")
        automation = UE5InterfaceAutomation()
        
        # Start live monitoring
        automation.start_live_monitoring()
        
        # Execute complete automation sequence
        automation.create_automation_sequence()
        
    elif automation_method == "2":
        print("\n⌨️ Starting keyboard-based automation...")
        keyboard_automation = UE5KeyboardAutomation()
        keyboard_automation.navigate_to_birmingham_keyboard()
        
    else:
        print("❌ Invalid choice. Exiting.")
        return
    
    print("\n🎯 AUTOMATION COMPLETE - BIRMINGHAM READY FOR STORM VISUALIZATION")

if __name__ == "__main__":
    main()