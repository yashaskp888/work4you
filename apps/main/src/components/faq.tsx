"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What types of websites does Work4You build?",
    a: "We build custom business websites, corporate portals, e-commerce stores, industry-specific platforms, and landing pages. Every project is tailored to your goals, brand, and target audience.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Timeline depends on scope and complexity. A standard business website typically takes 2–4 weeks. Larger e-commerce or enterprise projects may take 6–8 weeks. We provide a clear timeline after understanding your requirements.",
  },
  {
    q: "Do you provide website maintenance after launch?",
    a: "Yes. We offer ongoing website management including updates, backups, security monitoring, content changes, and technical support — so your site stays secure, fast, and up to date.",
  },
  {
    q: "Can you help with hosting and domain setup?",
    a: "Absolutely. We handle secure hosting, SSL certificates, domain configuration, and deployment — ensuring your website is live, protected, and performing optimally from day one.",
  },
  {
    q: "How do I get started with Work4You?",
    a: "Click the Let's Get Started button at the top of this page. Fill in your organization details, requirements, and preferences. Our team will review your request and get back to you with a tailored proposal.",
  },
  {
    q: "Do you offer real estate, plot sales, and construction services?",
    a: "Yes. In addition to premium residential, commercial, and agricultural plot sales, we provide end-to-end building construction, architectural planning, layout development, and full legal clearance assistance.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Common <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className={cn(
                "rounded-xl border border-border/50 bg-card/40 overflow-hidden transition-all duration-300",
                open === i && "border-primary/50 bg-card/80 shadow-[0_0_20px_-5px_rgba(45,212,191,0.25)]"
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-primary shrink-0 transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
