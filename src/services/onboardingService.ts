import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/src/config/firebase';

export type ProgramType = 'pcos' | 'weight_loss' | 'thyroid';

export interface ProfileSetupInput {
  name: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  heightCm: number;
  weightKg: number;
  primaryGoals?: string[];
  dynamicDetails?: Record<string, unknown>;
}

export interface QuestionnaireInput {
  cycleInfo: string;
  dietPreference: string;
  lifestyleHabits: string[];
  primaryGoals: string[];
}

export interface AssessmentOutput {
  riskScore: number;
  riskLabel: 'Low' | 'Medium' | 'High';
  recommendedProgram: ProgramType;
}

export interface ProgramPurchaseInput {
  programId: ProgramType;
  durationMonths: 1 | 3 | 6;
}

export interface JourneyState {
  profileComplete: boolean;
  questionnaireComplete: boolean;
  onboardingComplete: boolean;
  subscriptionActive: boolean;
}

function hasAnyGoal(goals: string[], ...keywords: string[]) {
  return goals.some((goal) => keywords.some((keyword) => goal.includes(keyword)));
}

export async function getJourneyState(uid: string): Promise<JourneyState> {
  const userSnap = await getDoc(doc(db, 'users', uid));
  const data = userSnap.data() ?? {};
  return {
    profileComplete: data.profileComplete === true,
    questionnaireComplete: data.questionnaireComplete === true,
    onboardingComplete: data.onboardingComplete === true,
    subscriptionActive: data.subscriptionActive === true,
  };
}

export async function saveProfileSetup(uid: string, input: ProfileSetupInput): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    displayName: input.name,
    age: input.age,
    gender: input.gender,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    goals: input.primaryGoals ?? [],
    dynamicDetails: input.dynamicDetails ?? {},
    profileComplete: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await setDoc(doc(db, 'healthProfiles', uid), {
    uid,
    name: input.name,
    age: input.age,
    gender: input.gender,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    primaryGoals: input.primaryGoals ?? [],
    dynamicDetails: input.dynamicDetails ?? {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function saveQuestionnaire(uid: string, input: QuestionnaireInput): Promise<void> {
  await setDoc(doc(db, 'healthProfiles', uid), {
    cycleInfo: input.cycleInfo,
    dietPreference: input.dietPreference,
    lifestyleHabits: input.lifestyleHabits,
    primaryGoals: input.primaryGoals,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await setDoc(doc(db, 'users', uid), {
    questionnaireComplete: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function generateAssessment(input: QuestionnaireInput): AssessmentOutput {
  const goals = input.primaryGoals.map((g) => g.toLowerCase());
  const habits = input.lifestyleHabits.map((h) => h.toLowerCase());
  let riskScore = 52;

  if (hasAnyGoal(goals, 'pcos', 'pcod', 'cycle', 'hormone', 'fertility')) riskScore += 18;
  if (hasAnyGoal(goals, 'thyroid')) riskScore += 14;
  if (hasAnyGoal(goals, 'weight')) riskScore += 10;
  if (habits.some((h) => h.includes('high stress') || h.includes('poor sleep'))) riskScore += 8;
  if (habits.some((h) => h.includes('sedentary'))) riskScore += 6;

  riskScore = Math.max(20, Math.min(95, riskScore));

  const riskLabel: AssessmentOutput['riskLabel'] =
    riskScore >= 75 ? 'High' : riskScore >= 55 ? 'Medium' : 'Low';

  let recommendedProgram: ProgramType = 'weight_loss';
  if (hasAnyGoal(goals, 'pcos', 'pcod', 'cycle', 'hormone', 'fertility')) recommendedProgram = 'pcos';
  else if (hasAnyGoal(goals, 'thyroid')) recommendedProgram = 'thyroid';

  return { riskScore, riskLabel, recommendedProgram };
}

export async function saveAssessment(uid: string, output: AssessmentOutput): Promise<void> {
  await setDoc(doc(db, 'healthProfiles', uid), {
    riskScore: output.riskScore,
    riskLabel: output.riskLabel,
    recommendedProgram: output.recommendedProgram,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await setDoc(doc(db, 'users', uid), {
    recommendedProgram: output.recommendedProgram,
    riskScore: output.riskScore,
    onboardingComplete: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function saveAiPlan(uid: string, plan: any): Promise<void> {
  await setDoc(doc(db, 'healthProfiles', uid), {
    aiPlan: plan,
    aiPlanGeneratedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await updateDoc(doc(db, 'users', uid), {
    hasAiPlan: true,
    updatedAt: serverTimestamp(),
  });
}

export async function activateSubscription(uid: string, input: ProgramPurchaseInput): Promise<void> {
  await addDoc(collection(db, 'subscriptions'), {
    uid,
    programId: input.programId,
    durationMonths: input.durationMonths,
    status: 'active',
    startAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'users', uid), {
    subscriptionActive: true,
    activeProgram: input.programId,
    planDurationMonths: input.durationMonths,
    updatedAt: serverTimestamp(),
  });
}
