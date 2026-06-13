"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Info, Activity, HelpCircle, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { RequestButton } from "@/components/request-button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#services", label: "Services", icon: Sparkles, desc: "Premium development & design services" },
  { href: "#about", label: "About", icon: Info, desc: "Our mission, vision, and expert team" },
  { href: "#process", label: "Process", icon: Activity, desc: "Our seamless development workflow" },
  { href: "#faq", label: "FAQ", icon: HelpCircle, desc: "Answers to common client questions" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
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
            <RequestButton />
          </div>

          <div className="flex lg:hidden items-center">
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
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 top-[4.25rem] sm:top-20 z-40 bg-background/98 backdrop-blur-xl border-t border-border/50 overflow-y-auto flex flex-col justify-between"
          >
            {/* Background glowing orbs */}
            <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-accent/5 blur-[120px] pointer-events-none -z-10" />

            <div className="px-4 py-8 flex flex-col gap-6 max-w-lg mx-auto w-full flex-1 justify-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-[11px] font-semibold tracking-wider uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Menu</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-start gap-4 p-3.5 rounded-xl hover:bg-muted/40 border border-transparent hover:border-border/40 transition-all duration-300"
                      >
                        <div className="p-2 rounded-lg bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                          <link.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                            <span>{link.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">
                            {link.desc}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/50">
                <RequestButton className="w-full shadow-lg shadow-primary/10" size="lg" />
              </div>
            </div>

            <div className="mt-auto px-6 py-6 bg-muted/20 border-t border-border/30 w-full text-center">
              <div className="max-w-md mx-auto space-y-3">
                <div className="flex flex-col gap-2 items-center justify-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Mail className="w-3.5 h-3.5 text-primary" /> connect@work4you.co.in
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Phone className="w-3.5 h-3.5 text-primary" /> +91 81057 12548
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> Bengaluru, India
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  &copy; {new Date().getFullYear()} Work4You. Premium Digital Solutions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
