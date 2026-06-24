import { PageHeader } from "@/components/PageHeader";
import YouthShell from "@/components/YouthShell";
import { Avatar } from "@/components/Avatar";
import { getCurrentDemoUser } from "@/src/lib/auth/session";

export default async function ProfilePage() {
  const user = await getCurrentDemoUser("YOUTH");
  const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
  return (
    <YouthShell>
      <PageHeader title="Profile settings" kicker={`${user.name}, age ${user.age}`}>Adjust language, avatar, privacy, and interaction style.</PageHeader>
      <div className="grid grid-2">
        <div className="card grid">
          <div style={{ textAlign: "center" }}>
            <Avatar character={character} cue="wave" />
          </div>
          <label>Language<select className="select" defaultValue="en"><option value="en">English</option><option value="ta">Tamil</option><option value="zh">Mandarin Chinese</option><option value="ms">Malay</option></select></label>
          <label>Avatar<select className="select" defaultValue={character}><option>See</option><option>Ree</option></select></label>
          <label>Interaction style<select className="select" defaultValue="calm"><option>Calm</option><option>Cheerful</option><option>Direct</option><option>Coach-like</option></select></label>
        </div>
        <div className="card">
          <h2>What gets shared?</h2>
          <p className="muted">Your learning is yours. resi shares supportive summaries and safety alerts, not every private message.</p>
          <label>Parent co-management<select className="select" defaultValue="MEDIUM"><option>Low: summaries only</option><option>Medium: summaries + selected alerts</option><option>High: alerts + recommended actions</option></select></label>
          <div className="grid" style={{ marginTop: 16 }}>
            <div className="card subtle"><strong>Shared</strong><p className="muted">Learning themes, literacy progress, and safety alerts when support may help.</p></div>
            <div className="card subtle"><strong>Not shared by default</strong><p className="muted">Raw private chat messages and exploratory questions.</p></div>
          </div>
        </div>
      </div>
    </YouthShell>
  );
}
