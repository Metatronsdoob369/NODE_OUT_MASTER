#!/usr/bin/env python3
"""
Deploy NODE Storm Payment Portal to GoDaddy Domain
Complete setup for independent domain deployment
"""

import os
import shutil
import json
from datetime import datetime

def create_domain_deployment():
    """Create complete deployment package for GoDaddy domain"""
    
    print("🚀 DEPLOYING STORM PORTAL TO GODADDY DOMAIN")
    print("=" * 50)
    
    # Create deployment package
    deploy_dir = "/Users/joewales/NODE_OUT_Master/domain_deployment"
    if os.path.exists(deploy_dir):
        shutil.rmtree(deploy_dir)
    os.makedirs(deploy_dir)
    
    # Copy the 8-service payment portal
    portal_source = "/Users/joewales/NODE_OUT_Master/agents/payment_portal_professional.html"
    
    if os.path.exists(portal_source):
        shutil.copy(portal_source, f"{deploy_dir}/index.html")
        print("✅ Professional payment portal copied")
    else:
        print("❌ Payment portal not found!")
        return
    
    # Create CNAME file for custom domain
    print("\n📋 DOMAIN SETUP INSTRUCTIONS:")
    print("=" * 30)
    
    domain_name = "node-storm.com"  # User's actual domain
    
    if not domain_name:
        print("❌ Domain name required!")
        return
    
    # Create CNAME file
    with open(f"{deploy_dir}/CNAME", "w") as f:
        f.write(domain_name)
    print(f"✅ CNAME file created for: {domain_name}")
    
    # Create .htaccess for proper routing
    htaccess_content = """RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache static assets
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
"""
    
    with open(f"{deploy_dir}/.htaccess", "w") as f:
        f.write(htaccess_content)
    print("✅ .htaccess file created with security headers")
    
    # Create deployment instructions
    instructions = f"""# 🌪️ STORM PAYMENT PORTAL - DOMAIN DEPLOYMENT GUIDE

## Your Domain: {domain_name}

### STEP 1: GODADDY DNS SETUP
1. Log into GoDaddy DNS Management
2. Add these DNS records:

**A Records (Required):**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 1 Hour

Type: A  
Name: @
Value: 185.199.109.153
TTL: 1 Hour

Type: A
Name: @
Value: 185.199.110.153  
TTL: 1 Hour

Type: A
Name: @
Value: 185.199.111.153
TTL: 1 Hour
```

**CNAME Record (for www):**
```
Type: CNAME
Name: www
Value: {domain_name}
TTL: 1 Hour
```

### STEP 2: GITHUB PAGES SETUP
1. Create new GitHub repository: `{domain_name.replace('.', '-')}-storm-portal`
2. Upload files from: `{deploy_dir}/`
3. Go to Settings → Pages
4. Source: Deploy from branch → main
5. Custom domain: {domain_name}
6. Enforce HTTPS: ✅ Enabled

### STEP 3: FILE UPLOAD TO GITHUB
```bash
cd {deploy_dir}
git init
git add .
git commit -m "Deploy storm payment portal to {domain_name}"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/{domain_name.replace('.', '-')}-storm-portal.git
git push -u origin main
```

### STEP 4: VERIFY DEPLOYMENT
- Wait 5-10 minutes for DNS propagation
- Visit: https://{domain_name}
- Test payment flow with Stripe test cards
- Verify SSL certificate is active

### STEP 5: STRIPE CONFIGURATION
Update Stripe settings:
- Authorized domains: {domain_name}
- Webhook endpoints: https://{domain_name}/webhook
- Update publishable key in index.html if needed

## 🎯 8 SERVICES AVAILABLE:
1. Emergency Storm Inspection - From: $295.00
2. Comprehensive Assessment - From: $495.00  
3. Free Roof Estimate - From: FREE
4. Emergency Tarp Installation - From: $850.00
5. Full Roof Replacement - From: $15,000.00
6. Gutter Repair - From: $750.00
7. Siding Repair - From: $1,250.00
8. Insurance Claim Assist - From: $200.00

## 📞 SUPPORT
- Portal Status: https://{domain_name}
- Payment Issues: Check Stripe Dashboard
- DNS Issues: GoDaddy Support

---
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Deployment Ready: ✅
"""
    
    with open(f"{deploy_dir}/DEPLOYMENT_INSTRUCTIONS.md", "w") as f:
        f.write(instructions)
    
    # Create simple upload script
    upload_script = f"""#!/bin/bash
# Quick deployment script for {domain_name}

echo "🚀 Deploying to {domain_name}..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/YOUR_USERNAME/{domain_name.replace('.', '-')}-storm-portal.git
fi

# Deploy
git add .
git commit -m "Update storm portal - $(date)"
git push origin main

echo "✅ Deployed to GitHub Pages"
echo "🌐 Visit: https://{domain_name}"
echo "⏱️  Allow 5-10 minutes for DNS propagation"
"""
    
    with open(f"{deploy_dir}/deploy.sh", "w") as f:
        f.write(upload_script)
    os.chmod(f"{deploy_dir}/deploy.sh", 0o755)
    
    print(f"\n✅ DEPLOYMENT PACKAGE CREATED")
    print(f"📁 Location: {deploy_dir}")
    print(f"🌐 Domain: {domain_name}")
    print(f"\n📋 NEXT STEPS:")
    print(f"1. Read: {deploy_dir}/DEPLOYMENT_INSTRUCTIONS.md")
    print(f"2. Setup GoDaddy DNS records")
    print(f"3. Create GitHub repository")
    print(f"4. Upload files and configure Pages")
    print(f"\n🎯 Your storm portal will be live at: https://{domain_name}")
    
    return deploy_dir, domain_name

def create_backup_deployment_options():
    """Create alternative deployment options"""
    
    print("\n🔧 ALTERNATIVE DEPLOYMENT OPTIONS:")
    print("=" * 40)
    
    alternatives = """
## Option 1: Direct GoDaddy Hosting
1. Use GoDaddy's Website Builder
2. Upload index.html to File Manager
3. Point domain to hosting

## Option 2: Netlify + GoDaddy Domain
1. Deploy to Netlify (drag & drop)
2. Configure custom domain in Netlify
3. Update GoDaddy DNS to Netlify

## Option 3: Vercel + GoDaddy Domain  
1. Deploy to Vercel via GitHub
2. Add custom domain in Vercel
3. Update GoDaddy DNS to Vercel

## Option 4: Cloudflare Pages
1. Connect GitHub to Cloudflare Pages
2. Set custom domain
3. Update GoDaddy nameservers
"""
    
    print(alternatives)

if __name__ == "__main__":
    try:
        deploy_dir, domain = create_domain_deployment()
        create_backup_deployment_options()
        
        print(f"\n🎯 READY TO DEPLOY STORM PORTAL")
        print(f"Domain: {domain}")
        print(f"Portal: 8 professional storm services")
        print(f"Payment: Stripe integration ready")
        
    except KeyboardInterrupt:
        print("\n❌ Deployment cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")