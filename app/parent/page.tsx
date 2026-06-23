import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";
import { demoAlerts, getYouthUsers, initialMetrics } from "@/src/data/demoData";
import { aggregateYouthMetrics } from "@/src/lib/ai/healthLiteracyMetrics";

export default function ParentDashboard() {
  const linked = getYouthUsers().filter((user) => ["asha", "nabil"].includes(user.id));
  return (
    <ParentShell>
      <PageHeader title="Parent dashboard" kicker="Support without surveillance">Support your child’s health literacy without taking away their autonomy.</PageHeader>
      <div className="grid grid-2">
        {linked.map((youth) => {
          const metric = aggregateYouthMetrics(initialMetrics[youth.id] ?? [])[0]?.average ?? 0;
          return (
            <Link className="card" href={`/parent/${youth.id}`} key={youth.id}>
              <span className="badge">{youth.age} years old</span>
              <h2>{youth.name}</h2>
              <p className="muted">Recent themes: vaping, screen time, trusted-adult preparation.</p>
              <div className="bar"><span style={{ width: `${metric}%` }} /></div>
            </Link>
          );
        })}
      </div>
      <div className="grid grid-3" style={{ marginTop: 18 }}>
        <MetricCard label="Functional trend" value={62} />
        <MetricCard label="Interactive trend" value={48} tone="blue" />
        <MetricCard label="Critical trend" value={42} tone="gold" />
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h2>Open alerts</h2>
        {demoAlerts.map((alert) => <p key={alert.id}><span className="badge warn">{alert.severity}</span> {alert.title}</p>)}
      </div>
    </ParentShell>
  );
}
