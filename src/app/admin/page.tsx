"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company, Profile, Internship } from '@/lib/types';
import { isSuperAdminEmail } from '@/lib/constants';
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Check, 
  AlertCircle,
  Users,
  Search,
  Sparkles,
  Trash2,
  Crown,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function AdminPortalPage() {
  const { 
    companies: contextCompanies, 
    toggleCompanyVerification, 
    internships: contextInternships, 
    applications, 
    getStats,
    user 
  } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'companies' | 'internships' | 'users'>('companies');
  const [searchTerm, setSearchTerm] = useState("");
  const [liveStats, setLiveStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    unverifiedCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
  });
  const [liveCompanies, setLiveCompanies] = useState<Company[]>([]);
  const [liveUsers, setLiveUsers] = useState<Profile[]>([]);
  const [liveInternships, setLiveInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fallbackStats = getStats();

  const fetchLiveAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, companiesRes, usersRes, internshipsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/companies'),
        fetch('/api/admin/users'),
        fetch('/api/internships'),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.stats) setLiveStats(d.stats);
      }
      if (companiesRes.ok) {
        const d = await companiesRes.json();
        if (d.companies && d.companies.length > 0) setLiveCompanies(d.companies);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        if (d.users && d.users.length > 0) setLiveUsers(d.users);
      }
      if (internshipsRes.ok) {
        const d = await internshipsRes.json();
        if (d.internships && d.internships.length > 0) setLiveInternships(d.internships);
      }
    } catch {
      // Use fallback context data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAdminData();
  }, []);

  const displayCompanies = liveCompanies.length > 0 ? liveCompanies : contextCompanies;
  const displayInternships = liveInternships.length > 0 ? liveInternships : contextInternships;
  const displayStats = liveStats.totalCompanies > 0 ? liveStats : fallbackStats;

  const handleToggleVerification = async (companyId: string, currentStatus: boolean, companyName: string) => {
    setActionLoading(companyId);
    try {
      // Toggle in Supabase backend
      await fetch('/api/admin/companies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          is_verified: !currentStatus,
        }),
      });

      // Toggle in local context state
      toggleCompanyVerification(companyId);

      setLiveCompanies(prev =>
        prev.map(c => c.id === companyId ? { ...c, is_verified: !currentStatus } : c)
      );

      toast({
        title: !currentStatus ? "Company verified ✅" : "Verification revoked",
        description: !currentStatus 
          ? `${companyName} can now post unlimited internships with a verified badge.` 
          : `${companyName} verification has been set to pending.`,
        variant: !currentStatus ? "success" : "info",
      });
    } catch {
      toggleCompanyVerification(companyId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInternship = async (id: string, title: string) => {
    if (!confirm(`Admin action: permanently delete internship "${title}"?`)) return;
    setActionLoading(id);
    try {
      await fetch(`/api/internships/${id}`, { method: 'DELETE' });
      setLiveInternships(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Internship deleted",
        description: `"${title}" has been removed from the platform.`,
        variant: "destructive",
      });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: 'student' | 'admin', email: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      if (res.ok) {
        setLiveUsers(prev =>
          prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
        );
        toast({
          title: `Role updated to ${newRole}`,
          description: `${email} is now ${newRole}.`,
          variant: "success",
        });
      }
    } catch {
      toast({ title: "Role update failed", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCompanies = displayCompanies.filter(c => 
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredInternships = displayInternships.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.company?.company_name && i.company.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = liveUsers.filter(u =>
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Super Admin God Mode Banner */}
      <div className="rounded-3xl border-2 border-amber-400/60 bg-gradient-to-r from-[#2C1B14] via-[#3E271E] to-[#2C1B14] text-[#FAF7F2] p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Crown className="h-4 w-4 text-amber-400" />
            <span>Super Admin God Mode Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Platform Verification &amp; Oversight Console
          </h1>
          <p className="text-xs sm:text-sm text-[#EADBCE]/80 max-w-2xl leading-relaxed">
            Inspect startup official LinkedIn URLs, grant instant marketplace verification, manage postings, and oversee platform users with full administrative authority.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10 text-xs shrink-0">
          <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block mb-1">
            Verification Queue
          </span>
          <span className="text-[#EADBCE]">
            <strong className="text-white text-xl font-serif block">{displayStats.unverifiedCompanies}</strong>
            companies pending verification
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <GraduationCap className="h-4 w-4 text-[#2C1B14]" />
            <span>Total Students</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{displayStats.totalStudents}</div>
        </div>

        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <Building2 className="h-4 w-4 text-[#2C1B14]" />
            <span>Startups</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{displayStats.totalCompanies}</div>
        </div>

        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-800 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <span>Pending Review</span>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-900">{displayStats.unverifiedCompanies}</div>
        </div>

        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <Briefcase className="h-4 w-4 text-[#2C1B14]" />
            <span>Internships</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{displayStats.totalInternships}</div>
        </div>

        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <FileText className="h-4 w-4 text-[#2C1B14]" />
            <span>Applications</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{displayStats.totalApplications}</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DFD5C6] pb-4">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'companies'
              ? "bg-[#2C1B14] text-[#FAF7F2] shadow-sm"
              : "bg-white text-[#72635A] border border-[#DFD5C6] hover:bg-[#FAF7F2]"
          }`}
        >
          <Building2 className="h-4 w-4 text-amber-400" />
          <span>Startup Verifications ({displayCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('internships')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'internships'
              ? "bg-[#2C1B14] text-[#FAF7F2] shadow-sm"
              : "bg-white text-[#72635A] border border-[#DFD5C6] hover:bg-[#FAF7F2]"
          }`}
        >
          <Briefcase className="h-4 w-4 text-amber-400" />
          <span>All Internships ({displayInternships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? "bg-[#2C1B14] text-[#FAF7F2] shadow-sm"
              : "bg-white text-[#72635A] border border-[#DFD5C6] hover:bg-[#FAF7F2]"
          }`}
        >
          <Users className="h-4 w-4 text-amber-400" />
          <span>Platform Users ({liveUsers.length || displayStats.totalStudents})</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A70]" />
        <input
          type="text"
          placeholder="Search listings, startups, users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-[#DFD5C6] bg-white focus:outline-none focus:border-[#2C1B14] shadow-2xs"
        />
      </div>

      {/* 1. COMPANY VERIFICATION TAB */}
      {activeTab === 'companies' && (
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              Registered Startups &amp; LinkedIn Verification
            </h2>
            <p className="text-xs text-[#72635A]">
              Review the official LinkedIn company page before authorizing marketplace posting privileges.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFD3] text-[#8C7A70] uppercase tracking-wider font-bold">
                  <th className="pb-3 px-2">Startup</th>
                  <th className="pb-3 px-2">Industry</th>
                  <th className="pb-3 px-2">Official LinkedIn Link</th>
                  <th className="pb-3 px-2">Website</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DD]">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-2 font-bold text-[#1C140E] flex items-center gap-2">
                      {c.logo_url ? (
                        <img src={c.logo_url} alt={c.company_name} className="h-8 w-8 rounded-lg object-cover border border-[#DFD5C6]" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-[#2C1B14] text-white flex items-center justify-center font-bold text-xs">
                          {c.company_name[0]}
                        </div>
                      )}
                      <span>{c.company_name}</span>
                    </td>

                    <td className="py-4 px-2 text-[#72635A]">
                      {c.industry || "Technology"}
                    </td>

                    <td className="py-4 px-2">
                      {c.linkedin_url ? (
                        <a
                          href={c.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#0A66C2] font-semibold hover:underline"
                        >
                          <span>Inspect LinkedIn</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-red-500">Missing link</span>
                      )}
                    </td>

                    <td className="py-4 px-2 text-[#72635A]">
                      {c.website_url ? (
                        <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          <span>{c.website_url.replace('https://', '')}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : '—'}
                    </td>

                    <td className="py-4 px-2">
                      {c.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <Check className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-2 text-right">
                      <Button
                        variant={c.is_verified ? "outline" : "default"}
                        size="sm"
                        disabled={actionLoading === c.id}
                        onClick={() => handleToggleVerification(c.id, c.is_verified, c.company_name)}
                        className={`text-xs h-8 px-3 ${
                          c.is_verified 
                            ? "border-[#DFD5C6] text-stone-600 hover:text-red-600 hover:bg-red-50" 
                            : "bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                        }`}
                      >
                        {actionLoading === c.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : c.is_verified ? (
                          "Revoke Verification"
                        ) : (
                          "Approve & Verify ✅"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ALL INTERNSHIPS TAB */}
      {activeTab === 'internships' && (
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              All Platform Internship Postings
            </h2>
            <p className="text-xs text-[#72635A]">
              Oversee and manage active opportunities across all registered startups.
            </p>
          </div>

          <div className="divide-y divide-[#F0E8DD]">
            {filteredInternships.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-serif font-bold text-base text-[#1C140E]">{item.title}</div>
                  <div className="text-xs text-[#72635A] mt-0.5">
                    {item.company?.company_name || 'Startup'} • {item.location} • {item.stipend} • Posted {formatRelativeTime(item.created_at)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`/internships/${item.id}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="text-xs h-8 border-[#DFD5C6]">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      <span>View</span>
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={actionLoading === item.id}
                    onClick={() => handleDeleteInternship(item.id, item.title)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PLATFORM USERS TAB */}
      {activeTab === 'users' && (
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              Platform Users &amp; Admin Privileges
            </h2>
            <p className="text-xs text-[#72635A]">
              Users with elevated administrative roles and registered students.
            </p>
          </div>

          <div className="divide-y divide-[#F0E8DD]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isSuperAdmin = isSuperAdminEmail(u.email);
                const isAdmin = u.role === 'admin' || isSuperAdmin;
                return (
                  <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-sm text-[#1C140E] flex items-center gap-2">
                        <span>{u.full_name || 'User'}</span>
                        {isSuperAdmin ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            <Crown className="w-3 h-3 text-amber-600" />
                            Super Admin (Permanent)
                          </span>
                        ) : isAdmin ? (
                          <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-stone-100 text-stone-600 border border-stone-200 text-[10px] px-2 py-0.5 rounded-full">
                            Student
                          </span>
                        )}
                      </div>
                      <div className="text-[#72635A] mt-0.5">
                        <span className="font-mono text-[#1C140E]">{u.email}</span> • {u.education || 'Student candidate'}
                      </div>
                    </div>

                    {!isSuperAdmin && (
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === u.id}
                          onClick={() => handleToggleUserRole(u.id, u.role as any, u.email || "")}
                          className="text-xs h-8 border-[#DFD5C6]"
                        >
                          {actionLoading === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.role === 'admin' ? (
                            'Revoke Admin'
                          ) : (
                            'Make Admin'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-[#72635A]">
                No user profiles loaded yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
