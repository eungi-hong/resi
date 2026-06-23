import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { initialMetrics } from "@/src/data/demoData";
import { getCurrentDemoUser } from "@/src/lib/auth/session";

export default async function ProgressPage() {
  const user = await getCurrentDemoUser("YOUTH");
  const metrics = initialMetrics[user.id] ?? initialMetrics.asha;
  return (
    <YouthShell>
      <PageHeader title="Progress" kicker="Explainable literacy">Scores move slowly and keep evidence so parents and admins can understand trends.</PageHeader>
      <div className="grid grid-3">
        {metrics.map((metric, index) => <MetricCard key={`${metric.topic}-${metric.dimension}`} label={`${metric.topic} ${metric.dimension.toLowerCase()}`} value={metric.score} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />)}
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h2>Evidence</h2>
        {metrics.map((metric) => <p key={metric.dimension}><strong>{metric.dimension}</strong>: {metric.evidence.join(", ")}. Confidence {Math.round(metric.confidence * 100)}%.</p>)}
      </div>
    </YouthShell>
  );
}
