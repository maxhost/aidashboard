import type { OnboardingData } from "./types";
import {
  ANNUAL_VOLUME_OPTIONS,
  AVG_PRICE_OPTIONS,
  BIGGEST_PAIN_OPTIONS,
  CLOSING_OPTIONS,
  FOLLOWUP_CADENCE_OPTIONS,
  LEAD_CAPTURE_OPTIONS,
  LEAD_SCORING_OPTIONS,
  MONTHLY_SPEND_OPTIONS,
  RESPONSE_TIME_OPTIONS,
  ROLE_OPTIONS,
  SHOWINGS_OPTIONS,
  TEAM_SIZE_OPTIONS,
  YEARS_OPTIONS,
} from "./options";

function lookup<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T | undefined
): string {
  if (!value) return "—";
  return options.find((o) => o.value === value)?.label ?? value;
}

function listOrDash(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "—";
  return arr.join(", ");
}

const COLORS = {
  primary: "#7c3aed",
  text: "#0a0a0a",
  muted: "#6b7280",
  border: "#e5e7eb",
  bgSubtle: "#f5f3ff",
  amber: "#f59e0b",
};

export function renderOnboardingEmailHtml(data: OnboardingData): string {
  const i = data.basicInfo;
  const t = data.team;
  const m = data.market;
  const ls = data.leadSources;
  const s = data.techStack;
  const w = data.workflows;
  const g = data.goals;

  const submittedAt = data.completedAt ?? new Date().toISOString();
  const submittedAtPretty = new Date(submittedAt).toUTCString();

  const painLabel = g
    ? BIGGEST_PAIN_OPTIONS.find((p) => p.value === g.biggestPain)?.label ?? g.biggestPain
    : "—";
  const painCategory = g
    ? BIGGEST_PAIN_OPTIONS.find((p) => p.value === g.biggestPain)?.category
    : null;

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New onboarding</title>
</head>
<body style="margin:0;padding:0;background-color:#fafaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${COLORS.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafaf7;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:16px;border:1px solid ${COLORS.border};overflow:hidden;max-width:640px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid ${COLORS.border};background:${COLORS.bgSubtle};">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.primary};">Pulsor · Onboarding</div>
              <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-top:6px;">
                ${escape(i?.name ?? "Unknown")} <span style="color:${COLORS.muted};font-weight:500;">— ${escape(i?.company ?? "—")}</span>
              </div>
              <div style="font-size:13px;color:${COLORS.muted};margin-top:4px;">${escape(submittedAtPretty)}</div>
            </td>
          </tr>

          ${section("Who", `
            ${row("Name", escape(i?.name))}
            ${row("Email", `<a href="mailto:${escape(i?.email)}" style="color:${COLORS.primary};text-decoration:none;">${escape(i?.email)}</a>`)}
            ${row("Company", escape(i?.company))}
            ${row("Role", escape(lookup(ROLE_OPTIONS, i?.role)))}
            ${row("Years in RE", escape(lookup(YEARS_OPTIONS, i?.yearsInRE)))}
          `)}

          ${section("Team", `
            ${row("Size", escape(lookup(TEAM_SIZE_OPTIONS, t?.size)))}
            ${row("Annual volume", escape(lookup(ANNUAL_VOLUME_OPTIONS, t?.annualVolume)))}
            ${row("Brokerage", escape(t?.brokerage ?? "—"))}
            ${row("Support roles", escape(listOrDash(t?.roles)))}
          `)}

          ${section("Market", `
            ${row("Main market", escape(m?.mainMarket ?? "—"))}
            ${row("Property types", escape(listOrDash(m?.propertyTypes)))}
            ${row("Avg price", escape(lookup(AVG_PRICE_OPTIONS, m?.avgPrice)))}
            ${row("Client types", escape(listOrDash(m?.clientTypes)))}
          `)}

          ${section("Lead sources", `
            ${ls?.topSources && ls.topSources.length > 0
              ? row("Top 3", `<span style="color:${COLORS.amber};">★</span> ${escape(ls.topSources.join(" · "))}`)
              : ""}
            ${row("All sources", escape(listOrDash(ls?.sources)))}
          `)}

          ${section("Tech stack", `
            ${row("Monthly spend", escape(lookup(MONTHLY_SPEND_OPTIONS, s?.monthlySpend)))}
            ${row("CRM", escape(listOrDash(s?.crm)))}
            ${row("Lead capture / IDX", escape(listOrDash(s?.leadCapture)))}
            ${row("Communication", escape(listOrDash(s?.communication)))}
            ${row("Marketing", escape(listOrDash(s?.marketing)))}
            ${row("Transactions", escape(listOrDash(s?.transactions)))}
            ${row("AI tools", escape(listOrDash(s?.aiTools)))}
            ${row("Analytics", escape(listOrDash(s?.analytics)))}
            ${row("Phone", escape(listOrDash(s?.phone)))}
          `)}

          ${section("Workflows", `
            ${row("Lead capture", escape(lookup(LEAD_CAPTURE_OPTIONS, w?.leadCapture)))}
            ${row("Response time goal", escape(lookup(RESPONSE_TIME_OPTIONS, w?.responseTime)))}
            ${row("Follow-up cadence", escape(lookup(FOLLOWUP_CADENCE_OPTIONS, w?.followUpCadence)))}
            ${row("Lead scoring", escape(lookup(LEAD_SCORING_OPTIONS, w?.leadScoring)))}
            ${row("Showings", escape(lookup(SHOWINGS_OPTIONS, w?.showings)))}
            ${row("Closing", escape(lookup(CLOSING_OPTIONS, w?.closing)))}
          `)}

          ${section("Goals", `
            ${row("Biggest pain", `${escape(painLabel)}${painCategory ? ` <span style="color:${COLORS.muted};font-size:11px;">(${escape(painCategory)})</span>` : ""}`)}
            ${g?.biggestPainOther ? row("Pain detail", escape(g.biggestPainOther)) : ""}
            ${row("Success metrics", escape(listOrDash(g?.successMetrics)))}
            ${g?.revenueTarget ? row("Revenue target", escape(g.revenueTarget)) : ""}
          `)}

          <!-- Raw JSON footer (collapsible vibe) -->
          <tr>
            <td style="padding:20px 28px;border-top:1px solid ${COLORS.border};background:#fafaf7;">
              <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.muted};margin-bottom:8px;">Raw JSON</div>
              <pre style="margin:0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;line-height:1.5;color:${COLORS.muted};white-space:pre-wrap;word-wrap:break-word;background:#ffffff;border:1px solid ${COLORS.border};border-radius:8px;padding:12px;">${escape(JSON.stringify(data, null, 2))}</pre>
            </td>
          </tr>
        </table>
        <div style="font-size:11px;color:${COLORS.muted};margin-top:16px;text-align:center;font-family:ui-monospace,monospace;">
          Submitted via aidashboard-mocha.vercel.app/setup
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export function renderOnboardingEmailText(data: OnboardingData): string {
  const i = data.basicInfo;
  const t = data.team;
  const m = data.market;
  const ls = data.leadSources;
  const s = data.techStack;
  const w = data.workflows;
  const g = data.goals;

  const lines: string[] = [];
  lines.push(`NEW ONBOARDING — ${i?.name ?? "Unknown"} (${i?.company ?? "—"})`);
  lines.push(`Submitted: ${data.completedAt ?? new Date().toISOString()}`);
  lines.push("");
  lines.push("WHO");
  lines.push(`  Name:    ${i?.name ?? "—"}`);
  lines.push(`  Email:   ${i?.email ?? "—"}`);
  lines.push(`  Role:    ${lookup(ROLE_OPTIONS, i?.role)}`);
  lines.push(`  Years:   ${lookup(YEARS_OPTIONS, i?.yearsInRE)}`);
  lines.push("");
  lines.push("TEAM");
  lines.push(`  Size:    ${lookup(TEAM_SIZE_OPTIONS, t?.size)}`);
  lines.push(`  Volume:  ${lookup(ANNUAL_VOLUME_OPTIONS, t?.annualVolume)}`);
  lines.push(`  Brokerage: ${t?.brokerage ?? "—"}`);
  lines.push(`  Roles:   ${listOrDash(t?.roles)}`);
  lines.push("");
  lines.push("MARKET");
  lines.push(`  Market:  ${m?.mainMarket ?? "—"}`);
  lines.push(`  Types:   ${listOrDash(m?.propertyTypes)}`);
  lines.push(`  Price:   ${lookup(AVG_PRICE_OPTIONS, m?.avgPrice)}`);
  lines.push(`  Clients: ${listOrDash(m?.clientTypes)}`);
  lines.push("");
  lines.push("LEAD SOURCES");
  if (ls?.topSources?.length) {
    lines.push(`  Top 3:   ★ ${ls.topSources.join(" · ")}`);
  }
  lines.push(`  All:     ${listOrDash(ls?.sources)}`);
  lines.push("");
  lines.push("TECH STACK");
  lines.push(`  Spend:        ${lookup(MONTHLY_SPEND_OPTIONS, s?.monthlySpend)}`);
  lines.push(`  CRM:          ${listOrDash(s?.crm)}`);
  lines.push(`  Lead capture: ${listOrDash(s?.leadCapture)}`);
  lines.push(`  Communication: ${listOrDash(s?.communication)}`);
  lines.push(`  Marketing:    ${listOrDash(s?.marketing)}`);
  lines.push(`  Transactions: ${listOrDash(s?.transactions)}`);
  lines.push(`  AI tools:     ${listOrDash(s?.aiTools)}`);
  lines.push(`  Analytics:    ${listOrDash(s?.analytics)}`);
  lines.push(`  Phone:        ${listOrDash(s?.phone)}`);
  lines.push("");
  lines.push("WORKFLOWS");
  lines.push(`  Capture:    ${lookup(LEAD_CAPTURE_OPTIONS, w?.leadCapture)}`);
  lines.push(`  Response:   ${lookup(RESPONSE_TIME_OPTIONS, w?.responseTime)}`);
  lines.push(`  Cadence:    ${lookup(FOLLOWUP_CADENCE_OPTIONS, w?.followUpCadence)}`);
  lines.push(`  Scoring:    ${lookup(LEAD_SCORING_OPTIONS, w?.leadScoring)}`);
  lines.push(`  Showings:   ${lookup(SHOWINGS_OPTIONS, w?.showings)}`);
  lines.push(`  Closing:    ${lookup(CLOSING_OPTIONS, w?.closing)}`);
  lines.push("");
  lines.push("GOALS");
  const painOpt = g
    ? BIGGEST_PAIN_OPTIONS.find((p) => p.value === g.biggestPain)
    : undefined;
  lines.push(`  Pain:       ${painOpt?.label ?? "—"}${painOpt?.category ? ` (${painOpt.category})` : ""}`);
  if (g?.biggestPainOther) lines.push(`  Detail:     ${g.biggestPainOther}`);
  lines.push(`  Success:    ${listOrDash(g?.successMetrics)}`);
  if (g?.revenueTarget) lines.push(`  Revenue:    ${g.revenueTarget}`);
  return lines.join("\n");
}

function row(label: string, value: string | undefined): string {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${COLORS.border};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width:140px;font-size:12px;color:${COLORS.muted};font-weight:600;letter-spacing:0.02em;vertical-align:top;padding-right:12px;">${label}</td>
            <td style="font-size:13px;color:${COLORS.text};font-weight:500;">${value ?? "—"}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function section(title: string, rowsHtml: string): string {
  return `
    <tr>
      <td style="padding:20px 28px 4px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.primary};margin-bottom:8px;">${title}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${rowsHtml}
        </table>
      </td>
    </tr>`;
}

function escape(value: string | undefined | null): string {
  if (value === undefined || value === null) return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
