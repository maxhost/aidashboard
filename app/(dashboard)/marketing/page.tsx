import { Megaphone } from "lucide-react";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { dashboardData } from "@/lib/mock-data";

export const metadata = {
  title: "Marketing",
};

export default function MarketingPage() {
  const { period } = dashboardData;

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Channel performance, paid spend, and acquisition cost.
          </p>
        </div>
        <PeriodSelector label={period.label} />
      </header>

      {/* Placeholder — depends on Phase 2 ad-account integrations */}
      <section className="rounded-xl border border-dashed border-border/70 bg-card p-12 flex flex-col items-center text-center">
        <span className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Megaphone
            className="h-6 w-6 text-muted-foreground"
            strokeWidth={1.75}
          />
        </span>
        <h2 className="text-lg font-semibold text-foreground">
          Marketing dashboard wires up in Phase 2
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          Once your Google Ads, Meta, and lead-portal accounts are connected,
          this view will surface channel ROI, CAC by source, paid-vs-organic
          mix, and ad-spend trends.
        </p>

        {/* Shape of what's coming — visible scaffolding */}
        <div className="mt-8 w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Ad Spend" },
            { label: "Cost per Lead" },
            { label: "Paid Lead Volume" },
            { label: "Paid → Closed" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {item.label}
              </div>
              <div className="font-mono text-sm font-bold tabular-nums text-muted-foreground/40 mt-1">
                —
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
          <div className="rounded-lg border border-border/40 bg-muted/30 p-6 min-h-[120px] flex items-center justify-center">
            <span className="text-xs text-muted-foreground/50 font-mono">
              Spend by channel
            </span>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/30 p-6 min-h-[120px] flex items-center justify-center">
            <span className="text-xs text-muted-foreground/50 font-mono">
              ROI by channel
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
