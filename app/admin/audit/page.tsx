import { listAuditLog } from "@/lib/data/audit";

const ACTION_TONE: Record<string, string> = {
  delete: "text-destructive",
  create: "text-success",
  update: "text-foreground",
  upsert: "text-foreground",
};

function actionVerb(action: string): string {
  // "company.create" → "create"
  return action.split(".").slice(-1)[0] ?? action;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default async function AuditPage() {
  const entries = await listAuditLog(200);

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Audit log
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last 200 admin actions. Read-only.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm font-medium text-foreground">No activity yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Actions you take in the admin panel will appear here.
          </p>
        </div>
      ) : (
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {entries.map((e) => {
            const verb = actionVerb(e.action);
            const tone = ACTION_TONE[verb] ?? "text-foreground";
            return (
              <li
                key={e.id}
                className="grid grid-cols-[180px_140px_1fr_auto] items-center gap-3 px-4 py-2.5"
              >
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatTime(e.created_at)}
                </span>
                <span className="text-xs text-foreground truncate">
                  {e.actor_email ?? "—"}
                </span>
                <span className="text-xs text-foreground">
                  <span className={`font-mono uppercase tracking-wider text-[10px] ${tone}`}>
                    {e.action}
                  </span>
                  {e.entity_id && (
                    <span className="text-muted-foreground ml-2 font-mono text-[11px]">
                      {e.entity_id}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                  {e.ip_address ?? "—"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
