"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: React.ReactNode;
  /** Order index — used for scroll-triggered stagger */
  index?: number;
  className?: string;
}

/** Fade + slide up when the section enters the viewport */
export function SectionReveal({ children, index = 0, className }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      style={{ transitionDelay: visible ? `${index * 80}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

interface MountRevealProps {
  children: React.ReactNode;
  className?: string;
}

/** Plays once when the section is mounted (sequential page load) */
export function MountReveal({ children, className }: MountRevealProps) {
  const [useAnimation, setUseAnimation] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUseAnimation(false);
    }
  }, []);

  return (
    <div className={cn(useAnimation && "animate-fade-in", className)}>
      {children}
    </div>
  );
}
