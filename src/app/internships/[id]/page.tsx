"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplyModal } from '@/components/ApplyModal';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Banknote, 
  Calendar, 
  CheckCircle2, 
  Bookmark, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  Share2,
  Users
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { internships, savedInternshipIds, toggleSaveInternship, applications } = useAuth();
  
  const internshipId = params.id as string;
  const internship = internships.find(i => i.id === internshipId);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const isSaved = savedInternshipIds.includes(internship?.id || "");
  const existingApp = applications.find(a => a.internship_id === internship?.id);

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#1C140E]">Opportunity not found</h2>
        <p className="text-sm text-[#72635A] mt-2 mb-6">This listing may have been filled or closed.</p>
        <Link href="/internships">
          <Button variant="default">Browse Openings</Button>
        </Link>
      </div>
    );
  }

  const company = internship.company;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back to Browse breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#72635A] hover:text-[#1C140E] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to opportunities</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#F0E8DD]">
          <div className="flex items-start gap-4">
            {company?.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.company_name}
                className="h-16 w-16 rounded-2xl object-cover border border-[#DFD5C6] shadow-xs shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-[#2C1B14] text-white flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
                {company?.company_name?.[0] || 'S'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1C140E]">
                  {company?.company_name}
                </span>
                {company?.is_verified && (
                  <span title="Verified Startup" className="inline-flex items-center text-[#2C1B14]">
                    <CheckCircle2 className="h-4 w-4 fill-[#2C1B14] text-[#FAF7F2]" />
                  </span>
                )}
                <span className="text-xs text-[#8C7A70]">· {company?.industry || "Tech Startup"}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1C140E] mt-1 tracking-tight leading-tight">
                {internship.title}
              </h1>

              <div className="text-xs text-[#72635A] mt-2 flex items-center gap-2">
                <span>Posted {formatRelativeTime(internship.created_at)}</span>
                <span>•</span>
                <span>{internship.applicant_count || 12} students applied</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => toggleSaveInternship(internship.id)}
              className={`p-3 rounded-2xl border transition-colors ${
                isSaved 
                  ? "bg-[#2C1B14] text-[#FAF7F2] border-[#2C1B14]" 
                  : "bg-white text-[#72635A] border-[#DFD5C6] hover:bg-[#FAF7F2] hover:text-[#1C140E]"
              }`}
              title={isSaved ? "Saved" : "Save opportunity"}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </button>

            {existingApp ? (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>Applied ({existingApp.match_score}% Match)</span>
              </span>
            ) : (
              <Button
                variant="default"
                size="lg"
                onClick={() => setApplyModalOpen(true)}
                className="px-8 shadow-sm font-semibold"
              >
                <span>Apply now</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Grid Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="space-y-1">
            <span className="text-[#8C7A70] uppercase tracking-wider font-semibold text-[10px]">Location &amp; Mode</span>
            <div className="flex items-center gap-1.5 font-medium text-[#1C140E]">
              <MapPin className="h-3.5 w-3.5 text-[#2C1B14]" />
              <span>{internship.location || "Remote"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#8C7A70] uppercase tracking-wider font-semibold text-[10px]">Duration</span>
            <div className="flex items-center gap-1.5 font-medium text-[#1C140E]">
              <Clock className="h-3.5 w-3.5 text-[#2C1B14]" />
              <span>{internship.duration || "3 Months"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#8C7A70] uppercase tracking-wider font-semibold text-[10px]">Stipend</span>
            <div className="flex items-center gap-1.5 font-medium text-[#1C140E]">
              <Banknote className="h-3.5 w-3.5 text-[#2C1B14]" />
              <span>{internship.stipend || "Competitive"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#8C7A70] uppercase tracking-wider font-semibold text-[10px]">Application Deadline</span>
            <div className="flex items-center gap-1.5 font-medium text-[#1C140E]">
              <Calendar className="h-3.5 w-3.5 text-[#2C1B14]" />
              <span>{internship.application_deadline || "Open until filled"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rich Opportunity Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* About the Opportunity */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-8 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-[#1C140E] mb-4">
              About the opportunity
            </h2>
            <p className="text-sm text-[#72635A] leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* What you'll do */}
          {internship.responsibilities && (
            <div className="rounded-3xl border border-[#E8DFD3] bg-white p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#1C140E] mb-4">
                What you&apos;ll do
              </h2>
              <ul className="space-y-3">
                {internship.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#72635A] leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2C1B14] mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What we're looking for & Skills */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-8 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-[#1C140E] mb-4">
              What we&apos;re looking for
            </h2>
            <p className="text-sm text-[#72635A] leading-relaxed mb-6">
              {internship.requirements}
            </p>

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-3">
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold text-[#2C1B14] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E8DFD3]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* What you'll learn */}
          {internship.what_you_learn && (
            <div className="rounded-3xl border border-[#E8DFD3] bg-white p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#1C140E] mb-4">
                What you&apos;ll learn
              </h2>
              <ul className="space-y-3">
                {internship.what_you_learn.map((learn, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#72635A] leading-relaxed">
                    <Sparkles className="h-4 w-4 text-[#C99A6B] shrink-0 mt-0.5" />
                    <span>{learn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Startup Profile & Founder Information */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-[#DFD5C6] bg-white p-7 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C99A6B]">
              ABOUT THE STARTUP
            </h3>

            <div className="flex items-center gap-3">
              {company?.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.company_name}
                  className="h-12 w-12 rounded-xl object-cover border border-[#DFD5C6]"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-[#2C1B14] text-white flex items-center justify-center font-bold text-lg">
                  {company?.company_name?.[0]}
                </div>
              )}
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1C140E]">
                  {company?.company_name}
                </h4>
                <p className="text-xs text-[#72635A]">{company?.location}</p>
              </div>
            </div>

            <p className="text-xs text-[#72635A] leading-relaxed">
              {company?.about}
            </p>

            {company?.mission && (
              <div className="rounded-2xl bg-[#FAF7F2] p-4 border border-[#EADBCE] text-xs text-[#4A382F] leading-relaxed">
                <span className="font-bold block text-[#1C140E] mb-1">Our Mission:</span>
                &ldquo;{company.mission}&rdquo;
              </div>
            )}

            {/* Links */}
            <div className="pt-2 space-y-2 text-xs">
              {company?.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8DFD3] hover:bg-[#FAF7F2] transition-colors"
                >
                  <span className="font-medium text-[#1C140E]">Company Website</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#8C7A70]" />
                </a>
              )}
              {company?.linkedin_url && (
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8DFD3] hover:bg-[#FAF7F2] transition-colors"
                >
                  <span className="font-medium text-[#1C140E]">Official LinkedIn</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#8C7A70]" />
                </a>
              )}
            </div>

            {/* Floating Apply button in sidebar */}
            <div className="pt-4 border-t border-[#F0E8DD]">
              {!existingApp ? (
                <Button
                  variant="default"
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full font-semibold"
                >
                  <span>Apply now →</span>
                </Button>
              ) : (
                <div className="text-center text-xs font-semibold text-emerald-800 bg-emerald-50 py-2.5 rounded-xl border border-emerald-200">
                  Applied with {existingApp.match_score}% AI Match
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        internship={internship}
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
      />
    </div>
  );
}
