"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";

export default function TrustedAdultPage() {
  const [topic, setTopic] = useState("peer pressure around vaping");
  return (
    <YouthShell>
      <section className="avatar-scene" style={{ marginBottom: 18 }}>
        <PageHeader title="Prepare to talk" kicker="Trusted adult support">Generate a simple script for a parent, teacher, counsellor, or doctor.</PageHeader>
        <ResiAvatar character="See" cue="writing" size="lg" />
      </section>
      <div className="grid grid-2">
        <div className="card grid">
          <label>I want to talk about<textarea className="textarea" value={topic} onChange={(event) => setTopic(event.target.value)} /></label>
        </div>
        <div className="card">
          <h2>Script</h2>
          <p>I want to talk about {topic}. I am not looking to get judged. I want help understanding what is safe and what I can do next.</p>
          <h3>Questions</h3>
          <p className="muted">What should I watch out for? Who else can help? Can we make a plan together?</p>
        </div>
      </div>
    </YouthShell>
  );
}
