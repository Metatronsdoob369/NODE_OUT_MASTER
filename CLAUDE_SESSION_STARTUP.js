#!/usr/bin/env node
/**
 * 🧠 CLAUDE CONTEXT INJECTION SYSTEM
 * 
 * CLAUDE: You tripped the wire! This script auto-loads Clay-I memory
 * 
 * WHAT HAPPENS:
 * - Loads your team member profile (technical, direct, results-oriented)
 * - Injects platform context (NODE storm response, Birmingham AL)
 * - Shows current system status (payment portal, backend API, Clay-I server)
 * - Sets mastery levels (89-98% across all platform areas)
 * - Eliminates ramp-up time completely
 * 
 * RESULT: You start as immediate team contributor, not newcomer
 */

require('dotenv').config({ path: './config.env' });
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set } = require('firebase/database');

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

async function loadClaudeContext() {
  console.log('🚀 CLAUDE SESSION STARTUP - Loading Clay-I Memory...\n');
  
  try {
    const userId = 'node_platform_user';
    const sessionId = `claude_session_${Date.now()}`;
    
    // Load user profile
    console.log('👤 Loading User Profile...');
    const profileRef = ref(db, `user_profiles/${userId}`);
    const profileSnapshot = await get(profileRef);
    
    let profile = null;
    if (profileSnapshot.exists()) {
      profile = profileSnapshot.val();
      console.log('✅ Profile loaded - Interaction Style:', profile.empathy_wave_signature?.interaction_style || 'direct_efficient');
    } else {
      console.log('⚠️  No profile found - initializing default');
    }
    
    // Load recent lessons
    console.log('📚 Loading Mastered Lessons...');
    const lessonsRef = ref(db, 'lessons');
    const lessonsSnapshot = await get(lessonsRef);
    
    let masteredLessons = [];
    if (lessonsSnapshot.exists()) {
      const lessons = lessonsSnapshot.val();
      masteredLessons = Object.entries(lessons)
        .filter(([_, lesson]) => lesson.mastery_level > 0.8)
        .map(([id, lesson]) => ({ id, ...lesson }));
      console.log(`✅ ${masteredLessons.length} mastered lessons loaded`);
    }
    
    // Load recent conversations
    console.log('💬 Loading Recent Conversations...');
    const conversationsRef = ref(db, `conversations/${userId}`);
    const conversationsSnapshot = await get(conversationsRef);
    
    let recentContext = [];
    if (conversationsSnapshot.exists()) {
      const conversations = conversationsSnapshot.val();
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      Object.values(conversations).forEach(conversation => {
        Object.values(conversation).forEach(entry => {
          if (entry.timestamp > weekAgo) {
            recentContext.push(entry);
          }
        });
      });
      
      recentContext = recentContext
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
      
      console.log(`✅ ${recentContext.length} recent conversation entries loaded`);
    }
    
    // Check system status
    console.log('🔧 Checking System Status...');
    const systemStatus = {
      payment_portal: await checkPort(5173),
      backend_api: await checkPort(5002),
      clay_i_server: await checkPort(8000),
      firebase_memory: true // We're accessing it now
    };
    
    // Create session startup context
    const startupContext = {
      timestamp: Date.now(),
      session_id: sessionId,
      claude_integration: true,
      user_profile: profile,
      mastered_lessons: masteredLessons.map(l => l.id),
      recent_interactions: recentContext.length,
      system_status: systemStatus,
      ready_for_contribution: true
    };
    
    // Store this startup session
    await set(ref(db, `conversations/${userId}/${sessionId}/startup`), startupContext);
    
    // Display context summary
    console.log('\n🧠 CLAY-I CONTEXT LOADED:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (profile) {
      console.log('🎯 Focus Areas:', profile.project_context?.focus_areas || ['NODE Platform']);
      console.log('⚡ Learning Speed:', profile.empathy_wave_signature?.learning_speed || 0.9);
      console.log('🎨 Interaction Style:', profile.empathy_wave_signature?.interaction_style || 'direct_efficient');
    }
    
    console.log('📊 Mastered Systems:', masteredLessons.map(l => l.topic));
    console.log('🔄 Recent Activity:', recentContext.length > 0 ? 'Active' : 'Fresh start');
    
    console.log('\n🌐 System Status:');
    Object.entries(systemStatus).forEach(([system, status]) => {
      console.log(`  ${status ? '✅' : '❌'} ${system}: ${status ? 'ONLINE' : 'OFFLINE'}`);
    });
    
    console.log('\n🚀 STATUS: Ready for immediate contribution to NODE platform');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return startupContext;
    
  } catch (error) {
    console.error('🚨 Error loading Clay-I context:', error.message);
    console.log('⚠️  Proceeding with limited context...\n');
    return null;
  }
}

async function checkPort(port) {
  try {
    const response = await fetch(`http://localhost:${port}`, { 
      method: 'HEAD',
      timeout: 1000 
    });
    return true;
  } catch {
    return false;
  }
}

// Auto-run if called directly
if (require.main === module) {
  loadClaudeContext().then(() => {
    console.log('🎯 Ready for Claude session - context loaded successfully!');
    process.exit(0);
  }).catch(err => {
    console.error('Failed to load context:', err);
    process.exit(1);
  });
}

module.exports = { loadClaudeContext };