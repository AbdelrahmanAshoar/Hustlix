"use client";

import { useEffect, useState } from "react";
import { Sparkles, Lock, DollarSign, Wrench, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface SuggestedProject {
  projectId: number;
  projectTitle: string;
  description: string;
  budget: number;
  requiredSkills: string; // comma-separated string from API
  matchScore: number;
}

interface ApiError {
  subscriptionRequired?: boolean;
  message?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 80) return { bg: "#dcfce7", text: "#15803d", border: "#86efac", label: "Excellent" };
  if (score >= 60) return { bg: "#fef9c3", text: "#a16207", border: "#fde047", label: "Good" };
  return { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5", label: "Low" };
}

function parseSkills(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function SubscriptionGate() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full rounded-2xl border border-blue-100 bg-gradient-to-br from-[#eff6ff] to-[#f0fdf4] shadow-sm p-8 text-center space-y-5">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Lock className="h-7 w-7 text-blue-600" />
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">Premium Feature</h2>
          <p className="mt-1 text-sm text-slate-500">
            AI-powered project matching is available exclusively to subscribed freelancers.
          </p>
        </div>

        {/* Perks */}
        <ul className="text-left space-y-2">
          {[
            "Get matched with projects that fit your skills",
            "AI-scored opportunities ranked by relevance",
            "Stand out with higher-quality proposals",
          ].map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
              {perk}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          View Subscription Plans
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: SuggestedProject }) {
  const score = scoreColor(project.matchScore);
  const skills = parseSkills(project.requiredSkills);

  return (
    <div className="group relative bg-white rounded-2xl border border-blue-50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-5 flex flex-col gap-4">
      {/* Match Score Badge — top-right */}
      <div
        className="absolute top-4 right-4 flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 text-center"
        style={{ background: score.bg, borderColor: score.border }}
      >
        <span className="text-lg font-bold leading-none" style={{ color: score.text }}>
          {project.matchScore}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wide leading-none mt-0.5" style={{ color: score.text }}>
          {score.label}
        </span>
      </div>

      {/* Title */}
      <div className="pr-16">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">AI Match</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
          {project.projectTitle}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{project.description}</p>

      {/* Budget */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        <DollarSign className="h-4 w-4 text-green-500" />
        Budget: ${project.budget.toLocaleString()}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <Wrench className="h-3.5 w-3.5" />
            Required Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1 pr-16">
          <div className="h-3 w-20 rounded bg-blue-100" />
          <div className="h-5 w-3/4 rounded bg-blue-100" />
        </div>
        <div className="h-14 w-14 rounded-full bg-blue-100" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-4/6 rounded bg-slate-100" />
      </div>
      <div className="h-4 w-32 rounded bg-green-100" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-blue-100" />
        <div className="h-6 w-20 rounded-full bg-blue-100" />
        <div className="h-6 w-14 rounded-full bg-blue-100" />
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function SuggestedProjectsPage() {
  const [projects, setProjects] = useState<SuggestedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    setSubscriptionRequired(false);

    try {
      const res = await fetch("/api/Freelancer/suggested-projects", { cache: "no-store" });
      const data: SuggestedProject[] | ApiError = await res.json();

      if (res.status === 402 || res.status === 403 || (data as ApiError)?.subscriptionRequired) {
        setSubscriptionRequired(true);
        return;
      }

      if (!res.ok) {
        setError((data as ApiError)?.message || "Failed to load suggested projects.");
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* Subscription gate — shown even while technically "done loading" */
  if (!loading && subscriptionRequired) return <SubscriptionGate />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Matched Projects</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Projects selected by AI based on your skills and profile — ranked by match score.
          </p>
        </div>

        {!loading && !error && (
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors bg-blue-50 hover:bg-blue-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">Something went wrong</p>
            <p className="text-sm text-slate-400 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">No matches yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Ask an admin to run the AI matching engine to see results here.
            </p>
          </div>
        </div>
      )}

      {/* Project cards grid */}
      {!loading && !error && projects.length > 0 && (
        <>
          <p className="text-xs text-slate-400 font-medium">
            {projects.length} project{projects.length !== 1 ? "s" : ""} matched
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects
              .slice()
              .sort((a, b) => b.matchScore - a.matchScore)
              .map((project) => (
                <ProjectCard key={project.projectId} project={project} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
