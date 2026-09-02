'use client';

import React, { useState } from 'react';
import { Internship } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  User,
  BrainCircuit,
} from 'lucide-react';

interface ApplyModalProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyModal({ internship, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const { user } = useAuth();
  const [coverNote, setCoverNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultAi, setResultAi] = useState<{ score: number; feedback: string } | null>(null);

  if (!internship) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internship_id: internship.id,
          cover_note: coverNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      if (data.ai_result) {
        setResultAi(data.ai_result);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setResultAi(null);
    setCoverNote('');
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && (resultAi ? handleFinish() : onClose())}>
      <DialogContent className="sm:max-w-lg border-zinc-800 bg-zinc-950 text-zinc-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs">
              Application Submission
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-zinc-100 pt-1">
            Apply to {internship.title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            at <span className="font-semibold text-zinc-300">{internship.company?.company_name || 'Verified Company'}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* IF APPLICATION WAS SUBMITTED AND AI RESULT IS READY */}
        {resultAi ? (
          <div className="space-y-4 py-3">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-zinc-900 border border-indigo-500/30 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
                <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  AI Candidate Evaluation
                </span>
                <div className="text-4xl font-black text-white mt-1">
                  {resultAi.score}% <span className="text-sm font-medium text-zinc-400">Match</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 leading-relaxed text-left">
                <span className="font-semibold text-indigo-300 block mb-1">AI Feedback to Recruiter:</span>
                &ldquo;{resultAi.feedback}&rdquo;
              </p>
            </div>

            <p className="text-xs text-zinc-400 text-center">
              Your application has been submitted to the company. They will review candidates ranked by this match score.
            </p>

            <Button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium"
            >
              Done & View My Applications
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* PROFILE PREVIEW */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Your Profile Snapshot
                </span>
                <span className="text-[10px] text-zinc-500">Auto-sent with application</span>
              </div>
              <div className="text-zinc-400 space-y-1">
                <div>
                  <strong className="text-zinc-300">Name:</strong> {user?.profile?.full_name || user?.email}
                </div>
                <div>
                  <strong className="text-zinc-300">Skills:</strong> {user?.profile?.skills || 'Not specified'}
                </div>
                <div>
                  <strong className="text-zinc-300">Education:</strong> {user?.profile?.education || 'Not specified'}
                </div>
              </div>
            </div>

            {/* COVER NOTE */}
            <div className="space-y-1.5">
              <Label htmlFor="coverNote" className="text-xs font-semibold text-zinc-300">
                Why are you a great fit for this role? (Optional Cover Note)
              </Label>
              <Textarea
                id="coverNote"
                rows={4}
                placeholder="Highlight your relevant projects, excitement, and availability..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs focus-visible:ring-indigo-500"
              />
            </div>

            {/* AI NOTICE */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>Graddin AI will instantly evaluate your profile against the role requirements.</span>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileCheck className="w-4 h-4 mr-2" />}
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
