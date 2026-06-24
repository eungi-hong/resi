import { ChatClient } from "@/components/ChatClient";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getConversationMessages, getLearningMaterials } from "@/src/lib/data/dbBacked";

export default async function YouthChatPage() {
  const user = await getCurrentDemoUser("YOUTH");
  const ageBand = user.ageBand ?? "TEEN_13_15";
  const [persisted, recommendationPool] = await Promise.all([
    getConversationMessages(user.id),
    getLearningMaterials(ageBand, "en")
  ]);
  return (
    <YouthShell>
      <PageHeader title="Ask resi" kicker="Educational chat">
        resi helps you learn and prepare. It is not a doctor or emergency service.
      </PageHeader>
      <ChatClient
        user={user}
        initialMessages={persisted.messages}
        initialConversationId={persisted.conversationId}
        recommendationPool={recommendationPool.map(({ id, title, summary }) => ({ id, title, summary }))}
      />
    </YouthShell>
  );
}
