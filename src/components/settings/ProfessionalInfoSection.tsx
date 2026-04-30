import { Briefcase, Link as LinkIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsSectionHeader from "./SettingsSectionHeader";

interface ProfessionalInfoSectionProps {
  jobTitle: string;
  payPalEmail: string;
  cvFile: string;
  skills: string[];
  skillName: string;
  skillCategory: string;
  skillRelevanceScore: string;
  skillLoading: boolean;
  loading: boolean;
  cvFileRef: React.RefObject<HTMLInputElement>;
  onJobTitleChange: (value: string) => void;
  onPayPalEmailChange: (value: string) => void;
  onSkillNameChange: (value: string) => void;
  onSkillCategoryChange: (value: string) => void;
  onSkillRelevanceScoreChange: (value: string) => void;
  onAddSkill: () => void | Promise<void>;
  onRemoveSkill: (index: number) => void;
  onSave: () => void | Promise<void>;
  onCvSelect: (fileName: string) => void;
}

export default function ProfessionalInfoSection({
  jobTitle,
  payPalEmail,
  cvFile,
  skills,
  skillName,
  skillCategory,
  skillRelevanceScore,
  skillLoading,
  loading,
  cvFileRef,
  onJobTitleChange,
  onPayPalEmailChange,
  onSkillNameChange,
  onSkillCategoryChange,
  onSkillRelevanceScoreChange,
  onAddSkill,
  onRemoveSkill,
  onSave,
  onCvSelect,
}: ProfessionalInfoSectionProps) {
  return (
    <>
      <SettingsSectionHeader
        title="Professional Info"
        description="Details about your professional background."
      />

      <div className="max-w-lg space-y-6">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Briefcase className="h-4 w-4 text-muted-foreground" /> Job Title
          </Label>
          <Input
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" /> PayPal Email
          </Label>
          <Input
            value={payPalEmail}
            onChange={(e) => onPayPalEmailChange(e.target.value)}
            placeholder="your-paypal@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <LinkIcon className="h-4 w-4 text-muted-foreground" /> CV File
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              hidden
              ref={cvFileRef}
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onCvSelect(file.name);
              }}
            />
            <Button type="button" variant="outline" onClick={() => cvFileRef.current?.click()} className="text-sm">
              Upload CV
            </Button>
            {cvFile && (
              <a
                href={cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-xs truncate text-sm text-primary hover:underline"
              >
                View current CV
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Skills</Label>
          <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr_1fr]">
            <Input
              value={skillName}
              onChange={(e) => onSkillNameChange(e.target.value)}
              placeholder="Skill name (e.g. HTML)"
            />
            <Input
              value={skillCategory}
              onChange={(e) => onSkillCategoryChange(e.target.value)}
              placeholder="Category (e.g. web)"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={skillRelevanceScore}
              onChange={(e) => onSkillRelevanceScoreChange(e.target.value)}
              placeholder="Relevance score"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => void onAddSkill()} disabled={skillLoading}>
              {skillLoading ? "Adding..." : "Add skill"}
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-sm text-foreground"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(i)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
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
