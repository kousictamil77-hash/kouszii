'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardStats, UserProfile } from '@/lib/types';
import { LocalStore } from '@/lib/storage';
import { calculateSDG3Metrics, calculateBMI } from '@/lib/calculations';
import { StatsCard } from '@/components/StatsCard';
import { ActivityBarChart } from '@/components/Charts/ActivityBarChart';
import { CategoryDistribution } from '@/components/Charts/CategoryDistribution';
import { SDG3Banner } from '@/components/SDG3Banner';
import { 
  Flame, 
  Clock, 
  Zap, 
  Award, 
  HeartHandshake, 
  Play, 
  Trash2, 
  Leaf, 
  Activity, 
  User, 
  Target,
  Sparkles
} from 'lucide-react';
import { formatDurationHuman } from '@/lib/calculations';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(LocalStore.getDashboardStats());
  const [profile, setProfile] = useState<UserProfile>(LocalStore.getProfile());
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(profile.daily_goal_minutes || 30);

  const reloadData = () => {
    setStats(LocalStore.getDashboardStats());
    setProfile(LocalStore.getProfile());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleDeleteLog = async (id: string) => {
    try {
      await fetch(`/api/logs/${id}`, { method: 'DELETE' });
    } catch {}
    LocalStore.deleteLog(id);
    reloadData();
  };

  const handleSaveGoal = () => {
    const updated = { ...profile, daily_goal_minutes: Number(goalInput) || 30 };
    LocalStore.saveProfile(updated);
    setProfile(updated);
    setIsEditingGoal(false);
    reloadData();
  };

  // SDG 3 Analytics
  const sdgMetrics = calculateSDG3Metrics(
    stats.weekly_activity.reduce((acc, d) => acc + d.minutes, 0),
    stats.total_workouts
  );

  const bmiInfo = calculateBMI(profile.weight_kg, profile.height_cm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SDG 3 Health Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Welcome back, {profile.full_name || 'Athlete'}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Tracking your physical activity, metabolic burn, and long-term health consistency.
          </p>
        </div>

        <Link
          href="/tracker"
          className="self-start sm:self-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald flex items-center gap-2 transition-all hover:scale-105"
        >
          <Play className="w-4 h-4 fill-current" />
          Start New Workout
        </Link>
      </div>

      {/* 4 Core Primary Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Daily Streak"
          value={`${stats.current_streak} Days`}
          subtitle="Consecutive habit consistency"
          icon={Zap}
          color="amber"
          trend={`${stats.current_streak >= 3 ? '🔥 On Fire' : 'Building Momentum'}`}
          trendPositive={true}
        />

        <StatsCard
          title="Total Active Time"
          value={`${stats.total_active_minutes}m`}
          subtitle="Cumulative movement"
          icon={Clock}
          color="cyan"
          trend="Equip-Free"
          trendPositive={true}
        />

        <StatsCard
          title="Calories Burned"
          value={`${Math.round(stats.total_calories_burned)} kcal`}
          subtitle="MET-calibrated energy"
          icon={Flame}
          color="emerald"
          trend="+14% this week"
          trendPositive={true}
        />

        <StatsCard
          title="Total Workouts"
          value={stats.total_workouts}
          subtitle="Completed sessions"
          icon={Award}
          color="violet"
          trend="Goal: 3x/week"
          trendPositive={true}
        />
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 7-Day Activity Chart */}
        <div className="lg:col-span-7 rounded-3xl glass-panel border border-slate-800 p-6 space-y-4">
          <ActivityBarChart data={stats.weekly_activity} />
        </div>

        {/* Category & Muscle Distribution Chart */}
        <div className="lg:col-span-5 rounded-3xl glass-panel border border-slate-800 p-6 space-y-4">
          <CategoryDistribution data={stats.category_distribution} />
        </div>
      </div>

      {/* SDG 3 Impact Telemetry Card */}
      <div className="rounded-3xl glass-panel border border-emerald-500/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">SDG 3 Impact Telemetry</span>
              <h3 className="text-lg font-bold text-white font-heading">Preventive Health & Eco-Benefits</h3>
            </div>
          </div>
          <Link
            href="/sdg3"
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Learn about SDG 3.4 Targets →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Metric 1: WHO Target */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>WHO 150-Min Guideline</span>
              <span className="text-emerald-400 font-bold">{sdgMetrics.whoTargetPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${sdgMetrics.whoTargetPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Cardiovascular disease risk reduced by up to ~{sdgMetrics.cvdRiskReduction}%.
            </p>
          </div>

          {/* Metric 2: Carbon Saved */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>CO2 Footprint Avoided</span>
            </div>
            <div className="text-2xl font-black text-white font-heading mt-1">
              ~{sdgMetrics.co2SavedKg} <span className="text-xs font-normal text-slate-400">kg CO2</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Saved by eliminating vehicle gym commutes.
            </p>
          </div>

          {/* Metric 3: Body Composition */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>BMI Body Profile</span>
            </div>
            <div className="text-2xl font-black text-white font-heading mt-1">
              {bmiInfo.bmi}{' '}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 ${bmiInfo.color}`}>
                {bmiInfo.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {profile.weight_kg}kg • {profile.height_cm}cm height
            </p>
          </div>
        </div>
      </div>

      {/* Recent Workout History Table */}
      <div className="rounded-3xl glass-panel border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Recent Workout Activity
          </h3>
          <Link
            href="/tracker"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Open Full Tracker →
          </Link>
        </div>

        {stats.recent_logs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No recent activity logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Exercise</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Calories</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {stats.recent_logs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 font-semibold text-white">{log.exercise_name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {log.category_name || 'Bodyweight'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{formatDurationHuman(log.duration_seconds)}</td>
                    <td className="py-3 text-emerald-400 font-bold">{Math.round(log.calories_burned)} kcal</td>
                    <td className="py-3 text-slate-400 text-xs">
                      {new Date(log.completed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SDG 3 Banner */}
      <SDG3Banner />
    </div>
  );
}
