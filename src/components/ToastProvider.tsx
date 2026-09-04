"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'info';
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[#DFD5C6] bg-[#FAF7F2] p-4 text-[#1C140E] shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-5"
          >
            <div className="shrink-0 mt-0.5">
              {t.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-700" />}
              {t.variant === 'destructive' && <AlertCircle className="h-5 w-5 text-red-600" />}
              {(!t.variant || t.variant === 'default' || t.variant === 'info') && (
                <div className="h-5 w-5 rounded-full bg-[#2C1B14] text-amber-200 flex items-center justify-center text-xs font-bold">
                  G
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#1C140E]">{t.title}</div>
              {t.description && <div className="text-xs text-[#72635A] mt-0.5 leading-relaxed">{t.description}</div>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded-lg p-1 text-[#72635A] hover:bg-[#EADBCE] hover:text-[#1C140E] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
