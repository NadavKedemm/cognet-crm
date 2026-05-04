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

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .gte('last_seen', fiveMinutesAgo)
    .order('last_seen', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'שגיאה בטעינת מבקרים' }, { status: 500 });
  }

  const sessionIds = (sessions || []).map((s) => s.session_id);
  const currentSections: Record<string, string> = {};

  if (sessionIds.length > 0) {
    const { data: lastEvents } = await supabase
      .from('events')
      .select('session_id, section, created_at')
      .in('session_id', sessionIds)
      .eq('event_type', 'section_view')
      .order('created_at', { ascending: false });

    if (lastEvents) {
      lastEvents.forEach((e) => {
        if (!currentSections[e.session_id] && e.section) {
          currentSections[e.session_id] = e.section;
        }
      });
    }
  }

  const visitors = (sessions || []).map((s) => ({
    session_id: s.session_id,
    started_at: s.started_at,
    last_seen: s.last_seen,
    device_type: s.device_type,
    browser: s.browser,
    country: s.country,
    current_section: currentSections[s.session_id] || 'כותרת',
    time_on_site: Math.round((Date.now() - new Date(s.started_at).getTime()) / 1000),
  }));

  return NextResponse.json({ visitors, count: visitors.length });
}
