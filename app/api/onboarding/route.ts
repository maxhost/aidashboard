import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  renderOnboardingEmailHtml,
  renderOnboardingEmailText,
} from "@/lib/onboarding/email-template";
import type { OnboardingData } from "@/lib/onboarding/types";

const NOTIFICATION_RECIPIENT = "guido@grays.vc";
const FROM_ADDRESS = "Pulsor <onboarding@resend.dev>";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let data: OnboardingData;
  try {
    data = (await req.json()) as OnboardingData;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[onboarding] RESEND_API_KEY not configured — submission accepted but no email sent."
    );
    return NextResponse.json({
      ok: true,
      delivered: false,
      note: "RESEND_API_KEY not set",
    });
  }

  const resend = new Resend(apiKey);
  const subject = `New setup: ${data.basicInfo?.name ?? "Unknown"}${
    data.basicInfo?.company ? " — " + data.basicInfo.company : ""
  }`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFICATION_RECIPIENT,
      replyTo: data.basicInfo?.email,
      subject,
      html: renderOnboardingEmailHtml(data),
      text: renderOnboardingEmailText(data),
    });

    if (result.error) {
      console.error("[onboarding] Resend error:", result.error);
      return NextResponse.json(
        { ok: false, error: result.error.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, delivered: true, id: result.data?.id });
  } catch (err) {
    console.error("[onboarding] send failure:", err);
    return NextResponse.json(
      { ok: false, error: "Send failed" },
      { status: 500 }
    );
  }
}
