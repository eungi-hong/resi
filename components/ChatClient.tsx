"use client";

import { useMemo, useState } from "react";
import { Send, Volume2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { educationMaterials } from "@/src/data/demoData";
import type { AiResponse, AvatarCue } from "@/src/lib/types";
import { speakWithBrowser } from "@/src/lib/voice/mockVoice";

type ChatMessage = { sender: "user" | "assistant"; content: string; meta?: AiResponse };

const starter: ChatMessage = {
  sender: "assistant",
  content: "Hi, I am resi. Ask me about vaping, stress, sleep, screen time, food, exercise, or how to talk to a trusted adult."
};

export function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([starter]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [cue, setCue] = useState<AvatarCue>("wave");
  const lastMeta = [...messages].reverse().find((message) => message.meta)?.meta;
  const recommendations = useMemo(
    () => educationMaterials.filter((material) => lastMeta?.recommendedMaterialIds.includes(material.id)),
    [lastMeta]
  );

  async function sendMessage(text = input) {
    const clean = text.trim();
    if (!clean) return;
    setInput("");
    setMessages((current) => [...current, { sender: "user", content: clean }]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: clean, language })
    });
    const meta = (await res.json()) as AiResponse;
    setCue(meta.avatarCue);
    setMessages((current) => [...current, { sender: "assistant", content: meta.response, meta }]);
  }

  return (
    <div className="chat-shell">
      <section>
        <div className="chat-log" aria-live="polite">
          {messages.map((message, index) => (
            <div className={`message ${message.sender}`} key={`${message.sender}-${index}`}>{message.content}</div>
          ))}
        </div>
        <div className="chip-row" style={{ marginTop: 12 }}>
          {(lastMeta?.suggestedQuickReplies ?? ["Is vaping actually that bad if everyone does it?", "I think I have anxiety because TikTok says these symptoms mean anxiety.", "I can't sleep because I scroll for hours.", "You're the only one who understands me."]).map((prompt) => (
            <button className="chip" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask resi a health question..." />
          <button className="button" type="submit"><Send size={18} /> Send</button>
        </form>
      </section>
      <aside className="grid">
        <div className="card" style={{ textAlign: "center" }}>
          <Avatar character="See" cue={cue} />
          <div className="chip-row" style={{ justifyContent: "center", marginTop: 12 }}>
            <select className="select" value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Chat language">
              <option value="en">English</option>
              <option value="zh">Mandarin Chinese</option>
              <option value="ms">Malay</option>
              <option value="ta">Tamil</option>
            </select>
            <button className="ghost-button" onClick={() => lastMeta && speakWithBrowser(lastMeta.response)}><Volume2 size={17} /> Voice</button>
          </div>
        </div>
        <div className="card">
          <h3>Safety signal</h3>
          <p><span className={`badge ${lastMeta?.riskAssessment.severity === "HIGH" || lastMeta?.riskAssessment.severity === "CRITICAL" ? "danger" : lastMeta?.riskAssessment.severity === "MODERATE" ? "warn" : ""}`}>{lastMeta?.riskAssessment.severity ?? "LOW"}</span></p>
          <p className="muted">{lastMeta?.riskAssessment.rationale ?? "Educational chat. resi is not medical diagnosis or emergency care."}</p>
          {lastMeta?.riskAssessment.parentAlertRecommended ? <p className="badge danger">Parent alert recommended</p> : null}
        </div>
        <div className="card">
          <h3>Recommended next</h3>
          {recommendations.length ? recommendations.map((material) => <p key={material.id}><strong>{material.title}</strong><br /><span className="muted">{material.summary}</span></p>) : <p className="muted">Ask a question to get materials.</p>}
          {lastMeta?.simplifiedSummary ? <p className="muted"><strong>Simple summary:</strong> {lastMeta.simplifiedSummary}</p> : null}
          {lastMeta?.teachBackQuestion ? <p className="muted"><strong>Teach-back:</strong> {lastMeta.teachBackQuestion}</p> : null}
          {lastMeta?.trustedAdultSupport?.shouldSuggest ? <p className="chip">Trusted adult script ready</p> : null}
          {lastMeta?.quizSuggestion ? <p className="chip">Quiz: {lastMeta.quizSuggestion.topic}</p> : null}
        </div>
      </aside>
    </div>
  );
}
