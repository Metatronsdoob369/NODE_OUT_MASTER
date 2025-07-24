#!/usr/bin/env python3
"""
Payment Portal Deployment Script
Deploy payment portal to production environment with proper HTTPS
"""

import os
import json
from datetime import datetime

class PaymentPortalDeployer:
    """
    Deploy payment portal to production environment
    """
    
    def __init__(self):
        self.deployment_options = self.load_deployment_options()
        
    def load_deployment_options(self):
        """Load deployment platform options"""
        return {
            'netlify': {
                'name': 'Netlify',
                'cost': 'Free tier available',
                'setup_time': '5 minutes',
                'https': 'Automatic',
                'custom_domain': 'Yes',
                'pros': ['Easy deployment', 'Free HTTPS', 'CDN included'],
                'deployment_method': 'Git push or drag-and-drop'
            },
            'vercel': {
                'name': 'Vercel',
                'cost': 'Free tier available',
                'setup_time': '3 minutes',
                'https': 'Automatic',
                'custom_domain': 'Yes',
                'pros': ['Instant deployment', 'Free HTTPS', 'Fast CDN'],
                'deployment_method': 'Git push or CLI'
            },
            'github_pages': {
                'name': 'GitHub Pages',
                'cost': 'Free',
                'setup_time': '10 minutes',
                'https': 'Automatic with custom domain',
                'custom_domain': 'Yes',
                'pros': ['Free', 'Git integration', 'Reliable'],
                'deployment_method': 'Git repository'
            },
            'aws_s3': {
                'name': 'AWS S3 + CloudFront',
                'cost': '$1-5/month',
                'setup_time': '15 minutes',
                'https': 'Via CloudFront',
                'custom_domain': 'Yes',
                'pros': ['Professional', 'Scalable', 'Full control'],
                'deployment_method': 'AWS CLI or console'
            }
        }
    
    def create_deployment_ready_files(self):
        """Create production-ready payment portal files"""
        
        # Create index.html (production version)
        self.create_production_html()
        
        # Create deployment configuration files
        self.create_netlify_config()
        self.create_vercel_config()
        self.create_deployment_instructions()
        
        print("✅ Production-ready files created!")
        print("📁 Files ready for deployment:")
        print("   • index.html (production payment portal)")
        print("   • netlify.toml (Netlify configuration)")
        print("   • vercel.json (Vercel configuration)")
        print("   • DEPLOYMENT_INSTRUCTIONS.md")
    
    def create_production_html(self):
        """Create production-ready HTML file"""
        
        # Read the professional payment portal
        with open('/Users/joewales/NODE_OUT_Master/agents/payment_portal_professional.html', 'r') as f:
            html_content = f.read()
        
        # Update for production environment
        production_html = html_content.replace(
            'http://localhost:8002', 
            'https://stormrepairpro-payments.netlify.app'  # Will be updated with actual domain
        )
        
        # Add production meta tags
        meta_tags = '''    <meta name="description" content="Storm Repair Pro - Secure payment portal for emergency storm damage repair services in Birmingham, AL">
    <meta name="keywords" content="storm damage repair, Birmingham AL, emergency roof repair, payment portal">
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="https://stormrepairpro-payments.netlify.app">'''
        
        production_html = production_html.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            f'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n{meta_tags}'
        )
        
        # Save as index.html for deployment
        with open('/Users/joewales/NODE_OUT_Master/agents/index.html', 'w') as f:
            f.write(production_html)
    
    def create_netlify_config(self):
        """Create Netlify deployment configuration"""
        netlify_config = '''[build]
  publish = "."
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;"

[[redirects]]
  from = "/payment/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/"
  to = "/index.html"
  status = 200'''

        with open('/Users/joewales/NODE_OUT_Master/agents/netlify.toml', 'w') as f:
            f.write(netlify_config)
    
    def create_vercel_config(self):
        """Create Vercel deployment configuration"""
        vercel_config = {
            "version": 2,
            "name": "storm-repair-pro-payments",
            "builds": [
                {
                    "src": "index.html",
                    "use": "@vercel/static"
                }
            ],
            "routes": [
                {
                    "src": "/(.*)",
                    "dest": "/index.html"
                }
            ],
            "headers": [
                {
                    "source": "/(.*)",
                    "headers": [
                        {
                            "key": "X-Frame-Options",
                            "value": "DENY"
                        },
                        {
                            "key": "X-Content-Type-Options",
                            "value": "nosniff"
                        },
                        {
                            "key": "X-XSS-Protection",
                            "value": "1; mode=block"
                        }
                    ]
                }
            ]
        }
        
        with open('/Users/joewales/NODE_OUT_Master/agents/vercel.json', 'w') as f:
            json.dump(vercel_config, f, indent=2)
    
    def create_deployment_instructions(self):
        """Create deployment instructions"""
        instructions = '''# Payment Portal Deployment Instructions

## Option 1: Netlify (Recommended - Easiest)

### Quick Deploy (5 minutes):
1. Go to netlify.com and sign up
2. Drag and drop these files into Netlify dashboard:
   - index.html
   - netlify.toml
3. Your site will be live at: https://[random-name].netlify.app
4. Custom domain: Add your domain in Site Settings > Domain Management

### Files needed:
- ✅ index.html (payment portal)
- ✅ netlify.toml (configuration)

---

## Option 2: Vercel (Fast Alternative)

### Quick Deploy (3 minutes):
1. Go to vercel.com and sign up
2. Import from Git or upload files:
   - index.html
   - vercel.json
3. Site live at: https://[project-name].vercel.app
4. Custom domain: Add in Project Settings > Domains

### Files needed:
- ✅ index.html (payment portal)
- ✅ vercel.json (configuration)

---

## Option 3: GitHub Pages (Free)

### Setup (10 minutes):
1. Create new GitHub repository: "storm-repair-payments"
2. Upload index.html to repository
3. Go to Settings > Pages
4. Select "Deploy from main branch"
5. Site live at: https://[username].github.io/storm-repair-payments

### Files needed:
- ✅ index.html (payment portal)

---

## After Deployment:

### 1. Update Payment Links
Replace localhost URLs in your quote system with production URL:
```
OLD: http://localhost:8002/payment_portal_professional.html
NEW: https://your-domain.com/?payment_intent=[ID]&quote_id=[ID]
```

### 2. Test Payment Flow
1. Generate test payment intent with Stripe
2. Visit: https://your-domain.com/?payment_intent=pi_test_xxx&quote_id=Q-TEST
3. Complete test payment
4. Verify webhook delivery

### 3. Update Quote Generator
In revenue_generator.py, update payment link generation:
```python
base_url = "https://your-production-domain.com"
return f"{base_url}/?payment_intent={payment_intent.client_secret}&quote_id={payment_intent.quote_id}"
```

### 4. Custom Domain (Recommended)
- Buy domain: stormrepairpro.com
- Payment portal: payments.stormrepairpro.com
- Professional appearance builds trust

---

## Security Checklist:
- ✅ HTTPS enabled (automatic on all platforms)
- ✅ Security headers configured
- ✅ Stripe integration secure
- ✅ No sensitive data in frontend code
- ✅ Payment processing PCI compliant

---

## Testing Your Deployment:
1. Visit deployed URL
2. Check console for errors
3. Test Stripe integration
4. Verify mobile responsiveness
5. Test payment flow end-to-end

Your payment portal is now ready for production use!'''

        with open('/Users/joewales/NODE_OUT_Master/agents/DEPLOYMENT_INSTRUCTIONS.md', 'w') as f:
            f.write(instructions)
    
    def update_revenue_generator_for_production(self):
        """Update revenue generator to use production payment portal"""
        
        # Read current revenue generator
        with open('/Users/joewales/NODE_OUT_Master/agents/revenue_generator.py', 'r') as f:
            content = f.read()
        
        # Update payment link generation
        updated_content = content.replace(
            'base_url = "https://your-domain.com/pay"',
            'base_url = "https://stormrepairpro-payments.netlify.app"  # Update with your actual domain'
        )
        
        # Add production payment link method
        production_method = '''
    def generate_production_payment_link(self, payment_intent: PaymentIntent) -> str:
        """Generate production payment link"""
        base_url = "https://stormrepairpro-payments.netlify.app"  # Update with your domain
        return f"{base_url}/?payment_intent={payment_intent.client_secret}&quote_id={payment_intent.quote_id}"
'''
        
        # Insert before the existing generate_payment_link method
        updated_content = updated_content.replace(
            'def generate_payment_link(self, payment_intent: PaymentIntent) -> str:',
            f'{production_method}\n    def generate_payment_link(self, payment_intent: PaymentIntent) -> str:'
        )
        
        # Save updated file
        with open('/Users/joewales/NODE_OUT_Master/agents/revenue_generator_production.py', 'w') as f:
            f.write(updated_content)
        
        print("✅ Revenue generator updated for production deployment")

