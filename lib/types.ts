export type LeadStatus = "hot" | "warm" | "cold";
export type InsightPriority = "critical" | "warning" | "success" | "neutral";
export type InsightState = "pending" | "implemented" | "ignored";
export type WorkflowStatus = "performing" | "underperforming" | "healthy" | "broken";
export type Tool =
  | "Follow Up Boss"
  | "kvCORE"
  | "BoldTrail"
  | "BombBomb"
  | "Zillow Premier"
  | "Google Ads"
  | "Realtor.com"
  | "Mailchimp";

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
  | "conversion";

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

export type Workflow = {
  id: string;
  name: string;
  description: string;
  category: "Follow-up" | "Lead Nurture" | "Listing" | "Re-engagement" | "Sphere";
  tools: Tool[];
  status: WorkflowStatus;
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
  priority: InsightPriority;
  title: string;
  description: string;
  evidence?: string;
  primaryAction: { label: string; intent: "implement" | "view" | "investigate" | "scale" };
  secondaryAction?: { label: string; intent: "ignore" | "dismiss" | "details" };
  state: InsightState;
  createdAt: string; // ISO
  category: "Workflow" | "Agent" | "Pipeline" | "Spend" | "Tooling";
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
};
