import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "caramel" | "dark";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C99A6B] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";
    
    const variants = {
      default: "bg-[#2C1B14] text-[#FAF7F2] hover:bg-[#1A100B] shadow-sm hover:shadow",
      secondary: "bg-[#EADBCE] text-[#2C1B14] hover:bg-[#DFCDBB]",
      outline: "border border-[#DFD5C6] bg-transparent text-[#2C1B14] hover:bg-[#F5EFEB] hover:border-[#C99A6B]",
      ghost: "text-[#2C1B14] hover:bg-[#F0E8DD]",
      link: "text-[#2C1B14] underline-offset-4 hover:underline p-0 h-auto",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      caramel: "bg-[#C99A6B] text-[#1C140E] hover:bg-[#B88755] font-semibold",
      dark: "bg-[#1C140E] text-white hover:bg-black",
    };

    const sizes = {
      default: "h-11 px-5 py-2",
      sm: "h-8 px-3.5 text-xs",
      lg: "h-12 px-7 text-base",
      icon: "h-9 w-9 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
