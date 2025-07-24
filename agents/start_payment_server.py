#!/usr/bin/env python3
"""
Simple HTTP server to serve the payment portal
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Change to the agents directory
os.chdir('/Users/joewales/NODE_OUT_Master/agents')

PORT = 8001

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Payment Portal Server Running!")
            print(f"📱 Visit: http://localhost:{PORT}/payment_portal.html")
            print(f"💰 Ready to accept payments via Stripe")
            print(f"🔗 Direct link: http://localhost:{PORT}/payment_portal.html?payment_intent=test&quote_id=SAMPLE")
            print("Press Ctrl+C to stop server")
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/payment_portal.html')
            except:
                pass
                
            httpd.serve_forever()
            
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use")
            print("Try a different port or kill the existing process")
        else:
            print(f"❌ Server error: {e}")

if __name__ == "__main__":
    start_server()