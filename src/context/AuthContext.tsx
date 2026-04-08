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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  onboardingComplete: false,
  profileComplete: false,
  questionnaireComplete: false,
  subscriptionActive: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

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
    <AuthContext.Provider value={{ user, isLoading, onboardingComplete, profileComplete, questionnaireComplete, subscriptionActive }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
