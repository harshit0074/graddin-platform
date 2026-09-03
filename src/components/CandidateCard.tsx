"use client";

import React from 'react';
import Link from 'next/link';
import { Application } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  ArrowUpRight, 
  ExternalLink, 
  Clock 
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface CandidateCardProps {
  application: Application;
  onStatusChange: (applicationId: string, status: Application['status']) => void;
  onViewProfile?: (application: Application) => void;
}

export function CandidateCard({ application, onStatusChange, onViewProfile }: CandidateCardProps) {
  const { student, internship, match_score, ai_feedback, status, created_at, cover_note } = application;

  const statusColors = {
    applied: "bg-blue-50 text-blue-700 border-blue-200",
    under_review: "bg-amber-50 text-amber-800 border-amber-200",
    shortlisted: "bg-purple-50 text-purple-800 border-purple-200",
    selected: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
    rejected: "bg-stone-100 text-stone-600 border-stone-200",
  };

  const statusLabels = {
    applied: "New Applicant",
    under_review: "Under Review",
    shortlisted: "Shortlisted",
    selected: "Selected Offer",
    rejected: "Archived",
  };

  return (
    <div className="rounded-2xl border border-[#E8DFD3] bg-white p-6 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Top Bar: Student Header & AI Match Pill */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <img
            src={student?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"}
            alt={student?.full_name || "Student"}
            className="h-14 w-14 rounded-2xl object-cover border border-[#DFD5C6] shadow-2xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-lg font-bold text-[#1C140E]">
                {student?.full_name || "Student Candidate"}
              </h4>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${statusColors[status]}`}>
                {statusLabels[status]}
              </span>
            </div>
            <p className="text-xs text-[#72635A] mt-0.5 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-[#2C1B14]" />
              <span>{student?.education || student?.university || "University Candidate"}</span>
            </p>
            <span className="text-[11px] text-[#A09388] mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Applied {formatRelativeTime(created_at)} for <span className="font-medium text-[#1C140E]">{internship?.title}</span>
            </span>
          </div>
        </div>

        {/* AI Candidate Match Score Badge */}
        <div className="flex flex-col items-start sm:items-end shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2C1B14] to-[#4A3022] text-amber-200 text-xs font-bold shadow-xs border border-amber-300/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{match_score}% AI Match Score</span>
          </div>
          <span className="text-[10px] text-[#8C7A70] mt-1">
            Automated Recruiter Evaluation
          </span>
        </div>
      </div>

      {/* AI Recruiter Insight Box */}
      {ai_feedback && (
        <div className="mb-4 rounded-xl bg-[#FAF7F2] p-3.5 border border-[#EADBCE] text-xs text-[#4A382F] leading-relaxed">
          <div className="flex items-center gap-1 font-semibold text-[#2C1B14] mb-1">
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span>AI Recruiter Analysis</span>
          </div>
          &ldquo;{ai_feedback}&rdquo;
        </div>
      )}

      {/* Cover Note Snippet */}
      {cover_note && (
        <div className="mb-4 text-xs text-[#72635A] bg-white rounded-xl p-3 border border-[#F0E8DD]">
          <span className="font-semibold text-[#1C140E] block mb-1">Student Note:</span>
          &ldquo;{cover_note}&rdquo;
        </div>
      )}

      {/* Candidate Skills Chips */}
      {student?.skills && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {student.skills.split(/[,|]/).slice(0, 6).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium text-[#72635A] bg-[#F5EFEB] px-2.5 py-0.5 rounded-full border border-[#E8DFD3]"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons: Shortlist, Select, Reject, View */}
      <div className="pt-4 border-t border-[#F0E8DD] flex flex-wrap items-center justify-between gap-3">
        <Link 
          href={`/company/candidates/${application.id}`}
          className="text-xs font-semibold text-[#2C1B14] hover:underline flex items-center gap-1"
        >
          <span>View Full Profile</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {status !== 'shortlisted' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(application.id, 'shortlisted')}
              className="text-xs h-8 px-3 border-[#DFD5C6] hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300"
            >
              <UserCheck className="h-3.5 w-3.5 mr-1" />
              Shortlist
            </Button>
          )}

          {status !== 'selected' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onStatusChange(application.id, 'selected')}
              className="text-xs h-8 px-3 bg-emerald-800 hover:bg-emerald-900 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Select Candidate
            </Button>
          )}

          {status !== 'rejected' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(application.id, 'rejected')}
              className="text-xs h-8 px-2.5 text-[#8C7A70] hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Reject
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
