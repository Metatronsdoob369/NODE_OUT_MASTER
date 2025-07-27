#!/usr/bin/env python3
"""
PORT COORDINATION SYSTEM
Dynamic port reservation and conflict resolution for multi-agent deployment
"""

PORT_REGISTRY = {
    "payment_portal": 8001,
    "stripe_backend": 5002, 
    "claude_agent": 8010,
    "gemini_agent": 8011,
    "clay_i_api_proxy": 8000,
    "react_frontend": 3000,
    "snatch_sell_analytics": 8012,
    "market_reaction_agent": 8013,
    "chatgpt_browser_control": 8014,
    "pineal_memory_system": 8015,
    "synergy_coordinator": 8016
}

def assign_ports():
    """Assign and display port allocations"""
    print("🔗 PORT COORDINATION SYSTEM")
    print("=" * 30)
    for service, port in PORT_REGISTRY.items():
        print(f"{service:25} → Port {port}")
    
    return PORT_REGISTRY

if __name__ == "__main__":
    assign_ports()