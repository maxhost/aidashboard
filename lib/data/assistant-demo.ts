/**
 * Demo data for the Assistant role views.
 * These views are shown when role === "assistant" and run on hardcoded data
 * only — there is no DB-backed path yet.
 */

export type TaskUrgency = "urgent" | "today" | "this-week";

export type TaskAction = "call" | "message" | "send" | "done";

export type DailyTask = {
  id: string;
  client: string;
  action: string;
  context?: string;
  urgency: TaskUrgency;
  primaryAction: { kind: TaskAction; label: string };
};

export const ASSISTANT_FIRST_NAME = "Maria";

export const DAILY_TASKS: DailyTask[] = [
  {
    id: "t-1",
    client: "Garcia",
    action: "Call about the pool options",
    context: "You promised to send options today",
    urgency: "urgent",
    primaryAction: { kind: "call", label: "Call" },
  },
  {
    id: "t-2",
    client: "Ramirez",
    action: "Confirm inspection before 6 PM",
    context: "Deadline today",
    urgency: "urgent",
    primaryAction: { kind: "call", label: "Call" },
  },
  {
    id: "t-3",
    client: "Perez",
    action: "Send Coral Gables comps",
    context: "Requested yesterday afternoon",
    urgency: "today",
    primaryAction: { kind: "send", label: "Send" },
  },
  {
    id: "t-4",
    client: "Lopez",
    action: "Schedule second showing at the Brickell house",
    context: "Available this Saturday",
    urgency: "today",
    primaryAction: { kind: "message", label: "Message" },
  },
  {
    id: "t-5",
    client: "Castro",
    action: "Send signed contract to title company",
    context: "Offer accepted yesterday",
    urgency: "today",
    primaryAction: { kind: "send", label: "Send" },
  },
  {
    id: "t-6",
    client: "Sanchez",
    action: "Confirm appraisal date",
    context: "Lender is waiting on a reply",
    urgency: "today",
    primaryAction: { kind: "message", label: "Message" },
  },
  {
    id: "t-7",
    client: "Garcia",
    action: "Prep final walkthrough",
    context: "Closing in 8 days",
    urgency: "this-week",
    primaryAction: { kind: "done", label: "Mark done" },
  },
  {
    id: "t-8",
    client: "Perez",
    action: "Ask for referrals after closing",
    urgency: "this-week",
    primaryAction: { kind: "done", label: "Mark done" },
  },
];

// ─── Transactions ──────────────────────────────────────────────

export type TransactionStatus = "on-track" | "at-risk" | "delayed";

export type Responsible = "you" | "lender" | "title" | "client" | "system";

export type TimelineMilestoneState = "done" | "current" | "future";

export type TimelineMilestone = {
  id: string;
  label: string;
  date?: string;
  state: TimelineMilestoneState;
};

export type Transaction = {
  id: string;
  address: string;
  client: string;
  progressPct: number;
  status: TransactionStatus;
  nextStep: string;
  dueLabel: string;
  responsible: Responsible;
  closingDate: string;
  timeline: TimelineMilestone[];
};

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    address: "742 Coral Way",
    client: "Ramirez",
    progressPct: 60,
    status: "at-risk",
    nextStep: "Appraisal report",
    dueLabel: "Lender response 2 days late",
    responsible: "lender",
    closingDate: "Jun 12, 2026",
    timeline: [
      { id: "m-1", label: "Offer accepted", date: "May 1", state: "done" },
      { id: "m-2", label: "Inspection", date: "May 8", state: "done" },
      { id: "m-3", label: "Appraisal", date: "May 18", state: "current" },
      { id: "m-4", label: "Loan commitment", state: "future" },
      { id: "m-5", label: "Final walkthrough", state: "future" },
      { id: "m-6", label: "Closing", date: "Jun 12", state: "future" },
    ],
  },
  {
    id: "tx-2",
    address: "1830 Brickell Ave, #2204",
    client: "Lopez",
    progressPct: 40,
    status: "delayed",
    nextStep: "Re-submit signed disclosures",
    dueLabel: "Client unresponsive 4 days",
    responsible: "client",
    closingDate: "Jun 20, 2026",
    timeline: [
      { id: "m-1", label: "Offer accepted", date: "Apr 28", state: "done" },
      { id: "m-2", label: "Disclosures sent", date: "May 5", state: "done" },
      { id: "m-3", label: "Disclosures signed", state: "current" },
      { id: "m-4", label: "Inspection", state: "future" },
      { id: "m-5", label: "Appraisal", state: "future" },
      { id: "m-6", label: "Closing", date: "Jun 20", state: "future" },
    ],
  },
  {
    id: "tx-3",
    address: "315 NE 95th St",
    client: "Garcia",
    progressPct: 75,
    status: "on-track",
    nextStep: "Loan commitment",
    dueLabel: "Expected May 22",
    responsible: "lender",
    closingDate: "Jun 5, 2026",
    timeline: [
      { id: "m-1", label: "Offer accepted", date: "Apr 20", state: "done" },
      { id: "m-2", label: "Inspection", date: "Apr 28", state: "done" },
      { id: "m-3", label: "Appraisal", date: "May 10", state: "done" },
      { id: "m-4", label: "Loan commitment", state: "current" },
      { id: "m-5", label: "Final walkthrough", state: "future" },
      { id: "m-6", label: "Closing", date: "Jun 5", state: "future" },
    ],
  },
  {
    id: "tx-4",
    address: "2208 Sunset Dr",
    client: "Castro",
    progressPct: 80,
    status: "on-track",
    nextStep: "Title clearance",
    dueLabel: "Due May 23",
    responsible: "title",
    closingDate: "Jun 2, 2026",
    timeline: [
      { id: "m-1", label: "Offer accepted", date: "Apr 18", state: "done" },
      { id: "m-2", label: "Inspection", date: "Apr 25", state: "done" },
      { id: "m-3", label: "Appraisal", date: "May 6", state: "done" },
      { id: "m-4", label: "Loan commitment", date: "May 14", state: "done" },
      { id: "m-5", label: "Title clearance", state: "current" },
      { id: "m-6", label: "Closing", date: "Jun 2", state: "future" },
    ],
  },
  {
    id: "tx-5",
    address: "401 Ocean Blvd, #708",
    client: "Sanchez",
    progressPct: 95,
    status: "on-track",
    nextStep: "Final walkthrough",
    dueLabel: "Scheduled May 19",
    responsible: "you",
    closingDate: "May 21, 2026",
    timeline: [
      { id: "m-1", label: "Offer accepted", date: "Mar 30", state: "done" },
      { id: "m-2", label: "Inspection", date: "Apr 8", state: "done" },
      { id: "m-3", label: "Appraisal", date: "Apr 20", state: "done" },
      { id: "m-4", label: "Loan commitment", date: "May 4", state: "done" },
      { id: "m-5", label: "Title clearance", date: "May 12", state: "done" },
      { id: "m-6", label: "Final walkthrough", state: "current" },
      { id: "m-7", label: "Closing", date: "May 21", state: "future" },
    ],
  },
];

export const RESPONSIBLE_LABEL: Record<Responsible, string> = {
  you: "You",
  lender: "Lender",
  title: "Title",
  client: "Client",
  system: "System",
};
