"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { InternshipCard } from '@/components/InternshipCard';
import { ApplyModal } from '@/components/ApplyModal';
import { Internship } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const { internships, switchRole } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeApplyingInternship, setActiveApplyingInternship] = useState<Internship | null>(null);

  const categories = ["All", "Engineering", "Design", "AI & ML", "Robotics", "Systems"];

  const filteredInternships = internships.filter(i => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Engineering") return i.department?.toLowerCase().includes("engineering") || i.title.toLowerCase().includes("engineer");
    if (selectedCategory === "Design") return i.department?.toLowerCase().includes("design") || i.skills?.includes("Figma");
    if (selectedCategory === "AI & ML") return i.department?.toLowerCase().includes("ai") || i.skills?.includes("Python");
    if (selectedCategory === "Robotics") return i.department?.toLowerCase().includes("robotics") || i.skills?.includes("ROS2");
    if (selectedCategory === "Systems") return i.skills?.includes("Rust") || i.skills?.includes("Systems Programming");
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E8DFD3] bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2] to-[#F5EFEB]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Small Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EADBCE]/60 border border-[#DFD5C6] text-xs font-semibold text-[#2C1B14] mb-8 animate-in fade-in duration-500">
            <span className="h-2 w-2 rounded-full bg-[#2C1B14]" />
            <span>Built for students. Trusted by startups.</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1C140E] max-w-5xl mx-auto leading-[1.08] mb-6">
            Internships that <span className="italic font-serif font-normal text-[#2C1B14] underline decoration-[#C99A6B]/50 underline-offset-8">launch</span> your career.
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#72635A] max-w-2xl mx-auto font-normal leading-relaxed mb-12">
            GRADDIn connects ambitious students with meaningful internship opportunities at the startups building what comes next.
          </p>

          {/* Dual Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {/* Student Card */}
            <Link 
              href="/signup?role=student"
              onClick={() => switchRole('student')}
              className="group relative overflow-hidden rounded-3xl bg-[#2C1B14] text-[#FAF7F2] p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col justify-between h-full space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
                    FOR STUDENTS
                  </span>
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      Join as a Student
                    </h2>
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:bg-[#C99A6B] group-hover:text-[#1C140E]">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#EADBCE]/80 leading-relaxed">
                  Discover internships built for your next step. Get automated AI match scores and connect directly with founding teams.
                </p>
              </div>
            </Link>

            {/* Company Card */}
            <Link 
              href="/signup?role=company"
              onClick={() => switchRole('company')}
              className="group relative overflow-hidden rounded-3xl bg-[#FFFFFF] border-2 border-[#DFD5C6] text-[#1C140E] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2C1B14]"
            >
              <div className="flex flex-col justify-between h-full space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#72635A]">
                    FOR STARTUPS
                  </span>
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] tracking-tight">
                      Join as a Startup
                    </h2>
                    <div className="h-10 w-10 rounded-full bg-[#FAF7F2] border border-[#DFD5C6] flex items-center justify-center text-[#2C1B14] transition-transform group-hover:scale-110 group-hover:bg-[#2C1B14] group-hover:text-white">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#72635A] leading-relaxed">
                  Find motivated students ready to build with your team. Review AI-ranked candidate flashcards with zero ATS complexity.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CURATED OPPORTUNITIES SECTION */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading & Category Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C99A6B] mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Featured Openings</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
                Explore curated startup internships.
              </h2>
              <p className="text-sm text-[#72635A] mt-1">
                Hand-picked roles with direct founder mentorship, real equity/stipend, and zero resume clutter.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-[#EADBCE]/40 p-1.5 rounded-2xl border border-[#DFD5C6]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#2C1B14] text-[#FAF7F2] shadow-xs"
                      : "text-[#72635A] hover:text-[#1C140E] hover:bg-white/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <InternshipCard 
                key={internship.id} 
                internship={internship}
                onApply={(i) => setActiveApplyingInternship(i)}
                featuredHighlight={internship.featured}
              />
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link href="/internships">
              <Button variant="outline" size="lg" className="border-[#DFD5C6] px-8 text-sm">
                <span>View all {internships.length} opportunities</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY & WHY GRADDIN SECTION */}
      <section id="about" className="py-20 bg-[#F5EFEB] border-t border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
                THE GRADDIN PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1C140E] leading-tight">
                Not another generic corporate job board.
              </h2>
              <p className="text-sm text-[#72635A] leading-relaxed">
                Traditional platforms force ambitious students through automated resume black holes, while early-stage startup founders drown in irrelevant PDF spam.
              </p>
              <p className="text-sm text-[#72635A] leading-relaxed">
                GRADDIn rethinks discovery from first principles: lightweight text profiles, verified company credentials via LinkedIn, automated AI semantic matching, and high-trust introductions.
              </p>

              <div className="pt-2 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#2C1B14] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-200" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1C140E]">Zero PDF Clutter:</span>
                    <span className="text-xs text-[#72635A] block">Clean, structured skill &amp; project profiles that recruiters can digest in 15 seconds.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#2C1B14] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-200" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1C140E]">Automated AI Match Scores:</span>
                    <span className="text-xs text-[#72635A] block">Instant 0-100% competency evaluation and recruiter insight on every application.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#2C1B14] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-200" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1C140E]">LinkedIn Authenticity Verification:</span>
                    <span className="text-xs text-[#72635A] block">Every startup profile is verified before posting to keep students safe from ghost jobs.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-[#DFD5C6] bg-white p-7 shadow-sm">
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center mb-4">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C140E] mb-2">For Ambitious Students</h3>
                <p className="text-xs text-[#72635A] leading-relaxed">
                  Discover breakout startups in AI, robotics, fintech, and design tools before they become household names. Build real features that ship to production.
                </p>
              </div>

              <div className="rounded-3xl border border-[#DFD5C6] bg-white p-7 shadow-sm sm:translate-y-6">
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center mb-4">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C140E] mb-2">For Early-Stage Founders</h3>
                <p className="text-xs text-[#72635A] leading-relaxed">
                  Hire hungry, self-directed student contributors who genuinely want to build alongside you. Review candidates sorted automatically by AI match score.
                </p>
              </div>

              <div className="rounded-3xl border border-[#DFD5C6] bg-white p-7 shadow-sm">
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C140E] mb-2">Reddit-Style Posting</h3>
                <p className="text-xs text-[#72635A] leading-relaxed">
                  Post opportunities in minutes using our clean composer. Tell students what you need in plain, conversational language.
                </p>
              </div>

              <div className="rounded-3xl border border-[#DFD5C6] bg-white p-7 shadow-sm sm:translate-y-6">
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C140E] mb-2">Curated &amp; Verified</h3>
                <p className="text-xs text-[#72635A] leading-relaxed">
                  Strictly high-impact internships with competitive compensation and transparent expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-[#FAF7F2] border-t border-[#E8DFD3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">FAQ</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-2">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E8DFD3] bg-white p-6">
              <h3 className="font-serif text-lg font-bold text-[#1C140E] mb-2">
                Why does GRADDIn focus exclusively on internships?
              </h3>
              <p className="text-xs text-[#72635A] leading-relaxed">
                Generic job platforms mix senior executive postings with entry-level listings, leaving students drowning in irrelevant search noise. GRADDIn is dedicated 100% to student internships and upcoming startups.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD3] bg-white p-6">
              <h3 className="font-serif text-lg font-bold text-[#1C140E] mb-2">
                How does the automated AI Match Score work?
              </h3>
              <p className="text-xs text-[#72635A] leading-relaxed">
                When you submit an application, GRADDIn AI computes an instant 0–100% match score comparing your demonstrated skills, project history, and coursework with the role requirements, along with a qualitative recruiter summary note.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD3] bg-white p-6">
              <h3 className="font-serif text-lg font-bold text-[#1C140E] mb-2">
                Why are resumes text-based instead of PDF file uploads?
              </h3>
              <p className="text-xs text-[#72635A] leading-relaxed">
                Text profiles load instantly on mobile, never get butchered by bad ATS parsers, and enable our AI matching engine to rank candidates accurately without database storage overhead.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD3] bg-white p-6">
              <h3 className="font-serif text-lg font-bold text-[#1C140E] mb-2">
                How does startup verification work?
              </h3>
              <p className="text-xs text-[#72635A] leading-relaxed">
                Startups must register with an official LinkedIn company page. Unverified companies are queued for manual admin review before their listings go live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL EDITORIAL CALLOUT */}
      <section className="py-20 bg-[#2C1B14] text-[#FAF7F2] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            The place where ambitious students meet the startups building what comes next.
          </h2>
          <p className="text-sm sm:text-base text-[#EADBCE]/80 max-w-xl mx-auto leading-relaxed">
            Join thousands of students and emerging founders already collaborating on the future.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?role=student" onClick={() => switchRole('student')}>
              <Button variant="caramel" size="lg" className="w-full sm:w-auto px-8">
                <span>Explore as Student</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/signup?role=company" onClick={() => switchRole('company')}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 text-white border-white/20 hover:bg-white/10 hover:border-white">
                <span>Post as Startup</span>
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <ApplyModal
        internship={activeApplyingInternship}
        open={!!activeApplyingInternship}
        onOpenChange={(open) => !open && setActiveApplyingInternship(null)}
      />
    </div>
  );
}
