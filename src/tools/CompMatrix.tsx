import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CLASS_COLORS } from '@/lib/colors';
import { Row, Hint } from '@/components/ui';

const CLASSES = Object.keys(CLASS_COLORS);

const BUFFS: Array<{ name: string; classes: string[] }> = [
  { name: 'Bloodlust', classes: ['Shaman', 'Mage', 'Hunter', 'Evoker'] },
  { name: 'Battle res', classes: ['Death Knight', 'Druid', 'Warlock', 'Paladin'] },
  { name: 'Arcane Intellect', classes: ['Mage'] },
  { name: 'Power Word: Fortitude', classes: ['Priest'] },
  { name: 'Battle Shout', classes: ['Warrior'] },
  { name: 'Mark of the Wild', classes: ['Druid'] },
  { name: 'Mystic Touch', classes: ['Monk'] },
  { name: 'Chaos Brand', classes: ['Demon Hunter'] },
  { name: 'Skyfury', classes: ['Shaman'] },
  { name: 'Blessing of the Bronze', classes: ['Evoker'] },
  { name: 'Devotion Aura', classes: ['Paladin'] },
];

interface Member { name: string; cls: string }

const KEY = 'wow-tools.roster';

export function CompMatrix() {
  const [roster, setRoster] = useState<Member[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
  });
  const [name, setName] = useState('');
  const [cls, setCls] = useState(CLASSES[0]);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(roster));
  }, [roster]);

  const add = () => {
    if (!name.trim()) return;
    setRoster(r => [...r, { name: name.trim(), cls }]);
    setName('');
  };

  const present = new Set(roster.map(m => m.cls));
  const missing = BUFFS.filter(b => !b.classes.some(c => present.has(c)));

  return (
    <div className="space-y-5 max-w-4xl">
      <Hint>
        Add each character in your group (name, then class). It checks which raid buffs and utilities you've got
        covered and which ones you're still missing.
      </Hint>
      <Row>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          placeholder="Character name"
          className="field-input w-44"
        />
        <select value={cls} onChange={(e) => setCls(e.target.value)} className="field-select">
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={add} className="btn-primary">Add</button>
        {roster.length > 0 && (
          <button onClick={() => setRoster([])} className="btn-secondary">Clear</button>
        )}
      </Row>

      {roster.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {roster.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 border border-border rounded bg-surface font-mono text-xs">
              <span style={{ color: CLASS_COLORS[m.cls] }}>{m.name}</span>
              <span className="text-faint">{m.cls}</span>
              <button onClick={() => setRoster(r => r.filter((_, j) => j !== i))}
                className="text-faint hover:text-bad" aria-label={`Remove ${m.name}`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="divide-y divide-border/60 border-y border-border">
        {BUFFS.map((b) => {
          const have = b.classes.filter(c => present.has(c));
          const covered = have.length > 0;
          return (
            <div key={b.name} className="flex items-baseline gap-4 py-2 px-1">
              <span className={`font-mono text-sm w-4 text-center shrink-0 ${covered ? 'text-ok' : 'text-bad'}`}>
                {covered ? '✓' : '—'}
              </span>
              <span className={`text-sm w-48 shrink-0 ${covered ? 'text-fg' : 'text-muted'}`}>{b.name}</span>
              <span className="text-sm text-muted">
                {covered
                  ? have.map((c, i) => (
                      <span key={c}>{i > 0 && ', '}<span style={{ color: CLASS_COLORS[c] }}>{c}</span></span>
                    ))
                  : `needs ${b.classes.join(' / ')}`}
              </span>
            </div>
          );
        })}
      </div>

      {roster.length > 0 && missing.length === 0 && (
        <p className="font-mono text-xs text-ok">Full coverage.</p>
      )}
      <p className="font-mono text-xs text-faint">Roster stays in this browser. Nothing is uploaded.</p>
    </div>
  );
}
