import type { LucideIcon } from "lucide-react";

export type SettingsTab = "profile" | "account" | "professional" | "portfolio";

export interface SettingsNavItem {
  key: SettingsTab;
  label: string;
  icon: LucideIcon;
}
