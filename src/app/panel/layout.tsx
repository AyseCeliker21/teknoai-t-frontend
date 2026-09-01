import { SidebarNav } from "@/components/SidebarNav";

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <SidebarNav variant="panel" title="Üye Paneli" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
