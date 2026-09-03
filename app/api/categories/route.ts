import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_CATEGORIES } from '@/lib/mockData';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    }

    // Fallback to initial categories
    return NextResponse.json({ success: true, data: INITIAL_CATEGORIES });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories', data: INITIAL_CATEGORIES },
      { status: 200 }
    );
  }
}
