"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Mail, 
  FileText,
  Briefcase
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';

export default function CandidateProfileViewPage() {
  const params = useParams();
  const router = useRouter();
  const { applications, updateApplicationStatus } = useAuth();
  const { toast } = useToast();

  const applicationId = params.id as string;
  const application = applications.find(a => a.id === applicationId) || applications[0];

  if (!application || !application.student) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#1C140E]">Candidate Not Found</h2>
        <Link href="/company/candidates">
          <Button variant="default" className="mt-4">Back to Candidates</Button>
        </Link>
      </div>
    );
  }

  const student = application.student;

  const handleDecision = (status: 'shortlisted' | 'selected' | 'rejected') => {
    updateApplicationStatus(application.id, status);
    toast({
      title: `Candidate ${status}`,
      description: `${student.full_name} has been moved to ${status} status.`,
      variant: status === 'rejected' ? 'destructive' : 'success',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#72635A] hover:text-[#1C140E]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to candidate pipeline</span>
        </button>

        <span className="text-xs text-[#8C7A70]">
          Candidate Evaluation View
        </span>
      </div>

      {/* Recruiter Floating Action Bar */}
      <div className="sticky top-20 z-30 rounded-2xl border border-[#DFD5C6] bg-white/95 backdrop-blur-md p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#2C1B14] to-[#5C3B2B] text-amber-200 text-xs font-bold border border-amber-300/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{application.match_score}% AI Match</span>
          </div>
          <span className="text-xs font-semibold text-[#1C140E]">
            Status: <span className="capitalize">{application.status}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a href={`mailto:${student.email || 'student@campus.edu'}`}>
            <Button variant="outline" size="sm" className="text-xs h-9 border-[#DFD5C6]">
              <Mail className="h-3.5 w-3.5 mr-1" />
              <span>Contact Candidate</span>
            </Button>
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDecision('shortlisted')}
            className="text-xs h-9 border-purple-300 text-purple-900 bg-purple-50 hover:bg-purple-100"
          >
            <UserCheck className="h-3.5 w-3.5 mr-1" />
            <span>Shortlist</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleDecision('selected')}
            className="text-xs h-9 bg-emerald-800 hover:bg-emerald-900 text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            <span>Select Candidate</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDecision('rejected')}
            className="text-xs h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="h-3.5 w-3.5 mr-1" />
            <span>Reject</span>
          </Button>
        </div>
      </div>

      {/* AI Recruiter Insight Box */}
      {application.ai_feedback && (
        <div className="rounded-2xl border border-[#C99A6B]/50 bg-gradient-to-b from-white to-[#FAF7F2] p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C1B14]">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>GRADDIn AI Candidate Evaluation</span>
          </div>
          <p className="text-xs sm:text-sm text-[#4A382F] leading-relaxed">
            &ldquo;{application.ai_feedback}&rdquo;
          </p>
          {application.cover_note && (
            <div className="pt-2 border-t border-[#EADBCE] text-xs text-[#72635A]">
              <strong className="text-[#1C140E] block mb-0.5">Student Cover Note:</strong>
              &ldquo;{application.cover_note}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* Candidate Profile Details */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white overflow-hidden shadow-xs">
        <div className="h-36 bg-gradient-to-r from-[#2C1B14] to-[#5C3B2B] p-6 text-white text-xs font-bold uppercase tracking-widest">
          Candidate Dossier
        </div>

        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <img
              src={student.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt={student.full_name || "Student"}
              className="h-28 w-28 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
            />

            <div className="flex items-center gap-2">
              {student.portfolio_url && (
                <a href={student.portfolio_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl border border-[#DFD5C6] text-[#2C1B14]">
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {student.github_url && (
                <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl border border-[#DFD5C6] text-[#2C1B14]">
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {student.linkedin_url && (
                <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl border border-[#DFD5C6] text-[#2C1B14]">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#1C140E]">
            {student.full_name}
          </h2>
          <p className="text-sm text-[#72635A] mt-1 font-medium">{student.headline}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C7A70] mt-3">
            <span className="flex items-center gap-1 font-medium text-[#1C140E]">
              <GraduationCap className="h-4 w-4 text-[#2C1B14]" />
              {student.education || student.university}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#2C1B14]" />
              {student.location || "Remote"}
            </span>
          </div>

          {student.bio && (
            <div className="mt-6 rounded-2xl bg-[#FAF7F2] p-5 border border-[#EADBCE] text-xs text-[#4A382F] leading-relaxed">
              &ldquo;{student.bio}&rdquo;
            </div>
          )}

          {student.skills && (
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
                Demonstrated Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {student.skills.split(/[,|]/).map((s, idx) => (
                  <span key={idx} className="text-xs font-medium text-[#2C1B14] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E8DFD3]">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Experience & Resume */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#1C140E] mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#C99A6B]" />
            <span>Experience &amp; Shipped Work</span>
          </h3>
          <p className="text-sm text-[#72635A] leading-relaxed whitespace-pre-line">
            {student.experience}
          </p>
        </div>

        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#1C140E] mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#C99A6B]" />
            <span>Structured Resume Text</span>
          </h3>
          <p className="text-xs text-[#72635A] leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE] font-mono whitespace-pre-line">
            {student.resume_text || student.experience}
          </p>
        </div>
      </div>
    </div>
  );
}
