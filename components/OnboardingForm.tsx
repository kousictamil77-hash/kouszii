'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStore } from '@/lib/storage';
import { Activity, ArrowRight, Calculator, Dumbbell, PlayCircle } from 'lucide-react';
import { INITIAL_EXERCISES } from '@/lib/mockData';
import { Exercise } from '@/lib/types';

export function OnboardingForm() {
  const router = useRouter();
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [step, setStep] = useState(1);
  const [bmr, setBmr] = useState(0);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(0);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);

  const handleCalculate = () => {
    // Calculate BMR (Mifflin-St Jeor Equation)
    let calculatedBmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') {
      calculatedBmr += 5;
    } else if (gender === 'female') {
      calculatedBmr -= 161;
    } else {
      calculatedBmr -= 78; // Average for 'other'
    }
    
    setBmr(Math.round(calculatedBmr));
    const activeCalorieGoal = Math.round(calculatedBmr * 0.2); 
    setDailyCalorieGoal(activeCalorieGoal);

    // Generate Personalized Routine
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let routine: Exercise[] = [];
    
    if (bmi >= 25 || age >= 50) {
      // Low impact / Beginner
      routine = INITIAL_EXERCISES.filter(ex => ['forearm-plank', 'bodyweight-squats', 'push-ups'].includes(ex.slug));
    } else {
      // High Intensity / Advanced
      routine = INITIAL_EXERCISES.filter(ex => ['jumping-jacks', 'mountain-climbers', 'burpees'].includes(ex.slug));
    }
    
    if (routine.length === 0) routine = INITIAL_EXERCISES.slice(0, 3);
    setRecommendedExercises(routine);

    setStep(2);
  };

  const handleNextToRoutine = () => {
    setStep(3);
  };

  const handleComplete = () => {
    const profile = LocalStore.getProfile();
    LocalStore.saveProfile({
      ...profile,
      age,
      weight_kg: weight,
      height_cm: height,
      gender,
      daily_calorie_goal: dailyCalorieGoal,
      daily_goal_minutes: 30, // Default active minutes
    });
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl glass-panel border border-slate-800 p-8 shadow-glass space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Personalization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          {step === 1 && 'Configure Your Profile'}
          {step === 2 && 'Your Calorie Target'}
          {step === 3 && 'Your Daily Routine'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {step === 1 && 'Enter your body metrics to calculate your customized calorie and activity goals.'}
          {step === 2 && 'Based on the Mifflin-St Jeor metabolic formula.'}
          {step === 3 && 'A curated step-by-step workout plan designed for your body metrics.'}
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Age</label>
              <input
                type="number"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="300"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-102 mt-4"
          >
            Calculate Goals
            <Calculator className="w-4 h-4" />
          </button>
        </div>
      ) : step === 2 ? (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Basal Metabolic Rate (BMR)</span>
              <span className="font-bold text-white">{bmr} kcal/day</span>
            </div>
            <div className="h-px bg-slate-800 w-full" />
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-emerald-400">Target Active Burn</span>
              <span className="font-black text-xl text-emerald-400 font-heading">{dailyCalorieGoal} kcal</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Aim to burn {dailyCalorieGoal} calories daily through focused workouts to maintain cardiovascular health (SDG 3.4).
            </p>
          </div>

          <button
            onClick={handleNextToRoutine}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            See My Routine
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {recommendedExercises.map((ex, idx) => (
              <div key={ex.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                  <p className="text-[10px] text-slate-400">{ex.recommended_sets} sets × {ex.recommended_reps} reps</p>
                </div>
                <Dumbbell className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            Start My Journey
            <PlayCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
