"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, GraduationCap, Code, Link as LinkIcon } from 'lucide-react';

export default function StudentEditProfilePage() {
  const router = useRouter();
  const { user, updateStudentProfile } = useAuth();
  const { toast } = useToast();

  const profile = user?.profile;

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    avatarUrl: profile?.avatar_url || "",
    headline: profile?.headline || "",
    university: profile?.university || "",
    degree: profile?.degree || "",
    graduationYear: profile?.graduation_year || "2026",
    location: profile?.location || "",
    bio: profile?.bio || "",
    skills: profile?.skills || "",
    experience: profile?.experience || "",
    resumeText: profile?.resume_text || "",
    portfolioUrl: profile?.portfolio_url || "",
    githubUrl: profile?.github_url || "",
    linkedinUrl: profile?.linkedin_url || "",
    interests: profile?.interests?.join(', ') || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      updateStudentProfile({
        full_name: formData.fullName,
        avatar_url: formData.avatarUrl,
        headline: formData.headline,
        university: formData.university,
        degree: formData.degree,
        graduation_year: formData.graduationYear,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        resume_text: formData.resumeText,
        portfolio_url: formData.portfolioUrl,
        github_url: formData.githubUrl,
        linkedin_url: formData.linkedinUrl,
        education: `${formData.university} — ${formData.degree} (Class of ${formData.graduationYear})`,
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      });

      toast({
        title: "Profile saved",
        description: "Your GRADDIn student profile changes are now live to startup recruiters.",
        variant: "success",
      });

      router.push('/student/profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#72635A] hover:text-[#1C140E]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Profile</span>
        </button>

        <span className="text-xs text-[#8C7A70]">Auto-sync enabled</span>
      </div>

      <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-md">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">PROFILE EDITOR</span>
          <h1 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">
            Edit your GRADDIn Profile
          </h1>
          <p className="text-xs text-[#72635A] mt-1">
            Update your project work, skills, and links seen by startup hiring teams.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview & URL */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-center gap-4">
            <img
              src={formData.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"}
              alt="Avatar preview"
              className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#1C140E] mb-1">
                Profile Photo Image URL
              </label>
              <Input
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, India or Remote"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Headline</label>
            <Input
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Aspiring Product Engineer | BITS Pilani '26"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Personal Bio / Philosophy</label>
            <Textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="What kind of products or tools do you love building?"
            />
          </div>

          {/* Education */}
          <div className="pt-4 border-t border-[#F0E8DD]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-3 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Campus &amp; Education</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">University</label>
                <Input
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Degree &amp; Major</label>
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Graduation Year</label>
                <Input
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="pt-4 border-t border-[#F0E8DD] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-3 flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" />
              <span>Skills &amp; AI Matching Keys</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
                Skills (Comma-separated)
              </label>
              <Textarea
                rows={2}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, TypeScript, Next.js, Figma, Tailwind CSS..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
                Past Experience &amp; Projects
              </label>
              <Textarea
                rows={4}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Detail key GitHub projects, campus responsibilities, or previous startups..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
                Text Resume Summary
              </label>
              <Textarea
                rows={3}
                value={formData.resumeText}
                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                placeholder="Clean text resume overview..."
              />
            </div>
          </div>

          {/* Links */}
          <div className="pt-4 border-t border-[#F0E8DD]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-3 flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Links &amp; Proof of Work</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Portfolio URL</label>
                <Input
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">GitHub URL</label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">LinkedIn URL</label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F0E8DD] flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#DFD5C6]">
              Cancel
            </Button>
            <Button type="submit" variant="default" isLoading={isSaving} className="px-8 font-semibold">
              <Save className="h-4 w-4 mr-1.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
