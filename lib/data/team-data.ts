import { createClient } from "@/lib/supabase/server";

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

export async function getTeamData(
  companyId: string,
  weekIso: string
): Promise<TeamData | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_data")
    .select("*")
    .eq("company_id", companyId)
    .eq("week_iso", weekIso)
    .maybeSingle();
  if (error) throw error;
  return data as TeamData | null;
}

export async function upsertTeamData(input: {
  company_id: string;
  week_iso: string;
  team_pipeline_value: number;
  top_performer_id: string | null;
  bottom_performer_id: string | null;
  insights: { id: string; text: string }[];
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("team_data")
    .upsert(input, { onConflict: "company_id,week_iso" });
  if (error) throw error;
}
