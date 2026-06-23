import { PortalNav } from "@/components/PortalNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page">
      <div className="container portal-layout">
        <PortalNav portal="admin" />
        <section>{children}</section>
      </div>
    </main>
  );
}
