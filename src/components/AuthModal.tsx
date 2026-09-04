"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GraduationCap, Building2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: 'student' | 'company';
}

export function AuthModal({ open, onOpenChange, defaultRole = 'student' }: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'company'>(defaultRole);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email || (selectedRole === 'student' ? 'aarav@campus.edu' : 'founder@velo.ai'), selectedRole);
      onOpenChange(false);
      if (selectedRole === 'student') {
        router.push('/internships');
      } else {
        router.push('/company/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader className="text-center items-center">
          <div className="h-12 w-12 rounded-2xl bg-[#2C1B14] text-[#FAF7F2] flex items-center justify-center font-serif text-2xl font-bold mb-2 shadow-xs">
            G
          </div>
          <DialogTitle className="text-2xl font-serif text-[#1C140E]">Welcome to GRADDIn</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Where ambitious students connect directly with the startups shaping what comes next.
          </DialogDescription>
        </DialogHeader>

        {/* Role Selector Tabs */}
        <div className="flex justify-center mb-5">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#EADBCE]/50 border border-[#DFD5C6] w-full max-w-xs">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedRole === 'student' 
                  ? 'bg-[#2C1B14] text-[#FAF7F2] shadow-xs' 
                  : 'text-[#72635A] hover:text-[#1C140E]'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>I&apos;m a Student</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('company')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedRole === 'company' 
                  ? 'bg-[#2C1B14] text-[#FAF7F2] shadow-xs' 
                  : 'text-[#72635A] hover:text-[#1C140E]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>I&apos;m a Startup</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
              {selectedRole === 'student' ? 'University or Personal Email' : 'Work Email'}
            </label>
            <Input
              type="email"
              required
              placeholder={selectedRole === 'student' ? 'name@campus.edu...' : 'founder@startup.com...'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" variant="default" isLoading={isLoading} className="w-full">
            <span>Continue as {selectedRole === 'student' ? 'Student' : 'Startup'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DFD5C6]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FAF7F2] px-3 text-[#8C7A70] text-[11px] font-medium tracking-wider">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Auth Providers in GRADDIn Palette */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="text-xs border-[#DFD5C6] bg-white hover:bg-[#F5EFEB]"
            >
              <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="text-xs border-[#DFD5C6] bg-white hover:bg-[#F5EFEB]"
            >
              <KeyRound className="h-3.5 w-3.5 mr-1.5 text-[#2C1B14]" />
              <span>Passkey / SSO</span>
            </Button>
          </div>

          <p className="text-[11px] text-[#8C7A70] text-center pt-2 leading-normal">
            By continuing, you acknowledge that you understand and agree to the Terms &amp; Conditions and Privacy Policy.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
