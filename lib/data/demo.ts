import type { HomeData, HomeTeamMember } from "@/app/(dashboard)/overview/home-client";
import type { SalesData } from "@/app/(dashboard)/sales/sales-client";
import type { ActionCardData } from "@/components/dashboard/action-card";
import type { ActionCardExpandedData } from "@/components/dashboard/action-card-expanded";

/**
 * Email of the seeded demo account.
 * When this user logs in, Home renders rich hardcoded content instead of
 * reading from `agent_data`. Useful for screenshots, demos, and previews
 * while real customer data is loading.
 */
export const DEMO_EMAIL = "test@test.com";

const demoInsights: ActionCardData[] = [
  {
    id: "d-1",
    tag: "URGENT",
    summary: "$850K lead — no response 3 days · María Fernández",
  },
  {
    id: "d-2",
    tag: "PERFORMANCE",
    summary: "Pedro García — 5 leads, 0 contacted this week",
  },
  {
    id: "d-3",
    tag: "WIN",
    summary: "Ana Torres closed a $1.2M deal · Pacific Heights",
  },
  {
    id: "d-4",
    tag: "HOT LEAD",
    summary: "$4M project sale — 3 IDX visits, no agent assigned",
  },
  {
    id: "d-5",
    tag: "DEADLINE",
    summary: "Month-end in 4 days — 3/5 closed · $1.8M in escrow",
  },
  {
    id: "d-6",
    tag: "WARNING",
    summary: "Inversor Bolivia — no follow-up after showing 6d ago",
  },
  {
    id: "d-7",
    tag: "INSIGHT",
    summary: "Bolivia leads close 2.5× faster than average",
  },
  {
    id: "d-8",
    tag: "OPPORTUNITY",
    summary: "Coral Way penthouse — premium buyer profile, 88% close score",
  },
  {
    id: "d-9",
    tag: "PATTERN",
    summary: "Win rate drops 40% when 'Showing' exceeds 14 days",
  },
  {
    id: "d-10",
    tag: "RECOMMENDATION",
    summary: "Reassign 3 stalled deals from Pedro to Sarah",
  },
  {
    id: "d-11",
    tag: "WIN",
    summary: "Carlos identified Bolivia pattern — 3× conversion",
  },
  {
    id: "d-12",
    tag: "WARNING",
    summary: "Tech founder — inspection findings unanswered 4d",
  },
];

const demoTeam: HomeTeamMember[] = [
  {
    id: "t-1",
    fullName: "Sarah Mitchell",
    initials: "SM",
    pipelineLabel: "$3.9M",
    noteText: "Closing 11 deals",
    hasData: true,
  },
  {
    id: "t-2",
    fullName: "James Carter",
    initials: "JC",
    pipelineLabel: "$2.9M",
    noteText: "Closing 9 deals",
    hasData: true,
  },
  {
    id: "t-3",
    fullName: "Priya Shah",
    initials: "PS",
    pipelineLabel: "$2.3M",
    noteText: "Closing 8 deals",
    hasData: true,
  },
  {
    id: "t-4",
    fullName: "Marcus Reyes",
    initials: "MR",
    pipelineLabel: "$2.1M",
    noteText: "7 deals in progress",
    hasData: true,
  },
  {
    id: "t-5",
    fullName: "Emma Olsen",
    initials: "EO",
    pipelineLabel: "$1.8M",
    noteText: "Underperforming this week",
    hasData: true,
  },
  {
    id: "t-6",
    fullName: "Daniel Park",
    initials: "DP",
    pipelineLabel: "$1.2M",
    noteText: "5 deals in progress",
    hasData: true,
  },
];

// ─── Sales demo ────────────────────────────────────────────────

const demoUrgentDeals: ActionCardData[] = [
  {
    id: "u-1",
    tag: "URGENT",
    amount: "$850K",
    summary: "Carlos Mendez · No update 5 days · Sarah",
  },
  {
    id: "u-2",
    tag: "WARNING",
    amount: "$4.2M",
    summary: "Familia Rodríguez · Stalled 12 days · James",
  },
  {
    id: "u-3",
    tag: "URGENT",
    amount: "$2.1M",
    summary: "Pareja NY · Contract expires Friday · Priya",
  },
  {
    id: "u-4",
    tag: "WARNING",
    amount: "$1.5M",
    summary: "Inversor Bolivia · No follow-up after showing 6d · Marcus",
  },
  {
    id: "u-5",
    tag: "WARNING",
    amount: "$680K",
    summary: "Tech founder · Inspection findings unanswered 4d · Aisha",
  },
];

