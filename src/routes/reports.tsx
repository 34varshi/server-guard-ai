import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart, FileText } from "lucide-react";
import { AppShell, Panel, SectionHeading, StatCard } from "@/components/server-shield";
import { downloadCsv, downloadPdf } from "@/lib/report-export";
import { healthForMetric, useServerShieldData } from "@/lib/server-shield";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports · ServerShield AI" },
    { name: "description", content: "Generate and export ServerShield AI fleet health reports." },
    { property: "og:title", content: "Reports · ServerShield AI" },
    { property: "og:description", content: "Export current fleet posture and alert data for operational review." },
  ] }),
  component: ReportsPage,
});

function ReportsPage() {
  const data = useServerShieldData();
  const rows = data.serverRows.map((server) => ({ Server: server.name, Hostname: server.hostname, Environment: server.environment, Status: healthForMetric(server.latestMetric, data.thresholds), CPU: Math.round(server.latestMetric?.cpu_usage ?? 0), Memory: Math.round(server.latestMetric?.memory_usage ?? 0), Disk: Math.round(server.latestMetric?.disk_usage ?? 0) }));
  const exportCsv = () => downloadCsv(`servershield-fleet-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  const exportPdf = () => downloadPdf(`ServerShield AI Fleet Report · ${new Date().toLocaleDateString()}`, rows.map((row) => `${row.Server} | ${row.Status} | CPU ${row.CPU}% | Memory ${row.Memory}% | Disk ${row.Disk}%`));

  return <AppShell title="Reports" subtitle="Operational summaries · export-ready fleet data"><div className="rise-in space-y-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Understand / reporting</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Fleet health reports</h2><p className="mt-2 max-w-2xl text-sm text-dim">Package the current command center view for a handoff, review, or incident record.</p></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" className="border-line text-dim hover:text-ink" onClick={exportCsv}><Download className="size-3.5" /> CSV</Button><Button size="sm" className="bg-ibm text-primary-foreground hover:bg-cyan hover:text-void" onClick={exportPdf}><FileText className="size-3.5" /> PDF</Button></div></div><div className="grid gap-3 sm:grid-cols-3"><StatCard label="Servers covered" value={data.serverRows.length} detail="Current fleet inventory" tone="text-ibm" /><StatCard label="Metrics captured" value={data.metrics.length} detail="Available observations" tone="text-cyan" /><StatCard label="Alerts included" value={data.alerts.length} detail="Current alert history" tone="text-warn" /></div><Panel><SectionHeading title="Report center" detail="Exports use the latest readings in the command center" /><div className="grid gap-3 md:grid-cols-2"><button type="button" onClick={exportCsv} className="flex items-center gap-3 rounded-lg border border-line bg-panel-2/60 p-4 text-left transition-colors hover:border-ibm/60"><FileBarChart className="size-5 text-cyan" /><span><strong className="block text-sm">Fleet posture CSV</strong><small className="text-xs text-dim">One row per monitored server with health and resource readings.</small></span></button><button type="button" onClick={exportPdf} className="flex items-center gap-3 rounded-lg border border-line bg-panel-2/60 p-4 text-left transition-colors hover:border-ibm/60"><FileText className="size-5 text-cyan" /><span><strong className="block text-sm">Operator summary PDF</strong><small className="text-xs text-dim">A printable snapshot of the current fleet posture.</small></span></button></div></Panel><Panel className="overflow-hidden p-0"><div className="border-b border-line p-5"><SectionHeading title="Preview" detail="The same rows are used for both exports" /></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead className="bg-panel text-[10px] font-mono uppercase tracking-wider text-faint"><tr>{["Server", "Status", "CPU", "Memory", "Disk"].map((heading) => <th key={heading} className="px-5 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-line">{rows.map((row) => <tr key={row.Server}><td className="px-5 py-3 font-semibold">{row.Server}</td><td className="px-5 py-3 font-mono">{row.Status}</td><td className="px-5 py-3 font-mono">{row.CPU}%</td><td className="px-5 py-3 font-mono">{row.Memory}%</td><td className="px-5 py-3 font-mono">{row.Disk}%</td></tr>)}</tbody></table></div></Panel></div></AppShell>;
}