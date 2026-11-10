import { useState, useEffect } from 'react';
import { fetchCutoffs, type SeasonCutoffs } from '@/lib/raiderio';
import { useSeason } from '@/lib/content';
import { Field, Row, ResultRows, Hint } from '@/components/ui';
import { scoreColor } from '@/lib/colors';

const FACTIONS = { all: 'All', horde: 'Horde', alliance: 'Alliance' };
type Faction = keyof typeof FACTIONS;

export function CutoffTracker() {
  const { season } = useSeason();
  const [region, setRegion] = useState('us');
  const [faction, setFaction] = useState<Faction>('all');
  const [score, setScore] = useState(3000);
  const [p999, setP999] = useState<SeasonCutoffs['cutoffs']['p999'] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setP999(null);
    setError('');
    fetchCutoffs(region, season.slug)
      .then((d) => {
        if (!alive) return;
        const c = d.cutoffs.p999;
        setP999(c);
        setFaction((f) => (c[f] ? f : 'all'));
      })
      .catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Failed to load'); });
    return () => { alive = false; };
  }, [region, season.slug]);

  const factions = (Object.keys(FACTIONS) as Faction[]).filter((f) => !p999 || p999[f]);
  const cutoff = p999?.[faction]?.quantileMinValue ?? null;
  const who = region.toUpperCase() + (faction === 'all' ? '' : ` ${FACTIONS[faction]}`);

  const rows = cutoff !== null ? [
    { label: 'Title cutoff', value: `${cutoff.toFixed(0)} (top 0.1% ${who})` },
    { label: 'Your score', value: score.toFixed(0) },
    {
      label: score >= cutoff ? 'Above by' : 'Short by',
      value: Math.abs(score - cutoff).toFixed(0),
    },
  ] : [];

  return (
    <div className="space-y-5 max-w-2xl">
      <Hint>
        Pick your region and faction, then type your current M+ score. You'll see this season's live title cutoff
        (the top 0.1%) and how far above or below it you are.
      </Hint>
      <Row>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="field-select" aria-label="Region">
          {['us', 'eu', 'kr', 'tw'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
        </select>
        <select value={faction} onChange={(e) => setFaction(e.target.value as Faction)} className="field-select" aria-label="Faction">
          {factions.map(f => <option key={f} value={f}>{FACTIONS[f]}</option>)}
        </select>
        <Field label="Your score">
          <input type="number" min={0} max={4500} step={10} value={score}
            onChange={(e) => setScore(parseInt(e.target.value) || 0)} className="field-input w-24" />
        </Field>
      </Row>

      {error && <p className="font-mono text-xs text-bad">{error}</p>}
      {cutoff === null && !error && <p className="font-mono text-xs text-faint">Loading cutoff…</p>}
      {cutoff !== null && (
        <>
          <div className={`font-display text-4xl font-bold ${scoreColor(cutoff)}`}>{cutoff.toFixed(0)}</div>
          <ResultRows rows={rows} />
          <p className="font-mono text-xs text-faint">
            Live from raider.io. The cutoff climbs all season — pad your margin before the last weeks.
          </p>
        </>
      )}
    </div>
  );
}
