import { apiFetch } from "./client";

export type RealtorRow = {
  id: string;
  phone: string;
  name: string | null;
  createdAt: string;
};

export function listRealtors(token: string): Promise<{ realtors: RealtorRow[] }> {
  return apiFetch<{ realtors: RealtorRow[] }>("/realtors", { token });
}

const AVATAR_PALETTE: Array<{ avatarBg: string; avatarFg: string }> = [
  { avatarBg: "bg-[hsl(28_55%_88%)]", avatarFg: "text-[hsl(28_45%_28%)]" },
  { avatarBg: "bg-[hsl(205_50%_88%)]", avatarFg: "text-[hsl(205_50%_26%)]" },
  { avatarBg: "bg-[hsl(150_35%_85%)]", avatarFg: "text-[hsl(150_45%_24%)]" },
  { avatarBg: "bg-[hsl(280_40%_88%)]", avatarFg: "text-[hsl(280_40%_28%)]" },
  { avatarBg: "bg-[hsl(15_55%_86%)]", avatarFg: "text-[hsl(15_50%_28%)]" },
];

function hashIndex(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % mod;
}

export type UiRealtor = {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  avatarBg: string;
  avatarFg: string;
};

export function toUiRealtor(row: RealtorRow): UiRealtor {
  const display = row.name?.trim() || row.phone;
  const parts = display.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : display.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "??";
  const shortName =
    parts.length >= 2
      ? `${parts[0]} ${parts[parts.length - 1][0]}.`
      : display;
  const palette = AVATAR_PALETTE[hashIndex(row.id, AVATAR_PALETTE.length)];
  return {
    id: row.id,
    name: display,
    shortName,
    initials,
    avatarBg: palette.avatarBg,
    avatarFg: palette.avatarFg,
  };
}
