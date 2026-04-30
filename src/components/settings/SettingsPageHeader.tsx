import { TrendingUp } from "lucide-react";

interface SettingsPageHeaderProps {
  isClient: boolean;
  profileProgress: number;
}

export default function SettingsPageHeader({ isClient, profileProgress }: SettingsPageHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        {!isClient && (
          <div className="flex items-center gap-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${profileProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                <span className="text-yellow-500">{profileProgress.toFixed(0)}%</span>
                {profileProgress >= 100 ? (
                  <span className="text-green-700"> completed!</span>
                ) : (
                  <span className="text-muted-foreground">
                    complete your profile to increase your chances of successful collaboration.
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
