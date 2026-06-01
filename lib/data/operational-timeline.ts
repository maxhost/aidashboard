/**
 * Operational Timeline — type definitions consumed by the BackOffice
 * review module. Mock data lived here previously; now the data comes
 * from the Pulsor backend via `lib/api/operator.ts`.
 */

export type OperationalEventStatus =
  | "pending"
  | "approved"
  | "edited"
  | "rejected"
  | "synced";

export const STATUS_LABEL: Record<OperationalEventStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  edited: "Edited",
  rejected: "Rejected",
  synced: "Synced",
};

export type Realtor = {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  avatarBg: string;
  avatarFg: string;
};

export type DayBucket = "today" | "yesterday" | "earlier";

export type DetectedContext = {
  contact?: string;
  transaction?: string;
  intent: string;
  category: string;
};

export type SuggestedTask = {
  id: string;
  text: string;
  /** ISO timestamp; null when the operator hasn't set a date yet. */
  dueAt: string | null;
  /** Operator-set pin that sorts the task to the top of the realtor's day. */
  isPriority: boolean;
};

export type DetectedRisk = {
  id: string;
  text: string;
  severity: "low" | "medium" | "high";
};

export type CRMUpdate = {
  id: string;
  field: string;
  text: string;
};

export type OperationalEvent = {
  id: string;
  realtor: Realtor;
  receivedAtLabel: string;
  dayBucket: DayBucket;
  earlierLabel?: string;
  source: "voice";
  status: OperationalEventStatus;
  audioDuration: string;
  waveform: number[];
  transcriptPreview: string;
  transcript: string;
  detectedContext: DetectedContext;
  suggestedTasks: SuggestedTask[];
  detectedRisks: DetectedRisk[];
  crmUpdates: CRMUpdate[];
  confidence: number;
  approvedCount: number;
  editedCount: number;
  rejectedCount: number;
};
