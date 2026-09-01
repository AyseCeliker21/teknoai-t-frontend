import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ContactMessage } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { MarkReadButton } from "@/components/MarkReadButton";

export const metadata = { title: "İletişim Kutusu | Yönetim | TeknoAI-T" };

export default async function AdminContactPage() {
  const token = await getAccessToken();
  const messages = await apiFetch<ContactMessage[]>("/api/contact", { token }).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold">İletişim Kutusu</h1>
      <p className="mt-1 text-muted">İletişim formundan gelen mesajlar.</p>

      <div className="mt-8 space-y-3">
        {messages.length === 0 && <p className="text-muted">Henüz mesaj yok.</p>}
        {messages.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{m.subject}</h3>
                  {!m.isRead && <Badge variant="accent">Yeni</Badge>}
                </div>
                <p className="text-sm text-muted">
                  {m.fullName} ({m.email}) · {formatDate(m.createdAtUtc)}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{m.body}</p>
              </div>
              {!m.isRead && <MarkReadButton id={m.id} />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
