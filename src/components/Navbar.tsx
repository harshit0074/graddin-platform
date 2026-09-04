"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Plus, 
  ArrowUpRight, 
  LogOut,
  SlidersHorizontal,
  Crown
} from 'lucide-react';
import { isSuperAdminEmail } from '@/lib/constants';

export function Navbar() {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isGodModeAdmin = (user?.email && isSuperAdminEmail(user.email)) || role === 'admin' || user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DFD3] bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NextLink href="/" className="flex items-center gap-2 group">
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
        </NextLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#72635A]">
          {/* Public Links */}
          {role === 'guest' && (
            <>
              <NextLink 
                href="/internships" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/internships' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Internships
              </NextLink>
              <NextLink href="/#about" className="transition-colors hover:text-[#1C140E]">
                About us
              </NextLink>
              <NextLink href="/#faq" className="transition-colors hover:text-[#1C140E]">
                FAQ
              </NextLink>
            </>
          )}

          {/* Student Links */}
          {role === 'student' && (
            <>
              <NextLink 
                href="/internships" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/internships' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Opportunities
              </NextLink>
              <NextLink 
                href="/student/applications" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/student/applications' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                My Applications
              </NextLink>
              <NextLink 
                href="/student/profile" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/student/profile' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Profile
              </NextLink>
            </>
          )}

          {/* Company Links */}
          {role === 'company' && (
            <>
              <NextLink 
                href="/company/dashboard" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/dashboard' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Dashboard
              </NextLink>
              <NextLink 
                href="/company/opportunities" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/opportunities' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                My Posts
              </NextLink>
              <NextLink 
                href="/company/candidates" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/candidates' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Candidates (AI Ranked)
              </NextLink>
              <NextLink 
                href="/company/profile" 
                className={`transition-colors hover:text-[#1C140E] ${pathname === '/company/profile' ? 'text-[#1C140E] font-semibold' : ''}`}
              >
                Startup Page
              </NextLink>
            </>
          )}

          {/* Admin Links */}
          {role === 'admin' && (
            <>
              <NextLink 
                href="/admin" 
                className={`flex items-center gap-1.5 text-[#2C1B14] font-semibold px-3 py-1 rounded-full bg-amber-100 border border-amber-200`}
              >
                <ShieldCheck className="h-4 w-4 text-amber-700" />
                <span>God-Mode Portal</span>
              </NextLink>
              <NextLink href="/internships" className="transition-colors hover:text-[#1C140E]">
                All Openings
              </NextLink>
            </>
          )}
        </nav>

        {/* Right Actions Header */}
        <div className="hidden md:flex items-center gap-3">
          {/* Guest Actions */}
          {role === 'guest' && (
            <>
              <NextLink href="/signup?role=company">
                <Button variant="ghost" size="sm" className="text-[#72635A] hover:text-[#1C140E]">
                  For Startups
                </Button>
              </NextLink>
              <NextLink href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </NextLink>
              <NextLink href="/signup">
                <Button variant="default" size="sm" className="group">
                  <span>Join GRADDIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </NextLink>
            </>
          )}

          {/* Student Actions */}
          {role === 'student' && (
            <div className="flex items-center gap-2">
              <NextLink href="/internships">
                <Button variant="outline" size="sm">
                  Browse Opportunities
                </Button>
              </NextLink>
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-[#2C1B14] text-white flex items-center justify-center font-bold text-xs border border-[#DFD5C6] shadow-2xs hover:scale-105 transition-transform">
                    {user?.profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                  </div>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#DFD5C6] shadow-lg p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-[#EADBCE]/50">
                      <div className="text-xs font-semibold text-[#1C140E] truncate">{user?.profile?.full_name || 'Student'}</div>
                      <div className="text-[10px] text-[#72635A] truncate">{user?.email}</div>
                    </div>
                    <NextLink
                      href="/student/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-[#1C140E] hover:bg-[#FAF7F2] rounded-xl"
                    >
                      View Profile
                    </NextLink>
                    <NextLink
                      href="/student/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-[#1C140E] hover:bg-[#FAF7F2] rounded-xl"
                    >
                      My Applications
                    </NextLink>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Actions */}
          {role === 'company' && (
            <div className="flex items-center gap-2">
              <NextLink href="/company/post">
                <Button variant="default" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>Post an Opportunity</span>
                </Button>
              </NextLink>
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-xl bg-[#2C1B14] text-white flex items-center justify-center text-xs font-bold shadow-2xs hover:scale-105 transition-transform">
                    {user?.company?.company_name?.[0]?.toUpperCase() || 'C'}
                  </div>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#DFD5C6] shadow-lg p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-[#EADBCE]/50">
                      <div className="text-xs font-semibold text-[#1C140E] truncate">{user?.company?.company_name || 'Startup'}</div>
                      <div className="text-[10px] text-[#72635A] truncate">{user?.email}</div>
                    </div>
                    <NextLink
                      href="/company/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-[#1C140E] hover:bg-[#FAF7F2] rounded-xl"
                    >
                      Dashboard
                    </NextLink>
                    <NextLink
                      href="/company/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-[#1C140E] hover:bg-[#FAF7F2] rounded-xl"
                    >
                      Company Profile
                    </NextLink>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {role === 'admin' && (
            <div className="flex items-center gap-2">
              <NextLink href="/admin">
                <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin God Mode</span>
                </Button>
              </NextLink>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 text-xs flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center gap-2">
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
                <NextLink 
                  href="/internships" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Internships
                </NextLink>
                <NextLink 
                  href="/#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  About us
                </NextLink>
                <NextLink 
                  href="/#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  FAQ
                </NextLink>
                <div className="pt-3 flex flex-col gap-2">
                  <NextLink href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </NextLink>
                  <NextLink href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full">Join GRADDIn ↗</Button>
                  </NextLink>
                </div>
              </>
            )}

            {role === 'student' && (
              <>
                <NextLink 
                  href="/internships" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Browse Opportunities
                </NextLink>
                <NextLink 
                  href="/student/applications" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  My Applications
                </NextLink>
                <NextLink 
                  href="/student/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Profile
                </NextLink>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left px-3 py-2 text-base font-medium text-red-600 rounded-xl hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </>
            )}

            {role === 'company' && (
              <>
                <NextLink 
                  href="/company/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Startup Dashboard
                </NextLink>
                <NextLink 
                  href="/company/post" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1C140E] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Post an Opportunity
                </NextLink>
                <NextLink 
                  href="/company/opportunities" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  My Posts
                </NextLink>
                <NextLink 
                  href="/company/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#72635A] rounded-xl hover:bg-[#EADBCE]/40"
                >
                  Company Profile
                </NextLink>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left px-3 py-2 text-base font-medium text-red-600 rounded-xl hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <NextLink 
                  href="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-amber-900 bg-amber-100 rounded-xl flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin God-Mode Panel</span>
                </NextLink>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left px-3 py-2 text-base font-medium text-red-600 rounded-xl hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
