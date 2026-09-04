"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffectDialogEsc(open, () => onOpenChange(false));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1C140E]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      {/* Content Container */}
      <div className="relative z-50 w-full max-w-lg p-4 max-h-[92vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function useEffectDialogEsc(open: boolean, onClose: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);
}

export function DialogContent({ 
  children, 
  className,
  onClose
}: { 
  children: React.ReactNode; 
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div className={cn(
      "relative rounded-3xl border border-[#E8DFD3] bg-[#FAF7F2] p-6 shadow-2xl transition-all sm:p-8",
      className
    )}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#72635A] hover:bg-[#EADBCE] hover:text-[#1C140E] transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col space-y-1.5 text-left mb-5", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("font-serif text-2xl font-bold tracking-tight text-[#1C140E]", className)}>{children}</h2>;
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-[#72635A] leading-relaxed", className)}>{children}</p>;
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4", className)}>{children}</div>;
}

