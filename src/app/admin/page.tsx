"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Check, 
  X, 
  AlertCircle,
  Users,
  Search,
  Sparkles
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

import { useRouter } from 'next/navigation';

export default function AdminPortalPage() {
  const { user, role, isLoading, companies, toggleCompanyVerification, internships, applications, getStats, refreshData } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    if (!isLoading && role !== 'admin') {
      router.push('/login');
    }
  }, [isLoading, role, router]);

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const stats = getStats();

  const handleToggle = (companyId: string, currentStatus: boolean, companyName: string) => {
    toggleCompanyVerification(companyId);
    toast({
      title: !currentStatus ? "Company verified ✅" : "Verification revoked",
      description: !currentStatus 
        ? `${companyName} can now post unlimited internships with a verified badge.` 
        : `${companyName} verification has been set to pending.`,
      variant: !currentStatus ? "success" : "info",
    });
  };

  const filteredCompanies = companies.filter(c => 
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* God Mode Banner */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/50 to-[#FAF7F2] p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900 text-amber-100 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <span>Admin God Mode Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950">
            Platform Verification &amp; Oversight Console
          </h1>
          <p className="text-xs sm:text-sm text-amber-900 max-w-2xl leading-relaxed">
            Inspect startup official LinkedIn URLs, grant instant marketplace verification, and monitor platform health across students, startups, and applications.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200 text-xs shrink-0">
          <span className="font-bold text-amber-950 block mb-1">Queue Status</span>
          <span className="text-amber-800">
            <strong className="text-amber-950 text-base">{stats.unverifiedCompanies}</strong> companies awaiting verification
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
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{stats.totalStudents}</div>
        </div>

        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <Building2 className="h-4 w-4 text-[#2C1B14]" />
            <span>Startups</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{stats.totalCompanies}</div>
        </div>

        <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-800 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <span>Pending Review</span>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-900">{stats.unverifiedCompanies}</div>
        </div>

        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <Briefcase className="h-4 w-4 text-[#2C1B14]" />
            <span>Internships</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{stats.totalInternships}</div>
        </div>

        <div className="rounded-2xl border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C7A70] mb-2">
            <FileText className="h-4 w-4 text-[#2C1B14]" />
            <span>Applications</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C140E]">{stats.totalApplications}</div>
        </div>
      </div>

      {/* Company Verification Table (Requirement #4 & #7) */}
      <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">
              Registered Startups &amp; LinkedIn Verification
            </h2>
            <p className="text-xs text-[#72635A]">
              Click LinkedIn URLs to inspect official company profiles before authorizing marketplace publishing.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#DFD5C6] bg-[#FAF7F2] focus:outline-none focus:border-[#2C1B14]"
            />
          </div>
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
                      onClick={() => handleToggle(c.id, c.is_verified, c.company_name)}
                      className={`text-xs h-8 px-3 ${
                        c.is_verified 
                          ? "border-[#DFD5C6] text-stone-600 hover:text-red-600 hover:bg-red-50" 
                          : "bg-emerald-800 hover:bg-emerald-900 text-white"
                      }`}
                    >
                      {c.is_verified ? "Revoke Verification" : "Approve & Verify ✅"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
