'use client';

import React, { useState } from 'react';
import { Exercise, WorkoutIntensity, ProgressLog } from '@/lib/types';
import { INITIAL_EXERCISES } from '@/lib/mockData';
import { calculateCaloriesBurned } from '@/lib/calculations';
import { LocalStore } from '@/lib/storage';
import { X, Flame, Clock, Dumbbell, Sparkles } from 'lucide-react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutSaved: (log: ProgressLog) => void;
  initialExercise?: Exercise | null;
}

export function QuickLogModal({
  isOpen,
  onClose,
  onWorkoutSaved,
  initialExercise,
}: QuickLogModalProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    initialExercise?.id || INITIAL_EXERCISES[0]?.id || ''
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(12);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('medium');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentExercise =
    INITIAL_EXERCISES.find((e) => e.id === selectedExerciseId) || INITIAL_EXERCISES[0];

  const profile = LocalStore.getProfile();
  const estimatedCalories = calculateCaloriesBurned(
    currentExercise.met_multiplier,
    durationMinutes * 60,
    profile?.weight_kg || 70,
    intensity
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const newLogData = {
      user_id: profile?.id || 'demo-user',
      exercise_id: currentExercise.id,
      exercise_name: currentExercise.name,
      category_id: currentExercise.category_id,
      category_name: currentExercise.category?.name || 'Calisthenics',
      duration_seconds: durationMinutes * 60,
      calories_burned: estimatedCalories,
      sets_completed: sets,
      reps_completed: reps * sets,
      intensity_level: intensity,
      notes: notes || `Manual log: ${sets} sets × ${reps} reps of ${currentExercise.name}`,
      completed_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLogData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          LocalStore.addLog(newLogData);
          onWorkoutSaved(json.data);
          onClose();
          return;
        }
      }
    } catch {}

    const saved = LocalStore.addLog(newLogData);
    onWorkoutSaved(saved);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl glass-modal border border-slate-700/80 p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Log Past Workout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exercise Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exercise</label>
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {INITIAL_EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Duration Slider / Input */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">Duration</span>
              <span className="font-bold text-emerald-400">{durationMinutes} Minutes</span>
            </div>
            <input
              type="range"
              min="2"
              max="90"
              step="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sets & Reps Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sets</label>
              <input
                type="number"
                min="1"
                max="20"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reps / Set</label>
              <input
                type="number"
                min="1"
                max="200"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Intensity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Effort / Intensity</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as WorkoutIntensity[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setIntensity(level)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                    intensity === level
                      ? 'bg-emerald-500 text-dark-bg border-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Calorie preview badge */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Calculated Calorie Burn:
            </span>
            <span className="text-sm font-extrabold text-emerald-400">
              {estimatedCalories} kcal
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Great pace, form felt solid"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold text-xs shadow-glow-emerald"
            >
              {isSaving ? 'Logging...' : 'Save Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
