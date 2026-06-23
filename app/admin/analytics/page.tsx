import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";
import { AdminAnalyticsCharts } from "@/components/AdminAnalyticsCharts";

const rows = [
  ["Vaping", 64, 51, 43, "MODERATE rising"],
  ["Screen time", 71, 58, 52, "MODERATE stable"],
  ["Mental health", 69, 55, 57, "HIGH watch"],
  ["Misinformation", 62, 48, 46, "MODERATE rising"]
];

export default function AnalyticsPage() {
  return (
    <AdminShell>
      <PageHeader title="Aggregate analytics" kicker="Non-identifying">Filters are demo-only. Production deployment should enforce thresholding server-side.</PageHeader>
      <AdminAnalyticsCharts />
      <div className="card">
        <table className="table">
          <thead><tr><th>Topic</th><th>Functional</th><th>Interactive</th><th>Critical</th><th>Risk trend</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={String(cell)}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </AdminShell>
  );
}
