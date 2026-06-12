"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch, checkApiHealth } from "@/lib/api";
import { getAuthToken, setAuthSession, clearAuthSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then(setApiOnline);

    const token = getAuthToken();
    if (!token) {
      setCheckingSession(false);
      return;
    }

    apiFetch<{ success: boolean }>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((result) => {
      if (result.ok && result.data.success) {
        router.replace("/admin/dashboard");
        return;
      }
      clearAuthSession();
      setCheckingSession(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await apiFetch<{
      success: boolean;
      token?: string;
      admin?: object;
      message?: string;
    }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      checkApiHealth().then(setApiOnline);
      return;
    }

    const data = result.data;
    if (!data.success || !data.token) {
      setError(data.message || "Invalid credentials");
      return;
    }

    setAuthSession(data.token, data.admin ?? {});
    router.replace("/admin/dashboard");
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo variant="full" />
          </div>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        {apiOnline === false && (
          <div className="mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-200">API server is offline</p>
              <p className="text-muted-foreground mt-1">
                Run <code className="text-primary">npm run dev:server</code> in a terminal, then{" "}
                <code className="text-primary">npm run seed --workspace=server</code> for first-time setup.
              </p>
            </div>
          </div>
        )}

        {apiOnline === true && (
          <div className="mb-4 p-3 rounded-xl border border-primary/30 bg-primary/10 text-sm flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            API server connected
          </div>
        )}

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Access the admin dashboard to manage client requests</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

       
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
