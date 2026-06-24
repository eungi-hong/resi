export function MetricCard({ label, value, tone = "primary", description }: { label: string; value: number; tone?: "primary" | "blue" | "gold"; description?: string }) {
  const color = tone === "blue" ? "var(--blue)" : tone === "gold" ? "var(--accent)" : "var(--primary)";
  return (
    <div className="card metric">
      <span className="muted">{label}</span>
      <strong className="metric-value">{value}<span className="metric-unit">/100</span></strong>
      {description ? <span className="muted">{description}</span> : null}
      <div className="bar" aria-label={`${label} ${value} out of 100`}>
        <span style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
