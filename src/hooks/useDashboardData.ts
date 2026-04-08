import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { useAuth } from '@/src/context/AuthContext';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CycleSummary {
  currentPhase: string;
  day: number;
  cycleLength: number;
  tip: string;
}

export interface HormoneScore {
  score: number;
  trend: 'Improving' | 'Stable' | 'Declining';
  label: string;
}

export interface DietPlan {
  mealName: string;
  mealTime: string;
  description: string;
  kcal: number;
  protein: string;
  carbs: string;
}

export interface TodayWorkout {
  title: string;
  durationMin: number;
  kcal: number;
  level: string;
  progress: number; // 0–100
}

export interface GoalSummary {
  goals: string[];
}

export interface DashboardData {
  goals: GoalSummary;
  cycle: CycleSummary;
  hormones: HormoneScore;
  diet: DietPlan;
  workout: TodayWorkout;
  isLoading: boolean;
  error: string | null;
}

// ── Fallback defaults (shown when Firestore doc doesn't exist yet) ─────────────

const DEFAULT_CYCLE: CycleSummary = {
  currentPhase: 'Follicular Phase',
  day: 7,
  cycleLength: 28,
  tip: 'Energy is rising — great week for strength training and social activities.',
};

const DEFAULT_HORMONES: HormoneScore = {
  score: 74,
  trend: 'Stable',
  label: 'Attention Needed',
};

const DEFAULT_DIET: DietPlan = {
  mealName: 'Lunch',
  mealTime: '1:00 PM',
  description: 'Grilled Chicken, Quinoa Bowl & Greens',
  kcal: 620,
  protein: '46g',
  carbs: '72g',
};

const DEFAULT_WORKOUT: TodayWorkout = {
  title: 'Full Body Strength',
  durationMin: 35,
  kcal: 280,
  level: 'Intermediate',
  progress: 0,
};

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const uid = user?.uid;

  const [goals, setGoals] = useState<GoalSummary>({ goals: [] });
  const [cycle, setCycle] = useState<CycleSummary>(DEFAULT_CYCLE);
  const [hormones, setHormones] = useState<HormoneScore>(DEFAULT_HORMONES);
  const [diet, setDiet] = useState<DietPlan>(DEFAULT_DIET);
  const [workout, setWorkout] = useState<TodayWorkout>(DEFAULT_WORKOUT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        // 1️⃣ Goal selections
        const goalSnap = await getDoc(doc(db, 'goalSelections', uid!));
        if (!cancelled && goalSnap.exists()) {
          setGoals({ goals: goalSnap.data().goals ?? [] });
        }

        // 2️⃣ Cycle tracking — latest entry
        const cycleQ = query(
          collection(db, 'cycleTracking'),
          where('uid', '==', uid),
          orderBy('date', 'desc'),
          limit(1)
        );
        const cycleSnap = await getDocs(cycleQ);
        if (!cancelled && !cycleSnap.empty) {
          const d = cycleSnap.docs[0].data();
          setCycle({
            currentPhase: d.currentPhase ?? DEFAULT_CYCLE.currentPhase,
            day: d.day ?? DEFAULT_CYCLE.day,
            cycleLength: d.cycleLength ?? DEFAULT_CYCLE.cycleLength,
            tip: d.tip ?? DEFAULT_CYCLE.tip,
          });
        }

        // 3️⃣ Hormone reports — latest score
        const hormoneQ = query(
          collection(db, 'hormoneReports'),
          where('uid', '==', uid),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const hormoneSnap = await getDocs(hormoneQ);
        if (!cancelled && !hormoneSnap.empty) {
          const d = hormoneSnap.docs[0].data();
          setHormones({
            score: d.score ?? DEFAULT_HORMONES.score,
            trend: d.trend ?? DEFAULT_HORMONES.trend,
            label: d.label ?? DEFAULT_HORMONES.label,
          });
        }

        // 4️⃣ Diet plans — active plan's next meal
        const dietQ = query(
          collection(db, 'dietPlans'),
          where('uid', '==', uid),
          where('isActive', '==', true),
          limit(1)
        );
        const dietSnap = await getDocs(dietQ);
        if (!cancelled && !dietSnap.empty) {
          const d = dietSnap.docs[0].data();
          const nextMeal = d.meals?.[0];
          if (nextMeal) {
            setDiet({
              mealName: nextMeal.name ?? DEFAULT_DIET.mealName,
              mealTime: nextMeal.time ?? DEFAULT_DIET.mealTime,
              description: nextMeal.description ?? DEFAULT_DIET.description,
              kcal: nextMeal.kcal ?? DEFAULT_DIET.kcal,
              protein: nextMeal.protein ?? DEFAULT_DIET.protein,
              carbs: nextMeal.carbs ?? DEFAULT_DIET.carbs,
            });
          }
        }

        // 5️⃣ Today's workout — filter by today's date
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const workoutQ = query(
          collection(db, 'workouts'),
          where('uid', '==', uid),
          where('scheduledDate', '>=', Timestamp.fromDate(todayStart)),
          orderBy('scheduledDate', 'asc'),
          limit(1)
        );
        const workoutSnap = await getDocs(workoutQ);
        if (!cancelled && !workoutSnap.empty) {
          const d = workoutSnap.docs[0].data();
          setWorkout({
            title: d.title ?? DEFAULT_WORKOUT.title,
            durationMin: d.durationMin ?? DEFAULT_WORKOUT.durationMin,
            kcal: d.kcal ?? DEFAULT_WORKOUT.kcal,
            level: d.level ?? DEFAULT_WORKOUT.level,
            progress: d.progress ?? 0,
          });
        }
      } catch (e) {
        if (!cancelled) setError('Could not load dashboard data.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [uid]);

  return { goals, cycle, hormones, diet, workout, isLoading, error };
}
