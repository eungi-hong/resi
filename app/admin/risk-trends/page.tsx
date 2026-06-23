import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";

export default function RiskTrendsPage() {
  return (
    <AdminShell>
      <PageHeader title="Risk trends" kicker="Aggregate vulnerability">Demo trends help explain the safety model without identifying youth.</PageHeader>
      <div className="grid grid-3">
        {["Vaping peer pressure", "AI dependency", "Online self-diagnosis", "Sleep and scrolling", "Body image", "Misinformation"].map((trend, index) => (
          <div className="card" key={trend}><span className={`badge ${index < 2 ? "warn" : ""}`}>{index < 2 ? "watch" : "stable"}</span><h2>{trend}</h2><p className="muted">Synthetic count: {18 - index * 2}. Groups below 5 are hidden.</p></div>
        ))}
      </div>
    </AdminShell>
  );
}
