"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { RequestButton } from "@/components/request-button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 safe-top",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/20"
          : "bg-background/60 backdrop-blur-md"
      )}
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[4.25rem] sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        <Logo variant="navbar" priority />

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <RequestButton />
        </div>

        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="shrink-0">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="shrink-0"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[4.25rem] sm:top-20 z-40 bg-background/98 backdrop-blur-xl border-t border-border overflow-y-auto">
          <div className="px-4 py-6 flex flex-col gap-1 max-w-lg mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base text-muted-foreground hover:text-foreground py-3 px-2 rounded-lg hover:bg-muted/30 transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <RequestButton className="w-full" size="lg" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
