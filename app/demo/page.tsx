import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function DemoPage() {
  return (
    <main className="page">
      <div className="app-container">
        <PageHeader title="resi live demo" kicker="Mode B">Use these routes to walk judges through the database-backed demo.</PageHeader>
        <div className="grid grid-4">
          <Link className="card" href="/demo/personalization"><h2>Personalization</h2><p className="muted">Switch youth profiles and age bands.</p></Link>
          <Link className="card" href="/youth/chat"><h2>Youth chat</h2><p className="muted">Ask a prompt and persist the conversation.</p></Link>
          <Link className="card" href="/parent/asha"><h2>Parent insight</h2><p className="muted">Show summaries and support alerts.</p></Link>
          <Link className="card" href="/admin/analytics"><h2>Admin analytics</h2><p className="muted">Show aggregate trends and privacy suppression.</p></Link>
        </div>
      </div>
    </main>
  );
}
