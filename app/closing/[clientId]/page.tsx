import { notFound } from "next/navigation";
import { Check, Phone, Mail, MessageCircle } from "lucide-react";
import { TRANSACTIONS, type TimelineMilestone } from "@/lib/data/assistant-demo";
import { PulsorLockup } from "@/components/brand/pulsor";
import { cn } from "@/lib/utils";

// Public route — no auth, no sidebar. Shared with the buyer via link.

const AGENT = {
  name: "Maria Gonzalez",
  email: "maria@pulsor.co",
  phone: "(305) 555-0142",
};

const FRIENDLY_LABEL: Record<string, string> = {
  "Offer accepted": "Offer accepted",
  "Inspection": "Home inspection",
  "Appraisal": "Appraisal",
  "Loan commitment": "Loan approved",
  "Disclosures sent": "Disclosures sent",
  "Disclosures signed": "Disclosures signed",
  "Title clearance": "Title clearance",
  "Final walkthrough": "Final walkthrough",
  "Closing": "Closing day",
};

export default function ClosingProgressPage({
  params,
}: {
  params: { clientId: string };
}) {
  const tx = TRANSACTIONS.find((t) => t.id === params.clientId);
  if (!tx) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Brand */}
        <div className="flex items-center justify-center mb-10">
          <PulsorLockup size={40} textClassName="text-[18px]" />
        </div>

        {/* Greeting */}
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-medium text-foreground tracking-tight leading-tight">
            Hi {tx.client}, your home at{" "}
            <span className="text-foreground">{tx.address}</span> &#127969;
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Here&apos;s where things stand with your closing. We&apos;ll keep
            this page up to date — no need to check in.
          </p>
        </header>

        {/* Closing date hero */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Closing day
          </div>
          <div className="font-mono text-3xl font-medium tabular-nums text-foreground mt-2">
            {tx.closingDate}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-mono tabular-nums text-foreground">
              {tx.progressPct}%
            </span>
            <span>of the way there</span>
          </div>
          <div className="h-1.5 mt-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-success"
              style={{ width: `${tx.progressPct}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Steps to closing
          </h2>
          <ol className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {tx.timeline.map((m) => (
              <MilestoneRow key={m.id} milestone={m} />
            ))}
          </ol>
        </section>

        {/* Questions / agent contact */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-medium text-foreground">
            Questions?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            I&apos;m here for anything you need — call, text, or email.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-foreground text-background inline-flex items-center justify-center text-sm font-semibold shrink-0">
              {initials(AGENT.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {AGENT.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Your agent
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`tel:${AGENT.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              {AGENT.phone}
            </a>
            <a
              href={`sms:${AGENT.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
              Text
            </a>
            <a
              href={`mailto:${AGENT.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              Email
            </a>
          </div>
        </section>

        <footer className="text-center mt-10">
          <p className="text-[11px] text-muted-foreground">
            Powered by Pulsor &middot; pulsor.co
          </p>
        </footer>
      </div>
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: TimelineMilestone }) {
  const label = FRIENDLY_LABEL[milestone.label] ?? milestone.label;
  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <MilestoneDot state={milestone.state} />
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-medium",
            milestone.state === "future"
              ? "text-muted-foreground"
              : "text-foreground"
          )}
        >
          {label}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {milestone.state === "done" && milestone.date && `Done · ${milestone.date}`}
          {milestone.state === "current" && "In progress"}
          {milestone.state === "future" &&
            (milestone.date ? `Expected ${milestone.date}` : "Coming up")}
        </div>
      </div>
    </li>
  );
}

function MilestoneDot({
  state,
}: {
  state: TimelineMilestone["state"];
}) {
  if (state === "done") {
    return (
      <span
        aria-label="Completed"
        className="h-8 w-8 rounded-full bg-success text-background inline-flex items-center justify-center shrink-0"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span
        aria-label="In progress"
        className="h-8 w-8 rounded-full bg-foreground inline-flex items-center justify-center shrink-0 ring-4 ring-foreground/10"
      >
        <span className="h-2 w-2 rounded-full bg-background" />
      </span>
    );
  }
  return (
    <span
      aria-label="Pending"
      className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 bg-background shrink-0 inline-block"
    />
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
