#!/usr/bin/env python3
"""
QuoteDraft Sub-Agent
Generates accurate quotes based on damage assessment and material costs
"""

import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import uuid

@dataclass
class MaterialItem:
    name: str
    quantity: float
    unit: str
    unit_cost: float
    total_cost: float
    supplier: str = ""

@dataclass
class LaborItem:
    task: str
    hours: float
    rate: float
    total_cost: float
    skill_level: str = "standard"

@dataclass
class Quote:
    quote_id: str
    customer_info: Dict[str, Any]
    damage_assessment: Dict[str, Any]
    materials: List[MaterialItem]
    labor: List[LaborItem]
    subtotal: float
    tax_rate: float
    tax_amount: float
    total: float
    timeline: str
    valid_until: datetime
    terms: List[str]
    created_at: datetime

class QuoteDraft:
    """
    Sub-agent for generating accurate quotes based on damage assessments
    """
    
    def __init__(self):
        self.setup_logging()
        self.material_database = self._load_material_database()
        self.labor_rates = self._load_labor_rates()
        self.tax_rate = 0.08  # 8% tax rate
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('QuoteDraft')
        
    def _load_material_database(self) -> Dict[str, Dict[str, Any]]:
        """Load material costs and specifications"""
        return {
            "asphalt_shingles": {
                "unit": "sq_ft",
                "cost_per_unit": 3.50,
                "supplier": "Home Depot",
                "category": "roofing"
            },
            "architectural_shingles": {
                "unit": "sq_ft", 
                "cost_per_unit": 4.25,
                "supplier": "Lowe's",
                "category": "roofing"
            },
            "underlayment": {
                "unit": "sq_ft",
                "cost_per_unit": 0.75,
                "supplier": "ABC Supply",
                "category": "roofing"
            },
            "flashing": {
                "unit": "linear_ft",
                "cost_per_unit": 8.50,
                "supplier": "ABC Supply",
                "category": "roofing"
            },
            "plywood_sheathing": {
                "unit": "sq_ft",
                "cost_per_unit": 2.25,
                "supplier": "Home Depot",
                "category": "structural"
            },
            "ridge_vent": {
                "unit": "linear_ft",
                "cost_per_unit": 12.00,
                "supplier": "ABC Supply",
                "category": "ventilation"
            },
            "gutters": {
                "unit": "linear_ft",
                "cost_per_unit": 15.00,
                "supplier": "Gutter Supply",
                "category": "drainage"
            },
            "window_glass": {
                "unit": "sq_ft",
                "cost_per_unit": 25.00,
                "supplier": "Glass Pro",
                "category": "windows"
            },
            "siding_vinyl": {
                "unit": "sq_ft",
                "cost_per_unit": 6.50,
                "supplier": "Siding World",
                "category": "exterior"
            }
        }
        
    def _load_labor_rates(self) -> Dict[str, Dict[str, Any]]:
        """Load labor rates for different types of work"""
        return {
            "roofing_installation": {
                "rate_per_hour": 75.00,
                "rate_per_sq_ft": 5.50,
                "skill_level": "skilled"
            },
            "roofing_repair": {
                "rate_per_hour": 85.00,
                "rate_per_sq_ft": 6.00,
                "skill_level": "skilled"
            },
            "window_replacement": {
                "rate_per_hour": 65.00,
                "rate_per_window": 150.00,
                "skill_level": "skilled"
            },
            "siding_repair": {
                "rate_per_hour": 55.00,
                "rate_per_sq_ft": 4.25,
                "skill_level": "standard"
            },
            "general_cleanup": {
                "rate_per_hour": 35.00,
                "skill_level": "basic"
            },
            "emergency_services": {
                "rate_per_hour": 125.00,
                "skill_level": "emergency"
            }
        }
        
    async def generate_quote(self, assessment_data: Dict[str, Any]) -> Quote:
        """
        Generate a comprehensive quote based on damage assessment
        """
        try:
            damage_assessment = assessment_data.get("damage_assessment", {})
            customer_info = assessment_data.get("customer_info", {})
            urgency = damage_assessment.get("urgency", "medium")
            
            # Calculate materials needed
            materials = self._calculate_materials(damage_assessment)
            
            # Calculate labor requirements
            labor = self._calculate_labor(damage_assessment, materials)
            
            # Apply urgency multipliers
            if urgency == "emergency":
                labor = self._apply_emergency_rates(labor)
                
            # Calculate totals
            material_subtotal = sum(item.total_cost for item in materials)
            labor_subtotal = sum(item.total_cost for item in labor)
            subtotal = material_subtotal + labor_subtotal
            
            tax_amount = subtotal * self.tax_rate
            total = subtotal + tax_amount
            
            # Determine timeline
            timeline = self._calculate_timeline(damage_assessment, urgency)
            
            # Generate quote
            quote = Quote(
                quote_id=f"Q-{str(uuid.uuid4())[:8].upper()}",
                customer_info=customer_info,
                damage_assessment=damage_assessment,
                materials=materials,
                labor=labor,
                subtotal=subtotal,
                tax_rate=self.tax_rate,
                tax_amount=tax_amount,
                total=total,
                timeline=timeline,
                valid_until=datetime.now() + timedelta(days=30),
                terms=self._generate_terms(urgency),
                created_at=datetime.now()
            )
            
            self.logger.info(f"Quote generated: {quote.quote_id}, Total: ${total:.2f}")
            return quote
            
        except Exception as e:
            self.logger.error(f"Error generating quote: {e}")
            raise
            
    def _calculate_materials(self, damage_assessment: Dict[str, Any]) -> List[MaterialItem]:
        """Calculate required materials based on damage assessment"""
        materials = []
        damage_type = damage_assessment.get("type", "general")
        area = damage_assessment.get("area", 100)  # Default 100 sq ft
        severity = damage_assessment.get("severity", "moderate")
        
        # Apply severity multiplier
        severity_multipliers = {"minor": 0.8, "moderate": 1.0, "severe": 1.3}
        multiplier = severity_multipliers.get(severity, 1.0)
        
        if damage_type in ["roof_leak", "roof_damage"]:
            # Roofing materials
            materials.extend([
                MaterialItem(
                    name="Asphalt Shingles",
                    quantity=area * multiplier,
                    unit="sq_ft",
                    unit_cost=self.material_database["asphalt_shingles"]["cost_per_unit"],
                    total_cost=area * multiplier * self.material_database["asphalt_shingles"]["cost_per_unit"],
                    supplier=self.material_database["asphalt_shingles"]["supplier"]
                ),
                MaterialItem(
                    name="Underlayment",
                    quantity=area * multiplier,
                    unit="sq_ft",
                    unit_cost=self.material_database["underlayment"]["cost_per_unit"],
                    total_cost=area * multiplier * self.material_database["underlayment"]["cost_per_unit"],
                    supplier=self.material_database["underlayment"]["supplier"]
                )
            ])
            
            # Add flashing if severe damage
            if severity == "severe":
                flashing_linear_ft = area * 0.2  # Estimate 20% of area needs flashing
                materials.append(
                    MaterialItem(
                        name="Flashing",
                        quantity=flashing_linear_ft,
                        unit="linear_ft",
                        unit_cost=self.material_database["flashing"]["cost_per_unit"],
                        total_cost=flashing_linear_ft * self.material_database["flashing"]["cost_per_unit"],
                        supplier=self.material_database["flashing"]["supplier"]
                    )
                )
                
        elif damage_type == "window_damage":
            # Window materials
            window_area = min(area, 50)  # Cap window area
            materials.append(
                MaterialItem(
                    name="Window Glass",
                    quantity=window_area,
                    unit="sq_ft", 
                    unit_cost=self.material_database["window_glass"]["cost_per_unit"],
                    total_cost=window_area * self.material_database["window_glass"]["cost_per_unit"],
                    supplier=self.material_database["window_glass"]["supplier"]
                )
            )
            
        elif damage_type == "siding_damage":
            # Siding materials
            materials.append(
                MaterialItem(
                    name="Vinyl Siding",
                    quantity=area * multiplier,
                    unit="sq_ft",
                    unit_cost=self.material_database["siding_vinyl"]["cost_per_unit"],
                    total_cost=area * multiplier * self.material_database["siding_vinyl"]["cost_per_unit"],
                    supplier=self.material_database["siding_vinyl"]["supplier"]
                )
            )
            
        return materials
        
    def _calculate_labor(self, damage_assessment: Dict[str, Any], materials: List[MaterialItem]) -> List[LaborItem]:
        """Calculate labor requirements based on materials and damage type"""
        labor = []
        damage_type = damage_assessment.get("type", "general")
        urgency = damage_assessment.get("urgency", "medium")
        
        total_material_area = sum(item.quantity for item in materials if item.unit == "sq_ft")
        
        if damage_type in ["roof_leak", "roof_damage"]:
            # Roofing labor
            if damage_type == "roof_leak":
                labor_type = "roofing_repair"
            else:
                labor_type = "roofing_installation"
                
            labor_rate = self.labor_rates[labor_type]
            labor_cost = total_material_area * labor_rate["rate_per_sq_ft"]
            
            labor.append(
                LaborItem(
                    task=f"Roofing {labor_type.split('_')[1].title()}",
                    hours=labor_cost / labor_rate["rate_per_hour"],
                    rate=labor_rate["rate_per_hour"],
                    total_cost=labor_cost,
                    skill_level=labor_rate["skill_level"]
                )
            )
            
        elif damage_type == "window_damage":
            # Window labor
            num_windows = max(1, int(total_material_area / 15))  # Estimate windows
            labor_rate = self.labor_rates["window_replacement"]
            labor_cost = num_windows * labor_rate["rate_per_window"]
            
            labor.append(
                LaborItem(
                    task="Window Replacement",
                    hours=labor_cost / labor_rate["rate_per_hour"],
                    rate=labor_rate["rate_per_hour"],
                    total_cost=labor_cost,
                    skill_level=labor_rate["skill_level"]
                )
            )
            
        elif damage_type == "siding_damage":
            # Siding labor
            labor_rate = self.labor_rates["siding_repair"]
            labor_cost = total_material_area * labor_rate["rate_per_sq_ft"]
            
            labor.append(
                LaborItem(
                    task="Siding Repair",
                    hours=labor_cost / labor_rate["rate_per_hour"],
                    rate=labor_rate["rate_per_hour"],
                    total_cost=labor_cost,
                    skill_level=labor_rate["skill_level"]
                )
            )
            
        # Add cleanup labor
        cleanup_hours = max(2, total_material_area / 50)  # Minimum 2 hours
        cleanup_rate = self.labor_rates["general_cleanup"]
        
        labor.append(
            LaborItem(
                task="Cleanup and Debris Removal",
                hours=cleanup_hours,
                rate=cleanup_rate["rate_per_hour"],
                total_cost=cleanup_hours * cleanup_rate["rate_per_hour"],
                skill_level=cleanup_rate["skill_level"]
            )
        )
        
        return labor
        
    def _apply_emergency_rates(self, labor: List[LaborItem]) -> List[LaborItem]:
        """Apply emergency rate multipliers to labor"""
        emergency_multiplier = 1.5
        
        for labor_item in labor:
            if labor_item.skill_level != "basic":
                labor_item.rate *= emergency_multiplier
                labor_item.total_cost *= emergency_multiplier
                labor_item.task += " (Emergency Service)"
                
        return labor
        
    def _calculate_timeline(self, damage_assessment: Dict[str, Any], urgency: str) -> str:
        """Calculate project timeline based on damage and urgency"""
        damage_type = damage_assessment.get("type", "general")
        severity = damage_assessment.get("severity", "moderate")
        
        base_days = {
            "roof_leak": 2,
            "roof_damage": 4,
            "window_damage": 1,
            "siding_damage": 3,
            "general": 2
        }
        
        days = base_days.get(damage_type, 2)
        
        # Adjust for severity
        if severity == "severe":
            days += 2
        elif severity == "minor":
            days = max(1, days - 1)
            
        # Adjust for urgency
        if urgency == "emergency":
            return "Same day emergency service"
        elif urgency == "high":
            return f"1-{days} business days"
        else:
            return f"{days}-{days + 2} business days"
            
    def _generate_terms(self, urgency: str) -> List[str]:
        """Generate quote terms and conditions"""
        terms = [
            "Quote valid for 30 days from issue date",
            "50% deposit required before work begins",
            "Balance due upon completion",
            "All materials and labor guaranteed for 1 year",
            "Permit costs not included if required"
        ]
        
        if urgency == "emergency":
            terms.insert(1, "Emergency service requires 100% payment upon completion")
            
        return terms
        
    def format_quote_output(self, quote: Quote) -> Dict[str, Any]:
        """Format quote for output to other systems"""
        return {
            "quote_id": quote.quote_id,
            "customer": quote.customer_info,
            "damage_details": quote.damage_assessment,
            "line_items": {
                "materials": [
                    {
                        "name": item.name,
                        "quantity": item.quantity,
                        "unit": item.unit,
                        "unit_cost": item.unit_cost,
                        "total": item.total_cost,
                        "supplier": item.supplier
                    } for item in quote.materials
                ],
                "labor": [
                    {
                        "task": item.task,
                        "hours": item.hours,
                        "rate": item.rate,
                        "total": item.total_cost,
                        "skill_level": item.skill_level
                    } for item in quote.labor
                ]
            },
            "totals": {
                "subtotal": quote.subtotal,
                "tax_rate": quote.tax_rate,
                "tax_amount": quote.tax_amount,
                "total": quote.total
            },
            "timeline": quote.timeline,
            "valid_until": quote.valid_until.isoformat(),
            "terms": quote.terms,
            "created_at": quote.created_at.isoformat()
        }

async def test_quote_draft():
    """Test function for QuoteDraft agent"""
    quote_agent = QuoteDraft()
    
    test_assessments = [
        {
            "customer_info": {"name": "John Smith", "address": "123 Main St"},
            "damage_assessment": {
                "type": "roof_leak",
                "severity": "moderate", 
                "urgency": "high",
                "area": 200
            }
        },
        {
            "customer_info": {"name": "Jane Doe", "address": "456 Oak Ave"},
            "damage_assessment": {
                "type": "window_damage",
                "severity": "minor",
                "urgency": "medium",
                "area": 30
            }
        }
    ]
    
    for i, assessment in enumerate(test_assessments):
        print(f"\n--- Generating Test Quote {i+1} ---")
        quote = await quote_agent.generate_quote(assessment)
        output = quote_agent.format_quote_output(quote)
        
        print(f"Quote ID: {quote.quote_id}")
        print(f"Total: ${quote.total:.2f}")
        print(f"Timeline: {quote.timeline}")
        print(f"Materials: {len(quote.materials)} items")
        print(f"Labor Tasks: {len(quote.labor)} tasks")

if __name__ == "__main__":
    asyncio.run(test_quote_draft())