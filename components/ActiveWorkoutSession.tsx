'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Exercise, WorkoutIntensity, ProgressLog } from '@/lib/types';
import { calculateCaloriesBurned, formatDuration } from '@/lib/calculations';
import { soundFx } from '@/lib/sound';
import { LocalStore } from '@/lib/storage';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  VolumeX, 
  X, 
  Clock, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ActiveWorkoutSessionProps {
  exercise: Exercise;
  onClose: () => void;
  onWorkoutSaved: (log: ProgressLog) => void;
}

export function ActiveWorkoutSession({
  exercise,
  onClose,
  onWorkoutSaved,
}: ActiveWorkoutSessionProps) {
  // Session State
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(45);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(exercise.recommended_sets || 3);
  const [completedReps, setCompletedReps] = useState(exercise.recommended_reps || 12);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notes, setNotes] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // User Weight from LocalStore / Profile
  const profile = LocalStore.getProfile();
  const userWeight = profile?.weight_kg || 70;

  // Real-time calorie computation
  const liveCalories = calculateCaloriesBurned(
    exercise.met_multiplier,
    seconds,
    userWeight,
    intensity
  );

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Main workout elapsed timer
  useEffect(() => {
    if (isActive && !isPaused && !isResting) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, isResting]);

  // Rest Interval countdown
  useEffect(() => {
    if (isResting && restSeconds > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            soundFx.playBeep(440, 0.08); // Countdown beep
          } else if (prev === 1 && soundEnabled) {
            soundFx.playStartChime(); // Next set start
          }
          if (prev <= 1) {
            setIsResting(false);
            return exercise.recommended_duration_seconds || 45;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isResting, restSeconds, soundEnabled, exercise.recommended_duration_seconds]);

  // Start / Resume session
  const handleStart = () => {
    if (soundEnabled && !isActive) {
      soundFx.playStartChime();
    }
    setIsActive(true);
    setIsPaused(false);
  };

  // Pause session
  const handlePause = () => {
    setIsPaused(true);
  };

  // Complete current set and trigger rest
  const handleCompleteSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true);
      setRestSeconds(exercise.recommended_duration_seconds || 45);
      if (soundEnabled) soundFx.playBeep(600, 0.15);
    } else {
      // Finished all sets!
      handleFinishWorkout();
    }
  };

  // Finish Workout
  const handleFinishWorkout = () => {
    setIsActive(false);
    setIsResting(false);
    setIsFinished(true);
    if (soundEnabled) {
      soundFx.playCompletionFanfare();
    }
  };

  // Save Progress Log to Supabase / LocalStore
  const handleSaveLog = async () => {
    setIsSaving(true);

    const newLogData = {
      user_id: profile?.id || 'demo-user',
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      category_id: exercise.category_id,
      category_name: exercise.category?.name || 'Bodyweight',
      duration_seconds: Math.max(seconds, 30),
      calories_burned: Math.max(liveCalories, 5),
      sets_completed: currentSet,
      reps_completed: completedReps * currentSet,
      intensity_level: intensity,
      notes: notes || `Completed ${currentSet} sets of ${exercise.name}`,
      completed_at: new Date().toISOString(),
    };

    try {
      // Attempt API route first
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLogData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          // Also sync to localStore
          LocalStore.addLog(newLogData);
          onWorkoutSaved(json.data);
          onClose();
          return;
        }
      }
    } catch {
      // Fallback directly to LocalStore
    }

    const savedLog = LocalStore.addLog(newLogData);
    onWorkoutSaved(savedLog);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl glass-modal border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top bar controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isResting ? 'Rest Period' : isActive ? 'Active Session' : 'Ready to Start'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={soundEnabled ? 'Mute sound cues' : 'Enable sound cues'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workout Heading with Exercise Image Preview */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          {exercise.image_url && (
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              {exercise.name}
            </h2>
            <p className="text-xs text-slate-400">
              Set {currentSet} of {totalSets} • Target: <span className="text-emerald-400 font-bold">{completedReps} reps</span>
            </p>
          </div>
        </div>

        {!isFinished ? (
          <>
            {/* Center Dynamic Timer Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-900/60 shadow-inner">
                
                {/* Glowing Outer Indicator Ring */}
                <div 
                  className={`absolute inset-0 rounded-full border-4 ${
                    isResting 
                      ? 'border-amber-400 border-dashed animate-spin' 
                      : isActive && !isPaused 
                      ? 'border-emerald-400 pulse-active' 
                      : 'border-slate-700'
                  }`} 
                />

                {isResting ? (
                  <div className="text-center space-y-1 z-10">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rest</span>
                    <div className="text-5xl sm:text-6xl font-black text-white font-mono">
                      {restSeconds}s
                    </div>
                    <span className="text-[11px] text-slate-400">Next set loading...</span>
                  </div>
                ) : (
                  <div className="text-center space-y-1 z-10">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Elapsed Time</span>
                    <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                      {formatDuration(seconds)}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{liveCalories} kcal</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Set & Reps Quick Adjuster */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Sets Done</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <button
                    disabled={currentSet <= 1}
                    onClick={() => setCurrentSet((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white">{currentSet} / {totalSets}</span>
                  <button
                    onClick={() => setCurrentSet((prev) => prev + 1)}
                    className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Reps / Set</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <button
                    disabled={completedReps <= 1}
                    onClick={() => setCompletedReps((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-emerald-400">{completedReps}</span>
                  <button
                    onClick={() => setCompletedReps((prev) => prev + 1)}
                    className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Intensity Selector */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-semibold">Intensity:</span>
              <div className="flex items-center gap-1.5">
                {(['low', 'medium', 'high'] as WorkoutIntensity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      intensity === level
                        ? 'bg-emerald-500 text-dark-bg font-bold shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2 pt-2">
              {!isActive ? (
                <button
                  onClick={handleStart}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Workout Timer
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {isPaused ? (
                    <button
                      onClick={handleStart}
                      className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> Resume
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Pause className="w-4 h-4" /> Pause
                    </button>
                  )}

                  <button
                    onClick={handleCompleteSet}
                    className="py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-dark-bg font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {currentSet < totalSets ? `Complete Set ${currentSet}` : 'Complete Workout'}
                  </button>
                </div>
              )}

              {isActive && (
                <button
                  onClick={handleFinishWorkout}
                  className="w-full py-2 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Finish & Save Early
                </button>
              )}
            </div>
          </>
        ) : (
          /* Workout Finished Summary Screen */
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-emerald">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white font-heading">Workout Complete!</h3>
              <p className="text-xs text-slate-300">Fantastic effort promoting your SDG 3 daily health goal.</p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Time</span>
                <div className="text-lg font-bold text-white mt-0.5">{formatDuration(seconds)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Burn</span>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{liveCalories} kcal</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Reps</span>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{completedReps * currentSet}</div>
              </div>
            </div>

            {/* Notes input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Session Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Felt great! Kept form strict on each rep..."
                className="w-full h-20 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Save Button */}
            <button
              disabled={isSaving}
              onClick={handleSaveLog}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all"
            >
              {isSaving ? 'Saving Progress...' : 'Save to Progress Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
