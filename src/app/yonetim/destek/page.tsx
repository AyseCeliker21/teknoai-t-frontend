import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { SupportTicketListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, formatDate } from "@/lib/utils";

export const metadata = { title: "Destek Talepleri | Yönetim | TeknoAI-T" };

export default async function AdminSupportPage() {
  const token = await getAccessToken();
  const tickets = await apiFetch<SupportTicketListItem[]>("/api/support/admin", { token }).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Destek Talepleri</h1>
      <p className="mt-1 text-muted">Tüm üyelerin destek taleplerini görüntüleyin ve yanıtlayın.</p>

      <div className="mt-8 space-y-3">
        {tickets.length === 0 && <p className="text-muted">Henüz destek talebi yok.</p>}
        {tickets.map((t) => (
          <Link key={t.id} href={`/yonetim/destek/${t.id}`}>
            <Card className="flex flex-col gap-2 p-5 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">{t.subject}</h3>
                <p className="text-sm text-muted">
                  {t.createdByName} · {formatDate(t.createdAtUtc)} · {t.messageCount} mesaj
                </p>
              </div>
              <Badge variant={statusVariant(t.status)}>{statusLabel(t.status)}</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
