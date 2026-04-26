import { Sparkles } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1440px] mx-auto">
      <header className="mb-8">
        <h1 className="text-display text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Actionable recommendations — implement, ignore, or come back later.
        </p>
      </header>
      <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-lg bg-card">
        <Sparkles
          className="h-10 w-10 text-muted-foreground/40 mb-4"
          strokeWidth={1.5}
        />
        <h2 className="text-base font-semibold text-foreground">
          Insights queue coming next
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Filterable list with implement / ignore states and detail sheets.
        </p>
      </div>
    </div>
  );
}
