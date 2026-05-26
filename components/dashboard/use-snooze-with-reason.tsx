"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const QUICK_REASONS = [
  "Already in progress",
  "Wrong priority",
  "Will do later today",
  "Not actionable",
] as const;

type Config<T extends { id: string }> = {
  itemType: string;
  getDisplayName?: (item: T) => string;
  onSnooze: (item: T) => void;
};

/**
 * "Why not now?" confirmation flow.
 * Single-click any quick-reason chip to confirm + snooze.
 * "Other…" reveals a small text input for free-form context.
 */
export function useSnoozeWithReason<T extends { id: string }>({
  itemType,
  getDisplayName,
  onSnooze,
}: Config<T>) {
  const [pending, setPending] = useState<T | null>(null);

  function request(item: T) {
    setPending(item);
  }

  function handleConfirm(reason: string) {
    if (!pending) return;
    if (typeof window !== "undefined") {
      console.log("[snooze]", {
        item_id: pending.id,
        item_type: itemType,
        reason,
        at: new Date().toISOString(),
      });
    }
    onSnooze(pending);
    setPending(null);
  }

  const dialog = (
    <SnoozeReasonDialog
      open={!!pending}
      itemLabel={
        pending && getDisplayName ? getDisplayName(pending) : undefined
      }
      onCancel={() => setPending(null)}
      onConfirm={handleConfirm}
    />
  );

  return { request, dialog };
}

function SnoozeReasonDialog({
  open,
  itemLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  itemLabel?: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [otherMode, setOtherMode] = useState(false);
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (!open) {
      setOtherMode(false);
      setOtherText("");
    }
  }, [open]);

  const canSubmitOther = otherText.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <DialogTitle className="text-base font-medium">
              Why not now?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              A quick note helps Pulsor prioritize better tomorrow.
            </DialogDescription>
          </div>

          {itemLabel && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground/85 truncate">
              {itemLabel}
            </div>
          )}

          {!otherMode ? (
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => onConfirm(reason)}
                  className="px-3 py-1.5 rounded-full text-sm border border-border bg-card text-foreground/85 hover:text-foreground hover:border-foreground/40 hover:bg-muted/40 transition-colors"
                >
                  {reason}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setOtherMode(true)}
                className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                Other…
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                autoFocus
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Add a quick note…"
                rows={3}
                className={cn(
                  "w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm",
                  "outline-none transition-colors placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  "resize-y leading-relaxed"
                )}
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setOtherMode(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canSubmitOther}
                  onClick={() => onConfirm(otherText.trim())}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    "bg-foreground text-background hover:bg-foreground/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
                  )}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {!otherMode && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 sm:px-6 border-t border-border/60 bg-muted/30 rounded-b-xl">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
