#!/usr/bin/env python3
"""
🔍 EYE_CLAY AUTOMATIC VISION WATCHER
Auto-triggers Clay-I vision analysis when new screenshots appear

WHAT IT DOES:
- Monitors /Users/joewales/Desktop/Eye_Clay/ folder
- Automatically analyzes newest screenshot with Clay-I
- Provides real-time UE5 interface guidance
- Eliminates manual upload workflow
"""

import os
import time
import requests
import glob
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class EyeClayHandler(FileSystemEventHandler):
    def __init__(self):
        self.clay_i_url = "http://localhost:8000/vision-analysis"
        self.eye_clay_folder = "/Users/joewales/Desktop/Eye_Clay"
        self.processed_files = set()
        
    def on_created(self, event):
        """Triggered when new file is created in Eye_Clay folder"""
        if event.is_directory:
            return
            
        file_path = event.src_path
        file_name = os.path.basename(file_path)
        
        # Only process image files
        if not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.heic')):
            return
            
        print(f"🔍 NEW SCREENSHOT DETECTED: {file_name}")
        
        # Wait a moment for file to be fully written
        time.sleep(1)
        
        # Convert HEIC to PNG if needed
        if file_name.lower().endswith('.heic'):
            png_path = self.convert_heic_to_png(file_path)
            if png_path:
                file_path = png_path
            else:
                print(f"❌ Failed to convert {file_name}")
                return
        
        # Skip if already processed
        if file_path in self.processed_files:
            return
            
        # Send to Clay-I for analysis
        self.analyze_with_clay_i(file_path)
        self.processed_files.add(file_path)
        
    def convert_heic_to_png(self, heic_path):
        """Convert HEIC to PNG using sips"""
        try:
            png_path = heic_path.replace('.heic', '.png').replace('.HEIC', '.png')
            os.system(f'sips -s format png "{heic_path}" --out "{png_path}"')
            if os.path.exists(png_path):
                print(f"✅ Converted to PNG: {os.path.basename(png_path)}")
                return png_path
        except Exception as e:
            print(f"❌ HEIC conversion failed: {e}")
        return None
        
    def analyze_with_clay_i(self, image_path):
        """Send image to Clay-I for vision analysis"""
        try:
            print(f"🧠 CLAY-I ANALYZING: {os.path.basename(image_path)}")
            
            with open(image_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(self.clay_i_url, files=files, timeout=30)
                
            if response.status_code == 200:
                result = response.json()
                self.display_analysis(result, os.path.basename(image_path))
            else:
                print(f"❌ Clay-I Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            
    def display_analysis(self, result, filename):
        """Display Clay-I vision analysis results"""
        print("\n" + "="*60)
        print(f"🎯 CLAY-I VISION ANALYSIS: {filename}")
        print("="*60)
        
        if 'description' in result:
            # Extract key sections from the analysis
            description = result['description']
            
            # Look for specific guidance sections
            if "NAVIGATION SUGGESTIONS" in description:
                nav_start = description.find("NAVIGATION SUGGESTIONS")
                nav_section = description[nav_start:nav_start+500]
                print(f"\n🧭 NAVIGATION GUIDANCE:")
                print(nav_section)
                
            if "TECHNICAL ANALYSIS" in description:
                tech_start = description.find("TECHNICAL ANALYSIS")
                tech_section = description[tech_start:tech_start+300]
                print(f"\n🔧 TECHNICAL ANALYSIS:")
                print(tech_section)
                
            # Show first 200 chars of full description
            print(f"\n📋 FULL ANALYSIS:")
            print(description[:400] + "..." if len(description) > 400 else description)
        
        print("\n" + "="*60)
        print("🔄 Watching for next screenshot...")
        print("="*60 + "\n")

def main():
    """Start the Eye_Clay watcher service"""
    print("🚀 STARTING EYE_CLAY AUTOMATIC VISION WATCHER")
    print("=" * 50)
    print("📁 Monitoring: /Users/joewales/Desktop/Eye_Clay/")
    print("🧠 Clay-I Server: http://localhost:8000")
    print("📸 Supported: PNG, JPG, JPEG, HEIC")
    print("⚡ Auto-conversion: HEIC → PNG")
    print("=" * 50)
    
    # Create Eye_Clay folder if it doesn't exist
    eye_clay_folder = "/Users/joewales/Desktop/Eye_Clay"
    os.makedirs(eye_clay_folder, exist_ok=True)
    
    # Check if Clay-I is running
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print("✅ Clay-I server is online")
    except:
        print("❌ WARNING: Clay-I server not responding at localhost:8000")
        print("   Start Clay-I first: cd backend && python main.py")
        return
    
    # Set up file watcher
    event_handler = EyeClayHandler()
    observer = Observer()
    observer.schedule(event_handler, eye_clay_folder, recursive=False)
    
    # Start watching
    observer.start()
    print("👁️ EYE_CLAY WATCHER ACTIVE - Take screenshots and watch the magic!")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping Eye_Clay watcher...")
        observer.stop()
    
    observer.join()
    print("✅ Eye_Clay watcher stopped")

if __name__ == "__main__":
    main()