import Link from "next/link";
import { AcknowledgeAlertButton } from "@/components/AcknowledgeAlertButton";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";
import { getDemoUser, getParentInsight, getYouthAlerts, getYouthMetrics } from "@/src/lib/data/dbBacked";

const labelFor = {
  FUNCTIONAL: "Understands health information",
  INTERACTIVE: "Uses information and asks for support",
  CRITICAL: "Questions misinformation and peer pressure"
} as const;

export default async function YouthInsightPage({ params }: { params: Promise<{ youthId: string }> }) {
  const { youthId } = await params;
  const youth = await getDemoUser(youthId, "YOUTH");
  const metrics = await getYouthMetrics(youth.id);
  const insight = await getParentInsight(youth.id);
  const alerts = await getYouthAlerts(youth.id);
  return (
    <ParentShell>
      <PageHeader title={`${youth.name} support overview`} kicker="Summary-based visibility">resi protects youth autonomy. You see supportive summaries and safety alerts, not private chat logs by default.</PageHeader>
      <div className="grid grid-3">
        {metrics.map((metric, index) => <MetricCard key={metric.dimension} label={labelFor[metric.dimension]} value={metric.score} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />)}
      </div>
      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <h2>What your child may be working through</h2>
          <p>{insight.summary}</p>
          <h3>Strengths</h3>
          <ul>{insight.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>Growth areas</h3>
          <ul>{insight.growthAreas.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="card">
          <h2>How you can support</h2>
          <p>{insight.approach}</p>
          <h3>Suggested conversation starters</h3>
          <ul>{insight.starters.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="chip-row"><Link className="button" href={`/parent/${youth.id}/conversation-guides`}>Conversation guide</Link><Link className="ghost-button" href={`/parent/${youth.id}/alerts`}>Support alerts</Link></div>
        </div>
      </div>
      {alerts.map((alert) => (
        <div className="card" style={{ marginTop: 18 }} key={alert.id}>
          <span className="badge warn">{alert.severity}</span>
          <h2>{alert.title}</h2>
          <p className="muted">{alert.summary}</p>
          <AcknowledgeAlertButton alertId={alert.id} initialStatus={alert.status} />
        </div>
      ))}
    </ParentShell>
  );
}
