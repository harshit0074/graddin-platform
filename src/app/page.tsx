'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Internship } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { ApplyModal } from '@/components/ApplyModal';
import { InternshipCard } from '@/components/InternshipCard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { CompanyDashboard } from '@/components/CompanyDashboard';
import { AdminPortal } from '@/components/AdminPortal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  Building2,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<
    'feed' | 'student-apps' | 'student-profile' | 'company-dash' | 'admin-dash' | 'faq' | 'about'
  >('feed');

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'student' | 'company'>('student');

  // Apply Modal State
  const [selectedInternshipToApply, setSelectedInternshipToApply] = useState<Internship | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Feed State
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [roleTypeFilter, setRoleTypeFilter] = useState('');

  // Applied IDs
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const fetchFeed = useCallback(async () => {
    setLoadingFeed(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (locationFilter) params.append('location', locationFilter);
      if (roleTypeFilter) params.append('role_type', roleTypeFilter);

      const res = await fetch(`/api/internships?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInternships(data.internships || []);
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoadingFeed(false);
    }
  }, [searchQuery, locationFilter, roleTypeFilter]);

  const fetchStudentApplications = async () => {
    if (user?.role !== 'student') return;
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        const ids = (data.applications || []).map((a: { internship_id: string }) => a.internship_id);
        setAppliedIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch applied list:', err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchStudentApplications();
    }
  }, [user?.role]);

  const handleOpenAuth = (role: 'student' | 'company' = 'student') => {
    setAuthDefaultRole(role);
    setIsAuthOpen(true);
  };

  const handleApplyClick = (internship: Internship) => {
    if (!user) {
      handleOpenAuth('student');
      return;
    }
    if (user.role !== 'student') {
      alert('Only student accounts can apply for internships. Please sign in as a student.');
      return;
    }
    setSelectedInternshipToApply(internship);
    setIsApplyOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1">
        {activeView === 'student-apps' && <StudentDashboard initialTab="applications" />}
        {activeView === 'student-profile' && <StudentDashboard initialTab="profile" />}
        {activeView === 'company-dash' && <CompanyDashboard />}
        {activeView === 'admin-dash' && <AdminPortal />}

        {/* FEED / EXPLORE VIEW */}
        {activeView === 'feed' && (
          <div className="space-y-12 pb-20">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
              {/* Glowing decorative backdrop */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Next-Gen Internship Discovery & AI Candidate Ranking</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none text-white">
                Launch Your Career With{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  High-Impact Internships
                </span>
              </h1>

              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                GRADDIN connects verified tech and business leaders with exceptional student talent. Zero noise, sole focus on internships.
              </p>

              {/* SEARCH & FILTER BAR */}
              <div className="max-w-3xl mx-auto bg-zinc-900/90 border border-zinc-800 p-2 sm:p-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search by role, company, or tech stack (e.g. React, Python)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-950/60 border-zinc-800 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 rounded-xl focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="text"
                    placeholder="Location (e.g. Remote)"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full sm:w-36 bg-zinc-950/60 border-zinc-800 text-xs text-zinc-100 rounded-xl focus-visible:ring-indigo-500"
                  />
                  <Button
                    onClick={fetchFeed}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 rounded-xl shadow-md shadow-indigo-600/30"
                  >
                    Filter
                  </Button>
                </div>
              </div>

              {/* STATS QUICK BAR */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>100% Verified Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Instant AI Candidate Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Zero File Upload Clutter</span>
                </div>
              </div>
            </section>

            {/* INTERNSHIPS FEED SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Trending Internship Openings
                  </h2>
                </div>
                <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
                  {internships.length} Available
                </Badge>
              </div>

              {loadingFeed ? (
                <div className="py-20 text-center text-zinc-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                  <span className="text-sm">Loading verified internships...</span>
                </div>
              ) : internships.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/40 p-8 space-y-4 max-w-lg mx-auto">
                  <Briefcase className="w-12 h-12 text-zinc-600 mx-auto" />
                  <h3 className="text-lg font-bold text-zinc-200">No matching internships found</h3>
                  <p className="text-xs text-zinc-500">
                    Try adjusting your search query or clear the filters. Companies are constantly adding new verified openings!
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setLocationFilter('');
                      setRoleTypeFilter('');
                    }}
                    className="bg-zinc-800 text-zinc-300 text-xs"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {internships.map((internship) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      onApply={handleApplyClick}
                      hasApplied={appliedIds.includes(internship.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ABOUT VIEW */}
        {activeView === 'about' && (
          <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
            <div className="space-y-3 text-center">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">About GRADDIN</Badge>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Solely Focused On Internships.
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
                Unlike generic job boards crowded with senior roles and unrelated listings, GRADDIN is engineered exclusively for students seeking practical internships and companies hiring high-potential talent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <GraduationCap className="w-8 h-8 text-indigo-400" />
                <h3 className="font-bold text-white text-base">For Students</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Build your text-based profile once. Apply to top opportunities without cumbersome PDF uploads and receive instant AI candidate match evaluations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <Building2 className="w-8 h-8 text-purple-400" />
                <h3 className="font-bold text-white text-base">For Companies</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Gain access to verified student talent with applicant ranking powered by AI. Save hours of screening time with automated skill relevance insights.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Manual Verification</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every company on GRADDIN is manually reviewed by admins using verifiable LinkedIn links to ensure students are protected from fake recruiters.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FAQ VIEW */}
        {activeView === 'faq' && (
          <section className="max-w-3xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Questions & Answers</Badge>
              <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  How does the AI Candidate Ranking work?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When you apply to an internship, GRADDIN evaluates your listed skills, education, experience, and optional cover note against the role requirements. It computes an automated match score (0-100%) and provides clear feedback to recruiters so top matches stand out immediately.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Why do companies need admin verification?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  To protect students from unverified or spam postings, companies must provide their official LinkedIn page upon registration. GRADDIN admins review the link and approve the account before any internship listing can go live.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Why are there no resume file uploads?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We structured candidate profiles using clean text fields (Skills, Projects, Education) to keep database overhead minimal, preserve your storage limits, and allow direct AI parsing without costly OCR document conversion.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-zinc-300">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>GRADDIN — Solely Internships</span>
        </div>
        <p>© {new Date().getFullYear()} GRADDIN Platform. Engineered for Next.js, Supabase, and Vercel.</p>
      </footer>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authDefaultRole}
      />

      <ApplyModal
        internship={selectedInternshipToApply}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSuccess={() => {
          fetchStudentApplications();
          setActiveView('student-apps');
        }}
      />
    </div>
  );
}
