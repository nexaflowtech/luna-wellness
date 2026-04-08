import { create } from 'zustand';
import { HealthProfile } from '@/types/database';

interface UserState {
  isHydrated: boolean;
  userGender: 'male' | 'female' | 'other';
  hasActiveSubscription: boolean;
  healthProfile: Partial<HealthProfile> | null;
  setGender: (gender: 'male' | 'female' | 'other') => void;
  setHealthProfile: (profile: Partial<HealthProfile>) => void;
  hydrate: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isHydrated: false,
  userGender: 'female', // Defaulting to female for Luna Wellness onboarding
  hasActiveSubscription: false,
  healthProfile: null,
  setGender: (gender) => set({ userGender: gender }),
  setHealthProfile: (profile) => set({ healthProfile: profile }),
  hydrate: () => set({ isHydrated: true }),
}));
