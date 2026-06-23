import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";
import { demoAlerts, getUser, initialMetrics } from "@/src/data/demoData";

export default async function YouthInsightPage({ params }: { params: Promise<{ youthId: string }> }) {
  const { youthId } = await params;
  const youth = getUser(youthId);
  const metrics = initialMetrics[youth.id] ?? [];
  return (
    <ParentShell>
      <PageHeader title={`${youth.name} insights`} kicker="Summary-based visibility">resi protects youth autonomy. You see supportive summaries and safety alerts, not private chat logs by default.</PageHeader>
      <div className="grid grid-3">
        {metrics.map((metric, index) => <MetricCard key={metric.dimension} label={metric.dimension.toLowerCase()} value={metric.score} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />)}
      </div>
      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <h2>Generated parent insight</h2>
          <p>{youth.name} has been exploring peer pressure around vaping and may need help practising low-pressure ways to say no.</p>
          <p className="muted">Suggested approach: start with curiosity, not accusation.</p>
        </div>
        <div className="card">
          <h2>Conversation starter</h2>
          <p>I noticed you’ve been learning about peer pressure. What do people your age usually find hard about saying no?</p>
          <div className="chip-row"><Link className="button" href={`/parent/${youth.id}/conversation-guides`}>More guides</Link><Link className="ghost-button" href={`/parent/${youth.id}/alerts`}>Alerts</Link></div>
        </div>
      </div>
      {demoAlerts.filter((alert) => alert.youthUserId === youth.id).map((alert) => (
        <div className="card" style={{ marginTop: 18 }} key={alert.id}>
          <span className="badge warn">{alert.severity}</span>
          <h2>{alert.title}</h2>
          <p className="muted">{alert.summary}</p>
        </div>
      ))}
    </ParentShell>
  );
}
