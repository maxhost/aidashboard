import { Users } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1440px] mx-auto">
      <header className="mb-8">
        <h1 className="text-display text-foreground">Team performance</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Per-agent metrics, coaching opportunities, and pipeline health.
        </p>
      </header>
      <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-lg bg-card">
        <Users
          className="h-10 w-10 text-muted-foreground/40 mb-4"
          strokeWidth={1.5}
        />
        <h2 className="text-base font-semibold text-foreground">
          Team view coming next
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Agent cards, coaching notes, and detail sheets will live here.
        </p>
      </div>
    </div>
  );
}
