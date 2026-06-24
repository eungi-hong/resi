const literacyByTopic = [
  { topic: "Vaping", functional: 64, interactive: 51, critical: 43 },
  { topic: "Screen", functional: 71, interactive: 58, critical: 52 },
  { topic: "Mental", functional: 69, interactive: 55, critical: 57 },
  { topic: "Claims", functional: 62, interactive: 48, critical: 46 }
];

const riskTrend = [
  { week: "W1", moderate: 12, high: 2 },
  { week: "W2", moderate: 16, high: 3 },
  { week: "W3", moderate: 14, high: 4 },
  { week: "W4", moderate: 19, high: 5 }
];

const maxRisk = Math.max(...riskTrend.flatMap((item) => [item.moderate, item.high]));

export function AdminAnalyticsCharts() {
  return (
    <div className="grid grid-2 analytics-grid">
      <div className="card chart-card">
        <h2>Health literacy by topic</h2>
        <div className="bar-chart" aria-label="Health literacy by topic">
          {literacyByTopic.map((item) => (
            <div className="bar-group" key={item.topic}>
              <span className="bar-label">{item.topic}</span>
              <div className="bar-stack">
                <span className="bar-fill primary" style={{ width: `${item.functional}%` }}><b>{item.functional}</b></span>
                <span className="bar-fill blue" style={{ width: `${item.interactive}%` }}><b>{item.interactive}</b></span>
                <span className="bar-fill gold" style={{ width: `${item.critical}%` }}><b>{item.critical}</b></span>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span><i className="legend-dot primary" />Understand</span>
          <span><i className="legend-dot blue" />Apply</span>
          <span><i className="legend-dot gold" />Question</span>
        </div>
      </div>
      <div className="card chart-card">
        <h2>Support need trend</h2>
        <div className="trend-chart" aria-label="Support need trend">
          {riskTrend.map((item) => (
            <div className="trend-week" key={item.week}>
              <div className="trend-bars">
                <span className="trend-bar moderate" style={{ height: `${(item.moderate / maxRisk) * 100}%` }} />
                <span className="trend-bar high" style={{ height: `${(item.high / maxRisk) * 100}%` }} />
              </div>
              <span className="bar-label">{item.week}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span><i className="legend-dot gold" />Moderate</span>
          <span><i className="legend-dot danger" />High</span>
        </div>
      </div>
      <div className="card chart-card">
        <h2>Learning language setting</h2>
        <div className="language-meter">
          <strong>English</strong>
          <span>Default for chat, content, and demos</span>
        </div>
        <div className="bar" aria-label="English default"><span style={{ width: "100%" }} /></div>
      </div>
      <div className="card">
        <h2>Privacy threshold</h2>
        <p className="lead">Demographic slices with fewer than 5 youth are suppressed and replaced with broad aggregate snapshots.</p>
        <p className="muted">This prevents small groups from exposing individual learning patterns or safety signals.</p>
      </div>
    </div>
  );
}
