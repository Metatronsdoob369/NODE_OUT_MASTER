#!/usr/bin/env python3
"""
Test script to verify payment routes are working
"""
import os
import sys
sys.path.append('/Users/joewales/NODE_OUT_Master/AGENT/NODE_AGENT_Project')

# Set environment variables
os.environ['STRIPE_SECRET_KEY'] = 'sk_test_51RoOc6BWsn8icDzjvark29t6SK9KGcvSibFhjWQViSrPsNrqdI2V4JnddpfZ5mehvie5hwiAmr99x5H1AwFZxWMS00Ga6nfxnG'
os.environ['STRIPE_PUBLISHABLE_KEY'] = 'pk_test_51RoOc6BWsn8icDzjI641I5BXoNSm09TZchNrSfCMwwjhvQApy8afrpxFSuNZJN3efC6brnmEdFSvRU7BsGQIyutg00gfuQTRgA'

from flask import Flask, jsonify
import stripe

app = Flask(__name__)

# Set Stripe key
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

@app.route('/test/stripe-config', methods=['GET'])
def test_stripe_config():
    return jsonify({
        'publishable_key': os.environ.get('STRIPE_PUBLISHABLE_KEY'),
        'success': True,
        'test': 'Payment routes working!'
    })

@app.route('/test/services', methods=['GET'])
def test_services():
    return jsonify({
        'services': [
            {
                'id': 'emergency_inspection',
                'name': 'Emergency Storm Inspection',
                'price': 295.00,
                'test': True
            }
        ],
        'success': True
    })

if __name__ == '__main__':
    print("🧪 Testing Payment Routes...")
    print("Available routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule.rule} -> {rule.endpoint}")
    
    print("\n🚀 Starting test server on port 5003...")
    app.run(host='0.0.0.0', port=5003, debug=True)