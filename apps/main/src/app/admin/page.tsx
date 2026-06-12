"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoading } from "@/components/admin-loading";
import { isAuthenticated } from "@/lib/auth";

/** Lightweight entry — redirects without loading heavy admin bundle */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated() ? "/admin/dashboard" : "/admin/login");
  }, [router]);

  return <AdminLoading />;
}
