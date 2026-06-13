import { useSeason } from '@/lib/content';
import { Hint } from '@/components/ui';

function fmt(min: number): string {
  const m = Math.floor(min);
  const s = Math.round((min - m) * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function DungeonTimers() {
  const { dungeons: DUNGEONS } = useSeason();
  return (
    <div className="space-y-4 max-w-3xl">
      <Hint>
        The clear time for each dungeon this season, plus the faster times you need for a 2- or 3-chest. Nothing to enter.
      </Hint>
      <div className="divide-y divide-border/60 border-y border-border">
        <div className="flex items-baseline gap-4 py-2 px-1 font-mono text-[11px] uppercase tracking-wider text-faint">
          <span className="w-44 shrink-0">dungeon</span>
          <span className="w-16 text-right">timer</span>
          <span className="w-16 text-right">+2 (80%)</span>
          <span className="w-16 text-right">+3 (60%)</span>
        </div>
        {DUNGEONS.map((d) => (
          <div key={d.id} className="flex items-baseline gap-4 py-2 px-1">
            <span className="text-sm text-fg w-44 shrink-0">{d.name}</span>
            <span className="font-mono text-sm text-muted w-16 text-right">{fmt(d.timerMin)}</span>
            <span className="font-mono text-sm text-rare w-16 text-right">{fmt(d.timerMin * 0.8)}</span>
            <span className="font-mono text-sm text-epic w-16 text-right">{fmt(d.timerMin * 0.6)}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-faint">
        Two-chest under 80% of par, three-chest under 60%. Par times are maintained by hand — when a
        character lookup runs, exact values come from the live run data instead.
      </p>
    </div>
  );
}
