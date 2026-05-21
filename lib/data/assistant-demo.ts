/**
 * Demo data for the Assistant role views.
 * These views are shown when role === "assistant" and run on hardcoded data
 * only — there is no DB-backed path yet.
 */

export const ASSISTANT_FIRST_NAME = "Maria";

// ─── Home (operational brief) ──────────────────────────────────
// The Home screen is structured like an AI chief-of-staff report:
// a contextual subtitle, a prioritized operational overview, suggested
// actions with rationale, and a quieter "already handled" tail.

export type BriefAttentionTone = "critical" | "warning" | "neutral";

export type BriefAttentionCategory =
  | "closing"
  | "negotiation"
  | "follow-up"
  | "contract"
  | "showing"
  | "lender"
  | "inspection";

export type BriefAttentionItem = {
  id: string;
  category: BriefAttentionCategory;
  headline: string;
  tone: BriefAttentionTone;
  /** ISO timestamp; when present the item is treated as resolved and filtered out. */
  resolvedAt?: string;
};

export type BriefPriorityAction = "call" | "send" | "message" | "schedule";

/**
 * Severity of the operational risk of leaving this priority unhandled today.
 * Only `critical` items show risk language in red in the detail sheet and a
 * subtle AT RISK marker inline.
 */
export type BriefPriorityRiskLevel = "critical" | "minor";

export type BriefPriority = {
  id: string;
  headline: string;
  /** Why this is on today's list — the context the assistant noticed. */
  context?: string;
  /** Optional operational risk if not handled today. */
  risk?: string;
  riskLevel?: BriefPriorityRiskLevel;
  action: { kind: BriefPriorityAction; label: string };
};

export type BriefHandled = {
  id: string;
  headline: string;
  /** Free-form when label, e.g. "Last night", "Yesterday 6:42 PM". */
  whenLabel?: string;
};

export type MorningBrief = {
  attention: BriefAttentionItem[];
  /** Items active yesterday that are no longer in today's top priorities. */
  earlier: BriefAttentionItem[];
  priorities: BriefPriority[];
  handled: BriefHandled[];
};

export const MORNING_BRIEF: MorningBrief = {
  attention: [
    {
      id: "a-1",
      category: "lender",
      headline: "Perez lender silent — payoff letter overdue 2 days",
      tone: "critical",
    },
    {
      id: "a-2",
      category: "closing",
      headline: "Sanchez closing Friday — title clearance still pending",
      tone: "critical",
    },
    {
      id: "a-3",
      category: "negotiation",
      headline: "Lopez counter-offer expected today",
      tone: "warning",
    },
    {
      id: "a-4",
      category: "follow-up",
      headline: "Garcia still waiting on pool-option comps",
      tone: "warning",
    },
    {
      id: "a-5",
      category: "follow-up",
      headline: "Castro re-opened the IDX search overnight",
      tone: "warning",
    },
    {
      id: "a-6",
      category: "inspection",
      headline: "Ramirez inspection confirmed — 3:00 PM",
      tone: "neutral",
    },
  ],
  earlier: [
    {
      id: "e-1",
      category: "contract",
      headline: "Ramirez disclosures signed",
      tone: "neutral",
    },
    {
      id: "e-2",
      category: "follow-up",
      headline: "Davis Capital requested investment portfolio",
      tone: "neutral",
    },
    {
      id: "e-3",
      category: "showing",
      headline: "Wallace 2nd showing — Brickell Ave",
      tone: "neutral",
    },
  ],
  priorities: [
    {
      id: "p-1",
      headline: "Send Coral Gables comps to Perez",
      context: "Buyer asked yesterday afternoon",
      risk: "May delay offer decision",
      action: { kind: "send", label: "Send" },
    },
    {
      id: "p-2",
      headline: "Confirm appraisal date with Sanchez",
      context: "Lender waiting on a reply since Monday",
      risk: "Could push closing one week",
      riskLevel: "critical",
      action: { kind: "message", label: "Message" },
    },
    {
      id: "p-3",
      headline: "Call title office about Ramirez payoff letter",
      context: "Lender flagged the missing doc on Friday",
      risk: "Closing slips if not received by Wednesday",
      riskLevel: "critical",
      action: { kind: "call", label: "Call" },
    },
    {
      id: "p-4",
      headline: "Send signed counter to Lopez selling agent",
      context: "Counter window closes tonight at 9 PM",
      risk: "Buyer may walk if it lapses",
      riskLevel: "critical",
      action: { kind: "send", label: "Send" },
    },
    {
      id: "p-5",
      headline: "Schedule second showing at Brickell for Lopez",
      context: "Available this Saturday afternoon",
      action: { kind: "schedule", label: "Schedule" },
    },
    {
      id: "p-6",
      headline: "Message Castro about the new Sunset Dr listing",
      context: "Re-opened the IDX search overnight",
      action: { kind: "message", label: "Message" },
    },
    {
      id: "p-7",
      headline: "Send disclosures to Garcia's pool inspector",
      context: "Inspection scheduled for Thursday morning",
      action: { kind: "send", label: "Send" },
    },
    {
      id: "p-8",
      headline: "Call Wallace to confirm 3rd showing on Saturday",
      context: "Hot buyer, two prior visits — ready to move",
      action: { kind: "call", label: "Call" },
    },
    {
      id: "p-9",
      headline: "Schedule pre-listing photos for Aldridge family",
      context: "Listing target is next Monday",
      risk: "Photographer books out 5 days ahead",
      action: { kind: "schedule", label: "Schedule" },
    },
    {
      id: "p-10",
      headline: "Message Davis Capital with Q2 off-market deal flow",
      context: "Requested investment portfolio last week",
      action: { kind: "message", label: "Message" },
    },
    {
      id: "p-11",
      headline: "Send updated proof of funds to Lopez lender",
      context: "Lender re-verified income this morning",
      action: { kind: "send", label: "Send" },
    },
    {
      id: "p-12",
      headline: "Call Priscilla Adams — new $1.2M buyer in Brickell",
      context: "Inbound today, pre-approved, motivated",
      risk: "Cold contact window closes after 24 h",
      action: { kind: "call", label: "Call" },
    },
  ],
  handled: [
    {
      id: "h-1",
      headline: "Title updated Sanchez file",
      whenLabel: "Last night",
    },
    {
      id: "h-2",
      headline: "Appraisal received for Lopez",
      whenLabel: "Last night",
    },
    {
      id: "h-3",
      headline: "Inspection report logged for Ramirez",
      whenLabel: "Yesterday 6:42 PM",
    },
  ],
};

