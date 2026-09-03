import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/constants';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const isAdmin = isSuperAdminEmail(user.email);

    // Check if user is in profiles (Student or Admin)
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (isAdmin) {
      if (profile) {
        if (profile.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
          profile = { ...profile, role: 'admin' };
        }
      } else {
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            role: 'admin',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
          })
          .select()
          .maybeSingle();
        profile = newProfile;
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: 'admin',
          profile: profile || { id: user.id, email: user.email, role: 'admin' },
        },
      });
    }

    if (profile) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: profile.role, // 'student' | 'admin'
          profile,
        },
      });
    }

    // Check if user is in companies
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (company) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: 'company',
          company,
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: 'unknown',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
