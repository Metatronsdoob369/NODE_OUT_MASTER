#!/usr/bin/env python3
"""
VoiceResponder Sub-Agent
Handles incoming voice calls, triages urgency, and extracts key damage information
"""

import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class CallTriage:
    urgency_level: str  # "low", "medium", "high", "emergency"
    damage_type: str
    location: str
    customer_info: Dict[str, Any]
    summary: str
    next_action: str
    timestamp: datetime

class VoiceResponder:
    """
    Sub-agent for handling voice calls and extracting damage information
    """
    
    def __init__(self):
        self.setup_logging()
        self.urgency_keywords = {
            "emergency": ["flooding", "collapse", "electrical", "gas leak", "structural damage"],
            "high": ["active leak", "water damage", "major damage", "urgent"],
            "medium": ["roof damage", "window broken", "moderate damage"],
            "low": ["minor damage", "cosmetic", "small crack", "inspection needed"]
        }
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('VoiceResponder')
        
    async def process_voice_call(self, call_data: Dict[str, Any]) -> CallTriage:
        """
        Process incoming voice call and extract key information
        """
        try:
            # Extract basic call information
            caller_info = call_data.get("caller_info", {})
            transcript = call_data.get("audio_transcript", "")
            call_metadata = call_data.get("metadata", {})
            
            # Analyze transcript for damage type and urgency
            damage_analysis = self._analyze_damage_description(transcript)
            urgency = self._assess_urgency(transcript)
            location = self._extract_location(transcript, caller_info)
            
            # Generate summary and next action
            summary = self._generate_summary(transcript, damage_analysis, urgency)
            next_action = self._determine_next_action(urgency, damage_analysis)
            
            triage_result = CallTriage(
                urgency_level=urgency,
                damage_type=damage_analysis["type"],
                location=location,
                customer_info=caller_info,
                summary=summary,
                next_action=next_action,
                timestamp=datetime.now()
            )
            
            self.logger.info(f"Call processed: {urgency} urgency, {damage_analysis['type']} damage")
            return triage_result
            
        except Exception as e:
            self.logger.error(f"Error processing voice call: {e}")
            raise
            
    def _analyze_damage_description(self, transcript: str) -> Dict[str, Any]:
        """Analyze transcript to identify damage type and severity"""
        transcript_lower = transcript.lower()
        
        damage_types = {
            "roof_leak": ["roof", "leak", "water coming in", "dripping", "ceiling"],
            "roof_damage": ["shingles", "roof damage", "tiles missing", "roof torn"],
            "window_damage": ["window", "glass", "broken window"],
            "siding_damage": ["siding", "exterior wall", "wall damage"],
            "flooding": ["flood", "water everywhere", "basement flooded"],
            "structural": ["wall crack", "foundation", "structural", "collapse"],
            "electrical": ["power", "electrical", "wires", "no electricity"],
            "general": ["damage", "storm damage", "need inspection"]
        }
        
        severity_indicators = {
            "severe": ["major", "severe", "extensive", "emergency", "urgent"],
            "moderate": ["moderate", "significant", "noticeable"],
            "minor": ["minor", "small", "little", "slight"]
        }
        
        detected_type = "general"
        for damage_type, keywords in damage_types.items():
            if any(keyword in transcript_lower for keyword in keywords):
                detected_type = damage_type
                break
                
        detected_severity = "moderate"
        for severity, keywords in severity_indicators.items():
            if any(keyword in transcript_lower for keyword in keywords):
                detected_severity = severity
                break
                
        return {
            "type": detected_type,
            "severity": detected_severity,
            "confidence": 0.8  # Mock confidence score
        }
        
    def _assess_urgency(self, transcript: str) -> str:
        """Assess urgency level based on transcript content"""
        transcript_lower = transcript.lower()
        
        for urgency_level, keywords in self.urgency_keywords.items():
            if any(keyword in transcript_lower for keyword in keywords):
                return urgency_level
                
        return "medium"  # Default urgency
        
    def _extract_location(self, transcript: str, caller_info: Dict[str, Any]) -> str:
        """Extract location information from transcript and caller data"""
        # Try to extract from caller info first
        location = caller_info.get("address", "")
        
        if not location:
            # Try to extract from transcript
            transcript_lower = transcript.lower()
            location_indicators = ["at", "located", "address", "on", "street"]
            
            # Simple location extraction logic
            words = transcript_lower.split()
            for i, word in enumerate(words):
                if word in location_indicators and i + 1 < len(words):
                    # Take next few words as potential location
                    location = " ".join(words[i+1:i+4])
                    break
                    
        return location or "Location not specified"
        
    def _generate_summary(self, transcript: str, damage_analysis: Dict[str, Any], urgency: str) -> str:
        """Generate a concise summary of the call"""
        damage_type = damage_analysis["type"].replace("_", " ")
        severity = damage_analysis["severity"]
        
        summary = f"Customer reports {severity} {damage_type}"
        
        if urgency in ["high", "emergency"]:
            summary += f" with {urgency} priority"
            
        # Add key details from transcript
        if len(transcript) > 100:
            summary += f". Key details: {transcript[:100]}..."
        else:
            summary += f". Details: {transcript}"
            
        return summary
        
    def _determine_next_action(self, urgency: str, damage_analysis: Dict[str, Any]) -> str:
        """Determine the next action based on urgency and damage type"""
        if urgency == "emergency":
            return "Dispatch emergency crew immediately"
        elif urgency == "high":
            return "Schedule same-day inspection and temporary repairs"
        elif urgency == "medium":
            return "Schedule inspection within 24-48 hours"
        else:
            return "Schedule routine inspection within 3-5 business days"
            
    def format_for_handoff(self, triage: CallTriage) -> Dict[str, Any]:
        """Format triage result for handoff to other agents"""
        return {
            "call_id": f"CALL-{triage.timestamp.strftime('%Y%m%d%H%M%S')}",
            "customer_info": triage.customer_info,
            "damage_assessment": {
                "type": triage.damage_type,
                "urgency": triage.urgency_level,
                "location": triage.location
            },
            "summary": triage.summary,
            "recommended_action": triage.next_action,
            "timestamp": triage.timestamp.isoformat(),
            "ready_for_quote": triage.urgency_level in ["medium", "high", "emergency"]
        }

async def test_voice_responder():
    """Test function for VoiceResponder agent"""
    responder = VoiceResponder()
    
    test_calls = [
        {
            "caller_info": {"name": "John Smith", "phone": "+1234567890", "address": "123 Main St"},
            "audio_transcript": "Hi, I have a major roof leak in my kitchen. Water is coming through the ceiling and dripping everywhere. This is urgent!"
        },
        {
            "caller_info": {"name": "Jane Doe", "phone": "+0987654321"},
            "audio_transcript": "Hello, I noticed some shingles are missing from my roof after the storm. It's not leaking yet but I'm worried."
        }
    ]
    
    for i, call in enumerate(test_calls):
        print(f"\n--- Processing Test Call {i+1} ---")
        triage = await responder.process_voice_call(call)
        handoff_data = responder.format_for_handoff(triage)
        
        print(f"Urgency: {triage.urgency_level}")
        print(f"Damage Type: {triage.damage_type}")
        print(f"Summary: {triage.summary}")
        print(f"Next Action: {triage.next_action}")
        print(f"Ready for Quote: {handoff_data['ready_for_quote']}")

if __name__ == "__main__":
    asyncio.run(test_voice_responder())