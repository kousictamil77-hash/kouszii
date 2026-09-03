// ==========================================
// CLIENT DATA STORAGE & SYNC LAYER
// Seamless fallback between Supabase and Local Demo Storage
// ==========================================

import { ProgressLog, UserProfile, Exercise, DashboardStats, CategoryBreakdownStat, DailyActivityStat } from './types';
import { DEMO_PROGRESS_LOGS, DEMO_USER_PROFILE, INITIAL_CATEGORIES, INITIAL_EXERCISES } from './mockData';
import { calculateWorkoutStreak } from './calculations';

const LOGS_KEY = 'hw_smart_fitness_logs_v1';
const PROFILE_KEY = 'hw_smart_fitness_profile_v1';

export const LocalStore = {
  // Get Profile
  getProfile(): UserProfile {
    if (typeof window === 'undefined') return DEMO_USER_PROFILE;
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEMO_USER_PROFILE;
  },

  // Save Profile
  saveProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {}
  },

  // Get all logs
  getLogs(): ProgressLog[] {
    if (typeof window === 'undefined') return DEMO_PROGRESS_LOGS;
    try {
      const stored = localStorage.getItem(LOGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with demo logs
      localStorage.setItem(LOGS_KEY, JSON.stringify(DEMO_PROGRESS_LOGS));
      return DEMO_PROGRESS_LOGS;
    } catch {
      return DEMO_PROGRESS_LOGS;
    }
  },

  // Add new workout log
  addLog(newLog: Omit<ProgressLog, 'id' | 'created_at'>): ProgressLog {
    const logs = this.getLogs();
    const createdLog: ProgressLog = {
      ...newLog,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    const updatedLogs = [createdLog, ...logs];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
      } catch {}
    }

    // Auto-update profile stats
    const profile = this.getProfile();
    const allDates = updatedLogs.map((l) => l.completed_at);
    const newStreak = calculateWorkoutStreak(allDates);

    const updatedProfile: UserProfile = {
      ...profile,
      total_workouts: profile.total_workouts + 1,
      total_calories_burned: Math.round((profile.total_calories_burned + createdLog.calories_burned) * 10) / 10,
      total_active_seconds: profile.total_active_seconds + createdLog.duration_seconds,
      current_streak: newStreak,
      last_workout_date: new Date(createdLog.completed_at).toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    };

    this.saveProfile(updatedProfile);
    return createdLog;
  },

  // Delete workout log
  deleteLog(id: string): boolean {
    const logs = this.getLogs();
    const target = logs.find((l) => l.id === id);
    if (!target) return false;

    const filtered = logs.filter((l) => l.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));
      } catch {}
    }

    // Update profile
    const profile = this.getProfile();
    const allDates = filtered.map((l) => l.completed_at);
    const newStreak = calculateWorkoutStreak(allDates);

    const updatedProfile: UserProfile = {
      ...profile,
      total_workouts: Math.max(0, profile.total_workouts - 1),
      total_calories_burned: Math.max(0, Math.round((profile.total_calories_burned - target.calories_burned) * 10) / 10),
      total_active_seconds: Math.max(0, profile.total_active_seconds - target.duration_seconds),
      current_streak: newStreak,
      updated_at: new Date().toISOString(),
    };

    this.saveProfile(updatedProfile);
    return true;
  },

  // Compute Dashboard Statistics
  getDashboardStats(): DashboardStats {
    const profile = this.getProfile();
    const logs = this.getLogs();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter((l) => {
      try {
        return new Date(l.completed_at).toISOString().split('T')[0] === todayStr;
      } catch {
        return false;
      }
    });

    const todayMinutes = Math.round(todayLogs.reduce((acc, l) => acc + l.duration_seconds, 0) / 60);
    const todayCalories = Math.round(todayLogs.reduce((acc, l) => acc + l.calories_burned, 0) * 10) / 10;
    const dailyGoalProgress = Math.min(100, Math.round((todayMinutes / (profile.daily_goal_minutes || 30)) * 100));

    // Calculate Last 7 Days Activity
    const weeklyActivity: DailyActivityStat[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter((l) => {
        try {
          return new Date(l.completed_at).toISOString().split('T')[0] === dateStr;
        } catch {
          return false;
        }
      });

      const dayMins = Math.round(dayLogs.reduce((acc, l) => acc + l.duration_seconds, 0) / 60);
      const dayCals = Math.round(dayLogs.reduce((acc, l) => acc + l.calories_burned, 0));

      weeklyActivity.push({
        date: dateStr,
        day_label: dayNames[d.getDay()],
        minutes: dayMins,
        calories: dayCals,
        workout_count: dayLogs.length,
      });
    }

    // Category breakdown
    const catMap: Record<string, { count: number; calories: number; name: string; color: string }> = {};

    INITIAL_CATEGORIES.forEach((cat) => {
      catMap[cat.id] = {
        count: 0,
        calories: 0,
        name: cat.name,
        color: cat.color_code,
      };
    });

    logs.forEach((log) => {
      const catId = log.category_id || 'c0000000-0000-0000-0000-000000000001';
      if (catMap[catId]) {
        catMap[catId].count += 1;
        catMap[catId].calories += log.calories_burned;
      }
    });

    const totalLogCount = logs.length || 1;
    const category_distribution: CategoryBreakdownStat[] = Object.entries(catMap).map(([id, info]) => ({
      category_id: id,
      category_name: info.name,
      color_code: info.color,
      count: info.count,
      calories: Math.round(info.calories),
      percentage: Math.round((info.count / totalLogCount) * 100),
    }));

    return {
      today_minutes: todayMinutes,
      today_calories: todayCalories,
      daily_goal_minutes: profile.daily_goal_minutes || 30,
      daily_goal_progress_pct: dailyGoalProgress,
      current_streak: profile.current_streak || 0,
      total_workouts: profile.total_workouts || logs.length,
      total_active_minutes: Math.round((profile.total_active_seconds || 0) / 60),
      total_calories_burned: profile.total_calories_burned || 0,
      weekly_activity: weeklyActivity,
      category_distribution: category_distribution,
      recent_logs: logs.slice(0, 10),
    };
  }
};
