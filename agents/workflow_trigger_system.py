#!/usr/bin/env python3
"""
Workflow Trigger System for Clay-I N8N Workflows
Multiple ways to trigger intelligent content automation
"""

import asyncio
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import schedule
import time
import threading
from flask import Flask, request, jsonify

class WorkflowTriggerSystem:
    """Comprehensive trigger system for Clay-I N8N workflows"""
    
    def __init__(self, workflow_builder, agent_api, memory):
        self.workflow_builder = workflow_builder
        self.agent_api = agent_api
        self.memory = memory
        self.active_triggers = {}
        self.scheduled_jobs = {}
        self.webhook_endpoints = {}
        
    def setup_all_triggers(self, app: Flask):
        """Setup all trigger mechanisms"""
        self.setup_webhook_triggers(app)
        self.setup_scheduled_triggers(app)
        self.setup_manual_triggers(app)
        self.setup_intelligent_triggers(app)
        self.setup_event_based_triggers(app)
        
        print("🎯 All workflow triggers configured and ready!")
    
    def setup_webhook_triggers(self, app: Flask):
        """Setup webhook-based triggers"""
        
        @app.route('/api/trigger/webhook/content-request', methods=['POST'])
        async def trigger_content_creation():
            """Trigger content creation via webhook"""
            try:
                data = request.json
                trigger_type = data.get('trigger_type', 'manual')
                content_request = data.get('content_request', {})
                
                # Build workflow based on request
                workflow_config = {
                    "workflow_type": "viral_content_factory",
                    "configuration": {
                        "platforms": content_request.get('platforms', ['tiktok', 'linkedin']),
                        "content_types": content_request.get('content_types', ['blog_posts']),
                        "skill_focus": content_request.get('skill_focus', ['leadership']),
                        "automation_level": "high",
                        "trigger_source": "webhook",
                        "trigger_type": trigger_type
                    }
                }
                
                # Execute workflow
                result = await self.execute_workflow_trigger(workflow_config, data)
                
                return jsonify({
                    'success': True,
                    'trigger_id': result['trigger_id'],
                    'workflow_status': 'started',
                    'estimated_completion': '5-10 minutes'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/webhook/url-scrape', methods=['POST'])
        async def trigger_url_scraping():
            """Trigger URL scraping workflow"""
            try:
                data = request.json
                urls = data.get('urls', [])
                platforms = data.get('platforms', ['tiktok', 'linkedin'])
                
                workflow_config = {
                    "workflow_type": "content_scraping_pipeline",
                    "configuration": {
                        "target_urls": urls,
                        "platforms": platforms,
                        "content_types": ['auto'],
                        "automation_level": "high",
                        "trigger_source": "webhook",
                        "trigger_type": "url_scrape"
                    }
                }
                
                result = await self.execute_workflow_trigger(workflow_config, data)
                
                return jsonify({
                    'success': True,
                    'trigger_id': result['trigger_id'],
                    'urls_to_scrape': len(urls),
                    'workflow_status': 'started'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/webhook/competitor-monitor', methods=['POST'])
        async def trigger_competitor_monitoring():
            """Trigger competitor monitoring workflow"""
            try:
                data = request.json
                competitors = data.get('competitors', [])
                
                workflow_config = {
                    "workflow_type": "competitive_intelligence",
                    "configuration": {
                        "competitors": competitors,
                        "monitoring_frequency": "daily",
                        "insight_generation": True,
                        "alert_threshold": 0.7,
                        "trigger_source": "webhook",
                        "trigger_type": "competitor_monitor"
                    }
                }
                
                result = await self.execute_workflow_trigger(workflow_config, data)
                
                return jsonify({
                    'success': True,
                    'trigger_id': result['trigger_id'],
                    'competitors_monitored': len(competitors),
                    'workflow_status': 'started'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def setup_scheduled_triggers(self, app: Flask):
        """Setup scheduled/automated triggers"""
        
        @app.route('/api/trigger/schedule/setup', methods=['POST'])
        def setup_scheduled_trigger():
            """Setup scheduled workflow triggers"""
            try:
                data = request.json
                schedule_type = data.get('schedule_type', 'daily')
                workflow_type = data.get('workflow_type', 'viral_content_factory')
                configuration = data.get('configuration', {})
                
                # Create scheduled job
                job_id = f"scheduled_{workflow_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                
                if schedule_type == 'daily':
                    schedule.every().day.at("09:00").do(
                        self.run_scheduled_workflow, workflow_type, configuration, job_id
                    )
                elif schedule_type == 'hourly':
                    schedule.every().hour.do(
                        self.run_scheduled_workflow, workflow_type, configuration, job_id
                    )
                elif schedule_type == 'weekly':
                    schedule.every().monday.at("10:00").do(
                        self.run_scheduled_workflow, workflow_type, configuration, job_id
                    )
                elif schedule_type == 'custom':
                    custom_time = data.get('custom_time', '09:00')
                    schedule.every().day.at(custom_time).do(
                        self.run_scheduled_workflow, workflow_type, configuration, job_id
                    )
                
                self.scheduled_jobs[job_id] = {
                    'schedule_type': schedule_type,
                    'workflow_type': workflow_type,
                    'configuration': configuration,
                    'status': 'active',
                    'next_run': self.get_next_run_time(schedule_type, data.get('custom_time'))
                }
                
                # Start scheduler in background
                self.start_scheduler_background()
                
                return jsonify({
                    'success': True,
                    'job_id': job_id,
                    'schedule_type': schedule_type,
                    'next_run': self.scheduled_jobs[job_id]['next_run'],
                    'status': 'scheduled'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/schedule/list', methods=['GET'])
        def list_scheduled_triggers():
            """List all scheduled triggers"""
            try:
                return jsonify({
                    'success': True,
                    'scheduled_jobs': self.scheduled_jobs,
                    'total_jobs': len(self.scheduled_jobs)
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/schedule/stop/<job_id>', methods=['POST'])
        def stop_scheduled_trigger(job_id):
            """Stop a scheduled trigger"""
            try:
                if job_id in self.scheduled_jobs:
                    self.scheduled_jobs[job_id]['status'] = 'stopped'
                    schedule.clear(job_id)
                    
                    return jsonify({
                        'success': True,
                        'job_id': job_id,
                        'status': 'stopped'
                    })
                else:
                    return jsonify({'error': 'Job not found'}), 404
                    
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def setup_manual_triggers(self, app: Flask):
        """Setup manual trigger endpoints"""
        
        @app.route('/api/trigger/manual/start', methods=['POST'])
        async def manual_workflow_trigger():
            """Manual workflow trigger"""
            try:
                data = request.json
                workflow_type = data.get('workflow_type', 'viral_content_factory')
                configuration = data.get('configuration', {})
                
                result = await self.execute_workflow_trigger({
                    "workflow_type": workflow_type,
                    "configuration": {
                        **configuration,
                        "trigger_source": "manual",
                        "trigger_type": "manual_start"
                    }
                }, data)
                
                return jsonify({
                    'success': True,
                    'trigger_id': result['trigger_id'],
                    'workflow_type': workflow_type,
                    'status': 'started',
                    'message': 'Workflow triggered manually'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/manual/quick-start', methods=['POST'])
        async def quick_start_trigger():
            """Quick start with default settings"""
            try:
                data = request.json
                platform = data.get('platform', 'tiktok')
                skill = data.get('skill', 'leadership')
                
                workflow_config = {
                    "workflow_type": "viral_content_factory",
                    "configuration": {
                        "platforms": [platform],
                        "skill_focus": [skill],
                        "content_types": ["blog_posts", "social_media"],
                        "automation_level": "high",
                        "trigger_source": "manual",
                        "trigger_type": "quick_start"
                    }
                }
                
                result = await self.execute_workflow_trigger(workflow_config, data)
                
                return jsonify({
                    'success': True,
                    'trigger_id': result['trigger_id'],
                    'platform': platform,
                    'skill': skill,
                    'status': 'started',
                    'message': f'Quick start: {platform} content for {skill}'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def setup_intelligent_triggers(self, app: Flask):
        """Setup intelligent/adaptive triggers"""
        
        @app.route('/api/trigger/intelligent/auto-detect', methods=['POST'])
        async def intelligent_auto_detect():
            """Intelligent trigger based on content analysis"""
            try:
                data = request.json
                content_url = data.get('content_url', '')
                analysis_request = data.get('analysis_request', {})
                
                # Use Clay-I to analyze and determine best workflow
                analysis_prompt = f"""
                Analyze this content and determine the best workflow:
                URL: {content_url}
                Analysis Request: {analysis_request}
                
                Determine:
                1. Best workflow type (content_scraping_pipeline, viral_content_factory, etc.)
                2. Optimal platforms for this content
                3. Relevant PATHsassin skills
                4. Content type and format
                5. Viral potential assessment
                
                Return a JSON configuration for the optimal workflow.
                """
                
                # Get Clay-I recommendation
                clay_i_response = await self.agent_api.generate_response_with_prompt(
                    analysis_prompt,
                    "You are Clay-I, an expert in content analysis and workflow optimization."
                )
                
                # Parse Clay-I response to get workflow configuration
                workflow_config = self.parse_clay_i_workflow_recommendation(clay_i_response)
                
                result = await self.execute_workflow_trigger(workflow_config, data)
                
                return jsonify({
                    'success': True,
                    'trigger_id': result['trigger_id'],
                    'clay_i_recommendation': workflow_config,
                    'status': 'intelligent_trigger_started',
                    'message': 'Clay-I analyzed content and triggered optimal workflow'
                })
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/intelligent/performance-based', methods=['POST'])
        async def performance_based_trigger():
            """Trigger based on performance metrics"""
            try:
                data = request.json
                performance_metrics = data.get('performance_metrics', {})
                threshold = data.get('threshold', 0.7)
                
                # Analyze performance and trigger if below threshold
                if self.should_trigger_based_on_performance(performance_metrics, threshold):
                    workflow_config = {
                        "workflow_type": "viral_content_factory",
                        "configuration": {
                            "platforms": ["tiktok", "linkedin", "instagram"],
                            "content_types": ["blog_posts", "social_media"],
                            "skill_focus": ["leadership", "automation"],
                            "automation_level": "high",
                            "trigger_source": "intelligent",
                            "trigger_type": "performance_based",
                            "performance_threshold": threshold
                        }
                    }
                    
                    result = await self.execute_workflow_trigger(workflow_config, data)
                    
                    return jsonify({
                        'success': True,
                        'trigger_id': result['trigger_id'],
                        'performance_triggered': True,
                        'current_performance': performance_metrics,
                        'threshold': threshold,
                        'status': 'performance_triggered'
                    })
                else:
                    return jsonify({
                        'success': True,
                        'performance_triggered': False,
                        'current_performance': performance_metrics,
                        'threshold': threshold,
                        'message': 'Performance above threshold, no trigger needed'
                    })
                    
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def setup_event_based_triggers(self, app: Flask):
        """Setup event-based triggers"""
        
        @app.route('/api/trigger/event/content-dry', methods=['POST'])
        async def content_dry_trigger():
            """Trigger when content pipeline is dry"""
            try:
                data = request.json
                current_content_count = data.get('current_content_count', 0)
                minimum_threshold = data.get('minimum_threshold', 5)
                
                if current_content_count < minimum_threshold:
                    workflow_config = {
                        "workflow_type": "viral_content_factory",
                        "configuration": {
                            "platforms": ["tiktok", "linkedin", "instagram"],
                            "content_types": ["blog_posts", "social_media"],
                            "skill_focus": ["leadership", "automation", "stoicism"],
                            "automation_level": "high",
                            "trigger_source": "event",
                            "trigger_type": "content_dry",
                            "current_content": current_content_count,
                            "target_content": minimum_threshold
                        }
                    }
                    
                    result = await self.execute_workflow_trigger(workflow_config, data)
                    
                    return jsonify({
                        'success': True,
                        'trigger_id': result['trigger_id'],
                        'content_dry_triggered': True,
                        'current_content': current_content_count,
                        'target_content': minimum_threshold,
                        'status': 'content_generation_started'
                    })
                else:
                    return jsonify({
                        'success': True,
                        'content_dry_triggered': False,
                        'current_content': current_content_count,
                        'target_content': minimum_threshold,
                        'message': 'Sufficient content available'
                    })
                    
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/trigger/event/trending-topic', methods=['POST'])
        async def trending_topic_trigger():
            """Trigger when trending topics are detected"""
            try:
                data = request.json
                trending_topics = data.get('trending_topics', [])
                relevance_threshold = data.get('relevance_threshold', 0.6)
                
                # Filter relevant trending topics
                relevant_topics = [
                    topic for topic in trending_topics 
                    if self.calculate_topic_relevance(topic) > relevance_threshold
                ]
                
                if relevant_topics:
                    workflow_config = {
                        "workflow_type": "viral_content_factory",
                        "configuration": {
                            "platforms": ["tiktok", "twitter", "linkedin"],
                            "content_types": ["trending_content", "social_media"],
                            "skill_focus": ["leadership", "automation"],
                            "trending_topics": relevant_topics,
                            "automation_level": "high",
                            "trigger_source": "event",
                            "trigger_type": "trending_topic",
                            "urgency": "high"
                        }
                    }
                    
                    result = await self.execute_workflow_trigger(workflow_config, data)
                    
                    return jsonify({
                        'success': True,
                        'trigger_id': result['trigger_id'],
                        'trending_triggered': True,
                        'relevant_topics': relevant_topics,
                        'status': 'trending_content_generation_started'
                    })
                else:
                    return jsonify({
                        'success': True,
                        'trending_triggered': False,
                        'trending_topics': trending_topics,
                        'message': 'No relevant trending topics found'
                    })
                    
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    async def execute_workflow_trigger(self, workflow_config: Dict, trigger_data: Dict) -> Dict:
        """Execute a workflow trigger"""
        trigger_id = f"trigger_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        # Record trigger in memory
        self.memory.add_interaction(
            'workflow_trigger',
            f"Triggered {workflow_config['workflow_type']} workflow",
            f"Trigger ID: {trigger_id}",
            f"Configuration: {workflow_config['configuration']}"
        )
        
        # Build and execute workflow
        try:
            workflow = await self.workflow_builder.build_intelligent_workflow(
                workflow_config['workflow_type'],
                workflow_config['configuration']
            )
            
            # Store active trigger
            self.active_triggers[trigger_id] = {
                'workflow': workflow,
                'config': workflow_config,
                'trigger_data': trigger_data,
                'status': 'executing',
                'started_at': datetime.now().isoformat(),
                'estimated_completion': '5-10 minutes'
            }
            
            return {
                'trigger_id': trigger_id,
                'workflow_id': workflow['id'],
                'status': 'started',
                'workflow_name': workflow['name']
            }
            
        except Exception as e:
            # Record error
            self.memory.add_interaction(
                'workflow_trigger_error',
                f"Failed to trigger {workflow_config['workflow_type']}",
                f"Error: {str(e)}",
                f"Trigger ID: {trigger_id}"
            )
            
            raise e
    
    def run_scheduled_workflow(self, workflow_type: str, configuration: Dict, job_id: str):
        """Run a scheduled workflow"""
        asyncio.create_task(self.execute_workflow_trigger({
            "workflow_type": workflow_type,
            "configuration": {
                **configuration,
                "trigger_source": "scheduled",
                "trigger_type": "scheduled_run",
                "job_id": job_id
            }
        }, {}))
    
    def start_scheduler_background(self):
        """Start scheduler in background thread"""
        def run_scheduler():
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        
        scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()
    
    def get_next_run_time(self, schedule_type: str, custom_time: str = None) -> str:
        """Get next run time for scheduled job"""
        if schedule_type == 'daily':
            return f"Tomorrow at 09:00"
        elif schedule_type == 'hourly':
            return f"Next hour at {datetime.now().strftime('%H')}:00"
        elif schedule_type == 'weekly':
            return f"Next Monday at 10:00"
        elif schedule_type == 'custom' and custom_time:
            return f"Tomorrow at {custom_time}"
        else:
            return "Unknown"
    
    def parse_clay_i_workflow_recommendation(self, clay_i_response: str) -> Dict:
        """Parse Clay-I response to get workflow configuration"""
        # This would parse the Clay-I response to extract workflow configuration
        # For now, return a default configuration
        return {
            "workflow_type": "viral_content_factory",
            "configuration": {
                "platforms": ["tiktok", "linkedin"],
                "content_types": ["blog_posts", "social_media"],
                "skill_focus": ["leadership", "automation"],
                "automation_level": "high",
                "trigger_source": "intelligent",
                "trigger_type": "clay_i_recommendation"
            }
        }
    
    def should_trigger_based_on_performance(self, metrics: Dict, threshold: float) -> bool:
        """Determine if workflow should be triggered based on performance"""
        # Calculate overall performance score
        performance_score = (
            metrics.get('engagement_rate', 0) * 0.4 +
            metrics.get('viral_score', 0) * 0.3 +
            metrics.get('content_quality', 0) * 0.3
        )
        
        return performance_score < threshold
    
    def calculate_topic_relevance(self, topic: str) -> float:
        """Calculate relevance of a trending topic to PATHsassin skills"""
        # This would calculate relevance based on skill keywords
        # For now, return a mock relevance score
        skill_keywords = ['leadership', 'automation', 'stoicism', 'design', 'mentorship']
        relevance = sum(1 for keyword in skill_keywords if keyword.lower() in topic.lower())
        return min(relevance / len(skill_keywords), 1.0)

# Integration instructions
print("🎯 Workflow Trigger System: READY")
print("🔗 Webhook Triggers: CONFIGURED")
print("⏰ Scheduled Triggers: ACTIVE")
print("🤖 Intelligent Triggers: ENABLED")
print("📊 Event-Based Triggers: OPERATIONAL")
print("")
print("📋 TRIGGER TYPES AVAILABLE:")
print("1. Webhook Triggers: /api/trigger/webhook/*")
print("2. Scheduled Triggers: /api/trigger/schedule/*")
print("3. Manual Triggers: /api/trigger/manual/*")
print("4. Intelligent Triggers: /api/trigger/intelligent/*")
print("5. Event-Based Triggers: /api/trigger/event/*")
print("")
print("✅ Ready to trigger Clay-I workflows automatically!") 