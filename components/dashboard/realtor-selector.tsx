"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Realtor } from "@/lib/data/operational-timeline";

export function RealtorAvatar({
  realtor,
  size = 32,
}: {
  realtor: Realtor;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium shrink-0",
        realtor.avatarBg,
        realtor.avatarFg
      )}
      style={{
        width: size,
        height: size,
        fontSize: size <= 26 ? 10 : size <= 32 ? 11 : 13,
        letterSpacing: "0.02em",
      }}
    >
      {realtor.initials}
    </span>
  );
}

export function RealtorSelector({
  realtors,
  value,
  onChange,
  placeholder = "Select realtor",
}: {
  realtors: Realtor[];
  value: Realtor | null;
  onChange: (r: Realtor) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:bg-muted/40 transition-colors"
      >
        {value ? (
          <>
            <RealtorAvatar realtor={value} size={22} />
            <span className="font-medium text-foreground">{value.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1.5 z-50 min-w-[220px] rounded-lg border border-border bg-card shadow-md p-1"
        >
          {realtors.map((r) => {
            const active = r.id === value?.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(r);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-left transition-colors",
                    active
                      ? "bg-muted/60 text-foreground"
                      : "text-foreground/85 hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <RealtorAvatar realtor={r} size={22} />
                  <span className="flex-1">{r.name}</span>
                  {active && (
                    <Check
                      className="h-3.5 w-3.5 text-foreground/70"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
