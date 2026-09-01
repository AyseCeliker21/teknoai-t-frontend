import { getSessionUser } from "@/lib/session";
import { ChatPanel } from "@/components/ChatPanel";
import { Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export const metadata = { title: "TeknoAI Asistan | TeknoAI-T" };

export default async function AssistantPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <Sparkles size={40} className="text-accent-hover" />
        <h1 className="mt-4 text-2xl font-bold">TeknoAI Asistan</h1>
        <p className="mt-2 text-muted">Asistanla sohbet edebilmek için giriş yapmalısın.</p>
        <LinkButton href="/giris?next=/asistan" className="mt-6">
          Giriş Yap
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles size={24} className="text-accent-hover" />
        <h1 className="text-2xl font-bold">TeknoAI Asistan</h1>
      </div>
      <ChatPanel />
    </div>
  );
}
