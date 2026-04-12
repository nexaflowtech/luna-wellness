/**
 * Luna AI Service — Powered by Google Gemini 1.5 Flash (Free Tier)
 * Called directly from the app. No backend needed.
 * Free quota: 60 requests/min via ai.google.dev
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

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

// ─── Gemini Client ────────────────────────────────────────────────────────────
export class LunaAiService {

  static async generateOnboardingPlan(
    profile: UserHealthProfile
  ): Promise<OnboardingPlanResult> {
    // Read at call-time to avoid stale Expo bundler cache
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY ?? '';
    console.log('[LunaAI] Key loaded:', apiKey ? `${apiKey.slice(0, 8)}...` : 'EMPTY — check .env');
    
    if (!apiKey) {
      console.warn('[LunaAI] No GEMINI key — using heuristic engine.');
      await new Promise((r) => setTimeout(r, 2000));
      return this.heuristicEngine(profile);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json', // Forces pure JSON output — no markdown wrapping
          temperature: 0.2,
        },
      });

      const prompt = `
You are Luna, an AI metabolic and endocrinology health coach.
Analyze the user's health profile below and generate a precise, medically-informed wellness plan.

USER HEALTH PROFILE:
${JSON.stringify(profile, null, 2)}

Respond ONLY with a valid JSON object matching this exact structure:
{
  "calorieRange": "string e.g. '1600-1850 kcal'",
  "macroSplit": {
    "protein": "string e.g. '120-140g'",
    "fiber": "string e.g. '25-35g'",
    "carbs": "string e.g. '150-180g'",
    "fat": "string e.g. '50-65g'"
  },
  "timelineEstimate": {
    "months": number,
    "description": "string — brief justification"
  },
  "metabolicProfile": "string — 1-2 sentences describing metabolic state",
  "hormonalRiskSignals": ["string array of risk flags, or ['None flagged'] if clean"],
  "planConfidenceScore": number between 0 and 100
}

Clinical constraints to follow:
- Calorie floor: NEVER below 1350 kcal/day for females
- PCOS users: lower carbs, higher protein, flag androgen risk
- Thyroid users: never recommend extreme low-carb; flag supplement timing
- Fertility users: ensure adequate iron and folate macro context
- Confidence score should reflect data completeness (more adaptiveAnswers = higher score)
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Strip any accidental markdown wrappers
      const cleanedText = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const parsed = JSON.parse(cleanedText) as OnboardingPlanResult;
      return parsed;
    } catch (error) {
      console.warn('[LunaAI] Gemini call failed, using heuristic fallback:', error);
      return this.heuristicEngine(profile);
    }
  }

  // ─── Local heuristic fallback (if no API key or network error) ──────────────
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
