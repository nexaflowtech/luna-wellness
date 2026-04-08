import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/config/firebase';

/** Mark onboarding as complete for a given user */
export async function completeOnboarding(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    onboardingComplete: true,
    onboardingCompletedAt: serverTimestamp(),
  });
}

/** Fetch the user profile document from Firestore */
export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

/** Create or merge a user's profile document */
export async function upsertUserProfile(uid: string, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