export const ATTENTION_CATEGORY_LABEL: Record<BriefAttentionCategory, string> = {
  closing: "Closing",
  negotiation: "Negotiation",
  "follow-up": "Follow-up",
  contract: "Contract",
  showing: "Showing",
  lender: "Lender",
  inspection: "Inspection",
};

const ATTENTION_TONE_RANK: Record<BriefAttentionTone, number> = {
  critical: 0,
  warning: 1,
  neutral: 2,
};

/**
 * Live prioritization for the operational overview:
 * filter resolved items and sort critical → warning → neutral.
 */
export function prioritizeAttention(
  items: BriefAttentionItem[]
): BriefAttentionItem[] {
  return items
    .filter((it) => !it.resolvedAt)
    .slice()
    .sort(
      (a, b) =>
        ATTENTION_TONE_RANK[a.tone] - ATTENTION_TONE_RANK[b.tone]
    );
}

/**
 * Build a contextual subtitle — calm, operational, varies with state.
 * Deterministic on the input so the same brief always reads the same.
 */
export function buildBriefSubtitle(brief: MorningBrief): string {
  const active = prioritizeAttention(brief.attention);
  const critical = active.filter((a) => a.tone === "critical");
  const warning = active.filter((a) => a.tone === "warning");
  const blocking = critical.filter(
    (a) => a.category === "closing" || a.category === "lender"
  );

  if (blocking.length >= 2) {
    return `${blocking.length} closings may be delayed without action today.`;
  }
  if (critical.length >= 1) {
    const dominant = critical[0].category;
    const word =
      dominant === "lender"
        ? "lender follow-ups"
        : dominant === "closing"
          ? "closing items"
          : dominant === "negotiation"
            ? "negotiations"
            : `${ATTENTION_CATEGORY_LABEL[dominant].toLowerCase()} items`;
    return `Heavy transaction day. Prioritize ${word}.`;
  }
  const attentionCount = warning.length + critical.length;
  if (attentionCount >= 1) {
    return `You have ${attentionCount} active deal${attentionCount === 1 ? "" : "s"} needing attention today.`;
  }
  return "Today looks manageable. Focus on response speed.";
}

