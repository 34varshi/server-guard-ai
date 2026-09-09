import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, BrainCircuit, GitBranch, Server, ShieldCheck } from "lucide-react";
import { AppShell, Panel, SectionHeading } from "@/components/server-shield";

export const Route = createFileRoute("/documentation")({
  head: () => ({ meta: [
    { title: "Documentation · ServerShield AI" },
    { name: "description", content: "Learn how ServerShield AI monitors infrastructure and prioritizes health signals." },
    { property: "og:title", content: "Documentation · ServerShield AI" },
    { property: "og:description", content: "Explore the ServerShield AI workflow, health classification, and architecture." },
  ] }),
  component: DocumentationPage,
});

const sections = [
  { title: "Problem and solution", icon: ShieldCheck, body: "ServerShield AI turns CPU, memory, disk, uptime, and process telemetry into a single operational view. Teams can see what changed, why it matters, and which node needs attention first." },
  { title: "Workflow", icon: GitBranch, body: "The demo flow is Collect → Classify → Explain → Act. A Linux agent can collect host readings, the service classifies them against configurable thresholds, and operators acknowledge or resolve the resulting signal." },
  { title: "Health classification", icon: Server, body: "CPU is healthy below 70%, warning from 70–84%, and critical at 85% or higher. Memory and disk use 75% and 90% as their default warning and critical thresholds. Settings keeps these project thresholds editable." },
  { title: "AI-assisted risk analysis", icon: BrainCircuit, body: "Risk scores combine severity, threshold distance, and the signal context to prioritize review. This is an explainable AI-assisted layer designed for a future ML anomaly and failure-prediction model; the demo does not claim live machine learning." },
  { title: "IBM Bob in our development journey", icon: BookOpen, body: "IDEA → IBM BOB ASSISTANCE → IMPLEMENTATION → HUMAN REVIEW → TESTING → FINAL FEATURE. IBM Bob supported exploration and iteration while the team retained review, testing, and product decisions." },
];

function DocumentationPage() {
  return <AppShell title="Documentation" subtitle="System guide · workflow · operating model"><div className="rise-in space-y-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Understand / field guide</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">How ServerShield AI works</h2><p className="mt-2 max-w-2xl text-sm text-dim">A concise guide to the monitoring workflow, the demo boundary, and the decisions behind the command center.</p></div><div className="grid gap-5 lg:grid-cols-2">{sections.map(({ title, icon: Icon, body }) => <Panel key={title}><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ibm/15 text-cyan ring-1 ring-ibm/25"><Icon className="size-4" /></span><div><SectionHeading title={title} /><p className="text-sm leading-6 text-dim">{body}</p></div></div></Panel>)}</div><Panel><SectionHeading title="Technology and future scope" detail="Built for a credible hackathon demonstration" /><div className="grid gap-4 text-sm text-dim md:grid-cols-2"><p><strong className="text-ink">Current scope:</strong> dark command center, demo fleet, Cloud-backed rows, configurable thresholds, alert actions, filtering, analytics, and PDF/CSV exports.</p><p><strong className="text-ink">Future scope:</strong> ML anomaly detection, failure prediction, capacity forecasting, multi-cloud monitoring, notifications, automated remediation, log analysis, RBAC, and incident summaries.</p></div></Panel></div></AppShell>;
}