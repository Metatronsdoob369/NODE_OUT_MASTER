# Generated Voice Scripts for TTS System
# 36 unique scripts across 6 categories for 4 voices

VOICE_SCRIPTS = {
    'voice_test_demos': {
        'Drew': "Hey there! I'm Drew, and I'm here to make your day absolutely incredible! Whether you need motivation, excitement, or just someone to turn the mundane into the extraordinary, I'm your guy. Let's make some magic happen together!",
        'Rachel': "Hello, I'm Rachel. I believe every story deserves to be told beautifully, every moment deserves to be captured with warmth and wonder. Let me help you find the magic in the everyday and turn your words into something truly memorable.",
        'Paul': "Good day, I'm Paul. With years of experience and a voice that commands attention, I'm here to ensure your message is delivered with the authority and professionalism it deserves. Let's make an impact together.",
        'Antoni': "Hi, I'm Antoni! I have this way of connecting with people, making them feel heard and understood. Whether it's persuasion, storytelling, or just creating that perfect moment of connection, I'm here to make it happen."
    },
    
    'automated_call_scripts': {
        'Drew': "This is Drew with an exciting opportunity that's going to transform your business! We're talking about results that will blow your mind and solutions that actually work. Don't miss out on this game-changing moment - let's make something amazing happen together!",
        'Rachel': "Hi there, this is Rachel calling. I wanted to share a story with you about how we've helped businesses just like yours discover solutions they never knew existed. It's amazing what happens when we take the time to really understand what you need.",
        'Paul': "This is Paul calling. I understand you're facing some challenges, and I want to discuss how our proven solutions can address those specific issues. With our track record and expertise, we can deliver the results you need. Let's have a professional conversation about your future.",
        'Antoni': "Hey, this is Antoni. I know you're busy, but I think we could really help each other out here. I've got something that could make a real difference for you, and I'd love to show you how. What do you say we explore this together?"
    },
    
    'content_generation': {
        'Drew': "Ready to create content that's going to absolutely crush it? I'm talking about headlines that grab attention, stories that inspire action, and messages that stick in people's minds. Let's turn your ideas into content gold that everyone will be talking about!",
        'Rachel': "Content creation is like storytelling - it's about finding the heart of your message and sharing it in a way that resonates. Let me help you craft words that not only inform but inspire, that not only sell but connect. Every piece of content is an opportunity to tell your story.",
        'Paul': "Professional content requires strategic thinking and expert execution. I'll help you develop content that establishes authority, builds trust, and drives results. We're not just creating content - we're building your brand's reputation and influence in the marketplace.",
        'Antoni': "Great content is all about connection. It's about understanding your audience and speaking their language. Let me help you create content that doesn't just reach people - it moves them, persuades them, and makes them want to take action."
    },
    
    'video_narration': {
        'Drew': "Get ready for a journey that's going to take your breath away! This isn't just a video - it's an experience, an adventure, a story that will keep you on the edge of your seat. Every moment matters, every detail counts, and we're about to make it all come alive!",
        'Rachel': "Every video tells a story, and every story has the power to move us, to change us, to inspire us. Let me take you on a journey through moments that matter, through experiences that shape us, through stories that deserve to be told with the care and attention they deserve.",
        'Paul': "This video represents a significant investment in quality, expertise, and professional presentation. What you're about to see is the result of careful planning, strategic execution, and unwavering commitment to excellence. This is how serious professionals deliver serious results.",
        'Antoni': "There's something special about this story, something that speaks to all of us. It's about connection, about understanding, about finding that moment where everything clicks into place. Let me share this journey with you, and together we'll discover something truly meaningful."
    },
    
    'data_presentation': {
        'Drew': "These numbers aren't just statistics - they're the story of success, the proof of progress, the evidence of excellence! What you're seeing here is the result of hard work, smart decisions, and the kind of performance that sets new standards. This is what winning looks like!",
        'Rachel': "Behind every number is a story, behind every statistic is a journey. These data points represent real people, real challenges, real solutions. Let me walk you through what these numbers mean, how they connect, and what they tell us about the path forward.",
        'Paul': "The data clearly demonstrates significant trends and patterns that require our attention. These metrics indicate measurable progress and provide a solid foundation for strategic decision-making. What we're seeing here is evidence-based results that support our professional objectives.",
        'Antoni': "When you look at this data, you can see the patterns emerging, the connections forming, the story taking shape. It's fascinating how these numbers work together, how they influence each other, and how they point us toward the solutions we need."
    },
    
    'entertainment': {
        'Drew': "Welcome to the most entertaining experience you've ever had! We're about to dive into a world of fun, excitement, and pure entertainment that's going to keep you laughing, engaged, and wanting more. This is where the magic happens, where ordinary becomes extraordinary!",
        'Rachel': "There's something magical about entertainment - it's where we escape, where we dream, where we find joy in the unexpected. Let me take you on a journey through stories that make us laugh, moments that make us think, and experiences that make us feel alive.",
        'Paul': "Entertainment at its finest requires careful attention to detail, professional execution, and a commitment to quality that audiences have come to expect. What you're about to experience represents the highest standards of production and performance in the industry.",
        'Antoni': "Entertainment is all about connection - it's about creating moments that bring us together, that make us smile, that remind us why we love to be entertained. Let me share something special with you, something that's going to make your day a little brighter."
    }
}

# Voice personality descriptions for reference
VOICE_PERSONALITIES = {
    'Drew': 'Confident, engaging, makes everything sound exciting',
    'Rachel': 'Warm, storytelling-focused, turns mundane into memorable',
    'Paul': 'Authoritative, experienced, makes everything sound important',
    'Antoni': 'Charismatic, persuasive, creates connection'
}

# Category descriptions
CATEGORIES = {
    'voice_test_demos': 'Casual personality showcases',
    'automated_call_scripts': 'Professional outreach',
    'content_generation': 'Creative writing/editing',
    'video_narration': 'Storytelling/dramatic',
    'data_presentation': 'Analytical/educational',
    'entertainment': 'Fun/engaging content'
}

def get_script(voice_name, category):
    """Get a specific voice script"""
    return VOICE_SCRIPTS.get(category, {}).get(voice_name, "Script not found")

def get_all_scripts_for_voice(voice_name):
    """Get all scripts for a specific voice"""
    return {category: script for category, scripts in VOICE_SCRIPTS.items() 
            for voice, script in scripts.items() if voice == voice_name}

def get_all_scripts_for_category(category):
    """Get all scripts for a specific category"""
    return VOICE_SCRIPTS.get(category, {})

if __name__ == "__main__":
    print("🎤 Generated Voice Scripts")
    print("=" * 50)
    print(f"Total scripts: {sum(len(scripts) for scripts in VOICE_SCRIPTS.values())}")
    print(f"Voices: {', '.join(VOICE_PERSONALITIES.keys())}")
    print(f"Categories: {', '.join(CATEGORIES.keys())}")
    print("\nSample script (Drew - Voice Test Demo):")
    print(get_script('Drew', 'voice_test_demos')) 