const expanded = (
  id: string,
  tag: ActionCardExpandedData["tag"],
  amount: string,
  title: string,
  meta: string
): ActionCardExpandedData => ({
  id,
  tag,
  amount,
  title,
  meta,
  actions: [
    { label: "View deal", primary: true },
    { label: "Reassign" },
  ],
});

const atRisk: ActionCardExpandedData[] = [
  expanded(
    "ar-1",
    "URGENT",
    "$4.2M",
    "Familia Rodríguez — stalled in Negotiation 12 days",
    "James Carter · Stage: Negotiation · Typical close: 7 days"
  ),
  expanded(
    "ar-2",
    "URGENT",
    "$2.1M",
    "Pareja NY — contract expires Friday",
    "Priya Shah · Stage: Under Contract · 3 days remaining"
  ),
  expanded(
    "ar-3",
    "URGENT",
    "$850K",
    "Carlos Mendez — no update from agent 5 days",
    "Sarah Mitchell · Stage: Negotiation · Last activity: 5d ago"
  ),
];

const stalled: ActionCardExpandedData[] = [
  expanded(
    "st-1",
    "WARNING",
    "$1.5M",
    "Inversor Bolivia — no follow-up after showing",
    "Marcus Reyes · Stage: Showing · Last activity: 6d ago"
  ),
  expanded(
    "st-2",
    "WARNING",
    "$680K",
    "Tech founder — inspection findings unanswered",
    "Aisha Patel · Stage: Inspection · Last activity: 4d ago"
  ),
];

const hot: ActionCardExpandedData[] = [
  expanded(
    "h-1",
    "HOT LEAD",
    "$4.2M",
    "Carlos Mendez — high engagement, repeat visits",
    "Sarah Mitchell · Stage: Closing · 92% close score"
  ),
  expanded(
    "h-2",
    "OPPORTUNITY",
    "$3.5M",
    "Coral Way penthouse — premium buyer profile",
    "James Carter · Stage: Showing · 88% close score"
  ),
  expanded(
    "h-3",
    "HOT LEAD",
    "$2.8M",
    "Familia Rodríguez — strong intent signals",
    "James Carter · Stage: Negotiation · 84% close score"
  ),
  expanded(
    "h-4",
    "HOT LEAD",
    "$1.9M",
    "Tech founder — pre-approved, motivated",
    "Aisha Patel · Stage: Inspection · 81% close score"
  ),
  expanded(
    "h-5",
    "OPPORTUNITY",
    "$1.5M",
    "Inversor Bolivia — international cash buyer",
    "Marcus Reyes · Stage: Showing · 79% close score"
  ),
];

/** Full SalesData snapshot for the demo account. */
export const DEMO_SALES_DATA: SalesData = {
  snapshotLine:
    "$67.8M pipeline · 226 deals · 35.2% win rate · $4.2M closed this month",
  urgentDeals: demoUrgentDeals,
  weeklyInsight:
    "Deals from Bolivia close 2.5× faster than average. 3 deals stalled at 'Negotiation' — typical close is 7 days, these are at 12+. Worth pinging the agents this week.",
  dealsByTab: {
    "at-risk": atRisk,
    stalled,
    hot,
    "all-active": [...atRisk, ...stalled, ...hot],
  },
  totalDeals: 226,
  totalPipelineLabel: "$67.8M",
  isEmpty: false,
};

// ─── Home demo ─────────────────────────────────────────────────

/** Full HomeData snapshot for the demo account. */
export const DEMO_HOME_DATA: HomeData = {
  firstName: "Mike",
  pipelineValue: "$67.8M",
  leadsAtRiskCount: 7,
  closesLine: "3 / 5",
  pulsorInsights: demoInsights,
  weeklyInsight:
    "Bolivia leads close 2.5× faster than your team average. Lean into that segment this month — there are 14 active prospects matching the pattern.",
  thisWeekGoal:
    "Move 5 deals from 'Negotiation' to 'Under Contract' by Friday. Focus on the 3 deals stalled longer than 10 days.",
  lastWeekWins:
    "Ana Torres closed a $1.2M deal in Pacific Heights — 12-day cycle. Carlos surfaced the Bolivia pattern that's now driving 3× conversion.",
  team: demoTeam,
  isEmpty: false,
};
