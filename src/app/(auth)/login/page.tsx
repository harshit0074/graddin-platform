"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Lock, AlertCircle, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await login(email.trim(), password);
      // Determine where to go based on email or let home route
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/internships');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
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
          Sign in to your GRADDIn account
        </p>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu or company.com"
                className="pl-9"
              />
              <Mail className="h-4 w-4 text-[#72635A] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1C140E]">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-[#C99A6B] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9"
              />
              <Lock className="h-4 w-4 text-[#72635A] absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E8DFD3] text-center text-xs text-[#72635A]">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-semibold text-[#1C140E] hover:underline">
            Join GRADDIn
          </Link>
        </div>
      </div>
    </div>
  );
}
