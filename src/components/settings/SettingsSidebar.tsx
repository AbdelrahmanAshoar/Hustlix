import { ChevronRight } from "lucide-react";
import type { SettingsNavItem, SettingsTab } from "./types";

interface SettingsSidebarProps {
  items: SettingsNavItem[];
  activeTab: SettingsTab;
  onChangeTab: (tab: SettingsTab) => void;
}

export default function SettingsSidebar({ items, activeTab, onChangeTab }: SettingsSidebarProps) {
  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChangeTab(item.key)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
