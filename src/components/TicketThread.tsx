import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { SupportTicketDetail } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, formatDate } from "@/lib/utils";
import { ReplyForm } from "@/components/ReplyForm";
import { TicketStatusControl } from "@/components/TicketStatusControl";
import { cn } from "@/lib/utils";

export async function TicketThread({ ticketId, isAdmin }: { ticketId: string; isAdmin: boolean }) {
  const token = await getAccessToken();

  let ticket: SupportTicketDetail;
  try {
    ticket = await apiFetch<SupportTicketDetail>(`/api/support/${ticketId}`, { token });
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) notFound();
    throw err;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{ticket.subject}</h1>
          <p className="text-sm text-muted">
            {ticket.createdByName} · {formatDate(ticket.createdAtUtc)}
          </p>
        </div>
        {isAdmin ? (
          <TicketStatusControl ticketId={ticket.id} status={ticket.status} />
        ) : (
          <Badge variant={statusVariant(ticket.status)}>{statusLabel(ticket.status)}</Badge>
        )}
      </div>

      <div className="space-y-3">
        {ticket.messages.map((m) => (
          <Card
            key={m.id}
            className={cn(
              "max-w-[85%] p-4",
              m.isFromAdmin ? "ml-auto bg-accent/10 border-accent/30" : "bg-surface-2"
            )}
          >
            <p className="text-xs text-muted">
              {m.senderName} {m.isFromAdmin && "(Ekip)"} · {formatDate(m.createdAtUtc)}
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm">{m.body}</p>
          </Card>
        ))}
      </div>

      {ticket.status !== "Closed" && <ReplyForm ticketId={ticket.id} />}
    </div>
  );
}
