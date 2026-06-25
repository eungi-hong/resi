"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, MessageSquare, Send, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import type { AgeBand, AiResponse, AvatarCue, DemoUser, EducationMaterial, Language } from "@/src/lib/types";
import { speakWithBrowser } from "@/src/lib/voice/mockVoice";

type ChatMessage = { sender: "user" | "assistant"; content: string; cue?: AvatarCue; meta?: AiResponse };

const demoPrompts = [
  "Is vaping actually that bad if everyone does it?",
  "I can't sleep because I scroll for hours.",
  "TikTok says I might have anxiety. Is that true?",
  "My parents say diabetes matters but I'm young. Does it?",
  "Help me tell my mum I'm stressed.",
  "You're the only one who understands me."
];

const quickRepliesByAge: Record<AgeBand, string[]> = {
  CHILD_10_12: ["Explain with an example", "Help me ask an adult", "Quiz me gently", "Show one safe next step"],
  TEEN_13_15: ["Explain simply", "Quiz me", "Help me talk to an adult", "What should I do next?"],
  OLDER_TEEN_16_18: ["Give me a decision aid", "Check the claim", "Help me plan the conversation", "Show next steps"]
};

const starter: ChatMessage = {
  sender: "assistant",
  content: "Hi, I am resi. Ask me about vaping, stress, sleep, screen time, food, exercise, or how to talk to a trusted adult.",
  cue: "wave"
};

