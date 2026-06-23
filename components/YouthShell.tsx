import { PortalNav } from "@/components/PortalNav";

export default function YouthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page youth-page">
      <div className="app-container portal-layout">
        <PortalNav portal="youth" />
        <section>{children}</section>
      </div>
    </main>
  );
}
