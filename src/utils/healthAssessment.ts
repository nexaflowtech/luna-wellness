export interface AssessmentInputs {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'stress_relief';
  medicalConditions: string[];
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  stressLevel: 'low' | 'moderate' | 'high';
  activityLevel: 'sedentary' | 'lightly_active' | 'active' | 'very_active';
  dietPreference: 'none' | 'vegan' | 'vegetarian' | 'keto' | 'paleo';
}

export interface AssessmentOutputs {
  bmi: number;
  healthScore: number;
  riskScore: 'Low' | 'Medium' | 'High';
  recommendedProgram: string;
  dietType: string;
  workoutIntensity: 'Low' | 'Moderate' | 'High';
}

/**
 * Luna Wellness Core Health Engine Algorithm
 * Translates raw onboarding biometrics and lifestyle choices into actionable health programs.
 */
export function calculateAssessmentResults(inputs: AssessmentInputs): AssessmentOutputs {
  const bmi = calculateBMI(inputs.weightKg, inputs.heightCm);
  const healthScore = calculateHealthScore(inputs, bmi);
  const riskScore = calculateRiskScore(inputs, bmi);
  const workoutIntensity = determineIntensity(riskScore, inputs.activityLevel);
  const dietType = determineDiet(inputs.goal, inputs.dietPreference);
  const recommendedProgram = matchProgram(inputs.goal, workoutIntensity);

  return {
    bmi: Number(bmi.toFixed(1)),
    healthScore,
    riskScore,
    recommendedProgram,
    dietType,
    workoutIntensity,
  };
}

// ==========================================
// INTERNAL ALGORITHMS
// ==========================================

function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function calculateHealthScore(inputs: AssessmentInputs, bmi: number): number {
  let score = 100;

  // 1. BMI Deduction
  if (bmi >= 25.0 && bmi <= 29.9) score -= 10;
  else if (bmi >= 30) score -= 20;
  else if (bmi < 18.5) score -= 15;

  // 2. Sleep Deduction
  if (inputs.sleepQuality === 'poor') score -= 15;
  else if (inputs.sleepQuality === 'fair') score -= 5;
  else if (inputs.sleepQuality === 'excellent') score += 5;

  // 3. Stress Deduction
  if (inputs.stressLevel === 'high') score -= 15;
  else if (inputs.stressLevel === 'moderate') score -= 5;

  // 4. Activity Deduction
  if (inputs.activityLevel === 'sedentary') score -= 20;
  else if (inputs.activityLevel === 'lightly_active') score -= 10;

  // Ensure score doesn't drop below a demotivational 10, or exceed 100
  return Math.max(10, Math.min(100, score));
}

function calculateRiskScore(inputs: AssessmentInputs, bmi: number): 'Low' | 'Medium' | 'High' {
  const strConditions = inputs.medicalConditions.map(c => c.toLowerCase());
  
  const highRiskConditions = ['heart disease', 'diabetes', 'severe asthma'];
  const isHighRiskCondition = strConditions.some(c => highRiskConditions.includes(c));

  if (isHighRiskCondition || (inputs.age > 55 && bmi > 30)) {
    return 'High';
  }

  const medRiskConditions = ['hypertension', 'joint issues', 'pcos'];
  const isMedRiskCondition = strConditions.some(c => medRiskConditions.includes(c));

  if (isMedRiskCondition || bmi > 35 || inputs.age > 65) {
    return 'Medium';
  }

  return 'Low';
}

function determineIntensity(riskScore: 'Low' | 'Medium' | 'High', activity: AssessmentInputs['activityLevel']): 'Low' | 'Moderate' | 'High' {
  if (riskScore === 'High') return 'Low';
  
  if (riskScore === 'Medium') return 'Moderate';
  
  if (activity === 'sedentary') return 'Low';
  if (activity === 'lightly_active') return 'Moderate';
  
  return 'High'; // Low Risk + Active
}

function determineDiet(goal: AssessmentInputs['goal'], preference: AssessmentInputs['dietPreference']): string {
  if (preference !== 'none') {
    return preference.charAt(0).toUpperCase() + preference.slice(1); // 'vegan' -> 'Vegan'
  }

  switch (goal) {
    case 'weight_loss':
      return 'Caloric Deficit (High Protein)';
    case 'muscle_gain':
      return 'Hypertrophy Surplus (Macro Balanced)';
    case 'stress_relief':
    case 'maintenance':
      return 'Mediterranean Diet (Anti-inflammatory)';
    default:
      return 'Balanced Lifestyle Nutrition';
  }
}

function matchProgram(goal: AssessmentInputs['goal'], intensity: 'Low' | 'Moderate' | 'High'): string {
  if (goal === 'weight_loss') {
    if (intensity === 'Low') return 'Gentle Burn Foundation';
    if (intensity === 'Moderate') return 'Cardio Sculpt Accelerated';
    return 'HIIT Fat Loss Elite';
  }

  if (goal === 'muscle_gain') {
    if (intensity === 'Low') return 'Mobility & Bodyweight Primer';
    return 'Hypertrophy Power Build';
  }

  if (goal === 'stress_relief') {
    return 'Mind-Body Restoration (Yoga & Pilates)';
  }

  // default / maintenance
  return intensity === 'High' ? 'Strength & Conditioning Masterclass' : 'Daily Movement Protocol';
}
