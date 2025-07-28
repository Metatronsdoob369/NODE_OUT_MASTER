# 🎤 ElevenLabs Creator Package Setup for NODE

## Step 1: Get Your API Key

1. Go to https://elevenlabs.io/
2. Login to your Creator account
3. Click your profile (top right)
4. Go to "Profile & API Key"
5. Copy your API key

## Step 2: Create Environment File

Create a file called `.env` in the same folder as your Python files with this content:

```
ELEVENLABS_API_KEY=your_actual_api_key_here
```

**Example:**
```
ELEVENLABS_API_KEY=sk_9121df2506392e7e788eacb9f65fb6ae3f1f044e6751e96a
```

## Step 3: Test Your Creator Voice System

Run this command to test your setup:

```bash
python node_creator_voice.py
```

## Step 4: Expected Results

You should see:
- ✅ Connected to ElevenLabs Creator package
- 📊 Available voices: [number of voices]
- 🎤 Available Creator Package Voices: [list of voices]
- 🎤 Preston speaking with [voice] voice...
- ✅ Creator voice playback complete!

## Step 5: Create Premium Voicemails

The system will automatically:
- Generate premium quality voice messages
- Save voicemails as MP3 files
- Play them immediately
- Create professional agent outreach

## Available Features

### 🎤 Premium Voice Generation
- Professional quality voice synthesis
- Multiple voice options from Creator package
- Automatic fallback to Mac speech if needed

### 📞 Agent Voicemail Creation
- Personalized messages for Birmingham agents
- Company-specific branding (NODE, Preston, Birmingham)
- Professional relationship-building content
- MP3 file generation for archiving

### 🎵 Voice Testing
- Test all available Creator voices
- Choose your preferred voice for NODE
- Interactive voice selection process

## Troubleshooting

### ❌ API Key Error
If you see "ElevenLabs API key not found":
1. Make sure you created the `.env` file
2. Check that your API key is correct
3. Ensure no extra spaces in the `.env` file

### ❌ Voice Generation Error
If voice generation fails:
1. Check your Creator package credits
2. Verify internet connection
3. System will automatically fallback to Mac speech

## Next Steps

Once setup is complete:
1. Test with different voices
2. Create voicemails for Birmingham agents
3. Integrate with NODE's main AI platform
4. Start professional agent outreach

## 🚀 NODE Creator Voice System Ready!

Your premium voice system will be ready for:
- Professional real estate agent calls
- Storm damage alerts
- Insurance claim support
- Market updates
- Emergency notifications

**Contact: Preston at NODE - Birmingham, AL - 205-307-9153** 