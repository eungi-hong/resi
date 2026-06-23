import Link from "next/link";
import { BookOpen, MessageCircle, MessagesSquare, TimerReset } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { aggregateYouthMetrics } from "@/src/lib/ai/healthLiteracyMetrics";
import { getRecommendedMaterials, initialMetrics } from "@/src/data/demoData";
import { getCurrentDemoUser } from "@/src/lib/auth/session";

const youthLabels = {
  FUNCTIONAL: "Understand",
  INTERACTIVE: "Practise",
  CRITICAL: "Question"
} as const;

export default async function YouthDashboard() {
  const user = await getCurrentDemoUser("YOUTH");
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const ageBand = user.ageBand ?? "TEEN_13_15";
  const metrics = aggregateYouthMetrics(initialMetrics[user.id] ?? initialMetrics.asha);
  const recommended = getRecommendedMaterials(user.id);
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
            <Link className="ghost-button" href="/youth/quiz"><TimerReset size={18} /> Take a 3-minute quiz</Link>
          </div>
        </div>
        <ResiAvatar character={character} cue="wave" size="xl" />
      </section>

      <div className="section-title">
        <h2>Current quests</h2>
        <Link href="/youth/library">View all modules</Link>
      </div>
      <div className="grid grid-3">
        {[
          ["Vaping", "Handling peer pressure", "Practise a refusal script", "thinking"],
          ["Screen time", "Sleep reset", "Build a boundary you control", "resource"],
          ["Mental health", "Checking online claims", "Separate labels from diagnosis", "listening"]
        ].map(([topic, title, summary, cue]) => (
          <Link className="card topic-card" href="/youth/library" key={topic}>
            <div>
              <span className="badge">{topic}</span>
              <h2>{title}</h2>
              <p className="muted">{summary}</p>
              <div className="bar"><span style={{ width: topic === "Vaping" ? "48%" : "32%" }} /></div>
            </div>
            <ResiAvatar character={character} cue={cue as any} size="sm" showMissingNotice={false} />
          </Link>
        ))}
      </div>

      <div className="section-title">
        <h2>Your progress measures</h2>
        <span className="muted">Nutbeam model, translated into youth-friendly goals</span>
      </div>
      <div className="grid grid-3">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.dimension} label={youthLabels[metric.dimension]} value={metric.average} tone={index === 1 ? "blue" : index === 2 ? "gold" : "primary"} />
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
