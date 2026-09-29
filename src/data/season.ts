// Midnight Season 2 data. This is the bundled baseline, correct at release.
// Live overrides can ship via public/content.json without a rebuild; see UPDATING.md.
// Sources: method.gg reward tables, wowhead/icy-veins season guides, raider.io.
// Last verified 2026-09-30.

export const SEASON = {
  slug: 'season-mn-2',
  name: 'Midnight Season 2',
  // raider.io expansion id, used to pull live dungeon + season data
  expansionId: 11,
  // US region season start, ISO so it survives a JSON override. The live
  // static-data feed overrides this at runtime when reachable.
  startUsIso: '2026-08-18T15:00:00Z',
  keystoneLegendScore: 3000,
};

export interface Dungeon {
  id: string;
  name: string;
  short: string;
  // Par timer in minutes. The live feed carries exact values; this is the fallback.
  timerMin: number;
  iconUrl?: string;
  bgUrl?: string;
}

export const DUNGEONS: Dungeon[] = [
  { id: 'altar-of-fangs', name: 'Altar of Fangs', short: 'AOF', timerMin: 30 },
  { id: 'den-of-nalorakk', name: 'Den of Nalorakk', short: 'DON', timerMin: 32 },
  { id: 'kings-rest', name: "Kings' Rest", short: 'KR', timerMin: 33 },
  { id: 'murder-row', name: 'Murder Row', short: 'MR', timerMin: 34 },
  { id: 'ruby-life-pools', name: 'Ruby Life Pools', short: 'RLP', timerMin: 28 },
  { id: 'temple-of-sethraliss', name: 'Temple of Sethraliss', short: 'TOS', timerMin: 32 },
  { id: 'the-blinding-vale', name: 'The Blinding Vale', short: 'BV', timerMin: 30 },
  { id: 'voidscar-arena', name: 'Voidscar Arena', short: 'VSA', timerMin: 30 },
];

// Xal'atath's Bargain weekly rotation (kiss-curse, active on +5 to +11).
// Fortified/Tyrannical joins at +7, both active at +10+, Guile replaces the
// Bargain at +12 (each death costs 15s of the timer). Below +5, Lindormi's
// Guidance runs instead (see BARGAIN_DESC note and Affixes.tsx).
export const BARGAINS = ['Voidbound', 'Devour', 'Pulsar', 'Ascendant'] as const;

export const BARGAIN_DESC: Record<string, string> = {
  Voidbound: 'A Void Emissary channels a group-wide curse; break its shield with damage before the cast finishes or enemies hit harder and take less damage.',
  Devour: 'A rift shields every player, slowing them; heal through it or dispel it to convert the shield into a Crit and health buff.',
  Pulsar: 'Orbs tether and orbit players for 15s; walk into one before it expires for Mastery and Leech.',
  Ascendant: 'Orbs cast Cosmic Ascension; interrupt or CC them for Haste and speed, or empowered enemies hit harder for 20s.',
};

// Week-indexed rotation from season start (week 1 had no Bargain modifier).
export const WEEK_ROTATION: Array<{ bargain: string; second: 'Tyrannical' | 'Fortified' }> = [
  { bargain: 'Voidbound', second: 'Tyrannical' },
  { bargain: 'Devour', second: 'Fortified' },
  { bargain: 'Pulsar', second: 'Tyrannical' },
  { bargain: 'Ascendant', second: 'Fortified' },
  { bargain: 'Voidbound', second: 'Tyrannical' },
  { bargain: 'Devour', second: 'Fortified' },
  { bargain: 'Ascendant', second: 'Tyrannical' },
  { bargain: 'Pulsar', second: 'Fortified' },
];

// Gear tracks (Mistcrest system; Valorstones are gone in Midnight)
export const TRACKS: Record<string, number[]> = {
  Champion: [292, 295, 298, 302, 305, 308],
  Hero: [305, 308, 311, 315, 318, 321],
  Myth: [318, 321, 324, 328, 331, 334],
};

export const CREST = {
  costPerUpgrade: 20,
  weeklyCapPerType: 100,
  types: [
    { name: 'Champion Mistcrest', source: 'M0, M+ 2-3, normal raid' },
    { name: 'Hero Mistcrest', source: 'M+ 4-8, heroic raid' },
    { name: 'Myth Mistcrest', source: 'M+ 9+, mythic raid' },
  ],
};

