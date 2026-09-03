"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Internship, Application } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ApplyModalProps {
  internship: Internship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyModal({ internship, open, onOpenChange }: ApplyModalProps) {
  const { user, applyToInternship } = useAuth();
  const [coverNote, setCoverNote] = useState("");
  const [whyExcited, setWhyExcited] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    application: Application;
    matchScore: number;
    aiFeedback: string;
  } | null>(null);

  if (!internship) return null;

  const student = user?.profile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullCoverNote = [
        coverNote,
        whyExcited ? `Why I'm excited: ${whyExcited}` : ""
      ].filter(Boolean).join("\n\n");

      const result = await applyToInternship(internship.id, fullCoverNote);
      setSubmittedResult(result);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2C1B14', '#C99A6B', '#EADBCE', '#E8DCB8']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after transition
    setTimeout(() => {
      setSubmittedResult(null);
      setCoverNote("");
      setWhyExcited("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-xl">
        {!submittedResult ? (
          <div>
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C7A70] uppercase tracking-wider mb-1">
                <span>Direct Application</span>
                <span>•</span>
                <span>{internship.company?.company_name}</span>
              </div>
              <DialogTitle>Apply for {internship.title}</DialogTitle>
              <DialogDescription>
                Your verified GRADDIn student profile will be shared directly with the startup founders. No redundant resume uploads required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Snapshot Preview */}
              <div className="rounded-2xl border border-[#EADBCE] bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] mb-2 flex items-center justify-between">
                  <span>Profile Shared</span>
                  <Link href="/student/edit-profile" className="text-[11px] text-[#C99A6B] hover:underline font-normal">
                    Edit profile
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={student?.avatar_url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"}
                    alt={student?.full_name || "You"}
                    className="h-10 w-10 rounded-full object-cover border border-[#DFD5C6]"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#1C140E]">{student?.full_name || "Student Candidate"}</div>
                    <div className="text-xs text-[#72635A]">{student?.education || "Engineering Graduate '26"}</div>
                  </div>
                </div>
                {student?.skills && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#F0E8DD]">
                    {student.skills.split(/[,|]/).slice(0, 5).map((s, i) => (
                      <span key={i} className="text-[10px] bg-[#FAF7F2] text-[#72635A] px-2 py-0.5 rounded-full border border-[#E8DFD3]">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Startup Specific Question */}
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
                  Why are you excited to build with {internship.company?.company_name}?
                </label>
                <Textarea
                  placeholder="Share what caught your eye about our mission or technical product..."
                  rows={2}
                  value={whyExcited}
                  onChange={(e) => setWhyExcited(e.target.value)}
                />
              </div>

              {/* Additional Cover Note */}
              <div>
                <label className="block text-xs font-semibold text-[#1C140E] mb-1.5">
                  What would you bring to our team? (Optional)
                </label>
                <Textarea
                  placeholder="Mention any relevant side projects, tools you love, or what you'd like to ship during your internship..."
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" isLoading={isSubmitting} className="px-6">
                  <span>Submit Application</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Celebratory Success State with AI Candidate Match Reveal */
          <div className="text-center py-4 space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold text-[#1C140E]">Application sent.</h2>
              <p className="text-sm text-[#72635A] mt-1 max-w-sm mx-auto leading-relaxed">
                Your application has been received by <span className="font-semibold text-[#1C140E]">{internship.company?.company_name}</span>. Good luck!
              </p>
            </div>

            {/* AI Candidate Match Score Revealed */}
            <div className="rounded-2xl border border-[#C99A6B]/50 bg-gradient-to-b from-white to-[#FAF7F2] p-5 text-left shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2C1B14]">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>Automated AI Match Evaluation</span>
                </div>
                <span className="text-sm font-bold text-[#2C1B14] bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {submittedResult.matchScore}% Match
                </span>
              </div>

              <p className="text-xs text-[#4A382F] leading-relaxed mb-3">
                &ldquo;{submittedResult.aiFeedback}&rdquo;
              </p>

              <div className="text-[11px] text-[#8C7A70]">
                ✓ Application sorted near the top of the startup founder&apos;s candidate inbox.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/student/applications" className="flex-1" onClick={handleClose}>
                <Button variant="default" className="w-full">
                  View My Applications
                </Button>
              </Link>
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Browse More Opportunities
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
