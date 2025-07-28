#!/usr/bin/env python3
"""
MaterialOrderBot Sub-Agent
Automatically orders materials based on approved quotes and scheduling
"""

import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import uuid

class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

@dataclass
class SupplierInfo:
    name: str
    contact: str
    api_endpoint: str
    delivery_days: int
    minimum_order: float
    payment_terms: str

@dataclass
class OrderItem:
    material_name: str
    quantity: float
    unit: str
    unit_cost: float
    total_cost: float
    supplier: str
    sku: str = ""
    availability: str = "in_stock"

@dataclass
class MaterialOrder:
    order_id: str
    quote_id: str
    customer_info: Dict[str, Any]
    job_site_address: str
    items: List[OrderItem]
    suppliers: List[SupplierInfo]
    subtotal: float
    shipping_cost: float
    total_cost: float
    delivery_date: datetime
    status: OrderStatus
    tracking_numbers: List[str]
    special_instructions: str
    created_at: datetime
    updated_at: datetime

class MaterialOrderBot:
    """
    Sub-agent for automatically ordering materials based on approved quotes
    """
    
    def __init__(self):
        self.setup_logging()
        self.supplier_database = self._load_supplier_database()
        self.inventory_buffer = 1.1  # 10% buffer for materials
        self.max_delivery_window = 7  # Maximum days for delivery
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('MaterialOrderBot')
        
    def _load_supplier_database(self) -> Dict[str, SupplierInfo]:
        """Load supplier information and capabilities"""
        return {
            "home_depot": SupplierInfo(
                name="Home Depot Pro",
                contact="1-800-HOME-DEPOT",
                api_endpoint="https://api.homedepot.com/pro",
                delivery_days=2,
                minimum_order=100.00,
                payment_terms="Net 30"
            ),
            "lowes": SupplierInfo(
                name="Lowe's Pro Services",
                contact="1-800-LOWES-PRO",
                api_endpoint="https://api.lowes.com/pro",
                delivery_days=3,
                minimum_order=150.00,
                payment_terms="Net 30"
            ),
            "abc_supply": SupplierInfo(
                name="ABC Supply Co",
                contact="1-800-ABC-SUPPLY",
                api_endpoint="https://api.abcsupply.com",
                delivery_days=1,
                minimum_order=500.00,
                payment_terms="Net 15"
            ),
            "glass_pro": SupplierInfo(
                name="Glass Pro Supply",
                contact="1-555-GLASS-PRO",
                api_endpoint="https://api.glasspro.com",
                delivery_days=5,
                minimum_order=200.00,
                payment_terms="COD"
            ),
            "gutter_supply": SupplierInfo(
                name="Professional Gutter Supply",
                contact="1-555-GUTTERS",
                api_endpoint="https://api.guttersupply.com",
                delivery_days=3,
                minimum_order=300.00,
                payment_terms="Net 30"
            ),
            "siding_world": SupplierInfo(
                name="Siding World Wholesale",
                contact="1-555-SIDING",
                api_endpoint="https://api.sidingworld.com",
                delivery_days=4,
                minimum_order=250.00,
                payment_terms="Net 30"
            )
        }
        
    async def process_quote_for_ordering(self, quote_data: Dict[str, Any], scheduling_data: Dict[str, Any]) -> MaterialOrder:
        """
        Process an approved quote and create material orders
        """
        try:
            quote_id = quote_data.get("quote_id")
            materials = quote_data.get("line_items", {}).get("materials", [])
            customer_info = quote_data.get("customer", {})
            
            # Verify quote approval
            if not self._verify_quote_approval(quote_data):
                raise ValueError("Quote not approved for material ordering")
                
            # Extract scheduling information
            start_date = datetime.fromisoformat(scheduling_data.get("start_date", datetime.now().isoformat()))
            job_site = scheduling_data.get("job_site_address", customer_info.get("address", ""))
            
            # Calculate required delivery date (1 day before start)
            delivery_date = start_date - timedelta(days=1)
            
            # Group materials by supplier
            supplier_groups = self._group_materials_by_supplier(materials)
            
            # Create order items with availability check
            order_items = []
            selected_suppliers = []
            
            for supplier_key, material_list in supplier_groups.items():
                supplier = self.supplier_database[supplier_key]
                
                # Check if we can meet delivery requirements
                if self._can_meet_delivery_date(supplier, delivery_date):
                    items = await self._create_order_items(material_list, supplier)
                    order_items.extend(items)
                    
                    if supplier not in selected_suppliers:
                        selected_suppliers.append(supplier)
                else:
                    # Find alternative supplier
                    alt_supplier = self._find_alternative_supplier(material_list, delivery_date)
                    if alt_supplier:
                        items = await self._create_order_items(material_list, alt_supplier)
                        order_items.extend(items)
                        
                        if alt_supplier not in selected_suppliers:
                            selected_suppliers.append(alt_supplier)
                    else:
                        self.logger.warning(f"Cannot meet delivery date for materials from {supplier.name}")
                        
            # Calculate costs
            subtotal = sum(item.total_cost for item in order_items)
            shipping_cost = self._calculate_shipping_cost(selected_suppliers, job_site)
            total_cost = subtotal + shipping_cost
            
            # Create order
            order = MaterialOrder(
                order_id=f"ORD-{str(uuid.uuid4())[:8].upper()}",
                quote_id=quote_id,
                customer_info=customer_info,
                job_site_address=job_site,
                items=order_items,
                suppliers=selected_suppliers,
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                total_cost=total_cost,
                delivery_date=delivery_date,
                status=OrderStatus.PENDING,
                tracking_numbers=[],
                special_instructions=scheduling_data.get("special_instructions", ""),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            # Submit orders to suppliers
            await self._submit_orders_to_suppliers(order)
            
            self.logger.info(f"Material order created: {order.order_id}, Total: ${total_cost:.2f}")
            return order
            
        except Exception as e:
            self.logger.error(f"Error processing quote for ordering: {e}")
            raise
            
    def _verify_quote_approval(self, quote_data: Dict[str, Any]) -> bool:
        """Verify that quote has been approved for material ordering"""
        # Check for approval indicators
        approval_status = quote_data.get("approval_status", "pending")
        payment_received = quote_data.get("payment", {}).get("deposit_received", False)
        contract_signed = quote_data.get("contract_signed", False)
        
        return approval_status == "approved" or payment_received or contract_signed
        
    def _group_materials_by_supplier(self, materials: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Group materials by their preferred suppliers"""
        supplier_groups = {}
        
        for material in materials:
            supplier_name = material.get("supplier", "").lower().replace(" ", "_").replace("'", "")
            
            # Map supplier names to database keys
            supplier_mapping = {
                "home_depot": "home_depot",
                "lowes": "lowes", 
                "lowe's": "lowes",
                "abc_supply": "abc_supply",
                "glass_pro": "glass_pro",
                "gutter_supply": "gutter_supply",
                "siding_world": "siding_world"
            }
            
            supplier_key = supplier_mapping.get(supplier_name, "home_depot")  # Default to Home Depot
            
            if supplier_key not in supplier_groups:
                supplier_groups[supplier_key] = []
                
            supplier_groups[supplier_key].append(material)
            
        return supplier_groups
        
    def _can_meet_delivery_date(self, supplier: SupplierInfo, required_date: datetime) -> bool:
        """Check if supplier can deliver by required date"""
        days_until_required = (required_date - datetime.now()).days
        return days_until_required >= supplier.delivery_days
        
    def _find_alternative_supplier(self, materials: List[Dict[str, Any]], delivery_date: datetime) -> Optional[SupplierInfo]:
        """Find alternative supplier that can meet delivery requirements"""
        for supplier in self.supplier_database.values():
            if self._can_meet_delivery_date(supplier, delivery_date):
                # Check if supplier can provide these materials (simplified check)
                return supplier
        return None
        
    async def _create_order_items(self, materials: List[Dict[str, Any]], supplier: SupplierInfo) -> List[OrderItem]:
        """Create order items for a specific supplier"""
        items = []
        
        for material in materials:
            # Apply inventory buffer
            quantity = material["quantity"] * self.inventory_buffer
            
            # Check availability (simulated)
            availability = await self._check_material_availability(material["name"], quantity, supplier)
            
            item = OrderItem(
                material_name=material["name"],
                quantity=quantity,
                unit=material["unit"],
                unit_cost=material["unit_cost"],
                total_cost=quantity * material["unit_cost"],
                supplier=supplier.name,
                sku=self._generate_sku(material["name"]),
                availability=availability
            )
            
            items.append(item)
            
        return items
        
    async def _check_material_availability(self, material_name: str, quantity: float, supplier: SupplierInfo) -> str:
        """Check material availability with supplier (simulated API call)"""
        # Simulate API call delay
        await asyncio.sleep(0.1)
        
        # Simulate availability responses
        if "emergency" in material_name.lower():
            return "limited_stock"
        elif quantity > 1000:
            return "special_order"
        else:
            return "in_stock"
            
    def _generate_sku(self, material_name: str) -> str:
        """Generate SKU for material (simplified)"""
        name_parts = material_name.upper().replace(" ", "").replace("-", "")[:6]
        return f"{name_parts}-{str(uuid.uuid4())[:4].upper()}"
        
    def _calculate_shipping_cost(self, suppliers: List[SupplierInfo], job_site: str) -> float:
        """Calculate shipping costs based on suppliers and delivery location"""
        base_shipping = 75.00  # Base shipping cost
        per_supplier_cost = 25.00  # Additional cost per supplier
        
        total_shipping = base_shipping + (len(suppliers) - 1) * per_supplier_cost
        
        # Apply distance multiplier (simplified)
        if "downtown" in job_site.lower():
            total_shipping *= 1.2  # Urban delivery surcharge
            
        return total_shipping
        
    async def _submit_orders_to_suppliers(self, order: MaterialOrder):
        """Submit orders to suppliers (simulated API calls)"""
        for supplier in order.suppliers:
            try:
                # Simulate API call to supplier
                await self._call_supplier_api(supplier, order)
                
                # Generate tracking number
                tracking_number = f"{supplier.name[:3].upper()}{str(uuid.uuid4())[:8].upper()}"
                order.tracking_numbers.append(tracking_number)
                
                self.logger.info(f"Order submitted to {supplier.name}, Tracking: {tracking_number}")
                
            except Exception as e:
                self.logger.error(f"Failed to submit order to {supplier.name}: {e}")
                
        # Update order status
        if order.tracking_numbers:
            order.status = OrderStatus.CONFIRMED
        order.updated_at = datetime.now()
        
    async def _call_supplier_api(self, supplier: SupplierInfo, order: MaterialOrder):
        """Make API call to supplier (simulated)"""
        # Simulate API call delay
        await asyncio.sleep(0.5)
        
        # Simulate API payload
        payload = {
            "order_id": order.order_id,
            "delivery_date": order.delivery_date.isoformat(),
            "delivery_address": order.job_site_address,
            "items": [
                {
                    "sku": item.sku,
                    "quantity": item.quantity,
                    "unit_cost": item.unit_cost
                } for item in order.items if item.supplier == supplier.name
            ]
        }
        
        self.logger.debug(f"API call to {supplier.api_endpoint}: {json.dumps(payload, indent=2)}")
        
    async def track_order_status(self, order_id: str) -> Dict[str, Any]:
        """Track the status of material orders"""
        # Simulate tracking lookup
        await asyncio.sleep(0.2)
        
        return {
            "order_id": order_id,
            "status": "confirmed",
            "estimated_delivery": (datetime.now() + timedelta(days=2)).isoformat(),
            "tracking_updates": [
                {"status": "confirmed", "timestamp": datetime.now().isoformat()},
                {"status": "shipped", "timestamp": (datetime.now() + timedelta(hours=6)).isoformat()}
            ]
        }
        
    def optimize_delivery_schedule(self, orders: List[MaterialOrder]) -> Dict[str, Any]:
        """Optimize delivery schedules across multiple orders"""
        delivery_schedule = {}
        
        for order in orders:
            delivery_date = order.delivery_date.strftime("%Y-%m-%d")
            
            if delivery_date not in delivery_schedule:
                delivery_schedule[delivery_date] = []
                
            delivery_schedule[delivery_date].append({
                "order_id": order.order_id,
                "job_site": order.job_site_address,
                "suppliers": [s.name for s in order.suppliers],
                "total_cost": order.total_cost
            })
            
        return {
            "optimized_schedule": delivery_schedule,
            "total_orders": len(orders),
            "delivery_dates": list(delivery_schedule.keys())
        }
        
    def format_order_output(self, order: MaterialOrder) -> Dict[str, Any]:
        """Format order for output to other systems"""
        return {
            "order_id": order.order_id,
            "quote_id": order.quote_id,
            "customer": order.customer_info,
            "job_site": order.job_site_address,
            "items": [
                {
                    "material": item.material_name,
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "unit_cost": item.unit_cost,
                    "total_cost": item.total_cost,
                    "supplier": item.supplier,
                    "sku": item.sku,
                    "availability": item.availability
                } for item in order.items
            ],
            "suppliers": [
                {
                    "name": supplier.name,
                    "contact": supplier.contact,
                    "delivery_days": supplier.delivery_days
                } for supplier in order.suppliers
            ],
            "costs": {
                "subtotal": order.subtotal,
                "shipping": order.shipping_cost,
                "total": order.total_cost
            },
            "delivery": {
                "scheduled_date": order.delivery_date.isoformat(),
                "tracking_numbers": order.tracking_numbers
            },
            "status": order.status.value,
            "special_instructions": order.special_instructions,
            "created_at": order.created_at.isoformat(),
            "updated_at": order.updated_at.isoformat()
        }

async def test_material_order_bot():
    """Test function for MaterialOrderBot agent"""
    order_bot = MaterialOrderBot()
    
    # Mock quote data
    quote_data = {
        "quote_id": "Q-12345678",
        "approval_status": "approved",
        "customer": {"name": "John Smith", "address": "123 Main St, Anytown, USA"},
        "line_items": {
            "materials": [
                {
                    "name": "Asphalt Shingles",
                    "quantity": 200,
                    "unit": "sq_ft",
                    "unit_cost": 3.50,
                    "supplier": "Home Depot"
                },
                {
                    "name": "Underlayment", 
                    "quantity": 200,
                    "unit": "sq_ft",
                    "unit_cost": 0.75,
                    "supplier": "ABC Supply"
                }
            ]
        }
    }
    
    # Mock scheduling data
    scheduling_data = {
        "start_date": (datetime.now() + timedelta(days=5)).isoformat(),
        "job_site_address": "123 Main St, Anytown, USA",
        "special_instructions": "Deliver to side driveway"
    }
    
    print("--- Testing Material Order Bot ---")
    
    # Test order creation
    order = await order_bot.process_quote_for_ordering(quote_data, scheduling_data)
    output = order_bot.format_order_output(order)
    
    print(f"Order ID: {order.order_id}")
    print(f"Total Cost: ${order.total_cost:.2f}")
    print(f"Delivery Date: {order.delivery_date.strftime('%Y-%m-%d')}")
    print(f"Number of Items: {len(order.items)}")
    print(f"Number of Suppliers: {len(order.suppliers)}")
    print(f"Status: {order.status.value}")
    
    # Test order tracking
    tracking_info = await order_bot.track_order_status(order.order_id)
    print(f"Tracking Status: {tracking_info['status']}")

if __name__ == "__main__":
    asyncio.run(test_material_order_bot())