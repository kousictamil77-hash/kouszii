'use client';

import React, { useState } from 'react';
import { Exercise } from '@/lib/types';
import { Flame, Play, Info, Repeat, Dumbbell } from 'lucide-react';

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
  const [imgError, setImgError] = useState(false);

  const difficultyColors = {
    beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    intermediate: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    advanced: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };

  return (
    <div className="group rounded-3xl glass-panel overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-glass hover:-translate-y-1.5 bg-dark-card/90">
      
      <div>
        {/* Workout Image Banner */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-900">
          {exercise.image_url && !imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={exercise.image_url}
              alt={exercise.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 brightness-90 group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950/40 text-slate-500">
              <Dumbbell className="w-12 h-12 text-emerald-500/40 mb-1" />
              <span className="text-[11px] font-semibold text-slate-400">Bodyweight Movement</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/30 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                difficultyColors[exercise.difficulty] || difficultyColors.beginner
              }`}
            >
              {exercise.difficulty}
            </span>

            <div className="flex items-center gap-1 text-slate-200 text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">~{exercise.calories_per_minute_est}</span>
              <span className="text-[10px] text-slate-400">cal/m</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 pt-3 space-y-3">
          <h3 className="text-lg font-bold text-white font-heading group-hover:text-emerald-400 transition-colors">
            {exercise.name}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {exercise.description}
          </p>

          {/* Target Muscles Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {exercise.target_muscles.slice(0, 3).map((muscle, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-emerald-300/90 border border-slate-700/60 font-medium"
              >
                {muscle}
              </span>
            ))}
            {exercise.target_muscles.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400">
                +{exercise.target_muscles.length - 3}
              </span>
            )}
          </div>

          {/* Suggested Cadence */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-slate-500" />
              <span>Target: <strong className="text-slate-200">{exercise.recommended_sets} sets × {exercise.recommended_reps} reps</strong></span>
            </div>
            <span className="text-emerald-400 font-semibold">{exercise.recommended_duration_seconds}s rest</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 flex items-center gap-2.5">
        <button
          onClick={() => onSelectDetails(exercise)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Instructions
        </button>

        <button
          onClick={() => onStartWorkout(exercise)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg text-xs font-black transition-all shadow-glow-emerald hover:scale-102 active:scale-98"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Start
        </button>
      </div>
    </div>
  );
}
