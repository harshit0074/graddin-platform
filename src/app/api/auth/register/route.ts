import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, fullName, companyName, linkedinUrl, websiteUrl, skills, education, experience } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
    }

    if (!['student', 'company', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Failed to sign up' }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Insert into appropriate database table
    if (role === 'company') {
      const { error: companyError } = await supabase.from('companies').insert({
        id: userId,
        company_name: companyName || email.split('@')[0],
        email: email,
        linkedin_url: linkedinUrl || null,
        website_url: websiteUrl || null,
        is_verified: false,
      });

      if (companyError) {
        return NextResponse.json({ error: companyError.message }, { status: 400 });
      }
    } else {
      // Student or Admin
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        role: role as 'student' | 'admin',
        full_name: fullName || email.split('@')[0],
        email: email,
        skills: skills || null,
        education: education || null,
        experience: experience || null,
      });

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully',
      user: {
        id: userId,
        email,
        role,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
