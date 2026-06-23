import YouthShell from "@/components/YouthShell";
import { QuizClient } from "@/components/QuizClient";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getDemoQuizzes, getYouthMetrics } from "@/src/lib/data/dbBacked";
import { initialMetrics, quizzes } from "@/src/data/demoData";

export default async function QuizPage() {
  const user = await getCurrentDemoUser("YOUTH");
  const dbQuizzes = await getDemoQuizzes(user.ageBand ?? "TEEN_13_15", "vaping");
  const quiz = dbQuizzes[0] ?? quizzes[0];
  const metrics = await getYouthMetrics(user.id);
  return (
    <YouthShell>
      <QuizClient youthUserId={user.id} quiz={quiz} metrics={metrics.length ? metrics : initialMetrics.asha} />
    </YouthShell>
  );
}
