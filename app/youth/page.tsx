import Link from "next/link";
import { BookOpen, MessageCircle, MessagesSquare, TimerReset } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { aggregateYouthMetrics } from "@/src/lib/ai/healthLiteracyMetrics";
import { getLearningMaterials, getYouthMetrics } from "@/src/lib/data/dbBacked";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import type { AvatarCue } from "@/src/lib/types";

const youthLabels = {
  FUNCTIONAL: "Understanding facts",
  INTERACTIVE: "Using skills in real life",
  CRITICAL: "Checking claims and pressure"
} as const;

const youthDescriptions = {
  FUNCTIONAL: "How confidently you explain key health ideas.",
  INTERACTIVE: "How confidently you choose safe next steps and ask for help.",
  CRITICAL: "How confidently you spot weak claims, pressure, and misinformation."
} as const;

export default async function YouthDashboard() {
  const user = await getCurrentDemoUser("YOUTH");
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const ageBand = user.ageBand ?? "TEEN_13_15";
  const [metricsRows, recommended] = await Promise.all([
    getYouthMetrics(user.id),
    getLearningMaterials(ageBand, "en")
  ]);
  const metrics = aggregateYouthMetrics(metricsRows);
  const ageText = ageBand === "CHILD_10_12" ? "ages 10-12" : ageBand === "TEEN_13_15" ? "ages 13-15" : "older teens 16-18";
  const heroCopy = ageBand === "CHILD_10_12"
    ? "Let us learn one simple health idea and one safe next step."
    : ageBand === "TEEN_13_15"
      ? "Want to build confidence around real health choices today?"
      : "Explore claims, tradeoffs, and next steps with more independence.";

  return (
    <YouthShell>
      <section className="avatar-scene">
        <div>
          <span className="badge">Personalized for {ageText}</span>
          <h1>Hi {user.name} — {heroCopy}</h1>
          <p className="lead">resi adapts by age, language, learning progress, and the kind of support you need.</p>
          <div className="chip-row">
            <Link className="button" href="/youth/chat"><MessageCircle size={18} /> Ask resi</Link>
            <Link className="ghost-button" href="/youth/library"><BookOpen size={18} /> Continue a quest</Link>
            <Link className="ghost-button" href="/youth/trusted-adult"><MessagesSquare size={18} /> Practise a conversation</Link>
            <Link className="ghost-button" href={`/youth/quiz?topic=vaping&ageBand=${ageBand}`}><TimerReset size={18} /> Take a topic quiz</Link>
          </div>
        </div>
        <ResiAvatar character={character} cue="wave" size="xl" />
      </section>

      <div className="section-title">
        <h2>Current quests</h2>
        <Link href="/youth/library">View all modules</Link>
      </div>
      <div className="grid grid-3">
        {([
          ["Vaping", "Handling peer pressure", "Practise a refusal script", "thinking"],
          ["Screen time", "Sleep reset", "Build a boundary you control", "resource"],
          ["Mental health", "Checking online claims", "Separate labels from diagnosis", "listening"]
        ] as [string, string, string, AvatarCue][]).map(([topic, title, summary, cue]) => (
          <Link className="card topic-card" href="/youth/library" key={topic}>
            <div>
              <span className="badge">{topic}</span>
              <h2>{title}</h2>
              <p className="muted">{summary}</p>
              <div className="bar"><span style={{ width: topic === "Vaping" ? "48%" : "32%" }} /></div>
            </div>
            <ResiAvatar character={character} cue={cue} size="sm" showMissingNotice={false} />
          </Link>
        ))}
      </div>

      <div className="section-title">
        <h2>Your progress measures</h2>
        <span className="muted">Nutbeam model, translated into youth-friendly goals</span>
      </div>
      <div className="grid grid-3">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.dimension} label={youthLabels[metric.dimension]} value={metric.average} description={youthDescriptions[metric.dimension]} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />
        ))}
      </div>

      <div className="section-title">
        <h2>Recommended for you</h2>
        <span className="badge">{ageText}</span>
      </div>
      <div className="grid grid-4">
        {recommended.map((material) => (
          <Link className="card topic-card" href={`/youth/library/${material.topic}?ageBand=${material.ageBand}`} key={material.id}>
            <div>
              <span className="badge">{material.goalLabel}</span>
              <h2>{material.title.split(":")[0]}</h2>
              <p className="muted">{material.summary}</p>
              <p className="muted">{material.estimatedMinutes} min · {material.difficulty}</p>
            </div>
            <ResiAvatar character={character} cue={material.avatarCue ?? "reading"} size="sm" showMissingNotice={false} />
          </Link>
        ))}
      </div>
    </YouthShell>
  );
}
