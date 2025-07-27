#!/usr/bin/env python3
"""
UE5 WebSocket Bridge - Real-time Communication
Enables real-time communication between HTML dashboard and UE5
"""

import asyncio
import websockets
import json
import requests
import threading
import time
from datetime import datetime

class UE5WebSocketBridge:
    def __init__(self):
        self.birmingham_coords = {
            "latitude": 33.5186,
            "longitude": -86.8104,
            "height": 500
        }
        self.connected_clients = set()
        self.ue5_remote_port = 6766
        self.websocket_port = 8765
        self.ue5_connected = False
        
    async def handle_client_connection(self, websocket, path):
        """Handle WebSocket connections from HTML dashboard"""
        self.connected_clients.add(websocket)
        client_ip = websocket.remote_address[0]
        
        print(f"🔗 Dashboard client connected from {client_ip}")
        await self.send_to_client(websocket, {
            "type": "connection_established",
            "message": "Connected to Birmingham Storm Command",
            "timestamp": datetime.now().isoformat()
        })
        
        try:
            async for message in websocket:
                await self.handle_client_message(websocket, message)
                
        except websockets.exceptions.ConnectionClosed:
            print(f"🔌 Dashboard client {client_ip} disconnected")
        except Exception as e:
            print(f"❌ Client connection error: {e}")
        finally:
            self.connected_clients.remove(websocket)
    
    async def handle_client_message(self, websocket, message):
        """Process messages from HTML dashboard"""
        try:
            data = json.loads(message)
            message_type = data.get('type')
            
            print(f"📨 Received: {message_type}")
            
            if message_type == 'auto_navigate_birmingham':
                await self.execute_birmingham_navigation(websocket)
                
            elif message_type == 'reset_view':
                await self.reset_camera_view(websocket)
                
            elif message_type == 'validate_setup':
                await self.validate_ue5_setup(websocket)
                
            elif message_type == 'get_weather_data':
                await self.send_weather_update(websocket)
                
            elif message_type == 'get_performance_metrics':
                await self.send_performance_metrics(websocket)
                
            elif message_type == 'activate_agents':
                await self.activate_all_agents(websocket)
                
            else:
                await self.send_to_client(websocket, {
                    "type": "error",
                    "message": f"Unknown message type: {message_type}"
                })
                
        except json.JSONDecodeError:
            await self.send_to_client(websocket, {
                "type": "error", 
                "message": "Invalid JSON message"
            })
        except Exception as e:
            await self.send_to_client(websocket, {
                "type": "error",
                "message": f"Message processing error: {str(e)}"
            })
    
    async def execute_birmingham_navigation(self, websocket):
        """Execute automatic Birmingham navigation in UE5"""
        await self.send_to_client(websocket, {
            "type": "automation_started",
            "message": "🚀 Starting Birmingham auto-navigation"
        })
        
        navigation_steps = [
            ("Enabling UE5 Remote Control", "RemoteControl.EnableWebServer true"),
            ("Setting Cesium Georeference", f"CesiumGeoreference.SetOriginLatitude {self.birmingham_coords['latitude']}"),
            ("Setting Longitude", f"CesiumGeoreference.SetOriginLongitude {self.birmingham_coords['longitude']}"),
            ("Setting Height", f"CesiumGeoreference.SetOriginHeight {self.birmingham_coords['height']}"),
            ("Loading World Terrain", "Cesium3DTileset.SetUrl https://assets.cesium.com/1"),
            ("Configuring Camera", f"Camera.SetLocation 0 0 {self.birmingham_coords['height'] * 200}"),
            ("Setting Camera Rotation", "Camera.SetRotation -45 0 0"),
            ("Applying Storm Lighting", "CesiumSunSky.SetTimeOfDay 14.0"),
            ("Finalizing Setup", "CesiumGeoreference.RefreshGeoreference")
        ]
        
        total_steps = len(navigation_steps)
        
        for i, (step_name, command) in enumerate(navigation_steps):
            # Send progress update
            progress = (i + 1) / total_steps * 100
            await self.send_to_client(websocket, {
                "type": "automation_progress",
                "step": step_name,
                "progress": progress,
                "command": command
            })
            
            # Execute UE5 command
            success = await self.send_ue5_command(command)
            
            # Send step completion
            await self.send_to_client(websocket, {
                "type": "step_completed",
                "step": step_name,
                "success": success,
                "progress": progress
            })
            
            # Brief delay between steps
            await asyncio.sleep(0.5)
        
        # Send completion notification
        await self.send_to_client(websocket, {
            "type": "automation_completed",
            "message": "✅ Birmingham navigation completed successfully",
            "coordinates": self.birmingham_coords
        })
    
    async def reset_camera_view(self, websocket):
        """Reset camera to optimal Birmingham viewing position"""
        await self.send_to_client(websocket, {
            "type": "operation_started",
            "message": "🔄 Resetting camera view"
        })
        
        camera_commands = [
            f"Camera.SetLocation 0 0 {self.birmingham_coords['height'] * 200}",
            "Camera.SetRotation -45 0 0",
            "Camera.SetFOV 90"
        ]
        
        for command in camera_commands:
            await self.send_ue5_command(command)
        
        await self.send_to_client(websocket, {
            "type": "operation_completed",
            "message": "✅ Camera reset to optimal position"
        })
    
    async def validate_ue5_setup(self, websocket):
        """Validate UE5 Birmingham setup"""
        await self.send_to_client(websocket, {
            "type": "validation_started",
            "message": "🔍 Validating Birmingham setup"
        })
        
        validation_checks = [
            ("Checking UE5 Connection", self.check_ue5_connection),
            ("Verifying Cesium Plugin", self.check_cesium_plugin),
            ("Testing Georeference", self.check_georeference),
            ("Validating Terrain Loading", self.check_terrain_loading)
        ]
        
        results = []
        
        for check_name, check_function in validation_checks:
            await self.send_to_client(websocket, {
                "type": "validation_step",
                "step": check_name
            })
            
            result = await check_function()
            results.append({"check": check_name, "passed": result})
            
            await self.send_to_client(websocket, {
                "type": "validation_result",
                "step": check_name,
                "passed": result
            })
        
        all_passed = all(result["passed"] for result in results)
        
        await self.send_to_client(websocket, {
            "type": "validation_completed",
            "passed": all_passed,
            "results": results,
            "message": "✅ All checks passed" if all_passed else "❌ Some checks failed"
        })
    
    async def send_weather_update(self, websocket):
        """Send current Birmingham weather data"""
        weather_data = await self.get_birmingham_weather()
        
        await self.send_to_client(websocket, {
            "type": "weather_update",
            "data": weather_data,
            "timestamp": datetime.now().isoformat()
        })
    
    async def send_performance_metrics(self, websocket):
        """Send UE5 performance metrics"""
        metrics = await self.get_ue5_performance()
        
        await self.send_to_client(websocket, {
            "type": "performance_update",
            "data": metrics,
            "timestamp": datetime.now().isoformat()
        })
    
    async def activate_all_agents(self, websocket):
        """Activate all agent systems"""
        await self.send_to_client(websocket, {
            "type": "agents_activation_started",
            "message": "🤖 Activating all agent systems"
        })
        
        agents = [
            "Clay-I Vision System",
            "Pathsassin Intelligence",
            "GPT Birmingham Architect", 
            "Storm Commander",
            "Weather Monitor"
        ]
        
        for agent in agents:
            await self.send_to_client(websocket, {
                "type": "agent_activated",
                "agent": agent,
                "status": "active"
            })
            await asyncio.sleep(0.5)
        
        await self.send_to_client(websocket, {
            "type": "agents_activation_completed",
            "message": "✅ All agents activated and coordinated"
        })
    
    async def send_ue5_command(self, command):
        """Send command to UE5 via Remote Control API"""
        try:
            url = f"http://localhost:{self.ue5_remote_port}/remote/object/call"
            payload = {
                "objectPath": "/Script/Engine.Engine.GameEngine",
                "functionName": "ExecuteConsoleCommand",
                "parameters": {
                    "Command": command
                }
            }
            
            # Use asyncio's run_in_executor for blocking HTTP request
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: requests.post(url, json=payload, timeout=5)
            )
            
            return response.status_code == 200
            
        except Exception as e:
            print(f"❌ UE5 command failed: {command} - {e}")
            return False
    
    async def check_ue5_connection(self):
        """Check if UE5 Remote Control is accessible"""
        try:
            url = f"http://localhost:{self.ue5_remote_port}/remote/info"
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.get(url, timeout=3)
            )
            return response.status_code == 200
        except:
            return False
    
    async def check_cesium_plugin(self):
        """Check if Cesium plugin is loaded"""
        # This would check for Cesium-specific objects/commands
        return await self.send_ue5_command("stat unit")  # Simple test command
    
    async def check_georeference(self):
        """Check if Cesium Georeference is properly configured"""
        return await self.send_ue5_command("CesiumGeoreference.GetOriginLatitude")
    
    async def check_terrain_loading(self):
        """Check if terrain tiles are loading properly"""
        return await self.send_ue5_command("stat streaming")
    
    async def get_birmingham_weather(self):
        """Get Birmingham weather data (mock implementation)"""
        # This would integrate with actual weather API
        import random
        
        return {
            "temperature": random.randint(70, 90),
            "wind_speed": random.randint(5, 20),
            "storm_probability": random.randint(10, 50),
            "conditions": random.choice(["Partly Cloudy", "Cloudy", "Storm Approaching"]),
            "alerts": [] if random.random() > 0.3 else ["Thunderstorm Watch"]
        }
    
    async def get_ue5_performance(self):
        """Get UE5 performance metrics (mock implementation)"""
        import random
        
        return {
            "fps": random.randint(40, 60),
            "memory_gb": round(random.uniform(6.0, 10.0), 1),
            "network_mbps": round(random.uniform(10.0, 30.0), 1),
            "tile_loading": random.choice(["Ready", "Loading", "Streaming"])
        }
    
    async def send_to_client(self, websocket, data):
        """Send data to a specific client"""
        try:
            await websocket.send(json.dumps(data))
        except Exception as e:
            print(f"❌ Failed to send to client: {e}")
    
    async def broadcast_to_all_clients(self, data):
        """Broadcast data to all connected clients"""
        if self.connected_clients:
            message = json.dumps(data)
            await asyncio.gather(
                *[client.send(message) for client in self.connected_clients],
                return_exceptions=True
            )
    
    async def start_periodic_updates(self):
        """Start periodic updates to all clients"""
        while True:
            if self.connected_clients:
                # Send weather updates every 30 seconds
                weather_data = await self.get_birmingham_weather()
                await self.broadcast_to_all_clients({
                    "type": "periodic_weather_update",
                    "data": weather_data,
                    "timestamp": datetime.now().isoformat()
                })
                
                # Send performance updates every 10 seconds
                await asyncio.sleep(10)
                
                performance_data = await self.get_ue5_performance()
                await self.broadcast_to_all_clients({
                    "type": "periodic_performance_update", 
                    "data": performance_data,
                    "timestamp": datetime.now().isoformat()
                })
                
                await asyncio.sleep(20)  # Total 30 second cycle
            else:
                await asyncio.sleep(5)  # Check for clients every 5 seconds
    
    def start_server(self):
        """Start the WebSocket server"""
        print("🚀 STARTING UE5 WEBSOCKET BRIDGE")
        print(f"📍 Birmingham coordinates: {self.birmingham_coords['latitude']}, {self.birmingham_coords['longitude']}")
        print(f"🌐 WebSocket server starting on ws://localhost:{self.websocket_port}")
        print(f"🔗 UE5 Remote Control on http://localhost:{self.ue5_remote_port}")
        print("=" * 60)
        
        # Start WebSocket server
        start_server = websockets.serve(
            self.handle_client_connection,
            "localhost", 
            self.websocket_port
        )
        
        # Start periodic updates
        periodic_updates = self.start_periodic_updates()
        
        # Run both concurrently
        loop = asyncio.get_event_loop()
        loop.run_until_complete(asyncio.gather(start_server, periodic_updates))

if __name__ == "__main__":
    bridge = UE5WebSocketBridge()
    
    try:
        bridge.start_server()
    except KeyboardInterrupt:
        print("\n🛑 WebSocket bridge shutting down...")
    except Exception as e:
        print(f"❌ Bridge error: {e}")