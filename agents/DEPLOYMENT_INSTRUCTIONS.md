# Payment Portal Deployment Instructions

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

Your payment portal is now ready for production use!