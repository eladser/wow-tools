// Approximation of raider.io's per-run scoring. Close enough for planning;
// the site's own numbers win whenever the two disagree.
export function runScore(level: number, timerPct: number): number {
  if (level < 2) return 0;
  const base = 165 + level * 15 + affixBumps(level);
  const adj = Math.max(-1, Math.min(1, timerPct / 40)) * 15;
  if (timerPct < 0) {
    return Math.max(0, base - 15 + adj * 2);
  }
  return base + adj;
}

function affixBumps(level: number): number {
  let bump = 0;
  if (level >= 5) bump += 10;
  if (level >= 7) bump += 10;
  if (level >= 10) bump += 15;
  if (level >= 12) bump += 15;
  return bump;
}

// Score from a live run record (par/clear in ms)
export function runScoreFromMs(level: number, clearMs: number, parMs: number): number {
  const pct = ((parMs - clearMs) / parMs) * 100;
  return runScore(level, pct);
}
