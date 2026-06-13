import { useState, useEffect } from 'react';
import { useSeason } from '@/lib/content';
import type { SeasonData } from '@/data/season';
import { ResultRows, Hint } from '@/components/ui';

function nextWeekly(resets: SeasonData['resets'], region: 'us' | 'eu', from: Date): Date {
  const { day, hourUtc } = resets[region];
  const d = new Date(from);
  d.setUTCHours(hourUtc, 0, 0, 0);
  while (d.getUTCDay() !== day || d <= from) {
    d.setUTCDate(d.getUTCDate() + 1);
    d.setUTCHours(hourUtc, 0, 0, 0);
  }
  return d;
}

function nextDaily(from: Date, hourUtc: number): Date {
  const d = new Date(from);
  d.setUTCHours(hourUtc, 0, 0, 0);
  if (d <= from) d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

function countdown(to: Date, from: Date): string {
  let s = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
}

export function Resets() {
  const { resets } = useSeason();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { label: 'US weekly', value: `${countdown(nextWeekly(resets, 'us', now), now)} — Tue 15:00 UTC` },
    { label: 'EU weekly', value: `${countdown(nextWeekly(resets, 'eu', now), now)} — Wed 04:00 UTC` },
    { label: 'US daily', value: countdown(nextDaily(now, 15), now) },
    { label: 'EU daily', value: countdown(nextDaily(now, 4), now) },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <Hint>Live countdown to the next daily and weekly reset for US and EU. Nothing to enter.</Hint>
      <ResultRows rows={rows} />
      <p className="font-mono text-xs text-faint">
        Weekly reset clears raid lockouts, vault, and crest caps. Your keystone drops one level and rerolls dungeon.
      </p>
    </div>
  );
}
