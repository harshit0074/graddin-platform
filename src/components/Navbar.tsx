'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Briefcase,
  User,
  Building2,
  ShieldAlert,
  LogOut,
  Sparkles,
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (role?: 'student' | 'company') => void;
  activeView: 'feed' | 'student-apps' | 'student-profile' | 'company-dash' | 'admin-dash' | 'faq' | 'about';
  setActiveView: (view: 'feed' | 'student-apps' | 'student-profile' | 'company-dash' | 'admin-dash' | 'faq' | 'about') => void;
}

export function Navbar({ onOpenAuth, activeView, setActiveView }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveView('feed')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                GRADDIN
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                  Internships
                </span>
              </span>
            </div>
          </button>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveView('feed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'feed'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              Browse Roles
            </button>
            <button
              onClick={() => setActiveView('about')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'about'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveView('faq')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'faq'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              FAQ
            </button>
          </nav>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => onOpenAuth('company')}
                className="text-zinc-300 hover:text-white hover:bg-zinc-900 text-xs sm:text-sm font-medium hidden sm:inline-flex"
              >
                For Companies
              </Button>
              <Button
                onClick={() => onOpenAuth('student')}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-500/20 rounded-lg"
              >
                Sign In / Join
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* STUDENT ROLE SHORTCUTS */}
              {user.role === 'student' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeView === 'student-apps' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView('student-apps')}
                    className={`text-xs h-9 ${
                      activeView === 'student-apps'
                        ? 'bg-indigo-600 text-white'
                        : 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    My Applications
                  </Button>
                </div>
              )}

              {/* COMPANY ROLE SHORTCUTS */}
              {user.role === 'company' && (
                <div className="flex items-center gap-2">
                  {user.company?.is_verified ? (
                    <Badge className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 gap-1 text-[11px] hidden sm:flex">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Verified Company
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-950/60 text-amber-400 border border-amber-800/80 gap-1 text-[11px] hidden sm:flex">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Verification Pending
                    </Badge>
                  )}
                  <Button
                    variant={activeView === 'company-dash' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView('company-dash')}
                    className={`text-xs h-9 ${
                      activeView === 'company-dash'
                        ? 'bg-indigo-600 text-white'
                        : 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                    Company Dashboard
                  </Button>
                </div>
              )}

              {/* ADMIN ROLE SHORTCUTS (HIDDEN / GOD MODE) */}
              {user.role === 'admin' && (
                <Button
                  size="sm"
                  onClick={() => setActiveView('admin-dash')}
                  className="bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 border border-red-400/30 h-9"
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                  ⚡ Admin God Mode
                </Button>
              )}

              {/* USER PROFILE DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-900 border border-zinc-800 transition-colors outline-none cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 font-bold text-xs border border-zinc-700">
                    {user.role === 'company'
                      ? (user.company?.company_name?.[0] || 'C').toUpperCase()
                      : (user.profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-200">
                  <DropdownMenuLabel>
                    <div className="text-xs text-zinc-400">Signed in as</div>
                    <div className="font-semibold text-sm truncate text-zinc-100">{user.email}</div>
                    <div className="mt-1">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">
                        {user.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  {user.role === 'student' && (
                    <>
                      <DropdownMenuItem onClick={() => setActiveView('student-apps')} className="cursor-pointer">
                        <FileText className="w-4 h-4 mr-2 text-zinc-400" />
                        My Applications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveView('student-profile')} className="cursor-pointer">
                        <User className="w-4 h-4 mr-2 text-zinc-400" />
                        Edit Profile / Resume Info
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === 'company' && (
                    <DropdownMenuItem onClick={() => setActiveView('company-dash')} className="cursor-pointer">
                      <Building2 className="w-4 h-4 mr-2 text-zinc-400" />
                      Company Dashboard
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => setActiveView('admin-dash')} className="cursor-pointer text-purple-400">
                      <ShieldAlert className="w-4 h-4 mr-2 text-purple-400" />
                      Admin Control Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:text-red-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
