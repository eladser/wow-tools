// Raider.IO public API — keyless, CORS-enabled.
const BASE = 'https://raider.io/api/v1';

const REGIONS = new Set(['us', 'eu', 'kr', 'tw']);
// keep region inside the known set before it hits a request URL
function reg(region: string): string {
  const r = region.toLowerCase();
  return REGIONS.has(r) ? r : 'us';
}

// Gate any API-supplied URL to http(s) before it reaches an href.
export function safeUrl(u: string | undefined): string | undefined {
  if (!u) return undefined;
  try {
    const p = new URL(u, 'https://raider.io');
    return /^https?:$/.test(p.protocol) ? p.href : undefined;
  } catch {
    return undefined;
  }
}

export interface BestRun {
  dungeon: string;
  short_name: string;
  mythic_level: number;
  clear_time_ms: number;
  par_time_ms: number;
  num_keystone_upgrades: number;
  score: number;
  url: string;
}

export interface CharacterProfile {
  name: string;
  race: string;
  class: string;
  active_spec_name: string;
  active_spec_role: string;
  realm: string;
  region: string;
  profile_url: string;
  thumbnail_url: string;
  mythic_plus_scores_by_season?: Array<{
    season: string;
    scores: { all: number; dps: number; healer: number; tank: number };
  }>;
  mythic_plus_best_runs?: BestRun[];
  mythic_plus_alternate_runs?: BestRun[];
  gear?: { item_level_equipped: number };
}

export async function fetchCharacter(
  region: string,
  realm: string,
  name: string
): Promise<CharacterProfile> {
  const fields = [
    'mythic_plus_scores_by_season:current',
    'mythic_plus_best_runs',
    'mythic_plus_alternate_runs',
    'gear',
  ].join(',');
  const url = `${BASE}/characters/profile?region=${reg(region)}&realm=${encodeURIComponent(realm)}&name=${encodeURIComponent(name)}&fields=${fields}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Character not found (${res.status})`);
  }
  return res.json();
}

export interface SeasonCutoffs {
  cutoffs: {
    p999: { all: { quantileMinValue: number } };
    p990?: { all: { quantileMinValue: number } };
  };
}

export async function fetchCutoffs(region: string, season: string): Promise<SeasonCutoffs> {
  const res = await fetch(`${BASE}/mythic-plus/season-cutoffs?season=${encodeURIComponent(season)}&region=${reg(region)}`);
  if (!res.ok) throw new Error(`Cutoffs unavailable (${res.status})`);
  return res.json();
}

// --- Live season + affix data, so the season pool and timers self-update ---

export interface LiveDungeon {
  slug: string;
  name: string;
  short_name: string;
  keystone_timer_seconds: number;
  icon_url: string;
  background_image_url: string;
}

export interface StaticSeason {
  slug: string;
  name: string;
  starts: Record<string, string>;
  dungeons: LiveDungeon[];
}

export async function fetchStaticData(expansionId: number): Promise<StaticSeason | null> {
  const res = await fetch(`${BASE}/mythic-plus/static-data?expansion_id=${expansionId}`);
  if (!res.ok) throw new Error(`static-data ${res.status}`);
  const json = await res.json();
  const seasons: StaticSeason[] = json.seasons ?? [];
  // the current main season is first
  return seasons[0] ?? null;
}

export interface LiveAffix {
  name: string;
  description: string;
  icon_url: string;
}

export interface AffixWeek {
  title: string;
  affix_details: LiveAffix[];
}

export async function fetchAffixes(region: string): Promise<AffixWeek> {
  const res = await fetch(`${BASE}/mythic-plus/affixes?region=${reg(region)}&locale=en`);
  if (!res.ok) throw new Error(`affixes ${res.status}`);
  return res.json();
}

// Accepts "Name-Realm", a raider.io URL, or separate fields
export function parseCharacterInput(input: string): { region?: string; realm?: string; name?: string } {
  const trimmed = input.trim();

  const urlMatch = trimmed.match(/raider\.io\/characters\/(\w+)\/([^/]+)\/([^/?#]+)/i);
  if (urlMatch) {
    return { region: urlMatch[1], realm: decodeURIComponent(urlMatch[2]), name: decodeURIComponent(urlMatch[3]) };
  }

  // greedy name group so multi-hyphen names (Ji-Kun-Stormrage) keep only the
  // last segment as realm; digits allowed for realms like "Area 52"
  const dashMatch = trimmed.match(/^(.+)-([A-Za-z0-9' ]+)$/);
  if (dashMatch) {
    return { name: dashMatch[1], realm: dashMatch[2].replace(/\s+/g, '-').toLowerCase() };
  }

  return { name: trimmed };
}
