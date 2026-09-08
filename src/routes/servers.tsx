import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, Panel, SectionHeading, ServerRow, StatusBadge } from "@/components/server-shield";
import { healthForMetric, useServerShieldData } from "@/lib/server-shield";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [{ title: "Servers · ServerShield AI" }, { name: "description", content: "Review every ServerShield AI monitored node and its current health posture." }, { property: "og:title", content: "Servers · ServerShield AI" }, { property: "og:description", content: "Review monitored nodes, environments, operating systems, and current health." }] }),
  component: ServersPage,
});

function ServersPage() {
  const data = useServerShieldData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [environment, setEnvironment] = useState("ALL");
  const rows = useMemo(() => data.serverRows.filter((server) => {
    const haystack = `${server.name} ${server.hostname} ${server.ip_address ?? ""} ${server.operating_system}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === "ALL" || healthForMetric(server.latestMetric, data.thresholds) === status) && (environment === "ALL" || server.environment === environment);
  }), [data.serverRows, data.thresholds, environment, query, status]);
  const environments = [...new Set(data.servers.map((server) => server.environment))];

  return <AppShell title="Servers" subtitle="Fleet inventory · identity · health posture"><div className="rise-in space-y-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Operate / inventory</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Monitored fleet</h2><p className="mt-2 text-sm text-dim">Search and filter nodes by health, environment, or identity.</p></div><Link to="/servers" search={{ add: "true" }} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-ibm px-3 text-xs font-semibold text-primary-foreground hover:bg-cyan hover:text-void"><Plus className="size-4" /> Add server</Link></div><Panel className="p-4"><div className="grid gap-3 md:grid-cols-[1fr_160px_160px]"><label className="flex h-9 items-center gap-2 rounded-md border border-input bg-panel px-3 text-dim"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, host, IP, or OS" className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-faint" /></label><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-input bg-panel px-3 text-xs text-ink outline-none"><option value="ALL">All statuses</option><option value="HEALTHY">Healthy</option><option value="WARNING">Warning</option><option value="CRITICAL">Critical</option><option value="OFFLINE">Offline</option></select><select value={environment} onChange={(event) => setEnvironment(event.target.value)} className="h-9 rounded-md border border-input bg-panel px-3 text-xs text-ink outline-none"><option value="ALL">All environments</option>{environments.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></Panel><Panel className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-line p-5"><SectionHeading title={`${rows.length} nodes`} detail="Select a node to inspect its metrics and history" /></div>{rows.length ? rows.map((server) => <Link key={server.id} to="/servers/$serverId" params={{ serverId: server.id }} className="block"><ServerRow server={{ ...server, status: healthForMetric(server.latestMetric, data.thresholds) }} /></Link>) : <div className="p-10 text-center text-sm text-dim">No servers match the current filters.</div>}</Panel></div></AppShell>;
}