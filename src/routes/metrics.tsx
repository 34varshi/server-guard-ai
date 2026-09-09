import { createFileRoute } from "@tanstack/react-router";
import { Activity, ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, MetricBar, Panel, SectionHeading, StatCard, StatusBadge } from "@/components/server-shield";
import { healthForMetric, metricValue, useServerShieldData } from "@/lib/server-shield";

export const Route = createFileRoute("/metrics")({
  head: () => ({ meta: [
    { title: "Metrics · ServerShield AI" },
    { name: "description", content: "Compare current and historical ServerShield AI fleet metrics." },
    { property: "og:title", content: "Metrics · ServerShield AI" },
    { property: "og:description", content: "Compare CPU, memory, disk, and trend signals across monitored servers." },
  ] }),
  component: MetricsPage,
});

function MetricsPage() {
  const data = useServerShieldData();
  const [metricName, setMetricName] = useState("CPU");
  const values = useMemo(() => data.serverRows.map((server) => ({ server, value: metricValue(server.latestMetric, metricName) })), [data.serverRows, metricName]);
  const numericValues = values.map((item) => item.value);
  const average = numericValues.length ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length : 0;
  const highest = numericValues.length ? Math.max(...numericValues) : 0;
  const lowest = numericValues.length ? Math.min(...numericValues) : 0;

  return <AppShell title="Metrics" subtitle="Current readings · fleet comparison · trend signals">
    <div className="rise-in space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Operate / telemetry</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Resource metrics at a glance</h2><p className="mt-2 max-w-2xl text-sm text-dim">Compare the latest readings against configurable project thresholds across the monitored fleet.</p></div><div className="flex items-center gap-2 text-[11px] font-mono text-faint"><Activity className="size-3.5 text-cyan" /> DEMO DATA · 10s refresh</div></div>
      <div className="grid gap-3 sm:grid-cols-3"><StatCard label="Fleet average" value={`${Math.round(average)}%`} detail={`${metricName} across ${values.length} nodes`} tone="text-ibm" /><StatCard label="Highest reading" value={`${Math.round(highest)}%`} detail="Current fleet maximum" tone="text-warn" /><StatCard label="Lowest reading" value={`${Math.round(lowest)}%`} detail="Current fleet minimum" tone="text-good" /></div>
      <Panel className="p-4"><div className="flex flex-wrap items-center justify-between gap-3"><SectionHeading title="Metric view" detail="Select a signal to compare current readings" /><div className="flex gap-2" role="group" aria-label="Metric selection">{["CPU", "MEMORY", "DISK"].map((name) => <button type="button" key={name} onClick={() => setMetricName(name)} className={`rounded-md px-3 py-2 text-[11px] font-semibold transition-colors ${metricName === name ? "bg-ibm text-primary-foreground" : "bg-panel-2 text-dim ring-1 ring-line hover:text-ink"}`}>{name}</button>)}</div></div></Panel>
      <Panel className="overflow-hidden p-0"><div className="border-b border-line p-5"><SectionHeading title="Server readings" detail="Latest value, posture, and directional signal" /></div><div className="divide-y divide-line">{values.map(({ server, value }) => { const status = healthForMetric(server.latestMetric, data.thresholds); const previous = data.metrics.filter((item) => item.server_id === server.id).sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[1]; const previousValue = metricValue(previous ?? null, metricName); const trend = value > previousValue + 1 ? "up" : value < previousValue - 1 ? "down" : "steady"; return <div key={server.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1.2fr_0.75fr_1.2fr_0.6fr] lg:items-center"><div><p className="text-sm font-semibold">{server.name}</p><p className="text-[11px] font-mono text-faint">{server.hostname} · {server.environment}</p></div><div><StatusBadge status={status} /></div><MetricBar label={metricName} value={value} tone={status === "CRITICAL" ? "bg-bad" : status === "WARNING" ? "bg-warn" : "bg-ibm"} /><span className={`flex items-center gap-1 text-xs font-mono ${trend === "up" ? "text-warn" : trend === "down" ? "text-good" : "text-faint"}`}>{trend === "up" ? <ArrowUpRight className="size-3.5" /> : trend === "down" ? <ArrowDownRight className="size-3.5" /> : <Minus className="size-3.5" />}{trend}</span></div>; })}</div></Panel>
    </div>
  </AppShell>;
}