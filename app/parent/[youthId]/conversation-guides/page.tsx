import { PageHeader } from "@/components/PageHeader";
import ParentShell from "@/components/ParentShell";

export default function ConversationGuidesPage() {
  return (
    <ParentShell>
      <PageHeader title="Conversation guides" kicker="Generated support">Use words that keep the conversation open.</PageHeader>
      <div className="grid grid-2">
        {[
          "I saw you were learning about screen time. Want to tell me what you found useful?",
          "No trouble. I just want to understand what pressures people your age are dealing with.",
          "Would it help to practise what to say if someone offers something you do not want?",
          "Do you want advice, or do you want me to listen first?"
        ].map((guide) => <div className="card" key={guide}><p>{guide}</p></div>)}
      </div>
    </ParentShell>
  );
}
