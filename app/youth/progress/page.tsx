import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { getYouthMetrics } from "@/src/lib/data/dbBacked";
import type { LiteracyDimension } from "@/src/lib/types";

const dimensionCopy: Record<LiteracyDimension, { label: string; description: string }> = {
  FUNCTIONAL: {
    label: "Understanding facts",
    description: "Can explain the core health idea in your own words."
  },
  INTERACTIVE: {
    label: "Using skills in real life",
    description: "Can choose safe next steps, ask for support, and practise what to say."
  },
  CRITICAL: {
    label: "Checking claims and pressure",
    description: "Can question online claims, social pressure, and missing evidence."
  }
};

function topicLabel(topic: string) {
  return topic.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

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
        {metrics.map((metric, index) => {
          const copy = dimensionCopy[metric.dimension];
          return <MetricCard key={`${metric.topic}-${metric.dimension}`} label={copy.label} value={metric.score} description={`${topicLabel(metric.topic)} focus. ${copy.description}`} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />;
        })}
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h2>Why these scores changed</h2>
        {metrics.map((metric) => <p key={metric.dimension}><strong>{dimensionCopy[metric.dimension].label}</strong>: {metric.evidence.join(", ")}. Evidence confidence {Math.round(metric.confidence * 100)}%.</p>)}
      </div>
    </YouthShell>
  );
}
