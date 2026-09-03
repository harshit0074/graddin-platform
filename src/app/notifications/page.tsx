"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  ArrowRight, 
  CheckCheck 
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead, role } = useAuth();

  const relevantNotifications = notifications.filter(n => 
    n.recipient_role === role || role === 'admin' || role === 'guest'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <UserCheck className="h-5 w-5 text-purple-700" />;
      case 'application':
        return <Sparkles className="h-5 w-5 text-amber-600" />;
      case 'opportunity_alert':
        return <Briefcase className="h-5 w-5 text-[#2C1B14]" />;
      default:
        return <Bell className="h-5 w-5 text-[#72635A]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
            ACTIVITY FEED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-1">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-[#72635A] mt-1">
            Real-time updates on your applications, recruiter actions, and recommended startup roles.
          </p>
        </div>

        {relevantNotifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markNotificationsAsRead}
            className="text-xs h-9 border-[#DFD5C6] gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {relevantNotifications.length > 0 ? (
        <div className="space-y-3">
          {relevantNotifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl border p-5 transition-all duration-150 flex items-start justify-between gap-4 ${
                !n.read 
                  ? "bg-white border-[#C99A6B]/50 shadow-xs" 
                  : "bg-white/60 border-[#E8DFD3]"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.read ? "bg-[#FAF7F2] border border-[#DFD5C6]" : "bg-[#F5EFEB]"
                }`}>
                  {getIcon(n.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold text-[#1C140E] ${!n.read ? "font-bold" : "font-medium"}`}>
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-[#2C1B14]" title="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-[#72635A] mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-[#A09388] mt-2 block">
                    {formatRelativeTime(n.created_at)}
                  </span>
                </div>
              </div>

              {n.action_url && (
                <Link href={n.action_url} className="shrink-0 self-center">
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    <span>View</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="notifications"
          actionHref="/internships"
        />
      )}
    </div>
  );
}
