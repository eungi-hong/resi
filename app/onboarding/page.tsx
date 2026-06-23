import Link from "next/link";
import { Avatar } from "@/components/Avatar";

export default function OnboardingPage() {
  return (
    <main className="page">
      <div className="container grid grid-2">
        <div>
          <p className="badge">Youth onboarding</p>
          <h1>Set up your resi space</h1>
          <p className="lead">Choose a language, avatar, and privacy level. For this demo, Asha uses English/Tamil with supportive summaries for parents.</p>
          <div className="grid">
            <label>Language<select className="select" defaultValue="en"><option>English</option><option>Mandarin Chinese</option><option>Malay</option><option>Tamil</option></select></label>
            <label>Avatar<select className="select" defaultValue="See"><option>See</option><option>Ree</option></select></label>
            <label>Parent visibility<select className="select" defaultValue="MEDIUM"><option>LOW summaries only</option><option>MEDIUM summaries + selected alerts</option><option>HIGH alerts + recommended actions</option></select></label>
            <Link className="button" href="/youth">Finish onboarding</Link>
          </div>
        </div>
        <div className="avatar-stage"><Avatar character="See" cue="wave" /></div>
      </div>
    </main>
  );
}
