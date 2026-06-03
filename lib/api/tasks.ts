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
  dueAt: string | null;
  priority: "alta" | "media" | "baja";
  isPriority: boolean;
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
    category: TaskCategory | null;
    is_priority: boolean;
    due_at: string | null;
    due_time: string | null;
    client_name: string | null;
    amount: number | null;
  }>,
): Promise<unknown> {
  return apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(fields),
  });
}

// ─── Window: today's calendar day (Orlando) + overdue. Tasks due tomorrow or
//     later, and tasks with no due_at, are excluded — the operator sets a
//     due_at before a task ever reaches the realtor. Sorted pinned-first, then
//     soonest due_at. The first-5-todo / rest split happens in the view so the
//     boundary re-fills as items are completed. ───────────────────────────────

export function windowTasks(
  rows: TaskRow[],
  now: Date = new Date(),
): TaskRow[] {
  const todayKey = orlandoDateKey(now);
  return rows
    .filter(
      (t) => t.dueAt !== null && orlandoDateKey(new Date(t.dueAt)) <= todayKey,
    )
    .sort(taskComparator);
}

// ─── Pending: everything active the day view doesn't surface. It's the exact
//     complement of windowTasks among non-done tasks — tasks with no due date,
//     or due strictly after today (Orlando). Same pinned-first / soonest-due
//     ordering; undated tasks sort last. ───────────────────────────────────
export function pendingTasks(
  rows: TaskRow[],
  now: Date = new Date(),
): TaskRow[] {
  const todayKey = orlandoDateKey(now);
  return rows
    .filter((t) => {
      if (t.status === "done") return false;
      if (t.dueAt === null) return true;
      return orlandoDateKey(new Date(t.dueAt)) > todayKey;
    })
    .sort(taskComparator);
}

// Calendar date in the pilot tz as a sortable YYYY-MM-DD key. Comparing keys
// (not instants) sidesteps DST/midnight math: "in window" == due on or before
// today; "overdue" == due strictly before today.
function orlandoDateKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PILOT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function isOverdue(iso: string, now: Date = new Date()): boolean {
  return orlandoDateKey(new Date(iso)) < orlandoDateKey(now);
}

const PRIORITY_RANK: Record<TaskRow["priority"], number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

function taskComparator(a: TaskRow, b: TaskRow): number {
  // Operator-pinned first, then due_at ascending (null last), then the auto
  // urgency rank, then stable by creation time.
  if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
  const aMs = a.dueAt ? parseDueEnd(a.dueAt) : Number.POSITIVE_INFINITY;
  const bMs = b.dueAt ? parseDueEnd(b.dueAt) : Number.POSITIVE_INFINITY;
  if (aMs !== bMs) return aMs - bMs;
  if (a.priority !== b.priority)
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  return parseDueEnd(a.createdAt) - parseDueEnd(b.createdAt);
}

// due_at is now a full ISO timestamp (tz-aware). Parse the instant directly.
function parseDueEnd(iso: string): number {
  return new Date(iso).getTime();
}

// Render due_at as date + time in the realtor's pilot tz (Orlando).
const PILOT_TZ = "America/New_York";
export function formatDue(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PILOT_TZ,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

// Wall-clock parts of an instant in the pilot tz. Used to seed a
// <input type="datetime-local"> (which speaks naive local time).
function tzParts(d: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PILOT_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(d);
  const m: Record<string, string> = {};
  for (const p of parts) m[p.type] = p.value;
  return m;
}

// ISO instant -> "YYYY-MM-DDTHH:MM" in Orlando wall-clock, for a datetime-local
// input's value.
export function isoToOrlandoInput(iso: string): string {
  const m = tzParts(new Date(iso));
  return `${m.year}-${m.month}-${m.day}T${m.hour}:${m.minute}`;
}

// "YYYY-MM-DD" + "HH:MM" understood as Orlando wall-clock -> the ISO instant.
// DST-correct: compute the tz offset at the target instant and back it out.
export function orlandoWallClockToISO(date: string, time: string): string {
  const naive = Date.parse(`${date}T${time}:00Z`); // pretend the wall-clock is UTC
  const m = tzParts(new Date(naive));
  const asTz = Date.UTC(
    +m.year,
    +m.month - 1,
    +m.day,
    +m.hour,
    +m.minute,
    +m.second,
  );
  const offset = asTz - naive;
  return new Date(naive - offset).toISOString();
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
  if (t.dueAt) items.push({ label: "Due", value: formatDue(t.dueAt) });
  return items;
}

// Small text helpers under a task's title in the realtor's day:
// Cliente / Budget / Fecha, only what's present.
function buildTaskHelpers(t: TaskRow): string[] {
  const h: string[] = [];
  if (t.clientName) h.push(`Cliente: ${t.clientName}`);
  if (t.amount) h.push(`Budget: $${t.amount}`);
  if (t.dueAt) h.push(formatDue(t.dueAt));
  return h;
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
    overdue: t.dueAt ? isOverdue(t.dueAt) : false,
    helpers: buildTaskHelpers(t),
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
    helpers: buildTaskHelpers(t),
  };
}
