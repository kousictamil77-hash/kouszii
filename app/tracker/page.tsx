'use client';

import React, { useState, useEffect } from 'react';
import { Exercise, ProgressLog, DashboardStats } from '@/lib/types';
import { INITIAL_EXERCISES } from '@/lib/mockData';
import { LocalStore } from '@/lib/storage';
import { ActiveWorkoutSession } from '@/components/ActiveWorkoutSession';
import { QuickLogModal } from '@/components/QuickLogModal';
import { SDG3Banner } from '@/components/SDG3Banner';
import { 
  Play, 
  PlusCircle, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Activity, 
  Sparkles,
  Dumbbell,
  Target
} from 'lucide-react';
import { formatDurationHuman } from '@/lib/calculations';

export default function TrackerPage() {
  const [activeSessionExercise, setActiveSessionExercise] = useState<Exercise | null>(null);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [selectedQuickExercise, setSelectedQuickExercise] = useState<Exercise | null>(null);
  const [stats, setStats] = useState<DashboardStats>(LocalStore.getDashboardStats());
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const refreshData = () => {
    setStats(LocalStore.getDashboardStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleWorkoutSaved = (log: ProgressLog) => {
    refreshData();
    setSuccessToast(`Logged ${log.exercise_name} (${Math.round(log.calories_burned)} kcal burned)!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await fetch(`/api/logs/${id}`, { method: 'DELETE' });
    } catch {}
    LocalStore.deleteLog(id);
    refreshData();
  };

  const handleLaunchSession = (exercise: Exercise) => {
    setActiveSessionExercise(exercise);
  };

  const handleOpenQuickLog = (exercise?: Exercise) => {
    if (exercise) setSelectedQuickExercise(exercise);
    setQuickLogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header & Launcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Workout Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Workout Session Tracker
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Start a live stopwatch session with audio cues or log completed bodyweight workouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenQuickLog()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" />
            Manual Entry
          </button>

          <button
            onClick={() => handleLaunchSession(INITIAL_EXERCISES[0])}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Live Session
          </button>
        </div>
      </div>

      {/* Today's Goal Progress Bar */}
      <div className="rounded-3xl glass-panel border border-emerald-500/30 p-6 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Activity Goal</span>
              <div className="text-xl font-bold text-white mt-0.5">
                {stats.today_minutes} of {stats.daily_goal_minutes} Minutes Completed
              </div>
            </div>
          </div>

          <div className="text-right flex items-center sm:block gap-3">
            <span className="text-2xl font-black text-emerald-400 font-heading">
              {stats.daily_goal_progress_pct}%
            </span>
            <span className="text-xs text-slate-400 sm:block">of 30m Goal</span>
          </div>
        </div>

        {/* Bar */}
        <div className="mt-4 w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-glow-emerald"
            style={{ width: `${stats.daily_goal_progress_pct}%` }}
          />
        </div>
      </div>

      {/* Quick Launch Cards (Pick an Exercise to Start) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            Choose Exercise for Live Timer
          </h2>
          <span className="text-xs text-slate-400">Click any card to start session</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_EXERCISES.slice(0, 4).map((ex) => (
            <div
              key={ex.id}
              onClick={() => handleLaunchSession(ex)}
              className="group cursor-pointer rounded-2xl glass-panel p-4 border border-slate-800 hover:border-emerald-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-glass"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {ex.difficulty}
                </span>
                <span className="text-xs text-slate-400">~{ex.calories_per_minute_est} kcal/m</span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {ex.name}
              </h3>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Start Session</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout History / Logs Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Session Logs
          </h2>
          <span className="text-xs text-slate-400">{stats.recent_logs.length} logged workouts</span>
        </div>

        {stats.recent_logs.length === 0 ? (
          <div className="rounded-3xl glass-panel border border-slate-800 p-10 text-center space-y-3">
            <Activity className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No workouts recorded yet</h3>
            <p className="text-xs text-slate-400">Click &ldquo;Start Live Session&rdquo; above to log your first exercise.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl glass-panel border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-4">Exercise</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Calories</th>
                  <th className="px-5 py-4">Volume</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {stats.recent_logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{log.exercise_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {log.category_name || 'Bodyweight'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{formatDurationHuman(log.duration_seconds)}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {Math.round(log.calories_burned)} kcal
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {log.sets_completed} sets ({log.reps_completed} reps)
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(log.completed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SDG 3 Impact banner */}
      <SDG3Banner compact />

      {/* Active Session Runner Modal */}
      {activeSessionExercise && (
        <ActiveWorkoutSession
          exercise={activeSessionExercise}
          onClose={() => setActiveSessionExercise(null)}
          onWorkoutSaved={handleWorkoutSaved}
        />
      )}

      {/* Quick Manual Log Modal */}
      <QuickLogModal
        isOpen={quickLogOpen}
        onClose={() => {
          setQuickLogOpen(false);
          setSelectedQuickExercise(null);
        }}
        onWorkoutSaved={handleWorkoutSaved}
        initialExercise={selectedQuickExercise}
      />
    </div>
  );
}
