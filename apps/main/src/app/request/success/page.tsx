"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Home } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(45,212,191,0.1),transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center mb-8 shadow-lg shadow-teal-500/30"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Request <span className="gradient-text">Submitted!</span>
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Thank you for choosing Work4You. We&apos;ve received your website requirements
          and our team will review them within 24 hours.
        </p>

        <div className="mt-8 p-6 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm text-left space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> What happens next?
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span> Our team reviews your requirements
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span> We&apos;ll contact you within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span> Receive a custom proposal and timeline
            </li>
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Work4You
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
