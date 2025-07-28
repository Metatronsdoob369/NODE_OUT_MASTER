#!/usr/bin/env python3
"""
Universal Modular Payment Processor
A flexible payment processing system that any agent can use for revenue generation
"""

import os
import json
import asyncio
import logging
import stripe
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
import uuid
from enum import Enum
from dotenv import load_dotenv

# Load environment variables from root config.env
load_dotenv('/Users/joewales/NODE_OUT_Master/config.env')

class PaymentStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELED = "canceled"

class ServiceType(Enum):
    REAL_ESTATE_CONTENT = "real_estate_content"
    QUOTE_GENERATION = "quote_generation"
    STORM_RESPONSE = "storm_response"
    SEO_SERVICES = "seo_services"
    UE5_VISUALIZATION = "ue5_visualization"
    MARKET_INTELLIGENCE = "market_intelligence"
    CUSTOM_SERVICE = "custom_service"

@dataclass
class PaymentRequest:
    """Universal payment request that any agent can create"""
    service_type: ServiceType
    service_name: str
    amount: float
    currency: str = "usd"
    customer_email: str = ""
    customer_name: str = ""
    description: str = ""
    metadata: Dict[str, Any] = None
    agent_id: str = ""
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
        if not self.agent_id:
            self.agent_id = str(uuid.uuid4())

@dataclass
class PaymentResult:
    """Universal payment result that agents receive"""
    payment_id: str
    status: PaymentStatus
    client_secret: str
    amount: float
    currency: str
    service_type: ServiceType
    created_at: datetime
    payment_url: str = ""
    error_message: str = ""
    metadata: Dict[str, Any] = None

class UniversalPaymentProcessor:
    """
    Universal payment processor that any agent can use
    Handles Stripe integration, multiple service types, and revenue tracking
    """
    
    def __init__(self):
        self.setup_logging()
        self.setup_stripe()
        self.payments_db = {}  # In-memory storage (could be replaced with Firebase)
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('UniversalPaymentProcessor')
        
    def setup_stripe(self):
        """Initialize Stripe with API key"""
        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
        if not stripe.api_key:
            self.logger.warning("STRIPE_SECRET_KEY not found - using test mode")
            stripe.api_key = "sk_test_..."  # Placeholder for test mode
        else:
            self.logger.info("✅ Stripe initialized successfully")
    
    async def create_payment(self, request: PaymentRequest) -> PaymentResult:
        """
        Create a payment for any service type
        """
        try:
            payment_id = str(uuid.uuid4())
            amount_cents = int(request.amount * 100)
            
            # Create Stripe payment intent
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=request.currency,
                metadata={
                    'service_type': request.service_type.value,
                    'service_name': request.service_name,
                    'agent_id': request.agent_id,
                    **request.metadata
                },
                description=f"{request.service_name} - {request.description}",
                receipt_email=request.customer_email if request.customer_email else None
            )
            
            # Create payment result
            result = PaymentResult(
                payment_id=payment_id,
                status=PaymentStatus.PENDING,
                client_secret=intent.client_secret,
                amount=request.amount,
                currency=request.currency,
                service_type=request.service_type,
                created_at=datetime.now(),
                payment_url=f"http://localhost:5175/payment_portal_glassmorphic.html?payment_intent={intent.id}&service={request.service_type.value}",
                metadata=request.metadata
            )
            
            # Store payment in database
            self.payments_db[payment_id] = {
                'request': asdict(request),
                'result': asdict(result),
                'stripe_intent_id': intent.id
            }
            
            self.logger.info(f"✅ Payment created: {payment_id} for {request.service_name} - ${request.amount}")
            return result
            
        except Exception as e:
            self.logger.error(f"❌ Payment creation failed: {str(e)}")
            return PaymentResult(
                payment_id="",
                status=PaymentStatus.FAILED,
                client_secret="",
                amount=request.amount,
                currency=request.currency,
                service_type=request.service_type,
                created_at=datetime.now(),
                error_message=str(e)
            )
    
    async def check_payment_status(self, payment_id: str) -> PaymentStatus:
        """Check the status of a payment"""
        try:
            if payment_id not in self.payments_db:
                return PaymentStatus.FAILED
                
            stripe_intent_id = self.payments_db[payment_id]['stripe_intent_id']
            intent = stripe.PaymentIntent.retrieve(stripe_intent_id)
            
            status_map = {
                'succeeded': PaymentStatus.SUCCEEDED,
                'processing': PaymentStatus.PROCESSING,
                'requires_payment_method': PaymentStatus.PENDING,
                'requires_confirmation': PaymentStatus.PENDING,
                'requires_action': PaymentStatus.PENDING,
                'canceled': PaymentStatus.CANCELED
            }
            
            return status_map.get(intent.status, PaymentStatus.FAILED)
            
        except Exception as e:
            self.logger.error(f"❌ Status check failed: {str(e)}")
            return PaymentStatus.FAILED
    
    def get_revenue_stats(self, service_type: ServiceType = None) -> Dict[str, Any]:
        """Get revenue statistics for all services or specific service type"""
        stats = {
            'total_payments': 0,
            'total_revenue': 0.0,
            'successful_payments': 0,
            'pending_payments': 0,
            'failed_payments': 0,
            'by_service_type': {}
        }
        
        for payment_data in self.payments_db.values():
            result = payment_data['result']
            payment_service_type = ServiceType(result['service_type'])
            
            # Filter by service type if specified
            if service_type and payment_service_type != service_type:
                continue
                
            stats['total_payments'] += 1
            
            if result['status'] == PaymentStatus.SUCCEEDED.value:
                stats['successful_payments'] += 1
                stats['total_revenue'] += result['amount']
            elif result['status'] == PaymentStatus.PENDING.value:
                stats['pending_payments'] += 1
            else:
                stats['failed_payments'] += 1
            
            # Track by service type
            service_name = payment_service_type.value
            if service_name not in stats['by_service_type']:
                stats['by_service_type'][service_name] = {
                    'count': 0,
                    'revenue': 0.0
                }
            
            stats['by_service_type'][service_name]['count'] += 1
            if result['status'] == PaymentStatus.SUCCEEDED.value:
                stats['by_service_type'][service_name]['revenue'] += result['amount']
        
        return stats

