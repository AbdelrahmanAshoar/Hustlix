"use client";

import { Lightbulb, BookOpen, Sparkles } from "lucide-react";

export interface SkillAnalysisData {
  jobTitle?: string;
  matchPercentage?: number;
  compatibilityLevel?: "High" | "Medium" | "Low" | string;
  recommendedSkills?: string[];
  improvementTip?: string;
}

interface SkillAnalysisCardProps {
  analysis: SkillAnalysisData | null;
  loading: boolean;
}

function compatibilityColor(level?: string) {
  switch (level?.toLowerCase()) {
    case "high":
      return { bg: "#dcfce7", text: "#16a34a", dot: "#22c55e" };
    case "medium":
      return { bg: "#fefce8", text: "#ca8a04", dot: "#eab308" };
    case "low":
      return { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" };
    default:
      return { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" };
  }
}

export default function SkillAnalysisCard({ analysis, loading }: SkillAnalysisCardProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-3/4 rounded bg-blue-100" />
        <div className="h-8 w-1/2 rounded bg-blue-100" />
        <div className="h-2 rounded-full bg-blue-100" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-16 rounded-full bg-blue-100" />
          ))}
        </div>
        <div className="h-16 rounded-xl bg-blue-50" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        No skill analysis available yet.
      </p>
    );
  }

  const { jobTitle, matchPercentage, compatibilityLevel, recommendedSkills, improvementTip } = analysis;
  const pct = typeof matchPercentage === "number" ? Math.max(0, Math.min(100, matchPercentage)) : 0;
  const colors = compatibilityColor(compatibilityLevel);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">Job Match Analysis</h3>
      </div>

      {/* Job Title & Match */}
      {jobTitle && (
        <p className="text-sm font-medium text-slate-700 -mt-1">{jobTitle}</p>
      )}

      <div>
        <p className="text-3xl font-bold text-blue-600 leading-none">
          {pct}%{" "}
          <span className="text-base font-semibold text-slate-700">Match</span>
        </p>

        {/* Progress bar */}
        <div className="mt-2 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Compatibility badge */}
        {compatibilityLevel && (
          <div className="mt-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: colors.bg, color: colors.text }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: colors.dot }}
              />
              {compatibilityLevel} Compatibility
            </span>
          </div>
        )}
      </div>

      {/* Recommended Skills */}
      {Array.isArray(recommendedSkills) && recommendedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Recommended Skills
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  borderColor: "#bfdbfe",
                }}
              >
                <span className="h-1 w-1 rounded-full bg-blue-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* How to Improve */}
      {improvementTip && (
        <div
          className="rounded-xl p-3 flex gap-2"
          style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
        >
          <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
          <div>
            <p className="text-xs font-semibold text-green-800 mb-0.5">
              How to Improve Your Match
            </p>
            <p className="text-xs text-green-700 leading-relaxed">{improvementTip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
