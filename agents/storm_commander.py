#!/usr/bin/env python3
"""
StormCommander - AI-Native Operating System Agent Commander
Coordinates intelligent sub-agents for post-storm automation including voice triage, quoting, and order sequencing.
"""

import json
import logging
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum

class AgentStatus(Enum):
    INACTIVE = "inactive"
    ACTIVE = "active"
    PROCESSING = "processing"
    ERROR = "error"
    COMPLETED = "completed"

@dataclass
class AgentConfig:
    name: str
    mission: str
    api_endpoints: List[str]
    prompt_template: str
    validation_rules: List[str]
    status: AgentStatus = AgentStatus.INACTIVE

@dataclass
class TaskResult:
    agent_name: str
    task_id: str
    status: str
    result: Any
    timestamp: datetime
    errors: List[str] = None

class StormCommander:
    """
    Main Agent Commander for coordinating post-storm automation sub-agents
    """
    
    def __init__(self):
        self.sub_agents = {}
        self.task_queue = []
        self.results_log = []
        self.api_connections = {
            "twilio": None,
            "acculynx": None,
            "calendly": None,
            "n8n": None
        }
        self.setup_logging()
        
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('storm_commander.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('StormCommander')
        
    def register_sub_agent(self, config: AgentConfig):
        """Register a new sub-agent with the commander"""
        self.sub_agents[config.name] = config
        self.logger.info(f"Registered sub-agent: {config.name}")
        
    def spawn_voice_responder(self):
        """Spawn VoiceResponder sub-agent for voice triage"""
        config = AgentConfig(
            name="VoiceResponder",
            mission="Handle incoming voice calls, triage urgency, and extract key damage information",
            api_endpoints=["twilio", "n8n"],
            prompt_template="voice_responder_template",
            validation_rules=[
                "must_extract_contact_info",
                "must_assess_urgency_level",
                "must_identify_damage_type"
            ]
        )
        self.register_sub_agent(config)
        return config
        
    def spawn_quote_draft(self):
        """Spawn QuoteDraft sub-agent for quote generation"""
        config = AgentConfig(
            name="QuoteDraft",
            mission="Generate accurate quotes based on damage assessment and material costs",
            api_endpoints=["acculynx", "n8n"],
            prompt_template="quote_draft_template",
            validation_rules=[
                "must_include_material_costs",
                "must_include_labor_estimates",
                "must_include_timeline",
                "must_validate_pricing_rules"
            ]
        )
        self.register_sub_agent(config)
        return config
        
    def spawn_material_order_bot(self):
        """Spawn MaterialOrderBot sub-agent for material ordering"""
        config = AgentConfig(
            name="MaterialOrderBot",
            mission="Automatically order materials based on approved quotes and scheduling",
            api_endpoints=["acculynx", "calendly", "n8n"],
            prompt_template="material_order_template",
            validation_rules=[
                "must_verify_quote_approval",
                "must_check_material_availability",
                "must_optimize_delivery_timing",
                "must_track_order_status"
            ]
        )
        self.register_sub_agent(config)
        return config
        
    async def issue_test_task(self, agent_name: str, test_task: Dict[str, Any]) -> TaskResult:
        """Issue a test task to a specific sub-agent and evaluate response fitness"""
        if agent_name not in self.sub_agents:
            raise ValueError(f"Agent {agent_name} not found")
            
        agent = self.sub_agents[agent_name]
        agent.status = AgentStatus.PROCESSING
        
        self.logger.info(f"Issuing test task to {agent_name}: {test_task}")
        
        try:
            # Simulate agent processing
            await asyncio.sleep(1)  # Simulate processing time
            
            # Mock response based on agent type
            if agent_name == "VoiceResponder":
                result = {
                    "contact_info": test_task.get("caller_info", {}),
                    "urgency_level": "high",
                    "damage_type": "roof_leak",
                    "summary": "Customer reports active roof leak in kitchen area"
                }
            elif agent_name == "QuoteDraft":
                result = {
                    "quote_id": f"Q-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                    "material_costs": 2500.00,
                    "labor_costs": 1800.00,
                    "timeline": "3-5 business days",
                    "total": 4300.00
                }
            elif agent_name == "MaterialOrderBot":
                result = {
                    "order_id": f"O-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                    "materials_ordered": ["shingles", "underlayment", "flashing"],
                    "delivery_date": "2025-07-22",
                    "total_cost": 2500.00
                }
            else:
                result = {"status": "completed", "message": "Test task processed"}
                
            agent.status = AgentStatus.COMPLETED
            
            task_result = TaskResult(
                agent_name=agent_name,
                task_id=test_task.get("task_id", "test_001"),
                status="success",
                result=result,
                timestamp=datetime.now()
            )
            
            self.results_log.append(task_result)
            self.logger.info(f"Test task completed for {agent_name}")
            return task_result
            
        except Exception as e:
            agent.status = AgentStatus.ERROR
            task_result = TaskResult(
                agent_name=agent_name,
                task_id=test_task.get("task_id", "test_001"),
                status="error",
                result=None,
                timestamp=datetime.now(),
                errors=[str(e)]
            )
            self.results_log.append(task_result)
            self.logger.error(f"Test task failed for {agent_name}: {e}")
            return task_result
            
    def evaluate_agent_fitness(self, task_result: TaskResult) -> Dict[str, Any]:
        """Evaluate the fitness of an agent's response"""
        agent_config = self.sub_agents[task_result.agent_name]
        
        fitness_score = 100
        issues = []
        
        if task_result.status != "success":
            fitness_score = 0
            issues.append("Task failed to complete")
            return {"score": fitness_score, "issues": issues}
            
        # Check validation rules
        for rule in agent_config.validation_rules:
            if not self._validate_rule(rule, task_result.result):
                fitness_score -= 20
                issues.append(f"Failed validation rule: {rule}")
                
        return {
            "agent_name": task_result.agent_name,
            "score": max(0, fitness_score),
            "issues": issues,
            "timestamp": task_result.timestamp.isoformat()
        }
        
    def _validate_rule(self, rule: str, result: Any) -> bool:
        """Validate a specific rule against the result"""
        if not isinstance(result, dict):
            return False
            
        validation_map = {
            "must_extract_contact_info": lambda r: "contact_info" in r and r["contact_info"],
            "must_assess_urgency_level": lambda r: "urgency_level" in r,
            "must_identify_damage_type": lambda r: "damage_type" in r,
            "must_include_material_costs": lambda r: "material_costs" in r and isinstance(r["material_costs"], (int, float)),
            "must_include_labor_estimates": lambda r: "labor_costs" in r and isinstance(r["labor_costs"], (int, float)),
            "must_include_timeline": lambda r: "timeline" in r,
            "must_validate_pricing_rules": lambda r: "total" in r and r["total"] > 0,
            "must_verify_quote_approval": lambda r: "quote_id" in r,
            "must_check_material_availability": lambda r: "materials_ordered" in r,
            "must_optimize_delivery_timing": lambda r: "delivery_date" in r,
            "must_track_order_status": lambda r: "order_id" in r
        }
        
        validator = validation_map.get(rule)
        if validator:
            try:
                return validator(result)
            except Exception:
                return False
        return True
        
    def get_system_status(self) -> Dict[str, Any]:
        """Get current system status and agent states"""
        return {
            "commander_status": "active",
            "sub_agents": {name: agent.status.value for name, agent in self.sub_agents.items()},
            "total_tasks_processed": len(self.results_log),
            "api_connections": self.api_connections,
            "timestamp": datetime.now().isoformat()
        }
        
    def export_state(self) -> Dict[str, Any]:
        """Export current system state for persistence"""
        return {
            "sub_agents": {name: asdict(agent) for name, agent in self.sub_agents.items()},
            "results_log": [asdict(result) for result in self.results_log],
            "system_status": self.get_system_status()
        }

async def main():
    """Main execution function for StormCommander"""
    commander = StormCommander()
    
    # Spawn all three sub-agents
    voice_agent = commander.spawn_voice_responder()
    quote_agent = commander.spawn_quote_draft()
    material_agent = commander.spawn_material_order_bot()
    
    print("StormCommander initialized with sub-agents:")
    print(f"- {voice_agent.name}: {voice_agent.mission}")
    print(f"- {quote_agent.name}: {quote_agent.mission}")
    print(f"- {material_agent.name}: {material_agent.mission}")
    
    # Issue test tasks to each agent
    test_tasks = {
        "VoiceResponder": {
            "task_id": "voice_test_001",
            "caller_info": {"name": "John Smith", "phone": "+1234567890"},
            "audio_transcript": "Hi, I have a roof leak in my kitchen after the storm"
        },
        "QuoteDraft": {
            "task_id": "quote_test_001",
            "damage_assessment": {"type": "roof_leak", "severity": "moderate", "area": "200_sqft"}
        },
        "MaterialOrderBot": {
            "task_id": "order_test_001",
            "approved_quote": {"quote_id": "Q-123", "materials": ["shingles", "underlayment"]}
        }
    }
    
    # Process test tasks
    results = []
    for agent_name, task in test_tasks.items():
        result = await commander.issue_test_task(agent_name, task)
        fitness = commander.evaluate_agent_fitness(result)
        results.append({"result": result, "fitness": fitness})
        print(f"\n{agent_name} Test Result:")
        print(f"  Status: {result.status}")
        print(f"  Fitness Score: {fitness['score']}")
        if fitness['issues']:
            print(f"  Issues: {', '.join(fitness['issues'])}")
    
    # Display system status
    print(f"\nSystem Status: {commander.get_system_status()}")
    
    return commander

if __name__ == "__main__":
    asyncio.run(main())