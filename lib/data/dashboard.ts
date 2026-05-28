import { currentWeekIso } from "@/lib/data/types";
import type { AgentData, Company, CriticalLead, User } from "@/lib/data/types";
import type {
  ActionCardData,
  ActionTag,
} from "@/components/dashboard/action-card";

export type TeamMember = {
  id: string;
  full_name: string;
  email: string;
  pipeline_value: number;
  leads_total: number;
  has_data: boolean;
};

export type MyDashboard = {
  user: User;
  company: Company | null;
  agentData: AgentData | null;
  weekIso: string;
  /** Populated when user.role === "team_leader" — agents in their company. */
  team: TeamMember[];
};

// Mock data while the Pulsor backend is being wired up. The shape matches
// what the existing pages expect, so the UI keeps rendering. Replace each
// stub with a real /api/v1/* call when that page is migrated.
const MOCK_USER: User = {
  id: "mock-user-1",
  email: "demo@pulsor.test",
  full_name: "Demo User",
  role: "admin",
  company_id: null,
  icp_type: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getMyDashboard(): Promise<MyDashboard | null> {
  return {
    user: MOCK_USER,
    company: null,
    agentData: null,
    weekIso: currentWeekIso(),
    team: [],
  };
}

/** Format a USD number as "$4.2M" / "$650K" / "$120". */
export function formatCompactCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

/**
 * Map a single critical lead (from agent_data.critical_leads jsonb) to an
 * ActionCard row. Tag is derived from days_no_contact urgency.
 */
export function criticalLeadToCard(l: CriticalLead): ActionCardData {
  const days = l.days_no_contact ?? 0;
  const tag: ActionTag =
    days > 5 ? "URGENT" : days > 2 ? "WARNING" : "HOT LEAD";
  const parts: string[] = [l.name];
  if (l.status) parts.push(l.status);
  if (days > 0) parts.push(`${days}d no contact`);
  return {
    id: l.id,
    tag,
    amount: formatCompactCurrency(l.value_usd),
    summary: parts.join(" · "),
  };
}
