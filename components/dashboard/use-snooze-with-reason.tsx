"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
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

const WRONG_PRIORITY_REASONS = [
  "Something else is more urgent",
  "Timing is wrong",
  "Missing context",
  "Waiting on a dependency",
  "Not my call to make",
] as const;

type WrongPriorityReason = (typeof WRONG_PRIORITY_REASONS)[number];
type Layer = "main" | "wrong-priority" | "other";

type Config<T extends { id: string }> = {
  itemType: string;
  getDisplayName?: (item: T) => string;
  onSnooze: (item: T, reason: string) => void;
};

/**
 * "Why not now?" confirmation flow.
 * Single-click any quick-reason chip to confirm + snooze.
 * "Wrong priority" expands an inline second layer for deeper context.
 * "Other…" reveals a small text input for free-form context.
 */
export function useSnoozeWithReason<T extends { id: string }>({
  itemType: _itemType,
  getDisplayName,
  onSnooze,
}: Config<T>) {
  const [pending, setPending] = useState<T | null>(null);

  function request(item: T) {
    setPending(item);
  }

  function handleConfirm(reason: string) {
    if (!pending) return;
    onSnooze(pending, reason);
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
  const [layer, setLayer] = useState<Layer>("main");
  const [wrongReasons, setWrongReasons] = useState<Set<WrongPriorityReason>>(
    new Set()
  );
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (!open) {
      setLayer("main");
      setWrongReasons(new Set());
      setOtherText("");
    }
  }, [open]);

  function toggleWrongReason(r: WrongPriorityReason) {
    setWrongReasons((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }

  function confirmWrongPriority() {
    const reasons = Array.from(wrongReasons);
    const combined =
      reasons.length > 0
        ? `Wrong priority — ${reasons.join(", ")}`
        : "Wrong priority";
    onConfirm(combined);
  }

  const isMain = layer === "main";
  const isWrong = layer === "wrong-priority";
  const isOther = layer === "other";

  const titleText = isWrong
    ? "Why was this not the right priority?"
    : "Why not now?";
  const subtitleText = isWrong
    ? "Select all that apply — helps Pulsor re-rank tomorrow."
    : "A quick note helps Pulsor prioritize better tomorrow.";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4">
          {/* Title row — back arrow appears on sub-layers */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 -ml-0.5">
              {!isMain && (
                <button
                  type="button"
                  onClick={() => setLayer("main")}
                  aria-label="Back"
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </button>
              )}
              <DialogTitle className="text-base font-medium">
                {titleText}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              {subtitleText}
            </DialogDescription>
          </div>

          {/* Item label chip */}
          {itemLabel && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground/85 truncate">
              {itemLabel}
            </div>
          )}

          {/* Layer content — keyed so each layer fades in */}
          <div key={layer} className="animate-in fade-in duration-150">
            {isMain && (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() =>
                      reason === "Wrong priority"
                        ? setLayer("wrong-priority")
                        : onConfirm(reason)
                    }
                    className="px-3 py-1.5 rounded-full text-sm border border-border bg-card text-foreground/85 hover:text-foreground hover:border-foreground/40 hover:bg-muted/40 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setLayer("other")}
                  className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  Other…
                </button>
              </div>
            )}

            {isWrong && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {WRONG_PRIORITY_REASONS.map((reason) => {
                    const selected = wrongReasons.has(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => toggleWrongReason(reason)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors",
                          selected
                            ? "border-foreground/50 bg-foreground/[0.06] text-foreground"
                            : "border-border bg-card text-foreground/85 hover:text-foreground hover:border-foreground/40 hover:bg-muted/40"
                        )}
                      >
                        {selected && (
                          <Check
                            aria-hidden
                            className="h-3 w-3 shrink-0"
                            strokeWidth={2.5}
                          />
                        )}
                        {reason}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isOther && (
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
                    onClick={() => setLayer("main")}
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!otherText.trim()}
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
        </div>

        {/* Footer — shown on main and wrong-priority layers */}
        {!isOther && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 sm:px-6 border-t border-border/60 bg-muted/30 rounded-b-xl">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
            >
              Cancel
            </button>
            {isWrong && (
              <button
                type="button"
                disabled={wrongReasons.size === 0}
                onClick={confirmWrongPriority}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  "bg-foreground text-background hover:bg-foreground/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
                )}
              >
                Confirm
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
