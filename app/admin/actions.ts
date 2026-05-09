"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCompany,
  deleteCompany,
  updateCompany,
} from "@/lib/data/companies";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/data/users";
import { upsertAgentData } from "@/lib/data/agent-data";
import { upsertTeamData } from "@/lib/data/team-data";
import {
  upsertCompanyStrategy,
  upsertCompanyMarketing,
  type MarketingChannel,
  type StrategyInitiative,
  type StrategyMilestone,
} from "@/lib/data/company-content";
import type { ActionCardData } from "@/components/dashboard/action-card";
import type {
  CriticalLead,
  IcpType,
  UserRole,
} from "@/lib/data/types";

// ─── Companies ───────────────────────────────────────────────

export async function createCompanyAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const icp_type = String(formData.get("icp_type") ?? "team_leader") as IcpType;
  if (!name) throw new Error("Name required");
  const company = await createCompany({ name, icp_type });
  revalidatePath("/admin/companies");
  redirect(`/admin/companies/${company.id}`);
}

export async function updateCompanyAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const icp_type = String(formData.get("icp_type") ?? "team_leader") as IcpType;
  await updateCompany(id, { name, icp_type });
  revalidatePath(`/admin/companies/${id}`);
  revalidatePath("/admin/companies");
}

export async function deleteCompanyAction(id: string) {
  await deleteCompany(id);
  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

// ─── Users ───────────────────────────────────────────────────

export async function createUserAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "agent") as UserRole;
  const companyRaw = String(formData.get("company_id") ?? "");
  const company_id = companyRaw === "" ? null : companyRaw;
  const icpRaw = String(formData.get("icp_type") ?? "");
  const icp_type = icpRaw === "" ? null : (icpRaw as IcpType);

  if (!email || !password || !full_name) {
    throw new Error("Email, password, and full name are required");
  }

  const user = await createUser({
    email,
    password,
    full_name,
    role,
    company_id,
    icp_type,
  });
  if (company_id) revalidatePath(`/admin/companies/${company_id}`);
  revalidatePath("/admin/solo-agents");
  revalidatePath("/admin");
  redirect(`/admin/users/${user.id}`);
}

export async function updateUserAction(id: string, formData: FormData) {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "agent") as UserRole;
  const companyRaw = String(formData.get("company_id") ?? "");
  const company_id = companyRaw === "" ? null : companyRaw;
  const icpRaw = String(formData.get("icp_type") ?? "");
  const icp_type = icpRaw === "" ? null : (icpRaw as IcpType);
  await updateUser(id, { full_name, role, company_id, icp_type });
  revalidatePath(`/admin/users/${id}`);
}

export async function deleteUserAction(id: string, redirectTo?: string) {
  await deleteUser(id);
  revalidatePath("/admin");
  if (redirectTo) redirect(redirectTo);
}

// ─── Agent data ──────────────────────────────────────────────

export async function upsertAgentDataAction(
  userId: string,
  formData: FormData
) {
  const weekIso = String(formData.get("week_iso") ?? "").trim();
  if (!weekIso) throw new Error("week_iso required");

  const num = (v: FormDataEntryValue | null): number =>
    v === null || v === "" ? 0 : Number(v);

  const criticalLeadsRaw = String(formData.get("critical_leads") ?? "[]");
  let critical_leads: CriticalLead[] = [];
  try {
    const parsed = JSON.parse(criticalLeadsRaw);
    if (Array.isArray(parsed)) critical_leads = parsed;
  } catch {
    // tolerate malformed JSON; admin can fix in the textarea
  }

  await upsertAgentData({
    user_id: userId,
    week_iso: weekIso,
    leads_total: num(formData.get("leads_total")),
    pipeline_value: num(formData.get("pipeline_value")),
    conversion_rate: num(formData.get("conversion_rate")),
    lead_leak_rate: num(formData.get("lead_leak_rate")),
    money_on_table: num(formData.get("money_on_table")),
    weekly_insight: (formData.get("weekly_insight") as string) || null,
    this_week_goal: (formData.get("this_week_goal") as string) || null,
    last_week_wins: (formData.get("last_week_wins") as string) || null,
    critical_leads,
  });
  revalidatePath(`/admin/users/${userId}`);
}

