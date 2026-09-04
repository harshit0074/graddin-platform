"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

import { useRouter } from 'next/navigation';

export default function MyOpportunitiesPage() {
  const router = useRouter();
  const { user, role, isLoading, internships, updateInternship, deleteInternship } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isLoading && role !== 'company') {
      router.push('/login');
    }
  }, [isLoading, role, router]);

  const currentCompany = user?.company;
  const companyInternships = currentCompany 
    ? internships.filter(i => i.company_id === user?.id || i.company_id === currentCompany.id)
    : [];

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateInternship(id, { is_active: !currentStatus });
    toast({
      title: !currentStatus ? "Opportunity reopened" : "Opportunity closed",
      description: !currentStatus ? "Students can now apply to this position." : "This position is now closed to new applications.",
      variant: "info",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      deleteInternship(id);
      toast({
        title: "Opportunity deleted",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
            STARTUP PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-1">
            My Posted Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-[#72635A] mt-1">
            Manage your active and closed internship openings, candidate pipelines, and deadlines.
          </p>
        </div>

        <Link href="/company/post">
          <Button variant="default" size="sm" className="h-11 px-5 text-xs font-semibold gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Post New Opportunity</span>
          </Button>
        </Link>
      </div>

      {companyInternships.length > 0 ? (
        <div className="space-y-4">
          {companyInternships.map((internship) => (
            <div
              key={internship.id}
              className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F0E8DD]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      internship.is_active 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}>
                      {internship.is_active ? "Active & Accepting" : "Closed"}
                    </span>
                    <span className="text-xs text-[#8C7A70]">·</span>
                    <span className="text-xs text-[#8C7A70]">
                      Posted {formatRelativeTime(internship.created_at)}
                    </span>
                    {internship.department && (
                      <>
                        <span className="text-xs text-[#8C7A70]">·</span>
                        <span className="text-xs text-[#8C7A70]">{internship.department}</span>
                      </>
                    )}
                  </div>

                  <Link href={`/company/opportunities/${internship.id}`}>
                    <h2 className="font-serif text-2xl font-bold text-[#1C140E] hover:text-[#2C1B14] transition-colors">
                      {internship.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#72635A]">
                    <span>{internship.location}</span>
                    <span>•</span>
                    <span>{internship.duration}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#1C140E]">{internship.stipend}</span>
                    <span>•</span>
                    <span>Deadline: {internship.application_deadline || "Rolling"}</span>
                  </div>
                </div>

                {/* Quick Applicant Counter Widget */}
                <div className="flex items-center gap-6 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE] shrink-0">
                  <div className="text-center">
                    <div className="font-serif text-3xl font-bold text-[#1C140E]">
                      {internship.applicant_count || 0}
                    </div>
                    <span className="text-[11px] text-[#72635A] uppercase tracking-wider font-semibold">
                      Applicants
                    </span>
                  </div>

                  <Link href={`/company/opportunities/${internship.id}`}>
                    <Button variant="default" size="sm" className="text-xs h-9">
                      <span>View Pipeline</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/internships/${internship.id}`}
                    target="_blank"
                    className="text-[#72635A] hover:text-[#1C140E] font-medium flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(internship.id, internship.is_active)}
                    className="text-xs h-8 border-[#DFD5C6]"
                  >
                    {internship.is_active ? "Close Opportunity" : "Reopen Opportunity"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(internship.id)}
                    className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="opportunities"
          actionHref="/company/post"
        />
      )}
    </div>
  );
}
