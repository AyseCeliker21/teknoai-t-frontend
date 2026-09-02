import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { GrantListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, grantCategoryLabel, formatDate } from "@/lib/utils";
import { GrantForm } from "@/components/GrantForm";

export const metadata = { title: "Hibelerim / Fonlarım | TeknoAI-T" };

export default async function MyGrantsPage() {
  const token = await getAccessToken();
  const grants = await apiFetch<GrantListItem[]>("/api/grants/mine", { token }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Hibelerim / Fonlarım</h1>
        <p className="mt-1 text-muted">Paylaştığın hibe/fon ilanları admin onayından sonra yayınlanır.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Hibe / Fon</h2>
        <GrantForm />
      </Card>

      <div className="space-y-3">
        {grants.length === 0 && <p className="text-muted">Henüz hibe/fon ilanı paylaşmadın.</p>}
        {grants.map((g) => (
          <Card key={g.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{g.title}</h3>
              <p className="text-sm text-muted">
                {grantCategoryLabel(g.category)} · {g.organization} · {formatDate(g.createdAtUtc)}
              </p>
            </div>
            <Badge variant={statusVariant(g.status)}>{statusLabel(g.status)}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
