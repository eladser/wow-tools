// Score tiers follow raider.io's quality-color convention
export function scoreColor(score: number): string {
  if (score >= 3500) return 'text-artifact';
  if (score >= 3000) return 'text-legendary';
  if (score >= 2400) return 'text-epic';
  if (score >= 1600) return 'text-rare';
  if (score >= 750) return 'text-uncommon';
  return 'text-muted';
}

export const CLASS_COLORS: Record<string, string> = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  Druid: '#FF7C0A',
  Evoker: '#33937F',
  Hunter: '#AAD372',
  Mage: '#3FC7EB',
  Monk: '#00FF98',
  Paladin: '#F48CBA',
  Priest: '#FFFFFF',
  Rogue: '#FFF468',
  Shaman: '#0070DD',
  Warlock: '#8788EE',
  Warrior: '#C69B6D',
};
