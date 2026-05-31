"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PulsorLockup } from "@/components/brand/pulsor";
import { signInWithEmail, signInRealtorWithEmail } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Mode = "operator" | "realtor";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/home";

  const [mode, setMode] = useState<Mode>("operator");
  const [email, setEmail] = useState("");
  const [realtorEmail, setRealtorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "operator") {
        await signInWithEmail(email, password);
      } else {
        await signInRealtorWithEmail(realtorEmail, password);
      }
      window.location.href = next;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "sign_in_failed";
      setError(
        msg === "invalid_credentials"
          ? "Credenciales inválidas."
          : `No pudimos iniciar sesión (${msg}).`,
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center gap-3 mb-8">
            <PulsorLockup size={56} textClassName="text-2xl" />
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-md p-8">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              Sign in
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back to Pulsor.
            </p>

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
                    htmlFor="realtor-email"
                    className="text-xs font-semibold text-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="realtor-email"
                    type="email"
                    autoComplete="email"
                    value={realtorEmail}
                    onChange={(e) => setRealtorEmail(e.target.value)}
                    placeholder="you@example.com"
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

                {error && (
                  <p
                    className="text-xs text-destructive bg-destructive-subtle border border-destructive/20 rounded-md px-3 py-2"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "w-full h-10 gap-1.5 font-medium",
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
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Need access? Ask your Pulsor admin to create your account.
          </p>
        </div>
      </main>
    </div>
  );
}
