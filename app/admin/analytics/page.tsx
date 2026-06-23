import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";
import { AdminAnalyticsCharts } from "@/components/AdminAnalyticsCharts";

const rows = [
  ["Vaping", 64, 51, 43, "Moderate support need rising"],
  ["Screen time", 71, 58, 52, "Moderate support need stable"],
  ["Mental health", "Hidden for privacy", "Hidden for privacy", "Hidden for privacy", "Small group hidden"],
  ["Misinformation", 62, 48, 46, "Moderate support need rising"]
];

export default function AnalyticsPage() {
  return (
    <AdminShell>
      <PageHeader title="Aggregate analytics" kicker="Non-identifying">Small groups are hidden to protect youth privacy. Filters are demo-only in this MVP.</PageHeader>
      <AdminAnalyticsCharts />
      <div className="card">
        <table className="table">
          <thead><tr><th>Topic</th><th>Understanding health information</th><th>Applying information and seeking support</th><th>Evaluating misinformation and social pressure</th><th>Support need trend</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={String(cell)}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </AdminShell>
  );
}
