'use client';

import React, { useState, useEffect } from 'react';
import { StatWidget } from '@/components/Admin/StatWidget';
import { Users, Activity, Flame, Dumbbell, ShieldAlert } from 'lucide-react';
import { INITIAL_EXERCISES } from '@/lib/mockData';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalCalories: 0,
    activeExercises: INITIAL_EXERCISES.length,
  });

  useEffect(() => {
    // In a real application, this would fetch from an admin API route
    // For now, we mock some global statistics to show how it looks
    setStats({
      totalUsers: 124,
      totalWorkouts: 1485,
      totalCalories: 342000,
      activeExercises: INITIAL_EXERCISES.length,
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            System Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor platform performance and manage workout library.
          </p>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatWidget
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Registered athletes"
          icon={Users}
          color="cyan"
        />
        <StatWidget
          title="Total Workouts"
          value={stats.totalWorkouts.toLocaleString()}
          subtitle="Sessions completed"
          icon={Activity}
          color="violet"
        />
        <StatWidget
          title="Calories Burned"
          value={`${(stats.totalCalories / 1000).toFixed(1)}k kcal`}
          subtitle="Platform total"
          icon={Flame}
          color="amber"
        />
        <StatWidget
          title="Active Exercises"
          value={stats.activeExercises}
          subtitle="In the exercise library"
          icon={Dumbbell}
          color="emerald"
        />
      </div>

      {/* Exercise Library Management */}
      <div className="rounded-3xl glass-panel border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-heading">Exercise Library</h2>
          <button className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-dark-bg text-xs font-bold transition-colors">
            + Add Exercise
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold bg-slate-900/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Calories/Min</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {INITIAL_EXERCISES.slice(0, 10).map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{ex.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700">
                      {ex.category_id}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{ex.difficulty}</td>
                  <td className="px-4 py-3 text-emerald-400">{ex.calories_per_minute_est} kcal</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-cyan-400 hover:text-cyan-300 font-medium">Edit</button>
                    <button className="text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
