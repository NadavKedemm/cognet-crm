import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-crm-password');
  return password === process.env.CRM_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'גישה נדחתה' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: totalLeads },
    { count: newToday },
    { count: converted },
    { count: inProgress },
    { data: sectionEvents },
    { count: totalVisitors },
    { count: viewedForm },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'הומר'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'בטיפול'),
    supabase.from('events').select('section, event_type, value').not('section', 'is', null),
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('section', 'הרשמה').eq('event_type', 'section_view'),
  ]);

  const sectionMap: Record<string, { views: number; totalTime: number; scrollDepths: number[] }> = {};

  (sectionEvents || []).forEach((event: { section: string; event_type: string; value: number }) => {
    if (!event.section) return;
    if (!sectionMap[event.section]) {
      sectionMap[event.section] = { views: 0, totalTime: 0, scrollDepths: [] };
    }
    if (event.event_type === 'section_view') sectionMap[event.section].views++;
    if (event.event_type === 'time_on_section' && event.value) sectionMap[event.section].totalTime += event.value;
    if (event.event_type === 'scroll_depth' && event.value) sectionMap[event.section].scrollDepths.push(event.value);
  });

  const sectionStats = Object.entries(sectionMap).map(([section, data]) => ({
    section,
    views: data.views,
    avg_time: data.views > 0 ? Math.round(data.totalTime / data.views) : 0,
    scroll_depth: data.scrollDepths.length > 0
      ? Math.round(data.scrollDepths.reduce((a, b) => a + b, 0) / data.scrollDepths.length)
      : 0,
    bounce_rate: 0,
  }));

  return NextResponse.json({
    'סהכ_לידים': totalLeads || 0,
    'חדשים_היום': newToday || 0,
    'הומרו': converted || 0,
    'בטיפול': inProgress || 0,
    'סטטיסטיקות_סקשנים': sectionStats,
    'משפך_המרה': {
      מבקרים: totalVisitors || 0,
      צפו_בטופס: viewedForm || 0,
      נרשמו: totalLeads || 0,
    },
  });
}
