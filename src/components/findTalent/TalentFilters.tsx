"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFilters = {
  name: string;
  jobTitle: string;
  skills: string;
  location: string;
};

type TalentFiltersProps = {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

const SKILL_CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Mobile", value: "mobile" },
  { label: "DevOps", value: "devops" },
  { label: "AI/ML", value: "ai-ml" },
];

export default function TalentFilters({
  filters,
  onFilterChange,
  onSubmit,
  onClear,
}: TalentFiltersProps) {
  return (
    <div className="bg-card rounded-3xl border border-border p-8 my-12 shadow-sm">
      {/* Search Input Section */}
      <div className="grid gap-4 md:grid-cols-4 md:items-end">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Name</label>
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => onFilterChange("name", e.target.value)}
            className="rounded-full h-12 px-4"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Job Title</label>
          <Input
            placeholder="Search job title..."
            value={filters.jobTitle}
            onChange={(e) => onFilterChange("jobTitle", e.target.value)}
            className="rounded-full h-12 px-4"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Skills</label>
          <Input
            placeholder="Search skills..."
            value={filters.skills}
            onChange={(e) => onFilterChange("skills", e.target.value)}
            className="rounded-full h-12 px-4"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Location</label>
          <Input
            placeholder="Search location..."
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="rounded-full h-12 px-4"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <Button className="rounded-full px-6 h-12 whitespace-nowrap" onClick={onSubmit}>
          Search
        </Button>
        <Button variant="outline" className="rounded-full px-6 h-12" onClick={onClear}>
          Clear filters
        </Button>
      </div>

      {/* Skill Categories Pills */}
      <div className="mt-6 flex flex-wrap gap-3">
        <p className="text-sm font-medium text-muted-foreground mr-2 inline-flex items-center">Popular skills:</p>
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              if (cat.value === "all") {
                onFilterChange("skills", "");
              } else {
                onFilterChange("skills", cat.label);
              }
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (cat.value === "all" && !filters.skills) ||
              (cat.value !== "all" && filters.skills.toLowerCase().includes(cat.label.toLowerCase()))
                ? "bg-primary text-white border border-primary"
                : "border border-border text-foreground hover:border-primary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
