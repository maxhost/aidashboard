import type { LucideIcon } from "lucide-react";
import { AlertOctagon, Info, Sparkles, TriangleAlert } from "lucide-react";
import type { InsightType } from "@/lib/types";

/** Centralized visual language for insight types — keeps cards consistent. */
export const TYPE_META: Record<
  InsightType,
  {
    label: string;
    icon: LucideIcon;
    /** Darker shade — used on filled chips and titles */
    color: string;
    /** Tailwind text class for the label tag */
    labelClass: string;
    /** Tailwind classes for the type chip background */
    chipClass: string;
    /** Tailwind class for the small dot */
    dotClass: string;
    /** Border-left accent class (for ACT NOW cards) */
    borderClass: string;
  }
> = {
  critical: {
    label: "Critical",
    icon: AlertOctagon,
    color: "#dc2626",
    labelClass: "text-rose-700",
    chipClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    borderClass: "border-l-rose-500",
  },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    color: "#d97706",
    labelClass: "text-amber-700",
    chipClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    borderClass: "border-l-amber-500",
  },
  opportunity: {
    label: "Opportunity",
    icon: Sparkles,
    color: "#059669",
    labelClass: "text-emerald-700",
    chipClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    borderClass: "border-l-emerald-500",
  },
  info: {
    label: "FYI",
    icon: Info,
    color: "#0284c7",
    labelClass: "text-sky-700",
    chipClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    borderClass: "border-l-sky-500",
  },
};
