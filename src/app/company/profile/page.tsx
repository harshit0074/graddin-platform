"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { InternshipCard } from '@/components/InternshipCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Globe, 
  CheckCircle2, 
  Edit3, 
  Plus,
  ExternalLink
} from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/social-icons';

export default function StartupProfilePage() {
  const { user, internships, updateCompanyProfile, companies } = useAuth();
  const { toast } = useToast();

  const company = user?.company || companies[0];
  const activeInternships = internships.filter(i => i.company_id === company.id && i.is_active);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: company.company_name,
    about: company.about || "",
    mission: company.mission || "",
    location: company.location || "",
    websiteUrl: company.website_url || "",
    linkedinUrl: company.linkedin_url || "",
    industry: company.industry || "",
    companySize: company.company_size || "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile({
      company_name: formData.companyName,
      about: formData.about,
      mission: formData.mission,
      location: formData.location,
      website_url: formData.websiteUrl,
      linkedin_url: formData.linkedinUrl,
      industry: formData.industry,
      company_size: formData.companySize,
    });
    setIsEditing(false);
    toast({
      title: "Startup profile updated",
      variant: "success",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner & Header */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white overflow-hidden shadow-xs">
        {/* Warm Header Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#2C1B14] via-[#4A3022] to-[#6A4632] p-6 flex items-start justify-between relative">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#EADBCE]/80 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
            Startup Profile
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/90 text-[#2C1B14] hover:bg-white text-xs h-8"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </Button>
        </div>

        {/* Profile Card Main Info */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="relative">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.company_name}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
                />
              ) : (
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl bg-[#2C1B14] text-white flex items-center justify-center font-serif text-4xl font-bold border-4 border-white shadow-lg">
                  {company.company_name[0]}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              {company.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFD5C6] text-xs font-semibold text-[#1C140E] hover:bg-[#FAF7F2]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3 text-[#8C7A70]" />
                </a>
              )}
              {company.linkedin_url && (
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFD5C6] text-xs font-semibold text-[#1C140E] hover:bg-[#FAF7F2]"
                >
                  <LinkedinIcon className="h-3.5 w-3.5 text-[#0A66C2]" />
                  <span>Official LinkedIn</span>
                  <ExternalLink className="h-3 w-3 text-[#8C7A70]" />
                </a>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
                  {company.company_name}
                </h1>
                {company.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Verified Startup</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Verification In Review
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C7A70]">
                <span className="font-medium text-[#1C140E]">{company.industry || "Technology"}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#2C1B14]" />
                  {company.location || "Remote"}
                </span>
                <span>•</span>
                <span>{company.company_size || "10-25 team"}</span>
                <span>•</span>
                <span>Founded {company.founded_year || "2024"}</span>
              </div>

              <p className="text-sm text-[#72635A] leading-relaxed max-w-3xl pt-2">
                {company.about}
              </p>

              {company.mission && (
                <div className="rounded-2xl bg-[#FAF7F2] p-5 border border-[#EADBCE] text-xs sm:text-sm text-[#4A382F] leading-relaxed">
                  <span className="font-bold text-[#1C140E] block mb-1">Our Mission:</span>
                  &ldquo;{company.mission}&rdquo;
                </div>
              )}
            </div>
          ) : (
            /* Inline Edit Mode */
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C140E] mb-1">Company Name</label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C140E] mb-1">Location / HQ</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1">About the Startup</label>
                <Textarea
                  rows={3}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1">Mission</label>
                <Input
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Team Section */}
      {company.team_members && company.team_members.length > 0 && (
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-[#1C140E] mb-4">
            Founding Team &amp; Mentors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {company.team_members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE]">
                <img
                  src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover border border-[#DFD5C6]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1C140E]">{member.name}</h4>
                  <p className="text-xs text-[#72635A]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Openings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
              OPPORTUNITIES
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">
              Active Internships at {company.company_name} ({activeInternships.length})
            </h2>
          </div>

          <Link href="/company/post">
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              <span>Post New Role</span>
            </Button>
          </Link>
        </div>

        {activeInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#DFD5C6] bg-white">
            <p className="text-sm text-[#72635A]">No active listings currently published.</p>
          </div>
        )}
      </div>
    </div>
  );
}
