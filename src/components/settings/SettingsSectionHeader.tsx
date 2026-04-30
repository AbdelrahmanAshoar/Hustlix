interface SettingsSectionHeaderProps {
  title: string;
  description: string;
}

export default function SettingsSectionHeader({ title, description }: SettingsSectionHeaderProps) {
  return (
    <div className="mb-6 border-b border-border pb-4">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
