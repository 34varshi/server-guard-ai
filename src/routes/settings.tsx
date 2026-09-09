import { createFileRoute } from "@tanstack/react-router";
import { Check, Settings2 } from "lucide-react";
import { useState } from "react";
import { AppShell, Panel, SectionHeading } from "@/components/server-shield";
import { type Threshold, useServerShieldData } from "@/lib/server-shield";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings · ServerShield AI" },
    { name: "description", content: "Configure ServerShield AI health thresholds and monitoring preferences." },
    { property: "og:title", content: "Settings · ServerShield AI" },
    { property: "og:description", content: "Tune project thresholds and review ServerShield AI monitoring preferences." },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const data = useServerShieldData();
  const [drafts, setDrafts] = useState<Record<string, Pick<Threshold, "warning_value" | "critical_value">>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const valuesFor = (threshold: Threshold) => drafts[threshold.id] ?? { warning_value: threshold.warning_value, critical_value: threshold.critical_value };
  const save = async (threshold: Threshold) => { const values = valuesFor(threshold); if (values.warning_value >= values.critical_value) return; await data.updateThreshold(threshold.id, values); setSaved(threshold.metric); window.setTimeout(() => setSaved(null), 1800); };

  return <AppShell title="Settings" subtitle="Project thresholds · monitoring preferences"><div className="rise-in space-y-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Understand / configuration</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Project settings</h2><p className="mt-2 max-w-2xl text-sm text-dim">Adjust the thresholds used to classify server health. Changes apply to the dashboard and analytics views.</p></div><Panel><SectionHeading title="Health thresholds" detail="Warning and critical values are percentages" /><div className="space-y-3">{data.thresholds.map((threshold) => { const values = valuesFor(threshold); return <div key={threshold.id} className="grid gap-3 rounded-lg border border-line bg-panel/60 p-4 md:grid-cols-[1fr_150px_150px_auto] md:items-end"><div><p className="text-sm font-semibold">{threshold.metric}</p><p className="mt-1 text-[11px] text-dim">Values at or above these levels change the status.</p></div><label className="text-[11px] text-dim">Warning<input type="number" min="1" max="99" value={values.warning_value} onChange={(event) => setDrafts((current) => ({ ...current, [threshold.id]: { ...values, warning_value: Number(event.target.value) } }))} className="mt-1 h-9 w-full rounded-md border border-input bg-panel px-3 text-xs text-ink outline-none" /></label><label className="text-[11px] text-dim">Critical<input type="number" min="1" max="100" value={values.critical_value} onChange={(event) => setDrafts((current) => ({ ...current, [threshold.id]: { ...values, critical_value: Number(event.target.value) } }))} className="mt-1 h-9 w-full rounded-md border border-input bg-panel px-3 text-xs text-ink outline-none" /></label><Button size="sm" onClick={() => void save(threshold)} className="bg-ibm text-primary-foreground hover:bg-cyan hover:text-void"><Check className="size-3.5" />{saved === threshold.metric ? "Saved" : "Save"}</Button></div>; })}</div></Panel><Panel><SectionHeading title="Monitoring preferences" detail="Current demo configuration" /><div className="grid gap-3 md:grid-cols-3"><div className="rounded-lg border border-line bg-panel/60 p-4"><Settings2 className="size-4 text-cyan" /><p className="mt-3 text-xs font-semibold">Demo Mode</p><p className="mt-1 text-[11px] text-dim">Enabled · five simulated nodes</p></div><div className="rounded-lg border border-line bg-panel/60 p-4"><Settings2 className="size-4 text-cyan" /><p className="mt-3 text-xs font-semibold">Refresh interval</p><p className="mt-1 text-[11px] text-dim">Every 10 seconds</p></div><div className="rounded-lg border border-line bg-panel/60 p-4"><Settings2 className="size-4 text-cyan" /><p className="mt-3 text-xs font-semibold">Risk analysis</p><p className="mt-1 text-[11px] text-dim">AI-assisted and explainable</p></div></div></Panel></div></AppShell>;
}