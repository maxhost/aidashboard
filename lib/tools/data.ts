// Curated directory of real estate tools used by teams in the US market.
// Organized by category for the /tools page. Each entry is the canonical
// brand name (matches the BrandIcon registry) + official website + a
// one-line description.

export type Tool = {
  name: string;
  website: string;
  description: string;
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
      {
        name: "Follow Up Boss",
        website: "https://followupboss.com",
        description: "Best-in-class real estate CRM with smart automations.",
      },
      {
        name: "kvCORE",
        website: "https://insiderealestate.com/kvcore",
        description: "All-in-one platform — CRM + IDX + AI assistant.",
      },
      {
        name: "BoldTrail",
        website: "https://boldtrail.com",
        description: "Inside Real Estate's flagship CRM + websites suite.",
      },
      {
        name: "BoomTown",
        website: "https://boomtownroi.com",
        description: "Lead generation + CRM bundle for high-volume teams.",
      },
      {
        name: "Lofty (Chime)",
        website: "https://lofty.com",
        description: "Smart CRM with AI-driven lead nurturing.",
      },
      {
        name: "Sierra Interactive",
        website: "https://sierrainteractive.com",
        description: "CRM, websites, and lead management for teams.",
      },
      {
        name: "CINC",
        website: "https://cincpro.com",
        description: "Lead-gen-focused CRM with PPC management.",
      },
      {
        name: "Real Geeks",
        website: "https://realgeeks.com",
        description: "CRM + IDX websites + AI tools, integrated stack.",
      },
      {
        name: "LionDesk",
        website: "https://liondesk.com",
        description: "Affordable CRM with video email and texting.",
      },
      {
        name: "Wise Agent",
        website: "https://wiseagent.com",
        description: "Long-running, affordable real estate CRM.",
      },
      {
        name: "Brivity",
        website: "https://brivity.com",
        description: "CRM and marketing platform for top teams.",
      },
      {
        name: "Pipedrive",
        website: "https://pipedrive.com",
        description: "General-purpose visual sales pipeline CRM.",
      },
      {
        name: "HubSpot",
        website: "https://hubspot.com",
        description: "Free-tier CRM with marketing and sales add-ons.",
      },
      {
        name: "Salesforce",
        website: "https://salesforce.com",
        description: "Enterprise-grade CRM for large brokerages.",
      },
    ],
  },
  {
    key: "leadCapture",
    title: "Lead capture & IDX websites",
    description:
      "How visitors become leads — IDX search, landing pages, and forms.",
    tools: [
      {
        name: "Ylopo",
        website: "https://ylopo.com",
        description: "Lead-gen platform with smart targeting + websites.",
      },
      {
        name: "IDX Broker",
        website: "https://idxbroker.com",
        description: "MLS search widgets and IDX integration for any site.",
      },
      {
        name: "Real Geeks",
        website: "https://realgeeks.com",
        description: "IDX websites built for lead capture.",
      },
      {
        name: "Placester",
        website: "https://placester.com",
        description: "Real estate websites with built-in IDX.",
      },
      {
        name: "Showcase IDX",
        website: "https://showcaseidx.com",
        description: "Modern IDX search plugin for WordPress.",
      },
      {
        name: "iHomeFinder",
        website: "https://ihomefinder.com",
        description: "Long-running IDX provider with broker tools.",
      },
      {
        name: "Easy Agent Pro",
        website: "https://easyagentpro.com",
        description: "WordPress-based IDX websites for agents.",
      },
      {
        name: "AgentFire",
        website: "https://agentfire.com",
        description: "Hyper-local websites for real estate teams.",
      },
      {
        name: "BoldTrail websites",
        website: "https://boldtrail.com",
        description: "Inside Real Estate's IDX + websites product.",
      },
      {
        name: "CINC",
        website: "https://cincpro.com",
        description: "Combined lead capture + CRM stack.",
      },
    ],
  },
  {
    key: "leadgen",
    title: "Lead-gen specialists",
    description:
      "Done-for-you lead generation services with proprietary funnels.",
    tools: [
      {
        name: "Ylopo",
        website: "https://ylopo.com",
        description: "Performance-marketing-driven lead-gen + AI.",
      },
      {
        name: "CINC",
        website: "https://cincpro.com",
        description: "Managed PPC + lead-gen on top of their CRM.",
      },
      {
        name: "BoomTown",
        website: "https://boomtownroi.com",
        description: "Long-running managed lead-gen for top teams.",
      },
      {
        name: "Real Geeks",
        website: "https://realgeeks.com",
        description: "DIY lead-gen + IDX combo.",
      },
      {
        name: "BoldLeads",
        website: "https://boldleads.com",
        description: "Done-for-you Facebook seller leads.",
      },
      {
        name: "SmartZip",
        website: "https://smartzip.com",
        description: "Predictive analytics for likely sellers.",
      },
    ],
  },
  {
    key: "portals",
    title: "Online portals",
    description:
      "Where most US buyers and sellers start their search.",
    tools: [
      {
        name: "Zillow Premier Agent",
        website: "https://premieragent.zillow.com",
        description: "The largest US portal — pay-per-zip leads.",
      },
      {
        name: "Realtor.com",
        website: "https://realtor.com",
        description: "Move.com-owned portal — second-largest reach.",
      },
      {
        name: "Homes.com",
        website: "https://homes.com",
        description: "CoStar-backed challenger portal.",
      },
      {
        name: "Redfin",
        website: "https://redfin.com",
        description: "Tech-first brokerage + portal hybrid.",
      },
      {
        name: "Trulia",
        website: "https://trulia.com",
        description: "Zillow-owned consumer portal.",
      },
      {
        name: "Movoto",
        website: "https://movoto.com",
        description: "OJO-owned portal aggregator.",
      },
      {
        name: "Ojo",
        website: "https://ojo.com",
        description: "Consumer search portal with concierge.",
      },
    ],
  },
  {
    key: "paidAds",
    title: "Paid ad platforms",
    description: "Self-serve advertising channels with real estate audiences.",
    tools: [
      {
        name: "Google Ads",
        website: "https://ads.google.com",
        description: "Search + Display + YouTube ads.",
      },
      {
        name: "Facebook / Meta Ads",
        website: "https://www.facebook.com/business/ads",
        description: "Largest paid social platform — buyer + seller targeting.",
      },
      {
        name: "Instagram Ads",
        website: "https://business.instagram.com/advertising",
        description: "Visual-first social ads on Meta's platform.",
      },
      {
        name: "TikTok Ads",
        website: "https://ads.tiktok.com",
        description: "Short-form video ads — younger demographics.",
      },
      {
        name: "YouTube Ads",
        website: "https://ads.google.com/intl/en_us/home/campaigns/video-ads",
        description: "Pre-roll and discovery video advertising.",
      },
      {
        name: "LinkedIn Ads",
        website: "https://business.linkedin.com/marketing-solutions/ads",
        description: "B2B and luxury / commercial real estate targeting.",
      },
      {
        name: "Nextdoor Ads",
        website: "https://business.nextdoor.com",
        description: "Hyper-local neighborhood advertising.",
      },
    ],
  },
  {
    key: "communication",
    title: "Communication & video",
    description: "How you reach leads, clients, and the team day-to-day.",
    tools: [
      {
        name: "BombBomb",
        website: "https://bombbomb.com",
        description: "Video email built for real estate.",
      },
      {
        name: "Vidyard",
        website: "https://vidyard.com",
        description: "Personalized async video for sales.",
      },
      {
        name: "Loom",
        website: "https://loom.com",
        description: "Quick screen + camera recordings.",
      },
      {
        name: "Zoom",
        website: "https://zoom.us",
        description: "The default for video meetings.",
      },
      {
        name: "Slack",
        website: "https://slack.com",
        description: "Team chat + integrations hub.",
      },
      {
        name: "Microsoft Teams",
        website: "https://www.microsoft.com/microsoft-teams",
        description: "Microsoft's chat + meetings + collab suite.",
      },
      {
        name: "WhatsApp Business",
        website: "https://business.whatsapp.com",
        description: "1:1 messaging with international clients.",
      },
      {
        name: "Calendly",
        website: "https://calendly.com",
        description: "Self-serve scheduling for showings + intake calls.",
      },
      {
        name: "Twilio",
        website: "https://twilio.com",
        description: "SMS / voice / WhatsApp APIs for builders.",
      },
      {
        name: "Front",
        website: "https://front.com",
        description: "Shared inboxes for team-based email.",
      },
      {
        name: "Intercom",
        website: "https://intercom.com",
        description: "Live chat + customer messaging platform.",
      },
      {
        name: "Discord",
        website: "https://discord.com",
        description: "Community-style chat + voice channels.",
      },
    ],
  },
  {
    key: "marketing",
    title: "Marketing & design",
    description: "Email, design, social, and content automation.",
    tools: [
      {
        name: "Canva",
        website: "https://canva.com",
        description: "Drag-and-drop design — used by every team.",
      },
      {
        name: "Mailchimp",
        website: "https://mailchimp.com",
        description: "Classic email marketing tool.",
      },
      {
        name: "Constant Contact",
        website: "https://constantcontact.com",
        description: "Email + event marketing for SMBs.",
      },
      {
        name: "ActiveCampaign",
        website: "https://activecampaign.com",
        description: "Email + automation + light CRM.",
      },
      {
        name: "Klaviyo",
        website: "https://klaviyo.com",
        description: "Data-driven email + SMS marketing.",
      },
      {
        name: "Beehiiv",
        website: "https://beehiiv.com",
        description: "Modern newsletter platform with monetization.",
      },
      {
        name: "ConvertKit",
        website: "https://convertkit.com",
        description: "Newsletter + email automation for creators.",
      },
      {
        name: "Buffer",
        website: "https://buffer.com",
        description: "Schedule + analytics for social media.",
      },
      {
        name: "Hootsuite",
        website: "https://hootsuite.com",
        description: "Multi-channel social media management.",
      },
      {
        name: "Brevo",
        website: "https://brevo.com",
        description: "Email + SMS + WhatsApp marketing platform.",
      },
    ],
  },
  {
    key: "transactions",
    title: "Transactions & e-sign",
    description: "Closing process, contracts, and document workflow.",
    tools: [
      {
        name: "Dotloop",
        website: "https://dotloop.com",
        description: "Real estate's most-used transaction platform.",
      },
      {
        name: "DocuSign",
        website: "https://docusign.com",
        description: "Industry-standard e-signatures.",
      },
      {
        name: "SkySlope",
        website: "https://skyslope.com",
        description: "Brokerage-side transaction + compliance.",
      },
      {
        name: "TransactionDesk",
        website: "https://transactiondesk.com",
        description: "Lone Wolf's transaction management platform.",
      },
      {
        name: "Brokermint",
        website: "https://brokermint.com",
        description: "Back-office transaction + commission tracking.",
      },
      {
        name: "PandaDoc",
        website: "https://pandadoc.com",
        description: "Document automation + e-sign.",
      },
      {
        name: "Adobe Sign",
        website: "https://adobe.com/sign",
        description: "Adobe's enterprise e-signature product.",
      },
      {
        name: "Dropbox Sign",
        website: "https://dropbox.com/sign",
        description: "Formerly HelloSign — e-sign by Dropbox.",
      },
      {
        name: "Notarize",
        website: "https://notarize.com",
        description: "Online notarization for closings.",
      },
    ],
  },
  {
    key: "aiTools",
    title: "AI tools",
    description: "AI assistants, copy generators, and lead-qualifying bots.",
    tools: [
      {
        name: "ChatGPT",
        website: "https://chatgpt.com",
        description: "OpenAI's flagship general-purpose chatbot.",
      },
      {
        name: "Claude",
        website: "https://claude.ai",
        description: "Anthropic's chatbot — strong at reasoning + writing.",
      },
      {
        name: "Gemini",
        website: "https://gemini.google.com",
        description: "Google's chatbot integrated with Workspace.",
      },
      {
        name: "Perplexity",
        website: "https://perplexity.ai",
        description: "AI-powered search engine with sources.",
      },
      {
        name: "Notion AI",
        website: "https://notion.so/product/ai",
        description: "Built-in AI for Notion workspaces.",
      },
      {
        name: "Structurely",
        website: "https://structurely.com",
        description: "AI ISA — qualifies leads via SMS.",
      },
      {
        name: "Lofty AI",
        website: "https://lofty.com",
        description: "AI assistant inside the Lofty CRM.",
      },
      {
        name: "Zillow Showcase",
        website: "https://zillow.com/showcase",
        description: "Premium listing format with AI-generated tour.",
      },
      {
        name: "Real Geeks AI",
        website: "https://realgeeks.com",
        description: "AI add-ons inside Real Geeks platform.",
      },
      {
        name: "Ylopo AI",
        website: "https://ylopo.com",
        description: "AI lead nurturing built into Ylopo.",
      },
      {
        name: "Conversica",
        website: "https://conversica.com",
        description: "Conversation AI for inbound + outbound.",
      },
      {
        name: "Drift",
        website: "https://drift.com",
        description: "AI chat for websites — qualify visitors live.",
      },
    ],
  },
  {
    key: "analytics",
    title: "Analytics & reporting",
    description: "How teams currently track performance — most still use spreadsheets.",
    tools: [
      {
        name: "Sisu",
        website: "https://sisu.co",
        description: "Real estate team performance + accountability.",
      },
      {
        name: "Brokermint",
        website: "https://brokermint.com",
        description: "Commission + transaction reporting.",
      },
      {
        name: "Excel",
        website: "https://microsoft.com/excel",
        description: "The de-facto reporting tool for SMB teams.",
      },
      {
        name: "Google Sheets",
        website: "https://sheets.google.com",
        description: "Cloud spreadsheets — collaborative tracking.",
      },
      {
        name: "Airtable",
        website: "https://airtable.com",
        description: "Spreadsheet-database hybrid for ops.",
      },
      {
        name: "Notion",
        website: "https://notion.so",
        description: "Docs + databases + collaboration.",
      },
      {
        name: "Tableau",
        website: "https://tableau.com",
        description: "Enterprise BI dashboards.",
      },
      {
        name: "Looker",
        website: "https://cloud.google.com/looker",
        description: "Google Cloud's BI platform.",
      },
      {
        name: "Google Analytics",
        website: "https://analytics.google.com",
        description: "Website traffic + conversion tracking.",
      },
      {
        name: "Mixpanel",
        website: "https://mixpanel.com",
        description: "Product analytics — events + funnels.",
      },
      {
        name: "Hotjar",
        website: "https://hotjar.com",
        description: "Heatmaps + session recordings.",
      },
    ],
  },
  {
    key: "phone",
    title: "Phone & dialing",
    description: "Outbound calling, business numbers, and dialer software.",
    tools: [
      {
        name: "Mojo Dialer",
        website: "https://mojosells.com",
        description: "Power dialer for real estate prospecting.",
      },
      {
        name: "PhoneBurner",
        website: "https://phoneburner.com",
        description: "High-volume cloud-based dialer.",
      },
      {
        name: "CallTools",
        website: "https://calltools.com",
        description: "Predictive dialer + contact center.",
      },
      {
        name: "RingCentral",
        website: "https://ringcentral.com",
        description: "Business phone + messaging + meetings.",
      },
      {
        name: "OpenPhone",
        website: "https://openphone.com",
        description: "Modern team phone — shared numbers.",
      },
      {
        name: "Aircall",
        website: "https://aircall.io",
        description: "Cloud phone for sales + support teams.",
      },
      {
        name: "Dialpad",
        website: "https://dialpad.com",
        description: "AI-powered business communications.",
      },
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

export type FlatTool = Tool & {
  categoryKey: string;
  categoryTitle: string;
};

/** Flat list of every (tool, category) pair — shown directly in the table view. */
export function getFlatTools(): FlatTool[] {
  return TOOL_CATEGORIES.flatMap((cat) =>
    cat.tools.map((t) => ({
      ...t,
      categoryKey: cat.key,
      categoryTitle: cat.title,
    }))
  ).sort((a, b) => a.name.localeCompare(b.name));
}

/** Just the categories, for the filter bar. */
export function getCategoryOptions(): { key: string; title: string; count: number }[] {
  return TOOL_CATEGORIES.map((c) => ({
    key: c.key,
    title: c.title,
    count: c.tools.length,
  }));
}
