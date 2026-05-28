"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PulsorLockup } from "@/components/brand/pulsor";
import {
  signInAsDemo,
  signInWithEmail,
  signInWithPhone,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type Mode = "operator" | "realtor";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("operator");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "operator") {
        await signInWithEmail(email, password);
      } else {
        await signInWithPhone(phone, password);
      }
      router.push("/overview");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "sign_in_failed";
      setError(
        msg === "invalid_credentials"
          ? "Credenciales inválidas."
          : `No pudimos iniciar sesión (${msg}).`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleDemo() {
    setError(null);
    setSubmittingDemo(true);
    setTimeout(() => {
      signInAsDemo();
      router.push("/overview");
    }, 300);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[520px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(124,58,237,0.14), transparent 60%)",
        }}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">
          <div className="flex flex-col items-center gap-3 mb-8">
            <PulsorLockup size={56} textClassName="text-2xl" />
          </div>

          <div className="rounded-2xl bg-card border border-border/70 shadow-md p-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to your team&apos;s command center.
              </p>
            </div>

            <Tabs
              defaultValue="operator"
              value={mode}
              onValueChange={(v) => {
                setMode((v as Mode) ?? "operator");
                setError(null);
              }}
              className="mt-6"
            >
              <TabsList className="w-full">
                <TabsTrigger value="operator" className="flex-1">
                  Operator
                </TabsTrigger>
                <TabsTrigger value="realtor" className="flex-1">
                  Realtor
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <TabsContent value="operator" className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@team.com"
                    required={mode === "operator"}
                    className="h-10"
                  />
                </TabsContent>

                <TabsContent value="realtor" className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold text-foreground"
                  >
                    WhatsApp phone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+5491155555555"
                    required={mode === "realtor"}
                    className="h-10"
                  />
                </TabsContent>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={submitting || submittingDemo}
                  className={cn(
                    "w-full h-10 gap-1.5 font-semibold",
                    submitting && "opacity-90",
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        strokeWidth={2}
                      />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </>
                  )}
                </Button>
              </form>
            </Tabs>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDemo}
              disabled={submitting || submittingDemo}
              className="w-full h-10 gap-2 font-medium"
            >
              {submittingDemo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Loading demo…
                </>
              ) : (
                "Login Demo (mock data)"
              )}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
              Demo session: uses local mock data only.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            New here?{" "}
            <a
              href="/setup"
              className="font-medium text-foreground hover:text-primary"
            >
              Set up your workspace →
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
