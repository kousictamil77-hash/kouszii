'use client';

import React, { useState } from 'react';
import { DailyActivityStat } from '@/lib/types';
import { Flame, Clock, Calendar, BarChart2 } from 'lucide-react';

interface ActivityBarChartProps {
  data7Days: DailyActivityStat[];
  data4Weeks: DailyActivityStat[];
  data12Months: DailyActivityStat[];
}

export function ActivityBarChart({ data7Days, data4Weeks, data12Months }: ActivityBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '4w' | '12m'>('7d');

  const activeData = timeframe === '7d' ? data7Days : timeframe === '4w' ? data4Weeks : data12Months;

  if (!activeData || activeData.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No workout activity logged for this timeframe.
      </div>
    );
  }

  const maxMinutes = Math.max(...activeData.map((d) => d.minutes), 45);

  return (
    <div className="space-y-4">
      {/* Chart Header info and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          Activity Trends
        </span>
        
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => { setTimeframe('7d'); setHoveredIdx(null); }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeframe === '7d' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => { setTimeframe('4w'); setHoveredIdx(null); }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeframe === '4w' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => { setTimeframe('12m'); setHoveredIdx(null); }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeframe === '12m' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="h-6 flex items-center">
        {hoveredIdx !== null ? (
          <div className="text-xs flex items-center gap-2 animate-fadeIn bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-300 font-bold">{activeData[hoveredIdx].day_label}:</span>
            <span className="text-emerald-400 font-semibold">{activeData[hoveredIdx].minutes} mins</span>
            <span className="text-slate-400">({activeData[hoveredIdx].calories} kcal)</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            Hover over bars for details
          </div>
        )}
      </div>

      {/* SVG Responsive Bar Visualization */}
      <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 rounded-2xl bg-slate-900/40 border border-slate-800/70 overflow-x-auto">
        {activeData.map((item, idx) => {
          const heightPct = Math.max(10, Math.min(100, Math.round((item.minutes / maxMinutes) * 100)));
          const isHovered = hoveredIdx === idx;
          const isCurrent = idx === activeData.length - 1;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 min-w-[24px] flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              {/* Tooltip / Value on top */}
              <div
                className={`text-[10px] font-bold transition-all mb-1.5 ${
                  isHovered || isCurrent ? 'text-emerald-400 scale-110' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                }`}
              >
                {item.minutes > 0 ? `${item.minutes}m` : ''}
              </div>

              {/* Bar Fill Container */}
              <div className="w-full max-w-[36px] h-full flex items-end bg-slate-800/40 rounded-xl overflow-hidden p-0.5">
                <div
                  style={{ height: `${item.minutes === 0 ? 0 : heightPct}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    item.minutes === 0 
                      ? 'bg-transparent'
                      : isCurrent
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-glow-emerald'
                      : isHovered
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-300'
                      : 'bg-slate-700/80 group-hover:bg-emerald-500/70'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[9px] sm:text-[11px] font-semibold mt-2 whitespace-nowrap transition-colors ${
                  isCurrent
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
