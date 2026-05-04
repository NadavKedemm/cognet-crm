import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    'סטטוס': 'תקין',
    'זמן': new Date().toISOString(),
    'סביבה': process.env.NODE_ENV || 'פיתוח',
  });
}
