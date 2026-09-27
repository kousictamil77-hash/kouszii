'use client';

import React, { useEffect, useState } from 'react';
import { ProgressLog } from '@/lib/types';
import { Flame, Clock, Calendar, CheckCircle2, Dumbbell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDurationHuman } from '@/lib/calculations';

export default function SharedWorkoutPage({ params }: { params: { data: string } }) {
  const [log, setLog] = useState<ProgressLog | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Decode base64 data
      const decodedData = atob(decodeURIComponent(params.data));
      const parsedLog = JSON.parse(decodedData) as ProgressLog;
      setLog(parsedLog);
    } catch (e) {
      console.error("Failed to parse shared data", e);
      setError(true);
    }
  }, [params.data]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel border border-rose-500/30 p-8 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <span className="text-2xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Invalid Link</h1>
          <p className="text-slate-400 text-sm">We couldn't load this shared workout. The link might be broken or incomplete.</p>
          <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const dateStr = new Date(log.completed_at).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 animate-fadeInUp">
        <div className="glass-panel rounded-3xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-8 backdrop-blur-xl bg-slate-900/60">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-glow-emerald rotate-3 hover:rotate-0 transition-transform duration-300">
              <CheckCircle2 className="w-8 h-8 text-dark-bg" />
            </div>
            <h1 className="text-3xl font-black text-white font-heading mt-4 tracking-tight">Workout Complete!</h1>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-1.5">
              <Calendar className="w-4 h-4" /> {dateStr}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-700/50 pb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{log.exercise_name}</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{log.category_name || 'Bodyweight'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Duration
                </span>
                <div className="text-xl font-bold text-white mt-1">{formatDurationHuman(log.duration_seconds)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Calories
                </span>
                <div className="text-xl font-bold text-emerald-400 mt-1">{Math.round(log.calories_burned)} kcal</div>
              </div>
              <div className="col-span-2">
                 <span className="text-[10px] text-slate-400 uppercase font-semibold">Volume</span>
                 <div className="text-sm font-medium text-slate-200 mt-1">
                   {log.sets_completed} sets &times; {Math.round(log.reps_completed / (log.sets_completed || 1))} reps = {log.reps_completed} total reps
                 </div>
              </div>
            </div>
          </div>

          {log.notes && (
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-sm text-slate-300 italic">
              &quot;{log.notes}&quot;
            </div>
          )}

          <div className="pt-2">
            <Link 
              href="/tracker"
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
            >
              Start Your Own Tracker
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
