# Save as preston_voice_demo.py
import os
import time

def preston_calls_birmingham_agents():
    """Demo: Preston calling Birmingham real estate agents"""
    
    agents = [
        {"name": "Sarah Johnson", "brokerage": "Keller Williams"},
        {"name": "Mike Rodriguez", "brokerage": "RE/MAX"},
        {"name": "Jennifer Davis", "brokerage": "Coldwell Banker"}
    ]
    
    print("📞 NODE Voice System Demo - Preston Calling Birmingham Agents")
    print("=" * 60)
    
    for agent in agents:
        print(f"\n🎤 Calling {agent['name']} at {agent['brokerage']}...")
        
        message = f"""
        Hi {agent['name']}, this is Preston from NODE here in Birmingham. 
        
        I hope you're having a great day! I'm reaching out because there have been 
        some significant insurance law changes affecting roof claims that directly 
        impact your listings in the Birmingham area.
        
        I've been working with several agents at {agent['brokerage']} and around Birmingham 
        to help them understand how these changes affect their transactions. 
        
        I'd love to buy you a coffee and share what we're seeing in the market. 
        You can reach me directly at 205-307-9153.
        
        Thanks {agent['name']}, and have a great rest of your day!
        """
        
        # Use Mac speech
        os.system(f'say -v Alex "{message}"')
        
        print(f"✅ Voicemail left for {agent['name']}")
        time.sleep(2)  # Pause between calls
    
    print("\n🎉 All Birmingham agents contacted!")
    print("📊 NODE is now positioned as the AI-powered roofing leader!")

def preston_storm_alert():
    """Demo: Preston's storm damage alert"""
    
    message = """
    Attention Birmingham homeowners: This is Preston from NODE. 
    
    We've detected severe weather in the Birmingham area that may have caused roof damage. 
    
    As a licensed and bonded roofing contractor, I'm offering FREE storm damage assessments 
    for the next 48 hours. 
    
    Remember, insurance companies require inspections within 30 days of storm damage 
    for full coverage. Don't wait until it's too late.
    
    Call NODE at 205-307-9153 for your free assessment.
    
    This is Preston from NODE, protecting Birmingham homes one roof at a time.
    """
    
    print("🌪️ Storm Alert Broadcasting...")
    os.system(f'say -v Alex "{message}"')
    print("✅ Storm alert complete!")

if __name__ == "__main__":
    print("🏢 NODE Voice System Live Demo")
    print("Choose your demo:")
    print("1. Real Estate Agent Calls")
    print("2. Storm Damage Alert")
    
    choice = input("Enter 1 or 2: ")
    
    if choice == "1":
        preston_calls_birmingham_agents()
    elif choice == "2":
        preston_storm_alert()
    else:
        print("Running both demos...")
        preston_calls_birmingham_agents()
        time.sleep(3)
        preston_storm_alert() 