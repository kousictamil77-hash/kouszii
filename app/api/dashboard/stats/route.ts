import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LocalStore } from '@/lib/storage';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch logs
        const { data: logs } = await supabase
          .from('progress_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (logs) {
          const todayStr = new Date().toISOString().split('T')[0];
          const todayLogs = logs.filter((l) => {
            try {
              return new Date(l.completed_at).toISOString().split('T')[0] === todayStr;
            } catch {
              return false;
            }
          });

          const todayMinutes = Math.round(todayLogs.reduce((acc, l) => acc + l.duration_seconds, 0) / 60);
          const todayCalories = Math.round(todayLogs.reduce((acc, l) => acc + Number(l.calories_burned), 0) * 10) / 10;
          const dailyGoalMinutes = profile?.daily_goal_minutes || 30;
          const dailyGoalProgress = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));

          // Last 7 days activity
          const weeklyActivity = [];
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLogs = logs.filter((l) => {
              try {
                return new Date(l.completed_at).toISOString().split('T')[0] === dateStr;
              } catch {
                return false;
              }
            });

            weeklyActivity.push({
              date: dateStr,
              day_label: dayNames[d.getDay()],
              minutes: Math.round(dayLogs.reduce((acc, l) => acc + l.duration_seconds, 0) / 60),
              calories: Math.round(dayLogs.reduce((acc, l) => acc + Number(l.calories_burned), 0)),
              workout_count: dayLogs.length,
            });
          }

          // Category distribution
          const catCountMap: Record<string, { count: number; calories: number; name: string; color: string }> = {};
          logs.forEach((log) => {
            const name = log.category_name || 'Upper Body';
            if (!catCountMap[name]) {
              catCountMap[name] = { count: 0, calories: 0, name, color: '#10b981' };
            }
            catCountMap[name].count += 1;
            catCountMap[name].calories += Number(log.calories_burned);
          });

          const totalCount = logs.length || 1;
          const category_distribution = Object.entries(catCountMap).map(([name, val], idx) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            return {
              category_id: `cat-${idx}`,
              category_name: name,
              color_code: colors[idx % colors.length],
              count: val.count,
              calories: Math.round(val.calories),
              percentage: Math.round((val.count / totalCount) * 100),
            };
          });

          return NextResponse.json({
            success: true,
            data: {
              today_minutes: todayMinutes,
              today_calories: todayCalories,
              daily_goal_minutes: dailyGoalMinutes,
              daily_goal_progress_pct: dailyGoalProgress,
              current_streak: profile?.current_streak || 0,
              total_workouts: profile?.total_workouts || logs.length,
              total_active_minutes: Math.round((profile?.total_active_seconds || 0) / 60),
              total_calories_burned: profile?.total_calories_burned || 0,
              weekly_activity: weeklyActivity,
              category_distribution,
              recent_logs: logs.slice(0, 10),
            },
          });
        }
      }
    }

    // Default fallback stats
    const fallbackStats = LocalStore.getDashboardStats();
    return NextResponse.json({ success: true, data: fallbackStats });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch dashboard stats',
      data: LocalStore.getDashboardStats(),
    });
  }
}
