import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { sendLeadConfirmation, sendAdminNotification } from '@/lib/resend';
import { trackLeadCreated, trackEmailSent, trackEmailFailed, captureException } from '@/lib/sentry';

const leadSchema = z.object({
  name: z.string().min(2, 'נא להזין שם מלא (לפחות 2 תווים)'),
  email: z.string(),
  phone: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  section: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  try {
    const body = await req.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || 'נתונים לא תקינים' },
        { status: 400 }
      );
    }

    const { name, email, phone, utm_source, utm_medium, utm_campaign } = result.data;

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'נא להזין כתובת אימייל תקינה' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'האימייל הזה כבר רשום במערכת' },
        { status: 409 }
      );
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone: phone || null,
        status: 'חדש',
        source: 'דף נחיתה',
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })
      .select()
      .single();

    if (error) {
      captureException(error, { email });
      return NextResponse.json({ error: 'אירעה שגיאה בשמירת הנתונים' }, { status: 500 });
    }

    trackLeadCreated({ id: lead.id, name: lead.name, source: utm_source });

    try {
      await Promise.all([
        sendLeadConfirmation(lead),
        sendAdminNotification(lead),
      ]);
      trackEmailSent(email, 'confirmation');
      trackEmailSent(process.env.ADMIN_EMAIL!, 'admin');
    } catch (emailErr) {
      trackEmailFailed(email, emailErr);
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    captureException(err);
    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
