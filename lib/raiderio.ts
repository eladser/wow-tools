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
 * Fetch character data from Raider.IO
 */
export async function getCharacterProfile(
  region: string,
  realm: string,
  name: string,
  fields: string[] = ['mythic_plus_scores_by_season:current', 'mythic_plus_recent_runs', 'mythic_plus_best_runs', 'mythic_plus_alternate_runs', 'mythic_plus_highest_level_runs']
): Promise<RaiderIOCharacter> {
  const fieldsParam = fields.join(',');
  const url = `${RAIDERIO_BASE_URL}/characters/profile?region=${region}&realm=${encodeURIComponent(realm)}&name=${encodeURIComponent(name)}&fields=${fieldsParam}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Character not found');
    }
    throw new Error(`Failed to fetch character data: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get current mythic plus affixes
 */
export async function getCurrentAffixes(region: string = 'us'): Promise<MythicPlusAffixes> {
  const url = `${RAIDERIO_BASE_URL}/mythic-plus/affixes?region=${region}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch affixes: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get mythic plus runs for a specific dungeon
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
