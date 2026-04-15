import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  PhoneAuthProvider,
  ApplicationVerifier,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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

/** Complete phone OTP sign-in flow with received verification code. */
export async function verifyPhoneOtp(
  verificationId: string,
  code: string
): Promise<User> {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  const result = await signInWithCredential(auth, credential);

  setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    phoneNumber: result.user.phoneNumber ?? null,
    email: result.user.email ?? null,
    displayName: result.user.displayName ?? null,
    onboardingComplete: false,
    profileComplete: false,
    questionnaireComplete: false,
    subscriptionActive: false,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true }).catch(err => console.error('Phone login profile merge error:', err));

  return result.user;
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
