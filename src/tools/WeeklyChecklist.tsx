import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useSeason } from '@/lib/content';
import { Hint } from '@/components/ui';

// Evergreen weekly goals. Nothing here is season-specific, so it never needs
// maintenance. Progress is stored per week and clears itself at reset.
const GROUPS: Array<{ title: string; items: string[] }> = [
  {
    title: 'Great Vault',
    items: [
      'Mythic+ · 1 dungeon', 'Mythic+ · 4 dungeons', 'Mythic+ · 8 dungeons',
      'Raid · 2 bosses', 'Raid · 4 bosses', 'Raid · 6 bosses',
      'World · slot 1', 'World · slot 2', 'World · slot 3',
    ],
  },
  {
    title: 'Currency caps',
    items: ['Hero Dawncrest cap', 'Myth Dawncrest cap', 'Conquest cap', 'Spark fragment'],
  },
  {
    title: 'Other',
    items: ['Weekly event quest', 'Profession weekly', 'Sparks of war / crafting'],
  },
];

const ALL = GROUPS.flatMap(g => g.items);

export function WeeklyChecklist() {
  const s = useSeason();
  const week = s.currentWeek();
  const key = `wow-tools.checklist.${week}`;

  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { return new Set(); }
  });

  // re-read when the week (and thus the storage key) changes
  useEffect(() => {
    try { setDone(new Set(JSON.parse(localStorage.getItem(key) ?? '[]'))); } catch { setDone(new Set()); }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...done]));
  }, [key, done]);

  const toggle = (item: string) => {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item); else next.add(item);
      return next;
    });
  };

  const completed = ALL.filter(i => done.has(i)).length;

  return (
    <div className="space-y-5 max-w-3xl">
      <Hint>
        Tick off your weekly chores as you finish them. It saves in this browser and resets on its own every weekly reset.
      </Hint>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-elevated overflow-hidden">
          <div className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${(completed / ALL.length) * 100}%`, background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-bright))' }} />
        </div>
        <span className="font-mono text-sm text-muted shrink-0">{completed}/{ALL.length}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="font-mono text-[11px] uppercase tracking-wider text-faint border-b border-border pb-1.5 mb-1.5">{g.title}</div>
            {g.items.map((item) => {
              const on = done.has(item);
              return (
                <button key={item} onClick={() => toggle(item)}
                  className="w-full flex items-center gap-2.5 py-1.5 text-left group">
                  <span className={`grid place-items-center w-4 h-4 rounded border shrink-0 transition-colors ${
                    on ? 'bg-gold border-gold' : 'border-border-strong group-hover:border-gold'}`}>
                    {on && <Check className="w-3 h-3 text-accent-fg" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm transition-colors ${on ? 'text-faint line-through' : 'text-fg'}`}>{item}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-faint">
        Week {week}. Clears on its own at the weekly reset. Saved in this browser only.
      </p>
    </div>
  );
}
