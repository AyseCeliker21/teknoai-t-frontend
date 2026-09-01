import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ListingListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, categoryLabel, formatDate } from "@/lib/utils";
import { ListingForm } from "@/components/ListingForm";

export const metadata = { title: "İlanlarım | TeknoAI-T" };

export default async function MyListingsPage() {
  const token = await getAccessToken();
  const listings = await apiFetch<ListingListItem[]>("/api/listings/mine", { token }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">İlanlarım</h1>
        <p className="mt-1 text-muted">Gönderdiğin ilanlar admin onayından sonra yayınlanır.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni İlan</h2>
        <ListingForm />
      </Card>

      <div className="space-y-3">
        {listings.length === 0 && <p className="text-muted">Henüz ilan göndermedin.</p>}
        {listings.map((l) => (
          <Card key={l.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{l.title}</h3>
              <p className="text-sm text-muted">
                {categoryLabel(l.category)} · {formatDate(l.createdAtUtc)}
              </p>
            </div>
            <Badge variant={statusVariant(l.status)}>{statusLabel(l.status)}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
