import { redirect } from "next/navigation";
import {
  criticalLeadToCard,
  formatCompactCurrency,
  getMyDashboard,
} from "@/lib/data/dashboard";
import { DEMO_EMAIL, DEMO_HOME_DATA } from "@/lib/data/demo";
import { HomeClient, type HomeData, type HomeTeamMember } from "./home-client";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export default async function HomePage() {
  const dashboard = await getMyDashboard();
  if (!dashboard) redirect("/login");

  // Demo account: render rich hardcoded snapshot, ignore DB.
  if (dashboard.user.email === DEMO_EMAIL) {
    return <HomeClient data={DEMO_HOME_DATA} />;
  }

  const { user, agentData, team } = dashboard;
  const firstName = (user.full_name?.split(" ")[0] || user.email).trim();

  // Map agent_data to the shape HomeClient expects.
  const isEmpty = !agentData;
  const criticalLeads = agentData?.critical_leads ?? [];

  // Leads at risk = critical leads where days_no_contact > 2
  const leadsAtRiskCount = criticalLeads.filter(
    (l) => (l.days_no_contact ?? 0) > 2
  ).length;

  const teamForClient: HomeTeamMember[] | null =
    user.role === "team_leader"
      ? team.map((m): HomeTeamMember => ({
          id: m.id,
          fullName: m.full_name,
          initials: initials(m.full_name).toUpperCase(),
          pipelineLabel: m.has_data
            ? formatCompactCurrency(m.pipeline_value)
            : "—",
          noteText: m.has_data
            ? `${m.leads_total} ${m.leads_total === 1 ? "lead" : "leads"} this week`
            : "No data yet",
          hasData: m.has_data,
        }))
      : null;

  const data: HomeData = {
    firstName,
    pipelineValue: agentData
      ? formatCompactCurrency(Number(agentData.pipeline_value))
      : "—",
    leadsAtRiskCount,
    closesLine: null,
    pulsorInsights: criticalLeads.map(criticalLeadToCard),
    weeklyInsight: agentData?.weekly_insight ?? null,
    thisWeekGoal: agentData?.this_week_goal ?? null,
    lastWeekWins: agentData?.last_week_wins ?? null,
    team: teamForClient,
    isEmpty,
  };

  return <HomeClient data={data} />;
}
