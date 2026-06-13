import { useState } from 'react';
import { fetchCharacter, parseCharacterInput, type CharacterProfile } from '@/lib/raiderio';
import { scoreColor, CLASS_COLORS } from '@/lib/colors';
import { useSeason } from '@/lib/content';
import { Row, Hint } from '@/components/ui';

type Slot = CharacterProfile | null;

function scoreOf(c: CharacterProfile) {
  return c.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0;
}

export function CharacterCompare() {
  const { dungeons } = useSeason();
  const [inputs, setInputs] = useState(['', '']);
  const [region, setRegion] = useState('us');
  const [chars, setChars] = useState<[Slot, Slot]>([null, null]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const compare = async () => {
    setBusy(true);
    setError('');
    try {
      const loaded = await Promise.all(inputs.map(async (raw) => {
        if (!raw.trim()) return null;
        const p = parseCharacterInput(raw);
        if (!p.name) return null;
        return fetchCharacter(p.region ?? region, p.realm ?? '', p.name);
      }));
      setChars([loaded[0], loaded[1]]);
      if (!loaded[0] && !loaded[1]) setError('Enter at least one character');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed');
    } finally {
      setBusy(false);
    }
  };

  const [a, b] = chars;
  const bestByDungeon = (c: CharacterProfile, name: string) =>
    c.mythic_plus_best_runs?.find(r => r.dungeon.toLowerCase() === name.toLowerCase());

  return (
    <div className="space-y-5 max-w-4xl">
      <Hint>
        Enter two characters as <span className="text-fg">Name-Realm</span> (like Thrall-Area 52) or paste raider.io
        links, then hit Compare. You'll see their score, item level, and best key per dungeon next to each other.
      </Hint>
      <Row>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="field-select" aria-label="Region">
          {['us', 'eu', 'kr', 'tw'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
        </select>
        <input value={inputs[0]} onChange={(e) => setInputs(p => [e.target.value, p[1]])}
          placeholder="Name-Realm or raider.io link" className="field-input flex-1"
          aria-label="First character (Name-Realm or raider.io link)" />
        <span className="font-display text-faint">vs</span>
        <input value={inputs[1]} onChange={(e) => setInputs(p => [p[0], e.target.value])}
          placeholder="Name-Realm or raider.io link" className="field-input flex-1"
          aria-label="Second character (Name-Realm or raider.io link)" />
        <button onClick={compare} disabled={busy} className="btn-primary">
          {busy ? 'Loading' : 'Compare'}
        </button>
      </Row>
      {error && <p className="font-mono text-xs text-bad">{error}</p>}

      {(a || b) && (
        <div className="animate-fade-in">
          {/* headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end pb-3 border-b border-border">
            {[a, b].map((c, i) => (
              <div key={i} className={i === 1 ? 'text-right' : ''}>
                {c ? (
                  <>
                    <div className="font-display text-lg font-bold" style={{ color: CLASS_COLORS[c.class] }}>{c.name}</div>
                    <div className="font-mono text-xs text-faint">{c.realm} · {c.active_spec_name} {c.class}</div>
                    <div className={`font-display text-3xl font-bold mt-1 ${scoreColor(scoreOf(c))}`}>{scoreOf(c).toFixed(0)}</div>
                    <div className="font-mono text-xs text-muted">{c.gear?.item_level_equipped ?? '—'} ilvl</div>
                  </>
                ) : <div className="font-mono text-sm text-faint">—</div>}
                {i === 0 && <></>}
              </div>
            ))}
            <div className="text-center font-display text-faint text-sm pb-8">vs</div>
          </div>

          {/* per-dungeon */}
          <div className="divide-y divide-border/60">
            {dungeons.map((d) => {
              const ra = a && bestByDungeon(a, d.name);
              const rb = b && bestByDungeon(b, d.name);
              const la = ra?.mythic_level ?? 0;
              const lb = rb?.mythic_level ?? 0;
              return (
                <div key={d.id} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-1.5">
                  <span className={`font-mono text-sm text-right ${la >= lb && la > 0 ? 'text-gold-bright' : 'text-muted'}`}>
                    {ra ? `+${la}` : '—'}
                  </span>
                  <span className="text-xs text-faint w-36 text-center truncate">{d.short || d.name}</span>
                  <span className={`font-mono text-sm ${lb >= la && lb > 0 ? 'text-gold-bright' : 'text-muted'}`}>
                    {rb ? `+${lb}` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!a && !b && !error && (
        <p className="font-mono text-xs text-faint">Enter a character above to start. You can fill just one side too.</p>
      )}
    </div>
  );
}
