#!/usr/bin/env python3
from ue5_zero_click_automation import UE5ZeroClickAutomation

import http.server
import socketserver
import json
import subprocess
from urllib.parse import parse_qs

class AutomationHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/trigger-birmingham-automation':
            # Execute the automation
            automation = UE5ZeroClickAutomation()
            result = automation.execute_birmingham_automation()
            
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

PORT = 8888
with socketserver.TCPServer(("", PORT), AutomationHandler) as httpd:
    print(f"🌐 Automation server running on http://localhost:{PORT}")
    print("🎯 Ready to trigger Birmingham automation from web interface")
    httpd.serve_forever()
