import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { useAuth } from './AuthContext';

interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  onboardingComplete?: boolean;
  goals?: string[];
  riskScore?: number;
  recommendedProgram?: string;
  createdAt?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  profile: null,
  isLoading: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          setProfile({ uid: user.uid, ...snap.data() } as UserProfile);
        } else {
          setProfile({ uid: user.uid, email: user.email ?? undefined });
        }
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <UserContext.Provider value={{ profile, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
