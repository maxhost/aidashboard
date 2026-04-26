// Centralized option lists for the onboarding wizard.

export const ROLE_OPTIONS = [
  { value: "team-leader", label: "Team Leader", hint: "Lead a team of agents" },
  { value: "solo-agent", label: "Solo Agent", hint: "Just you, for now" },
  { value: "broker", label: "Broker / Owner", hint: "Run a brokerage" },
  { value: "ops", label: "Operations Manager", hint: "Run the back-office" },
] as const;

export const YEARS_OPTIONS = [
  { value: "<2", label: "Less than 2 years" },
  { value: "2-5", label: "2 – 5 years" },
  { value: "5-10", label: "5 – 10 years" },
  { value: "10-20", label: "10 – 20 years" },
  { value: "20+", label: "20+ years" },
] as const;

export const TEAM_SIZE_OPTIONS = [
  { value: "1", label: "Just me", hint: "Solo operator" },
  { value: "2-5", label: "2 – 5", hint: "Small team" },
  { value: "6-15", label: "6 – 15", hint: "Mid-size team" },
  { value: "16-30", label: "16 – 30", hint: "Large team" },
  { value: "31-50", label: "31 – 50", hint: "Mega team" },
  { value: "50+", label: "50+", hint: "Enterprise" },
] as const;

export const TEAM_ROLES = [
  "ISA (Inside Sales Agent)",
  "Transaction Coordinator",
  "Operations Manager",
  "Listing Specialist",
  "Buyer Specialist",
  "Marketing Manager",
  "Showing Assistant",
  "Admin / Receptionist",
];

export const ANNUAL_VOLUME_OPTIONS = [
  { value: "<5M", label: "Less than $5M" },
  { value: "5-15M", label: "$5M – $15M" },
  { value: "15-30M", label: "$15M – $30M" },
  { value: "30-50M", label: "$30M – $50M" },
  { value: "50-100M", label: "$50M – $100M" },
  { value: "100M+", label: "$100M+" },
] as const;

export const BROKERAGES = [
  "Independent",
  "Keller Williams",
  "eXp Realty",
  "Compass",
  "Coldwell Banker",
  "Century 21",
  "Sotheby's",
  "Side",
  "The Real Brokerage",
  "RE/MAX",
  "Berkshire Hathaway",
  "Other",
];

export const PROPERTY_TYPES = [
  "Single family",
  "Condos",
  "Luxury",
  "New construction",
  "Investment / Multi-family",
  "Commercial",
  "Land",
  "Vacation / Short-term rentals",
];

export const AVG_PRICE_OPTIONS = [
  { value: "<300K", label: "Less than $300K" },
  { value: "300-500K", label: "$300K – $500K" },
  { value: "500K-1M", label: "$500K – $1M" },
  { value: "1M-2M", label: "$1M – $2M" },
  { value: "2M-5M", label: "$2M – $5M" },
  { value: "5M+", label: "$5M+" },
] as const;

export const CLIENT_TYPES = [
  "First-time buyers",
  "Move-up buyers",
  "Investors",
  "Luxury buyers",
  "Sellers",
  "Relocations",
  "International buyers",
  "Downsizers",
];

// Lead sources grouped by category
export const LEAD_SOURCE_GROUPS = [
  {
    title: "Online portals",
    branded: true,
    items: [
      "Zillow Premier Agent",
      "Realtor.com",
      "Homes.com",
      "Redfin",
      "Ojo",
      "Movoto",
      "Trulia",
    ],
  },
  {
    title: "Paid ads",
    branded: true,
    items: [
      "Google Ads",
      "Facebook / Meta Ads",
      "Instagram Ads",
      "TikTok Ads",
      "YouTube Ads",
      "LinkedIn Ads",
      "Nextdoor Ads",
    ],
  },
  {
    title: "Lead-gen specialists",
    branded: true,
    items: ["Ylopo", "CINC", "BoomTown", "Real Geeks", "BoldLeads", "SmartZip"],
  },
  {
    title: "Organic",
    branded: false,
    items: [
      "Own website",
      "SEO / blog",
      "Email marketing",
      "Social media (organic)",
      "YouTube channel",
      "Podcast",
    ],
  },
  {
    title: "Referrals",
    branded: false,
    items: [
      "Past clients",
      "Sphere of influence",
      "Other agents",
      "Vendors / partners",
      "Real estate referral networks",
    ],
  },
  {
    title: "Networking",
    branded: false,
    items: [
      "Open houses",
      "Door knocking",
      "Networking events",
      "Floor time",
      "Community events",
    ],
  },
];

