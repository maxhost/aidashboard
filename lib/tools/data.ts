// Curated directory of real estate tools used by teams in the US market.
// Organized by category for the /tools page. Each entry is the canonical
// brand name (matches the BrandIcon registry) + official website + a
// one-line description + reNative flag.
//
// reNative: true  => built specifically for real estate (Follow Up Boss,
//                    Dotloop, Sisu, BombBomb, etc.)
//         : false => general / cross-industry tool used by RE teams
//                    (Slack, DocuSign, Canva, ChatGPT, Mailchimp, etc.)

export type Tool = {
  name: string;
  website: string;
  description: string;
  /** true = built specifically for real estate; false = general / cross-industry tool */
  reNative: boolean;
  pricing?: "free" | "freemium" | "paid";
};

export type ToolCategoryGroup = {
  key: string;
  title: string;
  description: string;
  tools: Tool[];
};

export const TOOL_CATEGORIES: ToolCategoryGroup[] = [
  {
    key: "crm",
    title: "CRM & lead management",
    description:
      "The system of record for leads, clients, deals, and follow-up cadence.",
    tools: [
      { name: "Follow Up Boss", website: "https://followupboss.com", description: "Best-in-class real estate CRM with smart automations.", reNative: true },
      { name: "kvCORE", website: "https://insiderealestate.com/kvcore", description: "All-in-one platform — CRM + IDX + AI assistant.", reNative: true },
      { name: "BoldTrail", website: "https://boldtrail.com", description: "Inside Real Estate's flagship CRM + websites suite.", reNative: true },
      { name: "BoomTown", website: "https://boomtownroi.com", description: "Lead generation + CRM bundle for high-volume teams.", reNative: true },
      { name: "Lofty (Chime)", website: "https://lofty.com", description: "Smart CRM with AI-driven lead nurturing.", reNative: true },
      { name: "Sierra Interactive", website: "https://sierrainteractive.com", description: "CRM, websites, and lead management for teams.", reNative: true },
      { name: "CINC", website: "https://cincpro.com", description: "Lead-gen-focused CRM with PPC management.", reNative: true },
      { name: "Real Geeks", website: "https://realgeeks.com", description: "CRM + IDX websites + AI tools, integrated stack.", reNative: true },
      { name: "LionDesk", website: "https://liondesk.com", description: "Affordable CRM with video email and texting.", reNative: true },
      { name: "Wise Agent", website: "https://wiseagent.com", description: "Long-running, affordable real estate CRM.", reNative: true },
      { name: "Brivity", website: "https://brivity.com", description: "CRM and marketing platform for top teams.", reNative: true },
      { name: "Pipedrive", website: "https://pipedrive.com", description: "General-purpose visual sales pipeline CRM.", reNative: false },
      { name: "HubSpot", website: "https://hubspot.com", description: "Free-tier CRM with marketing and sales add-ons.", reNative: false },
      { name: "Salesforce", website: "https://salesforce.com", description: "Enterprise-grade CRM for large brokerages.", reNative: false },
    ],
  },
  {
    key: "leadCapture",
    title: "Lead capture & IDX websites",
    description: "How visitors become leads — IDX search, landing pages, and forms.",
    tools: [
      { name: "Ylopo", website: "https://ylopo.com", description: "Lead-gen platform with smart targeting + websites.", reNative: true },
      { name: "IDX Broker", website: "https://idxbroker.com", description: "MLS search widgets and IDX integration for any site.", reNative: true },
      { name: "Real Geeks", website: "https://realgeeks.com", description: "IDX websites built for lead capture.", reNative: true },
      { name: "Placester", website: "https://placester.com", description: "Real estate websites with built-in IDX.", reNative: true },
      { name: "Showcase IDX", website: "https://showcaseidx.com", description: "Modern IDX search plugin for WordPress.", reNative: true },
      { name: "iHomeFinder", website: "https://ihomefinder.com", description: "Long-running IDX provider with broker tools.", reNative: true },
      { name: "Easy Agent Pro", website: "https://easyagentpro.com", description: "WordPress-based IDX websites for agents.", reNative: true },
      { name: "AgentFire", website: "https://agentfire.com", description: "Hyper-local websites for real estate teams.", reNative: true },
      { name: "BoldTrail websites", website: "https://boldtrail.com", description: "Inside Real Estate's IDX + websites product.", reNative: true },
      { name: "CINC", website: "https://cincpro.com", description: "Combined lead capture + CRM stack.", reNative: true },
    ],
  },
  {
    key: "leadgen",
    title: "Lead-gen specialists",
    description: "Done-for-you lead generation services with proprietary funnels.",
    tools: [
      { name: "Ylopo", website: "https://ylopo.com", description: "Performance-marketing-driven lead-gen + AI.", reNative: true },
      { name: "CINC", website: "https://cincpro.com", description: "Managed PPC + lead-gen on top of their CRM.", reNative: true },
      { name: "BoomTown", website: "https://boomtownroi.com", description: "Long-running managed lead-gen for top teams.", reNative: true },
      { name: "Real Geeks", website: "https://realgeeks.com", description: "DIY lead-gen + IDX combo.", reNative: true },
      { name: "BoldLeads", website: "https://boldleads.com", description: "Done-for-you Facebook seller leads.", reNative: true },
      { name: "SmartZip", website: "https://smartzip.com", description: "Predictive analytics for likely sellers.", reNative: true },
    ],
  },
  {
    key: "portals",
    title: "Online portals",
    description: "Where most US buyers and sellers start their search.",
    tools: [
      { name: "Zillow Premier Agent", website: "https://premieragent.zillow.com", description: "The largest US portal — pay-per-zip leads.", reNative: true },
      { name: "Realtor.com", website: "https://realtor.com", description: "Move.com-owned portal — second-largest reach.", reNative: true },
      { name: "Homes.com", website: "https://homes.com", description: "CoStar-backed challenger portal.", reNative: true },
      { name: "Redfin", website: "https://redfin.com", description: "Tech-first brokerage + portal hybrid.", reNative: true },
      { name: "Trulia", website: "https://trulia.com", description: "Zillow-owned consumer portal.", reNative: true },
      { name: "Movoto", website: "https://movoto.com", description: "OJO-owned portal aggregator.", reNative: true },
      { name: "Ojo", website: "https://ojo.com", description: "Consumer search portal with concierge.", reNative: true },
    ],
  },
  {
    key: "paidAds",
    title: "Paid ad platforms",
    description: "Self-serve advertising channels with real estate audiences.",
    tools: [
      { name: "Google Ads", website: "https://ads.google.com", description: "Search + Display + YouTube ads.", reNative: false },
      { name: "Facebook / Meta Ads", website: "https://www.facebook.com/business/ads", description: "Largest paid social platform — buyer + seller targeting.", reNative: false },
      { name: "Instagram Ads", website: "https://business.instagram.com/advertising", description: "Visual-first social ads on Meta's platform.", reNative: false },
      { name: "TikTok Ads", website: "https://ads.tiktok.com", description: "Short-form video ads — younger demographics.", reNative: false },
      { name: "YouTube Ads", website: "https://ads.google.com/intl/en_us/home/campaigns/video-ads", description: "Pre-roll and discovery video advertising.", reNative: false },
      { name: "LinkedIn Ads", website: "https://business.linkedin.com/marketing-solutions/ads", description: "B2B and luxury / commercial real estate targeting.", reNative: false },
      { name: "Nextdoor Ads", website: "https://business.nextdoor.com", description: "Hyper-local neighborhood advertising.", reNative: false },
    ],
  },
  {
    key: "communication",
    title: "Communication & video",
    description: "How you reach leads, clients, and the team day-to-day.",
    tools: [
      { name: "Conduit", website: "https://conduit.ai", description: "YC-backed AI assistant for real estate conversations.", reNative: true },
      { name: "BombBomb", website: "https://bombbomb.com", description: "Video email built for real estate.", reNative: true },
      { name: "Vidyard", website: "https://vidyard.com", description: "Personalized async video for sales.", reNative: false },
      { name: "Loom", website: "https://loom.com", description: "Quick screen + camera recordings.", reNative: false },
      { name: "Zoom", website: "https://zoom.us", description: "The default for video meetings.", reNative: false },
      { name: "Slack", website: "https://slack.com", description: "Team chat + integrations hub.", reNative: false },
      { name: "Microsoft Teams", website: "https://www.microsoft.com/microsoft-teams", description: "Microsoft's chat + meetings + collab suite.", reNative: false },
      { name: "WhatsApp Business", website: "https://business.whatsapp.com", description: "1:1 messaging with international clients.", reNative: false },
      { name: "Calendly", website: "https://calendly.com", description: "Self-serve scheduling for showings + intake calls.", reNative: false },
      { name: "Twilio", website: "https://twilio.com", description: "SMS / voice / WhatsApp APIs for builders.", reNative: false },
      { name: "Front", website: "https://front.com", description: "Shared inboxes for team-based email.", reNative: false },
      { name: "Intercom", website: "https://intercom.com", description: "Live chat + customer messaging platform.", reNative: false },
      { name: "Discord", website: "https://discord.com", description: "Community-style chat + voice channels.", reNative: false },
    ],
  },
  {
    key: "marketing",
    title: "Marketing & design",
    description: "Email, design, social, and content automation.",
    tools: [
      { name: "Canva", website: "https://canva.com", description: "Drag-and-drop design — used by every team.", reNative: false },
      { name: "Mailchimp", website: "https://mailchimp.com", description: "Classic email marketing tool.", reNative: false },
      { name: "Constant Contact", website: "https://constantcontact.com", description: "Email + event marketing for SMBs.", reNative: false },
      { name: "ActiveCampaign", website: "https://activecampaign.com", description: "Email + automation + light CRM.", reNative: false },
      { name: "Klaviyo", website: "https://klaviyo.com", description: "Data-driven email + SMS marketing.", reNative: false },
      { name: "Beehiiv", website: "https://beehiiv.com", description: "Modern newsletter platform with monetization.", reNative: false },
      { name: "ConvertKit", website: "https://convertkit.com", description: "Newsletter + email automation for creators.", reNative: false },
      { name: "Buffer", website: "https://buffer.com", description: "Schedule + analytics for social media.", reNative: false },
      { name: "Hootsuite", website: "https://hootsuite.com", description: "Multi-channel social media management.", reNative: false },
      { name: "Brevo", website: "https://brevo.com", description: "Email + SMS + WhatsApp marketing platform.", reNative: false },
    ],
  },
  {
    key: "transactions",
    title: "Transactions & e-sign",
    description: "Closing process, contracts, and document workflow.",
    tools: [
      { name: "Dotloop", website: "https://dotloop.com", description: "Real estate's most-used transaction platform.", reNative: true },
      { name: "SkySlope", website: "https://skyslope.com", description: "Brokerage-side transaction + compliance.", reNative: true },
      { name: "TransactionDesk", website: "https://transactiondesk.com", description: "Lone Wolf's transaction management platform.", reNative: true },
      { name: "Brokermint", website: "https://brokermint.com", description: "Back-office transaction + commission tracking.", reNative: true },
      { name: "DocuSign", website: "https://docusign.com", description: "Industry-standard e-signatures.", reNative: false },
      { name: "PandaDoc", website: "https://pandadoc.com", description: "Document automation + e-sign.", reNative: false },
      { name: "Adobe Sign", website: "https://adobe.com/sign", description: "Adobe's enterprise e-signature product.", reNative: false },
      { name: "Dropbox Sign", website: "https://dropbox.com/sign", description: "Formerly HelloSign — e-sign by Dropbox.", reNative: false },
      { name: "Notarize", website: "https://notarize.com", description: "Online notarization for closings.", reNative: false },
    ],
  },
  {
    key: "aiTools",
    title: "AI tools",
    description: "AI assistants, copy generators, and lead-qualifying bots.",
    tools: [
      { name: "Structurely", website: "https://structurely.com", description: "AI ISA — qualifies leads via SMS.", reNative: true },
      { name: "Lofty AI", website: "https://lofty.com", description: "AI assistant inside the Lofty CRM.", reNative: true },
      { name: "Zillow Showcase", website: "https://zillow.com/showcase", description: "Premium listing format with AI-generated tour.", reNative: true },
      { name: "Real Geeks AI", website: "https://realgeeks.com", description: "AI add-ons inside Real Geeks platform.", reNative: true },
      { name: "Ylopo AI", website: "https://ylopo.com", description: "AI lead nurturing built into Ylopo.", reNative: true },
      { name: "ChatGPT", website: "https://chatgpt.com", description: "OpenAI's flagship general-purpose chatbot.", reNative: false },
      { name: "Claude", website: "https://claude.ai", description: "Anthropic's chatbot — strong at reasoning + writing.", reNative: false },
      { name: "Gemini", website: "https://gemini.google.com", description: "Google's chatbot integrated with Workspace.", reNative: false },
      { name: "Perplexity", website: "https://perplexity.ai", description: "AI-powered search engine with sources.", reNative: false },
      { name: "Notion AI", website: "https://notion.so/product/ai", description: "Built-in AI for Notion workspaces.", reNative: false },
      { name: "Conversica", website: "https://conversica.com", description: "Conversation AI for inbound + outbound.", reNative: false },
      { name: "Drift", website: "https://drift.com", description: "AI chat for websites — qualify visitors live.", reNative: false },
    ],
  },
  {
    key: "analytics",
    title: "Analytics & reporting",
    description: "How teams currently track performance — most still use spreadsheets.",
    tools: [
      { name: "Sisu", website: "https://sisu.co", description: "Real estate team performance + accountability.", reNative: true },
      { name: "Brokermint", website: "https://brokermint.com", description: "Commission + transaction reporting.", reNative: true },
      { name: "Excel", website: "https://microsoft.com/excel", description: "The de-facto reporting tool for SMB teams.", reNative: false },
      { name: "Google Sheets", website: "https://sheets.google.com", description: "Cloud spreadsheets — collaborative tracking.", reNative: false },
      { name: "Airtable", website: "https://airtable.com", description: "Spreadsheet-database hybrid for ops.", reNative: false },
      { name: "Notion", website: "https://notion.so", description: "Docs + databases + collaboration.", reNative: false },
      { name: "Tableau", website: "https://tableau.com", description: "Enterprise BI dashboards.", reNative: false },
      { name: "Looker", website: "https://cloud.google.com/looker", description: "Google Cloud's BI platform.", reNative: false },
      { name: "Google Analytics", website: "https://analytics.google.com", description: "Website traffic + conversion tracking.", reNative: false },
      { name: "Mixpanel", website: "https://mixpanel.com", description: "Product analytics — events + funnels.", reNative: false },
      { name: "Hotjar", website: "https://hotjar.com", description: "Heatmaps + session recordings.", reNative: false },
    ],
  },
  {
    key: "phone",
    title: "Phone & dialing",
    description: "Outbound calling, business numbers, and dialer software.",
    tools: [
      { name: "Mojo Dialer", website: "https://mojosells.com", description: "Power dialer for real estate prospecting.", reNative: true },
      { name: "PhoneBurner", website: "https://phoneburner.com", description: "High-volume cloud-based dialer.", reNative: false },
      { name: "CallTools", website: "https://calltools.com", description: "Predictive dialer + contact center.", reNative: false },
      { name: "RingCentral", website: "https://ringcentral.com", description: "Business phone + messaging + meetings.", reNative: false },
      { name: "OpenPhone", website: "https://openphone.com", description: "Modern team phone — shared numbers.", reNative: false },
      { name: "Aircall", website: "https://aircall.io", description: "Cloud phone for sales + support teams.", reNative: false },
      { name: "Dialpad", website: "https://dialpad.com", description: "AI-powered business communications.", reNative: false },
    ],
  },
];

