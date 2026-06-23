import { PortalNav } from "@/components/PortalNav";
import Link from "next/link";

export default function ParentShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page dashboard-page parent-page">
      <div className="dashboard-container portal-layout">
        <PortalNav portal="parent" />
        <section>
          <div className="demo-gate">
            <strong>Demo parent access</strong>
            <span>Open directly for hackathon review, or set the demo cookie for the parent role.</span>
            <Link className="ghost-button" href="/api/demo-login?username=parent&next=/parent">Continue as Demo Parent</Link>
            <Link href="/login">Back to role selection</Link>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
