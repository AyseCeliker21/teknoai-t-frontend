import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value?: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    Pending: "Onay Bekliyor",
    Approved: "Onaylandı",
    Rejected: "Reddedildi",
    Open: "Açık",
    InProgress: "İşleniyor",
    Closed: "Kapatıldı",
    Planlaniyor: "Planlanıyor",
    DevamEdiyor: "Devam Ediyor",
    Tamamlandi: "Tamamlandı",
  };
  return map[status] ?? status;
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    Etkinlik: "Etkinlik",
    IsIlani: "İş İlanı",
    Duyuru: "Duyuru",
    Diger: "Diğer",
  };
  return map[category] ?? category;
}

export function grantCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    Girisimcilik: "Girişimcilik",
    Akademik: "Akademik",
    Teknoloji: "Teknoloji",
    Egitim: "Eğitim",
    Diger: "Diğer",
  };
  return map[category] ?? category;
}
