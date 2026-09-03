import React from 'react';
import Link from 'next/link';
import { Flame, HeartHandshake, ShieldCheck, Globe, Zap, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-dark-bg/95 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & SDG Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
                <Flame className="w-4 h-4 text-dark-bg font-bold" />
              </div>
              <span className="text-lg font-bold text-white font-heading">
                FitPulse <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">SDG 3</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Empowering global health and well-being through equipment-free calisthenics, smart MET calorie telemetry, and zero-carbon home workout management.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 text-xs font-medium">
              <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aligned with UN Sustainable Development Goal 3 (Good Health & Well-being)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/exercises" className="hover:text-emerald-400 transition-colors">
                  Exercise Directory
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-emerald-400 transition-colors">
                  Workout Logger & Timer
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Progress Analytics
                </Link>
              </li>
              <li>
                <Link href="/sdg3" className="hover:text-emerald-400 transition-colors">
                  SDG 3 Health Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech & Deployment */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Architecture</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Next.js 14 (App Router)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase PostgreSQL + RLS</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tailwind CSS & Vercel Ready</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold"
              >
                Create Free Account <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FitPulse. Dedicated to universal wellness and zero-barrier fitness.</p>
          <div className="flex items-center gap-6">
            <Link href="/sdg3" className="hover:text-slate-300 transition-colors">SDG 3 Framework</Link>
            <Link href="/exercises" className="hover:text-slate-300 transition-colors">Bodyweight Index</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
