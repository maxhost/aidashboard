import { redirect } from "next/navigation";
import {
  criticalLeadToCard,
  formatCompactCurrency,
  getMyDashboard,
} from "@/lib/data/dashboard";
import { DEMO_EMAIL, DEMO_SALES_DATA } from "@/lib/data/demo";
import type { ActionTag } from "@/components/dashboard/action-card";
import type { ActionCardExpandedData } from "@/components/dashboard/action-card-expanded";
import type { CriticalLead } from "@/lib/data/types";
import { SalesClient, type SalesData } from "./sales-client";

/** Bucket a critical lead into a sales tab by urgency. */
function tabForLead(l: CriticalLead): "at-risk" | "stalled" | "hot" {
  const days = l.days_no_contact ?? 0;
  if (days > 5) return "at-risk";
  if (days > 2) return "stalled";
  return "hot";
}

function tagForLead(l: CriticalLead): ActionTag {
  const days = l.days_no_contact ?? 0;
  if (days > 5) return "URGENT";
  if (days > 2) return "WARNING";
  return "HOT LEAD";
}

function leadToExpanded(l: CriticalLead): ActionCardExpandedData {
  const days = l.days_no_contact ?? 0;
  const metaParts: string[] = [];
  if (l.status) metaParts.push(`Stage: ${l.status}`);
  if (days > 0) metaParts.push(`${days}d no contact`);
  return {
    id: l.id,
    tag: tagForLead(l),
    amount: formatCompactCurrency(l.value_usd),
    title: l.name,
    meta: metaParts.join(" · ") || "—",
    actions: [{ label: "View deal", primary: true }],
  };
}

export default async function SalesPage() {
  const dashboard = await getMyDashboard();
  if (!dashboard) redirect("/login");

  // Demo account: rich hardcoded snapshot.
  if (dashboard.user.email === DEMO_EMAIL) {
    return <SalesClient data={DEMO_SALES_DATA} />;
  }

  const { agentData } = dashboard;
  const isEmpty = !agentData;
  const leads = agentData?.critical_leads ?? [];

  // Performance snapshot line
  const snapshotLine = agentData
    ? `${formatCompactCurrency(Number(agentData.pipeline_value))} pipeline · ${agentData.leads_total} leads · ${Number(agentData.conversion_rate).toFixed(1)}% conversion · ${formatCompactCurrency(Number(agentData.money_on_table))} on table`
    : "";

  // Urgent deals (top 5 most stale)
  const urgentDeals = leads
    .filter((l) => (l.days_no_contact ?? 0) > 5)
    .sort((a, b) => (b.days_no_contact ?? 0) - (a.days_no_contact ?? 0))
    .slice(0, 5)
    .map(criticalLeadToCard);

  // Tabs
  const dealsByTab: Record<
    "at-risk" | "stalled" | "hot" | "all-active",
    ActionCardExpandedData[]
  > = {
    "at-risk": [],
    stalled: [],
    hot: [],
    "all-active": [],
  };
  for (const l of leads) {
    const expanded = leadToExpanded(l);
    dealsByTab[tabForLead(l)].push(expanded);
    dealsByTab["all-active"].push(expanded);
  }
  // Sort each tab by amount desc
  for (const k of Object.keys(dealsByTab) as Array<keyof typeof dealsByTab>) {
    dealsByTab[k].sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
  }

  const data: SalesData = {
    snapshotLine,
    urgentDeals,
    weeklyInsight: agentData?.weekly_insight ?? null,
    dealsByTab,
    totalDeals: leads.length,
    totalPipelineLabel: agentData
      ? formatCompactCurrency(Number(agentData.pipeline_value))
      : "—",
    isEmpty,
  };

  return <SalesClient data={data} />;
}

/** Parse a "$4.2M" / "$650K" / "$120" string into a number for sorting. */
function parseAmount(s?: string): number {
  if (!s) return 0;
  const m = s.match(/\$([\d.]+)\s*([MK])?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (m[2]?.toUpperCase() === "M") return n * 1_000_000;
  if (m[2]?.toUpperCase() === "K") return n * 1_000;
  return n;
}
