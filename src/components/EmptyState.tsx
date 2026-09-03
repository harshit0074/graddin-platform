import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, FileText, Bell, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'applications' | 'applicants' | 'opportunities' | 'notifications' | 'search';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  type,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const configs = {
    applications: {
      icon: FileText,
      defaultTitle: "Your next opportunity could start here.",
      defaultDesc: "Browse opportunities at upcoming startups and start submitting applications.",
      defaultAction: "Browse Opportunities",
      defaultHref: "/internships",
    },
    applicants: {
      icon: Users,
      defaultTitle: "No candidates yet.",
      defaultDesc: "Once students apply to your internship posting, their AI-evaluated profiles will appear here.",
      defaultAction: "Share Opportunity",
      defaultHref: "/company/opportunities",
    },
    opportunities: {
      icon: Briefcase,
      defaultTitle: "No opportunities yet.",
      defaultDesc: "Create your first internship listing to start attracting ambitious students ready to build.",
      defaultAction: "Post an Opportunity",
      defaultHref: "/company/post",
    },
    notifications: {
      icon: Bell,
      defaultTitle: "You're all caught up.",
      defaultDesc: "We'll notify you when companies review your applications or new relevant roles are posted.",
      defaultAction: "Explore Roles",
      defaultHref: "/internships",
    },
    search: {
      icon: Search,
      defaultTitle: "No opportunities match your search.",
      defaultDesc: "Try adjusting your filters, clearing keywords, or exploring different engineering and design tags.",
      defaultAction: "Clear all filters",
      defaultHref: "/internships",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-[#DFD5C6] bg-white/50 my-6">
      <div className="h-16 w-16 rounded-2xl bg-[#EADBCE]/50 text-[#2C1B14] flex items-center justify-center mb-4 shadow-2xs">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl font-semibold text-[#1C140E] tracking-tight mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-[#72635A] max-w-md leading-relaxed mb-6">
        {description || config.defaultDesc}
      </p>
      {(actionText || config.defaultAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button variant="default">{actionText || config.defaultAction}</Button>
          </Link>
        ) : (
          <Button variant="default" onClick={onAction}>
            {actionText || config.defaultAction}
          </Button>
        )
      )}
    </div>
  );
}
