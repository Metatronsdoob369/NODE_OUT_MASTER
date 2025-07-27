// Quick script to access Clay-I's hierarchical memory system
require('dotenv').config({ path: './config.env' });

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function accessClayMemory() {
  console.log('🧠 Accessing Clay-I\'s Hierarchical Memory System...\n');
  
  try {
    const userId = 'node_platform_user';
    
    // Check conversations
    console.log('📱 Checking Conversations...');
    const conversationsRef = ref(db, `conversations/${userId}`);
    const conversationsSnapshot = await get(conversationsRef);
    
    if (conversationsSnapshot.exists()) {
      const conversations = conversationsSnapshot.val();
      console.log(`✅ Found ${Object.keys(conversations).length} conversation threads`);
      console.log('Recent conversations:', Object.keys(conversations).slice(0, 3));
    } else {
      console.log('❌ No conversations found');
    }
    
    // Check lessons
    console.log('\n📚 Checking Lessons...');
    const lessonsRef = ref(db, 'lessons');
    const lessonsSnapshot = await get(lessonsRef);
    
    if (lessonsSnapshot.exists()) {
      const lessons = lessonsSnapshot.val();
      console.log(`✅ Found ${Object.keys(lessons).length} lessons`);
      console.log('Available lessons:', Object.keys(lessons).slice(0, 5));
    } else {
      console.log('❌ No lessons found');
    }
    
    // Check user profile
    console.log('\n👤 Checking User Profile...');
    const profileRef = ref(db, `user_profiles/${userId}`);
    const profileSnapshot = await get(profileRef);
    
    if (profileSnapshot.exists()) {
      const profile = profileSnapshot.val();
      console.log('✅ User profile found');
      console.log('Profile keys:', Object.keys(profile));
    } else {
      console.log('❌ No user profile found');
    }
    
    // Check empathy wave signature
    console.log('\n🌊 Checking Empathy Wave Signature...');
    const empathyRef = ref(db, `user_profiles/${userId}/empathy_wave_signature`);
    const empathySnapshot = await get(empathyRef);
    
    if (empathySnapshot.exists()) {
      const empathyWave = empathySnapshot.val();
      console.log('✅ Empathy wave signature found');
      console.log('Empathy wave:', empathyWave);
    } else {
      console.log('❌ No empathy wave signature found');
    }
    
    console.log('\n🎯 Memory System Status: Ready for Claude integration');
    
  } catch (error) {
    console.error('Error accessing Clay-I memory:', error.message);
  }
}

accessClayMemory();