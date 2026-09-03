"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, KeyRound, Globe, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'company' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const targetEmail = email || (role === 'student' ? 'aarav@campus.edu' : role === 'company' ? 'founder@velo.ai' : 'adminharshit@gmail.com');
      
      // If password provided, attempt live Supabase login
      if (password) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: targetEmail, password }),
          });
          const data = await res.json();
          if (!res.ok) {
            setErrorMsg(data.error || "Login failed. Please check your credentials.");
            setIsLoading(false);
            return;
          }
          await refreshData();
        } catch {
          // If server offline, continue with client session
        }
      }

      // If email has admin or role is admin
      const targetRole = targetEmail.includes('admin') ? 'admin' : role;
      await login(targetEmail, targetRole);
      
      if (targetRole === 'student') router.push('/internships');
      else if (targetRole === 'company') router.push('/company/dashboard');
      else router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Centered Authentication Container */}
      <div className="w-full max-w-md rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-lg text-center">
        {/* GRADDIn Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="h-11 w-11 rounded-2xl bg-[#2C1B14] text-[#FAF7F2] flex items-center justify-center font-serif text-2xl font-bold shadow-xs transition-transform group-hover:scale-105">
            G
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1C140E]">
            GRADD<span className="text-[#C99A6B]">In</span>
          </span>
        </Link>

        {/* Headings */}
        <h1 className="font-serif text-3xl font-bold text-[#1C140E] tracking-tight mb-1">
          Welcome back.
        </h1>
        <p className="text-xs text-[#72635A] mb-6">
          Log in to your GRADDIn account
        </p>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] mb-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-1.5 rounded-xl transition-all ${role === 'student' ? 'bg-[#2C1B14] text-white font-semibold shadow-xs' : 'text-[#72635A] hover:text-[#1C140E]'}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('company')}
            className={`py-1.5 rounded-xl transition-all ${role === 'company' ? 'bg-[#2C1B14] text-white font-semibold shadow-xs' : 'text-[#72635A] hover:text-[#1C140E]'}`}
          >
            Startup
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-1.5 rounded-xl transition-all ${role === 'admin' ? 'bg-amber-800 text-amber-100 font-bold shadow-xs' : 'text-[#72635A] hover:text-[#1C140E]'}`}
          >
            Admin ⚡
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 text-left">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
              Email
            </label>
            <Input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#FAF7F2]/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1C140E]">
                Password (Optional for Demo)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#72635A] hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#FAF7F2]/50"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8C7A70]">Demo credentials pre-configured</span>
            <Link href="/forgot-password" className="text-[#2C1B14] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="default" isLoading={isLoading} className="w-full h-11 text-sm font-semibold">
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DFD3]"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-[#8C7A70]">
              or continue with
            </span>
          </div>

          {/* Authentication Options */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleLogin({ preventDefault: () => {} } as any)}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#DFD5C6] bg-[#FAF7F2] py-2.5 px-3 text-xs font-medium text-[#1C140E] hover:bg-[#F0E8DD] transition-colors"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleLogin({ preventDefault: () => {} } as any)}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#DFD5C6] bg-[#FAF7F2] py-2.5 px-3 text-xs font-medium text-[#1C140E] hover:bg-[#F0E8DD] transition-colors"
            >
              <KeyRound className="h-4 w-4 text-[#2C1B14]" />
              <span>Passkey / SSO</span>
            </button>
          </div>

          <p className="text-[11px] text-[#8C7A70] text-center pt-4 leading-relaxed">
            By continuing, you acknowledge that you understand and agree to the <Link href="/settings" className="underline hover:text-[#1C140E]">Terms &amp; Conditions</Link> and <Link href="/settings" className="underline hover:text-[#1C140E]">Privacy Policy</Link>.
          </p>
        </form>

        <div className="mt-8 pt-4 border-t border-[#F0E8DD] flex items-center justify-between text-xs text-[#8C7A70]">
          <Link href="/signup" className="font-semibold text-[#2C1B14] hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>English (US)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
