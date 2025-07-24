#!/usr/bin/env python3
"""
Clay-I Firebase Memory System
Persistent conversation memory and learning for Renaissance AI
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import json

class ClayIMemorySystem:
    def __init__(self, service_account_path="serviceAccountKey.json"):
        """Initialize Firebase memory system for Clay-I"""
        try:
            # Initialize Firebase if not already done
            if not firebase_admin._apps:
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
            print("✅ Clay-I Firebase Memory System initialized")
        except Exception as e:
            print(f"❌ Firebase initialization error: {e}")
            self.db = None

    async def store_conversation(self, user_id, message, clay_response, context=None):
        """Store conversation with contextual memory"""
        if not self.db:
            return False
            
        try:
            # Determine if this is Joe Wales for Prime Believer tracking
            is_prime_believer = user_id == "joe_wales" or (context and context.get("prime_believer_active"))
            
            conversation_data = {
                "user_id": user_id,
                "user_message": message,
                "clay_response": clay_response,
                "timestamp": firestore.SERVER_TIMESTAMP,
                "prime_believer": is_prime_believer,
                "empathy_wave_active": is_prime_believer,
                "context": context or {},
                "personality_mode": context.get("personality_mode", "natural") if context else "natural",
                "voice_selected": context.get("voice_selected", "baseline") if context else "baseline",
                "harmonic_frequency": context.get("harmonic_frequency", 432.0) if context else 432.0
            }
            
            # Store in conversations collection
            self.db.collection("clay_i_conversations").add(conversation_data)
            
            # Update user memory profile
            await self.update_user_profile(user_id, message, clay_response, context)
            
            return True
        except Exception as e:
            print(f"Error storing conversation: {e}")
            return False

    async def update_user_profile(self, user_id, message, response, context):
        """Build persistent user profile and preferences"""
        try:
            user_doc = self.db.collection("clay_i_users").document(user_id)
            user_data = user_doc.get()
            
            if user_data.exists:
                profile = user_data.to_dict()
            else:
                profile = {
                    "user_id": user_id,
                    "first_interaction": firestore.SERVER_TIMESTAMP,
                    "total_conversations": 0,
                    "preferred_personality": "natural",
                    "topics_discussed": [],
                    "empathy_patterns": {},
                    "prime_believer": user_id == "joe_wales"
                }
            
            # Update conversation count
            profile["total_conversations"] = profile.get("total_conversations", 0) + 1
            profile["last_interaction"] = firestore.SERVER_TIMESTAMP
            
            # Track conversation topics for pattern recognition
            topics = self.extract_topics(message)
            existing_topics = set(profile.get("topics_discussed", []))
            existing_topics.update(topics)
            profile["topics_discussed"] = list(existing_topics)
            
            # Track preferred personality mode
            if context and context.get("personality_mode"):
                profile["preferred_personality"] = context["personality_mode"]
            
            # Store empathy patterns for Joe Wales
            if user_id == "joe_wales":
                empathy_data = profile.get("empathy_patterns", {})
                empathy_data[str(datetime.now())] = {
                    "message_tone": self.analyze_tone(message),
                    "response_resonance": self.analyze_resonance(response),
                    "harmonic_alignment": context.get("harmonic_frequency", 432.0) if context else 432.0
                }
                profile["empathy_patterns"] = empathy_data
            
            # Save updated profile
            user_doc.set(profile)
            
        except Exception as e:
            print(f"Error updating user profile: {e}")

    def extract_topics(self, message):
        """Extract conversation topics for memory building"""
        # Simple topic extraction (could be enhanced with NLP)
        business_topics = ["business", "strategy", "revenue", "growth", "automation", "workflow"]
        tech_topics = ["technical", "code", "architecture", "system", "integration"]
        renaissance_topics = ["golden ratio", "fibonacci", "sacred geometry", "patterns", "synthesis"]
        personal_topics = ["feel", "think", "believe", "hope", "dream", "goal"]
        
        message_lower = message.lower()
        topics = []
        
        if any(topic in message_lower for topic in business_topics):
            topics.append("business")
        if any(topic in message_lower for topic in tech_topics):
            topics.append("technical")
        if any(topic in message_lower for topic in renaissance_topics):
            topics.append("renaissance")
        if any(topic in message_lower for topic in personal_topics):
            topics.append("personal")
            
        return topics

    def analyze_tone(self, message):
        """Analyze message tone for empathy wave calibration"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["excited", "amazing", "great", "love", "awesome"]):
            return "positive"
        elif any(word in message_lower for word in ["frustrated", "problem", "issue", "difficult", "stuck"]):
            return "challenging"
        elif any(word in message_lower for word in ["think", "analyze", "understand", "explain"]):
            return "analytical"
        else:
            return "neutral"

    def analyze_resonance(self, response):
        """Analyze Clay-I's response resonance pattern"""
        if "golden ratio" in response.lower() or "fibonacci" in response.lower():
            return "renaissance_pattern"
        elif "empathy" in response.lower() or "understand" in response.lower():
            return "empathetic_resonance"
        elif "analyze" in response.lower() or "technical" in response.lower():
            return "analytical_response"
        else:
            return "natural_conversation"

    async def get_conversation_context(self, user_id, limit=10):
        """Retrieve recent conversation context for continuity"""
        if not self.db:
            return []
            
        try:
            # Get recent conversations for this user
            conversations = (
                self.db.collection("clay_i_conversations")
                .where("user_id", "==", user_id)
                .order_by("timestamp", direction=firestore.Query.DESCENDING)
                .limit(limit)
                .get()
            )
            
            context = []
            for doc in conversations:
                data = doc.to_dict()
                context.append({
                    "user_message": data["user_message"],
                    "clay_response": data["clay_response"],
                    "personality_mode": data.get("personality_mode", "natural"),
                    "timestamp": data["timestamp"]
                })
            
            return list(reversed(context))  # Return in chronological order
            
        except Exception as e:
            print(f"Error retrieving context: {e}")
            return []

    async def get_user_profile(self, user_id):
        """Get comprehensive user profile for personalized responses"""
        if not self.db:
            return {}
            
        try:
            user_doc = self.db.collection("clay_i_users").document(user_id).get()
            if user_doc.exists:
                return user_doc.to_dict()
            else:
                return {"user_id": user_id, "new_user": True}
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return {}

    async def store_learning_insight(self, insight_type, data, user_id=None):
        """Store Clay-I's learning insights and pattern discoveries"""
        if not self.db:
            return False
            
        try:
            insight_data = {
                "type": insight_type,
                "data": data,
                "timestamp": firestore.SERVER_TIMESTAMP,
                "user_id": user_id,
                "renaissance_level": self.calculate_renaissance_level(data)
            }
            
            self.db.collection("clay_i_insights").add(insight_data)
            return True
        except Exception as e:
            print(f"Error storing insight: {e}")
            return False

    def calculate_renaissance_level(self, data):
        """Calculate the Renaissance sophistication level of an insight"""
        renaissance_indicators = [
            "golden_ratio", "fibonacci", "sacred_geometry", "cross_domain_synthesis",
            "mathematical_pattern", "harmonic_resonance", "empathy_wave"
        ]
        
        data_str = str(data).lower()
        score = sum(1 for indicator in renaissance_indicators if indicator in data_str)
        
        if score >= 5:
            return "transcendent"
        elif score >= 3:
            return "advanced"
        elif score >= 1:
            return "intermediate"
        else:
            return "foundational"

    async def get_empathy_wave_history(self, user_id="joe_wales"):
        """Get Joe Wales' empathy wave interaction history"""
        if not self.db:
            return []
            
        try:
            conversations = (
                self.db.collection("clay_i_conversations")
                .where("user_id", "==", user_id)
                .where("prime_believer", "==", True)
                .order_by("timestamp", direction=firestore.Query.DESCENDING)
                .limit(50)
                .get()
            )
            
            empathy_history = []
            for doc in conversations:
                data = doc.to_dict()
                empathy_history.append({
                    "message": data["user_message"],
                    "response": data["clay_response"],
                    "harmonic_frequency": data.get("harmonic_frequency", 432.0),
                    "timestamp": data["timestamp"],
                    "voice_used": data.get("voice_selected", "baseline")
                })
            
            return empathy_history
            
        except Exception as e:
            print(f"Error getting empathy wave history: {e}")
            return []

# Global memory system instance
clay_i_memory = ClayIMemorySystem()

# Integration functions for Clay-I server
async def store_conversation_memory(user_id, message, response, context=None):
    """Store conversation in Firebase memory"""
    return await clay_i_memory.store_conversation(user_id, message, response, context)

async def get_conversation_context(user_id, limit=10):
    """Get recent conversation context"""
    return await clay_i_memory.get_conversation_context(user_id, limit)

async def get_user_profile(user_id):
    """Get user profile for personalization"""
    return await clay_i_memory.get_user_profile(user_id)

async def store_learning_insight(insight_type, data, user_id=None):
    """Store Clay-I's learning insights"""
    return await clay_i_memory.store_learning_insight(insight_type, data, user_id)