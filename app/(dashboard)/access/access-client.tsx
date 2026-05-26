"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ACCESS_CATEGORY_LABEL,
  ACCESS_CATEGORY_ORDER,
  ACCESS_STATUS_LABEL,
  type AccessCategory,
  type AccessCredential,
  type AccessStatus,
} from "@/lib/data/assistant-demo";

const STATUS_DOT: Record<AccessStatus, string> = {
  active: "bg-success",
  outdated: "bg-warning",
  missing: "bg-destructive",
};

const STATUS_TEXT: Record<AccessStatus, string> = {
  active: "text-success",
  outdated: "text-warning",
  missing: "text-destructive",
};

const STATUS_BG: Record<AccessStatus, string> = {
  active: "bg-success-subtle",
  outdated: "bg-warning-subtle",
  missing: "bg-destructive/15",
};

type CategoryFilter = "all" | AccessCategory;

export function AccessClient({
  credentials,
}: {
  credentials: AccessCredential[];
}) {
  const [items, setItems] = useState<AccessCredential[]>(credentials);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    if (category === "all") return items;
    return items.filter((c) => c.category === category);
  }, [items, category]);

  const grouped = useMemo(() => {
    const map = new Map<AccessCategory, AccessCredential[]>();
    for (const cat of ACCESS_CATEGORY_ORDER) map.set(cat, []);
    for (const c of filtered) map.get(c.category)?.push(c);
    return map;
  }, [filtered]);

  function addCredential(c: Omit<AccessCredential, "id" | "lastUpdatedLabel" | "status">) {
    const next: AccessCredential = {
      ...c,
      id: `ac-${Date.now()}`,
      lastUpdatedLabel: "Just now",
      status: c.password.trim().length > 0 ? "active" : "missing",
    };
    setItems((prev) => [next, ...prev]);
    setAddOpen(false);
  }

  function removeCredential(id: string) {
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1100px] mx-auto space-y-7">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Access & logins
          </h1>
          <p className="text-base lg:text-lg text-foreground/75 mt-2 leading-snug max-w-[640px]">
            Give us the accesses we need so we can help you operationally.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
          Add access
        </button>
      </header>

      <CategoryFilterChips value={category} onChange={setCategory} />

      <div className="space-y-7">
        {category === "all" ? (
          ACCESS_CATEGORY_ORDER.map((cat) => {
            const list = grouped.get(cat) ?? [];
            if (list.length === 0) return null;
            return (
              <CategorySection
                key={cat}
                category={cat}
                items={list}
                onRemove={removeCredential}
              />
            );
          })
        ) : (
          <CategorySection
            category={category}
            items={filtered}
            onRemove={removeCredential}
          />
        )}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground px-1 py-8 text-center">
            Nothing in this category yet.
          </p>
        )}
      </div>

      <AddAccessDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={addCredential}
      />
    </div>
  );
}

function CategoryFilterChips({
  value,
  onChange,
}: {
  value: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
}) {
  const options: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All" },
    ...ACCESS_CATEGORY_ORDER.map((c) => ({
      key: c as CategoryFilter,
      label: ACCESS_CATEGORY_LABEL[c],
    })),
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors border",
              active
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function CategorySection({
  category,
  items,
  onRemove,
}: {
  category: AccessCategory;
  items: AccessCredential[];
  onRemove: (id: string) => void;
}) {
  return (
    <section aria-label={ACCESS_CATEGORY_LABEL[category]} className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {ACCESS_CATEGORY_LABEL[category]}
        </h2>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </div>
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {items.map((c) => (
          <CredentialRow
            key={c.id}
            credential={c}
            onRemove={() => onRemove(c.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function CredentialRow({
  credential,
  onRemove,
}: {
  credential: AccessCredential;
  onRemove: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const missing = credential.status === "missing";

  async function copyPassword() {
    if (!credential.password) return;
    try {
      await navigator.clipboard.writeText(credential.password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
      <span
        aria-hidden
        className="h-9 w-9 rounded-md bg-muted text-foreground inline-flex items-center justify-center font-mono text-[11px] font-semibold uppercase tracking-[0.08em] shrink-0"
      >
        {credential.platform
          .replace(/[^A-Za-z0-9]/g, " ")
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </span>
      <div className="flex-1 min-w-[180px]">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {credential.platform}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.06em]",
              STATUS_BG[credential.status],
              STATUS_TEXT[credential.status]
            )}
          >
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[credential.status])}
            />
            {ACCESS_STATUS_LABEL[credential.status]}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground truncate">
          {missing ? (
            <span className="text-foreground/60">Awaiting credentials</span>
          ) : (
            credential.username
          )}
        </div>
        {credential.notes && (
          <p className="mt-1 text-xs text-muted-foreground/85 leading-snug">
            {credential.notes}
          </p>
        )}
      </div>

      {!missing && (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-xs tabular-nums text-foreground/85 px-2 py-1 rounded-md bg-muted/40 min-w-[120px] text-center">
            {revealed
              ? credential.password
              : "•".repeat(Math.min(credential.password.length, 10))}
          </span>
          <button
            type="button"
            aria-label={revealed ? "Hide password" : "Reveal password"}
            title={revealed ? "Hide password" : "Reveal password"}
            onClick={() => setRevealed((r) => !r)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            {revealed ? (
              <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>
          <button
            type="button"
            aria-label="Copy password"
            title="Copy password"
            onClick={copyPassword}
            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.25} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground/70 shrink-0 w-[88px] text-right">
          {credential.lastUpdatedLabel}
        </span>
        <button
          type="button"
          aria-label="Edit access"
          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Remove access"
          onClick={onRemove}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-destructive/15 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </li>
  );
}

function AddAccessDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (
    c: Omit<AccessCredential, "id" | "lastUpdatedLabel" | "status">
  ) => void;
}) {
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState<AccessCategory>("transactions");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [reveal, setReveal] = useState(false);

  function reset() {
    setPlatform("");
    setCategory("transactions");
    setUsername("");
    setPassword("");
    setNotes("");
    setReveal(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!platform.trim() || !username.trim()) return;
    onSave({
      platform: platform.trim(),
      category,
      username: username.trim(),
      password: password,
      notes: notes.trim() || undefined,
    });
    reset();
  }

  const canSave = platform.trim().length > 0 && username.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-5 sm:p-6 space-y-5">
          <div className="space-y-1.5">
            <DialogTitle className="text-base font-medium">
              Add access
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Pulsor stores this securely and shares it only with your assigned
              operations team.
            </DialogDescription>
          </div>

          <div className="space-y-4">
            <FormField label="Platform" required>
              <Input
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. Dotloop, MLS, Gmail"
                autoFocus
              />
            </FormField>
            <FormField label="Category">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as AccessCategory)
                }
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {ACCESS_CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {ACCESS_CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Username or email" required>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@brokerage.com"
              />
            </FormField>
            <FormField label="Password">
              <div className="relative">
                <Input
                  type={reveal ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to mark as missing"
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setReveal((r) => !r)}
                  aria-label={reveal ? "Hide password" : "Reveal password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground/70 hover:text-foreground transition-colors"
                >
                  {reveal ? (
                    <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </FormField>
            <FormField label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything our ops team should know about this access."
                rows={2}
                className={cn(
                  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm",
                  "outline-none transition-colors placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  "resize-y leading-relaxed"
                )}
              />
            </FormField>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 sm:px-6 border-t border-border/60 bg-muted/30 rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              "bg-foreground text-background hover:bg-foreground/90",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
            )}
          >
            Save access
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </div>
      {children}
    </div>
  );
}
