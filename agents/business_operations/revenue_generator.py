#!/usr/bin/env python3
"""
Revenue Generator - Complete Quote-to-Payment Pipeline
Orchestrates the entire revenue generation workflow
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import json

# Import our agents
from quote_draft_agent import QuoteDraft, Quote
from payment_processor_agent import PaymentProcessor

class RevenueGenerator:
    """
    Master agent that orchestrates the complete revenue generation pipeline
    """
    
    def __init__(self):
        self.setup_logging()
        self.quote_agent = QuoteDraft()
        self.payment_processor = PaymentProcessor()
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('RevenueGenerator')
        
    async def process_emergency_call(self, call_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Complete pipeline: Voice Call -> Quote -> Payment Request -> Revenue
        """
        try:
            self.logger.info(f"Processing emergency call for {call_data.get('customer_name', 'Unknown')}")
            
            # Step 1: Generate Quote
            quote = await self.quote_agent.generate_quote(call_data)
            self.logger.info(f"Quote generated: {quote.quote_id} - ${quote.total:.2f}")
            
            # Step 2: Determine payment type based on urgency
            urgency = call_data.get('damage_assessment', {}).get('urgency', 'medium')
            payment_type = "full" if urgency == "emergency" else "deposit"
            
            # Step 3: Create payment request
            customer_email = call_data.get('customer_info', {}).get('email', 'customer@example.com')
            
            payment_request = await self.payment_processor.send_payment_request(
                quote, customer_email, payment_type
            )
            
            # Step 4: Return complete revenue package
            revenue_result = {
                "status": "revenue_ready",
                "quote": self.quote_agent.format_quote_output(quote),
                "payment": {
                    "payment_id": payment_request['payment_intent'].payment_id,
                    "amount": payment_request['payment_intent'].amount,
                    "payment_link": payment_request['payment_link'],
                    "type": payment_type
                },
                "next_steps": {
                    "customer_action": "Pay via provided link",
                    "our_action": "Begin work on payment confirmation",
                    "timeline": quote.timeline
                },
                "revenue_potential": {
                    "immediate": payment_request['payment_intent'].amount,
                    "total_job": quote.total,
                    "profit_margin": quote.total * 0.35  # Estimated 35% margin
                }
            }
            
            self.logger.info(f"Revenue pipeline ready: ${payment_request['payment_intent'].amount:.2f} immediate")
            return revenue_result
            
        except Exception as e:
            self.logger.error(f"Revenue generation failed: {e}")
            return {"status": "error", "message": str(e)}
            
    async def handle_payment_success(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle successful payment and trigger next steps
        """
        try:
            quote_id = payment_data.get('quote_id')
            payment_amount = payment_data.get('amount', 0)
            
            self.logger.info(f"Payment succeeded: {quote_id} - ${payment_amount:.2f}")
            
            # In production, this would:
            # 1. Update quote status to "paid"
            # 2. Trigger material_order_bot
            # 3. Schedule work crew
            # 4. Send confirmation to customer
            # 5. Update CRM/accounting systems
            
            result = {
                "status": "payment_processed",
                "quote_id": quote_id,
                "amount_received": payment_amount,
                "next_actions": [
                    "Material order triggered",
                    "Work crew scheduled", 
                    "Customer confirmation sent"
                ],
                "revenue_captured": payment_amount
            }
            
            return result
            
        except Exception as e:
            self.logger.error(f"Payment processing failed: {e}")
            return {"status": "error", "message": str(e)}
            
    async def generate_daily_revenue_report(self) -> Dict[str, Any]:
        """
        Generate daily revenue and pipeline report
        """
        # In production, this would query your database
        # For now, return a sample report structure
        
        report = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "revenue_summary": {
                "quotes_generated": 12,
                "payments_received": 8,
                "total_revenue": 18750.00,
                "pending_payments": 6250.00,
                "conversion_rate": 66.7
            },
            "pipeline_health": {
                "emergency_calls": 5,
                "regular_quotes": 7, 
                "average_quote_value": 2343.75,
                "fastest_payment": "23 minutes",
                "revenue_per_hour": 1562.50
            },
            "next_24_hours": {
                "expected_payments": 4,
                "projected_revenue": 8750.00,
                "work_starts": 3
            }
        }
        
        return report

# Quick deployment functions for immediate revenue
async def emergency_hotline_handler(twilio_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle incoming Twilio calls for immediate revenue generation
    """
    revenue_gen = RevenueGenerator()
    
    # Extract call data (customize based on your Twilio integration)
    call_data = {
        "customer_info": {
            "name": twilio_data.get('caller_name', 'Emergency Caller'),
            "phone": twilio_data.get('from_number', ''),
            "address": twilio_data.get('address', 'Address needed'),
            "email": twilio_data.get('email', 'email@needed.com')
        },
        "damage_assessment": {
            "type": twilio_data.get('damage_type', 'roof_damage'),
            "severity": twilio_data.get('severity', 'moderate'),
            "urgency": "emergency",  # All hotline calls are emergency
            "area": int(twilio_data.get('area', 150))
        }
    }
    
    return await revenue_gen.process_emergency_call(call_data)

async def contractor_overflow_handler(quote_request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle contractor overflow requests for revenue sharing
    """
    revenue_gen = RevenueGenerator()
    
    # Process as regular (non-emergency) quote
    quote_request['damage_assessment']['urgency'] = 'high'
    
    return await revenue_gen.process_emergency_call(quote_request)

async def test_complete_revenue_pipeline():
    """
    Test the complete revenue generation pipeline
    """
    print("🚀 TESTING COMPLETE REVENUE PIPELINE")
    print("=" * 50)
    
    revenue_gen = RevenueGenerator()
    
    # Test data - simulate emergency call
    emergency_call = {
        "customer_info": {
            "name": "Sarah Johnson",
            "address": "456 Oak Street, Storm City, TX 75001",
            "phone": "+1-555-0123",
            "email": "sarah.johnson@email.com"
        },
        "damage_assessment": {
            "type": "roof_damage",
            "severity": "severe",
            "urgency": "emergency",
            "area": 300
        }
    }
    
    print(f"📞 Processing emergency call from {emergency_call['customer_info']['name']}")
    
    # Generate complete revenue pipeline
    result = await revenue_gen.process_emergency_call(emergency_call)
    
    if result['status'] == 'revenue_ready':
        print(f"✅ REVENUE PIPELINE SUCCESS!")
        print(f"💰 Immediate Revenue: ${result['revenue_potential']['immediate']:.2f}")
        print(f"💎 Total Job Value: ${result['revenue_potential']['total_job']:.2f}")
        print(f"📈 Estimated Profit: ${result['revenue_potential']['profit_margin']:.2f}")
        print(f"🔗 Payment Link: {result['payment']['payment_link']}")
        print(f"⏰ Timeline: {result['next_steps']['timeline']}")
        
        # Simulate payment success
        print("\n🎉 SIMULATING PAYMENT SUCCESS...")
        payment_success = await revenue_gen.handle_payment_success({
            "quote_id": result['quote']['quote_id'],
            "amount": result['payment']['amount']
        })
        
        if payment_success['status'] == 'payment_processed':
            print(f"💸 REVENUE CAPTURED: ${payment_success['revenue_captured']:.2f}")
            print("📋 Next Actions:")
            for action in payment_success['next_actions']:
                print(f"   • {action}")
                
    else:
        print(f"❌ Pipeline failed: {result.get('message', 'Unknown error')}")
    
    print("\n📊 DAILY REVENUE REPORT")
    report = await revenue_gen.generate_daily_revenue_report()
    print(f"💵 Today's Revenue: ${report['revenue_summary']['total_revenue']:,.2f}")
    print(f"📈 Conversion Rate: {report['revenue_summary']['conversion_rate']:.1f}%")
    print(f"⚡ Revenue/Hour: ${report['pipeline_health']['revenue_per_hour']:,.2f}")

if __name__ == "__main__":
    asyncio.run(test_complete_revenue_pipeline())