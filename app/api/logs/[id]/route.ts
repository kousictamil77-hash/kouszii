import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Log ID is required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('progress_logs')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Log deleted successfully' });
      }
    }

    return NextResponse.json({ success: true, message: 'Log deleted (Demo Mode)' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete workout log' },
      { status: 500 }
    );
  }
}
