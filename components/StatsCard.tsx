import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'violet';
  progress?: number; // 0 to 100
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'emerald',
  progress,
}: StatsCardProps) {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      glow: 'shadow-glow-emerald',
      bar: 'bg-emerald-400',
    },
    cyan: {
      bg: 'from-cyan-500/20 to-blue-500/10',
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      glow: 'shadow-glow-cyan',
      bar: 'bg-cyan-400',
    },
    amber: {
      bg: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
      glow: 'shadow-none',
      bar: 'bg-amber-400',
    },
    rose: {
      bg: 'from-rose-500/20 to-pink-500/10',
      border: 'border-rose-500/30',
      iconBg: 'bg-rose-500/20 text-rose-400',
      glow: 'shadow-none',
      bar: 'bg-rose-400',
    },
    violet: {
      bg: 'from-violet-500/20 to-purple-500/10',
      border: 'border-violet-500/30',
      iconBg: 'bg-violet-500/20 text-violet-400',
      glow: 'shadow-none',
      bar: 'bg-violet-400',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`relative overflow-hidden rounded-2xl glass-panel p-5 border ${scheme.border} transition-all duration-200 hover:border-opacity-60`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading tracking-tight">
            {value}
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
