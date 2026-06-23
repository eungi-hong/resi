import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";
import { demoAlerts, getYouthUsers, initialMetrics, parentInsights } from "@/src/data/demoData";
import { aggregateYouthMetrics } from "@/src/lib/ai/healthLiteracyMetrics";

const parentMetricLabels = {
  FUNCTIONAL: "Understands health information",
  INTERACTIVE: "Uses information and asks for support",
  CRITICAL: "Questions misinformation and peer pressure"
} as const;

export default function ParentDashboard() {
  const linked = getYouthUsers().filter((user) => ["asha", "nabil"].includes(user.id));
  return (
    <ParentShell>
      <PageHeader title="Parent support dashboard" kicker="Support without surveillance">You see supportive summaries and safety alerts, not private chat logs by default.</PageHeader>
      <div className="grid grid-2">
        {linked.map((youth) => {
          const metric = aggregateYouthMetrics(initialMetrics[youth.id] ?? [])[0]?.average ?? 0;
          const insight = parentInsights[youth.id as keyof typeof parentInsights];
          return (
            <Link className="card" href={`/parent/${youth.id}`} key={youth.id}>
              <span className="badge">{youth.name}, age {youth.age}</span>
              <h2>{insight?.summary ?? "Learning summary available"}</h2>
              <p className="muted">Recent themes: vaping, screen time, trusted-adult preparation.</p>
              <div className="bar"><span style={{ width: `${metric}%` }} /></div>
            </Link>
          );
        })}
      </div>
      <div className="grid grid-3" style={{ marginTop: 18 }}>
        <MetricCard label="Health understanding progress" value={62} />
        <MetricCard label="Real-world support skills" value={48} tone="blue" />
        <MetricCard label="Misinformation-checking progress" value={42} tone="gold" />
      </div>
      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <section className="card">
          <h2>How to read these measures</h2>
          {Object.entries(parentMetricLabels).map(([key, label]) => <p key={key}><strong>{label}</strong><br /><span className="muted">A summary measure based on quizzes, learning progress, and teach-back signals.</span></p>)}
        </section>
        <section className="card">
          <h2>Open support alerts</h2>
          {demoAlerts.map((alert) => <p key={alert.id}><span className={`badge ${alert.severity === "MODERATE" ? "warn" : ""}`}>{alert.severity}</span> {alert.title}</p>)}
        </section>
      </div>
    </ParentShell>
  );
}
