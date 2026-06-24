import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function DemoPage() {
  return (
    <main className="page">
      <div className="app-container">
        <PageHeader title="resi live demo" kicker="Judge path">Start with the youth experience, then show parent support and aggregate admin insight.</PageHeader>
        <div className="grid grid-4 demo-path">
          <Link className="card" href="/api/demo-login?username=asha&next=/youth/chat"><span className="badge">1</span><h2>Ask resi</h2><p className="muted">Open Asha&apos;s youth chat with the demo session already set.</p></Link>
          <Link className="card" href="/api/demo-login?username=asha&next=/youth"><span className="badge">2</span><h2>Learn safely</h2><p className="muted">Open the youth dashboard with quests, progress, and safe next steps.</p></Link>
          <Link className="card" href="/api/demo-login?username=parent&next=/parent/asha"><span className="badge">3</span><h2>Parent support</h2><p className="muted">Show summaries and alerts without exposing private chat logs.</p></Link>
          <Link className="card" href="/api/demo-login?username=admin&next=/admin/analytics"><span className="badge">4</span><h2>Admin insight</h2><p className="muted">Show aggregate trends and small-group privacy suppression.</p></Link>
        </div>
        <div className="card demo-note">
          <h2>Optional profile switch</h2>
          <p className="muted">Use this only if judges ask how the experience changes by age, language, or avatar.</p>
          <Link className="ghost-button" href="/demo/personalization">Open personalization demo</Link>
        </div>
      </div>
    </main>
  );
}
