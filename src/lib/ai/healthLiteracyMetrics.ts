import type { LiteracyDimension, LiteracyMetric } from "@/src/lib/types";

const signalScore = { low: 35, medium: 62, high: 82 } as const;

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function inferLiteracySignalsFromMessage(message: string) {
  const text = message.toLowerCase();
  return {
    functional: /(what is|does it mean|explain|actually bad|matter)/.test(text) ? "medium" as const : "low" as const,
    interactive: /(what should i do|talk|ask|parents|friend|script)/.test(text) ? "medium" as const : "low" as const,
    critical: /(tiktok|everyone|influencer|claim|myth|online)/.test(text) ? "medium" as const : "low" as const,
    evidence: ["Chat message contained health literacy learning signals"]
  };
}

export function calculateLiteracyUpdate(
  current: LiteracyMetric,
  observedSignal: "low" | "medium" | "high",
  evidence: string,
  evidenceWeight = 0.08
): LiteracyMetric {
  const observed = signalScore[observedSignal];
  return {
    ...current,
    score: Math.round(clamp(0.75 * current.score + 0.25 * observed)),
    confidence: Math.min(1, Number((current.confidence + evidenceWeight).toFixed(2))),
    evidence: [...current.evidence.slice(-4), evidence]
  };
}

export function aggregateYouthMetrics(metrics: LiteracyMetric[]) {
  const dimensions: LiteracyDimension[] = ["FUNCTIONAL", "INTERACTIVE", "CRITICAL"];
  return dimensions.map((dimension) => {
    const set = metrics.filter((metric) => metric.dimension === dimension);
    const average = set.length ? Math.round(set.reduce((sum, metric) => sum + metric.score, 0) / set.length) : 0;
    return { dimension, average };
  });
}

export function aggregateAdminMetrics(all: Record<string, LiteracyMetric[]>, minimumGroupSize = 5) {
  const youthIds = Object.keys(all);
  if (youthIds.length < minimumGroupSize) {
    return { suppressed: true, reason: `Minimum group size is ${minimumGroupSize}. Demo falls back to synthetic aggregate snapshots.` };
  }
  return { suppressed: false, metrics: aggregateYouthMetrics(youthIds.flatMap((id) => all[id])) };
}
