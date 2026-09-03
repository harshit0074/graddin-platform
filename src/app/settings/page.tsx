"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Bell, 
  Shield, 
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, role } = useAuth();
  const { toast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your platform settings have been updated successfully.",
      variant: "success",
    });
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed out",
      description: "You have been logged out of your session.",
      variant: "info",
    });
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
          PREFERENCES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E] mt-1">
          Account &amp; Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#72635A] mt-1">
          Manage your account credentials, notifications, and profile visibility.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0E8DD]">
            <User className="h-4 w-4 text-[#2C1B14]" />
            <h2 className="font-serif text-xl font-bold text-[#1C140E]">Account Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1">Email Address</label>
              <Input
                disabled
                value={user?.email || "student@campus.edu"}
                className="bg-[#FAF7F2]"
              />
              <span className="text-[11px] text-[#8C7A70] mt-1 block">Primary login and notification address.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C140E] mb-1">Current Role</label>
              <Input
                disabled
                value={role === 'student' ? 'Student Applicant' : role === 'company' ? 'Startup Recruiter' : role === 'admin' ? 'Super Admin' : 'Guest Visitor'}
                className="bg-[#FAF7F2] capitalize"
              />
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0E8DD]">
            <Bell className="h-4 w-4 text-[#2C1B14]" />
            <h2 className="font-serif text-xl font-bold text-[#1C140E]">Notification Preferences</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[#E8DFD3] hover:bg-[#FAF7F2] cursor-pointer">
              <div>
                <span className="font-bold text-[#1C140E] block">Application Status Alerts</span>
                <span className="text-[#72635A]">Instant notifications when an application is shortlisted or reviewed.</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-[#2C1B14]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-[#E8DFD3] hover:bg-[#FAF7F2] cursor-pointer">
              <div>
                <span className="font-bold text-[#1C140E] block">Weekly Curated Startup Digest</span>
                <span className="text-[#72635A]">Summary of new stealth and venture-backed openings matching your skills.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded accent-[#2C1B14]"
              />
            </label>
          </div>
        </div>

        {/* Privacy & Profile Visibility */}
        <div className="rounded-3xl border border-[#DFD5C6] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0E8DD]">
            <Shield className="h-4 w-4 text-[#2C1B14]" />
            <h2 className="font-serif text-xl font-bold text-[#1C140E]">Privacy &amp; Resume Visibility</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[#E8DFD3] hover:bg-[#FAF7F2] cursor-pointer">
              <div>
                <span className="font-bold text-[#1C140E] block">Public Candidate Discovery</span>
                <span className="text-[#72635A]">Allow verified startup founders to view your profile in talent search.</span>
              </div>
              <input
                type="checkbox"
                checked={profilePublic}
                onChange={(e) => setProfilePublic(e.target.checked)}
                className="h-4 w-4 rounded accent-[#2C1B14]"
              />
            </label>
          </div>
        </div>

        {/* Save and Session Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="default" onClick={handleSave} className="px-8">
            Save Preferences
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-200 text-red-700 hover:bg-red-50 gap-1.5 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
