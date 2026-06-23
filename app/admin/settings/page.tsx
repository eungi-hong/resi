import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <PageHeader title="Admin settings" kicker="Governance">Configure safety thresholds, source review, and analytics privacy.</PageHeader>
      <div className="grid grid-2">
        <div className="card"><h2>Minimum group threshold</h2><input className="input" defaultValue="5" /></div>
        <div className="card"><h2>Content review mode</h2><select className="select" defaultValue="human"><option>Human review required</option><option>Draft only</option></select></div>
      </div>
    </AdminShell>
  );
}
