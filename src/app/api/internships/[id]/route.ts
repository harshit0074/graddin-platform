import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: internship, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error || !internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    return NextResponse.json({ internship });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if user is the company owner or an admin
    const { data: existing } = await supabase
      .from('internships')
      .select('company_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = adminProfile?.role === 'admin';
    const isOwner = existing.company_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to update this internship.' }, { status: 403 });
    }

    const { data: updated, error: updateError } = await supabase
      .from('internships')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, internship: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is owner or admin
    const { data: existing } = await supabase
      .from('internships')
      .select('company_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = adminProfile?.role === 'admin';
    const isOwner = existing.company_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this internship.' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('internships')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Internship deleted successfully.' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
