import { getSessionUser } from "@/lib/session";
import { ChatPanel } from "@/components/ChatPanel";
import { GuestChatPanel } from "@/components/GuestChatPanel";
import { Sparkles } from "lucide-react";

export const metadata = { title: "TeknoAI Asistan | TeknoAI-T" };

export default async function AssistantPage() {
  const user = await getSessionUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles size={24} className="text-accent-hover" />
        <h1 className="text-2xl font-bold">TeknoAI Asistan</h1>
      </div>
      {user ? <ChatPanel /> : <GuestChatPanel />}
    </div>
  );
}
