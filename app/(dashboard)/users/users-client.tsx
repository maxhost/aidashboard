"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getToken, getCachedUser } from "@/lib/session";
import {
  createUser,
  listUsers,
  type UserListItem,
} from "@/lib/api/users";

type Tab = "realtor" | "operator";

export function UsersClient() {
  const [tab, setTab] = useState<Tab>("realtor");
  const [items, setItems] = useState<UserListItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [creating, setCreating] = useState(false);
  const [authRole, setAuthRole] = useState<"operator" | "realtor" | null>(null);

  useEffect(() => {
    setAuthRole(getCachedUser()?.role ?? null);
  }, []);

  const load = () => {
    const token = getToken();
    if (!token) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    listUsers(token)
      .then((res) => {
        setItems(res.items);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    load();
  }, []);

  if (authRole && authRole !== "operator") {
    return (
      <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto">
        <p className="text-sm text-destructive">
          Esta sección es solo para operadores.
        </p>
      </div>
    );
  }

  const visible = items.filter((u) => u.role === tab);
  const counts = {
    realtor: items.filter((u) => u.role === "realtor").length,
    operator: items.filter((u) => u.role === "operator").length,
  };

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage realtor and operator accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" strokeWidth={2} />
          Create user
        </button>
      </header>

      <div className="inline-flex items-center rounded-full bg-card ring-1 ring-border p-0.5">
        {(["realtor", "operator"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-colors",
              tab === t
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "realtor" ? "Realtor" : "Operator"}{" "}
            <span className="opacity-60 ml-1 tabular-nums">{counts[t]}</span>
          </button>
        ))}
      </div>

      {status === "loading" ? (
        <p className="text-sm text-muted-foreground px-1 py-6">
          Loading users…
        </p>
      ) : status === "error" ? (
        <p className="text-sm text-destructive px-1 py-6">
          Couldn&apos;t load users.
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground px-1 py-6">
          No {tab}s yet.
        </p>
      ) : (
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {visible.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </ul>
      )}

      <CreateUserDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={() => {
          setCreating(false);
          load();
        }}
      />
    </div>
  );
}

function UserRow({ user }: { user: UserListItem }) {
  const initials = pickInitials(user.name ?? user.email ?? user.phone ?? "?");
  const joinedAgo = formatRelative(user.created_at);
  return (
    <li className="group flex items-start gap-3.5 px-4 py-4 sm:px-5 sm:py-[18px]">
      <span
        aria-hidden
        className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-foreground text-background text-xs font-semibold shrink-0"
      >
        {initials}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] leading-snug text-foreground font-medium truncate">
          {user.name ?? "Unnamed"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {user.email ?? "no email"}
          {user.phone ? ` · ${user.phone}` : ""}
        </p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0 self-center tabular-nums">
        {joinedAgo}
      </span>
    </li>
  );
}

function CreateUserDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [role, setRole] = useState<"realtor" | "operator">("realtor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setRole("realtor");
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setError(null);
    setSubmitting(false);
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      if (role === "realtor") {
        await createUser(token, {
          role: "realtor",
          name,
          email,
          phone,
          password,
        });
      } else {
        await createUser(token, {
          role: "operator",
          name,
          email,
          password,
        });
      }
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "create_failed";
      setError(msg);
      setSubmitting(false);
    }
  }

  const passwordValid = password.length >= 8;
  const phoneValid =
    role === "operator" || /^\+[1-9]\d{6,14}$/.test(phone.trim());
  const canSubmit =
    name.trim() && email.trim() && passwordValid && phoneValid && !submitting;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <DialogTitle className="text-base font-medium">
            Create user
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            New {role === "realtor" ? "realtor" : "operator"} account.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "realtor" | "operator")}
              className="w-full h-9 px-2 rounded-md border border-border bg-card text-sm"
            >
              <option value="realtor">Realtor</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>

          {role === "realtor" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                WhatsApp phone (E.164)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+5491155555555"
                required
                className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
              {phone && !phoneValid && (
                <p className="text-xs text-destructive">
                  Format: +CC + number (no spaces).
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
            {password && !passwordValid && (
              <p className="text-xs text-destructive">
                Minimum 8 characters.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error === "email_already_used"
                ? "That email is already in use."
                : error === "phone_already_used"
                  ? "That phone is already in use."
                  : `Couldn't create user (${error}).`}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60 -mx-6 px-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              {submitting ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function pickInitials(source: string): string {
  const letters = source
    .replace(/[^A-Za-zÀ-ÿ\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return letters || "?";
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 48) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMo = Math.round(diffDay / 30);
  return `${diffMo}mo ago`;
}
