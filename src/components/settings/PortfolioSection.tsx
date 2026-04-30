import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsSectionHeader from "./SettingsSectionHeader";

interface PortfolioSectionProps {
  mainLink: string;
  projects: string[];
  projectInput: string;
  loading: boolean;
  onMainLinkChange: (value: string) => void;
  onProjectInputChange: (value: string) => void;
  onAddProject: () => void;
  onRemoveProject: (index: number) => void;
  onSave: () => void | Promise<void>;
}

export default function PortfolioSection({
  mainLink,
  projects,
  projectInput,
  loading,
  onMainLinkChange,
  onProjectInputChange,
  onAddProject,
  onRemoveProject,
  onSave,
}: PortfolioSectionProps) {
  return (
    <>
      <SettingsSectionHeader
        title="Portfolio"
        description="Showcase your work and projects."
      />

      <div className="max-w-lg space-y-6">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <LinkIcon className="h-4 w-4 text-muted-foreground" /> Main Portfolio Link
          </Label>
          <Input
            value={mainLink}
            onChange={(e) => onMainLinkChange(e.target.value)}
            placeholder="https://your-portfolio.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Projects</Label>
          <div className="flex gap-2">
            <Input
              value={projectInput}
              onChange={(e) => onProjectInputChange(e.target.value)}
              placeholder="Add a project URL..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddProject();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={onAddProject}>
              Add
            </Button>
          </div>
          {projects.length > 0 ? (
            <div className="mt-2 space-y-2">
              {projects.map((project, i) => (
                <div
                  key={`${project}-${i}`}
                  className="flex items-center justify-between rounded-md border border-border bg-muted px-3 py-2"
                >
                  <a
                    href={project}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-xs truncate text-sm text-primary hover:underline"
                  >
                    {project}
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemoveProject(i)}
                    className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No projects added yet.</p>
          )}
        </div>

        <div className="border-t border-border pt-2">
          <Button type="button" onClick={() => void onSave()} disabled={loading} className="px-5">
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </>
  );
}
