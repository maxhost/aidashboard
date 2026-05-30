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

export function listMyTasks(token: string): Promise<{ tasks: TaskRow[] }> {
  return apiFetch<{ tasks: TaskRow[] }>(
    `/tasks?status=${encodeURIComponent("assigned,in_progress,done")}`,
    { token },
  );
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

// ─── Split: tasks with due_date within 24h → overview (escalates to 48h then 72h).
//     Tasks without due_date and the rest land in priorities. ───────────────────

const DAY_MS = 24 * 60 * 60 * 1000;

export function splitTasks(
  rows: TaskRow[],
  now: Date = new Date(),
): { overview: TaskRow[]; priorities: TaskRow[] } {
  const ordered = [...rows].sort(taskComparator);
  const nowMs = now.getTime();
  for (const days of [1, 2, 3]) {
    const cutoff = nowMs + days * DAY_MS;
    const inWin = ordered.filter(
      (t) => t.dueDate && parseDueEnd(t.dueDate) <= cutoff,
    );
    if (inWin.length > 0) {
      const ids = new Set(inWin.map((t) => t.id));
      return {
        overview: inWin,
        priorities: ordered.filter((t) => !ids.has(t.id)),
      };
    }
  }
  return { overview: [], priorities: ordered };
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
    // Deal-stage taxonomy is Fase 2 work. Default everything to "follow-up"
    // so the row gets a sensible icon until we wire the deals model.
    category: "follow-up",
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
