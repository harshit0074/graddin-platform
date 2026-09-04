"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-lg text-center">
        <div className="h-14 w-14 rounded-2xl bg-[#EADBCE]/60 text-[#2C1B14] flex items-center justify-center mx-auto mb-6">
          <KeyRound className="h-7 w-7" />
        </div>

        {!sent ? (
          <>
            <h1 className="font-serif text-3xl font-bold text-[#1C140E] mb-2">
              Forgot your password?
            </h1>
            <p className="text-xs text-[#72635A] mb-6 leading-relaxed">
              Enter the email address associated with your GRADDIn account and we&apos;ll send you a secure recovery link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">Email</label>
                <Input
                  type="email"
                  required
                  placeholder="name@campus.edu or work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" variant="default" className="w-full h-11 font-semibold">
                <span>Send recovery link</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C140E]">Check your inbox</h2>
            <p className="text-xs text-[#72635A] leading-relaxed">
              We&apos;ve dispatched a recovery link to <span className="font-semibold text-[#1C140E]">{email || 'your email'}</span>. Follow the link inside to set a new password.
            </p>
            <Button variant="outline" onClick={() => setSent(false)} className="w-full border-[#DFD5C6]">
              Resend recovery link
            </Button>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-[#F0E8DD]">
          <Link href="/login" className="inline-flex items-center text-xs font-semibold text-[#72635A] hover:text-[#1C140E]">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Back to log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
