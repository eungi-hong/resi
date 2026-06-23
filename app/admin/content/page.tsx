import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";
import { educationMaterials } from "@/src/data/demoData";

const labelFor = {
  FUNCTIONAL: "Understanding",
  INTERACTIVE: "Applying support skills",
  CRITICAL: "Evaluating misinformation"
} as const;

export default function ContentPage() {
  return (
    <AdminShell>
      <PageHeader title="Education content library" kicker="Human review required">Manage age-specific, multilingual health literacy materials.</PageHeader>
      <div className="chip-row" style={{ marginBottom: 16 }}><Link className="button" href="/admin/content/new">Create material</Link></div>
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi-card"><span className="muted">Published learning modules</span><strong className="metric-value">{educationMaterials.length}</strong><p className="muted">Across 7 topics and 3 age bands.</p></div>
        <div className="card kpi-card"><span className="muted">Needs review</span><strong className="metric-value">{educationMaterials.length}</strong><p className="muted">All demo materials are marked Sample.</p></div>
        <div className="card kpi-card"><span className="muted">Age/language coverage</span><strong className="metric-value">3 age bands</strong><p className="muted">English seeded, multilingual architecture ready.</p></div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Title</th><th>Topic</th><th>Age band</th><th>Language</th><th>Literacy goal</th><th>Review status</th><th>Last updated</th><th>Actions</th></tr></thead>
          <tbody>{educationMaterials.slice(0, 14).map((material) => <tr key={material.id}><td>{material.title.split(":")[0]}</td><td>{material.topic}</td><td>{material.ageBand}</td><td>{material.language.toUpperCase()}</td><td>{labelFor[material.literacyDimension]}</td><td><span className="badge">{material.sourceStatus === "SAMPLE" ? "Sample" : material.sourceStatus}</span></td><td>Demo seed</td><td><Link href={`/youth/library/${material.topic}?ageBand=${material.ageBand}`}>Preview as youth</Link></td></tr>)}</tbody>
        </table>
      </div>
    </AdminShell>
  );
}
