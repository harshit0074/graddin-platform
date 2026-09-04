"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleValueChange = (val: string) => {
    setActiveTab(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeTab, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(
      "inline-flex h-12 items-center justify-center rounded-2xl bg-[#EADBCE]/50 p-1 text-[#72635A] border border-[#DFD5C6]/60",
      className
    )}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
        isActive 
          ? "bg-[#2C1B14] text-[#FAF7F2] shadow-xs" 
          : "text-[#72635A] hover:text-[#1C140E] hover:bg-[#EADBCE]/80",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;

  return <div className={cn("mt-4 focus-visible:outline-none", className)}>{children}</div>;
}
