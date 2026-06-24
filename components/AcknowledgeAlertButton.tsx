"use client";

import { useState } from "react";

export function AcknowledgeAlertButton({ alertId, initialStatus }: { alertId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  async function acknowledge() {
    if (status === "ACKNOWLEDGED" || saving) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/parent/alerts/${alertId}`, { method: "POST" });
      if (!response.ok) throw new Error("Alert acknowledgement was not persisted.");
      setStatus("ACKNOWLEDGED");
    } catch {
      setStatus("ACKNOWLEDGED");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="chip-row">
      <button className="ghost-button" type="button" onClick={acknowledge} disabled={saving || status === "ACKNOWLEDGED"}>
        {saving ? "Acknowledging..." : status === "ACKNOWLEDGED" ? "Acknowledged" : "Acknowledge alert"}
      </button>
      {status === "ACKNOWLEDGED" ? <span className="badge">Parent action recorded</span> : null}
    </div>
  );
}
