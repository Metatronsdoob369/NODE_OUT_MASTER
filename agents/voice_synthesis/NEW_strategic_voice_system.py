# STRATEGIC VOICE SYSTEM - Voice-to-Use-Case Intelligent Mapping
# Add this to your CLAUDE_Voice_integration_system.py

class StrategicVoiceMapper:
    """
    Intelligent voice selection based on agent type, use case, and business context
    Maps specific voices to specific business scenarios for maximum impact
    """
    
    def __init__(self):
        self.voice_profiles = {
            'Drew': {
                'real_name': 'George',
                'voice_id': 'JBFqnCBsd6RMkjVDRZzb',
                'personality': 'Confident & Commanding',
                'best_for': ['cold_outreach', 'sales_closing', 'executive_level', 'authority_needed'],
                'industry_fit': ['B2B sales', 'real estate partnerships', 'executive communications'],
                'emotional_tone': 'confident',
                'professionalism': 9,
                'warmth': 6,
                'authority': 9,
                'persuasion': 8,
                'use_cases': {
                    'real_estate_cold_call': 'Perfect for initial agent outreach - commands attention',
                    'insurance_expert_call': 'Ideal for positioning as industry authority',
                    'executive_presentation': 'Excellent for high-level business communications',
                    'sales_closing': 'Strong for closing conversations and commitments'
                }
            },
            'Rachel': {
                'real_name': 'Sarah', 
                'voice_id': 'EXAVITQu4vr4xnSDxMaL',
                'personality': 'Warm & Trustworthy',
                'best_for': ['customer_service', 'follow_up', 'relationship_building', 'education'],
                'industry_fit': ['customer support', 'client education', 'warm follow-ups'],
                'emotional_tone': 'warm',
                'professionalism': 8,
                'warmth': 9,
                'authority': 6,
                'persuasion': 7,
                'use_cases': {
                    'customer_follow_up': 'Perfect for post-service satisfaction calls',
                    'appointment_confirmation': 'Ideal for friendly appointment reminders',
                    'educational_content': 'Excellent for explaining insurance processes',
                    'relationship_nurturing': 'Best for building long-term client relationships'
                }
            },
            'Paul': {
                'real_name': 'Brian',
                'voice_id': 'nPczCjzI2devNBz1zQrb', 
                'personality': 'Experienced & Wise',
                'best_for': ['technical_explanation', 'consultation', 'expert_advice', 'problem_solving'],
                'industry_fit': ['technical consulting', 'expert positioning', 'complex explanations'],
                'emotional_tone': 'authoritative',
                'professionalism': 9,
                'warmth': 7,
                'authority': 9,
                'persuasion': 6,
                'use_cases': {
                    'technical_consultation': 'Perfect for explaining roofing technicalities',
                    'insurance_law_education': 'Ideal for complex insurance explanations',
                    'expert_positioning': 'Excellent for establishing credibility',
                    'problem_diagnosis': 'Best for explaining roof damage assessments'
                }
            },
            'Antoni': {
                'real_name': 'Chris',
                'voice_id': 'iP95p4xoKVk53GoZ742B',
                'personality': 'Charismatic & Persuasive', 
                'best_for': ['sales_presentations', 'partnership_pitches', 'marketing', 'engagement'],
                'industry_fit': ['sales presentations', 'partnership development', 'marketing content'],
                'emotional_tone': 'charismatic',
                'professionalism': 8,
                'warmth': 8,
                'authority': 7,
                'persuasion': 9,
                'use_cases': {
                    'partnership_pitch': 'Perfect for real estate agent partnership proposals',
                    'sales_presentation': 'Ideal for service presentations and demos',
                    'marketing_content': 'Excellent for promotional and advertising content',
                    'engagement_campaigns': 'Best for social media and marketing campaigns'
                }
            }
        }
        
        self.agent_voice_mapping = {
            'roofing_specialist': {
                'primary': 'Paul',  # Expert authority for technical knowledge
                'secondary': 'Drew',  # Backup for business discussions
                'use_case_overrides': {
                    'cold_outreach': 'Drew',  # Need authority for cold calls
                    'technical_explanation': 'Paul',  # Expert knowledge
                    'sales_closing': 'Antoni'  # Persuasion for closing
                }
            },
            'sales_agent': {
                'primary': 'Antoni',  # Charismatic for sales
                'secondary': 'Drew',   # Authority for high-level sales
                'use_case_overrides': {
                    'cold_calling': 'Drew',     # Authority to get attention
                    'presentation': 'Antoni',   # Charisma for engagement
                    'follow_up': 'Rachel',      # Warmth for relationship building
                    'closing': 'Antoni'         # Persuasion for final close
                }
            },
            'content_creator': {
                'primary': 'Rachel',  # Warm for content engagement
                'secondary': 'Antoni', # Charismatic for marketing
                'use_case_overrides': {
                    'educational': 'Paul',      # Authority for education
                    'marketing': 'Antoni',      # Charisma for promotion
                    'customer_stories': 'Rachel', # Warmth for testimonials
                    'executive_content': 'Drew'  # Authority for business content
                }
            },
            'relationship_agent': {
                'primary': 'Rachel',  # Warmth for relationships
                'secondary': 'Antoni', # Charisma for networking
                'use_case_overrides': {
                    'networking': 'Antoni',     # Charisma for new connections
                    'customer_service': 'Rachel', # Warmth for service
                    'partnership': 'Drew',      # Authority for partnerships
                    'follow_up': 'Rachel'       # Warmth for ongoing relationships
                }
            },
            'pathsassin': {
                'primary': 'Paul',    # Wisdom for learning/teaching
                'secondary': 'Rachel', # Warmth for encouragement  
                'use_case_overrides': {
                    'teaching': 'Paul',         # Authority for instruction
                    'encouragement': 'Rachel',  # Warmth for motivation
                    'analysis': 'Drew',         # Authority for insights
                    'guidance': 'Paul'          # Wisdom for direction
                }
            }
        }
        
        self.context_voice_mapping = {
            'emergency_alert': 'Drew',      # Authority for urgency
            'appointment_reminder': 'Rachel', # Warmth for service
            'technical_update': 'Paul',     # Expertise for technical info
            'sales_presentation': 'Antoni', # Charisma for persuasion
            'customer_education': 'Paul',   # Authority for teaching
            'relationship_building': 'Rachel', # Warmth for connections
            'partnership_proposal': 'Drew', # Authority for business
            'marketing_campaign': 'Antoni', # Charisma for engagement
            'expert_consultation': 'Paul',  # Wisdom for advice
            'cold_outreach': 'Drew',       # Authority to command attention
            'warm_follow_up': 'Rachel',    # Warmth for relationships
            'closing_conversation': 'Antoni' # Persuasion for closing
        }
    
    def get_optimal_voice(self, agent_type: str, use_case: str = None, context: str = None) -> dict:
        """
        Get the optimal voice for a specific agent, use case, and context
        Returns voice info with reasoning for the selection
        """
        # Start with agent's primary voice
        agent_config = self.agent_voice_mapping.get(agent_type, {})
        selected_voice = agent_config.get('primary', 'Drew')  # Default to Drew
        selection_reason = f"Default voice for {agent_type} agent"
        
        # Check for use case overrides
        if use_case and agent_config.get('use_case_overrides', {}).get(use_case):
            selected_voice = agent_config['use_case_overrides'][use_case]
            selection_reason = f"Optimized for {use_case} use case"
        
        # Check for context overrides (highest priority)
        if context and self.context_voice_mapping.get(context):
            selected_voice = self.context_voice_mapping[context]
            selection_reason = f"Optimized for {context} context"
        
        voice_profile = self.voice_profiles[selected_voice]
        
        return {
            'voice_name': selected_voice,
            'voice_id': voice_profile['voice_id'],
            'real_name': voice_profile['real_name'],
            'personality': voice_profile['personality'],
            'selection_reason': selection_reason,
            'why_this_voice': voice_profile['use_cases'].get(context or use_case, 
                                                          f"Strong {voice_profile['emotional_tone']} presence"),
            'voice_stats': {
                'professionalism': voice_profile['professionalism'],
                'warmth': voice_profile['warmth'], 
                'authority': voice_profile['authority'],
                'persuasion': voice_profile['persuasion']
            }
        }
    
    def get_voice_recommendations(self, business_scenario: str) -> list:
        """
        Get top 3 voice recommendations for a specific business scenario
        """
        scenario_mappings = {
            'real_estate_cold_calling': [
                ('Drew', 'Commands attention and establishes authority immediately'),
                ('Paul', 'Expert credibility for insurance law discussions'), 
                ('Antoni', 'Charismatic backup for relationship building')
            ],
            'customer_service_calls': [
                ('Rachel', 'Warm and trustworthy for customer satisfaction'),
                ('Paul', 'Expert authority for technical questions'),
                ('Antoni', 'Engaging for upselling opportunities')
            ],
            'sales_presentations': [
                ('Antoni', 'Charismatic and persuasive for engagement'),
                ('Drew', 'Authoritative for executive-level presentations'),
                ('Rachel', 'Warm for relationship-focused pitches')
            ],
            'technical_consultations': [
                ('Paul', 'Expert authority for technical credibility'),
                ('Drew', 'Business authority for ROI discussions'),
                ('Rachel', 'Approachable for client education')
            ],
            'partnership_development': [
                ('Drew', 'Business authority for partnership proposals'),
                ('Antoni', 'Charismatic for networking and relationship building'),
                ('Paul', 'Expert positioning for credibility')
            ]
        }
        
        return scenario_mappings.get(business_scenario, [
            ('Drew', 'Confident default choice'),
            ('Rachel', 'Warm alternative'),
            ('Paul', 'Expert alternative')
        ])
    
    def analyze_voice_performance(self, voice_name: str, use_case: str) -> dict:
        """
        Analyze how well a specific voice fits a specific use case
        """
        voice = self.voice_profiles.get(voice_name, {})
        
        # Calculate fit score based on voice attributes
        fit_scores = {
            'cold_outreach': voice.get('authority', 0) * 0.4 + voice.get('professionalism', 0) * 0.6,
            'customer_service': voice.get('warmth', 0) * 0.6 + voice.get('professionalism', 0) * 0.4,
            'sales_closing': voice.get('persuasion', 0) * 0.5 + voice.get('authority', 0) * 0.5,
            'technical_explanation': voice.get('authority', 0) * 0.5 + voice.get('professionalism', 0) * 0.5,
            'relationship_building': voice.get('warmth', 0) * 0.7 + voice.get('persuasion', 0) * 0.3
        }
        
        fit_score = fit_scores.get(use_case, 7.0)  # Default score
        
        return {
            'voice_name': voice_name,
            'use_case': use_case,
            'fit_score': fit_score,
            'fit_rating': 'Excellent' if fit_score >= 8.5 else 'Good' if fit_score >= 7.0 else 'Fair',
            'strengths': voice.get('best_for', []),
            'personality': voice.get('personality', 'Professional'),
            'recommendation': 'Highly Recommended' if fit_score >= 8.5 else 'Recommended' if fit_score >= 7.0 else 'Consider Alternatives'
        }

