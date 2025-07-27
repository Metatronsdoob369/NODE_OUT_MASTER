#!/usr/bin/env python3
"""
Simple Birmingham Automation Server - No external dependencies
"""

import http.server
import socketserver
import json
import subprocess
import os

class AutomationHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/trigger-birmingham-automation':
            # Execute the automation directly
            result = self.execute_birmingham_automation()
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps(result)
            self.wfile.write(response.encode())
            
        else:
            self.send_response(404)
            self.end_headers()
    
    def execute_birmingham_automation(self):
        """Execute Birmingham automation via AppleScript"""
        
        applescript = '''
tell application "System Events"
    set frontApp to name of first application process whose frontmost is true
    if frontApp contains "Unreal" then
        -- UE5 is already active
        keystroke "`"
        delay 0.5
        
        -- Set Birmingham coordinates
        keystroke "CesiumGeoreference.SetOriginLatitude 33.5186"
        key code 36
        delay 0.5
        
        keystroke "CesiumGeoreference.SetOriginLongitude -86.8104"
        key code 36
        delay 0.5
        
        keystroke "ghost"
        key code 36
        delay 0.5
        
        keystroke "fly"
        key code 36
        delay 0.5
        
        keystroke "setpos 0 0 100000"
        key code 36
        delay 0.5
        
        keystroke "`"
        
    else
        return "UE5 not active"
    end if
end tell
'''
        
        try:
            # Save and execute AppleScript
            script_path = "/tmp/birmingham_automation.scpt"
            with open(script_path, 'w') as f:
                f.write(applescript)
            
            result = subprocess.run(['osascript', script_path], 
                                  capture_output=True, text=True, check=True)
            
            return {
                "status": "success",
                "message": "Birmingham automation executed",
                "coordinates": {"lat": 33.5186, "lon": -86.8104}
            }
            
        except subprocess.CalledProcessError as e:
            return {
                "status": "error",
                "message": f"Automation failed: {e}"
            }

PORT = 9999
print(f"🤖 Birmingham Automation Server starting on port {PORT}")
print("🎯 Ready to automate UE5 Birmingham setup")

with socketserver.TCPServer(("", PORT), AutomationHandler) as httpd:
    httpd.serve_forever()