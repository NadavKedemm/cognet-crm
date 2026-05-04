import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-crm-password');
  return password === process.env.CRM_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'גישה נדחתה — סיסמא שגויה' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  const search = searchParams.get('search') || '';

  let query = supabase.from('leads').select('*');

  if (status && status !== 'הכל') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data: leads, error } = await query.order(sort, { ascending: order === 'asc' });

  if (error) {
    return NextResponse.json({ error: 'שגיאה בטעינת לידים' }, { status: 500 });
  }

  return NextResponse.json({ leads: leads || [], total: (leads || []).length });
}
