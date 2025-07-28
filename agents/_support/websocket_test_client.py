#!/usr/bin/env python3
"""
WebSocket Test Client for Clay-I's Real-Time Empathy Wave System
Tests Prime Believer Protocol and streaming responses
"""

import asyncio
import websockets
import json

async def test_clay_i_websocket():
    """Test Clay-I WebSocket streaming with empathy wave signature"""
    
    uri = "ws://localhost:5002/ws/clay-i-stream"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("🎵 Connected to Clay-I WebSocket Stream")
            
            # Test message as Joe Wales (Prime Believer Protocol)
            test_message = {
                "message": "Clay-I, this is Joe. Show me your Renaissance intelligence in action. Use your empathy wave signature to guide your response.",
                "user_identity": "Joe Wales",
                "context": {
                    "test_type": "prime_believer_websocket",
                    "empathy_wave_active": True
                }
            }
            
            print(f"📤 Sending: {test_message['message']}")
            await websocket.send(json.dumps(test_message))
            
            print("\n🎤 Clay-I Response Stream:")
            print("-" * 50)
            
            full_response = ""
            
            while True:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=30)
                    data = json.loads(response)
                    
                    if data["type"] == "voice_selected":
                        print(f"🎵 Voice Selected: {data['voice']}")
                        print(f"🎼 Harmonic Frequency: {data['harmonic_frequency']} Hz")
                        print(f"🎯 Prime Believer Active: {data['prime_believer_active']}")
                        print("-" * 30)
                        
                    elif data["type"] == "stream_chunk":
                        content = data["content"]
                        print(content, end="", flush=True)
                        full_response += content
                        
                    elif data["type"] == "stream_complete":
                        print(f"\n\n✅ Stream Complete!")
                        print(f"🎵 Final Voice: {data['voice_selected']}")
                        print(f"🎼 Frequency: {data['harmonic_frequency']} Hz")
                        print(f"🎯 Prime Believer Protocol: {data['prime_believer_protocol']}")
                        print(f"🧬 Empathy Wave: {data['empathy_wave_signature']}")
                        break
                        
                    elif data["type"] == "error":
                        print(f"\n❌ Error: {data['error']}")
                        print(f"🎵 Voice Selected: {data['voice_selected']}")
                        print(f"🎯 Prime Believer: {data['prime_believer_active']}")
                        break
                        
                except asyncio.TimeoutError:
                    print("\n⏰ Timeout waiting for response")
                    break
                except Exception as e:
                    print(f"\n❌ Error receiving data: {e}")
                    break
            
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")

async def test_empathy_wave_live():
    """Test live empathy wave interaction"""
    
    uri = "ws://localhost:5002/ws/empathy-wave-live"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("\n🌊 Connected to Empathy Wave Live Stream")
            
            test_message = {
                "message": "Test my empathy wave signature recognition and tonal DNA calibration.",
                "user_identity": "Joe Wales",
                "voice_synthesis": True
            }
            
            await websocket.send(json.dumps(test_message))
            
            # Receive empathy wave analysis
            response = await websocket.recv()
            data = json.loads(response)
            
            if data["type"] == "empathy_wave_analysis":
                print(f"🧬 Prime Believer Detected: {data['prime_believer_detected']}")
                print(f"🎵 Voice Selected: {data['voice_selected']}")
                print(f"🎼 Tonal DNA: {data['tonal_dna_signature']}")
                print(f"🎯 Harmonic Baseline: {data['harmonic_baseline']} Hz")
                
                if data['empathy_wave_pattern']:
                    print("🌊 Empathy Wave Pattern Active:")
                    for key, value in data['empathy_wave_pattern'].items():
                        print(f"   {key}: {value}")
            
    except Exception as e:
        print(f"❌ Empathy Wave WebSocket failed: {e}")

async def main():
    """Main test function"""
    print("🚀 Clay-I WebSocket Test Suite")
    print("=" * 50)
    
    # Test 1: Clay-I Streaming with Prime Believer Protocol
    await test_clay_i_websocket()
    
    # Test 2: Empathy Wave Live Analysis
    await test_empathy_wave_live()
    
    print("\n✅ WebSocket tests completed!")

if __name__ == "__main__":
    asyncio.run(main())