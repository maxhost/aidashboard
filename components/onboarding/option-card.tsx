"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandIcon } from "./brand-icon";

type OptionCardProps = {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
  size?: "default" | "compact";
};

export function OptionCard({
  label,
  hint,
  selected,
  onClick,
  size = "default",
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col gap-1 rounded-xl border-2 bg-card text-left transition-all hover:border-foreground/30 hover:shadow-sm",
        size === "default" ? "p-4" : "px-3 py-2.5",
        selected
          ? "border-primary bg-accent-subtle ring-1 ring-primary/20"
          : "border-border"
      )}
    >
      <span
        className={cn(
          "font-semibold text-foreground leading-tight",
          size === "default" ? "text-sm" : "text-[13px]"
        )}
      >
        {label}
      </span>
      {hint && (
        <span className="text-xs text-muted-foreground leading-snug">
          {hint}
        </span>
      )}
      {selected && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

type OptionGridProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string; hint?: string }>;
  value: T | T[] | undefined;
  onChange: (value: T) => void;
  multiple?: boolean;
  columns?: 1 | 2 | 3 | 4;
  size?: "default" | "compact";
};

export function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
  size = "default",
}: OptionGridProps<T>) {
  const isSelected = (v: T) =>
    multiple ? (Array.isArray(value) && value.includes(v)) : value === v;

  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-3", gridCols)}>
      {options.map((opt) => (
        <OptionCard
          key={opt.value}
          label={opt.label}
          hint={opt.hint}
          selected={isSelected(opt.value)}
          onClick={() => onChange(opt.value)}
          size={size}
        />
      ))}
    </div>
  );
}

type ChipMultiSelectProps = {
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
  columns?: 2 | 3 | 4;
  withBrandIcon?: boolean;
};

export function ChipMultiSelect({
  options,
  values,
  onToggle,
  columns = 3,
  withBrandIcon = false,
}: ChipMultiSelectProps) {
  const gridCols =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-2", gridCols)}>
      {options.map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "relative flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 text-left text-[13px] font-medium transition-all hover:border-foreground/30",
              withBrandIcon ? "pr-8" : "pr-7",
              selected
                ? "border-primary bg-accent-subtle text-foreground"
                : "border-border bg-card text-foreground"
            )}
          >
            {withBrandIcon && <BrandIcon name={opt} size={26} />}
            <span className="leading-tight truncate">{opt}</span>
            {selected && (
              <Check
                className="absolute top-1/2 right-2 -translate-y-1/2 h-3.5 w-3.5 text-primary"
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
