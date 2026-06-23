import { PortalNav } from "@/components/PortalNav";

export default function YouthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page">
      <div className="container portal-layout">
        <PortalNav portal="youth" />
        <section>{children}</section>
      </div>
    </main>
  );
}
