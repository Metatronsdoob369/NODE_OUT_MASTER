# 🌪️ STORM PAYMENT PORTAL - DOMAIN DEPLOYMENT GUIDE

## Your Domain: node-storm.com

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
Value: node-storm.com
TTL: 1 Hour
```

### STEP 2: GITHUB PAGES SETUP
1. Create new GitHub repository: `stormrepairpro-com-storm-portal`
2. Upload files from: `/Users/joewales/NODE_OUT_Master/domain_deployment/`
3. Go to Settings → Pages
4. Source: Deploy from branch → main
5. Custom domain: stormrepairpro.com
6. Enforce HTTPS: ✅ Enabled

### STEP 3: FILE UPLOAD TO GITHUB
```bash
cd /Users/joewales/NODE_OUT_Master/domain_deployment
git init
git add .
git commit -m "Deploy storm payment portal to stormrepairpro.com"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stormrepairpro-com-storm-portal.git
git push -u origin main
```

### STEP 4: VERIFY DEPLOYMENT
- Wait 5-10 minutes for DNS propagation
- Visit: https://stormrepairpro.com
- Test payment flow with Stripe test cards
- Verify SSL certificate is active

### STEP 5: STRIPE CONFIGURATION
Update Stripe settings:
- Authorized domains: stormrepairpro.com
- Webhook endpoints: https://stormrepairpro.com/webhook
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
- Portal Status: https://stormrepairpro.com
- Payment Issues: Check Stripe Dashboard
- DNS Issues: GoDaddy Support

---
Generated: 2025-07-27 11:59:37
Deployment Ready: ✅
