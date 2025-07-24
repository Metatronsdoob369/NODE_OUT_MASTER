#!/usr/bin/env python3
"""
PromptBuilder Module
Crafts prompts using live file and goal context for each sub-agent
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class PromptTemplate:
    name: str
    agent_type: str
    base_prompt: str
    context_variables: List[str]
    dynamic_sections: Dict[str, str]
    validation_requirements: List[str]

class PromptBuilder:
    """
    Builds context-aware prompts for sub-agents using live data
    """
    
    def __init__(self):
        self.templates = {}
        self.context_cache = {}
        self.load_templates()
        
    def load_templates(self):
        """Load predefined prompt templates for each sub-agent"""
        
        # VoiceResponder Template
        voice_template = PromptTemplate(
            name="voice_responder_template",
            agent_type="VoiceResponder",
            base_prompt="""You are an AI assistant specializing in voice call triage for storm damage assessment.

Your primary responsibilities:
1. Extract customer contact information accurately
2. Assess damage urgency level (emergency/high/medium/low)
3. Identify damage type and affected areas
4. Generate clear, actionable summaries
5. Determine appropriate next steps

Context Variables:
{context_variables}

Current Call Data:
{call_data}

Analysis Guidelines:
{analysis_guidelines}

Please process this call and provide:
- Urgency assessment with reasoning
- Damage type classification
- Customer information summary
- Recommended next action
- Handoff data for downstream agents""",
            context_variables=[
                "caller_info", "audio_transcript", "call_metadata", 
                "urgency_keywords", "damage_types", "business_hours"
            ],
            dynamic_sections={
                "analysis_guidelines": "urgency_assessment_rules",
                "damage_classification": "damage_type_mapping",
                "next_actions": "action_recommendations"
            },
            validation_requirements=[
                "must_extract_contact_info",
                "must_assess_urgency_level", 
                "must_identify_damage_type"
            ]
        )
        
        # QuoteDraft Template
        quote_template = PromptTemplate(
            name="quote_draft_template",
            agent_type="QuoteDraft", 
            base_prompt="""You are an AI assistant specializing in construction quote generation for storm damage repairs.

Your primary responsibilities:
1. Calculate accurate material requirements
2. Estimate labor costs and timelines
3. Apply appropriate pricing rules and markups
4. Generate professional, detailed quotes
5. Ensure compliance with local regulations

Context Variables:
{context_variables}

Damage Assessment:
{damage_assessment}

Material Database:
{material_database}

Labor Rates:
{labor_rates}

Pricing Guidelines:
{pricing_guidelines}

Please generate a comprehensive quote including:
- Detailed material list with quantities and costs
- Labor breakdown with hours and rates
- Project timeline and milestones
- Terms and conditions
- Total cost breakdown with taxes""",
            context_variables=[
                "damage_assessment", "material_database", "labor_rates",
                "tax_rates", "markup_rules", "timeline_factors"
            ],
            dynamic_sections={
                "pricing_guidelines": "pricing_rules_and_markups",
                "material_specifications": "material_requirements_by_damage",
                "labor_calculations": "labor_estimation_formulas"
            },
            validation_requirements=[
                "must_include_material_costs",
                "must_include_labor_estimates",
                "must_include_timeline",
                "must_validate_pricing_rules"
            ]
        )
        
        # MaterialOrderBot Template
        material_template = PromptTemplate(
            name="material_order_template", 
            agent_type="MaterialOrderBot",
            base_prompt="""You are an AI assistant specializing in automated material ordering for construction projects.

Your primary responsibilities:
1. Verify quote approval and payment status
2. Check material availability across suppliers
3. Optimize delivery scheduling and logistics
4. Track order status and manage exceptions
5. Coordinate with project timelines

Context Variables:
{context_variables}

Quote Data:
{quote_data}

Supplier Database:
{supplier_database}

Scheduling Information:
{scheduling_data}

Ordering Guidelines:
{ordering_guidelines}