// M+ rewards: end of dungeon + Great Vault, by key level
export const MPLUS_REWARDS: Array<{ level: string; endIlvl: number; endTrack: string; vaultIlvl: number; vaultTrack: string }> = [
  { level: 'M0', endIlvl: 292, endTrack: 'Champion 1/6', vaultIlvl: 302, vaultTrack: 'Champion 4/6' },
  { level: '+2-3', endIlvl: 295, endTrack: 'Champion 2/6', vaultIlvl: 305, vaultTrack: 'Hero 1/6' },
  { level: '+4', endIlvl: 298, endTrack: 'Champion 3/6', vaultIlvl: 308, vaultTrack: 'Hero 2/6' },
  { level: '+5', endIlvl: 302, endTrack: 'Champion 4/6', vaultIlvl: 308, vaultTrack: 'Hero 2/6' },
  { level: '+6', endIlvl: 305, endTrack: 'Hero 1/6', vaultIlvl: 311, vaultTrack: 'Hero 3/6' },
  { level: '+7', endIlvl: 305, endTrack: 'Hero 1/6', vaultIlvl: 315, vaultTrack: 'Hero 4/6' },
  { level: '+8-9', endIlvl: 308, endTrack: 'Hero 2/6', vaultIlvl: 315, vaultTrack: 'Hero 4/6' },
  { level: '+10+', endIlvl: 311, endTrack: 'Hero 3/6', vaultIlvl: 318, vaultTrack: 'Myth 1/6' },
];

// Raid drops by wing, heroic and mythic. The Great Vault now rewards raid
// slots one difficulty above what you killed (LFR vaults at Champion 1/6,
// Normal at Hero 1/6, Heroic at Myth 1/6, Mythic at Myth 6/6, and the last
// two Mythic bosses at 344).
export const RAID_REWARDS = {
  heroic: [
    { bosses: 'First boss', ilvl: '305', track: 'Hero 1/6' },
    { bosses: 'Next 2 bosses', ilvl: '308', track: 'Hero 2/6' },
    { bosses: 'Next 3 bosses', ilvl: '311', track: 'Hero 3/6' },
    { bosses: 'Final 2 bosses', ilvl: '315', track: 'Hero 4/6' },
  ],
  mythic: [
    { bosses: 'First boss', ilvl: '318', track: 'Myth 1/6' },
    { bosses: 'Next 2 bosses', ilvl: '321', track: 'Myth 2/6' },
    { bosses: 'Next 3 bosses', ilvl: '324', track: 'Myth 3/6' },
    { bosses: 'Final 2 bosses', ilvl: '344', track: 'Myth 9, above 6/6' },
  ],
};

// PvP
export const PVP = {
  conquestWeek1: 1350,
  conquestPerWeek: 550,
  ratings: [
    { rating: 1000, rank: 'Combatant I', reward: 'Rated set pieces begin upgrading' },
    { rating: 1200, rank: 'Combatant II', reward: 'Vicious mount progress' },
    { rating: 1400, rank: 'Challenger I', reward: 'Elite set pieces start unlocking' },
    { rating: 1600, rank: 'Challenger II', reward: 'Seasonal feat + extra Catalyst charge' },
    { rating: 1800, rank: 'Rival I', reward: 'Elite weapon appearances' },
    { rating: 1950, rank: 'Rival II', reward: 'Further elite cosmetics' },
    { rating: 2100, rank: 'Duelist', reward: 'Tabard and full elite recolor' },
    { rating: 2300, rank: 'Elite', reward: 'Elite title; Gladiator needs 50 wins above 2300 in 3v3' },
  ],
};

// Weekly reset: Tuesday 15:00 UTC (US), Wednesday 04:00 UTC (EU)
export const RESETS = {
  us: { day: 2, hourUtc: 15 },
  eu: { day: 3, hourUtc: 4 },
};

// Everything fast-changing in one bundle, so a runtime patch can override any
// slice of it. The named exports above are the defaults this bundle points at.
export const DEFAULT_SEASON = {
  season: SEASON,
  dungeons: DUNGEONS,
  bargainDesc: BARGAIN_DESC,
  weekRotation: WEEK_ROTATION,
  tracks: TRACKS,
  crest: CREST,
  mplusRewards: MPLUS_REWARDS,
  raidRewards: RAID_REWARDS,
  pvp: PVP,
  resets: RESETS,
};

export type SeasonData = typeof DEFAULT_SEASON;

export function currentWeekOf(d: SeasonData, now = new Date()): number {
  const ms = now.getTime() - new Date(d.season.startUsIso).getTime();
  return Math.max(1, Math.floor(ms / (7 * 86400000)) + 1);
}

export function rotationForWeekOf(d: SeasonData, week: number) {
  return d.weekRotation[(week - 1) % d.weekRotation.length];
}

export function conquestCapOf(d: SeasonData, now = new Date()): number {
  return d.pvp.conquestWeek1 + (currentWeekOf(d, now) - 1) * d.pvp.conquestPerWeek;
}

// Default-bound wrappers for code that doesn't use the season context.
export const currentWeek = (now = new Date()) => currentWeekOf(DEFAULT_SEASON, now);
export const rotationForWeek = (week: number) => rotationForWeekOf(DEFAULT_SEASON, week);
export const conquestCap = (now = new Date()) => conquestCapOf(DEFAULT_SEASON, now);
