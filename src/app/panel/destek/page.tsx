import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { SupportTicketListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, formatDate } from "@/lib/utils";
import { NewTicketForm } from "@/components/NewTicketForm";

export const metadata = { title: "Destek | TeknoAI-T" };

export default async function MySupportTicketsPage() {
  const token = await getAccessToken();
  const tickets = await apiFetch<SupportTicketListItem[]>("/api/support/mine", { token }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Destek Taleplerim</h1>
        <p className="mt-1 text-muted">Ekibimizle doğrudan yazışabilirsin.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Destek Talebi</h2>
        <NewTicketForm />
      </Card>

      <div className="space-y-3">
        {tickets.length === 0 && <p className="text-muted">Henüz destek talebin yok.</p>}
        {tickets.map((t) => (
          <Link key={t.id} href={`/panel/destek/${t.id}`}>
            <Card className="flex flex-col gap-2 p-5 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">{t.subject}</h3>
                <p className="text-sm text-muted">
                  {formatDate(t.createdAtUtc)} · {t.messageCount} mesaj
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
