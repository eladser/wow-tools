import { useState, useEffect } from 'react';
import { fetchCharacter, type BestRun } from '@/lib/raiderio';
import { CharacterInput } from '@/components/CharacterInput';
import { rememberChar, type CharRef } from '@/lib/recent';
import { scoreColor } from '@/lib/colors';
import { useSeason } from '@/lib/content';
import { type Dungeon } from '@/data/season';
import { Field, Row, Hint } from '@/components/ui';

interface Suggestion {
  dungeon: string;
  fromLevel: number;
  fromTimed: boolean;
  toLevel: number;
  gain: number;
}

// Points a single +1 key level is worth, derived from the character's own runs.
// raider.io's curve shifts per season, so fitting their real scores beats a
// hardcoded formula. Falls back to a flat estimate when there isn't enough data.
function pointsPerLevel(runs: BestRun[]): number {
  const pts = runs.filter(r => r.mythic_level >= 2);
  if (pts.length < 2) return 14;
  const sorted = [...pts].sort((a, b) => a.mythic_level - b.mythic_level);
  const lo = sorted[0];
  const hi = sorted[sorted.length - 1];
  if (hi.mythic_level === lo.mythic_level) return 14;
  const slope = (hi.score - lo.score) / (hi.mythic_level - lo.mythic_level);
  return slope > 0 ? slope : 14;
}

// Untiming a key (no upgrade) leaves roughly a level's worth on the table;
// timing the same level you already ran over is a real, cheap gain.
function plan(runs: BestRun[], target: number, current: number, dungeons: Dungeon[]): { suggestions: Suggestion[]; projected: number } {
  const slope = pointsPerLevel(runs);
  const byName = new Map(runs.map(r => [r.dungeon.toLowerCase(), r]));

  // Per dungeon, what you have now
  type State = { name: string; level: number; timed: boolean; score: number };
  const state: State[] = dungeons.map(d => {
    const run = byName.get(d.name.toLowerCase());
    return {
      name: d.name,
      level: run?.mythic_level ?? 0,
      timed: (run?.num_keystone_upgrades ?? 0) > 0,
      score: run?.score ?? 0,
    };
  });

  const gainForOneLevel = (s: State): { toLevel: number; gain: number } => {
    if (s.level === 0) {
      // first run in this dungeon: a timed key near the player's level is a big jump
      const lvl = Math.max(2, Math.round(medianLevel(state)));
      return { toLevel: lvl, gain: Math.max(slope, slope * (lvl - 1)) };
    }
    if (!s.timed) {
      // timing the level you already have: worth about one level of slope
      return { toLevel: s.level, gain: slope };
    }
    // already timed: only a higher level helps
    return { toLevel: s.level + 1, gain: slope };
  };

  // Cheapest points first = push your lowest dungeons. Sort by current score asc.
  const ordered = [...state].sort((a, b) => a.score - b.score);
  const suggestions: Suggestion[] = [];
  let projected = current;

  for (const s of ordered) {
    if (projected >= target) break;
    const step = gainForOneLevel(s);
    if (step.gain <= 1) continue;
    suggestions.push({
      dungeon: s.name,
      fromLevel: s.level,
      fromTimed: s.timed,
      toLevel: step.toLevel,
      gain: step.gain,
    });
    projected += step.gain;
  }

  // Nothing to suggest (already at target): show the three lowest as next steps anyway
  if (suggestions.length === 0) {
    for (const s of ordered.slice(0, 3)) {
      const step = gainForOneLevel(s);
      suggestions.push({ dungeon: s.name, fromLevel: s.level, fromTimed: s.timed, toLevel: step.toLevel, gain: step.gain });
    }
  }

  return { suggestions, projected };
}

function medianLevel(state: { level: number }[]): number {
  const levels = state.map(s => s.level).filter(l => l > 0).sort((a, b) => a - b);
  if (levels.length === 0) return 7;
  return levels[Math.floor(levels.length / 2)];
}

export function ScorePlanner() {
  const season = useSeason();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [target, setTarget] = useState(() => season.season.keystoneLegendScore);
  const [state, setState] = useState<{ name: string; score: number; runs: BestRun[] } | null>(null);

  // Sync the default once the live season data arrives (initial value is bundled)
  const legend = season.season.keystoneLegendScore;
  useEffect(() => { setTarget(legend); }, [legend]);

  const lookup = async (c: CharRef) => {
    setBusy(true);
    setError('');
    try {
      const p = await fetchCharacter(c.region, c.realm, c.name);
      setState({
        name: p.name,
        score: p.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
        runs: p.mythic_plus_best_runs ?? [],
      });
      rememberChar({ region: c.region, realm: p.realm.toLowerCase().replace(/\s+/g, '-'), name: p.name });
    } catch (e) {
      setState(null);
      setError(e instanceof Error ? e.message : 'Lookup failed');
    } finally {
      setBusy(false);
    }
  };

  const result = state ? plan(state.runs, target, state.score, season.dungeons) : null;
  const reached = state ? state.score >= target : false;

  return (
    <div className="space-y-5 max-w-4xl">
      <Hint>
        Enter your character (<span className="text-fg">Name-Realm</span> or a raider.io link). It reads your keys
        and lists the cheapest dungeons to run to reach the target score you set.
      </Hint>
      <CharacterInput onLookup={lookup} busy={busy} />
      {error && <p className="font-mono text-xs text-bad">{error}</p>}

      {state && result && (
        <div className="animate-fade-in space-y-4">
          <Row>
            <span className="font-mono text-sm text-muted">
              {state.name}: <span className={`font-semibold ${scoreColor(state.score)}`}>{state.score.toFixed(0)}</span>
            </span>
            <Field label="Target">
              <input type="number" min={0} max={4500} step={50} value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 0)} className="field-input w-24" />
            </Field>
            {reached ? (
              <span className="font-mono text-sm text-ok">target reached</span>
            ) : (
              <span className="font-mono text-sm text-faint">{(target - state.score).toFixed(0)} short</span>
            )}
          </Row>

          {!reached && (
            <>
              <div className="divide-y divide-border/60 border-y border-border">
                <div className="flex items-baseline gap-4 py-2 px-1 font-mono text-[11px] uppercase tracking-wider text-faint">
                  <span className="w-44 shrink-0">dungeon</span>
                  <span className="w-28">now</span>
                  <span className="w-28">run this</span>
                  <span className="w-16 text-right">gain</span>
                </div>
                {result.suggestions.map((s) => (
                  <div key={s.dungeon} className="flex items-baseline gap-4 py-2 px-1">
                    <span className="text-sm text-fg w-44 shrink-0">{s.dungeon}</span>
                    <span className="font-mono text-sm text-muted w-28">
                      {s.fromLevel === 0 ? 'no run' : `+${s.fromLevel} ${s.fromTimed ? 'timed' : 'over'}`}
                    </span>
                    <span className="font-mono text-sm text-accent w-28">+{s.toLevel} timed</span>
                    <span className="font-mono text-sm text-ok w-16 text-right">+{s.gain.toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-muted">
                Lands you near <span className={scoreColor(result.projected)}>{result.projected.toFixed(0)}</span>.
                Point value per key level is read from your own runs, so it tracks the live scoring curve.
              </p>
            </>
          )}
        </div>
      )}
      {!state && !error && (
        <p className="font-mono text-xs text-faint">
          {season.season.keystoneLegendScore} is the Keystone Legend score this season.
        </p>
      )}
    </div>
  );
}
