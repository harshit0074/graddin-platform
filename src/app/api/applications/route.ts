import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateCandidateMatch } from '@/lib/ai-matcher';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const internshipId = searchParams.get('internship_id');

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    const { data: company } = await supabase.from('companies').select('id').eq('id', user.id).maybeSingle();

    if (profile?.role === 'student') {
      // Return student's applications
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          internship:internships (
            *,
            company:companies (
              id,
              company_name,
              linkedin_url,
              website_url,
              location
            )
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ applications: applications || [] });
    }

    if (company) {
      // Company querying applications for their internships
      let query = supabase
        .from('applications')
        .select(`
          *,
          student:profiles (
            id,
            full_name,
            email,
            skills,
            education,
            experience
          ),
          internship:internships (
            id,
            title,
            company_id
          )
        `)
        .order('match_score', { ascending: false }); // AI Ranked!

      if (internshipId) {
        query = query.eq('internship_id', internshipId);
      }

      const { data: applications, error } = await query;

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Filter to only this company's internships
      const companyApps = (applications || []).filter(
        (app) => app.internship?.company_id === company.id
      );

      return NextResponse.json({ applications: companyApps });
    }

    if (profile?.role === 'admin') {
      // Admin god mode
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          student:profiles (*),
          internship:internships (
            *,
            company:companies (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ applications: applications || [] });
    }

    return NextResponse.json({ applications: [] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in to apply.' }, { status: 401 });
    }

    const { data: studentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !studentProfile || studentProfile.role !== 'student') {
      return NextResponse.json({ error: 'Only registered student accounts can apply.' }, { status: 403 });
    }

    const body = await request.json();
    const { internship_id, cover_note } = body;

    if (!internship_id) {
      return NextResponse.json({ error: 'internship_id is required.' }, { status: 400 });
    }

    // Fetch internship details for AI matching
    const { data: internship, error: internshipError } = await supabase
      .from('internships')
      .select('*')
      .eq('id', internship_id)
      .single();

    if (internshipError || !internship) {
      return NextResponse.json({ error: 'Internship not found.' }, { status: 404 });
    }

    // Check if already applied
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('internship_id', internship_id)
      .eq('student_id', user.id)
      .maybeSingle();

    if (existingApp) {
      return NextResponse.json({ error: 'You have already applied for this internship.' }, { status: 400 });
    }

    // 🤖 Compute automated AI Match Score & Feedback
    const aiResult = calculateCandidateMatch({
      student: {
        skills: studentProfile.skills,
        education: studentProfile.education,
        experience: studentProfile.experience,
        coverNote: cover_note,
      },
      internship: {
        title: internship.title,
        description: internship.description,
        requirements: internship.requirements,
        role_type: internship.role_type,
      },
    });

    const { data: newApplication, error: insertError } = await supabase
      .from('applications')
      .insert({
        internship_id,
        student_id: user.id,
        cover_note: cover_note || null,
        match_score: aiResult.score,
        ai_feedback: aiResult.feedback,
        status: 'applied',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! Your AI match score has been computed.',
      application: newApplication,
      ai_result: aiResult,
    }, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
