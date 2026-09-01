import { SidebarNav } from "@/components/SidebarNav";
import { getSessionUser } from "@/lib/session";

export default async function AdminLayout({ children }: LayoutProps<"/yonetim">) {
  const user = await getSessionUser();
  const isYonetici = user?.roles.includes("Yonetici") ?? false;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <SidebarNav variant="yonetim" title="Yönetim Paneli" contentOnly={!isYonetici} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
