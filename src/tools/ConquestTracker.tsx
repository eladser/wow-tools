import { useState } from 'react';
import { useSeason } from '@/lib/content';
import { Field, Row, ResultRows, Hint } from '@/components/ui';

export function ConquestTracker() {
  const s = useSeason();
  const [earned, setEarned] = useState(0);

  const week = s.currentWeek();
  const cap = s.conquestCap();
  const PVP = s.pvp;
  const missing = Math.max(0, cap - earned);
  // ~ how many weeks of earning at the weekly rate to catch up
  const weeksBehind = (missing / PVP.conquestPerWeek).toFixed(1);

  const rows = [
    { label: 'Season week', value: `${week} (${s.season.name})` },
    { label: 'Current cap', value: cap.toLocaleString() },
    { label: 'You have', value: earned.toLocaleString() },
    { label: 'Catch-up room', value: missing.toLocaleString() },
    { label: 'Weeks behind', value: missing === 0 ? 'capped' : weeksBehind },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <Hint>
        Type how much Conquest you've earned this season. It shows the current weekly cap and how far behind you are.
      </Hint>
      <Row>
        <Field label="Conquest earned so far">
          <input type="number" min={0} step={50} value={earned}
            onChange={(e) => setEarned(parseInt(e.target.value) || 0)} className="field-input w-28" />
        </Field>
      </Row>
      <ResultRows rows={rows} />
      <p className="font-mono text-xs text-faint">
        Cap started at {PVP.conquestWeek1.toLocaleString()} and grows {PVP.conquestPerWeek} per week — it's season-total,
        so missed weeks stay earnable.
      </p>
    </div>
  );
}