Please process this order request and provide:
- Material availability verification
- Supplier selection with reasoning
- Delivery scheduling optimization
- Order confirmation details
- Tracking and monitoring setup""",
            context_variables=[
                "quote_data", "supplier_database", "scheduling_data",
                "inventory_levels", "delivery_constraints", "payment_status"
            ],
            dynamic_sections={
                "ordering_guidelines": "supplier_selection_criteria",
                "delivery_optimization": "logistics_optimization_rules",
                "availability_check": "inventory_verification_process"
            },
            validation_requirements=[
                "must_verify_quote_approval",
                "must_check_material_availability", 
                "must_optimize_delivery_timing",
                "must_track_order_status"
            ]
        )
        
        self.templates = {
            "voice_responder_template": voice_template,
            "quote_draft_template": quote_template,
            "material_order_template": material_template
        }
        
    def build_prompt(self, template_name: str, context_data: Dict[str, Any], 
                    live_data: Dict[str, Any] = None) -> str:
        """
        Build a complete prompt using template and live context data
        """
        if template_name not in self.templates:
            raise ValueError(f"Template {template_name} not found")
            
        template = self.templates[template_name]
        
        # Gather context variables
        context_vars = self._gather_context_variables(template, context_data, live_data)
        
        # Build dynamic sections
        dynamic_content = self._build_dynamic_sections(template, context_data)
        
        # Merge all context
        prompt_context = {**context_vars, **dynamic_content}
        
        # Format the base prompt
        try:
            formatted_prompt = template.base_prompt.format(**prompt_context)
        except KeyError as e:
            missing_key = str(e).strip("'")
            formatted_prompt = template.base_prompt.replace(f"{{{missing_key}}}", f"[{missing_key}: Not Available]")
            
        return formatted_prompt
        
    def _gather_context_variables(self, template: PromptTemplate, 
                                context_data: Dict[str, Any],
                                live_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Gather and format context variables for the template"""
        context_vars = {}
        
        for var_name in template.context_variables:
            if var_name in context_data:
                context_vars[var_name] = self._format_context_value(context_data[var_name])
            elif live_data and var_name in live_data:
                context_vars[var_name] = self._format_context_value(live_data[var_name])
            else:
                # Load from file or provide default
                context_vars[var_name] = self._load_context_from_file(var_name, template.agent_type)
                
        return context_vars
        
    def _format_context_value(self, value: Any) -> str:
        """Format context values for inclusion in prompts"""
        if isinstance(value, dict):
            return json.dumps(value, indent=2)
        elif isinstance(value, list):
            return "\n".join([f"- {item}" for item in value])
        else:
            return str(value)
            
    def _load_context_from_file(self, var_name: str, agent_type: str) -> str:
        """Load context data from files when not provided in real-time"""
        
        # Define default context data
        default_contexts = {
            "urgency_keywords": {
                "emergency": ["flooding", "collapse", "electrical", "gas leak"],
                "high": ["active leak", "water damage", "major damage"],
                "medium": ["roof damage", "window broken", "moderate damage"],
                "low": ["minor damage", "cosmetic", "inspection needed"]
            },
            "damage_types": [
                "roof_leak", "roof_damage", "window_damage", 
                "siding_damage", "flooding", "structural", "electrical"
            ],
            "business_hours": "Monday-Friday 8AM-6PM, Emergency service 24/7",
            "material_database": "Standard roofing, siding, and window materials with current pricing",
            "labor_rates": "Skilled: $75/hr, Standard: $55/hr, Emergency: $125/hr",
            "tax_rates": "8% sales tax applicable to materials and labor",
            "markup_rules": "15% markup on materials, 20% markup on subcontracted work",
            "supplier_database": "Home Depot, Lowe's, ABC Supply, and specialty suppliers",
            "timeline_factors": "Weather, material availability, crew scheduling, permit requirements"
        }
        
        return self._format_context_value(default_contexts.get(var_name, f"[{var_name}: Configuration needed]"))
        
    def _build_dynamic_sections(self, template: PromptTemplate, 
                              context_data: Dict[str, Any]) -> Dict[str, str]:
        """Build dynamic sections based on current context"""
        dynamic_content = {}
        
        for section_name, section_type in template.dynamic_sections.items():
            if section_type == "urgency_assessment_rules":
                dynamic_content[section_name] = self._build_urgency_rules(context_data)
            elif section_type == "damage_type_mapping":
                dynamic_content[section_name] = self._build_damage_mapping(context_data)
            elif section_type == "action_recommendations":
                dynamic_content[section_name] = self._build_action_recommendations(context_data)
            elif section_type == "pricing_rules_and_markups":
                dynamic_content[section_name] = self._build_pricing_rules(context_data)
            elif section_type == "material_requirements_by_damage":
                dynamic_content[section_name] = self._build_material_requirements(context_data)
            elif section_type == "labor_estimation_formulas":
                dynamic_content[section_name] = self._build_labor_formulas(context_data)
            elif section_type == "supplier_selection_criteria":
                dynamic_content[section_name] = self._build_supplier_criteria(context_data)
            elif section_type == "logistics_optimization_rules":
                dynamic_content[section_name] = self._build_logistics_rules(context_data)
            else:
                dynamic_content[section_name] = f"[{section_name}: Dynamic content to be implemented]"
                
        return dynamic_content
        
    def _build_urgency_rules(self, context_data: Dict[str, Any]) -> str:
        """Build urgency assessment rules based on current conditions"""
        current_weather = context_data.get("weather", {})
        time_of_day = datetime.now().hour
        
        rules = [
            "EMERGENCY (dispatch immediately):",
            "- Active flooding or water intrusion",
            "- Structural collapse or instability", 
            "- Electrical hazards or gas leaks",
            "- Life safety concerns",
            "",
            "HIGH (same-day response):",
            "- Active roof leaks during rain",
            "- Major structural damage",
            "- Security concerns (broken windows/doors)",
            "",
            "MEDIUM (24-48 hour response):",
            "- Moderate roof damage without active leaks",
            "- Window damage affecting security",
            "- Siding damage exposing interior",
            "",
            "LOW (3-5 business day response):",
            "- Minor cosmetic damage",
            "- Preventive repairs",
            "- Insurance inspections"
        ]
        
        # Add weather-specific rules
        if current_weather.get("precipitation_forecast"):
            rules.insert(1, "- ANY roof damage with rain forecast (upgrade to HIGH)")
            
        # Add time-of-day considerations
        if time_of_day < 7 or time_of_day > 19:
            rules.insert(1, "- After-hours calls (add emergency surcharge)")
            
        return "\n".join(rules)
        
    def _build_damage_mapping(self, context_data: Dict[str, Any]) -> str:
        """Build damage type classification mapping"""
        return """DAMAGE TYPE CLASSIFICATION:

ROOFING:
- roof_leak: Active water intrusion, visible leaks
- roof_damage: Missing shingles, damaged flashing, structural issues

WINDOWS:
- window_damage: Broken glass, damaged frames, security concerns

SIDING:
- siding_damage: Damaged exterior cladding, exposed interior

STRUCTURAL:
- structural: Foundation issues, wall cracks, compromised integrity

FLOODING:
- flooding: Water damage, basement flooding, drainage issues

ELECTRICAL:
- electrical: Power issues, exposed wires, safety hazards

GENERAL:
- general: Multiple damage types or unclear classification"""
        
    def _build_action_recommendations(self, context_data: Dict[str, Any]) -> str:
        """Build action recommendations based on urgency and damage type"""
        return """NEXT ACTION RECOMMENDATIONS:

EMERGENCY → Dispatch emergency crew immediately + notify supervisor
HIGH → Schedule same-day inspection + temporary repairs if needed
MEDIUM → Schedule inspection within 24-48 hours + send quote
LOW → Schedule routine inspection within 3-5 business days

SPECIAL CONSIDERATIONS:
- Weather forecast affecting urgency
- Customer availability and preferences  
- Crew capacity and scheduling constraints
- Material availability for immediate repairs"""
        
    def _build_pricing_rules(self, context_data: Dict[str, Any]) -> str:
        """Build pricing rules and markup guidelines"""
        return """PRICING GUIDELINES:

MATERIAL MARKUPS:
- Standard materials: 15% markup
- Special order items: 20% markup  
- Emergency materials: 25% markup

LABOR RATES:
- Standard work: $55-75/hour depending on skill level
- Emergency service: $125/hour (1.5x multiplier)
- Weekend/holiday: $95/hour (1.25x multiplier)

ADDITIONAL COSTS:
- Permits: Pass-through cost + $50 processing fee
- Disposal: $0.75/sq ft for roofing debris
- Travel: $1.25/mile beyond 25-mile radius

TAX AND TERMS:
- Sales tax: 8% on materials and labor
- Payment terms: 50% deposit, balance on completion
- Warranty: 1 year on labor, manufacturer warranty on materials"""
        
    def _build_material_requirements(self, context_data: Dict[str, Any]) -> str:
        """Build material requirements by damage type"""
        return """MATERIAL REQUIREMENTS BY DAMAGE TYPE:

ROOF LEAK/DAMAGE:
- Shingles: 1.1x damaged area (10% waste factor)
- Underlayment: Match shingle area  
- Flashing: 20% of linear footage for severe damage
- Fasteners: 5 lbs per 100 sq ft
- Ridge vent: As needed for ventilation

WINDOW DAMAGE:
- Glass: Exact measurement + 5% cutting allowance
- Frame materials: Based on window type and size
- Hardware: Locks, handles, weatherstripping
- Trim: Interior and exterior finish materials

SIDING DAMAGE:
- Siding: 1.15x damaged area (15% waste factor)
- House wrap: Match siding area if damaged
- Trim and accessories: Linear footage as needed
- Fasteners: Appropriate for siding type"""
        
    def _build_labor_formulas(self, context_data: Dict[str, Any]) -> str:
        """Build labor estimation formulas"""
        return """LABOR ESTIMATION FORMULAS:

ROOFING:
- Installation: 6-8 hours per 100 sq ft
- Repair: 8-10 hours per 100 sq ft (complexity factor)
- Cleanup: 2 hours minimum + 1 hour per 100 sq ft

WINDOWS:  
- Replacement: 2-4 hours per window (size dependent)
- Repair: 1-2 hours per window
- Trim work: 1 hour per linear foot

SIDING:
- Installation: 4-6 hours per 100 sq ft
- Repair: 5-7 hours per 100 sq ft
- Prep work: 2 hours per 100 sq ft

FACTORS:
- Weather delays: Add 15% to timeline
- Access difficulty: Add 10-25% to labor hours
- Height/safety: Add 20% for two-story work"""
        
    def _build_supplier_criteria(self, context_data: Dict[str, Any]) -> str:
        """Build supplier selection criteria"""
        return """SUPPLIER SELECTION CRITERIA:

PRIMARY FACTORS:
1. Delivery timeline vs. project start date
2. Material availability and stock levels  
3. Pricing competitiveness
4. Payment terms and credit limits
5. Quality and warranty coverage

SUPPLIER PRIORITIES:
- ABC Supply: Best for roofing materials, 1-day delivery
- Home Depot: General materials, 2-day delivery, competitive pricing
- Lowe's: Alternative option, 3-day delivery
- Specialty suppliers: Custom orders, longer lead times

DECISION MATRIX:
- Emergency jobs: Fastest delivery trumps cost
- Standard jobs: Balance cost and delivery time
- Large orders: Negotiate volume discounts
- Special materials: Use certified suppliers only"""
        
    def _build_logistics_rules(self, context_data: Dict[str, Any]) -> str:
        """Build logistics optimization rules"""
        return """LOGISTICS OPTIMIZATION RULES:

DELIVERY SCHEDULING:
- Deliver 1 day before project start (preferred)
- Coordinate with crew schedule and customer availability
- Consider weather forecast for outdoor deliveries
- Group multiple orders for same job site

SITE PREPARATION:
- Verify delivery access and staging area
- Coordinate with customer for large deliveries
- Check permit requirements for staging materials
- Plan for material security and protection

CONTINGENCY PLANNING:
- 10% buffer on material quantities
- Backup supplier identification
- Alternative delivery dates
- Emergency material sourcing procedures"""

    def get_template_validation_requirements(self, template_name: str) -> List[str]:
        """Get validation requirements for a specific template"""
        if template_name not in self.templates:
            return []
        return self.templates[template_name].validation_requirements
        
    def list_available_templates(self) -> List[str]:
        """List all available prompt templates"""
        return list(self.templates.keys())
        
    def save_template(self, template: PromptTemplate):
        """Save a new or modified template"""
        self.templates[template.name] = template
        
    def export_template(self, template_name: str, file_path: str):
        """Export template to file"""
        if template_name not in self.templates:
            raise ValueError(f"Template {template_name} not found")
            
        template = self.templates[template_name]
        template_data = {
            "name": template.name,
            "agent_type": template.agent_type,
            "base_prompt": template.base_prompt,
            "context_variables": template.context_variables,
            "dynamic_sections": template.dynamic_sections,
            "validation_requirements": template.validation_requirements
        }
        
        with open(file_path, 'w') as f:
            json.dump(template_data, f, indent=2)

