import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getLearningMaterials } from "@/src/lib/data/dbBacked";

export default async function LibraryPage() {
  const user = await getCurrentDemoUser("YOUTH");
  const ageBand = user.ageBand ?? "TEEN_13_15";
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const materials = await getLearningMaterials(ageBand, user.languagePreference);
  return (
    <YouthShell>
      <section className="avatar-scene">
        <div>
          <PageHeader title="Learning library" kicker={`Previewing ${ageBand.replaceAll("_", " ").toLowerCase()} material`}>
            Short, age-specific modules for Singapore youth. Start with a scenario, practise a skill, then check a myth.
          </PageHeader>
          <div className="filters">
            <label><Search size={15} /> Search<input className="input" placeholder="vaping, sleep, TikTok..." /></label>
            <label>Topic<select className="select" defaultValue="all"><option value="all">All topics</option><option>Vaping</option><option>Screen time</option><option>Mental health</option></select></label>
            <label>Age band<select className="select" defaultValue={ageBand}><option>CHILD_10_12</option><option>TEEN_13_15</option><option>OLDER_TEEN_16_18</option></select></label>
            <label>Goal<select className="select" defaultValue="recommended"><option value="recommended">Recommended for me</option><option>Understand</option><option>Practise</option><option>Question</option></select></label>
          </div>
        </div>
        <ResiAvatar character={character} cue="reading" size="lg" />
      </section>

      <div className="grid grid-3" style={{ marginTop: 24 }}>
        {materials.map((material) => (
          <article className="card topic-card" key={material.id}>
            <div>
              <div className="chip-row">
                <span className="badge">{material.goalLabel}</span>
                <span className="badge">{material.estimatedMinutes} min</span>
              </div>
              <h2>{material.title.split(":")[0]}</h2>
              <p className="muted">{material.summary}</p>
              <div className="bar" aria-label={`${material.progress}% complete`}><span style={{ width: `${material.progress ?? 0}%` }} /></div>
              <div className="chip-row" style={{ marginTop: 12 }}>
                <Link className="button" href={`/youth/library/${material.topic}?ageBand=${material.ageBand}`}>Start scenario</Link>
                <Link className="ghost-button" href="/youth/quiz">Quiz me</Link>
              </div>
            </div>
            <ResiAvatar character={character} cue={material.avatarCue ?? "reading"} size="sm" showMissingNotice={false} />
          </article>
        ))}
      </div>
    </YouthShell>
  );
}