# Enhanced endpoint for your Flask app
@app.route('/api/voices/strategic-selection', methods=['POST'])
def strategic_voice_selection():
    """
    Intelligent voice selection based on agent type, use case, and business context
    """
    try:
        data = request.json
        agent_type = data.get('agent_type', 'pathsassin')
        use_case = data.get('use_case', None)
        context = data.get('context', None)
        business_scenario = data.get('business_scenario', None)
        
        voice_mapper = StrategicVoiceMapper()
        
        if business_scenario:
            # Get recommendations for a business scenario
            recommendations = voice_mapper.get_voice_recommendations(business_scenario)
            return jsonify({
                'success': True,
                'business_scenario': business_scenario,
                'voice_recommendations': recommendations,
                'selection_strategy': 'business_scenario_optimization'
            })
        else:
            # Get optimal voice for specific agent/use case/context
            optimal_voice = voice_mapper.get_optimal_voice(agent_type, use_case, context)
            
            # Also get performance analysis
            performance = voice_mapper.analyze_voice_performance(
                optimal_voice['voice_name'], 
                use_case or context or 'general'
            )
            
            return jsonify({
                'success': True,
                'optimal_voice': optimal_voice,
                'performance_analysis': performance,
                'selection_strategy': 'intelligent_optimization'
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Usage examples for your system:
"""
# Get optimal voice for roofing specialist doing cold outreach
POST /api/voices/strategic-selection
{
    "agent_type": "roofing_specialist",
    "use_case": "cold_outreach",
    "context": "real_estate_cold_calling"
}

# Get voice recommendations for sales presentations  
POST /api/voices/strategic-selection
{
    "business_scenario": "sales_presentations"
}

# Get optimal voice for customer service follow-up
POST /api/voices/strategic-selection
{
    "agent_type": "relationship_agent", 
    "use_case": "follow_up",
    "context": "customer_service_calls"
}
"""