"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Activity,
  Wrench,
  IndianRupee,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/logo";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL, REQUEST_URL } from "@/lib/utils";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];

interface DashboardData {
  stats: {
    totalClients: number;
    projectsCompleted: number;
    activeProjects: number;
    websitesUnderMaintenance: number;
    monthlyRevenue: number;
  };
  monthlyGrowth: { month: string; requests: number; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  serviceDistribution: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  recentRequests: {
    _id: string;
    organization: { name: string; email: string };
    requirements: { websiteCategory: string; budget: string };
    status: string;
    createdAt: string;
  }[];
}

const fallbackData: DashboardData = {
  stats: {
    totalClients: 247,
    projectsCompleted: 189,
    activeProjects: 34,
    websitesUnderMaintenance: 56,
    monthlyRevenue: 48500,
  },
  monthlyGrowth: [
    { month: "Jan", requests: 12, revenue: 28000 },
    { month: "Feb", requests: 18, revenue: 35000 },
    { month: "Mar", requests: 15, revenue: 32000 },
    { month: "Apr", requests: 22, revenue: 41000 },
    { month: "May", requests: 28, revenue: 45000 },
    { month: "Jun", requests: 24, revenue: 48500 },
  ],
  revenueByMonth: [
    { month: "Jan", revenue: 28000 },
    { month: "Feb", revenue: 35000 },
    { month: "Mar", revenue: 32000 },
    { month: "Apr", revenue: 41000 },
    { month: "May", revenue: 45000 },
    { month: "Jun", revenue: 48500 },
  ],
  serviceDistribution: [
    { name: "Business Websites", value: 45 },
    { name: "E-Commerce", value: 28 },
    { name: "Corporate", value: 22 },
    { name: "Custom Solutions", value: 15 },
  ],
  statusDistribution: [
    { name: "Pending", value: 8 },
    { name: "Reviewing", value: 12 },
    { name: "In Progress", value: 14 },
    { name: "Completed", value: 189 },
  ],
  recentRequests: [],
};

const statCards = [
  { key: "totalClients", label: "Total Clients", icon: Users, color: "from-blue-500 to-cyan-500" },
  { key: "projectsCompleted", label: "Projects Completed", icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
  { key: "activeProjects", label: "Active Projects", icon: Activity, color: "from-violet-500 to-purple-500" },
  { key: "websitesUnderMaintenance", label: "Under Maintenance", icon: Wrench, color: "from-orange-500 to-amber-500" },
] as const;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/analytics/showcase`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="navbar" />
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-1" /> Home
              </Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <a href={REQUEST_URL}>Let&apos;s Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your business performance
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="text-2xl font-bold mt-1">
                        {loading ? "—" : data.stats[card.key].toLocaleString()}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="premium-card bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold mt-1 gradient-text">
                      rs {loading ? "—" : data.stats.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Monthly Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="premium-card lg:col-span-1">
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.serviceDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="premium-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.statusDistribution.map((status, i) => {
                  const total = data.statusDistribution.reduce((s, x) => s + x.value, 0);
                  const pct = total ? Math.round((status.value / total) * 100) : 0;
                  return (
                    <div key={status.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{status.name}</span>
                        <span className="text-muted-foreground">{status.value} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent requests */}
        <Card className="premium-card mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Client Requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard" prefetch>View All <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent requests yet. Connect MongoDB to see live data.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-2">Organization</th>
                      <th className="text-left py-3 px-2">Category</th>
                      <th className="text-left py-3 px-2">Budget</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentRequests.map((req) => (
                      <tr key={req._id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2 font-medium">{req.organization.name}</td>
                        <td className="py-3 px-2">{req.requirements.websiteCategory}</td>
                        <td className="py-3 px-2">{req.requirements.budget}</td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary capitalize">
                            {req.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
