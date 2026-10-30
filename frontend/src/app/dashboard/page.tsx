"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-xs text-[#94A3B8]">
      <span>Redirecting to Overview Dashboard...</span>
    </div>
  );
}
