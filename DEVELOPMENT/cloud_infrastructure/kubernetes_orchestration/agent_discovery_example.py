# Example: How agents automatically find each other in Kubernetes

import os
import requests

class AgentCoordinator:
    def __init__(self):
        # Kubernetes automatically provides these via environment variables
        self.clay_i_url = os.getenv('CLAY_I_URL', 'http://clay-i-service:8000')
        self.pathsassin_url = os.getenv('PATHSASSIN_URL', 'http://pathsassin-service:8000')
        self.revenue_url = os.getenv('REVENUE_AGENT_URL', 'http://revenue-agent-service:8000')
    
    def coordinate_agents(self):
        # All agents automatically discoverable by service name
        clay_i_status = requests.get(f"{self.clay_i_url}/health")
        pathsassin_status = requests.get(f"{self.pathsassin_url}/health")
        revenue_status = requests.get(f"{self.revenue_url}/health")
        
        return {
            "clay_i": clay_i_status.status_code == 200,
            "pathsassin": pathsassin_status.status_code == 200,
            "revenue_agent": revenue_status.status_code == 200
        }
    
    def distribute_work(self, task):
        # Load balancing automatically handled by Kubernetes
        # Multiple Pathsassin pods share the same service name
        response = requests.post(f"{self.pathsassin_url}/generate", json=task)
        return response.json()

# No port management needed - Kubernetes handles everything!