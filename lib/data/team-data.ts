export type TeamData = {
  id: string;
  company_id: string;
  week_iso: string;
  team_pipeline_value: number;
  top_performer_id: string | null;
  bottom_performer_id: string | null;
  insights: { id: string; text: string }[];
  created_at: string;
  updated_at: string;
};

// Stubbed — Pulsor backend doesn't track weekly team snapshots yet.
export async function getTeamData(
  _companyId: string,
  _weekIso: string,
): Promise<TeamData | null> {
  return null;
}

export async function upsertTeamData(_input: {
  company_id: string;
  week_iso: string;
  team_pipeline_value: number;
  top_performer_id: string | null;
  bottom_performer_id: string | null;
  insights: { id: string; text: string }[];
}): Promise<void> {
  // no-op
}
