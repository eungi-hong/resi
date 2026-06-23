import { PortalNav } from "@/components/PortalNav";

export default function ParentShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page">
      <div className="container portal-layout">
        <PortalNav portal="parent" />
        <section>{children}</section>
      </div>
    </main>
  );
}
