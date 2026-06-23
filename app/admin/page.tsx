import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";

export default function AdminDashboard() {
  return (
    <AdminShell>
      <PageHeader title="Admin dashboard" kicker="Aggregate analytics">Understand population-level youth health literacy trends while protecting individual privacy.</PageHeader>
      <div className="grid grid-4">
        <MetricCard label="Functional avg" value={67} />
        <MetricCard label="Interactive avg" value={54} tone="blue" />
        <MetricCard label="Critical avg" value={49} tone="gold" />
        <div className="card"><span className="muted">Small-group rule</span><strong className="metric-value">5+</strong><p className="muted">Slices below threshold are suppressed.</p></div>
      </div>
      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <Link className="card" href="/admin/analytics"><h2>Analytics</h2><p className="muted">Literacy by topic, risk trends, language distribution, and content effectiveness proxies.</p></Link>
        <Link className="card" href="/admin/content"><h2>Content management</h2><p className="muted">Review sample materials, add source URLs, and mark official content.</p></Link>
      </div>
    </AdminShell>
  );
}
