import { Timestamp } from 'firebase/firestore';

// ==========================================
// 1. USERS (root)
// ==========================================
export type Role = 'user' | 'coach' | 'admin';

export interface UserDocument {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
  createdAt: Timestamp;
  deviceTokens: string[];
}

// ==========================================
// 2. HEALTH PROFILES (users/{uid}/healthProfiles)
// ==========================================
export type FitnessLevel = 'beginner' | 'light' | 'moderate' | 'advanced';
export type DietaryPreference = 'vegetarian' | 'vegan' | 'pescatarian' | 'non_vegetarian' | 'keto' | 'none';

export interface HealthProfile {
  gender: string;
  dateOfBirth: Timestamp | null;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  fitnessLevel: FitnessLevel;
  dietaryPreference: DietaryPreference;
  primaryGoals: string[];
  updatedAt: Timestamp;
}

// ==========================================
// 3. ASSESSMENTS (users/{uid}/assessments)
// ==========================================
export type AssessmentType = 'initial' | 'monthly_checkin';

export interface Assessment {
  id: string;
  type: AssessmentType;
  answers: Record<string, any>;
  aiCalculatedScore: number;
  completedAt: Timestamp;
}

// ==========================================
// 4. SUBSCRIPTIONS (users/{uid}/subscriptions)
// ==========================================
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled';
export type PaymentProvider = 'razorpay' | 'stripe' | 'apple' | 'google';

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  planId: string;
  paymentProviderId: string;
  provider: PaymentProvider;
  currentPeriodEnd: Timestamp;
  createdAt: Timestamp;
}

// ==========================================
// 5. PROGRESS LOGS (users/{uid}/progressLogs)
// ==========================================
export interface ProgressLog {
  id: string; // e.g. "2024-03-31"
  date: string;
  weightKg?: number;
  waterGlasses: number;
  steps: number;
  caloriesConsumed: number;
  sleepHours: number;
  moodRating?: number; // 1-5
  updatedAt: Timestamp;
}

// ==========================================
// 6. HABITS (users/{uid}/habits)
// ==========================================
export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  category: string;
  emoji: string;
  frequency: HabitFrequency;
  currentStreak: number;
  longestStreak: number;
  createdAt: Timestamp;
}

export interface HabitLog {
  id: string; // e.g. "2024-03-31"
  completed: boolean;
  timestamp: Timestamp;
}

// ==========================================
// 7. HEALTH REPORTS (users/{uid}/healthReports)
// ==========================================
export type ReportType = 'blood_work' | 'ai_summary' | 'doctor_note';

export interface HealthReport {
  id: string;
  title: string;
  type: ReportType;
  fileUrl: string;
  summary: string;
  uploadedAt: Timestamp;
}

// ==========================================
// 8. NOTIFICATIONS (users/{uid}/notifications)
// ==========================================
export interface NotificationDocument {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Timestamp;
}

// ==========================================
// 9. PROGRAMS (root)
// ==========================================
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Program {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  durationWeeks: number;
  tags: string[];
  thumbnailUrl: string;
  isPremium: boolean;
  createdAt: Timestamp;
}

// ==========================================
// 10. WORKOUTS (root)
// ==========================================
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
}

export interface Workout {
  id: string;
  programId?: string;
  title: string;
  category: string;
  durationMinutes: number;
  estimatedCalories: number;
  videoUrl?: string;
  exercises: Exercise[];
}

// ==========================================
// 11. DIET PLANS (root)
// ==========================================
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  type: MealType;
  name: string;
  items: string[];
  calories: number;
}

export interface DietPlan {
  id: string;
  title: string;
  userId?: string; // Optional: If AI generated specific to a user
  dietType: string;
  totalCalories: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
  };
  meals: Meal[];
}

// ==========================================
// 12. COACH CHATS (root)
// ==========================================
export type ChatStatus = 'active' | 'archived';
export type MessageType = 'text' | 'image' | 'workout_link';

export interface CoachChat {
  id: string;
  userId: string;
  coachId: string; // The uid of an expert, or "ai"
  status: ChatStatus;
  lastMessageText: string;
  lastMessageAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  type: MessageType;
  isRead: boolean;
  createdAt: Timestamp;
}

// ==========================================
// 13. CONSULTATIONS (root)
// ==========================================
export type ConsultationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Consultation {
  id: string;
  userId: string;
  expertId: string;
  status: ConsultationStatus;
  scheduledAt: Timestamp;
  meetingUrl?: string;
  notes?: string;
  feePaid: number;
}

// ==========================================
// 14. COMMUNITY POSTS (root)
// ==========================================
export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
}

export interface PostComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: Timestamp;
}

export interface PostLike {
  id: string; // Uses the liker's userId as document ID
  timestamp: Timestamp;
}
