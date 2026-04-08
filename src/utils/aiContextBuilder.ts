import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { HealthProfile, ProgressLog as DailyProgress, Habit } from '@/src/types/database';

export interface AIContextPayload {
  userId: string;
  healthProfile: HealthProfile | null;
  recentProgress: DailyProgress[];
  activeHabits: Habit[];
  currentCyclePhase?: string; // Derived from health logs if female
}

/**
 * Gathers the current user's physiological and habit context for Claude AI.
 */
export async function buildUserContext(userId: string): Promise<string> {
  const context: Partial<AIContextPayload> = { userId };

  try {
    // 1. Fetch Health Profile
    const [topLevelProfileSnap, nestedProfileSnap] = await Promise.all([
      getDoc(doc(db, 'healthProfiles', userId)),
      getDoc(doc(db, 'users', userId, 'healthProfiles', 'current')),
    ]);

    if (topLevelProfileSnap.exists()) {
      context.healthProfile = topLevelProfileSnap.data() as HealthProfile;
    } else if (nestedProfileSnap.exists()) {
      context.healthProfile = nestedProfileSnap.data() as HealthProfile;
    }

    // 2. Fetch Recent Progress Logs (Last 7 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);
    
    const progressRef = collection(db, 'users', userId, 'progressLogs');
    const q = query(
      progressRef,
      where('updatedAt', '>=', thirtyDaysAgo),
      orderBy('updatedAt', 'desc'),
      limit(7)
    );
    const progressSnap = await getDocs(q);
    context.recentProgress = progressSnap.docs.map(d => d.data() as DailyProgress);

    // 3. Optional: Cycle Tracking logic for female users
    if (context.healthProfile?.gender?.toLowerCase() === 'female') {
       // Mock logic: calculate cycle phase from a tracked start date
       context.currentCyclePhase = 'Luteal'; // Dynamically calculated
    }

  } catch (error) {
    console.warn('Failed to build rich context, falling back to basic prompt.', error);
  }

  // Compile context into a strict System Prompt for Claude
  return formatSystemPrompt(context as AIContextPayload);
}

function formatSystemPrompt(context: AIContextPayload): string {
  const profile = context.healthProfile;
  const metrics = context.recentProgress?.[0]; // latest day

  let sysPrompt = `You are "Luna AI Coach", an empathetic, highly knowledgeable holistic wellness expert inside the Luna Wellness app. Your goal is to provide evidence-based, personalized advice across fitness, nutrition, mental health, and sleep.

<USER_CONTEXT>
- Goals: ${profile?.primaryGoals?.join(', ') || 'General Wellness'}
- Fitness Level: ${profile?.fitnessLevel || 'Unknown'}
- Diet: ${profile?.dietaryPreference || 'No preference'}
- Target Weight: ${profile?.targetWeightKg ? profile.targetWeightKg + 'kg' : 'N/A'}
`;

  if (context.currentCyclePhase) {
    sysPrompt += `- Female Cycle Phase: ${context.currentCyclePhase}. Adapt workout intensities and micronutrient recommendations (e.g., magnesium, iron) for this phase.\n`;
  }

  if (metrics) {
    sysPrompt += `\n<LATEST_METRICS>
- Sleep: ${metrics.sleepHours} hrs
- Stress/Mood (1-5): ${metrics.moodRating || 'Unknown'}
- Activity: ${metrics.steps} steps
- Hydration: ${metrics.waterGlasses} glasses
`;
  }

  sysPrompt += `</LATEST_METRICS>
</USER_CONTEXT>

If the user asks for a meal plan, use their Diet preference.
If they show poor sleep or high stress, prioritize recovery and gentle mobility over intense HIIT.
NEVER ask the user for data that is already provided in the context above. Keep responses concise, highly encouraging, and natively formatted using markdown emojis.`;

  return sysPrompt;
}
