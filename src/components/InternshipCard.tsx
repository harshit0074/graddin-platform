'use client';

import React from 'react';
import { Internship } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Banknote,
  Clock,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface InternshipCardProps {
  internship: Internship;
  onApply: (internship: Internship) => void;
  hasApplied?: boolean;
}

export function InternshipCard({ internship, onApply, hasApplied = false }: InternshipCardProps) {
  const companyName = internship.company?.company_name || 'Verified Tech Partner';
  const isVerified = internship.company?.is_verified ?? true;

  return (
    <Card className="group relative flex flex-col justify-between border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700/80 transition-all duration-300 backdrop-blur-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 rounded-2xl">
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/60 flex items-center justify-center font-bold text-lg text-indigo-400 group-hover:scale-105 transition-transform shadow-inner">
              {companyName[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <span>{companyName}</span>
                {isVerified && (
                  <span title="Verified Company">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </span>
                )}
                {internship.company?.linkedin_url && (
                  <a
                    href={internship.company.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-indigo-400"
                    title="View LinkedIn"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <CardTitle className="text-lg font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors mt-0.5 line-clamp-1">
                {internship.title}
              </CardTitle>
            </div>
          </div>

          <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] shrink-0 font-medium">
            {internship.role_type || 'Internship'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 pb-4">
        {/* KEY HIGHLIGHT TAGS */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/40">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{internship.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/40">
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            <span>{internship.stipend || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/40">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{internship.duration || '3 Months'}</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        {internship.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {internship.description}
          </p>
        )}

        {/* REQUIREMENTS */}
        {internship.requirements && (
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Required Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {internship.requirements.split(',').slice(0, 4).map((req, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                >
                  {req.trim()}
                </span>
              ))}
              {internship.requirements.split(',').length > 4 && (
                <span className="text-[10px] text-zinc-500 self-center">
                  +{internship.requirements.split(',').length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-zinc-800/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>AI Matched</span>
        </div>

        {hasApplied ? (
          <Button size="sm" disabled className="bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed text-xs">
            Already Applied
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onApply(internship)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg group/btn shadow-md shadow-indigo-600/20"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
