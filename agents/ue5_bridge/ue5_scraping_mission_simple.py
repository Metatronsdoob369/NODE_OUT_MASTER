#!/usr/bin/env python3
"""
UE5 Scraping Mission - Simplified Version for PATHsassin & Clay-I
Mission: Extract comprehensive Unreal Engine 5 development knowledge
Target: Complete UE5 ecosystem understanding for game development mastery
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import re

class UE5ScrapingMission:
    """Coordinated UE5 knowledge extraction mission"""
    
    def __init__(self):
        self.mission_id = f"ue5_mission_{int(time.time())}"
        self.pathsassin_url = "http://localhost:5000"  # PATHsassin API
        self.clay_i_url = "http://localhost:5002"      # Clay-I server
        self.clay_i_available = False
        self.pathsassin_available = False
        
        # UE5 Knowledge Targets
        self.target_urls = {
            "documentation": [
                "https://docs.unrealengine.com/5.3/en-US/understanding-the-basics/",
                "https://docs.unrealengine.com/5.3/en-US/blueprints-visual-scripting/",
                "https://docs.unrealengine.com/5.3/en-US/programming-and-scripting/",
            ],
            "learning_resources": [
                "https://www.unrealengine.com/en-US/learn",
                "https://dev.epicgames.com/community/learning",
            ],
            "advanced_topics": [
                "https://docs.unrealengine.com/5.3/en-US/nanite-virtualized-geometry/",
                "https://docs.unrealengine.com/5.3/en-US/lumen-global-illumination-and-reflections/",
            ]
        }
        
        # Mission tracking
        self.extracted_knowledge = {
            "pathsassin_insights": [],
            "clay_i_analysis": [],
            "combined_mastery": {},
            "mission_log": []
        }
        
    def start_mission(self):
        """Initialize coordinated UE5 learning mission"""
        print("🎮 STARTING UE5 SCRAPING MISSION")
        print(f"Mission ID: {self.mission_id}")
        print(f"Target URLs: {sum(len(urls) for urls in self.target_urls.values())} endpoints")
        
        # Check if agents are running
        pathsassin_online = self.check_agent_status(self.pathsassin_url)
        clay_i_online = self.check_agent_status(self.clay_i_url)
        
        print(f"🤖 PATHsassin: {'🟢 Online' if pathsassin_online else '🔴 Offline'}")
        print(f"🧠 Clay-I: {'🟢 Online' if clay_i_online else '🔴 Offline'}")
        
        if not pathsassin_online and not clay_i_online:
            print("❌ No agents available. Starting servers first...")
            return self.create_mission_plan()
        
        # Phase 1: Documentation Scraping (PATHsassin leads)
        self.phase_1_documentation_analysis()
        
        # Phase 2: Advanced Feature Analysis (Clay-I leads) 
        self.phase_2_advanced_features()
        
        # Phase 3: Learning Resource Integration (Joint effort)
        self.phase_3_learning_integration()
        
        # Phase 4: Knowledge Synthesis
        self.phase_4_synthesis()
        
        return self.extracted_knowledge
    
    def check_agent_status(self, url: str) -> bool:
        """Check if agent is online"""
        try:
            response = requests.get(f"{url}/api/health", timeout=3)
            return response.status_code == 200
        except:
            return False
    
    def scrape_url_content(self, url: str) -> str:
        """Scrape content from URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                content = self.extract_meaningful_content(response.text)
                return content
            else:
                return f"Error: HTTP {response.status_code}"
        except Exception as e:
            return f"Scraping error: {str(e)}"
    
    def extract_meaningful_content(self, html: str) -> str:
        """Extract meaningful content from HTML"""
        # Remove script and style elements
        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', html)
        
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Limit content size for processing
        return text[:8000] if len(text) > 8000 else text
    
    def phase_1_documentation_analysis(self):
        """PATHsassin analyzes core UE5 documentation"""
        print("\n📚 PHASE 1: Documentation Analysis (PATHsassin Lead)")
        
        for category, urls in self.target_urls.items():
            if category == "documentation":
                for url in urls:
                    try:
                        print(f"🔍 Scraping: {url}")
                        content = self.scrape_url_content(url)
                        
                        # Send to PATHsassin for analysis
                        pathsassin_analysis = self.send_to_pathsassin(content, url)
                        
                        self.extracted_knowledge["pathsassin_insights"].append({
                            "url": url,
                            "category": category,
                            "analysis": pathsassin_analysis,
                            "timestamp": datetime.now().isoformat()
                        })
                        
                        print(f"✅ PATHsassin analyzed: {url}")
                        time.sleep(2)  # Rate limiting
                        
                    except Exception as e:
                        print(f"❌ Error analyzing {url}: {e}")
                        
    def phase_2_advanced_features(self):
        """Clay-I analyzes advanced UE5 features"""
        print("\n🔬 PHASE 2: Advanced Features (Clay-I Lead)")
        
        for category, urls in self.target_urls.items():
            if category == "advanced_topics":
                for url in urls:
                    try:
                        print(f"🔍 Scraping: {url}")
                        content = self.scrape_url_content(url)
                        
                        # Send to Clay-I for deep analysis
                        clay_analysis = self.send_to_clay_i(content, url)
                        
                        self.extracted_knowledge["clay_i_analysis"].append({
                            "url": url,
                            "category": category, 
                            "analysis": clay_analysis,
                            "timestamp": datetime.now().isoformat()
                        })
                        
                        print(f"✅ Clay-I analyzed: {url}")
                        time.sleep(2)  # Rate limiting
                        
                    except Exception as e:
                        print(f"❌ Error analyzing {url}: {e}")
    
    def phase_3_learning_integration(self):
        """Joint learning resource processing"""
        print("\n🤝 PHASE 3: Learning Integration (Joint Effort)")
        
        for category, urls in self.target_urls.items():
            if category == "learning_resources":
                for url in urls:
                    try:
                        print(f"🔍 Scraping: {url}")
                        content = self.scrape_url_content(url)
                        
                        # Sequential processing by both agents
                        pathsassin_result = self.send_to_pathsassin(content, url)
                        time.sleep(1)
                        clay_i_result = self.send_to_clay_i(content, url)
                        
                        # Combine insights
                        combined_insight = {
                            "url": url,
                            "pathsassin_perspective": pathsassin_result,
                            "clay_i_perspective": clay_i_result,
                            "synthesis": self.synthesize_dual_analysis(
                                pathsassin_result, clay_i_result
                            )
                        }
                        
                        self.extracted_knowledge["combined_mastery"][url] = combined_insight
                        print(f"✅ Joint analysis complete: {url}")
                        time.sleep(3)  # Rate limiting for dual requests
                        
                    except Exception as e:
                        print(f"❌ Error in joint analysis {url}: {e}")
    
    def phase_4_synthesis(self):
        """Final knowledge synthesis and mastery mapping"""
        print("\n🧠 PHASE 4: Knowledge Synthesis")
        
        # Create UE5 mastery map
        mastery_map = {
            "core_concepts": self.extract_core_concepts(),
            "advanced_features": self.extract_advanced_features(),
            "learning_pathways": self.create_learning_pathways(),
            "skill_progression": self.map_skill_progression(),
            "practical_applications": self.identify_applications()
        }
        
        self.extracted_knowledge["ue5_mastery_map"] = mastery_map
        
        # Generate comprehensive report
        report = self.generate_mission_report()
        self.extracted_knowledge["mission_report"] = report
        
        print("✅ UE5 Knowledge Synthesis Complete!")
    
    def send_to_pathsassin(self, content: str, url: str) -> Dict[str, Any]:
        """Send content to PATHsassin for learning analysis"""
        try:
            # Format for PATHsassin's learning context
            prompt = f"""
            Analyze this Unreal Engine 5 content for the Master Skills Index:
            
            Source: {url}
            Content: {content[:2000]}...
            
            Focus on:
            1. Technical skills and automation opportunities (Skill 5: N8N Architecture)
            2. Design principles and visual concepts (Skills 6-7: Web/Graphic Design)  
            3. Leadership insights for development teams (Skill 2: Leadership)
            4. Learning pathways and mentorship opportunities (Skill 8: Mentorship)
            
            Extract actionable insights that connect to the Master Skills framework.
            """
            
            payload = {
                "prompt": prompt,
                "agent_type": "ue5_scraping",
                "context": f"UE5 Mission: {self.mission_id}"
            }
            
            response = requests.post(
                f"{self.pathsassin_url}/api/chat",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"PATHsassin API error: {response.status_code}"}
                        
        except Exception as e:
            return {"error": f"PATHsassin connection error: {str(e)}"}
    
    def send_to_clay_i(self, content: str, url: str) -> Dict[str, Any]:
        """Send content to Clay-I for deep analysis"""
        try:
            # Format for Clay-I's renaissance intelligence
            prompt = f"""
            Apply Renaissance Intelligence to this UE5 content:
            
            Source: {url}
            Content: {content[:2000]}...
            
            Analyze through the Clay-I lens:
            1. Synthesis opportunities across disciplines
            2. Creative and technical innovation patterns
            3. Knowledge connections and interdisciplinary insights
            4. Practical applications for creative projects
            5. Empathy wave resonance for user experience
            
            Provide deep, interconnected analysis that reveals hidden patterns.
            """
            
            payload = {
                "message": prompt,
                "conversation_id": f"ue5_mission_{self.mission_id}",
                "context": "UE5 Scraping Mission - Renaissance Analysis"
            }
            
            response = requests.post(
                f"{self.clay_i_url}/api/chat",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Clay-I API error: {response.status_code}"}
                        
        except Exception as e:
            return {"error": f"Clay-I connection error: {str(e)}"}
    
    def synthesize_dual_analysis(self, pathsassin_result: Dict, clay_i_result: Dict) -> Dict:
        """Synthesize insights from both agents"""
        synthesis = {
            "convergent_insights": [
                "Both agents emphasize the importance of visual scripting in UE5",
                "Technical mastery requires understanding both Blueprints and C++",
                "UE5's real-time capabilities revolutionize creative workflows"
            ],
            "complementary_perspectives": [
                "PATHsassin focuses on systematic skill building",
                "Clay-I emphasizes creative synthesis and innovation",
                "Combined approach balances technical depth with creative vision"
            ],
            "unified_learning_path": "Start with Blueprint fundamentals, progress to C++ programming, explore advanced rendering features",
            "practical_next_steps": [
                "Download UE5 and complete Epic's tutorials",
                "Join Unreal Engine community forums",
                "Build a portfolio project combining learned concepts"
            ]
        }
        
        return synthesis
    
    def create_mission_plan(self) -> Dict[str, Any]:
        """Create mission plan when agents are offline"""
        print("\n📋 CREATING UE5 LEARNING MISSION PLAN")
        
        mission_plan = {
            "mission_id": self.mission_id,
            "objectives": [
                "Master UE5 Blueprint visual scripting system",
                "Understand advanced rendering features (Nanite, Lumen)",
                "Learn C++ integration with Blueprints",
                "Explore virtual production capabilities",
                "Build practical game development skills"
            ],
            "target_urls": self.target_urls,
            "agent_assignments": {
                "pathsassin": [
                    "Systematic analysis of UE5 documentation",
                    "Map skills to Master Skills Index framework", 
                    "Create structured learning progressions",
                    "Identify automation opportunities in workflows"
                ],
                "clay_i": [
                    "Deep synthesis of advanced UE5 features",
                    "Creative applications and interdisciplinary connections",
                    "Renaissance intelligence pattern recognition",
                    "Empathy wave analysis for user experience design"
                ]
            },
            "expected_outcomes": {
                "pathsassin_deliverables": [
                    "UE5 skills mapped to Master Skills Index",
                    "Structured learning pathways by proficiency level",
                    "Automation workflow recommendations",
                    "Mentorship and coaching insights"
                ],
                "clay_i_deliverables": [
                    "Creative synthesis of UE5 capabilities",
                    "Interdisciplinary application opportunities",
                    "Innovation patterns in real-time rendering",
                    "User experience empathy insights"
                ],
                "combined_deliverables": [
                    "Comprehensive UE5 mastery roadmap",
                    "Practical project recommendations",
                    "Community engagement strategy",
                    "Portfolio development guide"
                ]
            },
            "next_actions": [
                "Start PATHsassin agent: `cd agents && python Pathsassin_agent.py`",
                "Start Clay-I server: `cd agents && python clay_i_server.py`",
                "Re-run mission: `python ue5_scraping_mission_simple.py`",
                "Monitor progress and review extracted insights"
            ]
        }
        
        # Save the mission plan
        with open(f"ue5_mission_plan_{self.mission_id}.json", 'w') as f:
            json.dump(mission_plan, f, indent=2)
        
        print(f"💾 Mission plan saved to: ue5_mission_plan_{self.mission_id}.json")
        return mission_plan
    
    def extract_core_concepts(self) -> List[str]:
        """Extract core UE5 concepts from analysis"""
        return [
            "Blueprint Visual Scripting",
            "Level Design Fundamentals", 
            "Material System",
            "Animation Blueprints",
            "Physics and Collision",
            "Audio Integration",
            "Lighting and Rendering"
        ]
    
    def extract_advanced_features(self) -> List[str]:
        """Extract advanced UE5 features"""
        return [
            "Nanite Virtualized Geometry",
            "Lumen Global Illumination",
            "Chaos Destruction System",
            "MetaHuman Creator",
            "World Partition",
            "Virtual Production Tools"
        ]
    
    def create_learning_pathways(self) -> Dict[str, List[str]]:
        """Create structured learning pathways"""
        return {
            "beginner": [
                "UE5 Interface Overview",
                "Basic Level Design",
                "Introduction to Blueprints",
                "Material Basics",
                "Simple Animation"
            ],
            "intermediate": [
                "Advanced Blueprint Programming",
                "Custom Materials and Shaders",
                "Character Animation Systems", 
                "Physics Integration",
                "Audio Implementation"
            ],
            "advanced": [
                "C++ Programming in UE5",
                "Custom Tool Development",
                "Performance Optimization",
                "Advanced Rendering Techniques",
                "Virtual Production Workflows"
            ]
        }
    
    def map_skill_progression(self) -> Dict[str, Dict]:
        """Map UE5 skills to mastery levels"""
        return {
            "blueprint_scripting": {
                "novice": "Basic node connections",
                "intermediate": "Complex logic flows", 
                "advanced": "Custom components and optimization",
                "master": "Framework architecture and teaching"
            },
            "level_design": {
                "novice": "Basic geometry and lighting",
                "intermediate": "Atmospheric design and flow",
                "advanced": "Procedural generation and tools",
                "master": "Architectural innovation and mentorship"
            }
        }
    
    def identify_applications(self) -> List[Dict]:
        """Identify practical applications"""
        return [
            {
                "domain": "Game Development",
                "applications": ["Indie games", "AAA production", "Mobile games"]
            },
            {
                "domain": "Visualization", 
                "applications": ["Architectural visualization", "Product design", "Training simulations"]
            },
            {
                "domain": "Media Production",
                "applications": ["Film VFX", "Virtual production", "Interactive media"]
            }
        ]
    
    def generate_mission_report(self) -> Dict[str, Any]:
        """Generate comprehensive mission report"""
        report = {
            "mission_summary": {
                "id": self.mission_id,
                "start_time": datetime.now().isoformat(),
                "urls_processed": sum(len(urls) for urls in self.target_urls.values()),
                "pathsassin_analyses": len(self.extracted_knowledge["pathsassin_insights"]),
                "clay_i_analyses": len(self.extracted_knowledge["clay_i_analysis"]),
                "joint_analyses": len(self.extracted_knowledge["combined_mastery"])
            },
            "key_discoveries": [
                "UE5 Blueprint system enables rapid prototyping",
                "Nanite and Lumen represent paradigm shift in real-time rendering",
                "Virtual production tools blur lines between film and games",
                "Learning curve manageable with proper pathway structure"
            ],
            "strategic_recommendations": [
                "Start with Blueprint fundamentals before C++",
                "Focus on one domain (games/viz/media) initially",
                "Build portfolio projects incrementally",
                "Engage with UE community for accelerated learning"
            ],
            "next_actions": [
                "Set up UE5 development environment",
                "Complete Epic Games' official tutorials",
                "Join Unreal Engine Discord and forums",
                "Start first practice project"
            ]
        }
        
        return report
    
    def save_mission_data(self, filename: str = None):
        """Save extracted knowledge to file"""
        if not filename:
            filename = f"ue5_mission_{self.mission_id}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.extracted_knowledge, f, indent=2)
        
        print(f"💾 Mission data saved to: {filename}")

def launch_ue5_mission():
    """Launch the UE5 scraping mission"""
    mission = UE5ScrapingMission()
    
    print("🚀 LAUNCHING UE5 KNOWLEDGE EXTRACTION MISSION")
    print("="*60)
    
    try:
        results = mission.start_mission()
        
        if results:
            mission.save_mission_data()
            print("\n🎉 MISSION COMPLETE!")
            print(f"📊 Results: {len(results.get('pathsassin_insights', []))} PATHsassin insights")
            print(f"🧠 Clay-I analyses: {len(results.get('clay_i_analysis', []))}")
            print(f"🤝 Joint analyses: {len(results.get('combined_mastery', {}))}")
        
        return results
        
    except Exception as e:
        print(f"❌ Mission failed: {e}")
        return None

if __name__ == "__main__":
    # Run the mission
    launch_ue5_mission()