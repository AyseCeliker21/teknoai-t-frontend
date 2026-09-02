"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const categories = [
  { value: "Girisimcilik", label: "Girişimcilik" },
  { value: "Akademik", label: "Akademik" },
  { value: "Teknoloji", label: "Teknoloji" },
  { value: "Egitim", label: "Eğitim" },
  { value: "Diger", label: "Diğer" },
];

export function GrantForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("Girisimcilik");
  const [amount, setAmount] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [deadlineAtUtc, setDeadlineAtUtc] = useState("");
  const [summary, setSummary] = useState("");
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/grants", {
        method: "POST",
        body: JSON.stringify({
          title,
          organization,
          category,
          amount: amount || null,
          applicationUrl: applicationUrl || null,
          deadlineAtUtc: deadlineAtUtc ? new Date(deadlineAtUtc).toISOString() : null,
          summary,
          bodyMarkdown,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || data?.message || "Hibe/Fon ilanı gönderilemedi.");
      }
      setTitle("");
      setOrganization("");
      setAmount("");
      setApplicationUrl("");
      setDeadlineAtUtc("");
      setSummary("");
      setBodyMarkdown("");
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
          <Label htmlFor="organization">Kurum / Sağlayıcı</Label>
          <Input id="organization" required value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </div>
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Tutar (opsiyonel)</Label>
          <Input id="amount" placeholder="örn. 50.000 TL" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="deadlineAtUtc">Son Başvuru Tarihi (opsiyonel)</Label>
          <Input id="deadlineAtUtc" type="date" value={deadlineAtUtc} onChange={(e) => setDeadlineAtUtc(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="applicationUrl">Başvuru Linki (opsiyonel)</Label>
        <Input
          id="applicationUrl"
          type="url"
          placeholder="https://..."
          value={applicationUrl}
          onChange={(e) => setApplicationUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="summary">Kısa Özet</Label>
        <Input id="summary" required maxLength={500} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="bodyMarkdown">Detaylar (Markdown desteklenir)</Label>
        <Textarea id="bodyMarkdown" required value={bodyMarkdown} onChange={(e) => setBodyMarkdown(e.target.value)} className="min-h-40" />
      </div>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor…" : "Onaya Gönder"}
      </Button>
    </form>
  );
}
