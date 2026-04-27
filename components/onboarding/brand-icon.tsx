"use client";

import { cn } from "@/lib/utils";

type Brand = { bg: string; fg?: string; text: string; gradient?: string };

// Curated brand identities for the most recognizable tools in real estate.
// Anything not in this map falls back to a clean neutral chip with the
// first two letters of the name.
const BRANDS: Record<string, Brand> = {
  // Lead gen / portals
  "Zillow Premier Agent": { bg: "#006AFF", text: "Z" },
  "Realtor.com": { bg: "#C72728", text: "R" },
  "Homes.com": { bg: "#1F2937", text: "H" },
  Redfin: { bg: "#A02021", text: "R" },
  Ojo: { bg: "#FF6F61", text: "O" },
  Movoto: { bg: "#0073E6", text: "M" },
  Trulia: { bg: "#5DA830", text: "T" },

  // Paid ad platforms
  "Google Ads": { bg: "#4285F4", text: "G" },
  "Facebook / Meta Ads": { bg: "#1877F2", text: "f" },
  "Instagram Ads": {
    bg: "#E1306C",
    text: "IG",
    gradient: "linear-gradient(135deg, #FEDA77, #F58529, #DD2A7B, #8134AF, #515BD4)",
  },
  "TikTok Ads": { bg: "#000000", text: "TT" },
  "YouTube Ads": { bg: "#FF0000", text: "▶" },
  "LinkedIn Ads": { bg: "#0A66C2", text: "in" },
  "Nextdoor Ads": { bg: "#8ED500", fg: "#1a1a1a", text: "N" },

  // Lead-gen specialists
  Ylopo: { bg: "#0F172A", text: "Y" },
  CINC: { bg: "#0EA5E9", text: "C" },
  BoomTown: { bg: "#7C3AED", text: "BT" },
  "Real Geeks": { bg: "#16A34A", text: "RG" },
  BoldLeads: { bg: "#DC2626", text: "BL" },
  SmartZip: { bg: "#0EA5E9", text: "SZ" },

  // CRMs
  "Follow Up Boss": { bg: "#0EA5E9", text: "FU" },
  kvCORE: { bg: "#1F2937", text: "kv" },
  BoldTrail: { bg: "#7C3AED", text: "BT" },
  "Lofty (Chime)": { bg: "#F59E0B", fg: "#1a1a1a", text: "L" },
  LionDesk: { bg: "#0F766E", text: "LD" },
  HubSpot: { bg: "#FF7A59", text: "H" },
  Salesforce: { bg: "#00A1E0", text: "SF" },
  "Wise Agent": { bg: "#0F172A", text: "WA" },
  Brivity: { bg: "#7C3AED", text: "Bv" },
  Pipedrive: { bg: "#1A1A1A", text: "Pd" },
  "Sierra Interactive": { bg: "#1E40AF", text: "Si" },
  "BoldTrail websites": { bg: "#7C3AED", text: "BT" },
  "IDX Broker": { bg: "#0F766E", text: "IDX" },
  Placester: { bg: "#1F2937", text: "Pl" },

  // Communication
  BombBomb: { bg: "#FF6B35", text: "BB" },
  Vidyard: { bg: "#9333EA", text: "Vy" },
  Loom: { bg: "#625DF5", text: "L" },
  "WhatsApp Business": { bg: "#25D366", text: "W" },
  Slack: { bg: "#4A154B", text: "#" },
  Zoom: { bg: "#2D8CFF", text: "Z" },
  Calendly: { bg: "#006BFF", text: "C" },
  Twilio: { bg: "#F22F46", text: "Tw" },
  "Microsoft Teams": { bg: "#5059C9", text: "T" },
  Discord: { bg: "#5865F2", text: "D" },
  Front: { bg: "#A656F6", text: "F" },
  Intercom: { bg: "#1F8DED", text: "Ic" },

  // Marketing
  Canva: {
    bg: "#00C4CC",
    text: "C",
    gradient: "linear-gradient(135deg, #00C4CC, #7D2AE7)",
  },
  Mailchimp: { bg: "#FFE01B", fg: "#1a1a1a", text: "M" },
  "Constant Contact": { bg: "#1856ED", text: "CC" },
  ActiveCampaign: { bg: "#356AE6", text: "AC" },
  Klaviyo: { bg: "#1F2937", text: "K" },
  Buffer: { bg: "#000000", text: "B" },
  Hootsuite: { bg: "#000000", text: "Hs" },
  Beehiiv: { bg: "#FFD93D", fg: "#1a1a1a", text: "Be" },
  ConvertKit: { bg: "#FB7755", text: "CK" },

  // Transactions
  Dotloop: { bg: "#10B981", text: "Dl" },
  DocuSign: { bg: "#FFCC22", fg: "#1a1a1a", text: "DS" },
  SkySlope: { bg: "#0EA5E9", text: "SS" },
  TransactionDesk: { bg: "#1E40AF", text: "TD" },
  Brokermint: { bg: "#7C3AED", text: "Bm" },
  PandaDoc: { bg: "#3F8DEF", text: "Pd" },
  "Adobe Sign": { bg: "#FF0000", text: "AS" },

  // AI tools
  ChatGPT: { bg: "#10A37F", text: "AI" },
  Claude: { bg: "#D97757", text: "C" },
  Gemini: { bg: "#4285F4", text: "Gm" },
  Perplexity: { bg: "#1F2937", text: "Px" },
  Structurely: { bg: "#7C3AED", text: "St" },
  "Lofty AI": { bg: "#F59E0B", fg: "#1a1a1a", text: "LA" },
  "Zillow Showcase": { bg: "#006AFF", text: "ZS" },
  "Real Geeks AI": { bg: "#16A34A", text: "RG" },
  "Ylopo AI": { bg: "#0F172A", text: "YA" },
  "Notion AI": { bg: "#1A1A1A", text: "N" },
  Conversica: { bg: "#0EA5E9", text: "Cv" },
  Drift: { bg: "#1F2937", text: "Df" },

  // Analytics
  Sisu: { bg: "#1F2937", text: "S" },
  Excel: { bg: "#107C41", text: "X" },
  "Google Sheets": { bg: "#0F9D58", text: "Gs" },
  Tableau: { bg: "#1F77B4", text: "Tb" },
  Looker: { bg: "#1A73E8", text: "Lk" },
  Airtable: { bg: "#FCB400", fg: "#1a1a1a", text: "At" },
  Notion: { bg: "#1A1A1A", text: "N" },
  "Google Analytics": { bg: "#F9AB00", fg: "#1a1a1a", text: "GA" },
  Mixpanel: { bg: "#7856FF", text: "Mx" },
  Hotjar: { bg: "#FF3D00", text: "Hj" },

  // Phone
  "Mojo Dialer": { bg: "#1F2937", text: "Mj" },
  CallTools: { bg: "#0EA5E9", text: "Ct" },
  RingCentral: { bg: "#066FAC", text: "RC" },
  OpenPhone: { bg: "#7C3AED", text: "Op" },
  PhoneBurner: { bg: "#DC2626", text: "PB" },
  Aircall: { bg: "#00B388", text: "Ac" },
  Dialpad: { bg: "#7C3AED", text: "Dp" },

  // Additional tools surfaced in /tools directory
  Brevo: { bg: "#0B996E", text: "Br" },
  "Dropbox Sign": { bg: "#0061FF", text: "DB" },
  Notarize: { bg: "#1F2937", text: "Nt" },
  AgentFire: { bg: "#F25822", text: "AF" },
  "Showcase IDX": { bg: "#0EA5E9", text: "SX" },
  iHomeFinder: { bg: "#1E40AF", text: "iH" },
  "Easy Agent Pro": { bg: "#16A34A", text: "EA" },

  // Generic Other
  Other: { bg: "#94A3B8", text: "+" },
};

function getBrand(name: string): Brand {
  if (BRANDS[name]) return BRANDS[name];
  // Fallback: clean neutral chip with up to 2 letter abbreviation
  const text = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase() || "?";
  return { bg: "#F3F4F6", fg: "#6B7280", text };
}

export function BrandIcon({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const brand = getBrand(name);
  const fg = brand.fg ?? "#ffffff";
  return (
    <span
      style={{
        background: brand.gradient ?? brand.bg,
        color: fg,
        width: size,
        height: size,
        fontSize: brand.text.length >= 3 ? size * 0.34 : size * 0.42,
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-bold shrink-0 shadow-sm leading-none",
        className
      )}
      aria-hidden
    >
      {brand.text}
    </span>
  );
}