def test_prompt_builder():
    """Test the PromptBuilder functionality"""
    builder = PromptBuilder()
    
    print("--- Testing PromptBuilder ---")
    print(f"Available templates: {builder.list_available_templates()}")
    
    # Test VoiceResponder prompt
    print("\n--- VoiceResponder Prompt ---")
    voice_context = {
        "call_data": {
            "caller_info": {"name": "John Smith", "phone": "+1234567890"},
            "audio_transcript": "Hi, I have a major roof leak in my kitchen after the storm",
            "call_metadata": {"call_duration": "120", "call_time": "2025-07-19T10:30:00Z"}
        }
    }
    
    voice_prompt = builder.build_prompt("voice_responder_template", voice_context)
    print(voice_prompt[:500] + "...")
    
    # Test QuoteDraft prompt  
    print("\n--- QuoteDraft Prompt ---")
    quote_context = {
        "damage_assessment": {
            "type": "roof_leak",
            "severity": "moderate",
            "area": 200,
            "urgency": "high"
        }
    }
    
    quote_prompt = builder.build_prompt("quote_draft_template", quote_context)
    print(quote_prompt[:500] + "...")
    
    # Test MaterialOrderBot prompt
    print("\n--- MaterialOrderBot Prompt ---")
    material_context = {
        "quote_data": {
            "quote_id": "Q-12345678",
            "approval_status": "approved",
            "materials": ["shingles", "underlayment", "flashing"]
        },
        "scheduling_data": {
            "start_date": "2025-07-25",
            "delivery_address": "123 Main St"
        }
    }
    
    material_prompt = builder.build_prompt("material_order_template", material_context)
    print(material_prompt[:500] + "...")
    
    # Show validation requirements
    print("\n--- Validation Requirements ---")
    for template_name in builder.list_available_templates():
        requirements = builder.get_template_validation_requirements(template_name)
        print(f"{template_name}: {requirements}")

if __name__ == "__main__":
    test_prompt_builder()