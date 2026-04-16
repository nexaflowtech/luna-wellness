import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export interface UserHealthProfile {
  age: number;
  gender: 'female' | 'male' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  primaryGoals: string[];
  adaptiveAnswers?: Record<string, string>;
}

export interface OnboardingPlanResult {
  calorieRange: string;
  macroSplit: {
    protein: string;
    fiber: string;
    carbs: string;
    fat: string;
  };
  timelineEstimate: {
    months: number;
    description: string;
  };
  metabolicProfile: string;
  hormonalRiskSignals: string[];
  planConfidenceScore: number;
}

// ─── Luna AI Service (Server-Proxy) ───────────────────────────────────────────
export class LunaAiService {

  /**
   * Generates a health plan using Gemini AI via a secured Firebase Cloud Function.
   * This ensures the API key remains on the server and Clinical constraints are unified.
   */
  static async generateOnboardingPlan(
    profile: UserHealthProfile
  ): Promise<OnboardingPlanResult> {
    console.log('[LunaAI] Requesting AI plan via Cloud Functions...');

    try {
      const generatePlan = httpsCallable(functions, 'generateOnboardingPlanGemini');
      const result = await generatePlan({ profile });

      return result.data as OnboardingPlanResult;
    } catch (error) {
      console.warn('[LunaAI] Cloud Function failed, using heuristic fallback:', error);
      // We still wait a bit to simulate processing time for UX consistency
      await new Promise((r) => setTimeout(r, 2000));
      return this.heuristicEngine(profile);
    }
  }

  // ─── Local heuristic fallback (if network error or function fails) ────────────
  private static heuristicEngine(profile: UserHealthProfile): OnboardingPlanResult {
    const { age, gender, heightCm, weightKg, targetWeightKg, primaryGoals, adaptiveAnswers } = profile;

    const goalDelta = weightKg - targetWeightKg;
    const isWeightLoss = goalDelta > 0;
    const isPCOS = primaryGoals.some((g) =>
      g.toLowerCase().includes('pcos') || g.toLowerCase().includes('pcod')
    );
    const isThyroid = primaryGoals.some((g) => g.toLowerCase().includes('thyroid'));
    const isFertility = primaryGoals.some((g) =>
      g.toLowerCase().includes('fertility') || g.toLowerCase().includes('cycle')
    );

    // Mifflin-St Jeor BMR
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'male' ? 5 : -161;

    const tdee = bmr * 1.4; // Lightly active
    const safeDeficit = Math.min(tdee * 0.20, 500); // Max 20% deficit
    let targetCalories = isWeightLoss ? tdee - safeDeficit : tdee + 300;
    if (gender !== 'male' && targetCalories < 1350) targetCalories = 1350;

    const lower = Math.round(targetCalories / 50) * 50;
    const upper = lower + 200;

    let carbs = isWeightLoss ? '120-150g' : '180-230g';
    let protein = isWeightLoss ? '110-140g' : '100-130g';
    let fat = '45-60g';
    const fiber = '25-35g';

    const metabolicProfileArr: string[] = [];
    const hormonalRiskSignals: string[] = [];

    if (isPCOS) {
      carbs = '90-120g';
      protein = '120-150g';
      fat = '55-70g';
      metabolicProfileArr.push('Insulin resistance profile (PCOS phenotype) expected.');
      hormonalRiskSignals.push('High risk of cortisol spikes in extreme deficits.');
      hormonalRiskSignals.push('Potential androgen dominance — prioritize glycaemic control.');
      const pcosSymp = adaptiveAnswers?.pcosSymptoms ?? '';
      if (pcosSymp.toLowerCase().includes('irregular') || pcosSymp.toLowerCase().includes('missing')) {
        hormonalRiskSignals.push('Anovulation detected — blood sugar regulation is top priority.');
      }
    } else {
      metabolicProfileArr.push('Standard metabolic adaptation expected.');
    }

    if (isThyroid) {
      metabolicProfileArr.push('Possible slower metabolic baseline due to thyroid status.');
      hormonalRiskSignals.push('Extreme low-carb not advised — thyroid requires adequate carbohydrate.');
      if (isWeightLoss) carbs = '130-160g';
      const med = adaptiveAnswers?.thyroidMedication ?? '';
      if (med.toLowerCase().includes('yes')) {
        hormonalRiskSignals.push(`Medication note: ${med}. Mineral supplements must avoid medication window.`);
      }
    }

    if (isFertility) {
      metabolicProfileArr.push('Fertility-focused plan: adequate folate and iron macro context applied.');
      hormonalRiskSignals.push('Ensure adequate iron (18mg/day) and folate (400mcg/day) intake.');
    }

    const timelineMonths = Math.max(2, Math.ceil(Math.abs(goalDelta) / (isPCOS ? 1.5 : 2)));
    const confidenceScore = 70 + Object.keys(adaptiveAnswers ?? {}).length * 5;

    return {
      calorieRange: `${lower}-${upper} kcal`,
      macroSplit: { protein, fiber, carbs, fat },
      timelineEstimate: {
        months: timelineMonths,
        description: `Based on a safe, hormone-protective ${isWeightLoss ? 'deficit' : 'surplus'}.`,
      },
      metabolicProfile: metabolicProfileArr.join(' '),
      hormonalRiskSignals: hormonalRiskSignals.length ? hormonalRiskSignals : ['None flagged based on inputs.'],
      planConfidenceScore: Math.min(confidenceScore, 98),
    };
  }
}
