"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

export function SnoozeToast({
  open,
  message,
  onUndo,
  onDismiss,
}: {
  open: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-foreground text-background shadow-lg border border-foreground/10 px-4 py-3 animate-in fade-in-0 slide-in-from-bottom-2 max-w-sm"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shrink-0">
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 ml-1 shrink-0"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-background/40 hover:text-background ml-1 text-lg leading-none shrink-0"
      >
        ×
      </button>
    </div>
  );
}
