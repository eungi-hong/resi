import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getTopicMaterial } from "@/src/lib/data/dbBacked";
import type { AgeBand } from "@/src/lib/types";

export default async function TopicPage({ params, searchParams }: { params: Promise<{ topic: string }>; searchParams?: Promise<{ ageBand?: AgeBand }> }) {
  const { topic } = await params;
  const query = await searchParams;
  const user = await getCurrentDemoUser("YOUTH");
  const ageBand = query?.ageBand ?? user.ageBand ?? "TEEN_13_15";
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const material = await getTopicMaterial(topic, ageBand, "en");
  return (
    <YouthShell>
      <section className="avatar-scene">
        <div>
          <PageHeader title={material.title.split(":")[0]} kicker={`${material.goalLabel} · ${material.estimatedMinutes} min`}>
            {material.summary}
          </PageHeader>
          <div className="chip-row">
            <Link className="button" href="/youth/chat">Ask resi about this</Link>
            <Link className="ghost-button" href={`/youth/quiz?topic=${material.topic}&ageBand=${ageBand}`}>Start quiz</Link>
            <Link className="ghost-button" href={`/youth/library/${topic}?ageBand=${ageBand === "OLDER_TEEN_16_18" ? "TEEN_13_15" : "OLDER_TEEN_16_18"}`}>Preview another age version</Link>
          </div>
        </div>
        <ResiAvatar character={character} cue={material.avatarCue ?? "explaining"} size="lg" />
      </section>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <section className="card learning-section">
          <h2>What you will learn</h2>
          <ul>{material.whatYouLearn?.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="muted">{material.localContextNote}</p>
        </section>
        <section className="card learning-section">
          <h2>How this helps</h2>
          <p>You are building your ability to {material.goalLabel === "Understand" ? "understand health information" : material.goalLabel === "Practise" ? "use information in real situations" : "question claims, pressure, and misinformation"}.</p>
        </section>
      </div>

      <div className="learning-tabs" style={{ marginTop: 18 }}>
        {[
          ["Learn the core idea", material.quickExplainer],
          ["Try a realistic situation", material.scenario],
          ["Choose words you can use", material.practiceActivity?.join(" · ")],
          ["Check a common myth", `Myth: ${material.mythCheck?.myth} Reality: ${material.mythCheck?.reality}`],
          ["Prepare support", material.trustedAdultScript],
          ["Check your understanding", "Take a topic-specific quiz with factual, scenario, source-checking, and trusted-adult questions."]
        ].map(([title, body]) => (
          <section className="card" key={title}>
            <span className="badge">{title}</span>
            <p>{body}</p>
            {title === "Check your understanding" ? <Link className="button" href={`/youth/quiz?topic=${material.topic}&ageBand=${ageBand}`}>Start topic quiz</Link> : null}
          </section>
        ))}
      </div>
    </YouthShell>
  );
}
