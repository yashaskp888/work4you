"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  LogOut,
  Filter,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Eye,
  X,
  Download,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLoading } from "@/components/admin-loading";
import { API_URL } from "@/lib/utils";
import { getAuthToken, clearAuthSession } from "@/lib/auth";

const AdminAnalytics = dynamic(
  () => import("@/components/admin-analytics").then((m) => ({ default: m.AdminAnalytics })),
  { loading: () => <div className="h-[200px] animate-pulse rounded-2xl bg-muted/30 mt-8" /> }
);

interface ClientRequest {
  _id: string;
  organization: {
    name: string;
    email: string;
    ownerName: string;
    mobile: string;
    whatsapp?: string;
    address?: string;
    city: string;
    state?: string;
    country: string;
    businessType: string;
    industry: string;
  };
  requirements: {
    websiteCategory: string;
    budget: string;
    purpose: string;
    numberOfPages: string;
    features?: string[];
    designPreferences?: string;
    referenceWebsites?: string[];
    domainRequired?: boolean;
    hostingRequired?: boolean;
    seoRequired?: boolean;
    deadline?: string;
    additionalNotes?: string;
  };
  files?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    category: string;
  }[];
  status: string;
  createdAt: string;
}

const STATUSES = ["all", "pending", "reviewing", "in_progress", "completed", "cancelled"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [analytics, setAnalytics] = useState<{
    serviceDistribution: { name: string; value: number }[];
    monthlyGrowth: { month: string; requests: number }[];
  } | null>(null);

  const faviconFile = selectedRequest?.files?.find((f) => f.category === "favicon");

  useEffect(() => {
    const t = getAuthToken();
    if (!t) {
      router.replace("/admin/login");
      return;
    }
    setToken(t);
    setSessionReady(true);
  }, [router]);

  const fetchRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`${API_URL}/requests?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401) {
        clearAuthSession();
        router.replace("/admin/login");
        return;
      }
      if (data.success) setRequests(data.data);
    } catch {
      /* fallback */
    } finally {
      setLoading(false);
    }
  }, [token, search, statusFilter, router]);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.data);
    } catch {
      /* fallback */
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
      fetchAnalytics();
    }
  }, [token, fetchRequests, fetchAnalytics]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/requests/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) fetchRequests();
  };

  const deleteRequest = async (id: string) => {
    if (!token || !confirm("Delete this request?")) return;
    await fetch(`${API_URL}/requests/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  const downloadReport = async (type: "pdf" | "excel") => {
    if (!token) return;
    const res = await fetch(`${API_URL}/reports/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "pdf" ? "work4you-report.pdf" : "work4you-report.xlsx";
    a.click();
  };

  const logout = () => {
    clearAuthSession();
    router.replace("/admin/login");
  };

  if (!sessionReady || !token) return <AdminLoading />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="navbar" />
            <span className="text-muted-foreground">/</span>
            <span className="font-bold">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadReport("excel")}>
              <FileSpreadsheet className="w-4 h-4 mr-1" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadReport("pdf")}>
              <FileText className="w-4 h-4 mr-1" /> PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Client Requests</h1>
          <p className="text-muted-foreground mt-1">Manage and track all website requests</p>
        </div>

        {analytics && (
          <AdminAnalytics
            monthlyGrowth={analytics.monthlyGrowth}
            serviceDistribution={analytics.serviceDistribution}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Statuses" : s.replace("_", " ")}
                </option>
              ))}
            </select>
            <Button variant="outline" size="icon" onClick={fetchRequests}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="premium-card mt-6">
          <CardContent className="p-0">
            {loading ? (
              <p className="text-center py-12 text-muted-foreground">Loading requests…</p>
            ) : requests.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">
                No requests found. Restart the API server to auto-seed sample data.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                      <th className="text-left py-3 px-4 font-medium">Organization</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Budget</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 px-4">
                          <p className="font-medium">{req.organization.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.organization.city}, {req.organization.country}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p>{req.organization.ownerName}</p>
                          <p className="text-xs text-muted-foreground">{req.organization.email}</p>
                        </td>
                        <td className="py-3 px-4">{req.requirements.websiteCategory}</td>
                        <td className="py-3 px-4 capitalize">{req.requirements.budget.replace("-", " to rs")}</td>
                        <td className="py-3 px-4">
                          <select
                            value={req.status}
                            onChange={(e) => updateStatus(req._id, e.target.value)}
                            className="text-xs px-2 py-1 rounded-lg border border-border bg-background capitalize"
                          >
                            {STATUSES.filter((s) => s !== "all").map((s) => (
                              <option key={s} value={s}>
                                {s.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(req)}>
                              <Eye className="w-4 h-4 text-indigo-400" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteRequest(req._id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/dashboard" prefetch className="text-sm text-primary hover:underline">
            View Full Dashboard →
          </Link>
        </div>
      </main>

      {/* Details View Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-background/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {selectedRequest.organization.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Submitted on {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary capitalize">
                    {selectedRequest.status.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Section 1: Organization Profile */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Organization Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 rounded-xl p-4 border border-border/50 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Owner Name</p>
                      <p className="font-medium mt-0.5">{selectedRequest.organization.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Business Type & Industry</p>
                      <p className="font-medium mt-0.5">
                        {selectedRequest.organization.businessType} / {selectedRequest.organization.industry}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-medium mt-0.5">{selectedRequest.organization.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile & WhatsApp</p>
                      <p className="font-medium mt-0.5">
                        {selectedRequest.organization.mobile}{" "}
                        {selectedRequest.organization.whatsapp && `(WA: ${selectedRequest.organization.whatsapp})`}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium mt-0.5">
                        {[
                          selectedRequest.organization.address,
                          selectedRequest.organization.city,
                          selectedRequest.organization.state,
                          selectedRequest.organization.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Website Requirements */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Project Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 rounded-xl p-4 border border-border/50 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Website Category</p>
                      <p className="font-medium mt-0.5">{selectedRequest.requirements.websiteCategory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Number of Pages</p>
                      <p className="font-medium mt-0.5">{selectedRequest.requirements.numberOfPages} pages</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estimated Budget</p>
                      <p className="font-medium mt-0.5 capitalize">{selectedRequest.requirements.budget.replace("-", " to rs")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expected Deadline</p>
                      <p className="font-medium mt-0.5">{selectedRequest.requirements.deadline || "Flexible"}</p>
                    </div>
                  </div>

                  {/* Add-ons Row */}
                  <div className="flex flex-wrap gap-4 text-xs font-medium bg-muted/10 p-3 rounded-xl border border-border/30 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${selectedRequest.requirements.domainRequired ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                      <span>Domain: {selectedRequest.requirements.domainRequired ? 'Required' : 'Not Needed'}</span>
                      {faviconFile && (
                        <span className="flex items-center gap-1 ml-1.5 px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[10px]">
                          <img
                            src={faviconFile.path}
                            alt="favicon"
                            className="w-3.5 h-3.5 object-cover rounded-full"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                          Favicon
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${selectedRequest.requirements.hostingRequired ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                      <span>Hosting: {selectedRequest.requirements.hostingRequired ? 'Required' : 'Not Needed'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${selectedRequest.requirements.seoRequired ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                      <span>SEO: {selectedRequest.requirements.seoRequired ? 'Required' : 'Not Needed'}</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Purpose & Objective</p>
                      <p className="text-foreground bg-muted/5 p-3 rounded-xl border border-border/20 mt-1 leading-relaxed italic">
                        &ldquo;{selectedRequest.requirements.purpose}&rdquo;
                      </p>
                    </div>

                    {selectedRequest.requirements.features && selectedRequest.requirements.features.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Required Features</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedRequest.requirements.features.map((feature) => (
                            <span key={feature} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedRequest.requirements.designPreferences && (
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Design Preferences</p>
                        <p className="text-foreground bg-muted/5 p-3 rounded-xl border border-border/20 mt-1 leading-relaxed">
                          {selectedRequest.requirements.designPreferences}
                        </p>
                      </div>
                    )}

                    {selectedRequest.requirements.referenceWebsites && selectedRequest.requirements.referenceWebsites.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Reference Websites</p>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {selectedRequest.requirements.referenceWebsites.map((site) => {
                            const url = site.startsWith("http") ? site : `https://${site}`;
                            return (
                              <a
                                key={site}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-400 hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> {site}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedRequest.requirements.additionalNotes && (
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Additional Notes</p>
                        <p className="text-foreground bg-muted/10 p-3 rounded-xl mt-1 leading-relaxed">
                          {selectedRequest.requirements.additionalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Uploaded Files & Images */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Uploaded Assets ({selectedRequest.files?.length || 0})
                  </h4>
                  {!selectedRequest.files || selectedRequest.files.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic bg-muted/10 p-3 rounded-xl border border-border/20">
                      No files were uploaded with this request.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedRequest.files.map((file) => (
                          <div key={file.filename} className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between gap-3 text-sm">
                            <div className="truncate">
                              <p className="font-semibold truncate text-foreground">{file.originalName}</p>
                              <p className="text-xs text-muted-foreground">
                                <span className="capitalize">{file.category}</span> &bull; {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <a
                              href={file.path}
                              download={file.originalName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl hover:bg-muted text-primary hover:text-indigo-400 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>

                      {/* Image Previews Grid */}
                      {selectedRequest.files.filter((f) => f.category === "image" || f.category === "logo" || f.category === "favicon" || f.mimetype.startsWith("image/")).length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground font-semibold mb-2">Image Previews</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {selectedRequest.files
                              .filter((f) => f.category === "image" || f.category === "logo" || f.category === "favicon" || f.mimetype.startsWith("image/"))
                              .map((file) => (
                                <div key={file.filename} className="relative group border border-border rounded-xl overflow-hidden bg-muted/10 flex flex-col justify-between">
                                  <div className="aspect-[4/3] w-full flex items-center justify-center p-2 bg-muted/5 overflow-hidden">
                                    <img
                                      src={file.path}
                                      alt={file.originalName}
                                      className="max-h-full max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-105"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="p-2 border-t border-border bg-card">
                                    <p className="text-[10px] font-medium truncate text-foreground">{file.originalName}</p>
                                    <p className="text-[9px] text-muted-foreground capitalize">{file.category}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border flex justify-between items-center bg-muted/10 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Quick Status Update:</span>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => {
                      updateStatus(selectedRequest._id, e.target.value);
                      setSelectedRequest({ ...selectedRequest, status: e.target.value });
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background capitalize cursor-pointer"
                  >
                    {STATUSES.filter((s) => s !== "all").map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
