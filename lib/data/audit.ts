import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Append an entry to the audit log. Captures the current authenticated user
 * as actor, plus IP / user-agent if available. Never throws — logging
 * shouldn't fail the parent action.
 */
export async function logAction(input: {
  action: string;
  entity_type?: string;
  entity_id?: string | null;
  payload?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let actor_email: string | null = null;
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("email")
        .eq("id", user.id)
        .single();
      actor_email = profile?.email ?? user.email ?? null;
    }

    const h = headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      null;
    const ua = h.get("user-agent") || null;

    // Use service-role so RLS doesn't block writes (the audit_log policies
    // are read-only from the app side; writes always come from server code).
    const admin = createAdminClient();
    await admin.from("audit_log").insert({
      actor_id: user?.id ?? null,
      actor_email,
      action: input.action,
      entity_type: input.entity_type ?? null,
      entity_id: input.entity_id ?? null,
      payload: input.payload ?? null,
      ip_address: ip,
      user_agent: ua,
    });
  } catch (err) {
    // Logging is best-effort — never break the parent action.
    console.warn("[audit] logAction failed:", err);
  }
}

export type AuditEntry = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  payload: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

/** List recent audit entries (admin only — RLS enforces this). */
export async function listAuditLog(limit = 100): Promise<AuditEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuditEntry[];
}
