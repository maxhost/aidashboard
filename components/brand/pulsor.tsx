import { cn } from "@/lib/utils";

/**
 * PulsorMark — brand symbol per Brand System (final).
 * A rectangular frame containing a horizontal pulse line broken by a dot
 * (the decision moment). Single color, inherits via currentColor so it
 * adapts to any surface (cream, white, dark, mint).
 */
export function PulsorMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Pulsor"
    >
      {/* Frame */}
      <rect
        x="14"
        y="26"
        width="52"
        height="28"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Pulse line — left segment */}
      <line
        x1="20"
        y1="40"
        x2="42"
        y2="40"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="butt"
      />
      {/* Dot — the decision */}
      <circle cx="46" cy="40" r="2.6" fill="currentColor" />
      {/* Pulse line — right segment */}
      <line
        x1="49"
        y1="40"
        x2="60"
        y2="40"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="butt"
      />
    </svg>
  );
}

/**
 * PulsorWordmark — Inter Medium, lowercase, tight letter-spacing per spec.
 */
export function PulsorWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-medium tracking-tight text-foreground lowercase",
        className
      )}
      style={{ letterSpacing: "-0.03em" }}
    >
      pulsor
    </span>
  );
}

/**
 * PulsorLockup — mark + wordmark side by side.
 */
export function PulsorLockup({
  size = 28,
  className,
  textClassName,
}: {
  size?: number;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground",
        className
      )}
    >
      <PulsorMark size={size} />
      <PulsorWordmark className={cn("text-[16px]", textClassName)} />
    </div>
  );
}
