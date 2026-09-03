"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CandidateCard } from '@/components/CandidateCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Search, 
  Layers
} from 'lucide-react';

export default function CandidatesDeckPage() {
  const { applications, updateApplicationStatus, internships } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  const availableSkills = ["React", "TypeScript", "Figma", "Python", "PyTorch", "Next.js", "Design Systems"];

  // Filter and sort by AI match score descending
  const filteredCandidates = applications.filter((app) => {
    if (selectedInternshipId !== "all" && app.internship_id !== selectedInternshipId) {
      return false;
    }

    if (selectedStatus !== "all" && app.status !== selectedStatus) {
      return false;
    }

    if (selectedSkill !== "all" && !app.student?.skills?.toLowerCase().includes(selectedSkill.toLowerCase())) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.student?.full_name?.toLowerCase().includes(q);
      const matchSchool = app.student?.education?.toLowerCase().includes(q);
      const matchSkills = app.student?.skills?.toLowerCase().includes(q);
      const matchRole = app.internship?.title.toLowerCase().includes(q);
      if (!matchName && !matchSchool && !matchSkills && !matchRole) return false;
    }

    return true;
  }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Semantic Ranking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-1">
            Candidate Pipeline &amp; Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-[#72635A] mt-1">
            Applicants automatically ranked by AI match score against your posted requirements.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-2xl border border-[#DFD5C6] text-xs font-medium text-[#72635A]">
          <Layers className="h-4 w-4 text-[#2C1B14]" />
          <span>Total Pool: <strong className="text-[#1C140E]">{applications.length}</strong> candidates</span>
        </div>
      </div>

      {/* Visual Pipeline Stages Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: "all", label: "All Applicants", count: applications.length },
          { key: "applied", label: "Applied", count: applications.filter(a => a.status === 'applied').length },
          { key: "under_review", label: "Reviewing", count: applications.filter(a => a.status === 'under_review').length },
          { key: "shortlisted", label: "Shortlisted", count: applications.filter(a => a.status === 'shortlisted').length },
          { key: "selected", label: "Selected", count: applications.filter(a => a.status === 'selected').length },
        ].map((stage) => (
          <button
            key={stage.key}
            onClick={() => setSelectedStatus(stage.key)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedStatus === stage.key
                ? "bg-[#2C1B14] text-white border-[#2C1B14] shadow-xs"
                : "bg-white text-[#72635A] border-[#DFD5C6] hover:border-[#2C1B14]"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider block font-semibold opacity-80">
              {stage.label}
            </span>
            <span className="font-serif text-2xl font-bold block mt-0.5">
              {stage.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filter Strip */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A70]" />
          <Input
            placeholder="Search candidate name, campus, skills, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-white rounded-2xl border-[#DFD5C6]"
          />
        </div>

        {/* Filter by Opening */}
        <select
          value={selectedInternshipId}
          onChange={(e) => setSelectedInternshipId(e.target.value)}
          className="h-12 rounded-2xl border border-[#DFD5C6] bg-white px-4 text-xs font-medium text-[#1C140E] w-full md:w-auto"
        >
          <option value="all">All Opportunities</option>
          {internships.map((i) => (
            <option key={i.id} value={i.id}>{i.title}</option>
          ))}
        </select>

        {/* Filter by Skill */}
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="h-12 rounded-2xl border border-[#DFD5C6] bg-white px-4 text-xs font-medium text-[#1C140E] w-full md:w-auto"
        >
          <option value="all">All Skills</option>
          {availableSkills.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Candidates Feed */}
      {filteredCandidates.length > 0 ? (
        <div className="space-y-4">
          {filteredCandidates.map((application) => (
            <CandidateCard
              key={application.id}
              application={application}
              onStatusChange={updateApplicationStatus}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="applicants"
          title="No candidates match your current filter"
          description="Try selecting a different pipeline status, clearing your search query, or checking back once new students apply."
        />
      )}
    </div>
  );
}
