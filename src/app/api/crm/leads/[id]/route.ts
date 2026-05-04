import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-crm-password');
  return password === process.env.CRM_PASSWORD;
}

const updateSchema = z.object({
  status: z.enum(['חדש', 'בטיפול', 'הומר', 'אבוד']).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'גישה נדחתה' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { id } = await params;
  const body = await req.json();
  const result = updateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'נתונים לא תקינים' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('leads')
    .update(result.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'שגיאה בעדכון הליד' }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}
