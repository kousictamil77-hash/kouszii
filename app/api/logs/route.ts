import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DEMO_PROGRESS_LOGS } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('progress_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      }
    }

    return NextResponse.json({ success: true, data: DEMO_PROGRESS_LOGS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch logs', data: DEMO_PROGRESS_LOGS },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      exercise_id,
      exercise_name,
      category_id,
      category_name,
      duration_seconds,
      calories_burned,
      sets_completed,
      reps_completed,
      intensity_level,
      notes,
      completed_at,
    } = body;

    if (!exercise_name || !duration_seconds || calories_burned === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required workout log fields' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('progress_logs')
          .insert({
            user_id: user.id,
            exercise_id: exercise_id || null,
            exercise_name,
            category_id: category_id || null,
            category_name: category_name || null,
            duration_seconds: Number(duration_seconds),
            calories_burned: Number(calories_burned),
            sets_completed: Number(sets_completed) || 1,
            reps_completed: Number(reps_completed) || 0,
            intensity_level: intensity_level || 'medium',
            notes: notes || null,
            completed_at: completed_at || new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
      }
    }

    // Return synthetic demo response if not signed in or offline
    const syntheticLog = {
      id: `log-${Date.now()}`,
      user_id: 'demo-user',
      exercise_id: exercise_id || null,
      exercise_name,
      category_id: category_id || null,
      category_name: category_name || null,
      duration_seconds: Number(duration_seconds),
      calories_burned: Number(calories_burned),
      sets_completed: Number(sets_completed) || 1,
      reps_completed: Number(reps_completed) || 0,
      intensity_level: intensity_level || 'medium',
      notes: notes || null,
      completed_at: completed_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: syntheticLog });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save workout log' },
      { status: 500 }
    );
  }
}
