import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";

export default function ResourcesPage() {
  return (
    <YouthShell>
      <PageHeader title="Resources" kicker="Placeholder">Admins can add reviewed Singapore sources here. The demo avoids inventing hotline numbers or policy details.</PageHeader>
      <div className="grid grid-2">
        {["Trusted adult", "School counsellor", "Healthcare professional", "Official health source"].map((item) => (
          <div className="card" key={item}><h2>{item}</h2><p className="muted">Add verified contact or source details before production use.</p></div>
        ))}
      </div>
    </YouthShell>
  );
}
