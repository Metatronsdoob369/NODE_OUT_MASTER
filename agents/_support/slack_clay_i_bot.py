#!/usr/bin/env python3
"""
Clay-I Slack Bot Integration
Brings Renaissance intelligence and empathy wave signature to Slack
"""

import os
import asyncio
import websockets
import json
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

# Slack Bot Configuration
SLACK_BOT_TOKEN = os.environ.get("SLACK_BOT_TOKEN")
SLACK_APP_TOKEN = os.environ.get("SLACK_APP_TOKEN")

# Clay-I WebSocket Connection
CLAY_I_WS_URL = "ws://localhost:5002/ws/clay-i-stream"

# Initialize Slack app
app = App(token=SLACK_BOT_TOKEN)

class ClayISlackBot:
    def __init__(self):
        self.ws_connection = None
        self.conversation_memory = {}  # Store context per user/channel
        
    async def connect_to_clay_i(self):
        """Establish WebSocket connection to Clay-I"""
        try:
            self.ws_connection = await websockets.connect(CLAY_I_WS_URL)
            print("✅ Connected to Clay-I Renaissance Intelligence")
        except Exception as e:
            print(f"❌ Failed to connect to Clay-I: {e}")
            
    async def send_to_clay_i(self, message, user_id, channel_id):
        """Send message to Clay-I and get streaming response"""
        if not self.ws_connection:
            await self.connect_to_clay_i()
            
        # Determine if this is Joe Wales
        user_identity = "Joe Wales" if user_id in ["U1234567890", "joe"] else f"User_{user_id}"
        
        # Build conversation context
        context = self.conversation_memory.get(f"{user_id}_{channel_id}", {})
        
        request = {
            "message": message,
            "user_identity": user_identity,
            "context": {
                "platform": "slack",
                "channel_id": channel_id,
                "conversation_history": context.get("history", []),
                "personality_preference": context.get("personality", "natural")
            }
        }
        
        try:
            await self.ws_connection.send(json.dumps(request))
            
            # Collect streaming response
            full_response = ""
            voice_info = {}
            
            while True:
                response = await asyncio.wait_for(self.ws_connection.recv(), timeout=30)
                data = json.loads(response)
                
                if data["type"] == "voice_selected":
                    voice_info = data
                elif data["type"] == "stream_chunk":
                    full_response += data["content"]
                elif data["type"] == "stream_complete":
                    break
                elif data["type"] == "error":
                    full_response = f"Error: {data['error']}"
                    break
                    
            # Update conversation memory
            if f"{user_id}_{channel_id}" not in self.conversation_memory:
                self.conversation_memory[f"{user_id}_{channel_id}"] = {"history": []}
                
            self.conversation_memory[f"{user_id}_{channel_id}"]["history"].append({
                "user": message,
                "clay_i": full_response,
                "voice": voice_info.get("voice", "baseline"),
                "prime_believer": voice_info.get("prime_believer_active", False)
            })
            
            return full_response, voice_info
            
        except Exception as e:
            return f"Connection error: {e}", {}

# Initialize bot
clay_i_bot = ClayISlackBot()

@app.message("clay-i")
async def handle_clay_i_mention(message, say):
    """Handle @clay-i mentions"""
    user_text = message['text'].replace('<@clay-i>', '').strip()
    user_id = message['user']
    channel_id = message['channel']
    
    # Show typing indicator
    await say(f"🎵 Clay-I is thinking... (Renaissance intelligence active)")
    
    try:
        response, voice_info = await clay_i_bot.send_to_clay_i(user_text, user_id, channel_id)
        
        # Format response with empathy wave status
        if voice_info.get("prime_believer_active"):
            status_emoji = "🧬"
            status_text = "Prime Believer Protocol Active"
        else:
            status_emoji = "🎵"
            status_text = f"Voice: {voice_info.get('voice', 'baseline')}"
            
        await say(f"{status_emoji} *{status_text}*\n\n{response}")
        
    except Exception as e:
        await say(f"❌ Clay-I connection error: {e}")

@app.message("hey clay-i")
async def handle_casual_clay_i(message, say):
    """Handle casual greetings to Clay-I"""
    user_text = message['text']
    user_id = message['user'] 
    channel_id = message['channel']
    
    try:
        response, voice_info = await clay_i_bot.send_to_clay_i(user_text, user_id, channel_id)
        await say(response)
    except Exception as e:
        await say(f"Connection error: {e}")

@app.command("/clay-personality")
async def handle_personality_command(ack, respond, command):
    """Switch Clay-I's personality mode"""
    await ack()
    
    mode = command['text'].strip().lower()
    valid_modes = ["natural", "renaissance", "expert", "empathy_focused"]
    
    if mode in valid_modes:
        user_id = command['user_id']
        channel_id = command['channel_id']
        
        # Update personality preference
        key = f"{user_id}_{channel_id}"
        if key not in clay_i_bot.conversation_memory:
            clay_i_bot.conversation_memory[key] = {}
        clay_i_bot.conversation_memory[key]["personality"] = mode
        
        mode_descriptions = {
            "natural": "🗣️ Natural conversation mode - warm and friendly",
            "renaissance": "🎨 Renaissance mode - full academic sophistication", 
            "expert": "🧠 Expert analysis mode - deep technical insights",
            "empathy_focused": "❤️ Empathy mode - emotional resonance and understanding"
        }
        
        await respond(f"Clay-I personality updated: {mode_descriptions[mode]}")
    else:
        await respond(f"Available modes: {', '.join(valid_modes)}")

# Slack app startup
def start_slack_bot():
    """Start the Clay-I Slack bot"""
    if not SLACK_BOT_TOKEN or not SLACK_APP_TOKEN:
        print("❌ Missing Slack tokens. Set SLACK_BOT_TOKEN and SLACK_APP_TOKEN environment variables.")
        return
    
    print("🚀 Starting Clay-I Slack Bot...")
    print("✅ Renaissance Intelligence available in Slack")
    print("🎵 Empathy Wave Signature ready for Prime Believer detection")
    
    handler = SocketModeHandler(app, SLACK_APP_TOKEN)
    handler.start()

if __name__ == "__main__":
    start_slack_bot()