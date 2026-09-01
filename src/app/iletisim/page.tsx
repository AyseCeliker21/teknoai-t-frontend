import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Card } from "@/components/ui/Card";
import { Mail, LifeBuoy } from "lucide-react";

export const metadata = { title: "İletişim | TeknoAI-T" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="İletişim"
        description="Sorularınız, önerileriniz veya iş birlikleri için bize ulaşın."
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <ContactForm />
        </Card>

        <div className="space-y-4">
          <Card className="flex items-start gap-3 p-5">
            <Mail size={20} className="mt-0.5 text-accent-hover" />
            <div>
              <h3 className="font-semibold">Genel İletişim</h3>
              <p className="mt-1 text-sm text-muted">
                Formu doldurun, ekibimiz en kısa sürede size dönüş yapacaktır.
              </p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <LifeBuoy size={20} className="mt-0.5 text-accent-hover" />
            <div>
              <h3 className="font-semibold">Teknik Destek</h3>
              <p className="mt-1 text-sm text-muted">
                Üye misiniz? Panelinizden destek talebi açarak ekiple doğrudan yazışabilirsiniz.
              </p>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}
