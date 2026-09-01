import { TicketThread } from "@/components/TicketThread";

export default async function MyTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TicketThread ticketId={id} isAdmin={false} />;
}