// ─── Team data ───────────────────────────────────────────────

export async function upsertTeamDataAction(
  companyId: string,
  formData: FormData
) {
  const week_iso = String(formData.get("week_iso") ?? "").trim();
  if (!week_iso) throw new Error("week_iso required");

  const num = (v: FormDataEntryValue | null): number =>
    v === null || v === "" ? 0 : Number(v);
  const orNull = (v: FormDataEntryValue | null): string | null => {
    const s = typeof v === "string" ? v.trim() : "";
    return s === "" ? null : s;
  };

  const insightsRaw = String(formData.get("insights") ?? "[]");
  let insights: { id: string; text: string }[] = [];
  try {
    const parsed = JSON.parse(insightsRaw);
    if (Array.isArray(parsed)) insights = parsed;
  } catch {
    // tolerate malformed JSON
  }

  await upsertTeamData({
    company_id: companyId,
    week_iso,
    team_pipeline_value: num(formData.get("team_pipeline_value")),
    top_performer_id: orNull(formData.get("top_performer_id")),
    bottom_performer_id: orNull(formData.get("bottom_performer_id")),
    insights,
  });
  revalidatePath(`/admin/companies/${companyId}`);
}

// ─── Company strategy ────────────────────────────────────────

function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  if (raw === null || raw === undefined) return [];
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function upsertCompanyStrategyAction(
  companyId: string,
  formData: FormData
) {
  const numOr = (v: FormDataEntryValue | null, d = 0): number => {
    if (v === null || v === "") return d;
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const orNull = (v: FormDataEntryValue | null): string | null => {
    const s = typeof v === "string" ? v.trim() : "";
    return s === "" ? null : s;
  };

  await upsertCompanyStrategy({
    company_id: companyId,
    milestones: parseJsonArray<StrategyMilestone>(formData.get("milestones")),
    current_focus_label: orNull(formData.get("current_focus_label")),
    current_focus_day: numOr(formData.get("current_focus_day"), 1),
    current_focus_period_length: numOr(
      formData.get("current_focus_period_length"),
      28
    ),
    pipeline_goal_pct: Math.max(
      0,
      Math.min(100, numOr(formData.get("pipeline_goal_pct"), 0))
    ),
    initiatives: parseJsonArray<StrategyInitiative>(
      formData.get("initiatives")
    ),
    action_items: parseJsonArray<StrategyInitiative>(
      formData.get("action_items")
    ),
    last_review_date: orNull(formData.get("last_review_date")),
    next_milestone_label: orNull(formData.get("next_milestone_label")),
    next_milestone_date: orNull(formData.get("next_milestone_date")),
    next_milestone_days_away: numOr(
      formData.get("next_milestone_days_away"),
      0
    ),
  });
  revalidatePath(`/admin/companies/${companyId}/strategy`);
  revalidatePath("/strategy");
}

// ─── Company marketing ───────────────────────────────────────

export async function upsertCompanyMarketingAction(
  companyId: string,
  formData: FormData
) {
  const orNull = (v: FormDataEntryValue | null): string | null => {
    const s = typeof v === "string" ? v.trim() : "";
    return s === "" ? null : s;
  };
  const text = (v: FormDataEntryValue | null, d = ""): string => {
    return typeof v === "string" && v.trim() !== "" ? v.trim() : d;
  };

  await upsertCompanyMarketing({
    company_id: companyId,
    total_leads_value: text(formData.get("total_leads_value"), "0"),
    total_leads_delta: orNull(formData.get("total_leads_delta")),
    best_channel_name: text(formData.get("best_channel_name"), "—"),
    best_channel_subtitle: orNull(formData.get("best_channel_subtitle")),
    cost_per_lead_value: text(formData.get("cost_per_lead_value"), "$0"),
    cost_per_lead_delta: orNull(formData.get("cost_per_lead_delta")),
    channels: parseJsonArray<MarketingChannel>(formData.get("channels")),
    insights: parseJsonArray<ActionCardData>(formData.get("insights")),
  });
  revalidatePath(`/admin/companies/${companyId}/marketing`);
  revalidatePath("/marketing");
}
