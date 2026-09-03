// ==========================================
// DATA MODELS & TYPES
// Home Workout - Smart Fitness Management (SDG 3)
// ==========================================

export type FitnessDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutIntensity = 'low' | 'medium' | 'high';
export type CategorySlug = 'upper-body' | 'core' | 'lower-body' | 'cardio' | 'full-body';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  weight_kg: number;
  height_cm: number;
  fitness_level: FitnessDifficulty;
  daily_goal_minutes: number;
  current_streak: number;
  last_workout_date?: string | null;
  total_calories_burned: number;
  total_workouts: number;
  total_active_seconds: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  slug: CategorySlug | string;
  description: string;
  icon_name: string;
  color_code: string;
  target_area: string;
  exercise_count?: number;
}

export interface Exercise {
  id: string;
  category_id: string;
  category?: ExerciseCategory;
  name: string;
  slug: string;
  description: string;
  difficulty: FitnessDifficulty;
  target_muscles: string[];
  met_multiplier: number;
  recommended_reps: number;
  recommended_sets: number;
  recommended_duration_seconds: number;
  instructions: string[];
  form_tips: string[];
  calories_per_minute_est: number;
  sdg_alignment_note?: string;
  created_at?: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  exercise_id?: string | null;
  exercise_name: string;
  category_id?: string | null;
  category_name?: string | null;
  duration_seconds: number;
  calories_burned: number;
  sets_completed: number;
  reps_completed: number;
  intensity_level: WorkoutIntensity;
  notes?: string | null;
  completed_at: string;
  created_at?: string;
}

export interface DailyActivityStat {
  date: string; // YYYY-MM-DD
  day_label: string; // Mon, Tue, etc.
  minutes: number;
  calories: number;
  workout_count: number;
}

export interface CategoryBreakdownStat {
  category_id: string;
  category_name: string;
  color_code: string;
  count: number;
  percentage: number;
  calories: number;
}

export interface DashboardStats {
  today_minutes: number;
  today_calories: number;
  daily_goal_minutes: number;
  daily_goal_progress_pct: number;
  current_streak: number;
  total_workouts: number;
  total_active_minutes: number;
  total_calories_burned: number;
  weekly_activity: DailyActivityStat[];
  category_distribution: CategoryBreakdownStat[];
  recent_logs: ProgressLog[];
}

export interface ActiveWorkoutSessionState {
  exercise: Exercise;
  currentSet: number;
  targetSets: number;
  targetReps: number;
  elapsedSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  isResting: boolean;
  restSecondsLeft: number;
  intensity: WorkoutIntensity;
  caloriesBurned: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
