import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pulsor",
    template: "%s · Pulsor",
  },
  description:
    "The AI layer that turns your real estate stack into decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {/* Google Analytics (gtag.js) — production deployment only
            (VERCEL_ENV distinguishes prod from preview; NODE_ENV does not). */}
        {process.env.VERCEL_ENV === "production" && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-7NMG9E9ZET"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-7NMG9E9ZET');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
