import { redirect } from "next/navigation";
import { getMyDashboard } from "@/lib/data/dashboard";
import { getCompanyStrategy } from "@/lib/data/company-content";
import { DEMO_EMAIL } from "@/lib/data/demo";
import { StrategyClient, type StrategyData } from "./strategy-client";

const DEMO_STRATEGY: StrategyData = {
  milestones: [
    { id: "m-onboarding", label: "Onboarding", date: "Apr 15", state: "done" },
    { id: "m-audit", label: "Audit", date: "Apr 22", state: "done" },
    {
      id: "m-monthly",
      label: "Optimization",
      date: "May 1 – 28",
      state: "current",
    },
    { id: "m-mid-q", label: "Mid-quarter", date: "May 28", state: "future" },
    { id: "m-q2-final", label: "Q2 review", date: "Jun 30", state: "future" },
  ],
  currentFocusLabel: "Optimization",
  currentFocusDay: 12,
  currentFocusPeriodLength: 28,
  pipelineGoalPct: 68,
  initiatives: [
    { id: "i-1", label: "Bolivia priority workflow", state: "done" },
    { id: "i-2", label: "Sarah's lead reassignment", state: "current" },
    { id: "i-3", label: "Q2 international expansion", state: "future" },
  ],
  actionItems: [
    {
      id: "ai-1",
      label: "Implement Bolivia priority workflow",
      state: "done",
    },
    {
      id: "ai-2",
      label: "Reassign 3 stalled deals to Sarah",
      state: "done",
    },
    {
      id: "ai-3",
      label: "Define Q2 reach goals for international market",
      state: "future",
    },
    {
      id: "ai-4",
      label: "Test new lead qualification script",
      state: "future",
    },
  ],
  lastReviewDate: "Apr 28",
  nextMilestoneLabel: "Mid-quarter review",
  nextMilestoneDate: "May 28",
  nextMilestoneDaysAway: 21,
};

const EMPTY_STRATEGY: StrategyData = {
  milestones: [],
  currentFocusLabel: "",
  currentFocusDay: 1,
  currentFocusPeriodLength: 28,
  pipelineGoalPct: 0,
  initiatives: [],
  actionItems: [],
  lastReviewDate: null,
  nextMilestoneLabel: null,
  nextMilestoneDate: null,
  nextMilestoneDaysAway: 0,
};

export default async function StrategyPage() {
  const dashboard = await getMyDashboard();
  if (!dashboard) redirect("/login");

  // Demo account — rich hardcoded
  if (dashboard.user.email === DEMO_EMAIL) {
    return <StrategyClient data={DEMO_STRATEGY} />;
  }

  // Real users: load company strategy
  const strategy = dashboard.user.company_id
    ? await getCompanyStrategy(dashboard.user.company_id)
    : null;

  const data: StrategyData = strategy
    ? {
        milestones: strategy.milestones,
        currentFocusLabel: strategy.current_focus_label ?? "",
        currentFocusDay: strategy.current_focus_day,
        currentFocusPeriodLength: strategy.current_focus_period_length,
        pipelineGoalPct: strategy.pipeline_goal_pct,
        initiatives: strategy.initiatives,
        actionItems: strategy.action_items,
        lastReviewDate: strategy.last_review_date,
        nextMilestoneLabel: strategy.next_milestone_label,
        nextMilestoneDate: strategy.next_milestone_date,
        nextMilestoneDaysAway: strategy.next_milestone_days_away,
      }
    : EMPTY_STRATEGY;

  return <StrategyClient data={data} />;
}
