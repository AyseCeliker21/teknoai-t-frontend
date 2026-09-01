import { WhatsAppQrPanel } from "@/components/WhatsAppQrPanel";

export const metadata = { title: "WhatsApp Bot | Yönetim | TeknoAI-T" };

export default function AdminWhatsAppPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">WhatsApp Bot Bağlantısı</h1>
      <p className="mt-1 text-muted">
        Telefon doğrulama, şifre sıfırlama ve topluluk duyuruları için kullanılan WPPConnect botunun
        WhatsApp Web oturumunu buradan bağlayabilirsin.
      </p>

      <div className="mt-8 max-w-md">
        <WhatsAppQrPanel />
      </div>
    </div>
  );
}
