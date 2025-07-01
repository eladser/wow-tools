/**
 * Raider.IO API Integration
 * Provides functions to interact with the Raider.IO API for character and mythic+ data
 */

const RAIDERIO_BASE_URL = 'https://raider.io/api/v1';

export interface RaiderIOCharacter {
  name: string;
  race: string;
  class: string;
  active_spec_name: string;
  active_spec_role: string;
  gender: string;
  faction: string;
  achievement_points: number;
  honorable_kills: number;
  thumbnail_url: string;
  region: string;
  realm: string;
  last_crawled_at: string;
  profile_url: string;
  mythic_plus_scores_by_season?: Array<{
    season: string;
    scores: {
      all: number;
      dps: number;
      healer: number;
      tank: number;
      spec_0: number;
      spec_1: number;
      spec_2: number;
      spec_3: number;
    };
  }>;
  mythic_plus_recent_runs?: Array<{
    dungeon: string;
    short_name: string;
    mythic_level: number;
    completed_at: string;
    clear_time_ms: number;
    par_time_ms: number;
    num_keystone_upgrades: number;
    map_challenge_mode_id: number;
    zone_id: number;
    score: number;
    affixes: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      wowhead_url: string;
    }>;
    url: string;
  }>;
  mythic_plus_best_runs?: Array<{
    dungeon: string;
    short_name: string;
    mythic_level: number;
    completed_at: string;
    clear_time_ms: number;
    par_time_ms: number;
    num_keystone_upgrades: number;
    map_challenge_mode_id: number;
    zone_id: number;
    score: number;
    affixes: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      wowhead_url: string;
    }>;
    url: string;
  }>;
  mythic_plus_alternate_runs?: Array<{
    dungeon: string;
    short_name: string;
    mythic_level: number;
    completed_at: string;
    clear_time_ms: number;
    par_time_ms: number;
    num_keystone_upgrades: number;
    map_challenge_mode_id: number;
    zone_id: number;
    score: number;
    affixes: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      wowhead_url: string;
    }>;
    url: string;
  }>;
  mythic_plus_highest_level_runs?: Array<{
    dungeon: string;
    short_name: string;
    mythic_level: number;
    completed_at: string;
    clear_time_ms: number;
    par_time_ms: number;
    num_keystone_upgrades: number;
    map_challenge_mode_id: number;
    zone_id: number;
    score: number;
    affixes: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      wowhead_url: string;
    }>;
    url: string;
  }>;
}

export interface MythicPlusAffixes {
  title: string;
  leaderboard_url: string;
  affix_details: Array<{
    id: number;
    name: string;
    description: string;
    icon: string;
    wowhead_url: string;
  }>;
}

export interface MythicPlusRuns {
  leaderboard: Array<{
    name: string;
    class: string;
    race: string;
    faction: string;
    spec: string;
    guild: {
      name: string;
      faction: string;
      realm: string;
    };
    realm: string;
    region: string;
    score: number;
    url: string;
  }>;
}

/**
 * Determine if we're running in the browser or on the server
 */
function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get the base URL for API calls
 */
