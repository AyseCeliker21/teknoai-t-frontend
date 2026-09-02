import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { AuditLogEntry, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Denetim Kayıtları | Yönetim | TeknoAI-T" };

const actionLabels: Record<string, string> = {
  ApproveGrant: "Hibe/Fon onayladı",
  RejectGrant: "Hibe/Fon reddetti",
  ApproveListing: "İlan onayladı",
  RejectListing: "İlan reddetti",
  UpdateRoles: "Rolleri güncelledi",
  LockUser: "Kullanıcıyı kilitledi",
  UnlockUser: "Kullanıcının kilidini açtı",
  DeleteUser: "Kullanıcıyı sildi",
};

export default async function AdminAuditLogPage() {
  const token = await getAccessToken();
  const result = await apiFetch<PagedResult<AuditLogEntry>>("/api/admin/audit-log?page=1&pageSize=50", {
    token,
  }).catch(() => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<AuditLogEntry>);

  return (
    <div>
      <h1 className="text-2xl font-bold">Denetim Kayıtları</h1>
      <p className="mt-1 text-muted">Yönetim panelinde yapılan işlemlerin geçmişi.</p>

      <div className="mt-8 space-y-2">
        {result.items.length === 0 && <p className="text-muted">Henüz kayıt yok.</p>}
        {result.items.map((log) => (
          <Card key={log.id} className="p-4">
            <p className="text-sm">
              <strong>{log.actorName}</strong> · {actionLabels[log.action] ?? log.action}
              {log.details && <span className="text-muted"> — {log.details}</span>}
            </p>
            <p className="mt-1 text-xs text-muted">{formatDate(log.createdAtUtc)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
