import { BadgeCheck, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsSectionHeader from "./SettingsSectionHeader";

interface AccountSectionProps {
  email: string;
  userRole: string;
}

export default function AccountSection({ email, userRole }: AccountSectionProps) {
  return (
    <>
      <SettingsSectionHeader
        title="Account"
        description="Your account details and role information."
      />

      <div className="max-w-lg space-y-6">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" /> Email address
          </Label>
          <Input value={email} disabled className="cursor-not-allowed bg-muted" />
          <p className="text-xs text-muted-foreground">
            Your email address is managed by your account provider.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <BadgeCheck className="h-4 w-4 text-muted-foreground" /> Role
          </Label>
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{userRole || "-"}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your role determines what you can do on the platform.
          </p>
        </div>
      </div>
    </>
  );
}