// Tech stack grouped by category
export const TECH_STACK_GROUPS = [
  {
    key: "crm" as const,
    title: "CRM",
    description: "Where you keep leads and clients",
    items: [
      "Follow Up Boss",
      "kvCORE",
      "BoldTrail",
      "BoomTown",
      "Lofty (Chime)",
      "LionDesk",
      "HubSpot",
      "Salesforce",
      "CINC",
      "Real Geeks",
      "Wise Agent",
      "Brivity",
      "Pipedrive",
      "Sierra Interactive",
      "Other",
    ],
  },
  {
    key: "leadCapture" as const,
    title: "Lead capture / IDX",
    description: "How leads find you and get into your funnel",
    items: [
      "Ylopo",
      "IDX Broker",
      "Real Geeks",
      "Placester",
      "CINC",
      "BoldTrail websites",
      "Other",
    ],
  },
  {
    key: "communication" as const,
    title: "Communication",
    description: "How you talk to leads and clients",
    items: [
      "BombBomb",
      "Vidyard",
      "Loom",
      "WhatsApp Business",
      "Slack",
      "Microsoft Teams",
      "Discord",
      "Zoom",
      "Calendly",
      "Twilio",
      "Front",
      "Intercom",
      "Other",
    ],
  },
  {
    key: "marketing" as const,
    title: "Marketing",
    description: "Email, design, and social automation",
    items: [
      "Canva",
      "Mailchimp",
      "Constant Contact",
      "ActiveCampaign",
      "Klaviyo",
      "Buffer",
      "Hootsuite",
      "Beehiiv",
      "ConvertKit",
      "Other",
    ],
  },
  {
    key: "transactions" as const,
    title: "Transactions",
    description: "Closing process and document management",
    items: [
      "Dotloop",
      "DocuSign",
      "SkySlope",
      "TransactionDesk",
      "Brokermint",
      "PandaDoc",
      "Adobe Sign",
      "Other",
    ],
  },
  {
    key: "aiTools" as const,
    title: "AI tools",
    description: "Anything AI-powered you already use",
    items: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "Perplexity",
      "Notion AI",
      "Structurely",
      "Lofty AI",
      "Zillow Showcase",
      "Real Geeks AI",
      "Ylopo AI",
      "Conversica",
      "Drift",
      "Other",
    ],
  },
  {
    key: "analytics" as const,
    title: "Analytics / reporting",
    description: "How you currently track performance",
    items: [
      "Sisu",
      "Brokermint",
      "Excel",
      "Google Sheets",
      "Tableau",
      "Looker",
      "Airtable",
      "Notion",
      "Google Analytics",
      "Mixpanel",
      "Hotjar",
      "Other",
    ],
  },
  {
    key: "phone" as const,
    title: "Phone / dialing",
    description: "Outbound calling and voice infrastructure",
    items: [
      "Mojo Dialer",
      "CallTools",
      "RingCentral",
      "OpenPhone",
      "PhoneBurner",
      "Aircall",
      "Dialpad",
      "Other",
    ],
  },
];

export const MONTHLY_SPEND_OPTIONS = [
  { value: "<500", label: "Less than $500" },
  { value: "500-1.5K", label: "$500 – $1,500" },
  { value: "1.5-3K", label: "$1,500 – $3,000" },
  { value: "3-6K", label: "$3,000 – $6,000" },
  { value: "6-10K", label: "$6,000 – $10,000" },
  { value: "10K+", label: "$10,000+" },
] as const;

export const LEAD_CAPTURE_OPTIONS = [
  { value: "manual", label: "Manual entry", hint: "Someone types them in" },
  { value: "auto-website", label: "Automatic from website", hint: "Form / IDX" },
  { value: "crm-forms", label: "From CRM forms" },
  { value: "paid-ads", label: "From paid ads" },
  { value: "other", label: "Other" },
] as const;

export const RESPONSE_TIME_OPTIONS = [
  { value: "<5min", label: "Less than 5 min", hint: "Speed-to-lead culture" },
  { value: "5-15min", label: "5 – 15 min" },
  { value: "15-60min", label: "15 – 60 min" },
  { value: "same-day", label: "Same day" },
  { value: "next-day", label: "Next day" },
  { value: "no-goal", label: "No specific goal" },
] as const;

export const FOLLOWUP_CADENCE_OPTIONS = [
  { value: "manual", label: "Manual ad-hoc" },
  { value: "automated-drip", label: "Automated drip campaigns" },
  { value: "ai-personalized", label: "AI personalized follow-ups" },
  { value: "mix", label: "Mix of manual + automated" },
  { value: "none", label: "Don't have one" },
] as const;

export const LEAD_SCORING_OPTIONS = [
  { value: "manual", label: "Manual review" },
  { value: "some-automation", label: "Some automation" },
  { value: "fully-automated", label: "Fully automated" },
  { value: "none", label: "No system" },
] as const;

export const SHOWINGS_OPTIONS = [
  { value: "manual", label: "Manual scheduling" },
  { value: "calendly", label: "Calendly" },
  { value: "auto-scheduling", label: "Auto-scheduling tool" },
  { value: "other", label: "Other" },
] as const;

export const CLOSING_OPTIONS = [
  { value: "manual", label: "Mostly manual" },
  { value: "templates", label: "Templates" },
  { value: "systematized", label: "Fully systematized" },
  { value: "custom-workflows", label: "Custom workflows per agent" },
] as const;

export const BIGGEST_PAIN_OPTIONS = [
  { value: "not-enough-leads", label: "Not enough leads coming in", category: "Lead gen" },
  { value: "low-conversion", label: "Leads aren't converting", category: "Conversion" },
  { value: "pipeline-visibility", label: "Hard to keep track of pipeline", category: "Operations" },
  { value: "underperforming-agents", label: "Team agents underperforming", category: "Coaching" },
  { value: "tool-roi", label: "Spending too much on tools that don't work", category: "ROI" },
  { value: "speed", label: "Losing deals to faster competitors", category: "Speed" },
  { value: "scale", label: "Hard to scale operations", category: "Scale" },
  { value: "other", label: "Something else", category: "Custom" },
] as const;

export const SUCCESS_METRICS = [
  "More qualified leads",
  "Higher conversion rate",
  "Better team performance visibility",
  "Cut software costs",
  "Close deals faster",
  "Better coaching for agents",
  "Specific revenue target",
];
