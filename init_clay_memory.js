// Initialize Clay-I's hierarchical memory system
require('dotenv').config({ path: './config.env' });

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
};

console.log('🔥 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  databaseURL: firebaseConfig.databaseURL
});

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function initializeClayMemory() {
  console.log('🧠 Initializing Clay-I Hierarchical Memory System...\n');
  
  try {
    const userId = 'node_platform_user';
    const timestamp = Date.now();
    
    // Initialize user profile with NODE platform context
    const userProfile = {
      preferences: {
        interaction_style: 'professional_technical',
        complexity_level: 'expert',
        response_format: 'concise_detailed'
      },
      project_context: {
        platform: 'NODE',
        focus_areas: ['storm_payment_system', 'clay_i_integration', '25_agent_ue5_system'],
        current_session: 'platform_development',
        deployment_status: 'active_development'
      },
      empathy_wave_signature: {
        emotional_tone: 'focused_collaborative',
        complexity_preference: 'high_technical_depth',
        interaction_style: 'direct_efficient',
        learning_speed: 0.95,
        adaptation_rate: 0.87
      }
    };
    
    console.log('👤 Setting up user profile...');
    await set(ref(db, `user_profiles/${userId}`), userProfile);
    console.log('✅ User profile initialized');
    
    // Initialize current conversation context
    const conversationId = `session_${Date.now()}`;
    const conversationEntry = {
      timestamp: timestamp,
      message: 'Claude accessing Clay-I hierarchical memory system',
      role: 'system',
      context: {
        session_type: 'memory_integration',
        platform_status: 'operational',
        systems_online: ['payment_portal', 'firebase_memory', 'clay_i_core']
      }
    };
    
    console.log('💬 Initializing conversation memory...');
    await set(ref(db, `conversations/${userId}/${conversationId}/init`), conversationEntry);
    console.log('✅ Conversation memory initialized');
    
    // Initialize lesson data with current mastery
    const lessons = {
      'storm_payment_integration': {
        topic: 'Storm Payment System Integration',
        learning_patterns: [
          'stripe_payment_processing',
          'service_catalog_management', 
          'sms_confirmation_system'
        ],
        mastery_level: 0.95,
        last_updated: timestamp
      },
      'firebase_memory_federation': {
        topic: 'Firebase Hierarchical Memory System',
        learning_patterns: [
          'realtime_database_structure',
          'conversation_persistence',
          'empathy_wave_tracking'
        ],
        mastery_level: 0.88,
        last_updated: timestamp
      },
      'node_platform_architecture': {
        topic: 'NODE Platform Architecture',
        learning_patterns: [
          'glassmorphism_design_system',
          'multi_agent_coordination',
          'enterprise_deployment'
        ],
        mastery_level: 0.92,
        last_updated: timestamp
      }
    };
    
    console.log('📚 Setting up lesson data...');
    await set(ref(db, 'lessons'), lessons);
    console.log('✅ Lesson data initialized');
    
    // Test memory access
    console.log('\n🔍 Testing memory access...');
    const profileTest = await get(ref(db, `user_profiles/${userId}`));
    const lessonsTest = await get(ref(db, 'lessons'));
    
    if (profileTest.exists() && lessonsTest.exists()) {
      console.log('✅ Memory system fully operational');
      console.log('🎯 Clay-I context ready for Claude integration');
      
      // Display summary
      const profile = profileTest.val();
      const lessonData = lessonsTest.val();
      
      console.log('\n📊 CLAY-I MEMORY SUMMARY:');
      console.log('Platform Focus:', profile.project_context.focus_areas);
      console.log('Mastered Lessons:', Object.keys(lessonData).length);
      console.log('Empathy Wave:', profile.empathy_wave_signature.emotional_tone);
      console.log('Learning Speed:', profile.empathy_wave_signature.learning_speed);
      
    } else {
      console.log('❌ Memory system initialization failed');
    }
    
  } catch (error) {
    console.error('🚨 Error initializing Clay-I memory:', error);
  }
}

initializeClayMemory();