# Firebase Realtime Database Setup

## Immediate Actions Required

### 1. Enable Realtime Database
Go to Firebase Console: https://console.firebase.google.com/project/nativenodes-15522

1. Navigate to "Realtime Database" in left sidebar
2. Click "Create Database"
3. Choose location (us-central1 recommended)
4. Start in test mode initially (we'll secure later)

### 2. Database Rules (Initial Test Mode)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 3. Expected Database URL
After creation, your database URL will be:
`https://nativenodes-15522-default-rtdb.firebaseio.com/`

## Alternative: Use Firebase CLI
```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Realtime Database
firebase init database

# Select nativenodes-15522 project
# Choose us-central1 location
```

Once enabled, run the initialization script to populate Clay-I's memory structure.