function getApiBaseUrl(): string {
  if (isClientSide()) {
    // In the browser, use relative URLs
    return '';
  }
  // On the server, you might want to use the full URL
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Fetch character data from our API (which proxies Raider.IO)
 */
export async function getCharacterProfile(
  region: string,
  realm: string,
  name: string,
  fields: string[] = ['mythic_plus_scores_by_season:current', 'mythic_plus_recent_runs', 'mythic_plus_best_runs', 'mythic_plus_alternate_runs', 'mythic_plus_highest_level_runs']
): Promise<RaiderIOCharacter> {
  const baseUrl = getApiBaseUrl();
  const fieldsParam = fields.join(',');
  const url = `${baseUrl}/api/character?region=${encodeURIComponent(region)}&realm=${encodeURIComponent(realm)}&name=${encodeURIComponent(name)}&fields=${encodeURIComponent(fieldsParam)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to fetch character data: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch character data with ALL season history
 */
export async function getCharacterProfileWithAllSeasons(
  region: string,
  realm: string,
  name: string
): Promise<RaiderIOCharacter> {
  const fields = [
    'mythic_plus_scores_by_season:all',
    'mythic_plus_recent_runs',
    'mythic_plus_best_runs',
    'mythic_plus_alternate_runs',
    'mythic_plus_highest_level_runs'
  ];
  
  return getCharacterProfile(region, realm, name, fields);
}

/**
 * Get current mythic plus affixes from our API
 */
export async function getCurrentAffixes(region: string = 'us'): Promise<MythicPlusAffixes> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/affixes?region=${encodeURIComponent(region)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to fetch affixes: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get mythic plus runs for a specific dungeon (direct API call since we don't have a proxy for this yet)
 */
export async function getDungeonRuns(
  region: string,
  dungeon: string,
  affixes: string,
  page: number = 0
): Promise<MythicPlusRuns> {
  const url = `${RAIDERIO_BASE_URL}/mythic-plus/runs?region=${region}&dungeon=${encodeURIComponent(dungeon)}&affixes=${encodeURIComponent(affixes)}&page=${page}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch dungeon runs: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Generate WarcraftLogs URL for a character
 */
export function getWarcraftLogsUrl(characterName: string, realm: string, region: string): string {
  // WarcraftLogs uses different region format
  const wclRegion = region.toUpperCase();
  const encodedName = encodeURIComponent(characterName);
  const encodedRealm = encodeURIComponent(realm);
  
  return `https://www.warcraftlogs.com/character/${wclRegion}/${encodedRealm}/${encodedName}`;
}

/**
 * Generate Raider.IO profile URL for a character
 */
export function getRaiderIOUrl(characterName: string, realm: string, region: string): string {
  const encodedName = encodeURIComponent(characterName);
  const encodedRealm = encodeURIComponent(realm);
  
  return `https://raider.io/characters/${region}/${encodedRealm}/${encodedName}`;
}

/**
 * Generate WoWProgress URL for a character
 */
export function getWoWProgressUrl(characterName: string, realm: string, region: string): string {
  const encodedName = encodeURIComponent(characterName);
  const encodedRealm = encodeURIComponent(realm);
  
  return `https://www.wowprogress.com/character/${region}/${encodedRealm}/${encodedName}`;
}

/**
 * Get season name from season ID
 */
export function getSeasonName(seasonId: string): string {
  const seasonNames: { [key: string]: string } = {
    'season-df-1': 'Dragonflight Season 1',
    'season-df-2': 'Dragonflight Season 2', 
    'season-df-3': 'Dragonflight Season 3',
    'season-df-4': 'Dragonflight Season 4',
    'season-tww-1': 'The War Within Season 1',
    'season-tww-2': 'The War Within Season 2',
    'season-sl-1': 'Shadowlands Season 1',
    'season-sl-2': 'Shadowlands Season 2',
    'season-sl-3': 'Shadowlands Season 3',
    'season-sl-4': 'Shadowlands Season 4',
    'season-bfa-1': 'Battle for Azeroth Season 1',
    'season-bfa-2': 'Battle for Azeroth Season 2',
    'season-bfa-3': 'Battle for Azeroth Season 3',
    'season-bfa-4': 'Battle for Azeroth Season 4',
  };
  
  return seasonNames[seasonId] || seasonId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get the current season from the character data
 */
export function getCurrentSeason(character: RaiderIOCharacter): string | null {
  if (!character.mythic_plus_scores_by_season || character.mythic_plus_scores_by_season.length === 0) {
    return null;
  }
  
  // Assuming the first season in the array is the current one
  return character.mythic_plus_scores_by_season[0].season;
}

/**
 * Utility function to format time from milliseconds
 */
export function formatTime(timeMs: number): string {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Utility function to get keystone upgrade color
 */
export function getKeystoneUpgradeColor(upgrades: number): string {
  switch (upgrades) {
    case 3: return 'text-yellow-400'; // 3 upgrades - gold
    case 2: return 'text-gray-300';   // 2 upgrades - silver
    case 1: return 'text-orange-600'; // 1 upgrade - bronze
    default: return 'text-red-400';   // 0 upgrades - red
  }
}

/**
 * Utility function to get score color based on rating
 */
export function getScoreColor(score: number): string {
  if (score >= 3000) return 'text-orange-400'; // Orange
  if (score >= 2500) return 'text-pink-400';   // Pink
  if (score >= 2000) return 'text-purple-400'; // Purple
  if (score >= 1500) return 'text-blue-400';   // Blue
  if (score >= 1000) return 'text-green-400';  // Green
  if (score >= 500) return 'text-yellow-400';  // Yellow
  return 'text-gray-400'; // Gray
}

/**
 * Get role icon based on spec role
 */
export function getRoleIcon(role: string): string {
  switch (role.toLowerCase()) {
    case 'tank': return '🛡️';
    case 'healer': return '❤️';
    case 'dps': return '⚔️';
    default: return '❓';
  }
}

/**
 * Sort seasons chronologically (newest first)
 */
export function sortSeasons(seasons: Array<{ season: string; scores: any }>): Array<{ season: string; scores: any }> {
  return [...seasons].sort((a, b) => {
    // Extract season info for sorting
    const getSeasonOrder = (season: string) => {
      if (season.includes('tww')) return 1000; // The War Within (newest)
      if (season.includes('df')) return 900;   // Dragonflight
      if (season.includes('sl')) return 800;   // Shadowlands
      if (season.includes('bfa')) return 700;  // Battle for Azeroth
      return 0; // Unknown/older
    };
    
    const getSeasonNumber = (season: string) => {
      const match = season.match(/-(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    };
    
    const aOrder = getSeasonOrder(a.season);
    const bOrder = getSeasonOrder(b.season);
    
    if (aOrder !== bOrder) {
      return bOrder - aOrder; // Newer expansions first
    }
    
    // Same expansion, sort by season number (higher number = newer)
    return getSeasonNumber(b.season) - getSeasonNumber(a.season);
  });
}
