import { ChatClient } from "@/components/ChatClient";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { getCurrentDemoUser } from "@/src/lib/auth/session";
import { getConversationMessages } from "@/src/lib/data/dbBacked";

export default async function YouthChatPage() {
  const user = await getCurrentDemoUser("YOUTH");
  const persisted = await getConversationMessages(user.id);
  return (
    <YouthShell>
      <PageHeader title="Ask resi" kicker="Educational chat">
        resi helps you learn and prepare. It is not a doctor or emergency service.
      </PageHeader>
      <ChatClient user={user} initialMessages={persisted.messages} initialConversationId={persisted.conversationId} />
    </YouthShell>
  );
}
