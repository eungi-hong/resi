import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";

export default function AdminDashboard() {
  return (
    <AdminShell>
      <PageHeader title="Public-health analytics overview" kicker="Aggregate, non-identifying">Understand population-level youth health literacy trends while protecting individual privacy.</PageHeader>
      <div className="filters">
        <label>Age band<select className="select" defaultValue="all"><option>All age bands</option><option>10-12</option><option>13-15</option><option>16-18</option></select></label>
        <label>Language<select className="select" defaultValue="all"><option>All languages</option><option>English</option><option>Mandarin</option><option>Malay</option><option>Tamil</option></select></label>
        <label>Topic<select className="select" defaultValue="all"><option>All topics</option><option>Vaping</option><option>Screen time</option><option>Mental health</option></select></label>
        <label>Date range<select className="select" defaultValue="30"><option>Last 30 days</option><option>Last quarter</option><option>Demo year</option></select></label>
      </div>
      <div className="grid grid-4">
        <MetricCard label="Average score: understanding health information" value={67} />
        <MetricCard label="Average score: applying information and seeking support" value={54} tone="blue" />
        <MetricCard label="Average score: evaluating misinformation and social pressure" value={49} tone="gold" />
        <div className="card kpi-card"><span className="muted">Small-group privacy rule</span><strong className="metric-value">5+ youth</strong><p className="muted">Segments below threshold show “Hidden for privacy.”</p></div>
      </div>
      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <Link className="card" href="/admin/analytics"><h2>Analytics workspace</h2><p className="muted">Topic-level literacy, support need trends, language distribution, and content effectiveness proxies.</p></Link>
        <Link className="card" href="/admin/content"><h2>Education content library</h2><p className="muted">Manage age-specific, multilingual health literacy materials and review status.</p></Link>
      </div>
    </AdminShell>
  );
}
