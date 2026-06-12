"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe,
  Upload,
  Check,
  Loader2,
} from "lucide-react";
import { cn, API_URL, MAIN_URL } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Organization", icon: Building2 },
  { id: 2, title: "Requirements", icon: Globe },
  { id: 3, title: "Review & Submit", icon: Upload },
];

const FEATURES = [
  "Contact Form", "Blog", "Gallery", "Payment Gateway", "User Login",
  "Multi-language", "Live Chat", "Analytics", "Social Media Integration",
  "Appointment Booking", "Newsletter", "Search Functionality",
];

interface FormData {
  organizationName: string;
  businessType: string;
  industry: string;
  ownerName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  country: string;
  websiteCategory: string;
  purpose: string;
  numberOfPages: string;
  features: string[];
  designPreferences: string;
  referenceWebsites: string;
  domainRequired: boolean;
  hostingRequired: boolean;
  seoRequired: boolean;
  budget: string;
  deadline: string;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialForm: FormData = {
  organizationName: "",
  businessType: "",
  industry: "",
  ownerName: "",
  email: "",
  mobile: "",
  whatsapp: "",
  address: "",
  city: "",
  state: "",
  country: "",
  websiteCategory: "",
  purpose: "",
  numberOfPages: "",
  features: [],
  designPreferences: "",
  referenceWebsites: "",
  domainRequired: false,
  hostingRequired: true,
  seoRequired: false,
  budget: "",
  deadline: "",
  additionalNotes: "",
};

export default function RequestFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileCategories, setFileCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field: keyof FormData, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const validateStep = (s: number): boolean => {
    const e: FormErrors = {};
    if (s === 1) {
      if (!form.organizationName.trim()) e.organizationName = "Required";
      if (!form.businessType) e.businessType = "Required";
      if (!form.industry.trim()) e.industry = "Required";
      if (!form.ownerName.trim()) e.ownerName = "Required";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (!form.mobile.trim()) e.mobile = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.country.trim()) e.country = "Required";
    }
    if (s === 2) {
      if (!form.websiteCategory) e.websiteCategory = "Required";
      if (!form.purpose.trim()) e.purpose = "Required";
      if (!form.numberOfPages) e.numberOfPages = "Required";
      if (!form.budget) e.budget = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    setFileCategories((prev) => [...prev, ...selected.map(() => "other")]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    const organization = {
      name: form.organizationName,
      businessType: form.businessType,
      industry: form.industry,
      ownerName: form.ownerName,
      email: form.email,
      mobile: form.mobile,
      whatsapp: form.whatsapp,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
    };

    const requirements = {
      websiteCategory: form.websiteCategory,
      purpose: form.purpose,
      numberOfPages: form.numberOfPages,
      features: form.features,
      designPreferences: form.designPreferences,
      referenceWebsites: form.referenceWebsites.split(",").map((s) => s.trim()).filter(Boolean),
      domainRequired: form.domainRequired,
      hostingRequired: form.hostingRequired,
      seoRequired: form.seoRequired,
      budget: form.budget,
      deadline: form.deadline,
      additionalNotes: form.additionalNotes,
    };

    const body = new FormData();
    body.append("organization", JSON.stringify(organization));
    body.append("requirements", JSON.stringify(requirements));
    body.append("fileCategories", JSON.stringify(fileCategories));
    files.forEach((file) => body.append("files", file));

    try {
      const res = await fetch(`${API_URL}/requests/submit`, { method: "POST", body });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.push("/success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      <header className="relative border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={MAIN_URL} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Work<span className="gradient-text">4You</span></span>
          </Link>
          <Link href={MAIN_URL} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Request Your <span className="gradient-text">Website</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Tell us about your project and we&apos;ll craft the perfect solution
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between mb-4">
            {STEPS.map((s) => (
              <div key={s.id} className={cn("flex items-center gap-2", step >= s.id ? "text-primary" : "text-muted-foreground")}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                  step >= s.id ? "border-primary bg-primary/10" : "border-border"
                )}>
                  {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className="hidden sm:block text-sm font-medium">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="text-xl font-semibold mb-6">Organization Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Organization Name *" error={errors.organizationName}>
                    <input className="form-input" value={form.organizationName} onChange={(e) => update("organizationName", e.target.value)} />
                  </Field>
                  <Field label="Business Type *" error={errors.businessType}>
                    <select className="form-input" value={form.businessType} onChange={(e) => update("businessType", e.target.value)}>
                      <option value="">Select type</option>
                      {["Startup", "Small Business", "Corporate", "E-Commerce", "Non-Profit", "Agency", "Other"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Industry *" error={errors.industry}>
                    <input className="form-input" value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Healthcare, Technology" />
                  </Field>
                  <Field label="Owner Name *" error={errors.ownerName}>
                    <input className="form-input" value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input type="email" className="form-input" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>
                  <Field label="Mobile Number *" error={errors.mobile}>
                    <input className="form-input" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
                  </Field>
                  <Field label="WhatsApp Number">
                    <input className="form-input" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
                  </Field>
                  <Field label="City *" error={errors.city}>
                    <input className="form-input" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </Field>
                  <Field label="State">
                    <input className="form-input" value={form.state} onChange={(e) => update("state", e.target.value)} />
                  </Field>
                  <Field label="Country *" error={errors.country}>
                    <input className="form-input" value={form.country} onChange={(e) => update("country", e.target.value)} />
                  </Field>
                </div>
                <Field label="Address">
                  <textarea className="form-input h-20 py-3 resize-none" value={form.address} onChange={(e) => update("address", e.target.value)} />
                </Field>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="text-xl font-semibold mb-6">Website Requirements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Website Category *" error={errors.websiteCategory}>
                    <select className="form-input" value={form.websiteCategory} onChange={(e) => update("websiteCategory", e.target.value)}>
                      <option value="">Select category</option>
                      {["Business Website", "E-Commerce Website", "Industry Website", "Corporate Website", "Portfolio Website", "Custom Web Solution"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Number of Pages *" error={errors.numberOfPages}>
                    <select className="form-input" value={form.numberOfPages} onChange={(e) => update("numberOfPages", e.target.value)}>
                      <option value="">Select range</option>
                      {["1-5", "5-8", "8-12", "12-20", "20+"].map((o) => (
                        <option key={o} value={o}>{o} pages</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Budget *" error={errors.budget}>
                    <select className="form-input" value={form.budget} onChange={(e) => update("budget", e.target.value)}>
                      <option value="">Select budget</option>
                      {[
                        { v: "under-5000", l: "Under 5,000rs" },
                        { v: "5000-10000", l: "5,000 - 10,000rs" },
                        { v: "10000-25000", l: "10,000 - 25,000rs" },
                        { v: "25000-50000", l: "25000 - 50,000rs" },
                        { v: "50000-100000", l: "50,000 - 1,00,000rs" },
                        { v: "100000", l: "1,00,000+" },
                      ].map((o) => (
                        <option key={o.v} value={o.v}>{o.l}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Deadline">
                    <input type="date" className="form-input" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
                  </Field>
                </div>
                <Field label="Purpose of Website *" error={errors.purpose}>
                  <textarea className="form-input h-24 py-3 resize-none" value={form.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="Describe the main purpose and goals..." />
                </Field>
                <div>
                  <label className="form-label">Features Required</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {FEATURES.map((f) => (
                      <label key={f} className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm",
                        form.features.includes(f) ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                      )}>
                        <input type="checkbox" checked={form.features.includes(f)} onChange={() => toggleFeature(f)} className="sr-only" />
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center", form.features.includes(f) ? "bg-primary border-primary" : "border-border")}>
                          {form.features.includes(f) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {f}
                      </label>
                    ))}
                  </div>
                </div>
                <Field label="Design Preferences">
                  <textarea className="form-input h-20 py-3 resize-none" value={form.designPreferences} onChange={(e) => update("designPreferences", e.target.value)} placeholder="Colors, style, mood..." />
                </Field>
                
                <div className="flex flex-wrap gap-6">
                  {[
                    { key: "domainRequired" as const, label: "Domain Required" },
                    { key: "hostingRequired" as const, label: "Hosting Required" },
                    { key: "seoRequired" as const, label: "SEO Required" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
                <Field label="Additional Notes (Optional)">
                  <textarea className="form-input h-24 py-3 resize-none" value={form.additionalNotes} onChange={(e) => update("additionalNotes", e.target.value)} placeholder="Anything else we should know..." />
                </Field>
                <div>
                  <label className="form-label">
                    Upload Files <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Logo, documents, or images — skip this if you don&apos;t have files ready yet.
                  </p>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Optional — drag & drop or click to upload</p>
                    <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFiles} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm cursor-pointer hover:bg-primary/90">
                      Choose Files
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <span className="text-sm truncate">{file.name}</span>
                          <div className="flex items-center gap-2">
                            <select
                              value={fileCategories[i] || "other"}
                              onChange={(e) => {
                                const cats = [...fileCategories];
                                cats[i] = e.target.value;
                                setFileCategories(cats);
                              }}
                              className="text-xs px-2 py-1 rounded border border-border bg-background"
                            >
                              <option value="logo">Logo</option>
                              <option value="favicon">Favicon</option>
                              <option value="document">Document</option>
                              <option value="image">Image</option>
                              <option value="other">Other</option>
                            </select>
                            <button type="button" onClick={() => removeFile(i)} className="text-red-500 text-xs">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{submitError}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <>Submit Request <Check className="w-4 h-4 ml-1" /></>}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
