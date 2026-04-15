import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/src/config/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  onboardingComplete: boolean;
  profileComplete: boolean;
  questionnaireComplete: boolean;
  subscriptionActive: boolean;
  goal: string | null;
  gender: string | null;
  healthScore: number | null;
  onboardingStep: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  onboardingComplete: false,
  profileComplete: false,
  questionnaireComplete: false,
  subscriptionActive: false,
  goal: null,
  gender: null,
  healthScore: null,
  onboardingStep: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [goal, setGoal] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Listen to User document in real-time
        unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), 
          (docSnap) => {
            const data = docSnap.data();
            setOnboardingComplete(data?.onboardingComplete === true);
            setProfileComplete(data?.profileComplete === true);
            setQuestionnaireComplete(data?.questionnaireComplete === true);
            setSubscriptionActive(data?.subscriptionActive === true);
            setGoal(data?.goal ?? null);
            setGender(data?.gender ?? null);
            setHealthScore(data?.healthScore ?? null);
            setOnboardingStep(data?.onboardingStep ?? null);
            setIsLoading(false);
          },
          (error) => {
            console.error('Firestore AuthContext error:', error);
            setIsLoading(false);
          }
        );
      } else {
        setOnboardingComplete(false);
        setProfileComplete(false);
        setQuestionnaireComplete(false);
        setSubscriptionActive(false);
        setGoal(null);
        setGender(null);
        setHealthScore(null);
        setOnboardingStep(null);
        setIsLoading(false);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoading, onboardingComplete, profileComplete, questionnaireComplete, subscriptionActive,
      goal, gender, healthScore, onboardingStep
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
