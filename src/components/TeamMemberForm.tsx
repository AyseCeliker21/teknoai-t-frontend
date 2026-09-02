"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ImageUploader";
import type { TeamMember } from "@/lib/types";

export function TeamMemberForm({ initial, onSaved }: { initial?: TeamMember; onSaved?: () => void }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [linkedInUrl, setLinkedInUrl] = useState(initial?.linkedInUrl ?? "");
  const [gitHubUrl, setGitHubUrl] = useState(initial?.gitHubUrl ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initial ? `/api/proxy/team/${initial.id}` : "/api/proxy/team";
      await fetch(url, {
        method: initial ? "PUT" : "POST",
        body: JSON.stringify({
          userId: null,
          fullName,
          title,
          bio: bio || null,
          avatarUrl: avatarUrl || null,
          linkedInUrl: linkedInUrl || null,
          gitHubUrl: gitHubUrl || null,
          sortOrder,
          isActive,
        }),
      });
      if (!initial) {
        setFullName("");
        setTitle("");
        setBio("");
        setAvatarUrl("");
        setLinkedInUrl("");
        setGitHubUrl("");
        setSortOrder(0);
      }
      router.refresh();
      onSaved?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Ad Soyad</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="title">Unvan</Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="bio">Hakkında</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-20" />
      </div>
      <ImageUploader label="Fotoğraf" category="team" aspect={1} value={avatarUrl} onChange={setAvatarUrl} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="linkedInUrl">LinkedIn</Label>
          <Input id="linkedInUrl" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="gitHubUrl">GitHub</Label>
          <Input id="gitHubUrl" value={gitHubUrl} onChange={(e) => setGitHubUrl(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div>
          <Label htmlFor="sortOrder">Sıra</Label>
          <Input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Aktif
        </label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor…" : initial ? "Güncelle" : "Ekle"}
      </Button>
    </form>
  );
}
