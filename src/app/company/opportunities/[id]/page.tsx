"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CandidateCard } from '@/components/CandidateCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { 
  ArrowLeft, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function OpportunityManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { internships, applications, updateApplicationStatus, updateInternship } = useAuth();
  
  const internshipId = params.id as string;
  const internship = internships.find(i => i.id === internshipId) || internships[0];

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const openingApplications = applications.filter(a => a.internship_id === internship?.id);
  const sortedApplications = [...openingApplications]
    .filter(a => filterStatus === "all" || a.status === filterStatus)
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#1C140E]">Opening Not Found</h2>
        <Link href="/company/opportunities">
          <Button variant="default" className="mt-4">Back to Openings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Breadcrumb */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#72635A] hover:text-[#1C140E]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to posted opportunities</span>
        </button>
      </div>

      {/* Opening Summary Header */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#F0E8DD]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                internship.is_active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
              }`}>
                {internship.is_active ? "Active" : "Closed"}
              </span>
              <span className="text-xs text-[#8C7A70]">· Posted {formatRelativeTime(internship.created_at)}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
              {internship.title}
            </h1>
            <p className="text-xs text-[#72635A] mt-1">
              {internship.location} · {internship.duration} · {internship.stipend} · Deadline: {internship.application_deadline || "Open"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/internships/${internship.id}`} target="_blank">
              <Button variant="outline" size="sm" className="border-[#DFD5C6] text-xs">
                <span>Public View</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
            <Button
              variant={internship.is_active ? "secondary" : "default"}
              size="sm"
              onClick={() => updateInternship(internship.id, { is_active: !internship.is_active })}
              className="text-xs"
            >
              {internship.is_active ? "Close Opening" : "Reopen"}
            </Button>
          </div>
        </div>

        {/* Pipeline Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE]">
            <div className="font-serif text-2xl font-bold text-[#1C140E]">{openingApplications.length}</div>
            <span className="text-[11px] text-[#72635A] uppercase tracking-wider font-semibold">Total Applicants</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE]">
            <div className="font-serif text-2xl font-bold text-purple-900">
              {openingApplications.filter(a => a.status === 'shortlisted').length}
            </div>
            <span className="text-[11px] text-[#72635A] uppercase tracking-wider font-semibold">Shortlisted</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE]">
            <div className="font-serif text-2xl font-bold text-emerald-900">
              {openingApplications.filter(a => a.status === 'selected').length}
            </div>
            <span className="text-[11px] text-[#72635A] uppercase tracking-wider font-semibold">Offers Extended</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE]">
            <div className="font-serif text-2xl font-bold text-[#2C1B14] flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>
                {openingApplications.length > 0 
                  ? Math.round(openingApplications.reduce((a, c) => a + (c.match_score || 85), 0) / openingApplications.length)
                  : 94}%
              </span>
            </div>
            <span className="text-[11px] text-[#72635A] uppercase tracking-wider font-semibold">Avg Match Score</span>
          </div>
        </div>
      </div>

      {/* Candidates List with Status Filter */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              Candidate Flashcards ({sortedApplications.length})
            </h2>
            <p className="text-xs text-[#72635A]">
              Ranked in real-time by AI competency evaluation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#EADBCE]/50 p-1.5 rounded-2xl border border-[#DFD5C6]">
            {["all", "applied", "shortlisted", "selected", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterStatus === s 
                    ? "bg-[#2C1B14] text-white shadow-xs" 
                    : "text-[#72635A] hover:text-[#1C140E]"
                }`}
              >
                {s === 'all' ? 'All Applicants' : s}
              </button>
            ))}
          </div>
        </div>

        {sortedApplications.length > 0 ? (
          <div className="space-y-4">
            {sortedApplications.map((app) => (
              <CandidateCard
                key={app.id}
                application={app}
                onStatusChange={updateApplicationStatus}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="applicants"
            title="No candidates in this stage"
            description="Try switching the filter to 'All Applicants' to review your complete candidate deck."
          />
        )}
      </div>
    </div>
  );
}
