import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { AdminDashboardStats } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Users, PenLine, Megaphone, LifeBuoy, Mail, Newspaper, FolderGit2 } from "lucide-react";

export const metadata = { title: "Yönetim Paneli | TeknoAI-T" };

export default async function AdminDashboardPage() {
  const token = await getAccessToken();
  const stats = await apiFetch<AdminDashboardStats>("/api/admin/stats", { token }).catch(
    () =>
      ({
        totalUsers: 0,
        pendingArticles: 0,
        pendingListings: 0,
        openSupportTickets: 0,
        unreadContactMessages: 0,
        totalNewsPosts: 0,
        totalProjects: 0,
      }) as AdminDashboardStats
  );

  const tiles = [
    { label: "Toplam Üye", value: stats.totalUsers, icon: Users },
    { label: "Onay Bekleyen Makale", value: stats.pendingArticles, icon: PenLine },
    { label: "Onay Bekleyen İlan", value: stats.pendingListings, icon: Megaphone },
    { label: "Açık Destek Talebi", value: stats.openSupportTickets, icon: LifeBuoy },
    { label: "Okunmamış İletişim Mesajı", value: stats.unreadContactMessages, icon: Mail },
    { label: "Toplam Haber", value: stats.totalNewsPosts, icon: Newspaper },
    { label: "Toplam Proje", value: stats.totalProjects, icon: FolderGit2 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Genel Bakış</h1>
      <p className="mt-1 text-muted">Topluluk platformunun anlık durumu.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.label} className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 text-accent-hover">
              <t.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{t.value}</p>
              <p className="text-sm text-muted">{t.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
