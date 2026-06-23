import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";

export default function ParentSettingsPage() {
  return (
    <ParentShell>
      <PageHeader title="Parent settings" kicker="Privacy posture">Choose a co-management level with clear youth-facing disclosure.</PageHeader>
      <div className="card grid">
        <label>Visibility level<select className="select" defaultValue="MEDIUM"><option>Low: summaries only</option><option>Medium: summaries + selected alerts</option><option>High: alerts + recommended actions</option></select></label>
        <label>Notification style<select className="select" defaultValue="weekly"><option>Weekly digest</option><option>Immediate high-risk alerts</option><option>Digest plus high-risk alerts</option></select></label>
      </div>
    </ParentShell>
  );
}
