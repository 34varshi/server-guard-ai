CREATE TABLE public.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hostname TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  operating_system TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'Production',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'HEALTHY' CHECK (status IN ('HEALTHY', 'WARNING', 'CRITICAL', 'OFFLINE')),
  demo_mode BOOLEAN NOT NULL DEFAULT true,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servers TO authenticated;
GRANT ALL ON public.servers TO service_role;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo workspace can view servers" ON public.servers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public demo workspace can add servers" ON public.servers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public demo workspace can update servers" ON public.servers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public demo workspace can remove servers" ON public.servers FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  cpu_usage NUMERIC(5,2) NOT NULL CHECK (cpu_usage >= 0 AND cpu_usage <= 100),
  memory_usage NUMERIC(5,2) NOT NULL CHECK (memory_usage >= 0 AND memory_usage <= 100),
  disk_usage NUMERIC(5,2) NOT NULL CHECK (disk_usage >= 0 AND disk_usage <= 100),
  process_count INTEGER NOT NULL DEFAULT 0 CHECK (process_count >= 0),
  uptime_seconds BIGINT NOT NULL DEFAULT 0 CHECK (uptime_seconds >= 0),
  network_in_mb NUMERIC(10,2) NOT NULL DEFAULT 0,
  network_out_mb NUMERIC(10,2) NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.metrics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.metrics TO authenticated;
GRANT ALL ON public.metrics TO service_role;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo workspace can view metrics" ON public.metrics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public demo workspace can add metrics" ON public.metrics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public demo workspace can update metrics" ON public.metrics FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public demo workspace can remove metrics" ON public.metrics FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  metric TEXT NOT NULL CHECK (metric IN ('CPU', 'MEMORY', 'DISK', 'PROCESSES', 'UPTIME')),
  severity TEXT NOT NULL CHECK (severity IN ('WARNING', 'CRITICAL')),
  value NUMERIC(8,2) NOT NULL,
  threshold NUMERIC(8,2) NOT NULL,
  previous_value NUMERIC(8,2),
  message TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ACKNOWLEDGED', 'RESOLVED')),
  risk_score INTEGER NOT NULL DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo workspace can view alerts" ON public.alerts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public demo workspace can add alerts" ON public.alerts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public demo workspace can update alerts" ON public.alerts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public demo workspace can remove alerts" ON public.alerts FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric TEXT NOT NULL UNIQUE CHECK (metric IN ('CPU', 'MEMORY', 'DISK')),
  warning_value NUMERIC(5,2) NOT NULL CHECK (warning_value >= 0 AND warning_value <= 100),
  critical_value NUMERIC(5,2) NOT NULL CHECK (critical_value >= 0 AND critical_value <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT thresholds_ordered CHECK (warning_value < critical_value)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thresholds TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thresholds TO authenticated;
GRANT ALL ON public.thresholds TO service_role;
ALTER TABLE public.thresholds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo workspace can view thresholds" ON public.thresholds FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public demo workspace can add thresholds" ON public.thresholds FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public demo workspace can update thresholds" ON public.thresholds FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public demo workspace can remove thresholds" ON public.thresholds FOR DELETE TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_server_shield_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER servers_updated_at BEFORE UPDATE ON public.servers FOR EACH ROW EXECUTE FUNCTION public.update_server_shield_updated_at();
CREATE TRIGGER thresholds_updated_at BEFORE UPDATE ON public.thresholds FOR EACH ROW EXECUTE FUNCTION public.update_server_shield_updated_at();

INSERT INTO public.servers (id, name, hostname, ip_address, operating_system, environment, description, status, demo_mode, last_seen)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'Production Web Server', 'web-01', '10.0.4.12', 'Ubuntu 22.04 LTS', 'Production', 'Customer-facing web traffic and TLS termination.', 'HEALTHY', true, now() - interval '12 seconds'),
  ('10000000-0000-4000-8000-000000000002', 'Database Server', 'db-01', '10.0.4.20', 'RHEL 9', 'Production', 'Primary relational database and cache services.', 'WARNING', true, now() - interval '8 seconds'),
  ('10000000-0000-4000-8000-000000000003', 'Application Server', 'app-01', '10.0.4.31', 'Ubuntu 20.04 LTS', 'Staging', 'Application runtime and background workers.', 'HEALTHY', true, now() - interval '18 seconds'),
  ('10000000-0000-4000-8000-000000000004', 'API Gateway Server', 'gw-01', '10.0.4.44', 'Debian 12', 'Production', 'Ingress gateway for public API traffic.', 'CRITICAL', true, now() - interval '3 seconds'),
  ('10000000-0000-4000-8000-000000000005', 'Backup Server', 'bkp-01', '10.0.4.50', 'Debian 12', 'Development', 'Nightly backup and archival jobs.', 'WARNING', true, now() - interval '21 seconds');

INSERT INTO public.thresholds (metric, warning_value, critical_value)
VALUES ('CPU', 70, 85), ('MEMORY', 75, 90), ('DISK', 75, 90);

INSERT INTO public.metrics (server_id, cpu_usage, memory_usage, disk_usage, process_count, uptime_seconds, network_in_mb, network_out_mb, recorded_at)
VALUES
  ('10000000-0000-4000-8000-000000000001', 42, 56, 61, 184, 18518400, 128.40, 94.70, now() - interval '5 minutes'),
  ('10000000-0000-4000-8000-000000000001', 46, 57, 61, 186, 18518700, 131.20, 96.10, now() - interval '2 minutes'),
  ('10000000-0000-4000-8000-000000000002', 58, 87, 72, 312, 847680, 76.50, 68.40, now() - interval '5 minutes'),
  ('10000000-0000-4000-8000-000000000002', 61, 88, 72, 318, 847980, 78.20, 69.10, now() - interval '2 minutes'),
  ('10000000-0000-4000-8000-000000000003', 37, 51, 58, 126, 1811040, 61.60, 44.50, now() - interval '5 minutes'),
  ('10000000-0000-4000-8000-000000000003', 41, 53, 58, 129, 1811340, 64.30, 46.20, now() - interval '2 minutes'),
  ('10000000-0000-4000-8000-000000000004', 84, 62, 44, 402, 183060, 224.60, 203.10, now() - interval '5 minutes'),
  ('10000000-0000-4000-8000-000000000004', 91, 64, 44, 438, 183360, 238.40, 216.90, now() - interval '2 minutes'),
  ('10000000-0000-4000-8000-000000000005', 29, 44, 88, 94, 2592480, 28.80, 31.40, now() - interval '5 minutes'),
  ('10000000-0000-4000-8000-000000000005', 33, 46, 90, 98, 2592780, 31.50, 34.90, now() - interval '2 minutes');

INSERT INTO public.alerts (id, server_id, metric, severity, value, threshold, previous_value, message, recommendation, status, risk_score, created_at)
VALUES
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', 'CPU', 'CRITICAL', 91, 85, 48, 'CPU utilization increased from 48% to 91%.', 'Inspect active processes and workload distribution. If the condition persists, consider scaling or redistributing workload.', 'OPEN', 78, now() - interval '2 minutes'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'MEMORY', 'WARNING', 88, 75, 81, 'Memory utilization is trending upward on the database server.', 'Review cache pressure and long-running queries before memory exhaustion.', 'OPEN', 61, now() - interval '14 minutes'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000005', 'DISK', 'WARNING', 90, 75, 86, 'Backup storage is approaching configured capacity threshold.', 'Review retention policy and clear or archive stale backup artifacts.', 'OPEN', 58, now() - interval '32 minutes');