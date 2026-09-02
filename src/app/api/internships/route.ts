import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const location = searchParams.get('location') || '';
    const roleType = searchParams.get('role_type') || '';
    const companyId = searchParams.get('company_id') || '';

    const supabase = await createClient();

    let query = supabase
      .from('internships')
      .select(`
        *,
        company:companies (
          id,
          company_name,
          email,
          linkedin_url,
          website_url,
          about,
          location,
          is_verified
        )
      `)
      .order('created_at', { ascending: false });

    // If querying by specific company (e.g. for company dashboard)
    if (companyId) {
      query = query.eq('company_id', companyId);
    } else {
      // General feed: only show active
      query = query.eq('is_active', true);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (roleType) {
      query = query.ilike('role_type', `%${roleType}%`);
    }

    const { data: internships, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Filter by general search string in memory if provided
    let results = internships || [];
    if (search) {
      results = results.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const reqs = (item.requirements || '').toLowerCase();
        const comp = (item.company?.company_name || '').toLowerCase();
        return (
          title.includes(search) ||
          desc.includes(search) ||
          reqs.includes(search) ||
          comp.includes(search)
        );
      });
    }

    return NextResponse.json({ internships: results });
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
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // Check if user is a verified company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: 'Only registered companies can post internships.' }, { status: 403 });
    }

    if (!company.is_verified) {
      return NextResponse.json({
        error: 'Your company profile is pending verification by Graddin Admins. Once verified, you will be able to post internships.',
      }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, requirements, role_type, duration, stipend, location, application_deadline } = body;

    if (!title) {
      return NextResponse.json({ error: 'Internship title is required.' }, { status: 400 });
    }

    const { data: newInternship, error: insertError } = await supabase
      .from('internships')
      .insert({
        company_id: user.id,
        title,
        description: description || null,
        requirements: requirements || null,
        role_type: role_type || 'Full-time Internship',
        duration: duration || '3 Months',
        stipend: stipend || 'Unpaid / Performance Stipend',
        location: location || 'Remote',
        application_deadline: application_deadline || null,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Internship created successfully',
      internship: newInternship,
    }, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
