import { useState } from 'react';
import { useSeason } from '@/lib/content';
import { Field, Row, Hint } from '@/components/ui';
import { scoreColor } from '@/lib/colors';

export function PvpMilestones() {
  const { pvp: PVP } = useSeason();
  const [cr, setCr] = useState(1750);

  const next = PVP.ratings.find(r => r.rating > cr);

  return (
    <div className="space-y-5 max-w-3xl">
      <Hint>
        Type your current arena or RBG rating to see what each bracket unlocks and how many points to the next reward.
      </Hint>
      <Row>
        <Field label="Your rating">
          <input type="number" min={0} max={4000} step={50} value={cr}
            onChange={(e) => setCr(parseInt(e.target.value) || 0)} className="field-input w-24" />
        </Field>
        {next && (
          <span className="font-mono text-sm text-muted">
            {next.rating - cr} to <span className="text-accent">{next.rank}</span>
          </span>
        )}
      </Row>

      <div className="divide-y divide-border/60 border-y border-border">
        {PVP.ratings.map((r) => {
          const reached = cr >= r.rating;
          return (
            <div key={r.rating} className={`flex items-baseline gap-4 py-2 px-1 ${reached ? '' : 'opacity-70'}`}>
              <span className={`font-mono text-sm font-semibold w-14 shrink-0 text-right ${reached ? scoreColor(r.rating * 1.4) : 'text-faint'}`}>
                {r.rating}
              </span>
              <span className={`text-sm w-32 shrink-0 ${reached ? 'text-fg' : 'text-muted'}`}>{r.rank}</span>
              <span className="text-sm text-muted">{r.reward}</span>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-xs text-faint">
        Current rating thresholds, not end-of-season percentile titles — those cut off at season end based on the ladder.
      </p>
    </div>
  );
}
