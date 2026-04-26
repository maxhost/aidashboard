export type Role = "team-leader" | "solo-agent" | "broker" | "ops";
export type YearsInRE = "<2" | "2-5" | "5-10" | "10-20" | "20+";
export type TeamSize = "1" | "2-5" | "6-15" | "16-30" | "31-50" | "50+";
export type AnnualVolume =
  | "<5M"
  | "5-15M"
  | "15-30M"
  | "30-50M"
  | "50-100M"
  | "100M+";
export type AvgPrice =
  | "<300K"
  | "300-500K"
  | "500K-1M"
  | "1M-2M"
  | "2M-5M"
  | "5M+";
export type ResponseTime =
  | "<5min"
  | "5-15min"
  | "15-60min"
  | "same-day"
  | "next-day"
  | "no-goal";
export type FollowUpCadence =
  | "manual"
  | "automated-drip"
  | "ai-personalized"
  | "mix"
  | "none";
export type LeadScoring =
  | "manual"
  | "some-automation"
  | "fully-automated"
  | "none";
export type LeadCapture =
  | "manual"
  | "auto-website"
  | "crm-forms"
  | "paid-ads"
  | "other";
export type Showings =
  | "manual"
  | "calendly"
  | "auto-scheduling"
  | "other";
export type Closing =
  | "manual"
  | "templates"
  | "systematized"
  | "custom-workflows";
export type MonthlySpend =
  | "<500"
  | "500-1.5K"
  | "1.5-3K"
  | "3-6K"
  | "6-10K"
  | "10K+";
export type BiggestPain =
  | "not-enough-leads"
  | "low-conversion"
  | "pipeline-visibility"
  | "underperforming-agents"
  | "tool-roi"
  | "speed"
  | "scale"
  | "other";

export type OnboardingData = {
  basicInfo?: {
    name: string;
    email: string;
    company: string;
    role: Role;
    yearsInRE: YearsInRE;
  };
  team?: {
    size: TeamSize;
    roles: string[];
    annualVolume: AnnualVolume;
    brokerage: string;
  };
  market?: {
    mainMarket: string;
    propertyTypes: string[];
    avgPrice: AvgPrice;
    clientTypes: string[];
  };
  leadSources?: {
    sources: string[];
    topSources: string[];
  };
  techStack?: {
    crm: string[];
    leadCapture: string[];
    communication: string[];
    marketing: string[];
    transactions: string[];
    aiTools: string[];
    analytics: string[];
    phone: string[];
    monthlySpend?: MonthlySpend;
  };
  workflows?: {
    leadCapture: LeadCapture;
    responseTime: ResponseTime;
    followUpCadence: FollowUpCadence;
    leadScoring: LeadScoring;
    showings: Showings;
    closing: Closing;
  };
  goals?: {
    biggestPain: BiggestPain;
    biggestPainOther?: string;
    successMetrics: string[];
    revenueTarget?: string;
  };
  completedAt?: string;
};

export type StepKey =
  | "welcome"
  | "business"
  | "team"
  | "market"
  | "leadSources"
  | "techStack"
  | "workflows"
  | "goals"
  | "complete";

export const STEPS: { key: StepKey; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "business", label: "Business" },
  { key: "team", label: "Team" },
  { key: "market", label: "Market" },
  { key: "leadSources", label: "Lead sources" },
  { key: "techStack", label: "Tech stack" },
  { key: "workflows", label: "Workflows" },
  { key: "goals", label: "Goals" },
  { key: "complete", label: "Complete" },
];
