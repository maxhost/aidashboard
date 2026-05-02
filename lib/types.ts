export type LeadStatus = "hot" | "warm" | "cold";
export type InsightType = "critical" | "warning" | "opportunity" | "info";
export type InsightState = "pending" | "snoozed" | "implemented" | "ignored";
export type InsightCategory =
  | "Marketing"
  | "Performance"
  | "Workflow"
  | "Lead Gen"
  | "Tech Stack";
export type WorkflowStatus = "performing" | "underperforming" | "healthy" | "broken";
export type Tool =
  | "Follow Up Boss"
  | "kvCORE"
  | "BoldTrail"
  | "BombBomb"
  | "Zillow Premier"
  | "Google Ads"
  | "Realtor.com"
  | "Mailchimp"
  | "Twilio"
  | "Canva"
  | "Slack"
  | "Calendly";

export type User = {
  id: string;
  name: string;
  initials: string;
  role: "Team Leader" | "Operations Manager" | "Agent";
  email: string;
  teamName: string;
};

export type KpiIconKey =
  | "deals"
  | "leads"
  | "appointment"
  | "response-time"
  | "revenue"
  | "conversion"
  | "workflows"
  | "completion"
  | "roi";

export type KpiTone = "primary" | "success" | "warning" | "danger" | "info";

export type KPI = {
  id: string;
  label: string;
  value: string;
  rawValue?: number;
  hint?: string;
  iconKey: KpiIconKey;
  tone: KpiTone;
  trend?: number[]; // last N data points for sparkline
  delta?: {
    value: number; // percent change as a number, e.g. 12.4 or -3.1
    period: string; // "vs last week"
    inverted?: boolean; // true when a negative delta is good (e.g. response time)
  };
};

export type TimeseriesPoint = {
  label: string;
  value: number;
};

export type CategoryPoint = {
  label: string;
  value: number;
  secondary?: number;
  color?: string;
};

export type Agent = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string; // tailwind color util
  role: "Listing Agent" | "Buyer's Agent" | "Dual" | "Junior Agent";
  joinedAt: string; // ISO
  metrics: {
    dealsClosedYTD: number;
    volumeClosedYTD: number; // USD
    activeDeals: number;
    pipelineValue: number; // USD
    leadsThisMonth: number;
    appointmentsSet: number;
    conversionRate: number; // percent
    avgResponseMinutes: number;
  };
  trend: number[]; // last 8 weeks deals/leads sparkline
  status: "top" | "rising" | "steady" | "needs-coaching";
  coachingNote?: string;
  /** AI adoption score 0–100. Weighted from CRM usage, AI tools adoption,
      response time, workflow compliance, performance metrics. */
  aiAdoptionScore: number;
  /** One-line nudge shown on the team scorecard. */
  aiTip: string;
  /** Optional headshot URL. Falls back to colored initials if missing. */
  avatarUrl?: string;
};

export type Lead = {
  id: string;
  name: string;
  initials: string;
  property: string; // "4 BR Newton, MA"
  priceRange: string; // "$1.4M – $1.8M"
  status: LeadStatus;
  source: Tool;
  assignedAgentId: string;
  assignedAgentName: string;
  lastContactAt: string; // ISO
  nextActionAt?: string; // ISO
  stage: "New" | "Qualified" | "Appointment Set" | "Showing" | "Offer" | "Under Contract";
};

export type WorkflowCategory =
  | "Follow-up"
  | "Lead Nurture"
  | "Listing"
  | "Re-engagement"
  | "Sphere";

export type Workflow = {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  tools: Tool[];
  status: WorkflowStatus;
  ownerAgentId?: string; // who set this up / owns the workflow
  lastTriggeredAt: string; // ISO
  triggersPerDay: number; // average over last 7 days
  metrics: {
    triggered: number;
    completed: number;
    completionRate: number; // percent
    appointmentsCreated: number;
    closedDeals: number;
    revenueAttributed: number; // USD
    costPerLead: number; // USD
    roi: number; // multiple, e.g. 3.4
  };
  trend: number[]; // last 12 weeks
  weeklyChange: number; // percent
};

export type Insight = {
  id: string;
  type: InsightType;
  category: InsightCategory;
  /** One-line headline, max 60 chars. Drives the 1st of "3 questions in 3 seconds". */
  title: string;
  /** Concrete metric / dollar / count that makes the magnitude obvious. */
  impact: string;
  /** Optional longer explanation shown only inside the detail sheet. */
  detail?: string;
  /** The single primary CTA on the card. */
  primaryAction: { label: string };
  state: InsightState;
  createdAt: string; // ISO
};

export type DashboardData = {
  user: User;
  period: { start: string; end: string; label: string };
  kpis: KPI[];
  insights: Insight[];
  agents: Agent[];
  leads: Lead[];
  workflows: Workflow[];
  pipelineTrend: TimeseriesPoint[];
  leadsBySource: CategoryPoint[];
  pipelineByStage: CategoryPoint[];
  completionRateTrend: TimeseriesPoint[];
  teamProductionTrend: TimeseriesPoint[];
};
