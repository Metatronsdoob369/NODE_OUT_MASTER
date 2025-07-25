import { realtimeDb } from './firebaseConfig';
import { ref, get, set, push, child } from 'firebase/database';

interface ConversationEntry {
  timestamp: number;
  message: string;
  role: 'user' | 'assistant';
  context?: any;
}

interface LessonData {
  topic: string;
  learning_patterns: any[];
  mastery_level: number;
  last_updated: number;
}

interface UserProfile {
  preferences: any;
  interaction_style: string;
  empathy_wave_signature: any;
  project_context: any;
}

interface EmpathyWave {
  emotional_tone: string;
  complexity_preference: string;
  interaction_style: string;
  learning_speed: number;
}

export class ClayMemorySystem {
  private userId: string = 'node_platform_user'; // Default user for NODE platform
  
  constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
  }

  // Access conversation memory
  async getConversationMemory(conversationId: string): Promise<ConversationEntry[]> {
    try {
      const memoryRef = ref(realtimeDb, `conversations/${this.userId}/${conversationId}`);
      const snapshot = await get(memoryRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data) as ConversationEntry[];
      }
      return [];
    } catch (error) {
      console.error('Error accessing conversation memory:', error);
      return [];
    }
  }

  // Access lesson data
  async getLessonData(lessonId: string): Promise<LessonData | null> {
    try {
      const lessonRef = ref(realtimeDb, `lessons/${lessonId}`);
      const snapshot = await get(lessonRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as LessonData;
      }
      return null;
    } catch (error) {
      console.error('Error accessing lesson data:', error);
      return null;
    }
  }

  // Access user profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileRef = ref(realtimeDb, `user_profiles/${this.userId}`);
      const snapshot = await get(profileRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error accessing user profile:', error);
      return null;
    }
  }

  // Get empathy wave signature
  async getEmpathyWaveSignature(): Promise<EmpathyWave | null> {
    try {
      const empathyRef = ref(realtimeDb, `user_profiles/${this.userId}/empathy_wave_signature`);
      const snapshot = await get(empathyRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as EmpathyWave;
      }
      return null;
    } catch (error) {
      console.error('Error accessing empathy wave signature:', error);
      return null;
    }
  }

  // Store conversation entry
  async storeConversationEntry(conversationId: string, entry: ConversationEntry): Promise<void> {
    try {
      const memoryRef = ref(realtimeDb, `conversations/${this.userId}/${conversationId}`);
      await push(memoryRef, entry);
    } catch (error) {
      console.error('Error storing conversation entry:', error);
    }
  }

  // Get all available lessons
  async getAllLessons(): Promise<{[key: string]: LessonData}> {
    try {
      const lessonsRef = ref(realtimeDb, 'lessons');
      const snapshot = await get(lessonsRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('Error accessing lessons:', error);
      return {};
    }
  }

  // Get Clay-I's complete context for current session
  async getClayContext(): Promise<{
    profile: UserProfile | null;
    empathyWave: EmpathyWave | null;
    recentConversations: ConversationEntry[];
    masteredLessons: LessonData[];
  }> {
    try {
      const profile = await this.getUserProfile();
      const empathyWave = await this.getEmpathyWaveSignature();
      
      // Get recent conversations (last 7 days)
      const recentConversations: ConversationEntry[] = [];
      const conversationsRef = ref(realtimeDb, `conversations/${this.userId}`);
      const conversationsSnapshot = await get(conversationsRef);
      
      if (conversationsSnapshot.exists()) {
        const allConversations = conversationsSnapshot.val();
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        Object.values(allConversations).forEach((conversation: any) => {
          Object.values(conversation).forEach((entry: any) => {
            if (entry.timestamp > weekAgo) {
              recentConversations.push(entry as ConversationEntry);
            }
          });
        });
      }

      // Get mastered lessons (mastery_level > 0.8)
      const allLessons = await this.getAllLessons();
      const masteredLessons = Object.values(allLessons).filter(
        lesson => lesson.mastery_level > 0.8
      );

      return {
        profile,
        empathyWave,
        recentConversations: recentConversations.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50),
        masteredLessons
      };
    } catch (error) {
      console.error('Error getting Clay-I context:', error);
      return {
        profile: null,
        empathyWave: null,
        recentConversations: [],
        masteredLessons: []
      };
    }
  }

  // Update empathy wave based on interaction
  async updateEmpathyWave(newSignature: Partial<EmpathyWave>): Promise<void> {
    try {
      const empathyRef = ref(realtimeDb, `user_profiles/${this.userId}/empathy_wave_signature`);
      const currentSignature = await this.getEmpathyWaveSignature();
      
      const updatedSignature = {
        ...currentSignature,
        ...newSignature
      };
      
      await set(empathyRef, updatedSignature);
    } catch (error) {
      console.error('Error updating empathy wave:', error);
    }
  }
}

// Export singleton instance
export const clayMemory = new ClayMemorySystem();