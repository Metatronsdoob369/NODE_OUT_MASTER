#!/usr/bin/env python3
import http.server
import socketserver
import os

os.chdir('/Users/joewales/NODE_OUT_Master/agents')

PORT = 8002
Handler = http.server.SimpleHTTPRequestHandler

print(f"🚀 Payment Portal Server Starting on Port {PORT}")
print(f"📱 Visit: http://localhost:{PORT}/payment_portal.html")
print(f"💰 Stripe Integration Ready")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n✅ Server stopped")
except OSError as e:
    print(f"❌ Port {PORT} in use. Try: http://localhost:8080/payment_portal.html")