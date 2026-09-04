"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Building2, ShieldCheck, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StartupSetupPage() {
  const router = useRouter();
  const { user, refreshUser, updateCompanyProfile } = useAuth();

  const [formData, setFormData] = useState({
    companyName: user?.company?.company_name || "",
    email: user?.company?.email || "",
    password: "",
    linkedinUrl: user?.company?.linkedin_url || "",
    websiteUrl: user?.company?.website_url || "",
    logoUrl: user?.company?.logo_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    industry: user?.company?.industry || "",
    location: user?.company?.location || "",
    companySize: user?.company?.company_size || "1-10 people",
    foundedYear: user?.company?.founded_year || "2024",
    about: user?.company?.about || "",
    mission: user?.company?.mission || "",
    founders: "",
  });

  const handleComplete = async () => {
    if (!user) {
      if (!formData.email || !formData.password || !formData.companyName) {
        alert("Please provide company name, work email, and password to register.");
        return;
      }
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: 'company',
            companyName: formData.companyName,
            websiteUrl: formData.websiteUrl,
            linkedinUrl: formData.linkedinUrl,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Failed to register company account');
          return;
        }
        await refreshUser();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Error registering company');
        return;
      }
    } else {
      updateCompanyProfile({
        company_name: formData.companyName,
        email: formData.email,
        linkedin_url: formData.linkedinUrl,
        website_url: formData.websiteUrl,
        logo_url: formData.logoUrl,
        industry: formData.industry,
        location: formData.location,
        company_size: formData.companySize,
        founded_year: formData.foundedYear,
        about: formData.about,
        mission: formData.mission,
      });
    }

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2C1B14', '#C99A6B', '#EADBCE']
    });

    router.push('/company/dashboard');
  };

  return (
    <div className="min-h-[88vh] max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">STARTUP ONBOARDING</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-1">
          Tell ambitious students about your startup.
        </h1>
        <p className="text-xs sm:text-sm text-[#72635A] max-w-md mx-auto mt-1">
          Complete your profile to build credibility and attract students who want to build real products.
        </p>
      </div>

      <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-md space-y-6">
        {/* Verification Highlight */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Official LinkedIn Verification Required</span>
            Providing your valid LinkedIn company page allows our moderation team to verify your startup within 24 hours, unlocking unlimited internship postings.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Startup Name</label>
            <Input
              placeholder="e.g. Acme AI"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Official Work Email</label>
            <Input
              type="email"
              placeholder="founder@acme.ai"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {!user && (
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Account Password</label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">LinkedIn Company URL</label>
            <Input
              placeholder="https://linkedin.com/company/..."
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Official Website</label>
            <Input
              placeholder="https://..."
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Industry</label>
            <Input
              placeholder="e.g. AI / DevTools, FinTech"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Team Size</label>
            <Input
              placeholder="e.g. 5-15 people"
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Founded Year</label>
            <Input
              placeholder="e.g. 2024"
              value={formData.foundedYear}
              onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">HQ &amp; Work Model</label>
          <Input
            placeholder="e.g. San Francisco, CA & Remote"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">About the Startup (What are you building?)</label>
          <Textarea
            rows={3}
            placeholder="Explain your core product in plain language..."
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Company Mission</label>
          <Input
            placeholder="Why does your company exist? What comes next?"
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
          />
        </div>

        <div className="pt-4 border-t border-[#F0E8DD] flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#DFD5C6]">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </Button>
          <Button type="button" variant="default" onClick={handleComplete} className="px-8 font-semibold">
            <span>Create startup profile →</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
