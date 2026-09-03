import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_CATEGORIES, INITIAL_EXERCISES } from '@/lib/mockData';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase credentials not configured' },
        { status: 400 }
      );
    }

    // 1. Seed Categories
    const { error: catError } = await supabase
      .from('categories')
      .upsert(
        INITIAL_CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon_name: c.icon_name,
          color_code: c.color_code,
          target_area: c.target_area,
        })),
        { onConflict: 'slug' }
      );

    if (catError) {
      return NextResponse.json({ success: false, error: `Category seed failed: ${catError.message}` }, { status: 500 });
    }

    // 2. Seed Exercises
    const { error: exError } = await supabase
      .from('exercises')
      .upsert(
        INITIAL_EXERCISES.map((e) => ({
          id: e.id,
          category_id: e.category_id,
          name: e.name,
          slug: e.slug,
          description: e.description,
          difficulty: e.difficulty,
          target_muscles: e.target_muscles,
          met_multiplier: e.met_multiplier,
          recommended_reps: e.recommended_reps,
          recommended_sets: e.recommended_sets,
          recommended_duration_seconds: e.recommended_duration_seconds,
          instructions: e.instructions,
          form_tips: e.form_tips,
          calories_per_minute_est: e.calories_per_minute_est,
          sdg_alignment_note: e.sdg_alignment_note,
        })),
        { onConflict: 'slug' }
      );

    if (exError) {
      return NextResponse.json({ success: false, error: `Exercise seed failed: ${exError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with categories and exercises',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
