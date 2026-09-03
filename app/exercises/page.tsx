'use client';

import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseCategory } from '@/lib/types';
import { INITIAL_CATEGORIES, INITIAL_EXERCISES } from '@/lib/mockData';
import { ExerciseCard } from '@/components/ExerciseCard';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { ActiveWorkoutSession } from '@/components/ActiveWorkoutSession';
import { SDG3Banner } from '@/components/SDG3Banner';
import { 
  Search, 
  Filter, 
  Dumbbell, 
  Shield, 
  Footprints, 
  Flame, 
  Sparkles, 
  RotateCcw,
  Plus
} from 'lucide-react';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [categories, setCategories] = useState<ExerciseCategory[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Modals
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [activeSessionExercise, setActiveSessionExercise] = useState<Exercise | null>(null);

  // Fetch exercises and categories from API with fallback
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catRes, exRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/exercises?category=${selectedCategory}&difficulty=${selectedDifficulty}&q=${encodeURIComponent(searchQuery)}`),
        ]);

        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.data) setCategories(catJson.data);
        }

        if (exRes.ok) {
          const exJson = await exRes.json();
          if (exJson.data) setExercises(exJson.data);
        }
      } catch {
        // Fallback filtering
        let filtered = [...INITIAL_EXERCISES];
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((e) => e.category_id === selectedCategory);
        }
        if (selectedDifficulty !== 'all') {
          filtered = filtered.filter((e) => e.difficulty === selectedDifficulty);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              e.name.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q) ||
              e.target_muscles.some((m) => m.toLowerCase().includes(q))
          );
        }
        setExercises(filtered);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleOpenDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDetailModalOpen(true);
  };

  const handleStartWorkout = (exercise: Exercise) => {
    setActiveSessionExercise(exercise);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  const categoryIcons: Record<string, any> = {
    'upper-body': Dumbbell,
    'core': Shield,
    'lower-body': Footprints,
    'cardio': Flame,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>SDG 3 Equipment-Free Calisthenics Index</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          Exercise Directory
        </h1>

        <p className="text-slate-400 text-sm max-w-2xl">
          Browse our curated catalog of bodyweight movements. Filter by target muscle group, skill difficulty, or search specific techniques.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 rounded-3xl glass-panel border border-slate-800 p-5 sm:p-6">
        {/* Search row */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, muscle (e.g. Quads, Triceps, Abs)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-dark-bg border-emerald-400 font-bold shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            All Categories ({INITIAL_EXERCISES.length})
          </button>

          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Sparkles;
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 text-dark-bg border-emerald-400 font-bold shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Difficulty Sub-Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Difficulty:</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors text-xs font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Exercises Results Grid */}
      {exercises.length === 0 ? (
        <div className="rounded-3xl glass-panel border border-slate-800 p-12 text-center space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No exercises match your filter</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keyword or switching category tabs.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-dark-bg text-xs font-bold shadow-glow-emerald"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelectDetails={handleOpenDetails}
              onStartWorkout={handleStartWorkout}
            />
          ))}
        </div>
      )}

      {/* SDG 3 Compact Reminder Banner */}
      <div className="pt-8">
        <SDG3Banner compact />
      </div>

      {/* Modals */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onStartWorkout={handleStartWorkout}
      />

      {activeSessionExercise && (
        <ActiveWorkoutSession
          exercise={activeSessionExercise}
          onClose={() => setActiveSessionExercise(null)}
          onWorkoutSaved={() => {
            setActiveSessionExercise(null);
          }}
        />
      )}
    </div>
  );
}
