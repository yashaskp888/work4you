"use client";

import {
  BarChart,
  Bar,
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

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6"];

interface AdminAnalyticsProps {
  monthlyGrowth: { month: string; requests: number }[];
  serviceDistribution: { name: string; value: number }[];
}

export function AdminAnalytics({ monthlyGrowth, serviceDistribution }: AdminAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-base">Monthly Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="requests" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-base">Service Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={70}
              >
                {serviceDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
