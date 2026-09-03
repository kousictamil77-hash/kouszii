'use client';

import React, { useState } from 'react';
import { DailyActivityStat } from '@/lib/types';
import { Flame, Clock, Calendar } from 'lucide-react';

interface ActivityBarChartProps {
  data: DailyActivityStat[];
}

export function ActivityBarChart({ data }: ActivityBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No workout activity logged in the last 7 days.
      </div>
    );
  }

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 45);

  return (
    <div className="space-y-4">
      {/* Chart Header info */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          7-Day Activity Trends
        </span>
        {hoveredIdx !== null && (
          <div className="text-xs flex items-center gap-2 animate-fadeIn bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-300 font-bold">{data[hoveredIdx].day_label}:</span>
            <span className="text-emerald-400 font-semibold">{data[hoveredIdx].minutes} mins</span>
            <span className="text-slate-400">({data[hoveredIdx].calories} kcal)</span>
          </div>
        )}
      </div>

      {/* SVG Responsive Bar Visualization */}
      <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 rounded-2xl bg-slate-900/40 border border-slate-800/70">
        {data.map((item, idx) => {
          const heightPct = Math.max(10, Math.min(100, Math.round((item.minutes / maxMinutes) * 100)));
          const isHovered = hoveredIdx === idx;
          const isToday = idx === data.length - 1;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              {/* Tooltip / Value on top */}
              <div
                className={`text-[10px] font-bold transition-all mb-1.5 ${
                  isHovered || isToday ? 'text-emerald-400 scale-110' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                }`}
              >
                {item.minutes}m
              </div>

              {/* Bar Fill Container */}
              <div className="w-full max-w-[36px] h-full flex items-end bg-slate-800/40 rounded-xl overflow-hidden p-0.5">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isToday
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-glow-emerald'
                      : isHovered
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-300'
                      : 'bg-slate-700/80 group-hover:bg-emerald-500/70'
                  }`}
                />
              </div>

              {/* Weekday label */}
              <span
                className={`text-[11px] font-semibold mt-2 transition-colors ${
                  isToday
                    ? 'text-emerald-400 font-bold'
                    : isHovered
                    ? 'text-white'
                    : 'text-slate-400'
                }`}
              >
                {item.day_label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
