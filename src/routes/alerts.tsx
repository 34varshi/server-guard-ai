import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CircleAlert, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppShell, Panel, SectionHeading, StatusBadge } from "@/components/server-shield";
import { relativeTime, useServerShieldData } from "@/lib/server-shield";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts · ServerShield AI" },
      { name: "description", content: "Review, acknowledge, and resolve ServerShield AI health alerts." },
      { property: "og:title", content: "Alerts · ServerShield AI" },
      { property: "og:description", content: "Review prioritized server health alerts with AI-assisted risk context." },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const data = useServerShieldData();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const visibleAlerts = useMemo(() => data.alerts.filter((alert) => {
    const server = data.servers.find((item) => item.id === alert.server_id);
    const haystack = `${server?.name ?? ""} ${server?.hostname ?? ""} ${alert.message} ${alert.metric}`.toLowerCase();
    return (filter === "ALL" || (filter === "OPEN" ? alert.status !== "RESOLVED" : alert.status === filter)) && haystack.includes(query.toLowerCase());
  }), [data.alerts, data.servers, filter, query]);

  return (
    <AppShell title="Alerts" subtitle="Prioritized signals · acknowledgement · resolution" alertCount={data.alerts.filter((alert) => alert.status !== "RESOLVED").length}>
      <div className="rise-in space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Operate / alert queue</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Risk signals that need a decision</h2>
            <p className="mt-2 max-w-2xl text-sm text-dim">Review threshold breaches, understand the reason, and record the operator response.</p>
          </div>
          <span className="flex items-center gap-2 text-[11px] font-mono text-faint"><span className="size-2 rounded-full bg-warn dot-pulse" /> DEMO DATA · {visibleAlerts.length} shown</span>
        </div>

        <Panel className="p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="flex h-9 items-center gap-2 rounded-md border border-input bg-panel px-3 text-dim">
              <Search className="size-4" />
              <span className="sr-only">Search alerts</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search server, signal, or message" className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-faint" />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter alerts">
              {["ALL", "OPEN", "WARNING", "CRITICAL", "RESOLVED"].map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} className={filter === item ? "bg-ibm text-primary-foreground hover:bg-cyan hover:text-void" : "border-line text-dim hover:text-ink"} onClick={() => setFilter(item)}>{item === "OPEN" ? "Active" : item}</Button>)}
            </div>
          </div>
        </Panel>

        <Panel className="overflow-hidden p-0">
          <div className="border-b border-line p-5"><SectionHeading title={`${visibleAlerts.length} alert${visibleAlerts.length === 1 ? "" : "s"}`} detail="Sorted by risk score and most recent signal" /></div>
          <div className="divide-y divide-line">
            {visibleAlerts.length ? visibleAlerts.sort((a, b) => b.risk_score - a.risk_score).map((alert) => {
              const server = data.servers.find((item) => item.id === alert.server_id);
              return <article key={alert.id} className="p-5 transition-colors hover:bg-accent/30"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="flex min-w-0 gap-3"><div className={alert.severity === "CRITICAL" ? "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-bad/10 text-bad ring-1 ring-bad/25" : "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-warn/10 text-warn ring-1 ring-warn/25"}><CircleAlert className="size-4" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={alert.severity} /><span className="text-xs font-semibold">{server?.name ?? "Unknown server"}</span><span className="text-[11px] font-mono text-faint">{alert.metric}</span></div><p className="mt-2 text-sm font-semibold">{alert.message}</p><p className="mt-1 text-xs leading-5 text-dim">{alert.recommendation}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-faint"><span>Value {alert.value}%</span><span>Threshold {alert.threshold}%</span><span>{relativeTime(alert.created_at)}</span></div></div></div><div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end"><div className="mr-2 text-right"><p className="text-[10px] font-mono uppercase tracking-wider text-faint">Risk score</p><p className={alert.risk_score >= 70 ? "text-xl font-extrabold text-bad" : "text-xl font-extrabold text-warn"}>{alert.risk_score}<span className="text-xs text-faint">/100</span></p></div>{alert.status !== "RESOLVED" ? <><Button size="sm" variant="outline" className="border-line text-dim hover:text-ink" onClick={() => void data.updateAlertStatus(alert.id, "ACKNOWLEDGED")} disabled={alert.status === "ACKNOWLEDGED"}><Check className="size-3.5" /> {alert.status === "ACKNOWLEDGED" ? "Acknowledged" : "Acknowledge"}</Button><Button size="sm" className="bg-good text-primary-foreground hover:bg-good/90" onClick={() => void data.updateAlertStatus(alert.id, "RESOLVED")}>Resolve</Button></> : <span className="inline-flex items-center gap-1.5 rounded-md bg-good/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-good ring-1 ring-good/25"><Check className="size-3" /> Resolved</span>} {server ? <Link to="/servers/$serverId" params={{ serverId: server.id }} className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-ibm hover:bg-accent hover:text-cyan"><ExternalLink className="size-3.5" /> Server</Link> : null}</div></div></article>;
            }) : <div className="p-12 text-center text-sm text-dim">No alerts match the current filters.</div>}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}