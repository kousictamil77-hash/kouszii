'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Shield, Leaf, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SDG3BannerProps {
  compact?: boolean;
}

export function SDG3Banner({ compact = false }: SDG3BannerProps) {
  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-dark-card to-teal-950/70 border border-emerald-500/30 p-5 shadow-glass">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">UN SDG 3 Champion</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-bold">Target 3.4</span>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base">Good Health and Well-being for Everyone</h4>
            </div>
          </div>
          <Link
            href="/sdg3"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors shrink-0"
          >
            Explore Impact <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-card via-slate-900 to-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 shadow-glass">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Mission Content */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>UN Sustainable Development Goal 3: Good Health & Well-being</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading leading-tight">
            Universal Fitness. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Zero Barriers.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Non-communicable diseases (NCDs) account for 74% of global mortality. FitPulse democratizes preventive wellness through equipment-free calisthenics—enabling anyone, anywhere to reach WHO physical activity guidelines without expensive gym memberships or carbon-heavy commutes.
          </p>

          {/* Core SDG 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-white text-xs font-bold">100% Free Access</h5>
                <p className="text-[11px] text-slate-400">No equipment or paywalls needed.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-white text-xs font-bold">WHO 150-Min Metric</h5>
                <p className="text-[11px] text-slate-400">Cardiovascular risk mitigation.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <Leaf className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-white text-xs font-bold">Zero Carbon Footprint</h5>
                <p className="text-[11px] text-slate-400">Saves ~0.8kg CO2 per home workout.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Impact Highlight Card */}
        <div className="lg:col-span-5 bg-dark-bg/80 border border-emerald-500/25 rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target 3.4 Roadmap</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              2030 Agenda
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>30% lower risk of cardiovascular disease with daily bodyweight exercise</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Boosts endorphins and alleviates anxiety and sedentary fatigue</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Calibrated MET calorie expenditure for personalized fitness pacing</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/sdg3"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg text-xs font-bold transition-all shadow-glow-emerald"
            >
              Read Full SDG 3 Research & Targets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
