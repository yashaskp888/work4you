"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Services } from "@/components/services";
import { Footer } from "@/components/footer";
import { MountReveal } from "@/components/section-reveal";

/** Invisible placeholder — prevents Suspense from blocking the whole page on first chunk load */
function SectionChunkPlaceholder() {
  return <div className="min-h-px" aria-hidden />;
}

const Industries = dynamic(
  () => import("@/components/industries").then((m) => ({ default: m.Industries })),
  { ssr: false, loading: SectionChunkPlaceholder }
);
const AboutUs = dynamic(
  () => import("@/components/about-us").then((m) => ({ default: m.AboutUs })),
  { ssr: false, loading: SectionChunkPlaceholder }
);
const Stats = dynamic(
  () => import("@/components/stats").then((m) => ({ default: m.Stats })),
  { ssr: false, loading: SectionChunkPlaceholder }
);
const Process = dynamic(
  () => import("@/components/process").then((m) => ({ default: m.Process })),
  { ssr: false, loading: SectionChunkPlaceholder }
);
const FAQ = dynamic(
  () => import("@/components/faq").then((m) => ({ default: m.FAQ })),
  { ssr: false, loading: SectionChunkPlaceholder }
);
const CTASection = dynamic(
  () => import("@/components/cta-section").then((m) => ({ default: m.CTASection })),
  { ssr: false, loading: SectionChunkPlaceholder }
);

const SECTIONS = [
  { key: "hero", Component: Hero },
  { key: "why-us", Component: WhyChooseUs },
  { key: "services", Component: Services },
  { key: "industries", Component: Industries },
  { key: "about", Component: AboutUs },
  { key: "stats", Component: Stats },
  { key: "process", Component: Process },
  { key: "faq", Component: FAQ },
  { key: "cta", Component: CTASection },
  { key: "footer", Component: Footer },
] as const;

const REVEAL_INTERVAL_MS = 380;

export function HomeSections() {
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (visibleCount >= SECTIONS.length) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, REVEAL_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [mounted, visibleCount]);

  return (
    <>
      {SECTIONS.slice(0, visibleCount).map(({ key, Component }) => (
        <MountReveal key={key}>
          <Component />
        </MountReveal>
      ))}

      {visibleCount < SECTIONS.length && (
        <div className="flex justify-center py-8" aria-hidden>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
