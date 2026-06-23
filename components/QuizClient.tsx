"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { calculateLiteracyUpdate } from "@/src/lib/ai/healthLiteracyMetrics";
import type { LiteracyDimension, LiteracyMetric, Quiz } from "@/src/lib/types";

const labelFor = (dimension: LiteracyDimension) => dimension === "FUNCTIONAL" ? "Understand" : dimension === "INTERACTIVE" ? "Practise" : "Question";

export function QuizClient({ youthUserId, quiz, metrics }: { youthUserId: string; quiz: Quiz; metrics: LiteracyMetric[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const score = quiz.questions.filter((q) => answers[q.id] === q.answerIndex).length;
  const complete = Object.keys(answers).length === quiz.questions.length;
  const byDimension = quiz.questions.reduce<Record<LiteracyDimension, { correct: number; total: number }>>(
    (acc, question) => {
      acc[question.dimension].total += 1;
      if (answers[question.id] === question.answerIndex) acc[question.dimension].correct += 1;
      return acc;
    },
    {
      FUNCTIONAL: { correct: 0, total: 0 },
      INTERACTIVE: { correct: 0, total: 0 },
      CRITICAL: { correct: 0, total: 0 }
    }
  );
  const projectedUpdates = metrics.map((metric) => {
    const result = byDimension[metric.dimension];
    const ratio = result.total ? result.correct / result.total : 0;
    const signal = ratio >= 0.8 ? "high" : ratio >= 0.5 ? "medium" : "low";
    return calculateLiteracyUpdate(metric, signal, `Quiz evidence: ${result.correct}/${result.total} ${metric.dimension.toLowerCase()} answers`);
  });

  useEffect(() => {
    if (!complete || saved) return;
    setSaved(true);
    fetch("/api/quiz-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youthUserId, quizId: quiz.id, score, answers, literacyUpdates: projectedUpdates })
    }).catch(() => setSaved(false));
  }, [complete, saved, youthUserId, quiz.id, score, answers, projectedUpdates]);

  return (
    <>
      <section className="avatar-scene" style={{ marginBottom: 18 }}>
        <PageHeader title="3-minute adaptive quiz" kicker="Understand · Practise · Question">Answers update progress slowly so one quiz never defines you.</PageHeader>
        <ResiAvatar character="See" cue={complete ? "celebrate" : "quiz"} size="lg" />
      </section>
      <div className="grid">
        {quiz.questions.map((question, index) => (
          <div className="card" key={question.id}>
            <span className="badge">{labelFor(question.dimension)}</span>
            <h2>{index + 1}. {question.prompt}</h2>
            <div className="grid">
              {question.options.map((option, optionIndex) => (
                <button className="ghost-button" key={option} onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}>
                  {answers[question.id] === optionIndex ? <CheckCircle2 size={17} /> : null}{option}
                </button>
              ))}
            </div>
            {answers[question.id] !== undefined ? <p className="muted">{question.explanation}</p> : null}
          </div>
        ))}
        {complete ? (
          <div className="card">
            <h2>Score: {score}/{quiz.questions.length}</h2>
            <p className="muted">{saved ? "Saved to the demo database." : "Saving attempt..."}</p>
            <div className="grid grid-3">
              {projectedUpdates.map((metric) => (
                <div className="metric" key={metric.dimension}>
                  <strong>{labelFor(metric.dimension)}</strong>
                  <span>{metrics.find((item) => item.dimension === metric.dimension)?.score ?? 40} to {metric.score}</span>
                  <span className="muted">Confidence {Math.round(metric.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
