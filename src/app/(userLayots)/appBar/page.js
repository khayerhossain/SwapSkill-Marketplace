"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppBarHome() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to overview page by default
    router.replace("/appBar/overview");
  }, [router]);

  return (
    <div className="prose max-w-none text-stone-50">
      <h2>Welcome</h2>
      <p>Redirecting to overview...</p>
    </div>
  );
}


