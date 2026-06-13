import type { ComponentType } from 'react';
import { CharacterLookup } from './CharacterLookup';
import { CharacterCompare } from './CharacterCompare';
import { ScorePlanner } from './ScorePlanner';
import { CutoffTracker } from './CutoffTracker';
import { CompMatrix } from './CompMatrix';
import { WeeklyChecklist } from './WeeklyChecklist';
import { Affixes } from './Affixes';
import { KeyCalculator } from './KeyCalculator';
import { DungeonTimers } from './DungeonTimers';
import { VaultPlanner } from './VaultPlanner';
import { CrestCalculator } from './CrestCalculator';
import { Resets } from './Resets';
import { PvpMilestones } from './PvpMilestones';
import { ConquestTracker } from './ConquestTracker';

export interface Tool {
  id: string;
  name: string;
  desc: string;
  group: string;
  keywords: string;
  component: ComponentType;
}

export const TOOLS: Tool[] = [
  // Mythic+
  { id: 'character', name: 'Character Lookup', desc: 'Score, gear, and best run per dungeon for any character.', group: 'Mythic+', keywords: 'raider.io score profile runs ilvl', component: CharacterLookup },
  { id: 'planner', name: 'Score Planner', desc: 'The cheapest keys between your score and your target.', group: 'Mythic+', keywords: 'target rating push 3000 legend plan', component: ScorePlanner },
  { id: 'compare', name: 'Character Compare', desc: 'Two characters side by side: score, gear, best key per dungeon.', group: 'Mythic+', keywords: 'compare versus alt twink side by side', component: CharacterCompare },
  { id: 'cutoff', name: 'Title Cutoff', desc: 'Live top 0.1% cutoff for your region, next to your score.', group: 'Mythic+', keywords: 'title cutoff percent rank ladder', component: CutoffTracker },
  { id: 'affixes', name: 'Affix Schedule', desc: "This week's Bargain and the coming rotation.", group: 'Mythic+', keywords: 'xalatath bargain weekly fortified tyrannical', component: Affixes },
  { id: 'key-calculator', name: 'Key Score Calculator', desc: 'Key level and timer result to rating points.', group: 'Mythic+', keywords: 'score rating points keystone', component: KeyCalculator },
  { id: 'dungeon-timers', name: 'Dungeon Timers', desc: 'Par times and +2/+3 thresholds for the season pool.', group: 'Mythic+', keywords: 'timer par chest upgrade', component: DungeonTimers },

  // Raid
  { id: 'vault', name: 'Great Vault Planner', desc: 'Tick what you ran this week, see your vault choices.', group: 'Raid', keywords: 'weekly chest reward ilvl', component: VaultPlanner },
  { id: 'crests', name: 'Upgrade Calculator', desc: 'Dawncrest costs from your item level to the cap.', group: 'Raid', keywords: 'dawncrest upgrade track gear ilvl', component: CrestCalculator },
  { id: 'resets', name: 'Reset Timers', desc: 'Time to daily and weekly reset, per region.', group: 'Raid', keywords: 'weekly daily reset region countdown', component: Resets },
  { id: 'comp', name: 'Raid Buff Coverage', desc: 'Build a roster, see which raid buffs and utilities are missing.', group: 'Raid', keywords: 'roster composition bloodlust battle res buffs', component: CompMatrix },
  { id: 'checklist', name: 'Weekly Checklist', desc: 'Track vault, crests, and chores. Resets itself each week.', group: 'Raid', keywords: 'todo weekly chores vault crest conquest tracker', component: WeeklyChecklist },

  // PvP
  { id: 'pvp-milestones', name: 'Rating Milestones', desc: 'What each rating bracket unlocks this season.', group: 'PvP', keywords: 'rating cr arena rewards gladiator elite duelist', component: PvpMilestones },
  { id: 'conquest', name: 'Conquest Cap', desc: "This week's conquest cap and your catch-up room.", group: 'PvP', keywords: 'conquest cap weekly points', component: ConquestTracker },
];

export const GROUPS = [...new Set(TOOLS.map(t => t.group))];

export const GROUP_META: Record<string, { color: string; blurb: string; sigil: string }> = {
  'Mythic+': {
    color: '#4db2e8',
    blurb: 'Push keys, track score, beat the cutoff.',
    sigil: 'M+',
  },
  Raid: {
    color: '#a335ee',
    blurb: 'Vault rewards, upgrades, roster coverage.',
    sigil: '⚔',
  },
  PvP: {
    color: '#e0524a',
    blurb: 'Rating goals and conquest each week.',
    sigil: '⚑',
  },
};
