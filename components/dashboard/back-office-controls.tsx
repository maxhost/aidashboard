"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Row-level edit + delete buttons, shown when the active role is Back Office.
 * Visual stubs — wiring real mutations comes later.
 */
export function BackOfficeRowActions({
  onEdit,
  onDelete,
  className,
  label,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  /** Used in aria-labels: "Edit {label}", "Delete {label}". */
  label?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 shrink-0", className)}>
      <button
        type="button"
        aria-label={label ? `Edit ${label}` : "Edit"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit?.();
        }}
        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label={label ? `Delete ${label}` : "Delete"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete?.();
        }}
        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-destructive/15 hover:text-destructive transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </span>
  );
}

/**
 * Full-width "+ Add new" row, used at the bottom of editable lists.
 */
export function BackOfficeAddRow({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
    >
      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </button>
  );
}
