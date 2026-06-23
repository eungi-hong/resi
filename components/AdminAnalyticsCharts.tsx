"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

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

const languageShare = [
  { name: "English", value: 58, color: "#087f73" },
  { name: "Mandarin", value: 18, color: "#3f7cac" },
  { name: "Malay", value: 14, color: "#f2b84b" },
  { name: "Tamil", value: 10, color: "#e96f5b" }
];

export function AdminAnalyticsCharts() {
  return (
    <div className="grid grid-2" style={{ marginBottom: 18 }}>
      <div className="card chart-card">
        <h2>Literacy by topic</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={literacyByTopic}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8e7df" />
            <XAxis dataKey="topic" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="functional" fill="#087f73" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interactive" fill="#3f7cac" radius={[4, 4, 0, 0]} />
            <Bar dataKey="critical" fill="#f2b84b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card chart-card">
        <h2>Risk trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={riskTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8e7df" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="moderate" stroke="#f2b84b" strokeWidth={3} />
            <Line type="monotone" dataKey="high" stroke="#c24141" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card chart-card">
        <h2>Language distribution</h2>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={languageShare} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={3}>
              {languageShare.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="chip-row">
          {languageShare.map((entry) => <span className="chip" key={entry.name}>{entry.name} {entry.value}%</span>)}
        </div>
      </div>
      <div className="card">
        <h2>Privacy threshold</h2>
        <p className="lead">Demographic slices with fewer than 5 youth are suppressed and replaced with broad aggregate snapshots.</p>
        <p className="muted">This prevents small groups from exposing individual learning patterns or safety signals.</p>
      </div>
    </div>
  );
}
