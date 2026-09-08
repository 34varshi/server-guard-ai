import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Server = Tables<"servers">;
export type Metric = Tables<"metrics">;
export type MonitorAlert = Tables<"alerts">;
export type Threshold = Tables<"thresholds">;

export type ServerWithMetric = Server & { latestMetric: Metric | null };

const serverIds = [
  "10000000-0000-4000-8000-000000000001",
  "10000000-0000-4000-8000-000000000002",
  "10000000-0000-4000-8000-000000000003",
  "10000000-0000-4000-8000-000000000004",
  "10000000-0000-4000-8000-000000000005",
] as const;

const now = Date.now();
const fallbackServer = (index: number, values: Partial<Server>): Server => ({
  id: serverIds[index],
  name: values.name ?? "Server",
  hostname: values.hostname ?? "node-01",
  ip_address: values.ip_address ?? "10.0.4.12",
  operating_system: values.operating_system ?? "Ubuntu 22.04 LTS",
  environment: values.environment ?? "Production",
  description: values.description ?? null,
  status: values.status ?? "HEALTHY",
  demo_mode: true,
  last_seen: new Date(now - (index + 1) * 9000).toISOString(),
  created_at: new Date(now - 86400000 * 30).toISOString(),
  updated_at: new Date(now).toISOString(),
});

export const fallbackServers: Server[] = [
  fallbackServer(0, { name: "Production Web Server", hostname: "web-01", ip_address: "10.0.4.12", description: "Customer-facing web traffic and TLS termination." }),
  fallbackServer(1, { name: "Database Server", hostname: "db-01", ip_address: "10.0.4.20", operating_system: "RHEL 9", status: "WARNING", description: "Primary relational database and cache services." }),
  fallbackServer(2, { name: "Application Server", hostname: "app-01", ip_address: "10.0.4.31", operating_system: "Ubuntu 20.04 LTS", environment: "Staging", description: "Application runtime and background workers." }),
  fallbackServer(3, { name: "API Gateway Server", hostname: "gw-01", ip_address: "10.0.4.44", operating_system: "Debian 12", status: "CRITICAL", description: "Ingress gateway for public API traffic." }),
  fallbackServer(4, { name: "Backup Server", hostname: "bkp-01", ip_address: "10.0.4.50", operating_system: "Debian 12", environment: "Development", status: "WARNING", description: "Nightly backup and archival jobs." }),
];

const metric = (serverId: string, cpu: number, memory: number, disk: number, index: number): Metric => ({
  id: `${serverId.slice(-3)}-metric-${index}`,
  server_id: serverId,
  cpu_usage: cpu,
  memory_usage: memory,
  disk_usage: disk,
  process_count: Math.round(90 + cpu * 3.4),
  uptime_seconds: 1800000 + index * 300,
  network_in_mb: 48 + cpu * 2.1,
  network_out_mb: 32 + memory * 1.4,
  recorded_at: new Date(now - index * 120000).toISOString(),
  created_at: new Date(now - index * 120000).toISOString(),
});

export const fallbackMetrics: Metric[] = [
  metric(serverIds[0], 42, 56, 61, 0), metric(serverIds[0], 46, 57, 61, 1), metric(serverIds[0], 39, 54, 60, 2),
  metric(serverIds[1], 58, 87, 72, 0), metric(serverIds[1], 61, 88, 72, 1), metric(serverIds[1], 52, 83, 71, 2),
  metric(serverIds[2], 37, 51, 58, 0), metric(serverIds[2], 41, 53, 58, 1), metric(serverIds[2], 34, 49, 57, 2),
  metric(serverIds[3], 91, 64, 44, 0), metric(serverIds[3], 84, 62, 44, 1), metric(serverIds[3], 76, 60, 43, 2),
  metric(serverIds[4], 29, 44, 90, 0), metric(serverIds[4], 33, 46, 88, 1), metric(serverIds[4], 27, 43, 87, 2),
];

export const fallbackAlerts: MonitorAlert[] = [
  { id: "20000000-0000-4000-8000-000000000001", server_id: serverIds[3], metric: "CPU", severity: "CRITICAL", value: 91, threshold: 85, previous_value: 48, message: "CPU utilization increased from 48% to 91%.", recommendation: "Inspect active processes and workload distribution. If the condition persists, consider scaling or redistributing workload.", status: "OPEN", risk_score: 78, created_at: new Date(now - 120000).toISOString(), resolved_at: null },
  { id: "20000000-0000-4000-8000-000000000002", server_id: serverIds[1], metric: "MEMORY", severity: "WARNING", value: 88, threshold: 75, previous_value: 81, message: "Memory utilization is trending upward on the database server.", recommendation: "Review cache pressure and long-running queries before memory exhaustion.", status: "OPEN", risk_score: 61, created_at: new Date(now - 840000).toISOString(), resolved_at: null },
  { id: "20000000-0000-4000-8000-000000000003", server_id: serverIds[4], metric: "DISK", severity: "WARNING", value: 90, threshold: 75, previous_value: 86, message: "Backup storage is approaching configured capacity threshold.", recommendation: "Review retention policy and clear or archive stale backup artifacts.", status: "OPEN", risk_score: 58, created_at: new Date(now - 1920000).toISOString(), resolved_at: null },
];

