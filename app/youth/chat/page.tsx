import { ChatClient } from "@/components/ChatClient";
import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";

export default function YouthChatPage() {
  return (
    <YouthShell>
      <PageHeader title="Ask resi" kicker="Educational chat">
        resi helps you learn and prepare. It is not a doctor or emergency service.
      </PageHeader>
      <ChatClient />
    </YouthShell>
  );
}
