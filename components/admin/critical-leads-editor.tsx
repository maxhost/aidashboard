"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CriticalLead } from "@/lib/data/types";

/**
 * Field-level editor for critical_leads. Renders one row per lead with
 * inputs (name, value, days no contact, status), an Add button, and
 * Remove per row. On every change the JSON-serialized array is written
 * to a hidden input named `critical_leads`, so the parent <form action=…>
 * receives it on submit.
 */
export function CriticalLeadsEditor({
  initial,
}: {
  initial: CriticalLead[];
}) {
  const [leads, setLeads] = useState<CriticalLead[]>(
    initial.length > 0 ? initial : []
  );

  function update(idx: number, patch: Partial<CriticalLead>) {
    setLeads((cur) => cur.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function add() {
    setLeads((cur) => [
      ...cur,
      {
        id: `lead-${Date.now()}-${cur.length}`,
        name: "",
        value_usd: 0,
        days_no_contact: 0,
        status: "",
      },
    ]);
  }

  function remove(idx: number) {
    setLeads((cur) => cur.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      <input
        type="hidden"
        name="critical_leads"
        value={JSON.stringify(leads)}
      />

      {leads.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          No critical leads yet. Add one to start.
        </p>
      )}

      <ul className="space-y-2">
        {leads.map((l, idx) => (
          <li
            key={l.id}
            className="rounded-lg border border-border bg-background p-3 space-y-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_140px_auto] gap-2 items-end">
              <Field label="Lead name">
                <input
                  type="text"
                  value={l.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="Carlos Mendez"
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                />
              </Field>
              <Field label="Value (USD)">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={l.value_usd}
                  onChange={(e) =>
                    update(idx, { value_usd: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono"
                />
              </Field>
              <Field label="Days no contact">
                <input
                  type="number"
                  min={0}
                  value={l.days_no_contact}
                  onChange={(e) =>
                    update(idx, { days_no_contact: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono"
                />
              </Field>
              <Field label="Status">
                <input
                  type="text"
                  value={l.status ?? ""}
                  onChange={(e) => update(idx, { status: e.target.value })}
                  placeholder="Negotiation"
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                />
              </Field>
              <button
                type="button"
                onClick={() => remove(idx)}
                aria-label="Remove lead"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        Add lead
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
