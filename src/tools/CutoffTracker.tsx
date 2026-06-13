import { useState, useEffect } from 'react';
import { fetchCutoffs } from '@/lib/raiderio';
import { useSeason } from '@/lib/content';
import { Field, Row, ResultRows, Hint } from '@/components/ui';
import { scoreColor } from '@/lib/colors';

export function CutoffTracker() {
  const { season } = useSeason();
  const [region, setRegion] = useState('us');
  const [score, setScore] = useState(3000);
  const [cutoff, setCutoff] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setCutoff(null);
    setError('');
    fetchCutoffs(region, season.slug)
      .then((d) => { if (alive) setCutoff(d.cutoffs.p999.all.quantileMinValue); })
      .catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Failed to load'); });
    return () => { alive = false; };
  }, [region, season.slug]);

  const rows = cutoff !== null ? [
    { label: 'Title cutoff', value: `${cutoff.toFixed(0)} (top 0.1% ${region.toUpperCase()})` },
    { label: 'Your score', value: score.toFixed(0) },
    {
      label: score >= cutoff ? 'Above by' : 'Short by',
      value: Math.abs(score - cutoff).toFixed(0),
    },
  ] : [];

  return (
    <div className="space-y-5 max-w-2xl">
      <Hint>
        Pick your region and type your current M+ score. You'll see this season's live title cutoff (the top 0.1%)
        and how far above or below it you are.
      </Hint>
      <Row>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="field-select" aria-label="Region">
          {['us', 'eu', 'kr', 'tw'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
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
