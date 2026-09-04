'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { User, Building2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'student' | 'company' | 'admin';
}

export function AuthModal({ isOpen, onClose, defaultRole = 'student' }: AuthModalProps) {
  const { refreshUser } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'company'>(
    defaultRole === 'company' ? 'company' : 'student'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const resetForm = () => {
    setError(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setSkills('');
    setEducation('');
    setExperience('');
    setCompanyName('');
    setWebsiteUrl('');
    setLinkedinUrl('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      await refreshUser();
      resetForm();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        email,
        password,
        role: selectedRole,
      };

      if (selectedRole === 'student') {
        payload.fullName = fullName;
        payload.skills = skills;
        payload.education = education;
        payload.experience = experience;
      } else {
        payload.companyName = companyName;
        payload.websiteUrl = websiteUrl;
        payload.linkedinUrl = linkedinUrl;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Auto login
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      await refreshUser();
      resetForm();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              GRADDIN Portal
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {authMode === 'login'
              ? 'Enter your credentials to access your internships or dashboard.'
              : 'Join GRADDIN solely focused on high-impact internships.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <Tabs value={authMode} onValueChange={(v) => { setAuthMode(v as 'login' | 'signup'); setError(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* SIGN IN FORM */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@thapar.edu or company@brand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium py-2 rounded-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </form>
          </TabsContent>

          {/* SIGN UP FORM */}
          <TabsContent value="signup">
            <div className="space-y-4 pt-2">
              {/* Role Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                    selectedRole === 'student'
                      ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <User className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Student</div>
                    <div className="text-xs text-zinc-500">Apply to top roles</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('company')}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                    selectedRole === 'company'
                      ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Company</div>
                    <div className="text-xs text-zinc-500">Hire intern talent</div>
                  </div>
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={selectedRole === 'student' ? 'student@thapar.edu' : 'contact@company.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  />
                </div>

                {/* Student specific fields */}
                {selectedRole === 'student' && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-zinc-900 border-zinc-800 text-zinc-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="skills">Skills & Technologies (Used by AI Ranker)</Label>
                      <Input
                        id="skills"
                        placeholder="e.g. React, Next.js, Python, UI/UX, SQL"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-zinc-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="education">College / Degree</Label>
                      <Input
                        id="education"
                        placeholder="e.g. B.Tech Computer Engineering - 3rd Year"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-zinc-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="experience">Projects / Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Brief summary of projects, past internships, or GitHub links..."
                        rows={2}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Company specific fields */}
                {selectedRole === 'company' && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Acme Innovations Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="bg-zinc-900 border-zinc-800 text-zinc-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="linkedinUrl">Official LinkedIn Page (For Admin Verification)</Label>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/company/acme"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        required
                        className="bg-zinc-900 border-zinc-800 text-zinc-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="websiteUrl">Company Website</Label>
                      <Input
                        id="websiteUrl"
                        placeholder="https://acme.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-zinc-100"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 italic">
                      * Note: New company accounts require manual admin verification before posting internships.
                    </p>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium py-2 rounded-lg mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create {selectedRole === 'company' ? 'Company Account' : 'Student Account'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
