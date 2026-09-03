'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Dumbbell, 
  LayoutDashboard, 
  Activity, 
  HeartHandshake, 
  Flame, 
  Menu, 
  X, 
  PlusCircle,
  User,
  Sparkles
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user?.email) setUserEmail(user.email);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUserEmail(session?.user?.email || null);
        });

        return () => subscription.unsubscribe();
      }
    }
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/exercises', label: 'Exercise Library', icon: Dumbbell },
    { href: '/tracker', label: 'Workout Tracker', icon: Activity },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/sdg3', label: 'SDG 3 Impact', icon: HeartHandshake },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-dark-bg/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & SDG 3 Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-glow-emerald group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-heading">
                FitPulse <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">SDG 3</span>
              </span>
              <span className="block text-[10px] text-slate-400 -mt-1 tracking-wider uppercase">Smart Fitness</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-bg hover:from-emerald-400 hover:to-teal-400 shadow-glow-emerald transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Start Workout
          </Link>

          {userEmail ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                {userEmail[0].toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{userEmail}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/tracker"
            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-dark-bg/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-bg shadow-glow-emerald"
            >
              <PlusCircle className="w-4 h-4" />
              Launch Active Workout
            </Link>

            {!userEmail && (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm text-slate-300 bg-slate-800/80 border border-slate-700"
              >
                <User className="w-4 h-4" />
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
