import { Box, Boxes, Search } from "lucide-react";
import { ToolCard } from "@/components/dashboard/tool-card";
import {
  TOOL_CATEGORIES,
  totalToolCount,
  uniqueToolCount,
} from "@/lib/tools/data";

export const metadata = {
  title: "Tools",
};

export default function ToolsPage() {
  const total = totalToolCount();
  const unique = uniqueToolCount();
  const categories = TOOL_CATEGORIES.length;

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Tools directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Every tool a US real estate team might already have in their stack.
            Curated by category — click any card to visit the official site.
          </p>
        </div>
      </header>

      {/* Stats band */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total entries"
          value={total.toString()}
          hint="across categories"
          accent="bg-violet-100 text-violet-600"
          icon={<Boxes className="h-5 w-5" strokeWidth={1.75} />}
        />
        <StatCard
          label="Unique tools"
          value={unique.toString()}
          hint="some appear in multiple categories"
          accent="bg-emerald-100 text-emerald-600"
          icon={<Box className="h-5 w-5" strokeWidth={1.75} />}
        />
        <StatCard
          label="Categories"
          value={categories.toString()}
          hint="from CRM to phone systems"
          accent="bg-amber-100 text-amber-600"
          icon={<Search className="h-5 w-5" strokeWidth={1.75} />}
        />
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-5 flex flex-col justify-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Missing one?
          </div>
          <a
            href="mailto:guido@grays.vc?subject=Tool%20to%20add%20to%20Pulsor%20directory"
            className="text-sm font-medium text-foreground mt-1 hover:text-primary"
          >
            Suggest a tool →
          </a>
        </div>
      </section>

      {/* Category sections */}
      <section className="space-y-10">
        {TOOL_CATEGORIES.map((cat) => (
          <div key={cat.key}>
            <div className="flex flex-col gap-1 mb-4 pb-3 border-b border-border/60">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-lg font-semibold text-foreground">
                  {cat.title}
                </h2>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-muted text-[10px] font-mono font-semibold tabular-nums text-muted-foreground px-1.5">
                  {cat.tools.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {cat.tools.map((tool) => (
                <ToolCard key={`${cat.key}-${tool.name}`} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-foreground mt-0.5 leading-none">
            {value}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>
        </div>
      </div>
    </div>
  );
}
