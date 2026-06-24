import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getLearningMaterials } from "@/src/lib/data/dbBacked";
import type { AgeBand } from "@/src/lib/types";

const ageBands: AgeBand[] = ["CHILD_10_12", "TEEN_13_15", "OLDER_TEEN_16_18"];

function topicLabel(topic: string) {
  return topic.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

export default async function LibraryPage({ searchParams }: { searchParams?: Promise<{ q?: string; topic?: string; ageBand?: AgeBand; goal?: string }> }) {
  const query = await searchParams;
  const user = await getCurrentDemoUser("YOUTH");
  const ageBand = ageBands.includes(query?.ageBand as AgeBand) ? query?.ageBand as AgeBand : user.ageBand ?? "TEEN_13_15";
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const materials = await getLearningMaterials(ageBand, "en");
  const search = query?.q?.trim().toLowerCase() ?? "";
  const topic = query?.topic ?? "all";
  const goal = query?.goal ?? "all";
  const topics = Array.from(new Set(materials.map((material) => material.topic))).sort();
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = !search || [material.title, material.summary, material.topic, material.localContextNote].some((value) => value.toLowerCase().includes(search));
    const matchesTopic = topic === "all" || material.topic === topic;
    const matchesGoal = goal === "all" || material.goalLabel === goal;
    return matchesSearch && matchesTopic && matchesGoal;
  });
  return (
    <YouthShell>
      <section className="avatar-scene">
        <div>
          <PageHeader title="Learning library" kicker={`Previewing ${ageBand.replaceAll("_", " ").toLowerCase()} material`}>
            Short, age-specific modules for Singapore youth. Start with a scenario, practise a skill, then check a myth.
          </PageHeader>
          <form className="filters" action="/youth/library">
            <label><Search size={15} /> Search<input className="input" name="q" defaultValue={query?.q ?? ""} placeholder="vaping, sleep, TikTok..." /></label>
            <label>Topic<select className="select" name="topic" defaultValue={topic}><option value="all">All topics</option>{topics.map((item) => <option key={item} value={item}>{topicLabel(item)}</option>)}</select></label>
            <label>Age band<select className="select" name="ageBand" defaultValue={ageBand}><option value="CHILD_10_12">Ages 10-12</option><option value="TEEN_13_15">Ages 13-15</option><option value="OLDER_TEEN_16_18">Ages 16-18</option></select></label>
            <label>Learning skill<select className="select" name="goal" defaultValue={goal}><option value="all">All skills</option><option value="Understand">Understand facts</option><option value="Practise">Practise decisions</option><option value="Question">Question claims</option></select></label>
            <button className="button" type="submit">Apply filters</button>
          </form>
        </div>
        <ResiAvatar character={character} cue="reading" size="lg" />
      </section>

      <div className="grid grid-3" style={{ marginTop: 24 }}>
        {filteredMaterials.map((material) => (
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
                <Link className="ghost-button" href={`/youth/quiz?topic=${material.topic}&ageBand=${material.ageBand}`}>Quiz me</Link>
              </div>
            </div>
            <ResiAvatar character={character} cue={material.avatarCue ?? "reading"} size="sm" showMissingNotice={false} />
          </article>
        ))}
      </div>
      {filteredMaterials.length === 0 ? <p className="card muted" style={{ marginTop: 18 }}>No modules match those filters. Try a broader topic or clear the search.</p> : null}
    </YouthShell>
  );
}
