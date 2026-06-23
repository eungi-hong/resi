import { PageHeader } from "@/components/PageHeader";
import AdminShell from "@/components/AdminShell";
import { AdminAnalyticsCharts } from "@/components/AdminAnalyticsCharts";
import { getAdminAnalyticsData } from "@/src/lib/data/dbBacked";

export default async function AnalyticsPage() {
  const { rows } = await getAdminAnalyticsData();
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
