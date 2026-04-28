"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TalentFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export default function TalentFilters({
  search,
  onSearchChange,
  onSubmit,
  onClear,
}: TalentFiltersProps) {
  return (
    <div className="bg-card rounded-3xl border border-border p-12 my-12 shadow-sm">
      <div className="grid gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Search talent</label>
          <Input
            placeholder="Search skills, name or role"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="rounded-full" onClick={onClear}>
          Clear Filters
        </Button>
        <Button className="rounded-full" onClick={onSubmit}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
