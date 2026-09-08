import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, ShieldAlert, TimerReset } from "lucide-react";
import { AppShell, MetricBar, Panel, SectionHeading, ServerRow, StatCard, StatusBadge } from "@/components/server-shield";
import { healthForMetric, relativeTime, useServerShieldData } from "@/lib/server-shield";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Server Health Command Center · ServerShield AI" },
    { name: "description", content: "A live command center for server health, metrics, risk signals, and operational alerts." },
    { property: "og:title", content: "Server Health Command Center · ServerShield AI" },
    { property: "og:description", content: "Monitor. Detect. Understand. Act with ServerShield AI." },
  ] }),
  component: DashboardPage,
});

function DashboardPage() {
  const data = useServerShieldData();
  const openAlerts = data.alerts.filter((alert) => alert.status !== "RESOLVED");
  const counts = data.serverRows.reduce((acc, server) => {
    const status = healthForMetric(server.latestMetric, data.thresholds);
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return <AppShell title="Server Health Command Center" subtitle="Fleet posture · AI-assisted risk analysis · Demo data" alertCount={openAlerts.length}>
    <div className="rise-in space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">System map / overview</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">From server metrics to actionable intelligence</h2><p className="mt-2 max-w-2xl text-sm text-dim">A clear operational view of five monitored nodes, their current health, and the signals that need attention.</p></div><div className="flex items-center gap-2 text-[11px] font-mono text-faint"><span className="size-2 rounded-full bg-warn dot-pulse" /> DEMO DATA · refreshed {relativeTime(data.lastUpdated.toISOString())}</div></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Total servers" value={data.serverRows.length} detail="5 nodes in fleet" tone="text-ibm" /><StatCard label="Healthy" value={counts.HEALTHY ?? 0} detail="Within thresholds" tone="text-good" /><StatCard label="Warning" value={counts.WARNING ?? 0} detail="Needs attention" tone="text-warn" /><StatCard label="Critical" value={counts.CRITICAL ?? 0} detail="Immediate action" tone="text-bad" /><StatCard label="Offline" value={counts.OFFLINE ?? 0} detail="No recent signal" tone="text-off" /></div>
      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        <Panel className="overflow-hidden p-0"><div className="p-5 pb-3"><SectionHeading title="Fleet overview" detail="Current posture by monitored node" action={<Link to="/servers" className="flex items-center gap-1 text-[11px] font-semibold text-ibm hover:text-cyan">View all <ArrowUpRight className="size-3" /></Link>} /></div><div className="hidden grid-cols-[1.6fr_0.75fr_0.45fr_0.45fr_0.45fr_0.75fr] gap-3 border-y border-line bg-panel px-4 py-2 text-[9px] font-mono uppercase tracking-wider text-faint sm:grid"><span>Server</span><span>Status</span><span>CPU</span><span>Memory</span><span>Disk</span><span>Last seen</span></div>{data.serverRows.map((server) => <ServerRow key={server.id} server={server} />)}</Panel>
        <Panel><SectionHeading title="Priority signals" detail="Open alerts ranked by AI-assisted risk" action={<Link to="/alerts" className="text-[11px] font-semibold text-ibm hover:text-cyan">Open queue</Link>} /><div className="space-y-3">{openAlerts.slice(0, 3).map((alert) => { const server = data.servers.find((item) => item.id === alert.server_id); return <Link key={alert.id} to="/alerts" className="block rounded-lg border border-line bg-panel/70 p-3 transition-colors hover:border-ibm/60"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold">{server?.name ?? "Unknown server"}</p><p className="mt-1 text-[11px] text-dim">{alert.message}</p></div><StatusBadge status={alert.severity} /></div><div className="mt-3 flex items-center justify-between text-[10px] font-mono"><span className="text-faint">Risk score</span><span className={alert.risk_score >= 70 ? "text-bad" : "text-warn"}>{alert.risk_score}/100</span></div><div className="mt-1 h-1 rounded-full bg-line"><div className={alert.risk_score >= 70 ? "h-full rounded-full bg-bad" : "h-full rounded-full bg-warn"} style={{ width: `${alert.risk_score}%` }} /></div></Link>; })}</div></Panel>
      </div>
      <div className="grid gap-5 lg:grid-cols-3"><Panel><SectionHeading title="Fleet resource pulse" detail="Latest readings across the fleet" /><div className="space-y-4">{data.serverRows.slice(0, 3).map((server) => <div key={server.id}><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold">{server.hostname}</span><StatusBadge status={healthForMetric(server.latestMetric, data.thresholds)} /></div><div className="grid gap-2 sm:grid-cols-3"><MetricBar label="CPU" value={server.latestMetric?.cpu_usage ?? 0} tone="bg-ibm" /><MetricBar label="MEM" value={server.latestMetric?.memory_usage ?? 0} tone="bg-violet" /><MetricBar label="DISK" value={server.latestMetric?.disk_usage ?? 0} tone="bg-cyan" /></div></div>)}</div></Panel><Panel><SectionHeading title="Operational posture" detail="Why the current state looks this way" /><div className="space-y-3 text-xs text-dim"><p className="flex gap-2"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-warn" /> Two nodes are above a configurable warning threshold.</p><p className="flex gap-2"><Activity className="mt-0.5 size-4 shrink-0 text-cyan" /> {data.metrics.length} metric observations are available for analysis.</p><p className="flex gap-2"><TimerReset className="mt-0.5 size-4 shrink-0 text-good" /> Auto-refresh runs every 10 seconds in Demo Mode.</p></div></Panel><Panel><SectionHeading title="Signal legend" detail="Status is always paired with a label" /><div className="grid grid-cols-2 gap-2 text-[11px] font-mono"><span className="flex items-center gap-2 text-good"><span className="size-2 rounded-full bg-good" /> HEALTHY</span><span className="flex items-center gap-2 text-warn"><span className="size-2 rounded-full bg-warn" /> WARNING</span><span className="flex items-center gap-2 text-bad"><span className="size-2 rounded-full bg-bad" /> CRITICAL</span><span className="flex items-center gap-2 text-off"><span className="size-2 rounded-full bg-off" /> OFFLINE</span></div></Panel></div>
    </div>
  </AppShell>;
}