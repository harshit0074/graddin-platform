"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ArrowRight,
  Filter,
  Briefcase
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function StudentApplicationsPage() {
  const { applications } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  const statusConfig = {
    applied: {
      label: "Applied",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      description: "Application delivered to startup hiring team. Pending review.",
    },
    under_review: {
      label: "Under Review",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      description: "Startup founders are currently reviewing your profile & portfolio.",
    },
    shortlisted: {
      label: "Shortlisted 🎉",
      badge: "bg-purple-100 text-purple-900 border-purple-300 font-semibold",
      description: "You're on the priority shortlist! The team will reach out for a conversational interview.",
    },
    selected: {
      label: "Selected Offer 🚀",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold",
      description: "Congratulations! An internship offer has been extended.",
    },
    rejected: {
      label: "Not Selected",
      badge: "bg-stone-100 text-stone-600 border-stone-200",
      description: "Position filled or prioritized for different focus areas.",
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
            APPLICATION TRACKER
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C140E] mt-1">
            My Applications
          </h1>
          <p className="text-sm text-[#72635A] mt-1">
            Track real-time status and AI candidate evaluations for every startup internship you applied to.
          </p>
        </div>

        <Link href="/internships">
          <Button variant="default" size="sm" className="h-10 text-xs px-5">
            <span>Browse More Opportunities</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {["all", "applied", "under_review", "shortlisted", "selected", "rejected"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === st
                ? "bg-[#2C1B14] text-[#FAF7F2] shadow-xs"
                : "bg-white text-[#72635A] border border-[#DFD5C6] hover:bg-[#FAF7F2]"
            }`}
          >
            {st === "all" ? "All Applications" : statusConfig[st as keyof typeof statusConfig]?.label || st}
            {st === "all" && ` (${applications.length})`}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-5">
          {filteredApplications.map((app) => {
            const config = statusConfig[app.status] || statusConfig.applied;
            return (
              <div
                key={app.id}
                className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F0E8DD]">
                  <div className="flex items-start gap-4">
                    {app.internship?.company?.logo_url ? (
                      <img
                        src={app.internship.company.logo_url}
                        alt={app.internship.company.company_name}
                        className="h-12 w-12 rounded-xl object-cover border border-[#DFD5C6] shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-[#2C1B14] text-white flex items-center justify-center font-bold text-lg shrink-0">
                        {app.internship?.company?.company_name?.[0] || 'S'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#8C7A70]">
                          {app.internship?.company?.company_name}
                        </span>
                        <span className="text-xs text-[#DFD5C6]">·</span>
                        <span className="text-xs text-[#8C7A70] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied {formatRelativeTime(app.created_at)}
                        </span>
                      </div>
                      <Link href={`/internships/${app.internship_id}`}>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C140E] hover:text-[#2C1B14] transition-colors mt-0.5">
                          {app.internship?.title}
                        </h2>
                      </Link>
                    </div>
                  </div>

                  {/* Status & Match Pill */}
                  <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 shrink-0">
                    <span className={`text-xs px-3 py-1 rounded-full border ${config.badge}`}>
                      {config.label}
                    </span>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] text-xs font-bold text-[#2C1B14]">
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      <span>{app.match_score}% AI Match</span>
                    </div>
                  </div>
                </div>

                {/* AI Recruiter Feedback Quote */}
                {app.ai_feedback && (
                  <div className="mt-4 rounded-2xl bg-[#FAF7F2] p-4 border border-[#EADBCE] text-xs text-[#4A382F] leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-[#2C1B14] mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      <span>Automated AI Recruiter Feedback</span>
                    </div>
                    &ldquo;{app.ai_feedback}&rdquo;
                  </div>
                )}

                {/* Status Timeline / Description */}
                <div className="mt-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#72635A]">
                  <p>{config.description}</p>
                  <Link
                    href={`/internships/${app.internship_id}`}
                    className="font-semibold text-[#2C1B14] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>View Opening Details</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          type="applications"
          actionHref="/internships"
        />
      )}
    </div>
  );
}
