"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type RemoveReason =
  | "not-relevant"
  | "duplicate"
  | "wrong-ai-suggestion"
  | "low-priority"
  | "other";

const REASON_OPTIONS: { key: RemoveReason; label: string }[] = [
  { key: "not-relevant", label: "No longer relevant" },
  { key: "duplicate", label: "Duplicate / already handled elsewhere" },
  { key: "wrong-ai-suggestion", label: "Incorrect AI suggestion" },
  { key: "low-priority", label: "Low priority / not worth tracking" },
  { key: "other", label: "Other" },
];

/**
 * Structured payload that would be persisted to the audit log when we have
 * a backend. For now logged via console.log on confirm.
 */
export type RemoveMetadata = {
  item_id: string;
  item_type: string;
  user_id: string | null;
  selected_reasons: RemoveReason[];
  custom_reason_text: string;
  deleted_at: string;
  original_item_snapshot: unknown;
  source: "manual_delete";
};

type Config<T extends { id: string }> = {
  itemType: string;
  getDisplayName?: (item: T) => string;
  getSnapshot?: (item: T) => unknown;
  onRemove?: (item: T, metadata: RemoveMetadata) => void;
};

/**
 * Soft-delete flow with structured "why" capture.
 *
 * Usage:
 *   const removal = useRemoveWithReason<Priority>({ itemType: "priority" });
 *   visibleItems = items.filter(i => !removal.isRemoved(i.id));
 *   ...
 *   <Row onDelete={() => removal.requestRemove(item)} />
 *   {removal.dialog}
 */
export function useRemoveWithReason<T extends { id: string }>({
  itemType,
  getDisplayName,
  getSnapshot,
  onRemove,
}: Config<T>) {
  const [pending, setPending] = useState<T | null>(null);
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  function requestRemove(item: T) {
    if (typeof window !== "undefined") {
      console.log("[remove:open]", { itemType, id: item.id });
    }
    setPending(item);
  }

  function isRemoved(id: string) {
    return removed.has(id);
  }

  function handleConfirm(reasons: RemoveReason[], text: string) {
    if (!pending) return;
    const meta: RemoveMetadata = {
      item_id: pending.id,
      item_type: itemType,
      user_id: null,
      selected_reasons: reasons,
      custom_reason_text: text,
      deleted_at: new Date().toISOString(),
      original_item_snapshot: getSnapshot ? getSnapshot(pending) : pending,
      source: "manual_delete",
    };
    if (typeof window !== "undefined") {
      console.log("[remove]", meta);
    }
    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(pending.id);
      return next;
    });
    onRemove?.(pending, meta);
    setPending(null);
  }

  const dialog = (
    <RemoveReasonDialog
      open={!!pending}
      itemLabel={
        pending && getDisplayName ? getDisplayName(pending) : undefined
      }
      onCancel={() => setPending(null)}
      onConfirm={handleConfirm}
    />
  );

  return { requestRemove, isRemoved, dialog };
}

function RemoveReasonDialog({
  open,
  itemLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  itemLabel?: string;
  onCancel: () => void;
  onConfirm: (reasons: RemoveReason[], text: string) => void;
}) {
  const [reasons, setReasons] = useState<Set<RemoveReason>>(new Set());
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) {
      setReasons(new Set());
      setText("");
    }
  }, [open]);

  const otherSelected = reasons.has("other");
  const valid = reasons.size > 0 || text.trim().length > 0;

  function toggle(reason: RemoveReason) {
    setReasons((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <DialogTitle className="text-base font-medium">
              Why are you removing this?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Select one or more reasons so we can improve our operational
              logic.
            </DialogDescription>
          </div>

          {itemLabel && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground/85 truncate">
              {itemLabel}
            </div>
          )}

          <ul className="space-y-1.5">
            {REASON_OPTIONS.map(({ key, label }) => {
              const checked = reasons.has(key);
              return (
                <li key={key}>
                  <label
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors",
                      checked
                        ? "bg-muted/60"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-4 w-4 rounded border inline-flex items-center justify-center shrink-0 transition-colors",
                        checked
                          ? "bg-foreground border-foreground text-background"
                          : "border-border bg-background"
                      )}
                    >
                      {checked && (
                        <svg
                          className="h-2.5 w-2.5"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggle(key)}
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          {otherSelected && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add more context…"
              rows={3}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-y leading-relaxed"
              autoFocus
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 sm:px-6 border-t border-border/60 bg-muted/30 rounded-b-xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onConfirm(Array.from(reasons), text.trim())}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              "bg-destructive text-background hover:bg-destructive/90",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-destructive"
            )}
          >
            Confirm remove
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
