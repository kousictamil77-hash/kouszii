'use client';

import React from 'react';
import { CategoryBreakdownStat } from '@/lib/types';
import { PieChart, Dumbbell, Shield, Footprints, Flame, Sparkles } from 'lucide-react';

interface CategoryDistributionProps {
  data: CategoryBreakdownStat[];
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No category distribution data available yet.
      </div>
    );
  }

  const iconMap: Record<string, any> = {
    'Upper Body': Dumbbell,
    'Core & Abs': Shield,
    'Lower Body': Footprints,
    'Cardio & HIIT': Flame,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <PieChart className="w-3.5 h-3.5 text-cyan-400" />
          Workout Target Distribution
        </span>
      </div>

      <div className="space-y-3">
        {data.map((cat, idx) => {
          const Icon = iconMap[cat.category_name] || Sparkles;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color_code || '#10b981' }}
                  />
                  <span className="font-semibold text-slate-200">{cat.category_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>{cat.count} workouts</span>
                  <span className="font-bold text-white">({cat.percentage}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(4, cat.percentage)}%`,
                    backgroundColor: cat.color_code || '#10b981',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
