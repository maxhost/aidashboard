import { Box, Boxes, Grid3x3, Home } from "lucide-react";
import { ToolsTable } from "@/components/dashboard/tools-table";
import {
  getCategoryOptions,
  getFlatTools,
  reNativeToolCount,
  totalToolCount,
  uniqueToolCount,
} from "@/lib/tools/data";

export const metadata = {
  title: "Tools",
};

export default function ToolsPage() {
  const tools = getFlatTools();
  const categories = getCategoryOptions();
  const total = totalToolCount();
  const unique = uniqueToolCount();
  const reNative = reNativeToolCount();
  const reNativePct = Math.round((reNative / unique) * 100);

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
            Click any row to visit the official site.
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
          hint="some live in multiple lanes"
          accent="bg-emerald-100 text-emerald-600"
          icon={<Box className="h-5 w-5" strokeWidth={1.75} />}
        />
        <StatCard
          label="RE-native"
          value={reNative.toString()}
          hint={`${reNativePct}% of unique tools`}
          accent="bg-amber-100 text-amber-600"
          icon={<Home className="h-5 w-5" strokeWidth={1.75} />}
        />
        <StatCard
          label="Categories"
          value={categories.length.toString()}
          hint="from CRM to phone systems"
          accent="bg-sky-100 text-sky-600"
          icon={<Grid3x3 className="h-5 w-5" strokeWidth={1.75} />}
        />
      </section>

      {/* Searchable filterable table */}
      <ToolsTable tools={tools} categories={categories} />
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
