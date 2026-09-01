"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ModerationControl({ type, id }: { type: "articles" | "listings"; id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function moderate(approve: boolean) {
    setLoading(approve ? "approve" : "reject");
    try {
      await fetch(`/api/proxy/${type}/${id}/moderate`, {
        method: "POST",
        body: JSON.stringify({ approve, note: null }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex shrink-0 gap-2">
      <Button size="sm" disabled={loading !== null} onClick={() => moderate(true)}>
        <Check size={14} /> Onayla
      </Button>
      <Button size="sm" variant="danger" disabled={loading !== null} onClick={() => moderate(false)}>
        <X size={14} /> Reddet
      </Button>
    </div>
  );
}
