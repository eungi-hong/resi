import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { getYouthMetrics } from "@/src/lib/data/dbBacked";

export default async function ProgressPage() {
  const user = await getCurrentDemoUser("YOUTH");
  const metrics = await getYouthMetrics(user.id);
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  return (
    <YouthShell>
      <section className="avatar-scene" style={{ marginBottom: 18 }}>
        <PageHeader title="Your progress" kicker="Explainable learning">These progress measures show what you are building, not a grade or diagnosis.</PageHeader>
        <ResiAvatar character={character} cue="dashboard_pointer" size="lg" />
      </section>
      <div className="grid grid-3">
        {metrics.map((metric, index) => <MetricCard key={`${metric.topic}-${metric.dimension}`} label={`${metric.topic} ${metric.dimension === "FUNCTIONAL" ? "Understand" : metric.dimension === "INTERACTIVE" ? "Practise" : "Question"}`} value={metric.score} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />)}
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h2>Evidence</h2>
        {metrics.map((metric) => <p key={metric.dimension}><strong>{metric.dimension === "FUNCTIONAL" ? "Understand" : metric.dimension === "INTERACTIVE" ? "Practise" : "Question"}</strong>: {metric.evidence.join(", ")}. Confidence {Math.round(metric.confidence * 100)}%.</p>)}
      </div>
    </YouthShell>
  );
}
