import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Invalid credentials' }, { status: 401 });
    }

    const userId = authData.user.id;

    // Check profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: authData.user.email,
          role: profile.role,
          profile,
        },
      });
    }

    // Check company
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (company) {
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: authData.user.email,
          role: 'company',
          company,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: authData.user.email,
        role: 'student',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
