"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MailCheck, RefreshCw, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [secondsLeft]);

  const handleResend = () => {
    setSecondsLeft(45);
    setCanResend(false);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#DFD5C6] bg-white p-8 sm:p-10 shadow-lg text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-[#EADBCE]/60 text-[#2C1B14] flex items-center justify-center mx-auto shadow-2xs">
          <MailCheck className="h-8 w-8" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C140E] mb-2">
            Verify your email
          </h1>
          <p className="text-xs text-[#72635A] leading-relaxed">
            We&apos;ve sent a verification link to your email address. Click the link inside to activate your GRADDIn account.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="default" className="w-full">
              <span>Open Email Inbox</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </a>

          <Button
            variant="outline"
            disabled={!canResend}
            onClick={handleResend}
            className="w-full border-[#DFD5C6]"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${!canResend ? 'animate-spin' : ''}`} />
            <span>
              {canResend ? "Resend Verification Email" : `Resend in ${secondsLeft}s`}
            </span>
          </Button>
        </div>

        <div className="pt-4 border-t border-[#F0E8DD] text-xs text-[#8C7A70]">
          Wrong address?{' '}
          <Link href="/signup" className="text-[#2C1B14] font-semibold hover:underline">
            Change email
          </Link>
        </div>
      </div>
    </div>
  );
}