def deploy_payment_portal():
    """Main deployment function"""
    print("🚀 PAYMENT PORTAL PRODUCTION DEPLOYMENT")
    print("=" * 60)
    
    deployer = PaymentPortalDeployer()
    
    # Create deployment files
    deployer.create_deployment_ready_files()
    
    # Update revenue generator
    deployer.update_revenue_generator_for_production()
    
    print(f"\n📋 DEPLOYMENT OPTIONS:")
    for option, details in deployer.deployment_options.items():
        print(f"\n{option.upper()}:")
        print(f"   Cost: {details['cost']}")
        print(f"   Setup Time: {details['setup_time']}")
        print(f"   HTTPS: {details['https']}")
        print(f"   Method: {details['deployment_method']}")
    
    print(f"\n🎯 RECOMMENDED: Netlify")
    print(f"   1. Go to netlify.com")
    print(f"   2. Drag & drop: index.html + netlify.toml")
    print(f"   3. Live in 2 minutes with HTTPS")
    
    print(f"\n✅ PRODUCTION DEPLOYMENT READY!")
    print(f"📁 Files created in agents directory:")
    print(f"   • index.html (production payment portal)")
    print(f"   • netlify.toml (Netlify config)")
    print(f"   • vercel.json (Vercel config)")
    print(f"   • DEPLOYMENT_INSTRUCTIONS.md (step-by-step guide)")
    print(f"   • revenue_generator_production.py (updated for production)")

if __name__ == "__main__":
    deploy_payment_portal()