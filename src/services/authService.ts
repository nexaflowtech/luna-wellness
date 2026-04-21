import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  PhoneAuthProvider,
  ApplicationVerifier,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/src/config/firebase';

/** Register a new user and create their Firestore document */
export async function registerUser(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Create user profile in background to avoid blocking the main auth flow
  setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    phoneNumber: user.phoneNumber ?? null,
    displayName: user.displayName ?? null,
    onboardingComplete: false,
    profileComplete: false,
    questionnaireComplete: false,
    subscriptionActive: false,
    createdAt: serverTimestamp(),
  }).catch(err => console.error("Firestore user creation background error:", err));

  return user;
}

/** Sign in an existing user */
export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Start a phone OTP sign-in flow. */
export async function sendPhoneOtp(
  phoneNumber: string,
  appVerifier: ApplicationVerifier
): Promise<string> {
  const provider = new PhoneAuthProvider(auth);
  return provider.verifyPhoneNumber(phoneNumber, appVerifier);
}

/**
 * Complete phone OTP sign-in.
 * CRITICAL FIX: Never overwrites onboardingComplete for returning users.
 * Returns user + isNewUser flag so login screen can route correctly
 * without waiting for Firestore context snapshot (avoids race condition).
 */
export async function verifyPhoneOtp(
  verificationId: string,
  code: string
): Promise<{ user: User; isNewUser: boolean }> {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  const result = await signInWithCredential(auth, credential);
  const user = result.user;

  let isNewUser = false;

  try {
    // Fetch fresh user doc — don't rely on cached AuthContext state
    const userSnap = await getDoc(doc(db, 'users', user.uid));

    if (!userSnap.exists()) {
      // Brand new user — create full default document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        phoneNumber: user.phoneNumber ?? null,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        onboardingComplete: false,
        profileComplete: false,
        questionnaireComplete: false,
        subscriptionActive: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      isNewUser = true;
    } else {
      // Existing user — only touch mutable identity fields, NEVER overwrite onboarding flags
      setDoc(doc(db, 'users', user.uid), {
        phoneNumber: user.phoneNumber ?? null,
        updatedAt: serverTimestamp(),
      }, { merge: true }).catch(err => console.error('Phone login merge error:', err));

      const data = userSnap.data();
      isNewUser = data?.onboardingComplete !== true;
    }
  } catch (err: any) {
    console.warn('Firestore user fetch failed (offline mode usually). Falling back to Auth metadata.', err);
    // Fallback: If creationTime is very close to lastSignInTime, it's a new user.
    isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

    // Attempt local queueing for the merge update
    setDoc(doc(db, 'users', user.uid), {
      phoneNumber: user.phoneNumber ?? null,
      updatedAt: serverTimestamp(),
    }, { merge: true }).catch(e => console.error('Background doc merge error:', e));
  }

  return { user, isNewUser };
}

/** Sign out the current user */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/** Partially update the current user's profile document in Firestore */
export async function updateUserDoc(uid: string, data: Record<string, any>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
