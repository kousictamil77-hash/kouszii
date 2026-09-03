'use client';

import React from 'react';
import { Exercise } from '@/lib/types';
import { Flame, Play, Info, CheckCircle, Repeat } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelectDetails: (exercise: Exercise) => void;
  onStartWorkout: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  onSelectDetails,
  onStartWorkout,
}: ExerciseCardProps) {
  const difficultyColors = {
    beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="group rounded-2xl glass-panel p-5 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between hover:shadow-glass hover:-translate-y-1">
      {/* Top badges & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
              difficultyColors[exercise.difficulty] || difficultyColors.beginner
            }`}
          >
            {exercise.difficulty}
          </span>

          <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">~{exercise.calories_per_minute_est}</span>
            <span className="text-[10px] text-slate-400">kcal/min</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white font-heading group-hover:text-emerald-400 transition-colors">
          {exercise.name}
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
          {exercise.description}
        </p>

        {/* Target Muscles */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {exercise.target_muscles.slice(0, 3).map((muscle, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50"
            >
              {muscle}
            </span>
          ))}
          {exercise.target_muscles.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
              +{exercise.target_muscles.length - 3} more
            </span>
          )}
        </div>

        {/* Suggested cadence */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-slate-500" />
            <span>Target: <strong className="text-slate-200">{exercise.recommended_sets} sets × {exercise.recommended_reps} reps</strong></span>
          </div>
          <span>{exercise.recommended_duration_seconds}s rest</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 flex items-center gap-2">
        <button
          onClick={() => onSelectDetails(exercise)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Instructions
        </button>

        <button
          onClick={() => onStartWorkout(exercise)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg text-xs font-bold transition-all shadow-glow-emerald hover:scale-102 active:scale-98"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Start
        </button>
      </div>
    </div>
  );
}
