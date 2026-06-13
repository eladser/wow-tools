import { useState } from 'react';
import { useSeason } from '@/lib/content';
import { Bench, PaneLabel, Field, Row, ResultRows, Hint } from '@/components/ui';

export function CrestCalculator() {
  const { tracks: TRACKS, crest: CREST } = useSeason();
  const [track, setTrack] = useState<keyof typeof TRACKS>('Hero');
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(6);

  // keep the range sane even if the user types from > to
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const steps = hi - lo;
  const crests = steps * CREST.costPerUpgrade;
  const weeks = Math.ceil(crests / CREST.weeklyCapPerType);
  const ilvls = TRACKS[track];

  const rows = [
    { label: 'Item level', value: `${ilvls[lo - 1]} → ${ilvls[hi - 1]}` },
    { label: 'Upgrades', value: String(steps) },
    { label: 'Crests', value: `${crests} ${track === 'Myth' ? 'Myth' : 'Hero'} Dawncrests` },
    { label: 'Weeks (capped)', value: weeks === 0 ? '—' : String(weeks) },
  ];

  return (
    <div className="space-y-4">
    <Hint>
      Pick a gear track and the ranks you're upgrading from and to. It totals the Dawncrests you need and how many
      weeks the weekly cap allows.
    </Hint>
    <Bench
      left={
        <>
          <PaneLabel>upgrade</PaneLabel>
          <Row>
            <select value={track} onChange={(e) => setTrack(e.target.value as keyof typeof TRACKS)} className="field-select">
              {Object.keys(TRACKS).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Field label="From rank">
              <input type="number" min={1} max={6} value={from}
                onChange={(e) => setFrom(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))} className="field-input w-16" />
            </Field>
            <Field label="To rank">
              <input type="number" min={1} max={6} value={to}
                onChange={(e) => setTo(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))} className="field-input w-16" />
            </Field>
          </Row>
          <p className="font-mono text-xs text-faint">
            Every rank costs {CREST.costPerUpgrade} Dawncrests of the matching type; you earn at most {CREST.weeklyCapPerType} per
            type per week, so one full piece per track per week. Valorstones are gone in Midnight.
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>cost</PaneLabel>
          <ResultRows rows={rows} />
          <div className="font-mono text-xs text-faint">
            {CREST.types.map(t => `${t.name}: ${t.source}`).join(' · ')}
          </div>
        </>
      }
    />
    </div>
  );
}
