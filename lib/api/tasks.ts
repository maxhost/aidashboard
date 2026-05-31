import { apiFetch } from "./client";
import type {
  BriefAttentionItem,
  BriefAttentionTone,
  BriefPriority,
  BriefPriorityAction,
  PrioritySnapshotItem,
} from "@/lib/data/assistant-demo";

export type TaskCategory = "Send" | "Confirm" | "Call" | "Schedule" | "Message";
export type TaskRiskLevel = "critical" | "minor";

export type TaskRow = {
  id: string;
  conversationId: string;
  realtorId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: "alta" | "media" | "baja";
  clientName: string | null;
  amount: string | null;
  zone: string | null;
  status: string;
  owner: string;
  source: string;
  category: TaskCategory | null;
  context: string | null;
  risk: string | null;
  riskLevel: TaskRiskLevel | null;
  suggestions: string[] | null;
  createdAt: string;
};

export function listMyTasks(
  token: string,
  realtorId?: string | null,
): Promise<{ tasks: TaskRow[] }> {
  const params = new URLSearchParams({
    status: "assigned,in_progress,done",
  });
  if (realtorId) params.set("realtor_id", realtorId);
  return apiFetch<{ tasks: TaskRow[] }>(`/tasks?${params.toString()}`, {
    token,
  });
}

export function updateTaskStatus(
  token: string,
  id: string,
  status: "done" | "ignored" | "in_progress" | "assigned",
  options?: { dismissReason?: string },
): Promise<unknown> {
  const body: Record<string, unknown> = { status };
  if (options?.dismissReason !== undefined) {
    body.dismiss_reason = options.dismissReason;
  }
  return apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export function updateTaskFields(
  token: string,
  id: string,
  fields: Partial<{
    title: string;
    category: TaskCategory;
  }>,
): Promise<unknown> {
  return apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(fields),
  });
}

// ─── Split: tasks due within today+1d / today+2d / today+3d -> overview.
//     Escalates only when no ACTIVE task fits the smaller window. Tasks
//     without due_date land in priorities. ───────────────────────────────

export function splitTasks(
  rows: TaskRow[],
  now: Date = new Date(),
): { overview: TaskRow[]; priorities: TaskRow[] } {
  const ordered = [...rows].sort(taskComparator);
  for (const extraDays of [1, 2, 3]) {
    const cutoff = endOfDayPlus(now, extraDays);
    // Only active tasks should anchor the window. A stale done/ignored task
    // with a past due_date would otherwise lock overview to its bucket and
    // starve tomorrow's actual work (see Pedro Mendez 2026-05-31 incident).
    const activeInWin = ordered.filter(
      (t) =>
        t.status !== "done" &&
        t.status !== "ignored" &&
        t.dueDate &&
        parseDueEnd(t.dueDate) <= cutoff,
    );
    if (activeInWin.length > 0) {
      // Once the window is chosen, include done/ignored too so the Done tab
      // of Priority overview keeps its historical context.
      const inWin = ordered.filter(
        (t) => t.dueDate && parseDueEnd(t.dueDate) <= cutoff,
      );
      const ids = new Set(inWin.map((t) => t.id));
      return {
        overview: inWin,
        priorities: ordered.filter((t) => !ids.has(t.id)),
      };
    }
  }
  return { overview: [], priorities: ordered };
}

// End-of-day local time for (today + extraDays). Using calendar days, not
// 24h * N from now, so "tomorrow" actually fits in the first window
// regardless of what time of day "now" is.
function endOfDayPlus(now: Date, extraDays: number): number {
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + extraDays,
    23,
    59,
    59,
    999,
  ).getTime();
}

const PRIORITY_RANK: Record<TaskRow["priority"], number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

function taskComparator(a: TaskRow, b: TaskRow): number {
  // due_date ascending; null due_date goes last
  const aMs = a.dueDate ? parseDueEnd(a.dueDate) : Number.POSITIVE_INFINITY;
  const bMs = b.dueDate ? parseDueEnd(b.dueDate) : Number.POSITIVE_INFINITY;
  if (aMs !== bMs) return aMs - bMs;
  return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
}

// Treat the due date's window as end-of-day local time so "today" still counts
// even if it's 2pm and the date is today.
function parseDueEnd(yyyyMmDd: string): number {
  return new Date(`${yyyyMmDd.slice(0, 10)}T23:59:59`).getTime();
}

// ─── Adapters to UI types ────────────────────────────────────────────────

const ACTION_LABEL: Record<BriefPriorityAction, string> = {
  call: "Call",
  send: "Send",
  message: "Message",
  schedule: "Schedule",
  confirm: "Confirm",
};

function toActionKind(c: TaskCategory | null): BriefPriorityAction {
  if (c === "Call") return "call";
  if (c === "Send") return "send";
  if (c === "Message") return "message";
  if (c === "Schedule") return "schedule";
  if (c === "Confirm") return "confirm";
  return "message";
}

function toTone(t: TaskRow): BriefAttentionTone {
  if (t.riskLevel === "critical") return "critical";
  if (t.riskLevel === "minor" || t.priority === "alta") return "warning";
  return "neutral";
}

function buildSnapshot(t: TaskRow): PrioritySnapshotItem[] {
  const items: PrioritySnapshotItem[] = [];
  if (t.clientName) items.push({ label: "Client", value: t.clientName });
  if (t.amount) items.push({ label: "Amount", value: `$${t.amount}` });
  if (t.zone) items.push({ label: "Zone", value: t.zone });
  if (t.dueDate) items.push({ label: "Due", value: t.dueDate.slice(0, 10) });
  return items;
}

export function toUiAttention(t: TaskRow): BriefAttentionItem {
  return {
    id: t.id,
    // Deal-stage taxonomy (closing / lender / inspection) is Fase 2 work.
    // Default category to "follow-up" so the mock row still has a sensible
    // fallback; real-data rows render their icon from actionKind below.
    category: "follow-up",
    actionKind: toActionKind(t.category),
    headline: t.title,
    tone: toTone(t),
    risk: t.risk ?? undefined,
  };
}

export function toUiPriority(t: TaskRow): BriefPriority {
  const kind = toActionKind(t.category);
  return {
    id: t.id,
    headline: t.title,
    context: t.context ?? undefined,
    risk: t.risk ?? undefined,
    riskLevel:
      t.riskLevel === "critical"
        ? "critical"
        : t.riskLevel === "minor"
          ? "minor"
          : undefined,
    action: { kind, label: ACTION_LABEL[kind] },
    pulsorSuggestions: t.suggestions ?? undefined,
    snapshot: buildSnapshot(t),
  };
}
