import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "verified" | "aiMatch" | "warning" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";
  
  const variants = {
    default: "bg-[#2C1B14] text-[#FAF7F2]",
    secondary: "bg-[#EADBCE]/70 text-[#2C1B14] border border-[#DFD5C6]/60",
    outline: "border border-[#DFD5C6] text-[#6B5B52] bg-white/40",
    verified: "bg-[#2C1B14] text-[#FAF7F2] font-semibold",
    aiMatch: "bg-gradient-to-r from-[#2C1B14] to-[#5C3B2B] text-amber-200 border border-amber-300/30 font-semibold shadow-xs",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}

export { Badge };
