// ==========================================
// FITNESS & HEALTH METRIC CALCULATIONS
// Science-based MET Formulas & SDG 3 Analytics
// ==========================================

import { WorkoutIntensity } from './types';

/**
 * Calculates estimated calories burned using the standard ACSM (American College of Sports Medicine) MET formula:
 * Calories = Duration (mins) * (MET * 3.5 * weight_kg) / 200
 */
export function calculateCaloriesBurned(
  metMultiplier: number,
  durationSeconds: number,
  weightKg: number = 70,
  intensity: WorkoutIntensity = 'medium'
): number {
  if (durationSeconds <= 0) return 0;
  
  // Intensity modifier
  const intensityFactor: Record<WorkoutIntensity, number> = {
    low: 0.85,
    medium: 1.0,
    high: 1.25,
  };

  const adjustedMET = metMultiplier * (intensityFactor[intensity] || 1.0);
  const durationMinutes = durationSeconds / 60;
  const rawCalories = durationMinutes * ((adjustedMET * 3.5 * weightKg) / 200);

  return Math.round(rawCalories * 10) / 10; // Round to 1 decimal place
}

/**
 * Formats seconds into MM:SS or HH:MM:SS string
 */
export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats duration in human readable format (e.g. "45 mins" or "1 hr 15 mins")
 */
export function formatDurationHuman(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? '' : 's'}`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) {
    return `${hours} hr${hours === 1 ? '' : 's'}`;
  }
  return `${hours} hr ${remMinutes} min${remMinutes === 1 ? '' : 's'}`;
}

/**
 * Calculates BMI and health classification
 */
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  color: string;
} {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, category: 'Normal', color: 'text-emerald-500' };
  }

  const heightMeters = heightCm / 100;
  const bmi = Math.round((weightKg / (heightMeters * heightMeters)) * 10) / 10;

  if (bmi < 18.5) return { bmi, category: 'Underweight', color: 'text-cyan-400' };
  if (bmi < 24.9) return { bmi, category: 'Normal', color: 'text-emerald-400' };
  if (bmi < 29.9) return { bmi, category: 'Overweight', color: 'text-amber-400' };
  return { bmi, category: 'Obese', color: 'text-rose-400' };
}

/**
 * Calculates consecutive active streak based on list of workout dates
 */
export function calculateWorkoutStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;

  // Normalize dates to YYYY-MM-DD
  const uniqueDates = Array.from(
    new Set(
      dates.map((d) => new Date(d).toISOString().split('T')[0])
    )
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const mostRecent = uniqueDates[0];
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0; // Streak broken if no workout today or yesterday
  }

  let streak = 1;
  let checkDate = new Date(mostRecent);

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(checkDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const expectedStr = prevDate.toISOString().split('T')[0];

    if (uniqueDates[i] === expectedStr) {
      streak++;
      checkDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Computes SDG 3 Impact Metrics:
 * - WHO Goal progress (150 mins of moderate physical activity per week recommended)
 * - Estimated Carbon/CO2 footprint saved by exercising at home vs roundtrip gym commute (approx 0.82kg CO2 per 5km drive)
 */
export function calculateSDG3Metrics(weeklyActiveMinutes: number, totalWorkouts: number) {
  const whoWeeklyTarget = 150; // WHO Guideline for weekly physical activity
  const whoTargetPercentage = Math.min(
    100,
    Math.round((weeklyActiveMinutes / whoWeeklyTarget) * 100)
  );

  // Home workout eco-impact: ~0.82 kg CO2 saved per home workout (avoiding gym transit/facility energy)
  const co2SavedKg = Math.round(totalWorkouts * 0.82 * 10) / 10;
  
  // Healthcare risk reduction indicator based on active minutes
  const cvdRiskReduction = Math.min(30, Math.round((weeklyActiveMinutes / 150) * 25));

  return {
    whoWeeklyTarget,
    whoTargetPercentage,
    co2SavedKg,
    cvdRiskReduction,
  };
}
