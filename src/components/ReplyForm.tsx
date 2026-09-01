"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/proxy/support/${ticketId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error("Mesaj gönderilemedi.");
      setBody("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Yanıtını yaz…"
        className="min-h-24"
      />
      <Button type="submit" disabled={loading || !body.trim()} className="self-end">
        {loading ? "Gönderiliyor…" : "Gönder"}
      </Button>
    </form>
  );
}
