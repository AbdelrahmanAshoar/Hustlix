interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export default function ComingSoonPage({
  title,
  description = "This page is under preparation and will be available soon.",
}: ComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Coming Soon
        </p>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
