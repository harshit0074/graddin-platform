import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#DFD5C6] bg-white px-4 py-2 text-sm text-[#1C140E] shadow-xs transition-colors placeholder:text-[#A09388] focus-visible:outline-none focus-visible:border-[#2C1B14] focus-visible:ring-2 focus-visible:ring-[#2C1B14]/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
