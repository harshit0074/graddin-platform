"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  MapPin, 
  Edit3, 
  Globe, 
  Sparkles, 
  Code, 
  Briefcase, 
  FileText,
  Heart,
  Share2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const profile = user?.profile;

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#1C140E]">No Profile Found</h2>
        <Link href="/student-setup">
          <Button variant="default" className="mt-4">Set up profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* LinkedIn + Instagram Hybrid Banner & Header Card */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white overflow-hidden shadow-sm mb-8">
        {/* Editorial Warm Gradient Cover Banner */}
        <div className="h-40 sm:h-52 bg-gradient-to-r from-[#2C1B14] via-[#4A3022] to-[#724E38] relative p-6 flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#EADBCE]/80 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
            Student Profile
          </span>
          <Link href="/student/edit-profile">
            <Button variant="secondary" size="sm" className="bg-white/90 text-[#2C1B14] hover:bg-white text-xs h-8">
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>

        {/* Profile Info Row with Floating Avatar */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="relative">
              <img
                src={profile.avatar_url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80"}
                alt={profile.full_name || "Profile"}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />
              <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white" title="Active on GRADDIn" />
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-2 pt-2">
              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#DFD5C6] text-[#2C1B14] hover:bg-[#FAF7F2] transition-colors"
                  title="Portfolio"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#DFD5C6] text-[#2C1B14] hover:bg-[#FAF7F2] transition-colors"
                  title="GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#DFD5C6] text-[#2C1B14] hover:bg-[#FAF7F2] transition-colors"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div className="space-y-2 mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] tracking-tight">
              {profile.full_name}
            </h1>
            <p className="text-base text-[#72635A] font-medium leading-relaxed max-w-2xl">
              {profile.headline}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C7A70] pt-1">
              <span className="flex items-center gap-1.5 font-medium text-[#1C140E]">
                <GraduationCap className="h-4 w-4 text-[#2C1B14]" />
                {profile.university} · Class of {profile.graduation_year || '2026'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#2C1B14]" />
                {profile.location || "Remote"}
              </span>
            </div>
          </div>

          {/* Bio Snippet */}
          {profile.bio && (
            <div className="rounded-2xl bg-[#FAF7F2] p-5 border border-[#EADBCE] text-xs sm:text-sm text-[#4A382F] leading-relaxed mb-6">
              &ldquo;{profile.bio}&rdquo;
            </div>
          )}

          {/* Skills Chips Strip */}
          {profile.skills && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
                Core Competencies
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(/[,|]/).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-[#2C1B14] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E8DFD3]"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Sections: Experience, Education, Projects, Resume */}
      <div className="space-y-6">
        {/* Experience & Past Projects */}
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              Experience &amp; Shipped Projects
            </h2>
          </div>
          <p className="text-sm text-[#72635A] leading-relaxed whitespace-pre-line">
            {profile.experience}
          </p>
        </div>

        {/* Education */}
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              Education &amp; Campus
            </h2>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#1C140E]">
              {profile.university}
            </h3>
            <p className="text-xs text-[#72635A]">
              {profile.degree || profile.education}
            </p>
            <p className="text-xs text-[#8C7A70]">
              Expected Graduation: {profile.graduation_year || "2026"}
            </p>
          </div>
        </div>

        {/* Text-Based Resume Summary */}
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
                Resume Overview
              </h2>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Text Profile (Zero File Clutter)
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#72635A] leading-relaxed bg-[#FAF7F2] p-5 rounded-2xl border border-[#EADBCE] whitespace-pre-line font-mono">
            {profile.resume_text || profile.experience}
          </p>
        </div>

        {/* Startup Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-[#FAF7F2] text-[#2C1B14] flex items-center justify-center">
                <Heart className="h-4 w-4 text-[#C99A6B]" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
                Interests &amp; Mission Alignment
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-[#72635A] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DFD5C6]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
