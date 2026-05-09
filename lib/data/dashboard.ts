import { createClient } from "@/lib/supabase/server";
import { currentWeekIso } from "@/lib/data/types";
import type {
  AgentData,
  Company,
  CriticalLead,
  User,
} from "@/lib/data/types";
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

/**
 * Loads everything Home needs for the currently logged-in user:
 * profile, their company (if any), and the latest agent_data row for the
 * current ISO week.
 *
 * Returns null if there's no session — caller should redirect.
 */
export async function getMyDashboard(): Promise<MyDashboard | null> {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();
  if (profileError || !profile) return null;

  const weekIso = currentWeekIso();

  const [companyRes, agentRes] = await Promise.all([
    profile.company_id
      ? supabase.from("companies").select("*").eq("id", profile.company_id).single()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("agent_data")
      .select("*")
      .eq("user_id", profile.id)
      .eq("week_iso", weekIso)
      .maybeSingle(),
  ]);

  // For team leaders, also fetch their team's basic stats this week.
  let team: TeamMember[] = [];
  if (profile.role === "team_leader" && profile.company_id) {
    const { data: members } = await supabase
      .from("users")
      .select("id, full_name, email, role")
      .eq("company_id", profile.company_id)
      .neq("id", profile.id);
    const memberIds = (members ?? []).map((m) => m.id);

    let weekly: { user_id: string; pipeline_value: number; leads_total: number }[] = [];
    if (memberIds.length > 0) {
      const { data } = await supabase
        .from("agent_data")
        .select("user_id, pipeline_value, leads_total")
        .in("user_id", memberIds)
        .eq("week_iso", weekIso);
      weekly = data ?? [];
    }

    const dataByUser = new Map(weekly.map((w) => [w.user_id, w]));
    team = (members ?? []).map((m) => {
      const w = dataByUser.get(m.id);
      return {
        id: m.id,
        full_name: m.full_name ?? m.email,
        email: m.email,
        pipeline_value: Number(w?.pipeline_value ?? 0),
        leads_total: Number(w?.leads_total ?? 0),
        has_data: !!w,
      };
    });
    // Sort by pipeline desc
    team.sort((a, b) => b.pipeline_value - a.pipeline_value);
  }

  return {
    user: profile as User,
    company: (companyRes.data as Company) ?? null,
    agentData: (agentRes.data as AgentData) ?? null,
    weekIso,
    team,
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

