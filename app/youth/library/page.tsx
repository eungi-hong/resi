import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { educationMaterials } from "@/src/data/demoData";

export default function LibraryPage() {
  const byTopic = Array.from(new Map(educationMaterials.map((material) => [material.topic, material])).values());
  return (
    <YouthShell>
      <PageHeader title="Learning library" kicker="Self-adaptive materials">Sample Singapore-context materials are marked SAMPLE until reviewed by official sources.</PageHeader>
      <div className="grid grid-3">
        {byTopic.map((material) => (
          <Link className="card" href={`/youth/library/${material.topic}`} key={material.topic}>
            <span className="badge">{material.sourceStatus}</span>
            <h2>{material.title.split(":")[0]}</h2>
            <p className="muted">{material.summary}</p>
          </Link>
        ))}
      </div>
    </YouthShell>
  );
}
