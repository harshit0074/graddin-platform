import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, fullName, companyName, linkedinUrl, websiteUrl, skills, education, experience } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
    }

    // Auto-elevate whitelisted admin emails
    const effectiveRole = isSuperAdminEmail(email) ? 'admin' : role;

    if (!['student', 'company', 'admin'].includes(effectiveRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Sign up user in Supabase Auth with metadata for database trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: effectiveRole,
          full_name: fullName || email.split('@')[0],
          company_name: companyName || email.split('@')[0],
          linkedin_url: linkedinUrl || null,
          website_url: websiteUrl || null,
          skills: skills || null,
          education: education || null,
          experience: experience || null,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Automatically log the user in to establish session cookies
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 3. Ensure profile has the elevated role if it is an admin
    if (effectiveRole === 'admin') {
      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email,
          role: 'admin',
          full_name: fullName || email.split('@')[0],
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully',
      user: {
        id: userId,
        email,
        role: effectiveRole,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
