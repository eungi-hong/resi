import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";
import { AdminContentDraftForm } from "@/components/AdminContentDraftForm";

export default function NewContentPage() {
  return (
    <AdminShell>
      <PageHeader title="Add material" kicker="Admin content">Drafts can be prepared quickly, but official review is required before production use.</PageHeader>
      <div className="grid grid-2">
        <AdminContentDraftForm />
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
