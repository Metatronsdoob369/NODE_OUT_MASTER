# 🔥 ENABLE FIREBASE REALTIME DATABASE - IMMEDIATE ACTION

## Steps to Enable (2 minutes):

1. **Go to Firebase Console**: https://console.firebase.google.com/project/nativenodes-15522

2. **Enable Realtime Database**:
   - Click "Realtime Database" in left sidebar
   - Click "Create Database" 
   - Choose location: **us-central1** (recommended)
   - Start in **test mode** (we'll secure later)

3. **Set Initial Rules** (temporary):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

4. **Verify URL Created**:
   Should be: `https://nativenodes-15522-default-rtdb.firebaseio.com/`

## After Enabling:

```bash
# Populate memory with current session context
node populate_clay_memory.js

# Test memory access
node CLAUDE_SESSION_STARTUP.js

# Check memory state
firebase database:get /conversations --project nativenodes-15522
firebase database:get /lessons --project nativenodes-15522  
firebase database:get /user_profiles --project nativenodes-15522
```

## Alternative: Use Current Firebase Project
If you want to use the existing `one0-base-kit` project instead:

1. Update `config.env`:
   ```
   FIREBASE_PROJECT_ID=one0-base-kit
   ```

2. Enable Realtime Database in one0-base-kit project
3. Run the memory population scripts

**Choose your path and let's get Clay-I memory active!**