export type GreetingPeriod = "morning" | "afternoon" | "evening";

export function getGreetingPeriod(date: Date = new Date()): GreetingPeriod {
  const h = date.getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export const GREETING_LABEL: Record<GreetingPeriod, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
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

export type TransactionType = "buyer" | "seller";

/**
 * Operational phase of a transaction — coarser than `status`.
 * `listing`  — seller-side, pre-contract (marketing, showings, awaiting offer)
 * `pending`  — under contract, in due diligence / financing
 * `closing`  — closing within ~a week, all-hands-on-deck
 */
export type TransactionPhase = "listing" | "pending" | "closing";

export const TRANSACTION_PHASE_LABEL: Record<TransactionPhase, string> = {
  listing: "Listings",
  pending: "Pending",
  closing: "Closing this week",
};

export const TRANSACTION_PHASE_ORDER: TransactionPhase[] = [
  "closing",
  "pending",
  "listing",
];

export type TransactionPartyRole =
  | "buyer"
  | "seller"
  | "lender"
  | "title"
  | "inspector"
  | "tc"
  | "selling-agent"
  | "appraiser";

export const TRANSACTION_PARTY_LABEL: Record<TransactionPartyRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  lender: "Lender",
  title: "Title",
  inspector: "Inspector",
  tc: "TC",
  "selling-agent": "Listing agent",
  appraiser: "Appraiser",
};

export type TransactionParty = {
  id: string;
  role: TransactionPartyRole;
  name: string;
  lastInteraction?: string;
};

export type TransactionDocumentKind =
  | "disclosures"
  | "contract"
  | "inspection"
  | "appraisal"
  | "title"
  | "addendum"
  | "other";

export const TRANSACTION_DOCUMENT_LABEL: Record<
  TransactionDocumentKind,
  string
> = {
  disclosures: "Disclosures",
  contract: "Contract",
  inspection: "Inspection report",
  appraisal: "Appraisal",
  title: "Title commitment",
  addendum: "Addendum",
  other: "Other",
};

export type TransactionDocumentStatus = "received" | "pending" | "overdue";

export type TransactionDocument = {
  id: string;
  kind: TransactionDocumentKind;
  status: TransactionDocumentStatus;
  whenLabel?: string;
};

export type TransactionActivityKind =
  | "ai"
  | "voice"
  | "crm"
  | "message"
  | "system";

export type TransactionActivity = {
  id: string;
  kind: TransactionActivityKind;
  text: string;
  whenLabel: string;
};

export type TransactionAISummary = {
  /** One short paragraph the AI assistant uses to set context. */
  headline: string;
  /** Optional explicit blocker — what's holding the deal up right now. */
  blocker?: string;
  /** Concrete next step the assistant recommends. */
  nextAction?: string;
};

export type TransactionCriticalAction = {
  id: string;
  label: string;
  rationale?: string;
};

