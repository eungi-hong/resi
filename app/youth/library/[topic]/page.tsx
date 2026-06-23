import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { educationMaterials } from "@/src/data/demoData";

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const materials = educationMaterials.filter((material) => material.topic === topic);
  const title = materials[0]?.title.split(":")[0] ?? "Topic";
  return (
    <YouthShell>
      <PageHeader title={title} kicker="Topic detail">Choose the version that fits your age and confidence level.</PageHeader>
      <div className="grid">
        {materials.map((material) => (
          <article className="card" key={material.id}>
            <div className="chip-row"><span className="badge">{material.ageBand.replaceAll("_", " ").toLowerCase()}</span><span className="badge">{material.sourceStatus}</span></div>
            <h2>{material.title}</h2>
            <p>{material.content}</p>
            <p className="muted">{material.localContextNote}</p>
          </article>
        ))}
      </div>
      <div className="chip-row" style={{ marginTop: 16 }}>
        <Link className="button" href="/youth/quiz">Take quiz</Link>
        <Link className="ghost-button" href="/youth/trusted-adult">Prepare a conversation</Link>
      </div>
    </YouthShell>
  );
}
