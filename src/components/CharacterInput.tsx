import { useState } from 'react';
import { Row } from '@/components/ui';
import { parseCharacterInput } from '@/lib/raiderio';
import { recentChars, type CharRef } from '@/lib/recent';

export function CharacterInput({ onLookup, busy }: {
  onLookup: (c: CharRef) => void;
  busy: boolean;
}) {
  const [input, setInput] = useState('');
  const [region, setRegion] = useState('us');
  const recent = recentChars();

  const go = () => {
    const parsed = parseCharacterInput(input);
    if (!parsed.name) return;
    onLookup({
      region: parsed.region ?? region,
      realm: parsed.realm ?? '',
      name: parsed.name,
    });
  };

  return (
    <div className="space-y-2">
      <Row>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="field-select">
          {['us', 'eu', 'kr', 'tw'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
          placeholder="Name-Realm, or paste a raider.io link"
          className="field-input flex-1"
        />
        <button onClick={go} disabled={busy} className="btn-primary">
          {busy ? 'Looking up' : 'Look up'}
        </button>
      </Row>
      {recent.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
          <span className="text-faint">recent:</span>
          {recent.map((c) => (
            <button
              key={`${c.region}/${c.realm}/${c.name}`}
              onClick={() => onLookup(c)}
              className="px-2 py-0.5 border border-border rounded text-muted hover:text-fg hover:border-border-strong transition-colors"
            >
              {c.name}-{c.realm}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
