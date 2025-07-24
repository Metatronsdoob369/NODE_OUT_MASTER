#!/usr/bin/env python3
"""
Payment Processor Agent
Handles Stripe payment processing, invoice generation, and payment workflows
"""

import os
import json
import asyncio
import logging
import stripe
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import uuid
from io import BytesIO
import base64
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('/Users/joewales/NODE_OUT_Master/AGENT/.env')

# Import the Quote class from quote_draft_agent
import sys
sys.path.append('/Users/joewales/NODE_OUT_Master/agents')
from quote_draft_agent import Quote

@dataclass
class PaymentIntent:
    payment_id: str
    quote_id: str
    amount: float
    currency: str
    status: str
    client_secret: str
    created_at: datetime
    customer_email: str

@dataclass
class Invoice:
    invoice_id: str
    quote_id: str
    payment_id: str
    pdf_data: bytes
    email_sent: bool
    created_at: datetime

class PaymentProcessor:
    """
    Payment processing agent that handles Stripe integration and invoice generation
    """
    
    def __init__(self):
        self.setup_logging()
        self.setup_stripe()
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('PaymentProcessor')
        
    def setup_stripe(self):
        """Initialize Stripe with API key"""
        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
        if not stripe.api_key:
            self.logger.warning("STRIPE_SECRET_KEY not found in environment variables")
        else:
            self.logger.info("Stripe initialized with environment key")
        
    async def create_payment_intent(self, quote: Quote, customer_email: str) -> PaymentIntent:
        """
        Create a Stripe payment intent for a quote
        """
        try:
            # Convert quote total to cents (Stripe uses cents)
            amount_cents = int(quote.total * 100)
            
            # Create payment intent with Stripe
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='usd',
                payment_method_types=['card'],
                description=f"Storm Damage Repair - Quote {quote.quote_id}",
                metadata={
                    'quote_id': quote.quote_id,
                    'customer_name': quote.customer_info.get('name', 'Unknown'),
                    'damage_type': quote.damage_assessment.get('type', 'general')
                }
            )
            
            payment_intent = PaymentIntent(
                payment_id=intent.id,
                quote_id=quote.quote_id,
                amount=quote.total,
                currency='usd',
                status=intent.status,
                client_secret=intent.client_secret,
                created_at=datetime.now(),
                customer_email=customer_email
            )
            
            self.logger.info(f"Payment intent created: {payment_intent.payment_id} for ${quote.total:.2f}")
            return payment_intent
            
        except Exception as e:
            self.logger.error(f"Error creating payment intent: {e}")
            raise
            
    async def check_payment_status(self, payment_id: str) -> str:
        """
        Check the status of a payment intent
        """
        try:
            intent = stripe.PaymentIntent.retrieve(payment_id)
            return intent.status
        except Exception as e:
            self.logger.error(f"Error checking payment status: {e}")
            return "error"
            
    async def process_deposit(self, quote: Quote, customer_email: str) -> PaymentIntent:
        """
        Process 50% deposit payment for regular jobs
        """
        # Create a copy of the quote with 50% total for deposit
        deposit_amount = quote.total * 0.5
        
        try:
            amount_cents = int(deposit_amount * 100)
            
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='usd',
                payment_method_types=['card'],
                description=f"50% Deposit - Storm Damage Repair - Quote {quote.quote_id}",
                metadata={
                    'quote_id': quote.quote_id,
                    'payment_type': 'deposit',
                    'customer_name': quote.customer_info.get('name', 'Unknown'),
                    'full_amount': str(quote.total)
                }
            )
            
            payment_intent = PaymentIntent(
                payment_id=intent.id,
                quote_id=quote.quote_id,
                amount=deposit_amount,
                currency='usd',
                status=intent.status,
                client_secret=intent.client_secret,
                created_at=datetime.now(),
                customer_email=customer_email
            )
            
            self.logger.info(f"Deposit payment intent created: {payment_intent.payment_id} for ${deposit_amount:.2f}")
            return payment_intent
            
        except Exception as e:
            self.logger.error(f"Error creating deposit payment: {e}")
            raise
            
    def generate_payment_link(self, payment_intent: PaymentIntent) -> str:
        """
        Generate a payment link for the customer
        """
        # Simple payment page URL with payment intent
        base_url = "https://your-domain.com/pay"  # Replace with your actual domain
        return f"{base_url}?payment_intent={payment_intent.client_secret}&quote_id={payment_intent.quote_id}"
        
    def generate_invoice_pdf(self, quote: Quote, payment_intent: PaymentIntent) -> bytes:
        """
        Generate a simple PDF invoice (basic HTML to PDF conversion)
        For production, use a proper PDF library like reportlab
        """
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - {quote.quote_id}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .invoice-details {{ margin-bottom: 20px; }}
                .line-items {{ margin: 20px 0; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
                .total {{ font-weight: bold; font-size: 18px; }}
                .terms {{ margin-top: 30px; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>STORM DAMAGE REPAIR INVOICE</h1>
                <h2>Quote ID: {quote.quote_id}</h2>
            </div>
            
            <div class="invoice-details">
                <p><strong>Customer:</strong> {quote.customer_info.get('name', 'N/A')}</p>
                <p><strong>Address:</strong> {quote.customer_info.get('address', 'N/A')}</p>
                <p><strong>Date:</strong> {quote.created_at.strftime('%Y-%m-%d')}</p>
                <p><strong>Payment ID:</strong> {payment_intent.payment_id}</p>
            </div>
            
            <div class="line-items">
                <h3>Materials</h3>
                <table>
                    <tr><th>Item</th><th>Quantity</th><th>Unit Cost</th><th>Total</th></tr>
        """
        
        for material in quote.materials:
            html_content += f"""
                    <tr>
                        <td>{material.name}</td>
                        <td>{material.quantity} {material.unit}</td>
                        <td>${material.unit_cost:.2f}</td>
                        <td>${material.total_cost:.2f}</td>
                    </tr>
            """
            
        html_content += """
                </table>
                
                <h3>Labor</h3>
                <table>
                    <tr><th>Task</th><th>Hours</th><th>Rate</th><th>Total</th></tr>
        """
        
        for labor in quote.labor:
            html_content += f"""
                    <tr>
                        <td>{labor.task}</td>
                        <td>{labor.hours:.1f}</td>
                        <td>${labor.rate:.2f}</td>
                        <td>${labor.total_cost:.2f}</td>
                    </tr>
            """
            
        html_content += f"""
                </table>
            </div>
            
            <div class="totals">
                <p>Subtotal: ${quote.subtotal:.2f}</p>
                <p>Tax ({quote.tax_rate*100:.1f}%): ${quote.tax_amount:.2f}</p>
                <p class="total">TOTAL: ${quote.total:.2f}</p>
            </div>
            
            <div class="terms">
                <h4>Terms & Conditions:</h4>
                <ul>
        """
        
        for term in quote.terms:
            html_content += f"<li>{term}</li>"
            
        html_content += """
                </ul>
            </div>
        </body>
        </html>
        """
        
        # For now, return HTML as bytes. In production, convert to PDF
        return html_content.encode('utf-8')
        
    async def send_payment_request(self, quote: Quote, customer_email: str, payment_type: str = "full") -> Dict[str, Any]:
        """
        Send payment request to customer via email/SMS
        """
        try:
            # Determine payment type
            if payment_type == "deposit":
                payment_intent = await self.process_deposit(quote, customer_email)
                subject = f"50% Deposit Required - Quote {quote.quote_id}"
                amount_text = f"${payment_intent.amount:.2f} (50% deposit)"
            else:
                payment_intent = await self.create_payment_intent(quote, customer_email)
                subject = f"Payment Required - Quote {quote.quote_id}"
                amount_text = f"${payment_intent.amount:.2f} (full amount)"
                
            # Generate payment link
            payment_link = self.generate_payment_link(payment_intent)
            
            # Generate invoice
            invoice_pdf = self.generate_invoice_pdf(quote, payment_intent)
            
            # Create email content
            email_content = f"""
            Dear {quote.customer_info.get('name', 'Customer')},
            
            Your storm damage repair quote is ready for payment.
            
            Quote ID: {quote.quote_id}
            Amount Due: {amount_text}
            
            Click here to pay securely: {payment_link}
            
            Timeline: {quote.timeline}
            
            Please review the attached invoice for complete details.
            
            Thank you for choosing our services!
            
            Best regards,
            Storm Damage Repair Team
            """
            
            # In production, integrate with email service (SendGrid, etc.)
            self.logger.info(f"Payment request prepared for {customer_email}")
            
            return {
                "payment_intent": payment_intent,
                "payment_link": payment_link,
                "email_content": email_content,
                "invoice_pdf": invoice_pdf,
                "status": "ready_to_send"
            }
            
        except Exception as e:
            self.logger.error(f"Error sending payment request: {e}")
            raise
            
    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle Stripe webhook events
        """
        try:
            event_type = webhook_data.get('type')
            
            if event_type == 'payment_intent.succeeded':
                payment_intent = webhook_data['data']['object']
                quote_id = payment_intent['metadata'].get('quote_id')
                
                self.logger.info(f"Payment succeeded for quote {quote_id}")
                
                return {
                    "status": "payment_succeeded",
                    "quote_id": quote_id,
                    "payment_id": payment_intent['id'],
                    "amount": payment_intent['amount'] / 100,  # Convert from cents
                    "action": "trigger_material_order"
                }
                
            elif event_type == 'payment_intent.payment_failed':
                payment_intent = webhook_data['data']['object']
                quote_id = payment_intent['metadata'].get('quote_id')
                
                self.logger.warning(f"Payment failed for quote {quote_id}")
                
                return {
                    "status": "payment_failed",
                    "quote_id": quote_id,
                    "payment_id": payment_intent['id'],
                    "action": "send_retry_notification"
                }
                
            return {"status": "webhook_handled", "event_type": event_type}
            
        except Exception as e:
            self.logger.error(f"Error handling webhook: {e}")
            return {"status": "webhook_error", "error": str(e)}

async def test_payment_processor():
    """Test function for PaymentProcessor agent"""
    processor = PaymentProcessor()
    
    # Import QuoteDraft for testing
    from quote_draft_agent import QuoteDraft
    quote_agent = QuoteDraft()
    
    # Generate a test quote
    test_assessment = {
        "customer_info": {"name": "John Smith", "address": "123 Main St", "email": "john@example.com"},
        "damage_assessment": {
            "type": "roof_damage",
            "severity": "moderate",
            "urgency": "high",
            "area": 150
        }
    }
    
    print("--- Generating Test Quote ---")
    quote = await quote_agent.generate_quote(test_assessment)
    
    print(f"Quote ID: {quote.quote_id}")
    print(f"Total: ${quote.total:.2f}")
    
    print("\n--- Creating Payment Intent ---")
    try:
        # Test payment request
        payment_request = await processor.send_payment_request(
            quote, 
            "john@example.com", 
            "deposit"
        )
        
        print(f"Payment Intent ID: {payment_request['payment_intent'].payment_id}")
        print(f"Payment Link: {payment_request['payment_link']}")
        print(f"Deposit Amount: ${payment_request['payment_intent'].amount:.2f}")
        
    except Exception as e:
        print(f"Payment test failed (expected without Stripe key): {e}")
        
    print("\n--- Payment Processor Ready ---")

if __name__ == "__main__":
    asyncio.run(test_payment_processor())