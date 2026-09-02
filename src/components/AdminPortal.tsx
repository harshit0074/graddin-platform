'use client';

import React, { useState, useEffect } from 'react';
import { Company, Profile, Internship } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldAlert,
  Building2,
  Users,
  Briefcase,
  FileCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export function AdminPortal() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    unverifiedCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [usersList, setUsersList] = useState<Profile[]>([]);
  const [internshipsList, setInternshipsList] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, companiesRes, usersRes, internshipsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/companies'),
        fetch('/api/admin/users'),
        fetch('/api/internships'),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (companiesRes.ok) {
        const d = await companiesRes.json();
        setCompanies(d.companies || []);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsersList(d.users || []);
      }
      if (internshipsRes.ok) {
        const d = await internshipsRes.json();
        setInternshipsList(d.internships || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (companyId: string, currentStatus: boolean) => {
    setActionLoading(companyId);
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          is_verified: !currentStatus,
        }),
      });

      if (res.ok) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === companyId ? { ...c, is_verified: !currentStatus } : c))
        );
        setStats((prev) => ({
          ...prev,
          unverifiedCompanies: currentStatus ? prev.unverifiedCompanies + 1 : prev.unverifiedCompanies - 1,
        }));
      }
    } catch (err) {
      console.error('Failed to toggle verification:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInternship = async (id: string) => {
    if (!confirm('Admin action: permanently delete this internship?')) return;
    try {
      const res = await fetch(`/api/internships/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInternshipsList((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* GOD MODE HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-purple-950/40 to-zinc-900 border border-purple-800/40 backdrop-blur-md shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/40 gap-1.5 px-3 py-1 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            ADMIN GOD MODE
          </Badge>
          <span className="text-xs text-zinc-400 font-mono">GRADDIN Full Control Plane</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Super Admin Dashboard</h1>
        <p className="text-xs text-zinc-300 max-w-2xl">
          Verify companies by reviewing their provided LinkedIn links, monitor all registered students, and oversee platform internship activities in real time.
        </p>
      </div>

      {/* GOD MODE STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-zinc-800 bg-zinc-900/50 p-4 rounded-2xl">
          <div className="text-zinc-400 text-xs flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Students
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalStudents}</div>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 p-4 rounded-2xl">
          <div className="text-zinc-400 text-xs flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Total Companies
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalCompanies}</div>
        </Card>

        <Card className="border-amber-800/50 bg-amber-950/20 p-4 rounded-2xl">
          <div className="text-amber-400 text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Pending Verification
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2">{stats.unverifiedCompanies}</div>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 p-4 rounded-2xl">
          <div className="text-zinc-400 text-xs flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            Internships
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalInternships}</div>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 p-4 rounded-2xl">
          <div className="text-zinc-400 text-xs flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            Applications
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalApplications}</div>
        </Card>
      </div>

      {/* ADMIN TABS */}
      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="companies" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Company Verifications ({companies.length})
          </TabsTrigger>
          <TabsTrigger value="internships" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs">
            <Briefcase className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            All Internships ({internshipsList.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs">
            <Users className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Platform Users ({usersList.length})
          </TabsTrigger>
        </TabsList>

        {/* 1. COMPANY VERIFICATION TAB */}
        <TabsContent value="companies" className="pt-4">
          <Card className="border-zinc-800 bg-zinc-900/40 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-800">
              <CardTitle className="text-base font-bold text-white">
                Company Authentication & Verification Control
              </CardTitle>
              <p className="text-xs text-zinc-400">
                Review the company LinkedIn links below to verify legitimacy before enabling them to post internships.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-12 text-center text-zinc-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  <span className="text-xs">Loading companies...</span>
                </div>
              ) : companies.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">No companies registered yet.</div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {companies.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{comp.company_name}</span>
                          {comp.is_verified ? (
                            <Badge className="bg-emerald-950/80 text-emerald-400 border-emerald-800 text-[10px]">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-950/80 text-amber-400 border-amber-800 text-[10px]">
                              Pending Review
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-3">
                          <span>Email: {comp.email}</span>
                          {comp.linkedin_url && (
                            <a
                              href={comp.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline font-medium"
                            >
                              <span>Inspect LinkedIn URL</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {comp.website_url && (
                            <a
                              href={comp.website_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-white flex items-center gap-1 underline"
                            >
                              <span>Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <Button
                          size="sm"
                          disabled={actionLoading === comp.id}
                          onClick={() => handleToggleVerification(comp.id, comp.is_verified)}
                          className={`text-xs ${
                            comp.is_verified
                              ? 'bg-zinc-800 text-zinc-300 hover:bg-red-950 hover:text-red-300'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20'
                          }`}
                        >
                          {actionLoading === comp.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          ) : comp.is_verified ? (
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          {comp.is_verified ? 'Revoke Verification' : 'Approve & Verify'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. ALL INTERNSHIPS TAB */}
        <TabsContent value="internships" className="pt-4">
          <Card className="border-zinc-800 bg-zinc-900/40 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-800">
              <CardTitle className="text-base font-bold text-white">All Active Platform Postings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800/80">
                {internshipsList.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-sm text-white">{item.title}</div>
                      <div className="text-zinc-400 mt-0.5">
                        Company: {item.company?.company_name || item.company_id} • {item.location} • {item.stipend}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteInternship(item.id)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. PLATFORM USERS TAB */}
        <TabsContent value="students" className="pt-4">
          <Card className="border-zinc-800 bg-zinc-900/40 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-800">
              <CardTitle className="text-base font-bold text-white">Registered Student & Admin Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800/80">
                {usersList.map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {u.full_name || 'Anonymous User'}
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {u.role}
                        </Badge>
                      </div>
                      <div className="text-zinc-400 mt-0.5">
                        {u.email} • {u.education || 'No education provided'}
                      </div>
                      {u.skills && (
                        <div className="text-zinc-500 text-[11px] mt-1">Skills: {u.skills}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
