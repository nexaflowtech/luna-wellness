import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/config/firebase';

/** Save the user's onboarding goal selections to Firestore */
export async function saveGoalSelections(uid: string, goals: string[]): Promise<void> {
  await setDoc(
    doc(db, 'goalSelections', uid),
    { goals, savedAt: serverTimestamp() },
    { merge: true }
  );
  // Also mirror into the user doc for convenience
  await setDoc(doc(db, 'users', uid), { goals }, { merge: true });
}

/** Retrieve the user's saved goal selections */
export async function getGoalSelections(uid: string): Promise<string[]> {
  const snap = await getDoc(doc(db, 'goalSelections', uid));
  return snap.exists() ? (snap.data().goals as string[]) : [];
}
