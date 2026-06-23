import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";

export default function NewContentPage() {
  return (
    <AdminShell>
      <PageHeader title="Add material" kicker="Admin content">Drafts can be prepared quickly, but official review is required before production use.</PageHeader>
      <div className="grid grid-2">
        <div className="card grid">
          <label>Topic<input className="input" defaultValue="vaping" /></label>
          <label>Title<input className="input" defaultValue="Refusal skills scenario" /></label>
          <div className="grid grid-2">
            <label>Age band<select className="select" defaultValue="TEEN_13_15"><option>CHILD_10_12</option><option>TEEN_13_15</option><option>OLDER_TEEN_16_18</option></select></label>
            <label>Language<select className="select" defaultValue="en"><option value="en">English</option><option value="zh">Mandarin</option><option value="ms">Malay</option><option value="ta">Tamil</option></select></label>
          </div>
          <div className="grid grid-2">
            <label>Dimension<select className="select" defaultValue="INTERACTIVE"><option>FUNCTIONAL</option><option>INTERACTIVE</option><option>CRITICAL</option></select></label>
            <label>Source status<select className="select" defaultValue="SAMPLE"><option>SAMPLE</option><option>UNVERIFIED</option><option>OFFICIAL_REVIEWED</option></select></label>
          </div>
          <label>Source URL<input className="input" placeholder="https://..." /></label>
          <label>Content<textarea className="textarea" defaultValue="A friend offers you a vape after school. You are curious, but you also feel unsure. Practise one short line that lets you say no without making it a big argument." /></label>
          <button className="button" type="button">Save demo draft</button>
        </div>
        <aside className="card">
          <span className="badge">Preview as youth</span>
          <h2>Refusal skills scenario</h2>
          <p>A friend offers you a vape after school. You are curious, but you also feel unsure.</p>
          <p className="muted">Learning goal: practise a next step, not shame the learner.</p>
          <h3>Human review checklist</h3>
          <ul>
            <li>No diagnosis, treatment, or scare claims.</li>
            <li>Age-appropriate language.</li>
            <li>Source status visible to admins.</li>
            <li>Trusted-adult support included where useful.</li>
          </ul>
        </aside>
      </div>
    </AdminShell>
  );
}
