"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { InternshipCard } from '@/components/InternshipCard';
import { ApplyModal } from '@/components/ApplyModal';
import { Internship } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  Building2, 
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, internships, applications } = useAuth();
  const [activeApplyingInternship, setActiveApplyingInternship] = useState<Internship | null>(null);

  const student = user?.profile;

  // Curated recommendations based on student skills
  const studentSkills = student?.skills?.toLowerCase() || "";
  const recommendedInternships = internships.filter(i => 
    i.skills?.some(s => studentSkills.includes(s.toLowerCase()))
  ).slice(0, 3);

  const trendingInternships = [...internships]
    .sort((a, b) => (b.applicant_count || 0) - (a.applicant_count || 0))
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Student Welcome Hero (Page 3 Spec) */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-gradient-to-r from-[#FFFFFF] via-[#FAF7F2] to-[#F5EFEB] p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBCE]/60 text-xs font-semibold text-[#2C1B14] border border-[#DFD5C6]">
            <Sparkles className="h-3.5 w-3.5 text-[#C99A6B]" />
            <span>Welcome back, {student?.full_name?.split(' ')[0] || 'Student'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1C140E] leading-tight">
            Your next opportunity is waiting.
          </h1>

          <p className="text-sm sm:text-base text-[#72635A] max-w-xl leading-relaxed">
            Discover internships at upcoming startups building what comes next. Apply directly with your structured profile and receive instant AI candidate evaluation.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href="/internships">
              <Button variant="default" size="lg" className="px-8 shadow-xs">
                <span>Browse Opportunities</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>

            <Link href="/student/edit-profile">
              <Button variant="outline" size="lg" className="border-[#DFD5C6]">
                <span>Complete your profile</span>
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  92%
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Applications Quick Overview Strip */}
      {applications.length > 0 && (
        <div className="rounded-2xl border border-[#E8DFD3] bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#1C140E]">
                Active Applications ({applications.length})
              </h2>
              <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-semibold">
                {applications.filter(a => a.status === 'shortlisted').length} Shortlisted
              </span>
            </div>
            <p className="text-xs text-[#72635A] mt-0.5">
              Latest: Applied to {applications[0]?.internship?.title} with {applications[0]?.match_score}% AI Match score.
            </p>
          </div>

          <Link href="/student/applications">
            <Button variant="outline" size="sm" className="border-[#DFD5C6] text-xs">
              <span>View All Applications</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* SECTION 1: Recommended for you */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tailored To Your Stack</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C140E] mt-0.5">
              Recommended for you.
            </h2>
          </div>

          <Link href="/internships" className="text-xs font-semibold text-[#72635A] hover:text-[#1C140E] flex items-center gap-1">
            <span>See more</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onApply={(i) => setActiveApplyingInternship(i)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: Trending & Recently Posted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1C140E] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#C99A6B]" />
              <span>Trending Opportunities</span>
            </h3>
            <Link href="/internships" className="text-xs text-[#C99A6B] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {trendingInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                onApply={(i) => setActiveApplyingInternship(i)}
              />
            ))}
          </div>
        </div>

        {/* New Startups on GRADDIn */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#1C140E] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#C99A6B]" />
            <span>New Startups Building Next</span>
          </h3>

          <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0E8DD]">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=80"
                alt="Lumina Design"
                className="h-11 w-11 rounded-xl object-cover border border-[#DFD5C6]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-base font-bold text-[#1C140E]">Lumina Design</h4>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2C1B14] fill-[#2C1B14] text-[#FAF7F2]" />
                </div>
                <p className="text-xs text-[#72635A]">New York, NY · 1 open internship</p>
              </div>
              <Link href="/internships/intern-1">
                <Button variant="outline" size="sm" className="text-xs h-8 border-[#DFD5C6]">
                  View Roles
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0E8DD]">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"
                alt="Velo AI"
                className="h-11 w-11 rounded-xl object-cover border border-[#DFD5C6]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-base font-bold text-[#1C140E]">Velo AI</h4>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2C1B14] fill-[#2C1B14] text-[#FAF7F2]" />
                </div>
                <p className="text-xs text-[#72635A]">San Francisco, CA · 2 open internships</p>
              </div>
              <Link href="/internships/intern-2">
                <Button variant="outline" size="sm" className="text-xs h-8 border-[#DFD5C6]">
                  View Roles
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80"
                alt="Kite Robotics"
                className="h-11 w-11 rounded-xl object-cover border border-[#DFD5C6]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-base font-bold text-[#1C140E]">Kite Robotics</h4>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2C1B14] fill-[#2C1B14] text-[#FAF7F2]" />
                </div>
                <p className="text-xs text-[#72635A]">Bangalore, India · 1 open internship</p>
              </div>
              <Link href="/internships/intern-4">
                <Button variant="outline" size="sm" className="text-xs h-8 border-[#DFD5C6]">
                  View Roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        internship={activeApplyingInternship}
        open={!!activeApplyingInternship}
        onOpenChange={(open) => !open && setActiveApplyingInternship(null)}
      />
    </div>
  );
}
