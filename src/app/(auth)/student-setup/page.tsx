"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  User, 
  Code, 
  Briefcase, 
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentSetupPage() {
  const router = useRouter();
  const { user, refreshUser, updateStudentProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.profile?.full_name || "",
    email: user?.profile?.email || "",
    password: "",
    avatarUrl: user?.profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
    headline: user?.profile?.headline || "",
    university: user?.profile?.university || "",
    degree: user?.profile?.degree || "",
    graduationYear: user?.profile?.graduation_year || "2026",
    location: user?.profile?.location || "",
    skills: user?.profile?.skills || "",
    interests: "AI Developer Tools, Full-Stack Development",
    experience: user?.profile?.experience || "",
    bio: user?.profile?.bio || "",
    portfolioUrl: user?.profile?.portfolio_url || "",
    githubUrl: user?.profile?.github_url || "",
    linkedinUrl: user?.profile?.linkedin_url || "",
    resumeText: user?.profile?.resume_text || "",
  });

  const steps = [
    { number: 1, title: "About you", icon: User },
    { number: 2, title: "Education", icon: GraduationCap },
    { number: 3, title: "Skills & interests", icon: Code },
    { number: 4, title: "Experience", icon: Briefcase },
    { number: 5, title: "Profile review", icon: Sparkles },
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!user) {
      if (!formData.email || !formData.password) {
        alert("Please provide an email and password in Step 1 to create your account.");
        setStep(1);
        return;
      }
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: 'student',
            fullName: formData.fullName,
            skills: formData.skills,
            education: formData.university ? `${formData.university} — ${formData.degree || ''} (Class of ${formData.graduationYear || '2026'})` : formData.degree,
            experience: formData.experience,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Failed to register account');
          return;
        }
        await refreshUser();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Error registering account');
        return;
      }
    } else {
      await updateStudentProfile({
        full_name: formData.fullName,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.university ? `${formData.university} — ${formData.degree || ''} (Class of ${formData.graduationYear || '2026'})` : formData.degree,
      });
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2C1B14', '#C99A6B', '#EADBCE']
    });

    router.push('/internships');
  };

  return (
    <div className="min-h-[88vh] max-w-3xl mx-auto px-4 py-12">
      {/* Step Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.number;
            const isCurrent = step === s.number;
            return (
              <div key={s.number} className="flex flex-col items-center flex-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? "bg-[#2C1B14] text-white" 
                    : isCurrent 
                    ? "bg-[#C99A6B] text-[#1C140E] ring-4 ring-[#EADBCE]" 
                    : "bg-[#EADBCE]/50 text-[#8C7A70]"
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-[11px] mt-2 font-medium hidden sm:block ${
                  isCurrent ? "text-[#1C140E] font-bold" : "text-[#8C7A70]"
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-[#EADBCE]/50 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#2C1B14] h-full transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-md">
        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">STEP 1 OF 5</span>
              <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">Let&apos;s start with the basics.</h2>
              <p className="text-xs text-[#72635A]">How should upcoming startup founders address you?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Full Name</label>
                <Input
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Email Address</label>
                <Input
                  type="email"
                  placeholder="alex@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Create Password</label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Profile Photo URL</label>
              <div className="flex items-center gap-4">
                <img
                  src={formData.avatarUrl}
                  alt="Avatar preview"
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#DFD5C6]"
                />
                <Input
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Headline</label>
              <Input
                placeholder="e.g. Aspiring Product Engineer | BITS Pilani '26"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Short Introduction / Bio</label>
              <Textarea
                rows={3}
                placeholder="Share your philosophy, what you like to build, or what makes you tick..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">STEP 2 OF 5</span>
              <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">Your education and campus.</h2>
              <p className="text-xs text-[#72635A]">Helps startups calibrate graduation timelines and term schedules.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">University / College</label>
              <Input
                placeholder="e.g. BITS Pilani, IIT Bombay, Stanford..."
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Degree &amp; Major</label>
                <Input
                  placeholder="e.g. B.E. Computer Science, B.Des..."
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Expected Graduation Year</label>
                <Input
                  placeholder="e.g. 2026 or 2027"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Location / Current City</label>
              <Input
                placeholder="e.g. Bangalore, India or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 3: Skills & Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">STEP 3 OF 5</span>
              <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">What do you build with?</h2>
              <p className="text-xs text-[#72635A]">These skills directly power your automated AI candidate match scores.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Key Skills (Comma-separated)</label>
              <Textarea
                rows={3}
                placeholder="React, Next.js, TypeScript, Figma, UI/UX, Python, WebSockets..."
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.skills.split(',').filter(Boolean).map((s, idx) => (
                  <span key={idx} className="text-xs bg-[#FAF7F2] text-[#2C1B14] px-2.5 py-1 rounded-full border border-[#DFD5C6] font-medium">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Startup Interests &amp; Domains</label>
              <Input
                placeholder="AI Agents, Design Systems, Robotics, Consumer Tech..."
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 4: Experience & Projects */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">STEP 4 OF 5</span>
              <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">Experience &amp; past projects.</h2>
              <p className="text-xs text-[#72635A]">Zero PDF uploads required. Describe what you&apos;ve shipped in plain text.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Projects &amp; Leadership Highlights</label>
              <Textarea
                rows={4}
                placeholder="Describe your proudest builds, hackathon wins, open source repos, or club responsibilities..."
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Executive Summary / Text Resume</label>
              <Textarea
                rows={3}
                placeholder="Paste key bullet points from your resume for our AI semantic matcher..."
                value={formData.resumeText}
                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 5: Links & Profile Preview */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">STEP 5 OF 5</span>
              <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1">Links &amp; final review.</h2>
              <p className="text-xs text-[#72635A]">Add links where founders can inspect your proof of work.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">LinkedIn Profile</label>
                <Input
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">GitHub Profile</label>
                <Input
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Portfolio / Site</label>
                <Input
                  placeholder="https://..."
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Live Profile Card Preview */}
            <div className="rounded-2xl border border-[#C99A6B]/40 bg-[#FAF7F2] p-6 text-left">
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={formData.avatarUrl}
                  alt="Preview"
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#DFD5C6]"
                />
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C140E]">{formData.fullName}</h3>
                  <p className="text-xs font-medium text-[#72635A]">{formData.headline}</p>
                  <p className="text-[11px] text-[#8C7A70]">{formData.university} · Class of {formData.graduationYear}</p>
                </div>
              </div>
              <p className="text-xs text-[#4A382F] leading-relaxed mb-3">&ldquo;{formData.bio}&rdquo;</p>
              <div className="flex flex-wrap gap-1">
                {formData.skills.split(',').slice(0, 5).map((s, i) => (
                  <span key={i} className="text-[10px] bg-white text-[#72635A] px-2 py-0.5 rounded-full border border-[#E8DFD3]">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-8 mt-6 border-t border-[#F0E8DD] flex items-center justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack} className="border-[#DFD5C6]">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button type="button" variant="default" onClick={handleNext}>
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" variant="caramel" onClick={handleComplete} className="px-8 font-bold">
              <span>Create my profile →</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
