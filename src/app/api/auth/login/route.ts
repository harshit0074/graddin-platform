import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/constants';

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
    const userEmail = authData.user.email || email;
    const isAdmin = isSuperAdminEmail(userEmail);

    // Check profile
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (isAdmin) {
      // Auto-elevate to admin in profiles table if not already admin
      if (profile) {
        if (profile.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
          profile = { ...profile, role: 'admin' };
        }
      } else {
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: userEmail,
            role: 'admin',
            full_name: authData.user.user_metadata?.full_name || userEmail.split('@')[0],
          })
          .select()
          .maybeSingle();
        profile = newProfile;
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: userEmail,
          role: 'admin',
          profile: profile || { id: userId, email: userEmail, role: 'admin' },
        },
      });
    }

    if (profile) {
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: userEmail,
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
          email: userEmail,
          role: 'company',
          company,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
        role: 'student',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
