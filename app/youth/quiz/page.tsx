import YouthShell from "@/components/YouthShell";
import { QuizClient } from "@/components/QuizClient";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getDemoQuizzes, getYouthMetrics } from "@/src/lib/data/dbBacked";
import { initialMetrics, quizzes } from "@/src/data/demoData";
import type { AgeBand } from "@/src/lib/types";

const ageBands: AgeBand[] = ["CHILD_10_12", "TEEN_13_15", "OLDER_TEEN_16_18"];

export default async function QuizPage({ searchParams }: { searchParams?: Promise<{ topic?: string; ageBand?: AgeBand }> }) {
  const query = await searchParams;
  const user = await getCurrentDemoUser("YOUTH");
  const ageBand = ageBands.includes(query?.ageBand as AgeBand) ? query?.ageBand as AgeBand : user.ageBand ?? "TEEN_13_15";
  const topic = query?.topic ?? "vaping";
  const [dbQuizzes, metrics] = await Promise.all([
    getDemoQuizzes(ageBand, topic),
    getYouthMetrics(user.id)
  ]);
  const quiz = dbQuizzes[0] ?? quizzes.find((item) => item.ageBand === ageBand && item.topic === topic) ?? quizzes[0];
  return (
    <YouthShell>
      <QuizClient youthUserId={user.id} quiz={quiz} metrics={metrics.length ? metrics : initialMetrics.asha} />
    </YouthShell>
  );
}
