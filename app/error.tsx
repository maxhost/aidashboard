"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-2xl font-medium tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred. Try again or reload.
      </p>
      <button
        onClick={reset}
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Retry
      </button>
    </main>
  );
}
