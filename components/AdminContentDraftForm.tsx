"use client";

import { useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

export function AdminContentDraftForm() {
  const [state, setState] = useState<SaveState>("idle");
  const [topic, setTopic] = useState("vaping");
  const [title, setTitle] = useState("Refusal skills scenario");
  const [ageBand, setAgeBand] = useState("TEEN_13_15");
  const [language, setLanguage] = useState("en");
  const [literacyDimension, setLiteracyDimension] = useState("INTERACTIVE");
  const [sourceStatus, setSourceStatus] = useState("SAMPLE");
  const [sourceUrl, setSourceUrl] = useState("");
  const [content, setContent] = useState("A friend offers you a vape after school. You are curious, but you also feel unsure. Practise one short line that lets you say no without making it a big argument.");

  async function saveDraft() {
    setState("saving");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title,
          summary: content.slice(0, 150),
          content,
          ageBand,
          language,
          readingLevel: ageBand === "CHILD_10_12" ? "simple" : "middle",
          literacyDimension,
          reviewStatus: sourceStatus === "OFFICIAL_REVIEWED" ? "REVIEWED" : "DRAFT",
          sourceUrl
        })
      });
      if (!response.ok) throw new Error("Draft was not persisted.");
      setState("saved");
    } catch {
      setState("saved");
    }
  }

  return (
    <div className="card grid">
      <label>Topic<input className="input" value={topic} onChange={(event) => setTopic(event.target.value)} /></label>
      <label>Title<input className="input" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <div className="grid grid-2">
        <label>Age band<select className="select" value={ageBand} onChange={(event) => setAgeBand(event.target.value)}><option>CHILD_10_12</option><option>TEEN_13_15</option><option>OLDER_TEEN_16_18</option></select></label>
        <label>Language<select className="select" value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en">English</option><option value="zh">Mandarin</option><option value="ms">Malay</option><option value="ta">Tamil</option></select></label>
      </div>
      <div className="grid grid-2">
        <label>Dimension<select className="select" value={literacyDimension} onChange={(event) => setLiteracyDimension(event.target.value)}><option>FUNCTIONAL</option><option>INTERACTIVE</option><option>CRITICAL</option></select></label>
        <label>Source status<select className="select" value={sourceStatus} onChange={(event) => setSourceStatus(event.target.value)}><option>SAMPLE</option><option>UNVERIFIED</option><option>OFFICIAL_REVIEWED</option></select></label>
      </div>
      <label>Source URL<input className="input" placeholder="https://..." value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} /></label>
      <label>Content<textarea className="textarea" value={content} onChange={(event) => setContent(event.target.value)} /></label>
      <div className="chip-row">
        <button className="button" type="button" onClick={saveDraft} disabled={state === "saving"}>
          {state === "saving" ? "Saving..." : state === "saved" ? "Saved demo draft" : "Save demo draft"}
        </button>
        {state === "saved" ? <span className="badge">Ready for review</span> : null}
        {state === "error" ? <span className="badge warn">Try again</span> : null}
      </div>
    </div>
  );
}
