import { PortalNav } from "@/components/PortalNav";
import Link from "next/link";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page dashboard-page admin-page">
      <div className="wide-container portal-layout">
        <PortalNav portal="admin" />
        <section>
          <div className="demo-gate">
            <strong>Demo admin access</strong>
            <span>Aggregate analytics are available directly in demo mode.</span>
            <Link className="ghost-button" href="/api/demo-login?username=admin&next=/admin">Continue as Demo Admin</Link>
            <Link href="/login">Back to role selection</Link>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
