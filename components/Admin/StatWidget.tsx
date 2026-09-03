import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatWidgetProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: 'emerald' | 'cyan' | 'amber' | 'violet' | 'rose';
}

const colorMap = {
  emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
  cyan: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
  amber: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
  violet: 'text-violet-400 bg-violet-500/20 border-violet-500/40',
  rose: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
};

export const StatWidget = ({ title, value, subtitle, icon: Icon, color }: StatWidgetProps) => {
  return (
    <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex items-start gap-4 hover:border-slate-700 transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-white font-heading">{value}</h3>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};
