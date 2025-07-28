#!/usr/bin/env python3
"""
🤔 ASK CLAY-I SPECIFIC QUESTIONS
Send targeted questions about your screenshots

USAGE:
python ask_clay.py "How do I add a Web Browser Widget?"
python ask_clay.py "Where is the Google Maps URL setting?"
python ask_clay.py "What should I click next?"
"""

import sys
import os
import glob
import requests

def ask_clay_i(question):
    """Ask Clay-I a specific question about the latest screenshot"""
    
    # Find the most recent screenshot in Eye_Clay folder
    eye_clay_folder = "/Users/joewales/Desktop/Eye_Clay"
    pattern = os.path.join(eye_clay_folder, "*.png")
    png_files = glob.glob(pattern)
    
    if not png_files:
        print("❌ No PNG screenshots found in Eye_Clay folder")
        print("   Take a screenshot first, then ask your question")
        return
    
    # Get the most recent file
    latest_screenshot = max(png_files, key=os.path.getctime)
    screenshot_name = os.path.basename(latest_screenshot)
    
    print(f"🤔 ASKING CLAY-I: {question}")
    print(f"📸 Analyzing: {screenshot_name}")
    print("="*60)
    
    try:
        # Send question with the latest screenshot
        with open(latest_screenshot, 'rb') as f:
            files = {'file': f}
            data = {'question': question}
            response = requests.post(
                "http://localhost:8000/vision-analysis", 
                files=files, 
                data=data,
                timeout=30
            )
            
        if response.status_code == 200:
            result = response.json()
            print("🧠 CLAY-I RESPONSE:")
            print("-" * 40)
            
            if 'description' in result:
                description = result['description']
                print(description)
            else:
                print("No analysis returned")
                
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Failed to ask Clay-I: {e}")
        print("   Make sure Clay-I server is running at localhost:8000")

def main():
    if len(sys.argv) < 2:
        print("🤔 ASK CLAY-I SPECIFIC QUESTIONS")
        print("="*40)
        print("Usage: python ask_clay.py \"Your question here\"")
        print("")
        print("Examples:")
        print('  python ask_clay.py "How do I add a Web Browser Widget?"')
        print('  python ask_clay.py "Where is the Google Maps URL setting?"') 
        print('  python ask_clay.py "What should I click to navigate to Birmingham?"')
        print('  python ask_clay.py "How do I switch from Google Maps to Google Earth?"')
        return
    
    question = " ".join(sys.argv[1:])
    ask_clay_i(question)

if __name__ == "__main__":
    main()