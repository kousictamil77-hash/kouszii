import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_EXERCISES } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const query = searchParams.get('q')?.toLowerCase();

    const supabase = createServerSupabaseClient();

    if (supabase) {
      let dbQuery = supabase
        .from('exercises')
        .select(`
          *,
          category:categories(*)
        `);

      if (category && category !== 'all') {
        dbQuery = dbQuery.eq('category_id', category);
      }

      if (difficulty && difficulty !== 'all') {
        dbQuery = dbQuery.eq('difficulty', difficulty);
      }

      if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`);
      }

      const { data, error } = await dbQuery.order('name');

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    }

    // Filter fallback dataset
    let filtered = [...INITIAL_EXERCISES];

    if (category && category !== 'all') {
      filtered = filtered.filter((e) => e.category_id === category || e.slug.includes(category));
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter((e) => e.difficulty === difficulty);
    }

    if (query) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.target_muscles.some((m) => m.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch exercises', data: INITIAL_EXERCISES },
      { status: 200 }
    );
  }
}
