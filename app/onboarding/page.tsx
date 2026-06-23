import Link from "next/link";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";

export default function OnboardingPage() {
  return (
    <main className="page">
      <div className="app-container">
        <section className="avatar-scene" style={{ marginBottom: 18 }}>
          <div>
            <p className="badge">Youth onboarding</p>
            <h1>Set up your resi space</h1>
            <p className="lead">Choose age, language, avatar, topics, and parent visibility so resi can adapt without taking away your autonomy.</p>
          </div>
          <ResiAvatar character="See" cue="wave" size="lg" />
        </section>
        <div className="grid grid-2">
          <div className="card grid">
            <label>Age band<select className="select" defaultValue="TEEN_13_15"><option>CHILD_10_12</option><option>TEEN_13_15</option><option>OLDER_TEEN_16_18</option></select></label>
            <label>Language<select className="select" defaultValue="en"><option>English</option><option>Mandarin Chinese</option><option>Malay</option><option>Tamil</option></select></label>
            <label>Avatar<select className="select" defaultValue="See"><option>See</option><option>Ree</option></select></label>
            <label>Interaction style<select className="select" defaultValue="calm"><option>Calm</option><option>Cheerful</option><option>Direct</option><option>Coach-like</option></select></label>
          </div>
          <div className="card grid">
            <label>Topics I care about<select className="select" defaultValue="vaping"><option>Vaping and peer pressure</option><option>Sleep and screen time</option><option>Mental health and stress</option><option>Food, movement, and energy</option></select></label>
            <label>Parent visibility<select className="select" defaultValue="MEDIUM"><option>LOW summaries only</option><option>MEDIUM summaries + selected alerts</option><option>HIGH alerts + recommended actions</option></select></label>
            <p className="muted">Parents see supportive summaries and safety alerts, not every private message.</p>
            <Link className="button" href="/api/demo-login?username=asha&next=/youth">Finish onboarding</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
