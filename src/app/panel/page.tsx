import { getSessionUser } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { MessageCircle, LifeBuoy } from "lucide-react";

export const metadata = { title: "Panelim | TeknoAI-T" };

export default async function PanelHomePage() {
  const user = await getSessionUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">Merhaba, {user?.fullName}</h1>
      <p className="mt-2 text-muted">Üye panelinden arkadaşlarınla sohbet edebilir, destek talebi açabilirsin.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Card className="p-5">
          <MessageCircle className="text-accent-hover" size={22} />
          <h3 className="mt-3 font-semibold">Sohbet</h3>
          <p className="mt-1 text-sm text-muted">Arkadaşın olan üyelerle gerçek zamanlı sohbet et.</p>
          <LinkButton href="/panel/sohbet" variant="secondary" size="sm" className="mt-4">
            Sohbete Git
          </LinkButton>
        </Card>
        <Card className="p-5">
          <LifeBuoy className="text-accent-hover" size={22} />
          <h3 className="mt-3 font-semibold">Destek Al</h3>
          <p className="mt-1 text-sm text-muted">Bir sorunla mı karşılaştın? Destek ekibimize ulaş.</p>
          <LinkButton href="/panel/destek" variant="secondary" size="sm" className="mt-4">
            Destek Taleplerim
          </LinkButton>
        </Card>
      </div>
    </div>
  );
}
