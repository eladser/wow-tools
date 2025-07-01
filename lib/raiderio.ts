// Raider.IO API client for browser-side requests
const RAIDERIO_BASE_URL = 'https://raider.io/api/v1';

interface RaiderIOCharacter {
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
  profile_banner: string;
}

interface MythicPlusScores {
  all: number;
  dps: number;
  healer: number;
  tank: number;
  spec_0: number;
  spec_1: number;
  spec_2: number;
  spec_3: number;
}

interface MythicPlusRun {
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
}

interface RaiderIOResponse {
  character?: RaiderIOCharacter;
  mythic_plus_scores_by_season?: Array<{
    season: string;
    scores: MythicPlusScores;
  }>;
  mythic_plus_best_runs?: MythicPlusRun[];
  mythic_plus_alternate_runs?: MythicPlusRun[];
  error?: string;
}

class RaiderIOClient {
  private baseUrl = RAIDERIO_BASE_URL;

  async getCharacter(
    region: string,
    realm: string,
    name: string,
    fields: string[] = []
  ): Promise<RaiderIOResponse> {
    const params = new URLSearchParams({
      region,
      realm,
      name,
    });

    if (fields.length > 0) {
      params.append('fields', fields.join(','));
    }

    try {
      const response = await fetch(`${this.baseUrl}/characters/profile?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { error: 'Character not found' };
        }
        throw new Error(`Raider.IO API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching character data:', error);
      return { error: 'Failed to fetch character data' };
    }
  }

  async getCharacterMythicPlus(
    region: string,
    realm: string,
    name: string,
    season?: string
  ): Promise<RaiderIOResponse> {
    const fields = [
      'mythic_plus_scores_by_season',
      'mythic_plus_best_runs',
      'mythic_plus_alternate_runs',
    ];

    if (season) {
      fields.push(`mythic_plus_scores_by_season:${season}`);
    }

    return this.getCharacter(region, realm, name, fields);
  }

  async getCharacterRaid(
    region: string,
    realm: string,
    name: string
  ): Promise<RaiderIOResponse> {
    const fields = [
      'raid_progression',
      'raid_achievement_meta',
    ];

    return this.getCharacter(region, realm, name, fields);
  }

  // Get guild information
  async getGuild(
    region: string,
    realm: string,
    name: string,
    fields: string[] = []
  ): Promise<any> {
    const params = new URLSearchParams({
      region,
      realm,
      name,
    });

    if (fields.length > 0) {
      params.append('fields', fields.join(','));
    }

    try {
      const response = await fetch(`${this.baseUrl}/guilds/profile?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { error: 'Guild not found' };
        }
        throw new Error(`Raider.IO API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching guild data:', error);
      return { error: 'Failed to fetch guild data' };
    }
  }

  // Get current M+ affixes
  async getCurrentAffixes(region: string = 'us'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/mythic-plus/affixes?region=${region}`);
      
      if (!response.ok) {
        throw new Error(`Raider.IO API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching affixes:', error);
      return { error: 'Failed to fetch affixes' };
    }
  }

  // Get dungeon information
  async getDungeons(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/mythic-plus/static-data`);
      
      if (!response.ok) {
        throw new Error(`Raider.IO API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dungeon data:', error);
      return { error: 'Failed to fetch dungeon data' };
    }
  }

  // Helper function to format M+ score
  formatScore(score: number): string {
    return score.toFixed(1);
  }

  // Helper function to get score color class
  getScoreColorClass(score: number): string {
    if (score >= 3000) return 'text-orange-400'; // Legendary
    if (score >= 2500) return 'text-purple-400'; // Epic
    if (score >= 2000) return 'text-blue-400';   // Rare
    if (score >= 1500) return 'text-green-400';  // Uncommon
    return 'text-gray-400';                       // Common
  }
}

export const raiderIOClient = new RaiderIOClient();
export type { RaiderIOCharacter, MythicPlusScores, MythicPlusRun, RaiderIOResponse };
