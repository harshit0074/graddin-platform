"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { switchRole } = useAuth();

  const handleSelect = (selectedRole: 'student' | 'company') => {
    switchRole(selectedRole);
    if (selectedRole === 'student') {
      router.push('/student-setup');
    } else {
      router.push('/startup-setup');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center space-y-4 mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
          <div className="h-10 w-10 rounded-2xl bg-[#2C1B14] text-[#FAF7F2] flex items-center justify-center font-serif text-2xl font-bold shadow-xs transition-transform group-hover:scale-105">
            G
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1C140E]">
            GRADD<span className="text-[#C99A6B]">In</span>
          </span>
        </Link>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C140E] tracking-tight">
          How are you joining GRADDIn?
        </h1>
        <p className="text-sm sm:text-base text-[#72635A] max-w-md mx-auto leading-relaxed">
          Select your role to personalize your onboarding experience and access dedicated features.
        </p>
      </div>

      {/* Two Large Interactive Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Student Card */}
        <button
          onClick={() => handleSelect('student')}
          className="group text-left rounded-3xl border-2 border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2C1B14] cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="h-14 w-14 rounded-2xl bg-[#2C1B14] text-white flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 transition-transform">
              <GraduationCap className="h-7 w-7 text-amber-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
              STUDENT PROFILE
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1 mb-3">
              I&apos;m a Student
            </h2>
            <p className="text-sm text-[#72635A] leading-relaxed">
              Discover internship opportunities at upcoming startups. Build a clean, structured profile and receive automated AI match scores.
            </p>
          </div>

          <div className="pt-8 flex items-center text-sm font-semibold text-[#2C1B14] group-hover:underline gap-1.5">
            <span>Continue to Student Onboarding</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        {/* Startup Card */}
        <button
          onClick={() => handleSelect('company')}
          className="group text-left rounded-3xl border-2 border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2C1B14] cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="h-14 w-14 rounded-2xl bg-[#EADBCE] text-[#2C1B14] flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 transition-transform">
              <Building2 className="h-7 w-7 text-[#2C1B14]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#72635A]">
              STARTUP RECRUITER
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C140E] mt-1 mb-3">
              I&apos;m a Startup
            </h2>
            <p className="text-sm text-[#72635A] leading-relaxed">
              Find ambitious students for your team. Post opportunities in conversational Reddit style and review applicants ranked by AI.
            </p>
          </div>

          <div className="pt-8 flex items-center text-sm font-semibold text-[#2C1B14] group-hover:underline gap-1.5">
            <span>Continue to Startup Onboarding</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      </div>

      <div className="mt-12 text-center text-xs text-[#72635A]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#2C1B14] hover:underline">
          Log in instead
        </Link>
      </div>
    </div>
  );
}
