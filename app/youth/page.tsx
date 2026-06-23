import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { aggregateYouthMetrics } from "@/src/lib/ai/healthLiteracyMetrics";
import { educationMaterials, initialMetrics } from "@/src/data/demoData";
import { getCurrentDemoUser } from "@/src/lib/auth/session";

export default async function YouthDashboard() {
  const user = await getCurrentDemoUser("YOUTH");
  const metrics = aggregateYouthMetrics(initialMetrics[user.id] ?? initialMetrics.asha);
  const recommended = educationMaterials.slice(0, 3);
  return (
    <YouthShell>
      <PageHeader title={`Hi ${user.name}`} kicker="Youth portal">You control your learning. Safety concerns may be shared to help keep you safe.</PageHeader>
      <div className="grid grid-2">
        <div className="card">
          <div className="grid grid-2">
            <div>
              <h2>Today’s quest</h2>
              <p className="lead">Practise a low-pressure way to respond if a friend offers a vape.</p>
              <div className="chip-row"><Link className="button" href="/youth/chat">Ask resi</Link><Link className="ghost-button" href="/youth/quiz">Quiz me</Link></div>
            </div>
            <Avatar character="See" cue="wave" />
          </div>
        </div>
        <div className="grid">
          {metrics.map((metric, index) => <MetricCard key={metric.dimension} label={metric.dimension.toLowerCase()} value={metric.average} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />)}
        </div>
      </div>
      <div className="grid grid-3" style={{ marginTop: 18 }}>
        {recommended.map((material) => (
          <Link className="card" href={`/youth/library/${material.topic}`} key={material.id}>
            <span className="badge">{material.literacyDimension.toLowerCase()}</span>
            <h3>{material.title}</h3>
            <p className="muted">{material.summary}</p>
          </Link>
        ))}
      </div>
    </YouthShell>
  );
}