export function ChatClient({
  user,
  initialMessages = [],
  initialConversationId,
  recommendationPool = []
}: {
  user: DemoUser;
  initialMessages?: ChatMessage[];
  initialConversationId?: string;
  recommendationPool?: Pick<EducationMaterial, "id" | "title" | "summary">[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages.length ? initialMessages : [starter]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [cue, setCue] = useState<AvatarCue>("wave");
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const ageBand = user.ageBand ?? "TEEN_13_15";
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  const lastMeta = [...messages].reverse().find((message) => message.meta)?.meta;
  const recommendations = useMemo(
    () => recommendationPool.filter((material) => lastMeta?.recommendedMaterialIds.includes(material.id)),
    [lastMeta, recommendationPool]
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages]);

  async function sendMessage(text = input) {
    const clean = text.trim();
    if (!clean || sending) return;
    setInput("");
    setError("");
    setSending(true);
    setMessages((current) => [...current, { sender: "user", content: clean }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, language, ageBand, youthUserId: user.id, conversationId })
      });
      if (!res.ok) throw new Error("Chat request failed.");
      const meta = (await res.json()) as AiResponse & { conversationId?: string };
      if (meta.conversationId) setConversationId(meta.conversationId);
      setCue(meta.avatarCue);
      setMessages((current) => [...current, { sender: "assistant", content: meta.response, cue: meta.avatarCue, meta }]);
    } catch {
      setError("resi could not answer just now. Please try one of the demo prompts again.");
    } finally {
      setSending(false);
    }
  }

  function handleQuickAction(label: string) {
    if (sending) return;
    const intent = label.toLowerCase();
    // "Explain simply" / "Quiz me" are follow-ups on the last answer. The mock
    // provider is stateless, so synthesize these locally from the last meta
    // instead of sending the bare label (which hits the generic fallback).
    if (lastMeta && (intent.includes("explain") || intent.includes("quiz"))) {
      const isQuiz = intent.includes("quiz");
      const topic = lastMeta.detectedTopics?.[0]?.replace(/-/g, " ");
      const reply = isQuiz
        ? `Quick quiz${topic ? ` on ${topic}` : ""}: ${lastMeta.teachBackQuestion} Take your time — there is no wrong answer here.`
        : `Here is the simpler version: ${lastMeta.simplifiedSummary}`;
      const nextCue: AvatarCue = isQuiz ? "thinking" : "explaining";
      setCue(nextCue);
      setMessages((current) => [
        ...current,
        { sender: "user", content: label },
        { sender: "assistant", content: reply, cue: nextCue }
      ]);
      return;
    }
    void sendMessage(label);
  }

  const quickReplies = lastMeta?.suggestedQuickReplies?.length ? lastMeta.suggestedQuickReplies : quickRepliesByAge[ageBand];

  return (
    <div className="chat-shell">
      <aside className="chat-side-panel">
        <ResiAvatar character={character} cue={cue} size="lg" />
        <div>
          <span className="badge">Personalized for {ageBand === "CHILD_10_12" ? "ages 10-12" : ageBand === "TEEN_13_15" ? "ages 13-15" : "older teens"}</span>
          <h2>{user.name}&apos;s resi space</h2>
        <p className="muted">Language: English · Learning level: {ageBand === "CHILD_10_12" ? "simple guidance" : ageBand === "TEEN_13_15" ? "scenario practice" : "decision support"}</p>
        </div>
        <div className="grid">
          {[
            ["Quiz me", BookOpen],
            ["Explain simply", Sparkles],
            ["Help me talk to an adult", MessageSquare],
            ["Show resources", ShieldCheck]
          ].map(([label, Icon]) => (
            <button className="ghost-button" key={String(label)} onClick={() => handleQuickAction(String(label))} disabled={sending}>
              <Icon size={17} /> {String(label)}
            </button>
          ))}
        </div>
        <div className="card subtle">
          <strong>Recommended next module</strong>
          <p className="muted">{recommendations[0]?.title ?? "Vaping and peer pressure: Explorer"}</p>
        </div>
      </aside>

      <section className="chat-panel" aria-label="resi chat">
        <header className="chat-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ResiAvatar character={character} cue={cue} size="sm" showMissingNotice={false} />
            <div>
              <strong>resi is listening</strong>
              <p className="muted" style={{ margin: 0 }}>Educational support, not diagnosis or emergency care</p>
            </div>
          </div>
          <select className="select" style={{ maxWidth: 180 }} value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Chat language">
            <option value="en">English</option>
            <option value="zh">Mandarin</option>
            <option value="ms">Malay</option>
            <option value="ta">Tamil</option>
          </select>
        </header>

        <div className="chat-log" ref={logRef} aria-live="polite">
          {messages.map((message, index) =>
            message.sender === "assistant" ? (
              <div className="assistant-row" key={`${message.sender}-${index}`}>
                <ResiAvatar character={character} cue={message.cue ?? "explaining"} size="sm" showMissingNotice={false} />
                <div className="message assistant">{message.content}</div>
              </div>
            ) : (
              <div className="message user" key={`${message.sender}-${index}`}>{message.content}</div>
            )
          )}
        </div>

        <div className="chat-composer">
          <div className="chip-row">
            {quickReplies.map((prompt) => (
              <button className="chip" key={prompt} type="button" onClick={() => handleQuickAction(prompt)} disabled={sending}>{prompt}</button>
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
            <button className="button" type="submit" disabled={sending}><Send size={18} /> {sending ? "Sending..." : "Send"}</button>
          </form>
          {error ? <p className="form-status badge warn" role="status">{error}</p> : null}
        </div>
      </section>

      <aside className="chat-side-panel">
        <div className="card subtle">
          <h3>Try a demo prompt</h3>
          <div className="grid">
            {demoPrompts.map((prompt) => <button className="chip" key={prompt} onClick={() => sendMessage(prompt)} disabled={sending}>{prompt}</button>)}
          </div>
        </div>
        <div className="card">
          <h3>What resi is tracking</h3>
          <p><span className={`badge ${lastMeta?.riskAssessment.severity === "HIGH" || lastMeta?.riskAssessment.severity === "CRITICAL" ? "danger" : lastMeta?.riskAssessment.severity === "MODERATE" ? "warn" : ""}`}>{lastMeta?.riskAssessment.severity ?? "LOW"} support need</span></p>
          <p className="muted">{lastMeta?.riskAssessment.rationale ?? "General learning. Safety concerns may be shared to help keep you safe."}</p>
          {lastMeta?.riskAssessment.parentAlertRecommended ? <p className="badge danger">Support alert recommended</p> : null}
        </div>
        <div className="card">
          <h3>Recommended materials</h3>
          {recommendations.length ? recommendations.map((material) => <p key={material.id}><strong>{material.title}</strong><br /><span className="muted">{material.summary}</span></p>) : <p className="muted">Ask a question to get materials.</p>}
          {lastMeta?.simplifiedSummary ? <p className="muted"><strong>Simple summary:</strong> {lastMeta.simplifiedSummary}</p> : null}
          {lastMeta?.teachBackQuestion ? <p className="muted"><strong>Teach-back:</strong> {lastMeta.teachBackQuestion}</p> : null}
          <div className="chip-row">
            {lastMeta?.trustedAdultSupport?.shouldSuggest ? <span className="chip">Trusted adult script ready</span> : null}
            {lastMeta?.quizSuggestion ? <span className="chip">Quiz: {lastMeta.quizSuggestion.topic}</span> : null}
          </div>
          <button className="ghost-button" type="button" onClick={() => lastMeta && speakWithBrowser(lastMeta.response)}><Volume2 size={17} /> Read aloud</button>
        </div>
      </aside>
    </div>
  );
}
