'use client';

import React from 'react';
import { Exercise } from '@/lib/types';
import { X, CheckCircle2, AlertCircle, Play, Flame, HeartHandshake, Dumbbell } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: (exercise: Exercise) => void;
}

export function ExerciseDetailModal({
  exercise,
  isOpen,
  onClose,
  onStartWorkout,
}: ExerciseDetailModalProps) {
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-modal border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {exercise.difficulty} Level
            </span>
            <span className="text-xs text-slate-400">Equipment-Free Calisthenics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            {exercise.name}
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            {exercise.description}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">MET Multiplier</span>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{exercise.met_multiplier}x</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Calorie Rate</span>
            <div className="text-lg font-bold text-amber-400 mt-0.5">~{exercise.calories_per_minute_est} <span className="text-xs font-normal text-slate-400">cal/min</span></div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Suggested Reps</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{exercise.recommended_reps} reps</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Suggested Sets</span>
            <div className="text-lg font-bold text-purple-400 mt-0.5">{exercise.recommended_sets} sets</div>
          </div>
        </div>

        {/* Muscle Groups */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Muscle Groups</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.target_muscles.map((muscle, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 text-xs font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Step-by-Step Execution</h4>
          <div className="space-y-2.5">
            {exercise.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Tips & Pro Advice */}
        {exercise.form_tips.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Pro Form Cues & Safety
            </h4>
            <ul className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-300">
              {exercise.form_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SDG 3 Impact Highlight */}
        {exercise.sdg_alignment_note && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-300">SDG 3 Health Impact</span>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{exercise.sdg_alignment_note}</p>
            </div>
          </div>
        )}

        {/* Modal Action Bottom Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>

          <button
            onClick={() => {
              onClose();
              onStartWorkout(exercise);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold text-xs transition-all shadow-glow-emerald flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Launch Live Workout Session
          </button>
        </div>
      </div>
    </div>
  );
}