export type Transaction = {
  id: string;
  address: string;
  client: string;
  type: TransactionType;
  phase: TransactionPhase;
  progressPct: number;
  status: TransactionStatus;
  /** Short status reason shown in the header — eg. "Waiting on signed disclosures". */
  statusReason?: string;
  nextStep: string;
  dueLabel: string;
  responsible: Responsible;
  closingDate: string;
  timeline: TimelineMilestone[];
  aiSummary?: TransactionAISummary;
  criticalActions?: TransactionCriticalAction[];
  parties?: TransactionParty[];
  documents?: TransactionDocument[];
  activity?: TransactionActivity[];
};

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    address: "742 Coral Way",
    client: "Ramirez",
    type: "buyer",
    phase: "pending",
    progressPct: 60,
    status: "at-risk",
    statusReason: "Lender 2 days past commitment date",
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
    aiSummary: {
      headline:
        "Lender has not returned the payoff letter and appraisal is two days past the original commitment window.",
      blocker: "Lender — First Atlantic — silent since Friday",
      nextAction: "Call the lender contact and escalate to the branch manager.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Call First Atlantic about payoff letter",
        rationale: "2 days past commitment date",
      },
      {
        id: "ca-2",
        label: "Send appraisal status to Ramirez",
        rationale: "Buyer expects an update today",
      },
    ],
    parties: [
      { id: "p-1", role: "buyer", name: "Ramirez", lastInteraction: "Yesterday" },
      { id: "p-2", role: "lender", name: "First Atlantic", lastInteraction: "5d ago" },
      { id: "p-3", role: "title", name: "Pinnacle Title", lastInteraction: "Today" },
      { id: "p-4", role: "appraiser", name: "Mendez & Co.", lastInteraction: "May 18" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "May 1" },
      { id: "d-2", kind: "inspection", status: "received", whenLabel: "May 8" },
      { id: "d-3", kind: "appraisal", status: "overdue", whenLabel: "Due May 18" },
      { id: "d-4", kind: "title", status: "pending" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "ai",
        text: "Flagged lender silence — 5 days since last contact.",
        whenLabel: "2h ago",
      },
      {
        id: "a-2",
        kind: "voice",
        text: "Voice note: 'Talked to Ramirez, he's okay waiting through the week.'",
        whenLabel: "Yesterday",
      },
      {
        id: "a-3",
        kind: "crm",
        text: "Pinnacle Title confirmed payoff request received.",
        whenLabel: "Today 9:14 AM",
      },
    ],
  },
  {
    id: "tx-2",
    address: "1830 Brickell Ave, #2204",
    client: "Lopez",
    type: "buyer",
    phase: "pending",
    progressPct: 40,
    status: "delayed",
    statusReason: "Waiting on signed disclosures",
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
    aiSummary: {
      headline:
        "Buyer has not signed disclosures after 4 days. Inspection and appraisal are blocked until they come back.",
      blocker: "Buyer — Lopez Family",
      nextAction:
        "Call before noon today — Lopez was unreachable yesterday afternoon.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Call Lopez about disclosures",
        rationale: "4 days silent — last touch May 17",
      },
      {
        id: "ca-2",
        label: "Confirm Saturday showing logistics",
        rationale: "Counter-offer expected today",
      },
    ],
    parties: [
      { id: "p-1", role: "buyer", name: "Lopez Family", lastInteraction: "4d ago" },
      {
        id: "p-2",
        role: "selling-agent",
        name: "Maria Sandoval — Coldwell",
        lastInteraction: "Yesterday",
      },
      { id: "p-3", role: "lender", name: "Sunshine Mortgage", lastInteraction: "Today" },
      { id: "p-4", role: "title", name: "Pinnacle Title", lastInteraction: "2d ago" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "Apr 28" },
      { id: "d-2", kind: "disclosures", status: "overdue", whenLabel: "Sent May 5" },
      { id: "d-3", kind: "inspection", status: "pending" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "ai",
        text: "Lopez has been silent for 4 days — adjusting nudge cadence.",
        whenLabel: "1h ago",
      },
      {
        id: "a-2",
        kind: "voice",
        text: "Voice note: 'Maria says Lopez was at offsite meeting — try again at 4.'",
        whenLabel: "Yesterday",
      },
      {
        id: "a-3",
        kind: "message",
        text: "Resent disclosure packet via DocuSign.",
        whenLabel: "Tuesday",
      },
    ],
  },
  {
    id: "tx-3",
    address: "315 NE 95th St",
    client: "Garcia",
    type: "buyer",
    phase: "pending",
    progressPct: 75,
    status: "on-track",
    statusReason: "Awaiting loan commitment",
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
    aiSummary: {
      headline:
        "Appraisal cleared on May 10. Lender expects commitment by Friday. No risk signals.",
      nextAction: "Confirm pool-option comps with Garcia by tomorrow.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Send pool-option comps to Garcia",
        rationale: "Asked Sunday, no follow-up yet",
      },
    ],
    parties: [
      { id: "p-1", role: "buyer", name: "Garcia", lastInteraction: "2d ago" },
      { id: "p-2", role: "lender", name: "Atlantic Federal", lastInteraction: "Today" },
      { id: "p-3", role: "title", name: "Bayshore Title", lastInteraction: "May 12" },
      { id: "p-4", role: "inspector", name: "ProShield Inspections", lastInteraction: "Apr 28" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "Apr 20" },
      { id: "d-2", kind: "inspection", status: "received", whenLabel: "Apr 28" },
      { id: "d-3", kind: "appraisal", status: "received", whenLabel: "May 10" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "crm",
        text: "Atlantic Federal: loan commitment in underwriting.",
        whenLabel: "Today 8:02 AM",
      },
      {
        id: "a-2",
        kind: "ai",
        text: "No risk signals — deal trending on schedule.",
        whenLabel: "This morning",
      },
    ],
  },
  {
    id: "tx-4",
    address: "2208 Sunset Dr",
    client: "Castro",
    type: "buyer",
    phase: "pending",
    progressPct: 80,
    status: "on-track",
    statusReason: "Title clearance in progress",
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
    aiSummary: {
      headline:
        "Title clearance is the only open milestone before closing. Pinnacle is tracking lien removal — expected by Friday.",
      nextAction: "Confirm final walkthrough date with Castro this week.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Schedule final walkthrough",
        rationale: "Closing 11 days out",
      },
    ],
    parties: [
      { id: "p-1", role: "buyer", name: "Castro", lastInteraction: "Today" },
      { id: "p-2", role: "lender", name: "Atlantic Federal", lastInteraction: "May 14" },
      { id: "p-3", role: "title", name: "Pinnacle Title", lastInteraction: "Yesterday" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "Apr 18" },
      { id: "d-2", kind: "inspection", status: "received", whenLabel: "Apr 25" },
      { id: "d-3", kind: "appraisal", status: "received", whenLabel: "May 6" },
      { id: "d-4", kind: "title", status: "pending" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "voice",
        text: "Voice note: 'Castro re-opened IDX overnight — possibly second property.'",
        whenLabel: "Today 6:48 AM",
      },
      {
        id: "a-2",
        kind: "crm",
        text: "Pinnacle confirmed lien payoff request submitted.",
        whenLabel: "Yesterday",
      },
    ],
  },
  {
    id: "tx-5",
    address: "401 Ocean Blvd, #708",
    client: "Sanchez",
    type: "buyer",
    phase: "closing",
    progressPct: 95,
    status: "on-track",
    statusReason: "Closing this week",
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
    aiSummary: {
      headline:
        "Closing in 3 days. Final walkthrough was scheduled for May 19 — needs confirmation today.",
      nextAction:
        "Confirm walkthrough time with Sanchez and re-share closing-day logistics.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Confirm walkthrough time with Sanchez",
        rationale: "Scheduled May 19, not yet acknowledged",
      },
      {
        id: "ca-2",
        label: "Send closing-day checklist",
        rationale: "Closing in 3 days",
      },
    ],
    parties: [
      { id: "p-1", role: "buyer", name: "Sanchez", lastInteraction: "Today" },
      { id: "p-2", role: "lender", name: "Sunshine Mortgage", lastInteraction: "May 4" },
      { id: "p-3", role: "title", name: "Pinnacle Title", lastInteraction: "Today" },
      { id: "p-4", role: "tc", name: "Sofia Reyes (TC)", lastInteraction: "Yesterday" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "Mar 30" },
      { id: "d-2", kind: "inspection", status: "received", whenLabel: "Apr 8" },
      { id: "d-3", kind: "appraisal", status: "received", whenLabel: "Apr 20" },
      { id: "d-4", kind: "title", status: "received", whenLabel: "May 12" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "ai",
        text: "Closing 3 days out — prioritized walkthrough confirmation.",
        whenLabel: "Today",
      },
      {
        id: "a-2",
        kind: "system",
        text: "Closing-day calendar block created for May 21.",
        whenLabel: "Yesterday",
      },
      {
        id: "a-3",
        kind: "voice",
        text: "Voice note: 'Sanchez ready, just needs final walkthrough time.'",
        whenLabel: "2d ago",
      },
    ],
  },
  {
    id: "tx-6",
    address: "7345 SW 102nd St",
    client: "Aldridge Family",
    type: "seller",
    phase: "listing",
    progressPct: 30,
    status: "on-track",
    statusReason: "Pre-listing prep",
    nextStep: "Book pre-listing photos",
    dueLabel: "Target on-market May 28",
    responsible: "you",
    closingDate: "Target Jul 31, 2026",
    timeline: [
      { id: "m-1", label: "Listing agreement signed", date: "May 12", state: "done" },
      { id: "m-2", label: "Pricing strategy locked", date: "May 16", state: "done" },
      { id: "m-3", label: "Photos & video", state: "current" },
      { id: "m-4", label: "Live on MLS", state: "future" },
      { id: "m-5", label: "First offer", state: "future" },
      { id: "m-6", label: "Under contract", state: "future" },
      { id: "m-7", label: "Closing", state: "future" },
    ],
    aiSummary: {
      headline:
        "Listing agreement signed and price strategy locked. Photographer slot is the only thing blocking go-live.",
      nextAction:
        "Book pre-listing photographer this week — Aldridge wants to launch next Monday.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Book pre-listing photographer",
        rationale: "Photographer 5-day lead time",
      },
      {
        id: "ca-2",
        label: "Confirm pricing with Aldridge",
        rationale: "Final review before MLS",
      },
    ],
    parties: [
      { id: "p-1", role: "seller", name: "Aldridge Family", lastInteraction: "Today" },
      { id: "p-2", role: "tc", name: "Sofia Reyes (TC)", lastInteraction: "Yesterday" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "May 12" },
      { id: "d-2", kind: "disclosures", status: "pending" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "ai",
        text: "Photographer lead time may slip Monday launch — flagged for today.",
        whenLabel: "1h ago",
      },
      {
        id: "a-2",
        kind: "message",
        text: "Aldridge replied: 'Happy with the comp set, let's go.'",
        whenLabel: "Today",
      },
    ],
  },
  {
    id: "tx-7",
    address: "3401 Day Ave",
    client: "Whittaker",
    type: "seller",
    phase: "listing",
    progressPct: 65,
    status: "on-track",
    statusReason: "Live on MLS — receiving showings",
    nextStep: "Open house Saturday",
    dueLabel: "9 days listed",
    responsible: "you",
    closingDate: "Target Jul 15, 2026",
    timeline: [
      { id: "m-1", label: "Listing agreement signed", date: "May 1", state: "done" },
      { id: "m-2", label: "Photos & video", date: "May 8", state: "done" },
      { id: "m-3", label: "Live on MLS", date: "May 12", state: "done" },
      { id: "m-4", label: "Showings", state: "current" },
      { id: "m-5", label: "First offer", state: "future" },
      { id: "m-6", label: "Under contract", state: "future" },
      { id: "m-7", label: "Closing", state: "future" },
    ],
    aiSummary: {
      headline:
        "Listed 9 days. 3 showings this week and a returning agent group on Saturday. No offers yet.",
      nextAction:
        "Send a 9-day market update to Whittaker before Friday — first offer feedback expected after open house.",
    },
    criticalActions: [
      {
        id: "ca-1",
        label: "Send 9-day market update to Whittaker",
        rationale: "Whittaker expects weekly check-ins",
      },
    ],
    parties: [
      { id: "p-1", role: "seller", name: "Whittaker", lastInteraction: "2d ago" },
    ],
    documents: [
      { id: "d-1", kind: "contract", status: "received", whenLabel: "May 1" },
      { id: "d-2", kind: "disclosures", status: "received", whenLabel: "May 6" },
    ],
    activity: [
      {
        id: "a-1",
        kind: "crm",
        text: "Showing logged from Coldwell — Saturday 2 PM.",
        whenLabel: "Today",
      },
      {
        id: "a-2",
        kind: "ai",
        text: "No offers after 9 days — recommend market update.",
        whenLabel: "This morning",
      },
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

// ─── Operations brief — AI intelligence on top of the CRM ──────
// The Operations page surfaces three categories of operational signals
// inferred from the underlying CRM/transaction data: things that need
// follow-up, transactions/items at risk, and momentum opportunities.

export type OpsTag =
  | "follow-up"
  | "showing"
  | "negotiation"
  | "offer"
  | "lender"
  | "buyer"
  | "seller"
  | "inspection"
  | "contract"
  | "closing";

export const OPS_TAG_LABEL: Record<OpsTag, string> = {
  "follow-up": "Follow-up",
  showing: "Showing",
  negotiation: "Negotiation",
  offer: "Offer",
  lender: "Lender",
  buyer: "Buyer",
  seller: "Seller",
  inspection: "Inspection",
  contract: "Contract",
  closing: "Closing",
};

export type OpsItem = {
  id: string;
  tag: OpsTag;
  headline: string;
  /** Who/what this signal relates to. */
  client?: string;
  /** Free-form time signal — "4d silent", "due tomorrow", "6h ago". */
  timeSignal?: string;
  /** Longer rationale shown on hover or in a future detail view. */
  detail?: string;
};

export type OpsAtRiskItem = OpsItem & {
  severity: "critical" | "warning";
};

export type OpsBrief = {
  needsAttention: OpsItem[];
  atRisk: OpsAtRiskItem[];
  momentum: OpsItem[];
};

export const OPERATIONS_BRIEF: OpsBrief = {
  needsAttention: [
    {
      id: "n-1",
      tag: "follow-up",
      headline: "Garcia family inactive for 4 days",
      client: "Garcia Family",
      timeSignal: "4d silent",
    },
    {
      id: "n-2",
      tag: "showing",
      headline: "Lopez Saturday showing still unconfirmed",
      client: "Lopez Family",
      timeSignal: "Showing in 2d",
    },
    {
      id: "n-3",
      tag: "buyer",
      headline: "Priscilla Adams — inbound 6h ago, no contact yet",
      client: "Priscilla Adams",
      timeSignal: "6h ago",
    },
    {
      id: "n-4",
      tag: "follow-up",
      headline: "Quinn waiting on Wynwood comps since Tuesday",
      client: "Stephanie Quinn",
      timeSignal: "3d waiting",
    },
    {
      id: "n-5",
      tag: "seller",
      headline: "Aldridge listing-prep call overdue",
      client: "Aldridge Family",
      timeSignal: "Overdue 2d",
    },
    {
      id: "n-6",
      tag: "offer",
      headline: "Cole counter-offer window expired",
      client: "Brendan Cole",
      timeSignal: "Expired yesterday",
    },
    {
      id: "n-7",
      tag: "follow-up",
      headline: "Northwood Holdings — no reply in 12 days",
      client: "Northwood Holdings",
      timeSignal: "12d silent",
    },
  ],
  atRisk: [
    {
      id: "r-1",
      severity: "critical",
      tag: "closing",
      headline: "Sanchez closing Friday — title still not cleared",
      client: "Sanchez",
      timeSignal: "Closing in 4d",
    },
    {
      id: "r-2",
      severity: "critical",
      tag: "lender",
      headline: "Ramirez lender 2 days past commitment date",
      client: "Ramirez",
      timeSignal: "+2d late",
    },
    {
      id: "r-3",
      severity: "warning",
      tag: "contract",
      headline: "Lopez disclosures still unsigned",
      client: "Lopez Family",
      timeSignal: "4d unsigned",
    },
    {
      id: "r-4",
      severity: "warning",
      tag: "inspection",
      headline: "Castro inspection deadline tomorrow",
      client: "Castro",
      timeSignal: "Due tomorrow",
    },
    {
      id: "r-5",
      severity: "warning",
      tag: "lender",
      headline: "Garcia appraisal report 1 day late",
      client: "Garcia",
      timeSignal: "+1d late",
    },
  ],
  momentum: [
    {
      id: "m-1",
      tag: "buyer",
      headline: "Castro reopened the IDX search 3× overnight",
      client: "Castro",
      timeSignal: "Last night",
    },
    {
      id: "m-2",
      tag: "buyer",
      headline: "Priscilla Adams pre-approved and asking for tours",
      client: "Priscilla Adams",
      timeSignal: "Today",
    },
    {
      id: "m-3",
      tag: "seller",
      headline: "Aldridge replied after 6 days silent",
      client: "Aldridge Family",
      timeSignal: "Today",
    },
    {
      id: "m-4",
      tag: "buyer",
      headline: "Donovan raised budget to $850K",
      client: "Mark Donovan",
      timeSignal: "Yesterday",
    },
    {
      id: "m-5",
      tag: "follow-up",
      headline: "Davis Capital asked for off-market portfolio",
      client: "Davis Capital",
      timeSignal: "Today",
    },
  ],
};

export type PipelineSnapshot = {
  activeClients: number;
  inShowing: number;
  underContract: number;
  closingThisWeek: number;
};

/**
 * Pipeline snapshot — small numeric summary so the realtor can keep an
 * eye on the underlying CRM without having to look at the full kanban.
 */
export function computePipelineSnapshot(
  clients: PipelineClient[],
  transactions: Transaction[],
  today: Date = new Date()
): PipelineSnapshot {
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const closingThisWeek = transactions.filter((t) => {
    const closing = new Date(t.closingDate);
    return closing >= today && closing <= weekFromNow;
  }).length;
  return {
    activeClients: clients.length,
    inShowing: clients.filter((c) => c.stage === "showing").length,
    underContract: clients.filter((c) => c.stage === "under-contract").length,
    closingThisWeek,
  };
}

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