export const fallbackThresholds: Threshold[] = [
  { id: "threshold-cpu", metric: "CPU", warning_value: 70, critical_value: 85, created_at: new Date(now).toISOString(), updated_at: new Date(now).toISOString() },
  { id: "threshold-memory", metric: "MEMORY", warning_value: 75, critical_value: 90, created_at: new Date(now).toISOString(), updated_at: new Date(now).toISOString() },
  { id: "threshold-disk", metric: "DISK", warning_value: 75, critical_value: 90, created_at: new Date(now).toISOString(), updated_at: new Date(now).toISOString() },
];

const latestFirst = (rows: Metric[]) => [...rows].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());

export function healthForMetric(current: Metric | null, thresholds: Threshold[]) {
  if (!current) return "OFFLINE";
  const values: Array<[string, number]> = [["CPU", current.cpu_usage], ["MEMORY", current.memory_usage], ["DISK", current.disk_usage]];
  let status: Server["status"] = "HEALTHY";
  for (const [name, value] of values) {
    const threshold = thresholds.find((item) => item.metric === name);
    if (threshold && value >= threshold.critical_value) status = "CRITICAL";
    else if (threshold && value >= threshold.warning_value && status !== "CRITICAL") status = "WARNING";
  }
  return status;
}

export function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${String(hours).padStart(2, "0")}h`;
}

export function relativeTime(timestamp: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export function metricValue(metric: Metric | null, name: string) {
  if (!metric) return 0;
  if (name === "CPU") return metric.cpu_usage;
  if (name === "MEMORY") return metric.memory_usage;
  if (name === "DISK") return metric.disk_usage;
  return metric.process_count;
}

export function useServerShieldData() {
  const [servers, setServers] = useState<Server[]>(fallbackServers);
  const [metrics, setMetrics] = useState<Metric[]>(fallbackMetrics);
  const [alerts, setAlerts] = useState<MonitorAlert[]>(fallbackAlerts);
  const [thresholds, setThresholds] = useState<Threshold[]>(fallbackThresholds);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = useCallback(async () => {
    setLoading(true);
    const [serverResult, metricResult, alertResult, thresholdResult] = await Promise.all([
      supabase.from("servers").select("*").order("name"),
      supabase.from("metrics").select("*").order("recorded_at", { ascending: false }).limit(300),
      supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("thresholds").select("*").order("metric"),
    ]);
    if (serverResult.data?.length) setServers(serverResult.data);
    if (metricResult.data?.length) setMetrics(metricResult.data);
    if (alertResult.data) setAlerts(alertResult.data);
    if (thresholdResult.data?.length) setThresholds(thresholdResult.data);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      setMetrics((current) => current.map((item, index) => ({
        ...item,
        cpu_usage: Math.min(99, Math.max(10, Number(item.cpu_usage) + ((index % 3) - 1) * 2)),
        memory_usage: Math.min(98, Math.max(20, Number(item.memory_usage) + (index % 2 ? 1 : -1))),
        disk_usage: Math.min(98, Math.max(20, Number(item.disk_usage) + (index % 4 === 0 ? 0.2 : 0))),
        recorded_at: new Date().toISOString(),
      })));
      setLastUpdated(new Date());
    }, 10000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const serverRows = useMemo<ServerWithMetric[]>(() => servers.map((server) => ({
    ...server,
    latestMetric: latestFirst(metrics.filter((item) => item.server_id === server.id))[0] ?? null,
  })), [metrics, servers]);

  const updateAlertStatus = useCallback(async (id: string, status: MonitorAlert["status"]) => {
    const resolved_at = status === "RESOLVED" ? new Date().toISOString() : null;
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status, resolved_at } : alert));
    await supabase.from("alerts").update({ status, resolved_at }).eq("id", id);
  }, []);

  const updateThreshold = useCallback(async (id: string, values: Pick<Threshold, "warning_value" | "critical_value">) => {
    setThresholds((current) => current.map((item) => item.id === id ? { ...item, ...values, updated_at: new Date().toISOString() } : item));
    await supabase.from("thresholds").update(values).eq("id", id);
  }, []);

  const addServer = useCallback(async (payload: Omit<TablesInsert<"servers">, "id" | "created_at" | "updated_at" | "last_seen">) => {
    const { data } = await supabase.from("servers").insert(payload).select().single();
    if (data) setServers((current) => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
    return data;
  }, []);

  return { servers, serverRows, metrics, alerts, thresholds, loading, lastUpdated, refresh, updateAlertStatus, updateThreshold, addServer };
}