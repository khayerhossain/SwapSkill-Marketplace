"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to analytics page by default for admin
    router.replace("/dashboard/admin/analytics");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p>Redirecting to analytics...</p>
      </div>
    </div>
  );
}
