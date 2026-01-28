import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/app/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Use anon server client; RLS now allows public inserts
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from('contact_messages')
      .insert({ name, email, subject, message }, { returning: 'minimal' });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = typeof err?.message === 'string' ? err.message : 'Unexpected error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
