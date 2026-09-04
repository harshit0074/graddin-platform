import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border border-[#DFD5C6] bg-white px-4 py-3 text-sm text-[#1C140E] shadow-xs transition-colors placeholder:text-[#A09388] focus-visible:outline-none focus-visible:border-[#2C1B14] focus-visible:ring-2 focus-visible:ring-[#2C1B14]/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
