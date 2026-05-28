import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-2xl font-medium tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/login"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Go to sign in →
      </Link>
    </main>
  );
}
