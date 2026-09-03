'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Dumbbell, 
  Activity, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Play,
  Calculator
} from 'lucide-react';
import { SDG3Banner } from '@/components/SDG3Banner';
import { INITIAL_EXERCISES, INITIAL_CATEGORIES } from '@/lib/mockData';
import { calculateCaloriesBurned } from '@/lib/calculations';
import { ExerciseCard } from '@/components/ExerciseCard';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { ActiveWorkoutSession } from '@/components/ActiveWorkoutSession';
import { Exercise, ProgressLog } from '@/lib/types';

export default function HomePage() {
  // Modal states
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeSessionExercise, setActiveSessionExercise] = useState<Exercise | null>(null);

  // Quick Calculator Widget State
  const [calcExercise, setCalcExercise] = useState(INITIAL_EXERCISES[0]);
  const [calcMinutes, setCalcMinutes] = useState(20);
  const [calcWeight, setCalcWeight] = useState(70);

  const calcCalories = calculateCaloriesBurned(
    calcExercise.met_multiplier,
    calcMinutes * 60,
    calcWeight,
    'medium'
  );

  const handleOpenDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDetailModalOpen(true);
  };

  const handleStartWorkout = (exercise: Exercise) => {
    setActiveSessionExercise(exercise);
  };

  const handleWorkoutSaved = (_log: ProgressLog) => {
    setActiveSessionExercise(null);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] radial-glow-emerald pointer-events-none -z-10" />
      <div className="absolute top-80 right-0 w-[500px] h-[500px] radial-glow-cyan pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* SDG 3 Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold animate-pulse-slow">
            <HeartHandshake className="w-4 h-4" />
            <span>Advancing UN SDG 3: Good Health & Well-being</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-heading tracking-tight leading-[1.1]">
            Smart Home Fitness for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Universal Well-being
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Zero equipment. Zero financial barrier. Track calibrated MET calories, stay consistent with real-time timers, and elevate your cardiovascular endurance from anywhere.
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/tracker"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-sm shadow-glow-emerald transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Workout Session
            </Link>

            <Link
              href="/exercises"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              Explore Exercise Index
            </Link>
          </div>

          {/* Quick Pillar Bullets */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Equipment-Free Calisthenics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>ACSM MET Science-Based Calorie Model</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero-Carbon Home Sustainability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship SDG 3 UI Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SDG3Banner />
      </section>

      {/* Interactive MET Calorie Burn Calculator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Explanation */}
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Science-Backed Telemetry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Live Calorie Estimator
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Calculated using the American College of Sports Medicine (ACSM) metabolic equivalent standards:
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-400">
                Calories = Duration(min) × (MET × 3.5 × Weight_kg) / 200
              </div>
            </div>

            {/* Right: Interactive Sliders & Live Output */}
            <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Select Exercise</label>
                  <select
                    value={calcExercise.id}
                    onChange={(e) => {
                      const found = INITIAL_EXERCISES.find((ex) => ex.id === e.target.value);
                      if (found) setCalcExercise(found);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {INITIAL_EXERCISES.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} (MET: {ex.met_multiplier}x)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Your Weight (kg)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    min="35"
                    max="180"
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-semibold">Duration:</span>
                  <span className="text-emerald-400 font-bold">{calcMinutes} Minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={calcMinutes}
                  onChange={(e) => setCalcMinutes(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Calculated Result */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300">Estimated Caloric Burn</span>
                    <div className="text-2xl font-black text-white font-heading">
                      {calcCalories} <span className="text-sm font-normal text-emerald-400">kcal</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartWorkout(calcExercise)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold text-xs shadow-glow-emerald flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start {calcExercise.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bodyweight Exercise Directory Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Core Bodyweight Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Featured Calisthenics Movements
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Zero gym equipment required. Master these foundational exercises anywhere.
            </p>
          </div>

          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/40 transition-all"
          >
            View All {INITIAL_EXERCISES.length} Exercises <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_EXERCISES.slice(0, 6).map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelectDetails={handleOpenDetails}
              onStartWorkout={handleStartWorkout}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onStartWorkout={handleStartWorkout}
      />

      {activeSessionExercise && (
        <ActiveWorkoutSession
          exercise={activeSessionExercise}
          onClose={() => setActiveSessionExercise(null)}
          onWorkoutSaved={handleWorkoutSaved}
        />
      )}
    </div>
  );
}
