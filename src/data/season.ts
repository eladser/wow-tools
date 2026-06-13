// Midnight Season 1 data. This is the bundled baseline, correct at release.
// Live overrides can ship via public/content.json without a rebuild; see UPDATING.md.
// Sources: method.gg reward tables, wowhead/icy-veins season guides, raider.io.
// Last verified 2026-06-12.

export const SEASON = {
  slug: 'season-mn-1',
  name: 'Midnight Season 1',
  // raider.io expansion id, used to pull live dungeon + season data
  expansionId: 11,
  // US region season start, ISO so it survives a JSON override. The live
  // static-data feed overrides this at runtime when reachable.
  startUsIso: '2026-03-24T15:00:00Z',
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
  { id: 'windrunner-spire', name: 'Windrunner Spire', short: 'WS', timerMin: 30 },
  { id: 'maisara-caverns', name: 'Maisara Caverns', short: 'MC', timerMin: 31 },
  { id: 'magisters-terrace', name: "Magisters' Terrace", short: 'MT', timerMin: 30 },
  { id: 'nexus-point-xenas', name: 'Nexus-Point Xenas', short: 'NPX', timerMin: 32 },
  { id: 'algethar-academy', name: "Algeth'ar Academy", short: 'AA', timerMin: 32 },
  { id: 'seat-of-the-triumvirate', name: 'Seat of the Triumvirate', short: 'SEAT', timerMin: 30 },
  { id: 'skyreach', name: 'Skyreach', short: 'SKY', timerMin: 30 },
  { id: 'pit-of-saron', name: 'Pit of Saron', short: 'POS', timerMin: 31 },
];

// Xal'atath's Bargain weekly rotation (kiss-curse, active on +5 to +11).
// Fortified/Tyrannical joins at +7, both active at +10+, Guile replaces the
// Bargain at +12 (each death costs 15s of the timer).
export const BARGAINS = ['Voidbound', 'Devour', 'Pulsar', 'Ascendant'] as const;

export const BARGAIN_DESC: Record<string, string> = {
  Voidbound: 'Void emissaries spawn during combat; defeating them grants a stacking damage buff, ignoring them empowers enemies.',
  Devour: 'Periodic rift applies a healing-absorb shield to the group; heal or dispel it off to gain haste.',
  Pulsar: 'Orbs tether and orbit players for 15s; absorb them in time for Mastery and Leech.',
  Ascendant: 'Empowered enemies channel void beams; interrupting them grants the group a damage burst.',
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

// Gear tracks (Dawncrest system — Valorstones are gone in Midnight)
export const TRACKS: Record<string, number[]> = {
  Champion: [246, 250, 253, 256, 259, 263],
  Hero: [259, 263, 266, 269, 272, 276],
  Myth: [272, 276, 279, 282, 285, 289],
};

export const CREST = {
  costPerUpgrade: 20,
  weeklyCapPerType: 100,
  types: [
    { name: 'Hero Dawncrest', source: 'M+ 2-6, heroic raid' },
    { name: 'Myth Dawncrest', source: 'M+ 7+, mythic raid' },
  ],
};

// M+ rewards: end of dungeon + Great Vault, by key level
export const MPLUS_REWARDS: Array<{ level: string; endIlvl: number; endTrack: string; vaultIlvl: number; vaultTrack: string }> = [
  { level: 'M0', endIlvl: 246, endTrack: 'Champion 1/6', vaultIlvl: 256, vaultTrack: 'Champion 4/6' },
  { level: '+2-3', endIlvl: 250, endTrack: 'Champion 2/6', vaultIlvl: 259, vaultTrack: 'Hero 1/6' },
  { level: '+4', endIlvl: 253, endTrack: 'Champion 3/6', vaultIlvl: 263, vaultTrack: 'Hero 2/6' },
  { level: '+5', endIlvl: 256, endTrack: 'Champion 4/6', vaultIlvl: 263, vaultTrack: 'Hero 2/6' },
  { level: '+6', endIlvl: 259, endTrack: 'Hero 1/6', vaultIlvl: 266, vaultTrack: 'Hero 3/6' },
  { level: '+7', endIlvl: 259, endTrack: 'Hero 1/6', vaultIlvl: 269, vaultTrack: 'Hero 4/6' },
  { level: '+8-9', endIlvl: 263, endTrack: 'Hero 2/6', vaultIlvl: 269, vaultTrack: 'Hero 4/6' },
  { level: '+10+', endIlvl: 266, endTrack: 'Hero 3/6', vaultIlvl: 272, vaultTrack: 'Myth 1/6' },
];

// Raid drops by wing, heroic and mythic
export const RAID_REWARDS = {
  heroic: [
    { bosses: 'First 3 bosses', ilvl: '259-263', track: 'Hero 1-2/6' },
    { bosses: 'Middle 3 bosses', ilvl: '266', track: 'Hero 3/6' },
    { bosses: 'Final 3 bosses', ilvl: '269', track: 'Hero 4/6' },
  ],
  mythic: [
    { bosses: 'First boss', ilvl: '272', track: 'Myth 1/6' },
    { bosses: 'Next 2 bosses', ilvl: '276', track: 'Myth 2/6' },
    { bosses: 'Middle 3 bosses', ilvl: '279', track: 'Myth 3/6' },
    { bosses: 'Final 3 bosses', ilvl: '282', track: 'Myth 4/6' },
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
    { rating: 2400, rank: 'Elite', reward: 'Elite title; Gladiator needs 50 wins above 2400 in 3v3' },
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
