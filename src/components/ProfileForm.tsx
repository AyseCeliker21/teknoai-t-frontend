"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ImageUploader";
import type { AuthResponse } from "@/lib/types";

export function ProfileForm({ profile }: { profile: AuthResponse["user"] }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.fullName);
  const [title, setTitle] = useState(profile.title ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/auth/me", {
        method: "PUT",
        body: JSON.stringify({ fullName, title, bio, avatarUrl }),
      });
      if (!res.ok) throw new Error("Güncelleme başarısız oldu.");
      setMessage("Profil güncellendi.");
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
        <Label htmlFor="fullName">Ad Soyad</Label>
        <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="title">Unvan</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn. Yazılım Geliştirici" />
      </div>
      <ImageUploader
        label="Profil Fotoğrafı"
        category="avatars"
        aspect={1}
        value={avatarUrl}
        onChange={setAvatarUrl}
      />
      <div>
        <Label htmlFor="bio">Hakkında</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
