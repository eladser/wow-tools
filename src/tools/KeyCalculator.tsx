import { useState } from 'react';
import { Field, Row, Bench, PaneLabel, ResultRows, Hint } from '@/components/ui';
import { scoreColor } from '@/lib/colors';
import { runScore } from '@/lib/score';

export function KeyCalculator() {
  const [level, setLevel] = useState(10);
  const [pct, setPct] = useState(10);

  const timed = runScore(level, pct);
  const rows = [
    { label: 'This run', value: `${timed.toFixed(1)} pts` },
    { label: '+1 level', value: `${runScore(level + 1, pct).toFixed(1)} pts` },
    { label: '+2 levels', value: `${runScore(level + 2, pct).toFixed(1)} pts` },
    { label: 'If depleted', value: `${runScore(level, -10).toFixed(1)} pts` },
  ];

  return (
    <div className="space-y-4">
    <Hint>
      Enter a key level and how much of the timer was left when you finished (as a %). It estimates the season
      score that one run is worth.
    </Hint>
    <Bench
      left={
        <>
          <PaneLabel>run</PaneLabel>
          <Row>
            <Field label="Key level">
              <input type="number" min={2} max={35} value={level}
                onChange={(e) => setLevel(parseInt(e.target.value) || 2)} className="field-input w-20" />
            </Field>
            <Field label="Time left %">
              <input type="number" min={-40} max={40} value={pct}
                onChange={(e) => setPct(parseInt(e.target.value) || 0)} className="field-input w-20" />
            </Field>
          </Row>
          <p className="font-mono text-xs text-faint">
            Positive % = beat the timer by that much; negative = over. The timer bonus caps at ±40%.
            A character's season score sums the best run per dungeon, so one number here is one dungeon slot.
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>points</PaneLabel>
          <div className={`font-display text-4xl font-bold ${scoreColor(timed * 8)}`}>{timed.toFixed(1)}</div>
          <ResultRows rows={rows} />
          <p className="font-mono text-xs text-faint">
            Approximation of the raider.io curve — close enough to plan with, not gospel.
          </p>
        </>
      }
    />
    </div>
  );
}
