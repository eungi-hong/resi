import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";
import { demoAlerts } from "@/src/data/demoData";

export default async function AlertsPage({ params }: { params: Promise<{ youthId: string }> }) {
  const { youthId } = await params;
  const alerts = demoAlerts.filter((alert) => alert.youthUserId === youthId);
  return (
    <ParentShell>
      <PageHeader title="Risk alerts" kicker="Supportive response">Alerts summarize why support may help without exposing private transcripts.</PageHeader>
      <div className="grid">
        {alerts.map((alert) => (
          <div className="card" key={alert.id}>
            <span className="badge warn">{alert.severity}</span>
            <h2>{alert.title}</h2>
            <p>{alert.summary}</p>
            <h3>Recommended response</h3>
            <ul>{alert.recommendedActions.map((action) => <li key={action}>{action}</li>)}</ul>
            <p className="muted">What not to say: avoid blame, threats, or “everyone knows this already.”</p>
          </div>
        ))}
      </div>
    </ParentShell>
  );
}
