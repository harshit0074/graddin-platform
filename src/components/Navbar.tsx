"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  Plus, 
  ArrowUpRight, 
  LogOut,
  SlidersHorizontal,
  Crown
} from 'lucide-react';
import { isSuperAdminEmail } from '@/lib/constants';

export function Navbar() {
  const { user, role, switchRole, notifications, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGodModeAdmin = (user?.email && isSuperAdminEmail(user.email)) || role === 'admin' || user?.role === 'admin';
  const unreadNotifs = notifications.filter(n => !n.read && (n.recipient_role === role || role === 'admin')).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DFD3] bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
      {/* Top Banner for Role Switcher / Admin indicator */}
      <div className="bg-[#2C1B14] text-[#FAF7F2] px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#EADBCE]/80 font-medium">Viewing as:</span>
            <span className="font-semibold text-amber-200 uppercase tracking-wider">
              {role === 'guest' ? 'Public Visitor' : role}
            </span>
            {isGodModeAdmin && (
              <span className="ml-1 inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-400/30">
                <Crown className="w-3 h-3 text-amber-300" /> Super Admin Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#EADBCE]/60 hidden sm:inline mr-1 text-[11px]">Quick Switch:</span>
            <button
              onClick={() => switchRole('student')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${role === 'student' ? 'bg-[#FAF7F2] text-[#2C1B14]' : 'text-[#EADBCE] hover:text-white hover:bg-white/10'}`}
            >
              Student
            </button>
            <button
              onClick={() => switchRole('company')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${role === 'company' ? 'bg-[#FAF7F2] text-[#2C1B14]' : 'text-[#EADBCE] hover:text-white hover:bg-white/10'}`}
            >
              Startup
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${role === 'admin' ? 'bg-amber-300 text-[#1C140E] font-bold' : 'text-amber-200/80 hover:text-amber-200 hover:bg-white/10'}`}
            >
              Admin ⚡
            </button>
            <button
              onClick={() => switchRole('guest')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${role === 'guest' ? 'bg-[#FAF7F2] text-[#2C1B14]' : 'text-[#EADBCE]/70 hover:text-white'}`}
            >
              Public
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-[#2C1B14] text-[#FAF7F2] flex items-center justify-center font-serif text-xl font-bold shadow-xs transition-transform group-hover:scale-105">
            G
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1C140E]">
              GRADD<span className="text-[#C99A6B]">In</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#72635A] -mt-1 font-semibold">
              Internships
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#72635A]">
          {/* Public Links */}
          {role === 'guest' && (
            <>
              <Link 
                href="/internships" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/internships' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Internships
              </Link>
              <Link href="/#about" className="transition-colors hover:text-[#1C140E]">
                About us
              </Link>
              <Link href="/#faq" className="transition-colors hover:text-[#1C140E]">
                FAQ
              </Link>
            </>
          )}

          {/* Student Links */}
          {role === 'student' && (
            <>
              <Link 
                href="/internships" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/internships' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Opportunities
              </Link>
              <Link 
                href="/student/applications" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/student/applications' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                My Applications
              </Link>
              <Link 
                href="/student/profile" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/student/profile' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Profile
              </Link>
            </>
          )}

          {/* Company Links */}
          {role === 'company' && (
            <>
              <Link 
                href="/company/dashboard" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/dashboard' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/company/opportunities" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/opportunities' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                My Posts
              </Link>
              <Link 
                href="/company/candidates" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/candidates' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Candidates (AI Ranked)
              </Link>
              <Link 
                href="/company/profile" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/profile' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Startup Page
              </Link>
            </>
          )}

          {/* Admin Links */}
          {(role === 'admin' || isGodModeAdmin) && (
            <>
              <Link 
                href="/admin" 
                className={`flex items-center gap-1.5 text-[#2C1B14] font-semibold px-3 py-1 rounded-full bg-amber-100 border border-amber-200 hover:bg-amber-200 transition-colors`}
              >
                <ShieldCheck className="h-4 w-4 text-amber-700" />
                <span>God-Mode Portal</span>
              </Link>
              <Link href="/internships" className="transition-colors hover:text-[#1C140E]">
                All Openings
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions Header */}
        <div className="hidden md:flex items-center gap-3">
          {/* Notifications button if logged in */}
          {role !== 'guest' && (
            <Link 
              href="/notifications"
              className="relative p-2 rounded-full text-[#72635A] hover:bg-[#EADBCE]/50 hover:text-[#1C140E] transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2C1B14]" />
              )}
            </Link>
          )}

          {/* Guest Actions */}
          {role === 'guest' && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm" className="group">
                  <span>Join GRADDIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </>
          )}

          {/* Student Actions */}
          {role === 'student' && (
            <>
              <Link href="/internships">
                <Button variant="default" size="sm">
                  Browse Opportunities
                </Button>
              </Link>
              <Link href="/student/profile" className="flex items-center gap-2 pl-2">
                <img
                  src={user?.profile?.avatar_url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"}
                  alt="Student Profile"
                  className="h-9 w-9 rounded-full object-cover border border-[#DFD5C6] shadow-2xs hover:scale-105 transition-transform"
                />
              </Link>
            </>
          )}

          {/* Company Actions */}
          {role === 'company' && (
            <>
              <Link href="/company/post">
                <Button variant="default" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>Post an Opportunity</span>
                </Button>
              </Link>
              <Link href="/company/profile" className="flex items-center gap-2 pl-2">
                <div className="h-9 w-9 rounded-xl bg-[#2C1B14] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  {user?.company?.company_name?.[0] || 'V'}
                </div>
              </Link>
            </>
          )}

          {/* Admin quick button */}
          {role === 'admin' && (
            <Link href="/admin">
              <Button variant="default" size="sm" className="bg-[#2C1B14] text-amber-200 border border-amber-400/30">
                <ShieldCheck className="h-4 w-4 mr-1 text-amber-400" />
                Admin Dashboard
              </Button>
            </Link>
          )}

          {/* Settings icon */}
          {role !== 'guest' && (
            <Link href="/settings" className="p-2 rounded-full text-[#72635A] hover:bg-[#EADBCE]/50 transition-colors" title="Settings">
              <SlidersHorizontal className="h-4 w-4" />
            </Link>
          )}

          {/* Logout icon if authenticated */}
          {role !== 'guest' && (
            <button
              onClick={() => logout()}
              className="p-2 rounded-full text-[#72635A] hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {role !== 'guest' && (
            <Link href="/notifications" className="relative p-2 text-[#72635A]">
              <Bell className="h-5 w-5" />
              {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2C1B14]" />}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#1C140E] hover:bg-[#EADBCE]/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-3">
          <div className="flex flex-col space-y-2 pt-2">
            {role === 'guest' && (
              <>
                <Link 
                  href="/internships" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Internships
                </Link>
                <Link 
                  href="/#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  About us
                </Link>
                <Link 
                  href="/#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  FAQ
                </Link>
                <div className="pt-3 flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full">Join GRADDIn ↗</Button>
                  </Link>
                </div>
              </>
            )}

            {role === 'student' && (
              <>
                <Link 
                  href="/internships" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Browse Opportunities
                </Link>
                <Link 
                  href="/student/applications" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  My Applications
                </Link>
                <Link 
                  href="/student/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Profile
                </Link>
                <Link 
                  href="/settings" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Settings
                </Link>
              </>
            )}

            {role === 'company' && (
              <>
                <Link 
                  href="/company/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Startup Dashboard
                </Link>
                <Link 
                  href="/company/post" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Post an Opportunity
                </Link>
                <Link 
                  href="/company/candidates" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Candidates (AI Ranked)
                </Link>
                <Link 
                  href="/company/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Company Profile
                </Link>
              </>
            )}

            {(role === 'admin' || isGodModeAdmin) && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-amber-900 bg-amber-100 rounded-xl"
              >
                ⚡ Admin God-Mode Panel
              </Link>
            )}

            {role !== 'guest' && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-left text-base font-medium text-red-700 bg-red-50 rounded-xl"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