# Convenience functions for agents to use
def create_real_estate_payment(service_name: str, amount: float, customer_email: str, description: str = "") -> PaymentRequest:
    """Quick function for real estate agents to create payments"""
    return PaymentRequest(
        service_type=ServiceType.REAL_ESTATE_CONTENT,
        service_name=service_name,
        amount=amount,
        customer_email=customer_email,
        description=description,
        agent_id="real_estate_agent"
    )

def create_storm_response_payment(service_name: str, amount: float, customer_email: str, emergency_type: str = "") -> PaymentRequest:
    """Quick function for storm response agents to create payments"""
    return PaymentRequest(
        service_type=ServiceType.STORM_RESPONSE,
        service_name=service_name,
        amount=amount,
        customer_email=customer_email,
        description=f"Emergency Response: {emergency_type}",
        metadata={"emergency_type": emergency_type},
        agent_id="storm_response_agent"
    )

def create_ue5_visualization_payment(service_name: str, amount: float, customer_email: str, property_address: str = "") -> PaymentRequest:
    """Quick function for UE5 agents to create payments"""
    return PaymentRequest(
        service_type=ServiceType.UE5_VISUALIZATION,
        service_name=service_name,
        amount=amount,
        customer_email=customer_email,
        description=f"3D Property Visualization: {property_address}",
        metadata={"property_address": property_address},
        agent_id="ue5_agent"
    )

# Global processor instance
payment_processor = UniversalPaymentProcessor()

# Example usage for agents
async def example_usage():
    """Example of how agents can use the universal payment processor"""
    
    # Real estate agent creates a payment
    real_estate_request = create_real_estate_payment(
        service_name="Property Listing Content Package",
        amount=299.99,
        customer_email="client@example.com",
        description="Complete listing description, photos, and marketing copy"
    )
    
    result = await payment_processor.create_payment(real_estate_request)
    print(f"Payment URL: {result.payment_url}")
    
    # Check revenue stats
    stats = payment_processor.get_revenue_stats()
    print(f"Total Revenue: ${stats['total_revenue']}")

if __name__ == "__main__":
    asyncio.run(example_usage())
