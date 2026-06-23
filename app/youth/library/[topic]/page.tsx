import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { educationMaterials } from "@/src/data/demoData";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import type { AgeBand } from "@/src/lib/types";

export default async function TopicPage({ params, searchParams }: { params: Promise<{ topic: string }>; searchParams?: Promise<{ ageBand?: AgeBand }> }) {
  const { topic } = await params;
  const query = await searchParams;
  const user = await getCurrentDemoUser("YOUTH");
  const ageBand = query?.ageBand ?? user.ageBand ?? "TEEN_13_15";
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const material = educationMaterials.find((item) => item.topic === topic && item.ageBand === ageBand) ?? educationMaterials.find((item) => item.topic === topic)!;
  return (
    <YouthShell>
      <section className="avatar-scene">
        <div>
          <PageHeader title={material.title.split(":")[0]} kicker={`${material.goalLabel} · ${material.estimatedMinutes} min`}>
            {material.summary}
          </PageHeader>
          <div className="chip-row">
            <Link className="button" href="/youth/chat">Ask resi about this</Link>
            <Link className="ghost-button" href="/youth/quiz">Start quiz</Link>
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
          ["Quick explainer", material.quickExplainer],
          ["Scenario", material.scenario],
          ["Skills practice", material.practiceActivity?.join(" · ")],
          ["Myth check", `Myth: ${material.mythCheck?.myth} Reality: ${material.mythCheck?.reality}`],
          ["Talk to a trusted adult", material.trustedAdultScript],
          ["Quiz", "Try three short questions that update your Understand, Practise, and Question progress measures."]
        ].map(([title, body]) => (
          <section className="card" key={title}>
            <span className="badge">{title}</span>
            <p>{body}</p>
            {title === "Quick explainer" ? <div className="chip-row"><button className="ghost-button">Explain simpler</button><button className="ghost-button">Go deeper</button></div> : null}
          </section>
        ))}
      </div>
    </YouthShell>
  );
}
