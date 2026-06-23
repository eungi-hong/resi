import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";
import { educationMaterials } from "@/src/data/demoData";

export default function ContentPage() {
  return (
    <AdminShell>
      <PageHeader title="Content management" kicker="Human review required">Drafts can be generated, but official review is required before production use.</PageHeader>
      <div className="chip-row" style={{ marginBottom: 16 }}><Link className="button" href="/admin/content/new">Add material</Link></div>
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card"><span className="muted">Sample drafts</span><strong className="metric-value">{educationMaterials.filter((material) => material.sourceStatus === "SAMPLE").length}</strong></div>
        <div className="card"><span className="muted">Languages</span><strong className="metric-value">4</strong><p className="muted">English fallback enabled.</p></div>
        <div className="card"><span className="muted">Review rule</span><strong className="metric-value">Human</strong><p className="muted">LLM drafts require approval.</p></div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Title</th><th>Age band</th><th>Dimension</th><th>Status</th><th>Preview</th></tr></thead>
          <tbody>{educationMaterials.slice(0, 12).map((material) => <tr key={material.id}><td>{material.title}</td><td>{material.ageBand}</td><td>{material.literacyDimension}</td><td>{material.sourceStatus}</td><td><Link href={`/youth/library/${material.topic}`}>Youth view</Link></td></tr>)}</tbody>
        </table>
      </div>
    </AdminShell>
  );
}
