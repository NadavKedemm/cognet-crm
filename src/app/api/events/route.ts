import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  try {
    const body = await req.json();
    const { session, events = [] } = body;

    if (!session?.session_id) {
      return NextResponse.json({ error: 'מזהה סשן חסר' }, { status: 400 });
    }

    await supabase.from('sessions').upsert(
      {
        session_id: session.session_id,
        last_seen: new Date().toISOString(),
        is_active: true,
        ...(session.page_source && { page_source: session.page_source }),
        ...(session.device_type && { device_type: session.device_type }),
        ...(session.browser && { browser: session.browser }),
        ...(session.referrer && { referrer: session.referrer }),
        ...(session.utm_source && { utm_source: session.utm_source }),
        ...(session.utm_medium && { utm_medium: session.utm_medium }),
        ...(session.utm_campaign && { utm_campaign: session.utm_campaign }),
      },
      { onConflict: 'session_id' }
    );

    if (events.length > 0) {
      const eventsToInsert = events.map((e: Record<string, unknown>) => ({
        session_id: session.session_id,
        event_type: e.event_type,
        section: e.section || null,
        value: e.value || null,
        metadata: e.metadata || {},
      }));

      await supabase.from('events').insert(eventsToInsert);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'שגיאה בשמירת אירועים' }, { status: 500 });
  }
}
