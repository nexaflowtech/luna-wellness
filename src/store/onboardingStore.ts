import { create } from 'zustand';

interface OnboardingState {
    gender: string | null;
    height: number | null;
    weight: number | null;
    bmi: number | null;
    bmi_category: string | null;
    goal: string | null;
    activity: string | null;
    diet: string | null;
    sleep: string | null;
    stress: string | null;

    setGender: (g: string) => void;
    setBodyMetrics: (h: number, w: number, b: number, category: string) => void;
    setGoal: (g: string) => void;
    setLifestyle: (type: 'activity' | 'diet' | 'sleep' | 'stress', val: string) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
    gender: null,
    height: 175,
    weight: 72,
    bmi: null,
    bmi_category: null,
    goal: null,
    activity: null,
    diet: null,
    sleep: null,
    stress: null,

    setGender: (g) => set({ gender: g }),
    setBodyMetrics: (h, w, b, category) => set({ height: h, weight: w, bmi: b, bmi_category: category }),
    setGoal: (g) => set({ goal: g }),
    setLifestyle: (type, val) => set((state) => ({ ...state, [type]: val })),
    reset: () => set({
        gender: null, height: 175, weight: 72, bmi: null, bmi_category: null,
        goal: null, activity: null, diet: null, sleep: null, stress: null
    }),
}));
