#!/usr/bin/env python3
"""
Payment API Server
Backend API to handle payment intent creation for the payment portal
"""

import os
import json
import asyncio
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
from dotenv import load_dotenv

# Import our universal payment processor
from universal_payment_processor import (
    UniversalPaymentProcessor, 
    PaymentRequest, 
    ServiceType,
    payment_processor
)

# Load environment variables from root config.env
load_dotenv('/Users/joewales/NODE_OUT_Master/config.env')

app = FastAPI(title="NODE OUT Payment API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (payment portal HTML)
app.mount("/static", StaticFiles(directory="."), name="static")

class PaymentIntentRequest(BaseModel):
    service_type: str
    service_name: str
    amount: float
    currency: str = "usd"
    customer_email: str = ""
    description: str = ""
    metadata: Dict[str, Any] = {}

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_id: str
    amount: float
    currency: str
    status: str

@app.get("/")
async def root():
    return {"message": "NODE OUT Payment API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "payment_api"}

@app.post("/api/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Stripe payment intent for the frontend
    """
    try:
        # Map service type string to enum
        service_type_map = {
            'storm_response': ServiceType.STORM_RESPONSE,
            'real_estate_content': ServiceType.REAL_ESTATE_CONTENT,
            'quote_generation': ServiceType.QUOTE_GENERATION,
            'seo_services': ServiceType.SEO_SERVICES,
            'ue5_visualization': ServiceType.UE5_VISUALIZATION,
            'market_intelligence': ServiceType.MARKET_INTELLIGENCE,
            'custom_service': ServiceType.CUSTOM_SERVICE
        }
        
        service_type = service_type_map.get(request.service_type, ServiceType.CUSTOM_SERVICE)
        
        # Create payment request
        payment_request = PaymentRequest(
            service_type=service_type,
            service_name=request.service_name,
            amount=request.amount,
            currency=request.currency,
            customer_email=request.customer_email,
            description=request.description,
            metadata=request.metadata,
            agent_id="payment_api"
        )
        
        # Process payment through universal processor
        result = await payment_processor.create_payment(payment_request)
        
        if result.status.value == "failed":
            raise HTTPException(
                status_code=400, 
                detail=f"Payment creation failed: {result.error_message}"
            )
        
        return PaymentIntentResponse(
            client_secret=result.client_secret,
            payment_id=result.payment_id,
            amount=result.amount,
            currency=result.currency,
            status=result.status.value
        )
        
    except Exception as e:
        print(f"❌ Payment intent creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/payment-status/{payment_id}")
async def get_payment_status(payment_id: str):
    """
    Check the status of a payment
    """
    try:
        status = await payment_processor.check_payment_status(payment_id)
        return {"payment_id": payment_id, "status": status.value}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Payment not found")

@app.get("/api/revenue-stats")
async def get_revenue_stats(service_type: Optional[str] = None):
    """
    Get revenue statistics
    """
    try:
        service_filter = None
        if service_type:
            service_type_map = {
                'storm_response': ServiceType.STORM_RESPONSE,
                'real_estate_content': ServiceType.REAL_ESTATE_CONTENT,
                'quote_generation': ServiceType.QUOTE_GENERATION,
                'seo_services': ServiceType.SEO_SERVICES,
                'ue5_visualization': ServiceType.UE5_VISUALIZATION,
                'market_intelligence': ServiceType.MARKET_INTELLIGENCE,
                'custom_service': ServiceType.CUSTOM_SERVICE
            }
            service_filter = service_type_map.get(service_type)
        
        stats = payment_processor.get_revenue_stats(service_filter)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/payment-portal")
async def payment_portal():
    """
    Serve the payment portal HTML
    """
    with open("payment_portal_glassmorphic.html", "r") as f:
        content = f.read()
    return content

if __name__ == "__main__":
    print("🚀 Starting NODE OUT Payment API Server...")
    print("💰 Payment processing ready!")
    print("📱 Payment portal: http://localhost:8080/payment-portal")
    print("📊 Revenue stats: http://localhost:8080/api/revenue-stats")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8080,
        reload=True
    )
