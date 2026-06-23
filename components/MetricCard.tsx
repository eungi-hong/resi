export function MetricCard({ label, value, tone = "primary" }: { label: string; value: number; tone?: "primary" | "blue" | "gold" }) {
  const color = tone === "blue" ? "var(--blue)" : tone === "gold" ? "var(--accent)" : "var(--primary)";
  return (
    <div className="card metric">
      <span className="muted">{label}</span>
      <strong className="metric-value">{value}</strong>
      <div className="bar" aria-label={`${label} ${value} out of 100`}>
        <span style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
