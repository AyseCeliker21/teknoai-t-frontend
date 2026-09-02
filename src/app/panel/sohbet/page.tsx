import { apiFetch } from "@/lib/api";
import { getAccessToken, getSessionUser } from "@/lib/session";
import type { ChatConversation } from "@/lib/types";
import { ChatPanel } from "@/components/ChatPanel";

export const metadata = { title: "Sohbet | TeknoAI-T" };

export default async function ChatPage() {
  const token = await getAccessToken();
  const user = await getSessionUser();
  const conversations = await apiFetch<ChatConversation[]>("/api/chat/conversations", { token }).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Sohbet</h1>
      <p className="mt-1 text-muted">Arkadaşın olan üyelerle gerçek zamanlı sohbet et.</p>
      <div className="mt-6">
        <ChatPanel currentUserId={user!.id} initialConversations={conversations} />
      </div>
    </div>
  );
}
