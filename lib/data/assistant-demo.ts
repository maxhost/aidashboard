/**
 * Demo data for the Assistant role views.
 * These views are shown when role === "assistant" and run on hardcoded data
 * only — there is no DB-backed path yet.
 */

export const ASSISTANT_FIRST_NAME = "Maria";

// ─── Morning Brief ─────────────────────────────────────────────
// Three calm sections instead of a task list. The Assistant is reporting
// what's happening today, not handing the agent a to-do list.

export type BriefAttentionTone = "warning" | "neutral" | "critical";

export type BriefAttentionItem = {
  id: string;
  headline: string;
  tone?: BriefAttentionTone;
};

export type BriefPriorityAction = "call" | "send" | "message" | "schedule";

export type BriefPriority = {
  id: string;
  headline: string;
  context?: string;
  action: { kind: BriefPriorityAction; label: string };
};

export type BriefHandled = {
  id: string;
  headline: string;
};

export type MorningBrief = {
  attention: BriefAttentionItem[];
  priorities: BriefPriority[];
  handled: BriefHandled[];
};

export const MORNING_BRIEF: MorningBrief = {
  attention: [
    {
      id: "a-1",
      headline: "Garcia waiting on pool options",
      tone: "warning",
    },
    {
      id: "a-2",
      headline: "Inspection at 3 PM confirmed",
      tone: "neutral",
    },
    {
      id: "a-3",
      headline: "Perez lender delayed 2 days",
      tone: "critical",
    },
    {
      id: "a-4",
      headline: "Castro active again on IDX",
      tone: "warning",
    },
  ],
  priorities: [
    {
      id: "p-1",
      headline: "Send Coral Gables comps to Perez",
      context: "Asked yesterday afternoon",
      action: { kind: "send", label: "Send" },
    },
    {
      id: "p-2",
      headline: "Confirm appraisal date with Sanchez",
      context: "Lender is waiting on a reply",
      action: { kind: "message", label: "Message" },
    },
    {
      id: "p-3",
      headline: "Schedule second showing at Brickell for Lopez",
      context: "Available this Saturday",
      action: { kind: "schedule", label: "Schedule" },
    },
  ],
  handled: [
    {
      id: "h-1",
      headline: "Title updated Sanchez file",
    },
    {
      id: "h-2",
      headline: "Appraisal received for Lopez",
    },
  ],
};

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

// ─── Operations (Kanban) ───────────────────────────────────────

export type PipelineStage =
  | "new-leads"
  | "in-conversation"
  | "showing"
  | "in-offer"
  | "under-contract";

export type ClientType = "buyer" | "seller" | "investor";

export type ClientTemperature = "hot" | "warm" | "cold";

export type PipelineClient = {
  id: string;
  name: string;
  stage: PipelineStage;
  daysInStage: number;
  type: ClientType;
  temperature: ClientTemperature;
  lastInteraction: string;
  budget?: string;
  area?: string;
  note?: string;
};

export const PIPELINE_STAGE_LABEL: Record<PipelineStage, string> = {
  "new-leads": "New leads",
  "in-conversation": "In conversation",
  showing: "Showing",
  "in-offer": "In offer",
  "under-contract": "Under contract",
};

export const PIPELINE_STAGE_ORDER: PipelineStage[] = [
  "new-leads",
  "in-conversation",
  "showing",
  "in-offer",
  "under-contract",
];

export const CLIENT_TYPE_LABEL: Record<ClientType, string> = {
  buyer: "Buyer",
  seller: "Seller",
  investor: "Investor",
};

export const PIPELINE_CLIENTS: PipelineClient[] = [
  // New leads (5)
  {
    id: "c-1",
    name: "Tom Harrison",
    stage: "new-leads",
    daysInStage: 1,
    type: "buyer",
    temperature: "warm",
    lastInteraction: "1d ago",
    budget: "$650K",
    area: "Coral Gables",
  },
  {
    id: "c-2",
    name: "Priscilla Adams",
    stage: "new-leads",
    daysInStage: 2,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Today",
    budget: "$1.2M",
    area: "Brickell",
  },
  {
    id: "c-3",
    name: "Davis Capital LLC",
    stage: "new-leads",
    daysInStage: 3,
    type: "investor",
    temperature: "warm",
    lastInteraction: "2d ago",
    budget: "$3.5M",
    area: "Miami Beach",
  },
  {
    id: "c-4",
    name: "Erika Whittaker",
    stage: "new-leads",
    daysInStage: 4,
    type: "seller",
    temperature: "cold",
    lastInteraction: "4d ago",
    area: "Coconut Grove",
  },
  // In conversation (4)
  {
    id: "c-5",
    name: "Mark Donovan",
    stage: "in-conversation",
    daysInStage: 3,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Yesterday",
    budget: "$850K",
    area: "Coral Gables",
  },
  {
    id: "c-6",
    name: "Stephanie Quinn",
    stage: "in-conversation",
    daysInStage: 5,
    type: "buyer",
    temperature: "warm",
    lastInteraction: "3d ago",
    budget: "$520K",
    area: "Wynwood",
  },
  {
    id: "c-7",
    name: "The Aldridge Family",
    stage: "in-conversation",
    daysInStage: 7,
    type: "seller",
    temperature: "warm",
    lastInteraction: "2d ago",
    area: "Pinecrest",
  },
  // Showing (3)
  {
    id: "c-8",
    name: "Jeremy Wallace",
    stage: "showing",
    daysInStage: 6,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Yesterday",
    budget: "$1.4M",
    area: "Brickell",
    note: "3rd showing scheduled Saturday",
  },
  {
    id: "c-9",
    name: "Garcia Family",
    stage: "showing",
    daysInStage: 9,
    type: "buyer",
    temperature: "warm",
    lastInteraction: "2d ago",
    budget: "$780K",
    area: "Coral Gables",
  },
  {
    id: "c-10",
    name: "Northwood Holdings",
    stage: "showing",
    daysInStage: 12,
    type: "investor",
    temperature: "cold",
    lastInteraction: "6d ago",
    budget: "$5M+",
    area: "Edgewater",
  },
  // In offer (2)
  {
    id: "c-11",
    name: "Lopez Family",
    stage: "in-offer",
    daysInStage: 4,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Today",
    budget: "$1.1M",
    area: "Brickell",
    note: "Counter-offer expected today",
  },
  {
    id: "c-12",
    name: "Brendan Cole",
    stage: "in-offer",
    daysInStage: 8,
    type: "buyer",
    temperature: "warm",
    lastInteraction: "3d ago",
    budget: "$680K",
    area: "Wynwood",
  },
  // Under contract (3)
  {
    id: "c-13",
    name: "Ramirez",
    stage: "under-contract",
    daysInStage: 17,
    type: "buyer",
    temperature: "warm",
    lastInteraction: "Yesterday",
    budget: "$720K",
    area: "Coral Way",
  },
  {
    id: "c-14",
    name: "Castro",
    stage: "under-contract",
    daysInStage: 27,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Today",
    budget: "$945K",
    area: "Sunset Dr",
  },
  // Under contract — closing-stage clients (4)
  {
    id: "c-15",
    name: "Garcia",
    stage: "under-contract",
    daysInStage: 24,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Today",
    budget: "$1.05M",
    area: "NE 95th St",
    note: "Final walkthrough next week",
  },
  {
    id: "c-16",
    name: "Sanchez",
    stage: "under-contract",
    daysInStage: 38,
    type: "buyer",
    temperature: "hot",
    lastInteraction: "Today",
    budget: "$1.6M",
    area: "Ocean Blvd",
  },
];
