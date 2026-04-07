import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const ua = req.headers.get('user-agent') || '';
    const country = req.headers.get('x-vercel-ip-country') || '';

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '';
    const sessionId = Buffer.from(`${ip}-${ua}-${new Date().toDateString()}`).toString('base64').slice(0, 32);

    await supabase.from('page_views').insert({
      path,
      referrer,
      country,
      user_agent: ua,
      session_id: sessionId,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
