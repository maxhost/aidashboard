import { apiFetch } from "./client";
import type { UiRealtor } from "./realtors";
import type {
  OperationalEvent,
  OperationalEventStatus,
  SuggestedTask,
} from "@/lib/data/operational-timeline";

export type TimelineTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  client_name: string | null;
  amount: string | null;
  zone: string | null;
  due_date: string | null;
};

export type TimelineEventDTO = {
  id: string;
  realtor_id: string;
  received_at: string;
  transcript: string;
  status: "pending" | "processed";
  tasks: TimelineTask[];
};

export function listTimeline(
  token: string,
  realtorId: string,
): Promise<{ events: TimelineEventDTO[] }> {
  return apiFetch<{ events: TimelineEventDTO[] }>(
    `/operator/timeline?realtor_id=${encodeURIComponent(realtorId)}`,
    { token },
  );
}

const PREVIEW_MAX = 140;

function preview(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > PREVIEW_MAX
    ? `${clean.slice(0, PREVIEW_MAX).trimEnd()}…`
    : clean;
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function earlierLabel(iso: string): string | undefined {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return undefined;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function toSuggestedTasks(tasks: TimelineTask[]): SuggestedTask[] {
  return tasks.map((t) => ({
    id: t.id,
    text: t.title,
  }));
}

function toUiStatus(s: TimelineEventDTO["status"]): OperationalEventStatus {
  return s === "pending" ? "pending" : "approved";
}

export function toUiEvent(
  dto: TimelineEventDTO,
  realtor: UiRealtor,
): OperationalEvent {
  return {
    id: dto.id,
    realtor,
    receivedAtLabel: timeLabel(dto.received_at),
    dayBucket: "today",
    earlierLabel: earlierLabel(dto.received_at),
    source: "voice",
    status: toUiStatus(dto.status),
    audioDuration: "",
    waveform: [],
    transcriptPreview: preview(dto.transcript),
    transcript: dto.transcript,
    detectedContext: {
      intent: "",
      category: "",
    },
    suggestedTasks: toSuggestedTasks(dto.tasks),
    detectedRisks: [],
    crmUpdates: [],
    confidence: 100,
    approvedCount: 0,
    editedCount: 0,
    rejectedCount: 0,
  };
}
