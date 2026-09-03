import React from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Activity, 
  Leaf, 
  Globe, 
  Brain, 
  Flame, 
  ArrowRight,
  CheckCircle2,
  Users,
  Target
} from 'lucide-react';

export default function SDG3Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Impact Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-dark-card to-teal-950/80 border border-emerald-500/30 p-8 sm:p-12 shadow-glass">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <HeartHandshake className="w-4 h-4" />
            <span>United Nations Sustainable Development Goal 3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            Good Health & Well-being <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              For Everyone, Everywhere
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ensure healthy lives and promote well-being for all at all ages. FitPulse was engineered to directly advance <strong>SDG Target 3.4</strong> by removing every financial, logistical, and geographical barrier to physical activity.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/tracker"
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold text-xs shadow-glow-emerald flex items-center gap-2 transition-all"
            >
              Start Exercising for SDG 3 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/exercises"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              Browse Equipment-Free Moves
            </Link>
          </div>
        </div>
      </div>

      {/* Target 3.4 In-Depth Breakdown */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Direct Target Alignment</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Target 3.4: Preventing Non-Communicable Diseases (NCDs)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            According to the World Health Organization (WHO), physical inactivity is the 4th leading risk factor for global mortality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl glass-panel border border-slate-800 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Cardiovascular Protection</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              150 minutes of weekly bodyweight training cuts coronary heart disease risk by 30%, lowers resting systolic blood pressure, and improves vascular elasticity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl glass-panel border border-slate-800 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Mental Health & Stress Reduction</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Physical exercise stimulates dopamine and serotonin release, directly reducing symptoms of depressive anxiety, mental burnout, and cognitive fatigue.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl glass-panel border border-slate-800 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Universal Equity & Access</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Commercial gyms cost $50-$150/month. FitPulse provides scientifically calibrated calisthenics protocols with zero cost or equipment needed.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainability & Carbon Reduction Angle */}
      <div className="rounded-3xl glass-panel border border-slate-800 p-8 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5" />
              <span>Synergy: SDG 3 + SDG 13 (Climate Action)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Zero-Carbon Home Fitness
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              A standard roundtrip drive to a fitness center generates approximately <strong>0.82 kg of CO2</strong>. By establishing a consistent daily home workout routine, an individual saves up to <strong>120+ kg of carbon emissions</strong> every year while eliminating single-use commercial fitness footprint.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero transportation fossil fuel consumption</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero single-use gym equipment manufacturing waste</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Optimized bodyweight mechanics utilize natural gravitational resistance</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl p-6 border border-emerald-500/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Flame className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Join the Health Equity Movement</h4>
            <p className="text-xs text-slate-400">
              Start your first session today and log your daily active minutes toward global SDG 3 goals.
            </p>
            <Link
              href="/tracker"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald transition-all"
            >
              Launch Live Tracker <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
