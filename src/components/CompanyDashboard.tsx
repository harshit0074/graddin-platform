'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Internship, Application } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  Users,
  BrainCircuit,
  Sparkles,
  ExternalLink,
  Trash2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Check,
  X,
  ChevronRight,
  User,
} from 'lucide-react';

export function CompanyDashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // New Internship Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [roleType, setRoleType] = useState('Full-time Internship');
  const [duration, setDuration] = useState('3 Months');
  const [stipend, setStipend] = useState('₹15,000 - ₹25,000 / month');
  const [location, setLocation] = useState('Remote');

  const isVerified = user?.company?.is_verified ?? false;

  const fetchCompanyInternships = useCallback(async () => {
    if (!user?.id) return;
    setLoadingInternships(true);
    try {
      const res = await fetch(`/api/internships?company_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setInternships(data.internships || []);
        if (data.internships?.length > 0 && !selectedInternship) {
          setSelectedInternship(data.internships[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load company internships:', err);
    } finally {
      setLoadingInternships(false);
    }
  }, [user?.id, selectedInternship]);

  const fetchApplicants = useCallback(async (internshipId: string) => {
    setLoadingApplicants(true);
    try {
      const res = await fetch(`/api/applications?internship_id=${internshipId}`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyInternships();
  }, [fetchCompanyInternships]);

  useEffect(() => {
    if (selectedInternship) {
      fetchApplicants(selectedInternship.id);
    }
  }, [selectedInternship, fetchApplicants]);

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    setPostError(null);

    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          requirements,
          role_type: roleType,
          duration,
          stipend,
          location,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create internship.');
      }

      setIsPostModalOpen(false);
      setTitle('');
      setDescription('');
      setRequirements('');
      await fetchCompanyInternships();
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : 'Error creating posting');
    } finally {
      setPostLoading(false);
    }
  };

  const handleDeleteInternship = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this internship posting?')) return;

    try {
      const res = await fetch(`/api/internships/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedInternship?.id === id) {
          setSelectedInternship(null);
          setApplicants([]);
        }
        await fetchCompanyInternships();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateStatus = async (appId: string, status: 'shortlisted' | 'selected' | 'rejected') => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setApplicants((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status } : a))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* VERIFICATION STATUS NOTICE */}
      {!isVerified ? (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-amber-300">Account Verification in Progress</div>
              <p className="text-xs text-amber-400/90 mt-0.5">
                Our admins review registered companies via your provided LinkedIn page ({user?.company?.linkedin_url || 'provided URL'}). Once verified, internship posting is instantly unlocked.
              </p>
            </div>
          </div>
          <Badge className="bg-amber-900/60 text-amber-300 border-amber-700 shrink-0 text-xs">
            Pending Admin Review
          </Badge>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Verified Partner:</strong> {user?.company?.company_name} is authenticated and eligible to post unlimited internships.
            </span>
          </div>
          <Badge className="bg-emerald-900/60 text-emerald-300 border-emerald-700 text-[10px]">
            Verified
          </Badge>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {user?.company?.company_name || 'Company'} Recruiter Portal
          </h1>
          <p className="text-sm text-zinc-400">
            Manage your internship openings and review AI-ranked candidate matches.
          </p>
        </div>

        <Button
          onClick={() => setIsPostModalOpen(true)}
          disabled={!isVerified}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium rounded-lg shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Post New Internship
        </Button>
      </div>

      {/* SPLIT SCREEN LAYOUT: POSTINGS ON LEFT, APPLICANTS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: INTERNSHIPS LIST */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Active Listings ({internships.length})
            </h2>
          </div>

          {loadingInternships ? (
            <div className="py-12 text-center text-zinc-500 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-xs">Loading postings...</span>
            </div>
          ) : internships.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-2">
              <Building2 className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No internships posted yet.</p>
              {isVerified && (
                <Button
                  size="sm"
                  onClick={() => setIsPostModalOpen(true)}
                  className="bg-zinc-800 text-zinc-200 text-xs mt-2"
                >
                  Create your first opening
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {internships.map((item) => {
                const isSelected = selectedInternship?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedInternship(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                        : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-indigo-400" />
                            {item.location || 'Remote'}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">{item.stipend}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteInternship(item.id, e)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI-RANKED APPLICANTS FOR SELECTED OPENING */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>AI-Ranked Candidates</span>
              {selectedInternship && (
                <span className="text-xs text-zinc-500 font-normal lowercase">
                  for {selectedInternship.title}
                </span>
              )}
            </h2>

            {applicants.length > 0 && (
              <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs">
                {applicants.length} Applicants
              </Badge>
            )}
          </div>

          {!selectedInternship ? (
            <div className="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-950/40 text-zinc-500 text-xs">
              Select an internship from the left to inspect applicant match rankings.
            </div>
          ) : loadingApplicants ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Fetching and ranking candidate profiles...</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-2">
              <Users className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-semibold text-zinc-300">No applicants yet</h4>
              <p className="text-xs text-zinc-500">
                When students apply, Graddin AI ranks them automatically and computes detailed evaluation feedback.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {applicants.map((app, index) => {
                const matchScore = app.match_score ?? 50;
                return (
                  <Card
                    key={app.id}
                    className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-2xl overflow-hidden backdrop-blur-sm transition-all"
                  >
                    <CardHeader className="pb-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-indigo-300">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base font-bold text-white">
                                {app.student?.full_name || 'Anonymous Student'}
                              </CardTitle>
                              <span className="text-xs text-zinc-400">({app.student?.email})</span>
                            </div>
                            <div className="text-xs text-zinc-400 mt-0.5">
                              {app.student?.education || 'Education not specified'}
                            </div>
                          </div>
                        </div>

                        {/* AI MATCH SCORE HIGHLIGHT */}
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-600/50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/10">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{matchScore}% Match</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0 text-xs">
                      {/* CANDIDATE SKILLS */}
                      {app.student?.skills && (
                        <div>
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                            Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {app.student.skills.split(',').map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[10px]"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CANDIDATE EXPERIENCE */}
                      {app.student?.experience && (
                        <div className="text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
                          <strong className="text-zinc-300 block mb-0.5">Experience & Projects:</strong>
                          {app.student.experience}
                        </div>
                      )}

                      {/* AI FEEDBACK TO RECRUITER */}
                      {app.ai_feedback && (
                        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
                          <span className="font-semibold text-indigo-400 flex items-center gap-1 mb-1">
                            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                            AI Recruiter Insight:
                          </span>
                          <p className="text-zinc-300 leading-relaxed">{app.ai_feedback}</p>
                        </div>
                      )}

                      {/* COVER NOTE */}
                      {app.cover_note && (
                        <div className="text-zinc-400 italic bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                          &ldquo;{app.cover_note}&rdquo;
                        </div>
                      )}

                      {/* RECRUITER ACTIONS */}
                      <div className="pt-2 flex items-center justify-between border-t border-zinc-800/60">
                        <div className="text-[11px] text-zinc-500">
                          Status:{' '}
                          <span className="font-semibold uppercase text-zinc-300">
                            {app.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                            className="border-indigo-800/80 bg-indigo-950/30 text-indigo-300 hover:bg-indigo-900/50 text-xs h-7"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, 'selected')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Select Candidate
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                            className="text-zinc-500 hover:text-red-400 text-xs h-7"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CREATE INTERNSHIP DIALOG */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="sm:max-w-xl bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Post an Internship Opening</DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Students will apply directly. Candidates will be ranked automatically using AI matching.
            </DialogDescription>
          </DialogHeader>

          {postError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{postError}</span>
            </div>
          )}

          <form onSubmit={handleCreateInternship} className="space-y-4 pt-1 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="post-title">Internship Title</Label>
              <Input
                id="post-title"
                placeholder="e.g. Frontend Engineering Intern (React / Next.js)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="post-location">Location</Label>
                <Input
                  id="post-location"
                  placeholder="e.g. Remote / Bangalore / Hybrid"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-stipend">Stipend</Label>
                <Input
                  id="post-stipend"
                  placeholder="e.g. ₹20,000 / month"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="post-duration">Duration</Label>
                <Input
                  id="post-duration"
                  placeholder="e.g. 3 Months / 6 Months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-roleType">Role Type</Label>
                <Input
                  id="post-roleType"
                  placeholder="e.g. Full-time Internship / Part-time"
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post-requirements">Required Skills (Crucial for AI Matching)</Label>
              <Input
                id="post-requirements"
                placeholder="e.g. React, Next.js, TypeScript, Tailwind CSS, REST APIs"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post-description">Role Description & Responsibilities</Label>
              <Textarea
                id="post-description"
                rows={4}
                placeholder="Describe what the intern will be building and learning during their tenure..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPostModalOpen(false)}
                className="text-zinc-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={postLoading}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium"
              >
                {postLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Publish Internship
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
