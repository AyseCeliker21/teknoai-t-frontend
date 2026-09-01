"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Button variant="secondary" size="sm" className={className} onClick={handleLogout} disabled={loading}>
      {loading ? "Çıkış yapılıyor…" : "Çıkış Yap"}
    </Button>
  );
}
