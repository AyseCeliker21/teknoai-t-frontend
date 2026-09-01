"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { NewsDetail } from "@/lib/types";

export function NewsForm({ initial, id }: { initial?: NewsDetail; id?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [contentMarkdown, setContentMarkdown] = useState(initial?.contentMarkdown ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(id ? `/api/proxy/news/${id}` : "/api/proxy/news", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({ title, summary, contentMarkdown, coverImageUrl: coverImageUrl || null, isPublished }),
      });
      if (!res.ok) throw new Error("Kaydedilemedi.");

      if (!id) {
        setTitle("");
        setSummary("");
        setContentMarkdown("");
        setCoverImageUrl("");
      }
      setMessage("Kaydedildi.");
      router.refresh();
      if (id) router.push("/yonetim/haberler");
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
      <div>
        <Label htmlFor="summary">Özet</Label>
        <Textarea id="summary" required value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-20" />
      </div>
      <div>
        <Label htmlFor="contentMarkdown">İçerik (Markdown)</Label>
        <Textarea
          id="contentMarkdown"
          required
          value={contentMarkdown}
          onChange={(e) => setContentMarkdown(e.target.value)}
          className="min-h-48"
        />
      </div>
      <div>
        <Label htmlFor="coverImageUrl">Kapak Görseli URL</Label>
        <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Yayınla
      </label>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor…" : id ? "Güncelle" : "Yayınla"}
      </Button>
    </form>
  );
}
