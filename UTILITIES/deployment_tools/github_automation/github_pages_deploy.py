#!/usr/bin/env python3
"""
Deploy NODE Storm Payment Portal to GitHub Pages
Creates deployment package ready for GitHub Pages
"""

import os
import subprocess
import shutil

def main():
    print("🚀 Preparing NODE Storm Payment Portal for GitHub Pages...")
    print("=" * 60)
    
    # Create deployment directory
    deploy_dir = "/tmp/node-storm-payment"
    if os.path.exists(deploy_dir):
        shutil.rmtree(deploy_dir)
    os.makedirs(deploy_dir)
    
    # Copy payment portal
    portal_file = "/Users/joewales/NODE_OUT_Master/agents/payment_portal_professional.html"
    if os.path.exists(portal_file):
        shutil.copy(portal_file, f"{deploy_dir}/index.html")
        print("✅ Payment portal copied as index.html")
    else:
        print("❌ Payment portal not found!")
        return
    
    # Create README
    readme_content = """# NODE Storm Payment Portal

🌪️ Professional storm damage response payment system for Birmingham, AL.

## Live Payment Portal
Access at: **[Your GitHub Pages URL]**

## Features
- ✅ 8 Storm Response Services
- ✅ Stripe Payment Integration  
- ✅ SMS Confirmations via Twilio
- ✅ Professional Design
- ✅ Emergency Response Available

## Services Available
1. **Emergency Storm Inspection** - From: $295.00
2. **Comprehensive Assessment** - From: $495.00  
3. **Free Roof Estimate** - From: FREE
4. **Emergency Tarp Installation** - From: $850.00
5. **Full Roof Replacement** - From: $15,000.00
6. **Gutter Repair** - From: $750.00
7. **Siding Repair** - From: $1,250.00
8. **Insurance Claim Assist** - From: $200.00

## Contact
- **Emergency Line**: (205) 555-NODE
- **Location**: Birmingham, AL
- **Owner**: Preston

🚀 **Ready for immediate customer payments!**
"""
    
    with open(f"{deploy_dir}/README.md", "w") as f:
        f.write(readme_content)
    
    print("✅ README.md created")
    
    # Initialize git
    os.chdir(deploy_dir)
    subprocess.run(["git", "init"], capture_output=True)
    subprocess.run(["git", "add", "."], capture_output=True)
    subprocess.run(["git", "commit", "-m", "Deploy NODE Storm Payment Portal"], capture_output=True)
    
    print("\n🎯 GITHUB PAGES DEPLOYMENT READY!")
    print("=" * 50)
    print("📁 Files prepared in:", deploy_dir)
    print("")
    print("🔗 QUICK DEPLOYMENT STEPS:")
    print("1. Create new GitHub repository: 'node-storm-payment'")
    print("2. Copy files from", deploy_dir, "to your repository")
    print("3. Enable GitHub Pages in repository settings")
    print("4. Your payment portal will be live!")
    print("")
    print("🚀 Ready to accept customer payments online!")

if __name__ == "__main__":
    main()