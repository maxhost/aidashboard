import type { Workflow, WorkflowCategory } from "@/lib/types";

/**
 * Conservative estimates of how long a human would take to do each
 * task category manually, in minutes. Used to compute "time saved"
 * per workflow run (completed × estimate). Tweak from a single place.
 */
const MANUAL_TIME_PER_TASK_MIN: Record<WorkflowCategory, number> = {
  "Follow-up": 3, // 3 min to type + send a personalized SMS
  "Lead Nurture": 5, // 5 min to write + send a nurture email
  Listing: 15, // 15 min to design + blast a listing post
  "Re-engagement": 4, // 4 min to craft a personalized re-engage outreach
  Sphere: 2, // 2 min to send a personal sphere touchpoint
};

/** Hours of human time the workflow has saved this period (based on completed runs). */
export function timeSavedHours(workflow: Workflow): number {
  const minPerTask = MANUAL_TIME_PER_TASK_MIN[workflow.category];
  return (workflow.metrics.completed * minPerTask) / 60;
}

/** Aggregate hours saved across a set of workflows. */
export function totalTimeSavedHours(workflows: Workflow[]): number {
  return workflows.reduce((sum, w) => sum + timeSavedHours(w), 0);
}

/** Display-formatted hours (uses 1-decimal precision under 10h, integer above). */
export function formatHours(hours: number): string {
  if (hours <= 0) return "0 hrs";
  if (hours < 10) return `${hours.toFixed(1)} hrs`;
  return `${Math.round(hours)} hrs`;
}

/**
 * Category-aware noun for the narrative line under the hero metrics.
 * "142 leads handled" reads cleaner than "142 triggered" for a follow-up workflow,
 * but "5 listings reached" makes more sense for a listing-blast workflow.
 */
const NARRATIVE_NOUN: Record<WorkflowCategory, string> = {
  "Follow-up": "leads handled",
  "Lead Nurture": "leads engaged",
  Listing: "listings reached",
  "Re-engagement": "leads re-engaged",
  Sphere: "touchpoints sent",
};

export function buildNarrativeLine(workflow: Workflow): string {
  const m = workflow.metrics;
  if (m.completed === 0 && m.appointmentsCreated === 0 && m.closedDeals === 0) {
    return "Not running yet — fix to unlock value.";
  }
  const parts: string[] = [];
  if (m.completed > 0) {
    parts.push(`${m.completed} ${NARRATIVE_NOUN[workflow.category]}`);
  }
  if (m.appointmentsCreated > 0) {
    parts.push(`${m.appointmentsCreated} became appointments`);
  }
  if (m.closedDeals > 0) {
    parts.push(`${m.closedDeals} ${m.closedDeals === 1 ? "win" : "wins"}`);
  }
  return parts.join(" · ");
}
