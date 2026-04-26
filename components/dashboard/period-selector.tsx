"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PeriodSelector({ label }: { label: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 gap-2 font-mono text-xs tabular-nums"
    >
      <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
      {label}
    </Button>
  );
}
