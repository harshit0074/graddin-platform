import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }

    // God mode counts
    const [
      { count: totalStudents },
      { count: totalCompanies },
      { count: unverifiedCompanies },
      { count: totalInternships },
      { count: totalApplications }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_verified', false),
      supabase.from('internships').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      stats: {
        totalStudents: totalStudents || 0,
        totalCompanies: totalCompanies || 0,
        unverifiedCompanies: unverifiedCompanies || 0,
        totalInternships: totalInternships || 0,
        totalApplications: totalApplications || 0,
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
