'use client';

import React, { useState, useEffect } from 'react';
import { Application } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  User,
  Sparkles,
  MapPin,
  Clock,
  Banknote,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Check,
  Building2,
  BrainCircuit,
} from 'lucide-react';

interface StudentDashboardProps {
  initialTab?: 'applications' | 'profile';
}

export function StudentDashboard({ initialTab = 'applications' }: StudentDashboardProps) {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<'applications' | 'profile'>(initialTab);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Profile form states
  const [fullName, setFullName] = useState(user?.profile?.full_name || '');
  const [skills, setSkills] = useState(user?.profile?.skills || '');
  const [education, setEducation] = useState(user?.profile?.education || '');
  const [experience, setExperience] = useState(user?.profile?.experience || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          skills,
          education,
          experience,
        }),
      });

      if (res.ok) {
        setProfileSuccess(true);
        await refreshUser();
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selected':
        return (
          <Badge className="bg-emerald-950/80 text-emerald-400 border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Selected
          </Badge>
        );
      case 'shortlisted':
        return (
          <Badge className="bg-indigo-950/80 text-indigo-300 border-indigo-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Shortlisted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-950/80 text-red-400 border-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Not Selected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Under Review
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Track your internship applications and manage your AI-evaluated profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300">
            {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
          </Badge>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'applications' | 'profile')} className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="applications" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2 text-indigo-400" />
            My Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2 text-indigo-400" />
            Edit Profile / Skills
          </TabsTrigger>
        </TabsList>

        {/* APPLICATIONS TAB */}
        <TabsContent value="applications" className="pt-4">
          {loadingApps ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span>Loading applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-200">No applications yet</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Explore the latest internships on GRADDIN and apply. Your candidate match score will be calculated in real-time.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 transition-all rounded-2xl overflow-hidden backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{app.internship?.company?.company_name || 'Partner Company'}</span>
                          <span>•</span>
                          <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                        <CardTitle className="text-lg font-bold text-white">
                          {app.internship?.title}
                        </CardTitle>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* MATCH SCORE PILL */}
                        {app.match_score !== null && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{app.match_score}% AI Match</span>
                          </div>
                        )}
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="flex flex-wrap gap-2 text-zinc-400">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/40">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{app.internship?.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/40">
                        <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{app.internship?.stipend || 'Competitive'}</span>
                      </div>
                    </div>

                    {/* AI FEEDBACK SNIPPET */}
                    {app.ai_feedback && (
                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-zinc-300">
                        <span className="font-semibold text-indigo-400 block mb-1">AI Evaluation Analysis:</span>
                        <p className="text-zinc-400">{app.ai_feedback}</p>
                      </div>
                    )}

                    {/* COVER NOTE */}
                    {app.cover_note && (
                      <div className="text-zinc-400 italic bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                        &ldquo;{app.cover_note}&rdquo;
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="pt-4">
          <Card className="border-zinc-800 bg-zinc-900/40 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Student Profile & Credentials</CardTitle>
              <p className="text-xs text-zinc-400">
                This information is evaluated by the AI Matching Algorithm whenever you apply for roles. No file uploads needed!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs">Full Name</Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="skills" className="text-xs">
                    Technical & Domain Skills (Comma separated)
                  </Label>
                  <Input
                    id="skills"
                    placeholder="e.g. React, Next.js, Python, TypeScript, Figma, UI/UX"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="education" className="text-xs">Education & University</Label>
                  <Input
                    id="education"
                    placeholder="e.g. B.Tech Computer Engineering, Thapar University"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="experience" className="text-xs">
                    Experience / Projects / Achievements
                  </Label>
                  <Textarea
                    id="experience"
                    rows={4}
                    placeholder="Describe notable projects, hackathons, previous internships, or GitHub links..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs"
                  />
                </div>

                {profileSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Profile saved successfully!</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
