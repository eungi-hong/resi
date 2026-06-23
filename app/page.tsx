import Link from "next/link";
import { ArrowRight, BarChart3, MessageCircle, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function HomePage() {
  return (
    <main className="page">
      <section className="container hero">
        <div>
          <p className="badge">TheFirst Spark demo MVP</p>
          <h1>Meet resi</h1>
          <p className="lead">
            Your youth health literacy AI associate. Ask questions, learn at your pace, and build confidence to make health decisions.
          </p>
          <div className="chip-row" style={{ margin: "24px 0" }}>
            <Link className="button" href="/login">Start demo <ArrowRight size={18} /></Link>
            <Link className="ghost-button" href="/youth/chat">Ask resi</Link>
          </div>
          <div className="grid grid-3">
            <div className="card"><MessageCircle /> <h3>Youth chat</h3><p className="muted">Mock AI with recommendations, quizzes, safety cues, and avatar reactions.</p></div>
            <div className="card"><ShieldCheck /> <h3>Privacy first</h3><p className="muted">Parents see supportive summaries and safety alerts, not private transcripts by default.</p></div>
            <div className="card"><BarChart3 /> <h3>Population insight</h3><p className="muted">Admins view aggregate literacy and support-need trends with small-group suppression.</p></div>
          </div>
        </div>
        <div className="avatar-stage">
          <Avatar character="See" cue="wave" />
        </div>
      </section>
    </main>
  );
}
