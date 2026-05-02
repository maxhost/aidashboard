import type { LucideIcon } from "lucide-react";
import {
  AlertOctagon,
  BarChart3,
  Boxes,
  Info,
  Magnet,
  Sparkles,
  Target,
  TriangleAlert,
  Workflow,
} from "lucide-react";
import type { InsightCategory, InsightType } from "@/lib/types";

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
    label: "Pattern",
    icon: Info,
    color: "#0284c7",
    labelClass: "text-sky-700",
    chipClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    borderClass: "border-l-sky-500",
  },
};

/** Visual metadata per insight category — drives the [All / Marketing / …]
    filter chips and the icon shown on each uniform card. */
export const CATEGORY_META: Record<
  InsightCategory,
  { label: string; icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  Marketing: {
    label: "Marketing",
    icon: Target,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  Performance: {
    label: "Performance",
    icon: BarChart3,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  Workflow: {
    label: "Workflow",
    icon: Workflow,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  "Lead Gen": {
    label: "Lead Gen",
    icon: Magnet,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  "Tech Stack": {
    label: "Tech Stack",
    icon: Boxes,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
};
