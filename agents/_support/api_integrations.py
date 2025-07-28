#!/usr/bin/env python3
"""
API Integration Module
Defines touchpoints for Twilio, AccuLynx, Calendly, and n8n integrations
"""

import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class APICredentials:
    api_key: str
    secret_key: str = ""
    base_url: str = ""
    webhook_url: str = ""

class APIIntegration(ABC):
    """Base class for API integrations"""
    
    def __init__(self, credentials: APICredentials):
        self.credentials = credentials
        self.setup_logging()
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(self.__class__.__name__)
        
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test API connection"""
        pass
        
    @abstractmethod
    async def send_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to API"""
        pass

class TwilioIntegration(APIIntegration):
    """
    Twilio API integration for voice calls and SMS
    """
    
    def __init__(self, credentials: APICredentials):
        super().__init__(credentials)
        self.base_url = "https://api.twilio.com/2010-04-01"
        
    async def test_connection(self) -> bool:
        """Test Twilio API connection"""
        try:
            # Simulate API call
            await asyncio.sleep(0.1)
            self.logger.info("Twilio connection test successful")
            return True
        except Exception as e:
            self.logger.error(f"Twilio connection failed: {e}")
            return False
            
    async def send_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to Twilio API"""
        action = data.get("action")
        
        if action == "make_call":
            return await self._make_call(data)
        elif action == "send_sms":
            return await self._send_sms(data)
        elif action == "get_call_details":
            return await self._get_call_details(data)
        else:
            raise ValueError(f"Unknown Twilio action: {action}")
            
    async def _make_call(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make outbound call"""
        phone_number = data.get("to")
        message = data.get("message", "")
        
        # Simulate API call
        await asyncio.sleep(0.5)
        
        call_sid = f"CA{str(abs(hash(phone_number)))[:32]}"
        
        return {
            "call_sid": call_sid,
            "status": "completed",
            "duration": "45",
            "to": phone_number,
            "from": "+1234567890"
        }
        
    async def _send_sms(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send SMS message"""
        phone_number = data.get("to")
        message = data.get("message")
        
        # Simulate API call
        await asyncio.sleep(0.2)
        
        message_sid = f"SM{str(abs(hash(message)))[:32]}"
        
        return {
            "message_sid": message_sid,
            "status": "delivered",
            "to": phone_number,
            "body": message
        }
        
    async def _get_call_details(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get call recording and transcript"""
        call_sid = data.get("call_sid")
        
        # Simulate API call
        await asyncio.sleep(0.3)
        
        return {
            "call_sid": call_sid,
            "transcript": data.get("mock_transcript", "Customer called about roof damage"),
            "recording_url": f"https://api.twilio.com/recordings/{call_sid}.mp3",
            "duration": "120",
            "caller_info": {
                "phone": "+1987654321",
                "name": "Unknown"
            }
        }

class AccuLynxIntegration(APIIntegration):
    """
    AccuLynx API integration for CRM and project management
    """
    
    def __init__(self, credentials: APICredentials):
        super().__init__(credentials)
        self.base_url = "https://api.acculynx.com/v1"
        
    async def test_connection(self) -> bool:
        """Test AccuLynx API connection"""
        try:
            # Simulate API call
            await asyncio.sleep(0.1)
            self.logger.info("AccuLynx connection test successful")
            return True
        except Exception as e:
            self.logger.error(f"AccuLynx connection failed: {e}")
            return False
            
    async def send_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to AccuLynx API"""
        action = data.get("action")
        
        if action == "create_lead":
            return await self._create_lead(data)
        elif action == "create_project":
            return await self._create_project(data)
        elif action == "update_project":
            return await self._update_project(data)
        elif action == "create_quote":
            return await self._create_quote(data)
        elif action == "get_materials":
            return await self._get_materials(data)
        else:
            raise ValueError(f"Unknown AccuLynx action: {action}")
            
    async def _create_lead(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new lead in AccuLynx"""
        customer_info = data.get("customer_info", {})
        damage_assessment = data.get("damage_assessment", {})
        
        # Simulate API call
        await asyncio.sleep(0.4)
        
        lead_id = f"LEAD-{abs(hash(customer_info.get('name', 'unknown')))}"
        
        return {
            "lead_id": lead_id,
            "status": "created",
            "customer_name": customer_info.get("name"),
            "address": customer_info.get("address"),
            "damage_type": damage_assessment.get("type"),
            "urgency": damage_assessment.get("urgency")
        }
        
    async def _create_project(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create project from approved quote"""
        quote_id = data.get("quote_id")
        customer_info = data.get("customer_info", {})
        
        # Simulate API call
        await asyncio.sleep(0.5)
        
        project_id = f"PROJ-{abs(hash(quote_id))}"
        
        return {
            "project_id": project_id,
            "status": "created",
            "quote_id": quote_id,
            "customer_name": customer_info.get("name"),
            "start_date": (datetime.now()).isoformat(),
            "estimated_completion": (datetime.now()).isoformat()
        }
        
    async def _update_project(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update project status"""
        project_id = data.get("project_id")
        status = data.get("status")
        
        # Simulate API call
        await asyncio.sleep(0.2)
        
        return {
            "project_id": project_id,
            "status": status,
            "updated_at": datetime.now().isoformat()
        }
        
    async def _create_quote(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create quote in AccuLynx"""
        quote_data = data.get("quote_data", {})
        
        # Simulate API call
        await asyncio.sleep(0.6)
        
        acculynx_quote_id = f"ALQ-{abs(hash(str(quote_data)))}"
        
        return {
            "acculynx_quote_id": acculynx_quote_id,
            "external_quote_id": quote_data.get("quote_id"),
            "status": "created",
            "total": quote_data.get("totals", {}).get("total", 0)
        }
        
    async def _get_materials(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get material pricing from AccuLynx"""
        material_names = data.get("materials", [])
        
        # Simulate API call
        await asyncio.sleep(0.3)
        
        materials = []
        for material in material_names:
            materials.append({
                "name": material,
                "cost": 3.50,  # Mock cost
                "availability": "in_stock",
                "supplier": "Default Supplier"
            })
            
        return {
            "materials": materials,
            "updated_at": datetime.now().isoformat()
        }

class CalendlyIntegration(APIIntegration):
    """
    Calendly API integration for scheduling
    """
    
    def __init__(self, credentials: APICredentials):
        super().__init__(credentials)
        self.base_url = "https://api.calendly.com"
        
    async def test_connection(self) -> bool:
        """Test Calendly API connection"""
        try:
            # Simulate API call
            await asyncio.sleep(0.1)
            self.logger.info("Calendly connection test successful")
            return True
        except Exception as e:
            self.logger.error(f"Calendly connection failed: {e}")
            return False
            
    async def send_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to Calendly API"""
        action = data.get("action")
        
        if action == "schedule_appointment":
            return await self._schedule_appointment(data)
        elif action == "get_availability":
            return await self._get_availability(data)
        elif action == "cancel_appointment":
            return await self._cancel_appointment(data)
        elif action == "reschedule_appointment":
            return await self._reschedule_appointment(data)
        else:
            raise ValueError(f"Unknown Calendly action: {action}")
            
    async def _schedule_appointment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Schedule new appointment"""
        customer_info = data.get("customer_info", {})
        appointment_type = data.get("appointment_type", "inspection")
        preferred_date = data.get("preferred_date")
        
        # Simulate API call
        await asyncio.sleep(0.4)
        
        event_uuid = f"EVENT-{abs(hash(customer_info.get('name', 'unknown')))}"
        
        return {
            "event_uuid": event_uuid,
            "status": "scheduled",
            "appointment_type": appointment_type,
            "scheduled_date": preferred_date,
            "customer_name": customer_info.get("name"),
            "customer_email": customer_info.get("email"),
            "meeting_link": f"https://calendly.com/meetings/{event_uuid}"
        }
        
    async def _get_availability(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get available time slots"""
        date_range = data.get("date_range", {})
        
        # Simulate API call
        await asyncio.sleep(0.2)
        
        # Mock availability
        available_slots = [
            "2025-07-20T09:00:00Z",
            "2025-07-20T11:00:00Z",
            "2025-07-20T14:00:00Z",
            "2025-07-21T09:00:00Z",
            "2025-07-21T15:00:00Z"
        ]
        
        return {
            "available_slots": available_slots,
            "timezone": "America/New_York"
        }
        
    async def _cancel_appointment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Cancel appointment"""
        event_uuid = data.get("event_uuid")
        
        # Simulate API call
        await asyncio.sleep(0.2)
        
        return {
            "event_uuid": event_uuid,
            "status": "cancelled",
            "cancelled_at": datetime.now().isoformat()
        }
        
    async def _reschedule_appointment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Reschedule appointment"""
        event_uuid = data.get("event_uuid")
        new_date = data.get("new_date")
        
        # Simulate API call
        await asyncio.sleep(0.3)
        
        return {
            "event_uuid": event_uuid,
            "status": "rescheduled",
            "new_date": new_date,
            "rescheduled_at": datetime.now().isoformat()
        }

class N8nIntegration(APIIntegration):
    """
    n8n API integration for workflow automation
    """
    
    def __init__(self, credentials: APICredentials):
        super().__init__(credentials)
        self.base_url = credentials.base_url or "https://n8n.yourdomain.com"
        
    async def test_connection(self) -> bool:
        """Test n8n API connection"""
        try:
            # Simulate API call
            await asyncio.sleep(0.1)
            self.logger.info("n8n connection test successful")
            return True
        except Exception as e:
            self.logger.error(f"n8n connection failed: {e}")
            return False
            
    async def send_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to n8n workflow"""
        action = data.get("action")
        
        if action == "trigger_workflow":
            return await self._trigger_workflow(data)
        elif action == "get_workflow_status":
            return await self._get_workflow_status(data)
        elif action == "create_workflow":
            return await self._create_workflow(data)
        else:
            raise ValueError(f"Unknown n8n action: {action}")
            
    async def _trigger_workflow(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger n8n workflow"""
        workflow_id = data.get("workflow_id")
        workflow_data = data.get("workflow_data", {})
        
        # Simulate API call
        await asyncio.sleep(0.5)
        
        execution_id = f"EXEC-{abs(hash(str(workflow_data)))}"
        
        return {
            "execution_id": execution_id,
            "workflow_id": workflow_id,
            "status": "running",
            "started_at": datetime.now().isoformat(),
            "input_data": workflow_data
        }
        
    async def _get_workflow_status(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get workflow execution status"""
        execution_id = data.get("execution_id")
        
        # Simulate API call
        await asyncio.sleep(0.2)
        
        return {
            "execution_id": execution_id,
            "status": "success",
            "completed_at": datetime.now().isoformat(),
            "output_data": {
                "processed": True,
                "results": "Workflow completed successfully"
            }
        }
        
    async def _create_workflow(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new workflow"""
        workflow_name = data.get("name")
        workflow_config = data.get("config", {})
        
        # Simulate API call
        await asyncio.sleep(0.6)
        
        workflow_id = f"WF-{abs(hash(workflow_name))}"
        
        return {
            "workflow_id": workflow_id,
            "name": workflow_name,
            "status": "created",
            "config": workflow_config,
            "created_at": datetime.now().isoformat()
        }

class APIManager:
    """
    Manager for all API integrations
    """
    
    def __init__(self):
        self.integrations = {}
        self.setup_logging()
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('APIManager')
        
    def register_integration(self, name: str, integration: APIIntegration):
        """Register an API integration"""
        self.integrations[name] = integration
        self.logger.info(f"Registered {name} integration")
        
    async def test_all_connections(self) -> Dict[str, bool]:
        """Test all registered API connections"""
        results = {}
        
        for name, integration in self.integrations.items():
            try:
                results[name] = await integration.test_connection()
            except Exception as e:
                self.logger.error(f"Failed to test {name}: {e}")
                results[name] = False
                
        return results
        
    async def send_to_api(self, api_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to specific API"""
        if api_name not in self.integrations:
            raise ValueError(f"API integration '{api_name}' not found")
            
        integration = self.integrations[api_name]
        return await integration.send_data(data)
        
    def get_api_touchpoints(self) -> Dict[str, List[str]]:
        """Get available API touchpoints for each sub-agent"""
        return {
            "VoiceResponder": ["twilio", "n8n"],
            "QuoteDraft": ["acculynx", "n8n"],
            "MaterialOrderBot": ["acculynx", "calendly", "n8n"]
        }

async def setup_api_integrations() -> APIManager:
    """Setup and configure all API integrations"""
    manager = APIManager()
    
    # Setup credentials (in production, load from secure config)
    twilio_creds = APICredentials(
        api_key="your_twilio_account_sid",
        secret_key="your_twilio_auth_token"
    )
    
    acculynx_creds = APICredentials(
        api_key="your_acculynx_api_key",
        base_url="https://api.acculynx.com/v1"
    )
    
    calendly_creds = APICredentials(
        api_key="your_calendly_api_key",
        base_url="https://api.calendly.com"
    )
    
    n8n_creds = APICredentials(
        api_key="your_n8n_api_key",
        base_url="https://n8n.yourdomain.com/api/v1"
    )
    
    # Register integrations
    manager.register_integration("twilio", TwilioIntegration(twilio_creds))
    manager.register_integration("acculynx", AccuLynxIntegration(acculynx_creds))
    manager.register_integration("calendly", CalendlyIntegration(calendly_creds))
    manager.register_integration("n8n", N8nIntegration(n8n_creds))
    
    return manager

async def test_api_integrations():
    """Test all API integrations"""
    manager = await setup_api_integrations()
    
    print("--- Testing API Integrations ---")
    
    # Test connections
    connection_results = await manager.test_all_connections()
    for api_name, success in connection_results.items():
        status = "✓" if success else "✗"
        print(f"{status} {api_name}: {'Connected' if success else 'Failed'}")
    
    print(f"\nAPI Touchpoints: {manager.get_api_touchpoints()}")
    
    # Test sample operations
    print("\n--- Testing Sample Operations ---")
    
    # Test Twilio SMS
    try:
        sms_result = await manager.send_to_api("twilio", {
            "action": "send_sms",
            "to": "+1234567890",
            "message": "Your quote is ready for review"
        })
        print(f"Twilio SMS: {sms_result['status']}")
    except Exception as e:
        print(f"Twilio SMS failed: {e}")
    
    # Test AccuLynx lead creation
    try:
        lead_result = await manager.send_to_api("acculynx", {
            "action": "create_lead",
            "customer_info": {"name": "Test Customer", "address": "123 Test St"},
            "damage_assessment": {"type": "roof_leak", "urgency": "high"}
        })
        print(f"AccuLynx Lead: {lead_result['status']}")
    except Exception as e:
        print(f"AccuLynx Lead failed: {e}")
    
    # Test Calendly scheduling
    try:
        schedule_result = await manager.send_to_api("calendly", {
            "action": "schedule_appointment",
            "customer_info": {"name": "Test Customer", "email": "test@example.com"},
            "appointment_type": "inspection",
            "preferred_date": "2025-07-20T10:00:00Z"
        })
        print(f"Calendly Schedule: {schedule_result['status']}")
    except Exception as e:
        print(f"Calendly Schedule failed: {e}")
    
    # Test n8n workflow
    try:
        workflow_result = await manager.send_to_api("n8n", {
            "action": "trigger_workflow",
            "workflow_id": "storm_response_workflow",
            "workflow_data": {"customer": "Test Customer", "urgency": "high"}
        })
        print(f"n8n Workflow: {workflow_result['status']}")
    except Exception as e:
        print(f"n8n Workflow failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_api_integrations())