import { createClient } from "@/lib/supabase/server";
import type { ActionCardData } from "@/components/dashboard/action-card";

// ─── Strategy ────────────────────────────────────────────────

export type StrategyMilestone = {
  id: string;
  label: string;
  date: string;
  state: "done" | "current" | "future";
};

export type StrategyInitiative = {
  id: string;
  label: string;
  state: "done" | "current" | "future";
};

export type CompanyStrategy = {
  id: string;
  company_id: string;
  milestones: StrategyMilestone[];
  current_focus_label: string | null;
  current_focus_day: number;
  current_focus_period_length: number;
  pipeline_goal_pct: number;
  initiatives: StrategyInitiative[];
  action_items: StrategyInitiative[];
  last_review_date: string | null;
  next_milestone_label: string | null;
  next_milestone_date: string | null;
  next_milestone_days_away: number;
  updated_at: string;
};

export async function getCompanyStrategy(
  companyId: string
): Promise<CompanyStrategy | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("company_strategy")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  if (error) throw error;
  return data as CompanyStrategy | null;
}

export async function upsertCompanyStrategy(input: {
  company_id: string;
  milestones: StrategyMilestone[];
  current_focus_label: string | null;
  current_focus_day: number;
  current_focus_period_length: number;
  pipeline_goal_pct: number;
  initiatives: StrategyInitiative[];
  action_items: StrategyInitiative[];
  last_review_date: string | null;
  next_milestone_label: string | null;
  next_milestone_date: string | null;
  next_milestone_days_away: number;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("company_strategy")
    .upsert(input, { onConflict: "company_id" });
  if (error) throw error;
}

// ─── Marketing ───────────────────────────────────────────────

export type MarketingChannel = {
  name: string;
  count: number;
  cpl: number;
  outlier?: boolean;
};

export type CompanyMarketing = {
  id: string;
  company_id: string;
  total_leads_value: string;
  total_leads_delta: string | null;
  best_channel_name: string;
  best_channel_subtitle: string | null;
  cost_per_lead_value: string;
  cost_per_lead_delta: string | null;
  channels: MarketingChannel[];
  insights: ActionCardData[];
  updated_at: string;
};

export async function getCompanyMarketing(
  companyId: string
): Promise<CompanyMarketing | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("company_marketing")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  if (error) throw error;
  return data as CompanyMarketing | null;
}

export async function upsertCompanyMarketing(input: {
  company_id: string;
  total_leads_value: string;
  total_leads_delta: string | null;
  best_channel_name: string;
  best_channel_subtitle: string | null;
  cost_per_lead_value: string;
  cost_per_lead_delta: string | null;
  channels: MarketingChannel[];
  insights: ActionCardData[];
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("company_marketing")
    .upsert(input, { onConflict: "company_id" });
  if (error) throw error;
}
