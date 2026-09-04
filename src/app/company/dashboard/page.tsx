"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CandidateCard } from '@/components/CandidateCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Users, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function StartupDashboardPage() {
  const router = useRouter();
  const { user, role, isLoading, internships, applications, updateApplicationStatus } = useAuth();

  React.useEffect(() => {
    if (!isLoading && role !== 'company') {
      router.push('/login');
    }
  }, [isLoading, role, router]);

  const currentCompany = user?.company;
  const companyInternships = internships.filter(i => i.company_id === user?.id || (currentCompany && i.company_id === currentCompany.id));
  const companyApplications = applications.filter(a => 
    companyInternships.some(i => i.id === a.internship_id) || a.internship?.company_id === user?.id
  );

  // Ranked descending by AI match score
  const aiRankedCandidates = [...companyApplications].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  const shortlistedCount = companyApplications.filter(a => a.status === 'shortlisted').length;
  const avgMatchScore = companyApplications.length > 0
    ? Math.round(companyApplications.reduce((acc, a) => acc + (a.match_score || 80), 0) / companyApplications.length)
    : 0;

  if (isLoading || !currentCompany) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="font-serif text-xl text-[#1C140E]">Loading your company dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Verification Alert Banner */}
      {!currentCompany.is_verified ? (
        <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6 text-amber-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-950">
                Company Verification Pending Review
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 max-w-2xl leading-relaxed">
                We are validating your official LinkedIn company presence ({currentCompany.linkedin_url || 'submitted during onboarding'}). Once verified by our administrators, you will be able to post internships and connect with students.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
            Pending Admin Review
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-3 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>Verified Startup Partner: Your openings are featured with high priority across student feeds.</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Verified
          </span>
        </div>
      )}

      {/* Recruiter Welcome Banner */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-gradient-to-r from-[#FFFFFF] via-[#FAF7F2] to-[#F5EFEB] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
            <Building2 className="h-4 w-4" />
            <span>{currentCompany.company_name} · Recruiter Suite</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1C140E] leading-tight">
            Build your team with ambitious students.
          </h1>
          <p className="text-sm sm:text-base text-[#72635A] leading-relaxed">
            Connect with motivated students ready to make an impact. Zero resume PDF clutter—all candidates are ranked automatically by AI match score.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link href="/company/post">
            <Button variant="default" size="lg" className="w-full sm:w-auto px-7 font-semibold">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Post an Opportunity</span>
            </Button>
          </Link>

          <Link href="/company/candidates">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-7 border-[#DFD5C6]">
              <span>View Candidates</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
            Active Openings
          </span>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
            {companyInternships.filter(i => i.is_active).length}
          </div>
          <span className="text-xs text-[#72635A] mt-1 block">Live on marketplace</span>
        </div>

        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
            Total Applicants
          </span>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
            {companyApplications.length}
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">Students applied</span>
        </div>

        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
            Shortlisted Candidates
          </span>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
            {shortlistedCount}
          </div>
          <span className="text-xs text-purple-700 font-medium mt-1 block">In conversation</span>
        </div>

        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
            Avg AI Match Score
          </span>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1B14] flex items-center gap-1.5">
            <Sparkles className="h-6 w-6 text-[#C99A6B]" />
            <span>{avgMatchScore}%</span>
          </div>
          <span className="text-xs text-[#72635A] mt-1 block">High competency fit</span>
        </div>
      </div>

      {/* Split Section: Posted Openings & Top AI Ranked Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Openings list */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#1C140E] flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#C99A6B]" />
              <span>Your Posted Openings</span>
            </h2>
            <Link href="/company/opportunities" className="text-xs text-[#C99A6B] hover:underline font-medium">
              Manage all ({companyInternships.length})
            </Link>
          </div>

          <div className="space-y-3">
            {companyInternships.map((internship) => (
              <div
                key={internship.id}
                className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs hover:border-[#2C1B14] transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link href={`/company/opportunities/${internship.id}`}>
                    <h3 className="font-serif text-lg font-bold text-[#1C140E] hover:underline">
                      {internship.title}
                    </h3>
                  </Link>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#72635A] mb-3">
                  <span>{internship.location}</span>
                  <span>•</span>
                  <span>{internship.duration}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#1C140E]">{internship.stipend}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F0E8DD] text-xs">
                  <span className="font-medium text-[#2C1B14]">
                    {internship.applicant_count || 0} candidate applications
                  </span>
                  <Link
                    href={`/company/opportunities/${internship.id}`}
                    className="text-[#72635A] hover:text-[#1C140E] font-semibold flex items-center gap-1"
                  >
                    <span>View Pipeline</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Ranked Candidates */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C140E] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>AI-Ranked Candidates</span>
              </h2>
              <p className="text-xs text-[#72635A]">Automatically sorted by semantic competency match score.</p>
            </div>

            <Link href="/company/candidates" className="text-xs text-[#C99A6B] hover:underline font-medium">
              View candidate deck ({aiRankedCandidates.length})
            </Link>
          </div>

          <div className="space-y-4">
            {aiRankedCandidates.slice(0, 3).map((app) => (
              <CandidateCard
                key={app.id}
                application={app}
                onStatusChange={updateApplicationStatus}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
