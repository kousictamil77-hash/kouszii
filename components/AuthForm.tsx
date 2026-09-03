'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please provide both email and password');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        if (mode === 'signup') {
          const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName || email.split('@')[0],
              },
            },
          });

          if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
          }

          import('@/lib/storage').then(({ LocalStore }) => {
            const profile = LocalStore.getProfile();
            LocalStore.saveProfile({
              ...profile,
              email: email,
              full_name: fullName || email.split('@')[0],
              total_workouts: 0,
              total_calories_burned: 0,
              total_active_seconds: 0,
              current_streak: 0,
              last_workout_date: null,
            });
            localStorage.setItem('hw_smart_fitness_logs_v1', JSON.stringify([]));
          });

          if (data.session) {
            router.push('/onboarding');
          } else {
            setSuccessMsg('Account created! Please check your email for confirmation or sign in.');
            setLoading(false);
          }
          return;
        } else {
          // Login
          const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
          }

          import('@/lib/storage').then(({ LocalStore }) => {
            const profile = LocalStore.getProfile();
            LocalStore.saveProfile({
              ...profile,
              email: data.user?.email || email,
              full_name: data.user?.user_metadata?.full_name || email.split('@')[0],
            });
          });

          router.push('/dashboard');
          return;
        }
      }
    }

    // Demo Mode fallback
    setTimeout(() => {
      import('@/lib/storage').then(({ LocalStore }) => {
        const profile = LocalStore.getProfile();
        
        // Mock a simple database in localStorage to remember names across signouts
        const usersDB = JSON.parse(localStorage.getItem('hw_users_db_v1') || '{}');
        if (mode === 'signup') {
          usersDB[email] = { full_name: fullName || email.split('@')[0] };
          localStorage.setItem('hw_users_db_v1', JSON.stringify(usersDB));
        }
        
        const storedName = usersDB[email]?.full_name;
        
        const updatedName = mode === 'signup' 
          ? (fullName || email.split('@')[0]) 
          : (storedName || email.split('@')[0]);
        
        if (mode === 'signup') {
          LocalStore.saveProfile({
            ...profile,
            email: email,
            full_name: updatedName,
            total_workouts: 0,
            total_calories_burned: 0,
            total_active_seconds: 0,
            current_streak: 0,
            last_workout_date: null,
          });
          localStorage.setItem('hw_smart_fitness_logs_v1', JSON.stringify([]));
        } else {
          LocalStore.saveProfile({
            ...profile,
            email: email,
            full_name: updatedName,
          });
        }
        setLoading(false);
        router.push(mode === 'signup' ? '/onboarding' : '/dashboard');
      });
    }, 600);
  };

  const handleGuestLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl glass-panel border border-slate-800 p-8 shadow-glass space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FitPulse SDG 3 Fitness</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          {mode === 'login' ? 'Welcome Back' : 'Join the Movement'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400">
          {mode === 'login'
            ? 'Sign in to access your workout metrics and daily streaks'
            : 'Create your account to personalize your home workout journey'}
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@domain.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-102"
        >
          {loading
            ? 'Processing...'
            : mode === 'login'
            ? 'Sign In to FitPulse'
            : 'Create Free Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Guest Mode Direct Access */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue as Guest / Demo Mode</span>
        </button>
      </div>

      {/* Toggle Link */}
      <div className="text-center pt-2 text-xs text-slate-400">
        {mode === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-emerald-400 font-semibold hover:underline">
              Sign up now
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-emerald-400 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
