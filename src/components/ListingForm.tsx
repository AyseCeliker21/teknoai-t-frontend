"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const categories = [
  { value: "Etkinlik", label: "Etkinlik" },
  { value: "IsIlani", label: "İş İlanı" },
  { value: "Duyuru", label: "Duyuru" },
  { value: "Diger", label: "Diğer" },
];

export function ListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Etkinlik");
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [expiresAtUtc, setExpiresAtUtc] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/listings", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          bodyMarkdown,
          expiresAtUtc: expiresAtUtc ? new Date(expiresAtUtc).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || "İlan gönderilemedi.");
      }
      setTitle("");
      setBodyMarkdown("");
      setExpiresAtUtc("");
      setMessage("İlanın onaya gönderildi!");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Başlık</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="expiresAtUtc">Son Geçerlilik (opsiyonel)</Label>
          <Input
            id="expiresAtUtc"
            type="date"
            value={expiresAtUtc}
            onChange={(e) => setExpiresAtUtc(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="bodyMarkdown">İçerik (Markdown desteklenir)</Label>
        <Textarea id="bodyMarkdown" required value={bodyMarkdown} onChange={(e) => setBodyMarkdown(e.target.value)} className="min-h-40" />
      </div>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor…" : "Onaya Gönder"}
      </Button>
    </form>
  );
}
