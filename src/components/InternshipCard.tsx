"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Internship } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  Banknote, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Check
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface InternshipCardProps {
  internship: Internship;
  onApply?: (internship: Internship) => void;
  featuredHighlight?: boolean;
}

export function InternshipCard({ internship, onApply, featuredHighlight }: InternshipCardProps) {
  const { savedInternshipIds, toggleSaveInternship, applications, role } = useAuth();
  const isSaved = savedInternshipIds.includes(internship.id);

  // Check if current user has applied
  const existingApp = applications.find(a => a.internship_id === internship.id);

  return (
    <div className={`group relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
      featuredHighlight 
        ? "bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F2] border-[#C99A6B]/50 shadow-md hover:shadow-xl hover:border-[#C99A6B]" 
        : "bg-white border-[#E8DFD3] shadow-xs hover:shadow-md hover:border-[#C99A6B]/60"
    }`}>
      {/* Card Header: Startup Logo, Name, Verified, Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {internship.company?.logo_url ? (
              <img
                src={internship.company.logo_url}
                alt={internship.company.company_name}
                className="h-12 w-12 rounded-xl object-cover border border-[#DFD5C6] shadow-2xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[#2C1B14] text-amber-100 flex items-center justify-center font-bold text-lg shadow-2xs">
                {internship.company?.company_name?.[0] || 'S'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#1C140E]">
                  {internship.company?.company_name}
                </span>
                {internship.company?.is_verified && (
                  <span title="Verified by GRADDIn" className="inline-flex items-center text-[#2C1B14]">
                    <CheckCircle2 className="h-3.5 w-3.5 fill-[#2C1B14] text-[#FAF7F2]" />
                  </span>
                )}
              </div>
              <span className="text-xs text-[#72635A]">
                {internship.department || "Engineering & Product"} · {formatRelativeTime(internship.created_at)}
              </span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveInternship(internship.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved 
                ? "bg-[#2C1B14] text-[#FAF7F2] border-[#2C1B14]" 
                : "bg-white/80 text-[#72635A] border-[#DFD5C6] hover:bg-[#FAF7F2] hover:text-[#1C140E]"
            }`}
            title={isSaved ? "Remove from saved" : "Save opportunity"}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Opportunity Title */}
        <Link href={`/internships/${internship.id}`}>
          <h3 className="font-serif text-xl font-bold text-[#1C140E] group-hover:text-[#2C1B14] transition-colors leading-snug mb-2 line-clamp-1">
            {internship.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-[#72635A] line-clamp-2 leading-relaxed mb-4">
          {internship.description}
        </p>

        {/* Metadata Pills: Location, Stipend, Duration */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium text-[#72635A]">
          <span className="inline-flex items-center gap-1 bg-[#F5EFEB] px-2.5 py-1 rounded-md border border-[#E8DFD3]">
            <MapPin className="h-3 w-3 text-[#2C1B14]" />
            {internship.location || "Remote"}
          </span>
          <span className="inline-flex items-center gap-1 bg-[#F5EFEB] px-2.5 py-1 rounded-md border border-[#E8DFD3]">
            <Clock className="h-3 w-3 text-[#2C1B14]" />
            {internship.duration || "3 Months"}
          </span>
          <span className="inline-flex items-center gap-1 bg-[#EADBCE]/50 text-[#2C1B14] font-semibold px-2.5 py-1 rounded-md border border-[#DFD5C6]">
            <Banknote className="h-3.5 w-3.5 text-[#2C1B14]" />
            {internship.stipend || "Stipend Provided"}
          </span>
        </div>

        {/* Skills Chips */}
        {internship.skills && internship.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {internship.skills.slice(0, 4).map((skill, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-medium text-[#72635A] bg-white px-2 py-0.5 rounded-full border border-[#E8DFD3]"
              >
                {skill}
              </span>
            ))}
            {internship.skills.length > 4 && (
              <span className="text-[11px] font-medium text-[#8C7A70] self-center">
                +{internship.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-[#F0E8DD] flex items-center justify-between gap-3">
        <Link 
          href={`/internships/${internship.id}`}
          className="text-xs font-semibold text-[#72635A] hover:text-[#1C140E] transition-colors flex items-center gap-1"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>

        {existingApp ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Check className="h-3.5 w-3.5" />
            <span>Applied ({existingApp.match_score}% Match)</span>
          </span>
        ) : (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onApply ? onApply(internship) : window.location.assign(`/internships/${internship.id}`)}
            className="text-xs h-9 px-4 shadow-xs"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
