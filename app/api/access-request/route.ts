import { NextResponse } from "next/server";
import { Resend } from "resend";

const NOTIFICATION_RECIPIENT = "guido@grays.vc";
const FROM_ADDRESS = "Pulsor <onboarding@resend.dev>";

export const runtime = "nodejs";

/**
 * Public landing-page form. Captures an email + (optional) note when a
 * prospect requests access. Forwards to Guido via Resend.
 */
export async function POST(req: Request) {
  let body: { email?: string; note?: string };
  try {
    body = (await req.json()) as { email?: string; note?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[access-request] RESEND_API_KEY not configured — submission accepted but no email sent."
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const resend = new Resend(apiKey);
  const subject = `New access request — ${email}`;
  const referer =
    req.headers.get("referer") || req.headers.get("origin") || "—";
  const userAgent = req.headers.get("user-agent") || "—";
  const submittedAt = new Date().toISOString();

  const text =
    `New access request received on the Pulsor landing page.\n\n` +
    `Email: ${email}\n` +
    (body.note ? `Note: ${body.note}\n` : "") +
    `Referrer: ${referer}\n` +
    `Submitted: ${submittedAt}\n` +
    `User agent: ${userAgent}\n`;

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.55; color: #0f0f10;">
      <h2 style="margin: 0 0 8px; font-weight: 500; letter-spacing: -0.02em;">New access request</h2>
      <p style="margin: 0 0 16px; color: #5c5953;">From the Pulsor landing page.</p>
      <table style="border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 4px 12px 4px 0; color: #8e8a82;">Email</td><td><strong>${escapeHtml(email)}</strong></td></tr>
        ${body.note ? `<tr><td style="padding: 4px 12px 4px 0; color: #8e8a82;">Note</td><td>${escapeHtml(body.note)}</td></tr>` : ""}
        <tr><td style="padding: 4px 12px 4px 0; color: #8e8a82;">Referrer</td><td>${escapeHtml(referer)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #8e8a82;">Submitted</td><td>${submittedAt}</td></tr>
      </table>
    </div>
  `.trim();

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFICATION_RECIPIENT,
      subject,
      text,
      html,
      replyTo: email,
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[access-request] Resend send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Email send failed" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
