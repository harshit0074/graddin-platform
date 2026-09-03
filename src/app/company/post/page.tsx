"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  Send, 
  MapPin, 
  Clock, 
  Banknote, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PostOpportunityPage() {
  const router = useRouter();
  const { user, postInternship } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'composer' | 'preview'>('composer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reddit-style composer state
  const [formData, setFormData] = useState({
    title: "Full Stack Engineer Intern (Next.js & TypeScript)",
    headlineSummary: "Help build the real-time collaboration canvas for our early customers. We need someone who loves crafting responsive interfaces and writing clean React code.",
    description: `We are looking for a motivated student engineer to join our founding engineering team for the upcoming term.

What you'll build:
• Real-time collaborative canvas components with optimistic state updates
• Performant frontend views in Next.js 15 App Router and Tailwind CSS
• Type-safe backend integrations and API endpoints

What we look for:
• Working familiarity with React, TypeScript, and Git
• Curiosity about distributed systems and fast browser rendering
• Excitement to work in a fast-paced early stage startup environment`,
    requirements: "React, TypeScript, Next.js, Tailwind CSS, REST APIs, Git",
    department: "Engineering",
    workMode: "Remote" as const,
    location: "Remote (Global)",
    duration: "3 Months",
    stipend: "₹45,000 / month",
    deadline: "2026-10-31",
    tagInput: "",
    tags: ["React", "TypeScript", "Next.js", "Remote", "Frontend"],
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && formData.tagInput.trim()) {
      e.preventDefault();
      const newTag = formData.tagInput.trim().replace(/,/g, '');
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
          tagInput: "",
        });
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await postInternship({
        company_id: user?.company?.id || "comp-1",
        title: formData.title,
        description: `${formData.headlineSummary}\n\n${formData.description}`,
        requirements: formData.requirements,
        role_type: "Full-time Internship",
        duration: formData.duration,
        stipend: formData.stipend,
        location: formData.location,
        application_deadline: formData.deadline,
        department: formData.department,
        work_mode: formData.workMode,
        skills: formData.tags,
        responsibilities: [
          "Build production-quality components in Next.js and TypeScript",
          "Collaborate directly with founding engineers on technical roadmaps",
          "Participate in product demos and engineering critiques"
        ],
        what_you_learn: [
          "End-to-end production architecture in venture-backed startup",
          "High velocity feature execution with modern tools"
        ]
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2C1B14', '#C99A6B', '#EADBCE']
      });

      toast({
        title: "Opportunity published!",
        description: "Students can now discover and apply to your internship posting.",
        variant: "success",
      });

      router.push('/company/opportunities');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
            COMMUNITY COMPOSER
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-1">
            Post a new opportunity
          </h1>
          <p className="text-xs sm:text-sm text-[#72635A] mt-1">
            Conversational, Reddit-style composer. No HR bureaucracy—tell students what you need in plain words.
          </p>
        </div>

        {/* Tab Switcher: Composer vs Preview */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EADBCE]/50 border border-[#DFD5C6]">
          <button
            type="button"
            onClick={() => setActiveTab('composer')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'composer'
                ? "bg-[#2C1B14] text-white shadow-xs"
                : "text-[#72635A] hover:text-[#1C140E]"
            }`}
          >
            Composer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? "bg-[#2C1B14] text-white shadow-xs"
                : "text-[#72635A] hover:text-[#1C140E]"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === 'composer' ? (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-md space-y-6">
          {/* Opportunity Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-2">
              Opportunity Title
            </label>
            <Input
              required
              placeholder="e.g. Product Design Intern or AI Systems Engineering Intern"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-base font-semibold py-6"
            />
          </div>

          {/* Headline / What are you looking for? */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-2">
              What are you looking for? (The TL;DR)
            </label>
            <Input
              required
              placeholder="A one-sentence summary of the mission and what the student will own..."
              value={formData.headlineSummary}
              onChange={(e) => setFormData({ ...formData, headlineSummary: e.target.value })}
            />
          </div>

          {/* Conversational Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-2">
              Tell students about the role...
            </label>
            <Textarea
              rows={8}
              required
              placeholder="Talk about your product roadmap, what you'll ship together, mentorship, and why this is a high-growth opportunity..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Structured Fields Grid */}
          <div className="pt-4 border-t border-[#F0E8DD]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] mb-4">
              Structured Opportunity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Work Mode</label>
                <select
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                  className="w-full h-11 rounded-xl border border-[#DFD5C6] bg-white px-3 text-xs text-[#1C140E] focus-visible:ring-2 focus-visible:ring-[#2C1B14]"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Location / City</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bangalore or Remote"
                  className="text-xs h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Duration</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 3 Months"
                  className="text-xs h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Monthly Stipend</label>
                <Input
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  placeholder="e.g. ₹45,000 / month"
                  className="text-xs h-11"
                />
              </div>
            </div>
          </div>

          {/* Tags & Skills Selector (Reddit style) */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-2">
              Skills &amp; Community Tags (Press Enter or comma)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl border border-[#DFD5C6] bg-[#FAF7F2] min-h-[50px]">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-[#2C1B14] text-[#FAF7F2] px-3 py-1 rounded-full text-xs font-medium"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag (e.g. Figma, React)..."
                value={formData.tagInput}
                onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                onKeyDown={handleAddTag}
                className="bg-transparent border-none text-xs text-[#1C140E] focus:outline-none flex-1 min-w-[140px]"
              />
            </div>
          </div>

          {/* Department & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Engineering, Design, AI Systems"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Application Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#F0E8DD] flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#DFD5C6]">
              Cancel
            </Button>
            <Button type="submit" variant="default" size="lg" isLoading={isSubmitting} className="px-8 font-semibold">
              <Send className="h-4 w-4 mr-2" />
              <span>Post Opportunity →</span>
            </Button>
          </div>
        </form>
      ) : (
        /* LIVE PREVIEW TAB */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#EADBCE]/50 border border-[#DFD5C6] text-xs text-[#2C1B14] flex items-center justify-between">
            <span>✨ Live Student View: This is exactly how your listing will appear to ambitious students.</span>
            <button
              onClick={() => setActiveTab('composer')}
              className="font-bold underline hover:text-black"
            >
              Back to edit
            </button>
          </div>

          {/* Simulated Opportunity Page */}
          <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#8C7A70] uppercase tracking-wider">
                  {user?.company?.company_name || 'Your Startup'} · {formData.department}
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">
                  {formData.title || "Opportunity Title"}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#72635A] mt-3">
                  <span className="flex items-center gap-1 font-medium text-[#1C140E]">
                    <MapPin className="h-3.5 w-3.5 text-[#2C1B14]" />
                    {formData.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-[#1C140E]">
                    <Clock className="h-3.5 w-3.5 text-[#2C1B14]" />
                    {formData.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-[#1C140E]">
                    <Banknote className="h-3.5 w-3.5 text-[#2C1B14]" />
                    {formData.stipend}
                  </span>
                </div>
              </div>
              <Button variant="default" size="sm" className="pointer-events-none">
                Apply now →
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] text-xs text-[#4A382F] leading-relaxed">
              &ldquo;{formData.headlineSummary}&rdquo;
            </div>

            <div className="space-y-3 text-sm text-[#72635A] leading-relaxed whitespace-pre-line">
              {formData.description}
            </div>

            <div className="pt-4 border-t border-[#F0E8DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] block mb-2">
                Required Skills &amp; Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(t => (
                  <span key={t} className="text-xs bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#DFD5C6] font-medium text-[#1C140E]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
