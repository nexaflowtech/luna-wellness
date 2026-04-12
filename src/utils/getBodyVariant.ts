/**
 * Calculates BMI and returns the corresponding body variant label.
 * BMI = weightKg / ((heightCm / 100) * (heightCm / 100))
 */

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export type BodyVariant = 'underweight' | 'normal' | 'overweight' | 'obese' | 'slim' | 'toned' | 'athletic';

export function getBodyVariant(bmi: number): BodyVariant {
  if (bmi < 18.5) return 'underweight';
  if (bmi >= 18.5 && bmi < 25) return 'normal';
  if (bmi >= 25 && bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Maps a body variant or BMI state to its corresponding Spline state name.
 */
export function getSplineState(variant: BodyVariant): string {
  const mapping: Record<BodyVariant, string> = {
    underweight: 'state_underweight',
    normal: 'state_normal',
    overweight: 'state_overweight',
    obese: 'state_obese',
    slim: 'state_slim',
    toned: 'state_toned',
    athletic: 'state_athletic',
  };
  return mapping[variant] || 'state_normal';
}
