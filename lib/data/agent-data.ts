import type { AgentData, CriticalLead } from "@/lib/data/types";

// Stubbed — Pulsor backend doesn't track weekly agent snapshots yet.
export async function getAgentData(
  _userId: string,
  _weekIso: string,
): Promise<AgentData | null> {
  return null;
}

export async function listAgentDataWeeks(
  _userId: string,
): Promise<{ week_iso: string }[]> {
  return [];
}

export async function upsertAgentData(_input: {
  user_id: string;
  week_iso: string;
  leads_total: number;
  pipeline_value: number;
  conversion_rate: number;
  lead_leak_rate: number;
  money_on_table: number;
  weekly_insight: string | null;
  this_week_goal: string | null;
  last_week_wins: string | null;
  critical_leads: CriticalLead[];
}): Promise<void> {
  // no-op
}

export async function deleteAgentData(
  _userId: string,
  _weekIso: string,
): Promise<void> {
  // no-op
}