export function totalToolCount(): number {
  return TOOL_CATEGORIES.reduce((acc, c) => acc + c.tools.length, 0);
}

export function uniqueToolCount(): number {
  const seen = new Set<string>();
  TOOL_CATEGORIES.forEach((c) => c.tools.forEach((t) => seen.add(t.name)));
  return seen.size;
}

export function reNativeToolCount(): number {
  const seen = new Set<string>();
  TOOL_CATEGORIES.forEach((c) =>
    c.tools.forEach((t) => {
      if (t.reNative) seen.add(t.name);
    })
  );
  return seen.size;
}

export type FlatTool = Tool & {
  categoryKey: string;
  categoryTitle: string;
};

/**
 * Flat list of every (tool, category) pair — shown directly in the table view.
 * Sort: RE-native tools first (the most relevant for prospects), then
 * alphabetical within each group.
 */
export function getFlatTools(): FlatTool[] {
  return TOOL_CATEGORIES.flatMap((cat) =>
    cat.tools.map((t) => ({
      ...t,
      categoryKey: cat.key,
      categoryTitle: cat.title,
    }))
  ).sort((a, b) => {
    if (a.reNative !== b.reNative) return a.reNative ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Just the categories, for the filter bar. */
export function getCategoryOptions(): { key: string; title: string; count: number }[] {
  return TOOL_CATEGORIES.map((c) => ({
    key: c.key,
    title: c.title,
    count: c.tools.length,
  }));
}
