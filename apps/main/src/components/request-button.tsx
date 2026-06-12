"use client";

import { Rocket, Sparkles } from "lucide-react";
import { REQUEST_URL, cn } from "@/lib/utils";

interface RequestButtonProps {
  className?: string;
  size?: "default" | "lg" | "compact";
}

export function RequestButton({ className, size = "default" }: RequestButtonProps) {
  const isLarge = size === "lg";
  const isCompact = size === "compact";

  return (
    <a
      href={REQUEST_URL}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] min-h-[44px] touch-manipulation",
        isLarge ? "px-7 py-3.5 text-base w-full" : isCompact ? "px-3 py-2 text-xs" : "px-4 sm:px-5 py-2.5 text-xs sm:text-sm",
        className
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-600" />
      <span
        className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <span
        className="absolute -inset-1 rounded-xl bg-gradient-to-r from-teal-500/40 via-cyan-500/40 to-violet-500/40 blur-md opacity-60 group-hover:opacity-100 transition-opacity"
        aria-hidden
      />
      <span className="relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
        <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
          <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <span className="hidden min-[400px]:inline sm:hidden">Get Started</span>
        <span className="hidden sm:inline">Let&apos;s Get Started</span>
        <span className="min-[400px]:hidden">Start</span>
        <Sparkles className="hidden sm:block h-4 w-4 text-cyan-200 opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
      </span>
    </a>
  );
}
