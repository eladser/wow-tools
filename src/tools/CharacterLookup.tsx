import { useState } from 'react';
import { fetchCharacter, safeUrl, type CharacterProfile } from '@/lib/raiderio';
import { CharacterInput } from '@/components/CharacterInput';
import { Hint } from '@/components/ui';
import { rememberChar, type CharRef } from '@/lib/recent';
import { scoreColor, CLASS_COLORS } from '@/lib/colors';

function ms(msVal: number): string {
  const s = Math.floor(msVal / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function CharacterLookup() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [char, setChar] = useState<CharacterProfile | null>(null);

  const lookup = async (c: CharRef) => {
    setBusy(true);
    setError('');
    try {
      const profile = await fetchCharacter(c.region, c.realm, c.name);
      setChar(profile);
      rememberChar({ region: c.region, realm: profile.realm.toLowerCase().replace(/\s+/g, '-'), name: profile.name });
    } catch (e) {
      setChar(null);
      setError(e instanceof Error ? e.message : 'Lookup failed');
    } finally {
      setBusy(false);
    }
  };

  const score = char?.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0;
  const runs = [...(char?.mythic_plus_best_runs ?? [])].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5 max-w-4xl">
      <Hint>
        Type a character as <span className="text-fg">Name-Realm</span> (like Thrall-Area 52) or paste their
        raider.io link, then hit Look up. You'll get their current-season M+ score, item level, and best key in each dungeon.
      </Hint>
      <CharacterInput onLookup={lookup} busy={busy} />
      {error && <p className="font-mono text-xs text-bad">{error}</p>}

      {char && (
        <div className="animate-fade-in space-y-5">
          <div className="flex items-center gap-4 border border-border rounded-lg bg-surface px-4 py-3">
            <img src={safeUrl(char.thumbnail_url)} alt="" className="w-12 h-12 rounded border border-border-strong" />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-display text-lg font-bold" style={{ color: CLASS_COLORS[char.class] }}>
                  {char.name}
                </span>
                <span className="text-sm text-muted">{char.realm} · {char.active_spec_name} {char.class}</span>
              </div>
              <div className="font-mono text-xs text-faint mt-0.5">
                {char.gear?.item_level_equipped ? `${char.gear.item_level_equipped} ilvl · ` : ''}
                <a href={safeUrl(char.profile_url)} target="_blank" rel="noopener noreferrer" className="hover:text-accent">raider.io profile</a>
              </div>
            </div>
            <div className={`ml-auto font-display text-3xl font-bold ${scoreColor(score)}`}>
              {score.toFixed(0)}
            </div>
          </div>

          {runs.length > 0 && (
            <div className="divide-y divide-border/60 border-y border-border">
              <div className="flex items-baseline gap-4 py-2 px-1 font-mono text-[11px] uppercase tracking-wider text-faint">
                <span className="w-44 shrink-0">best run</span>
                <span className="w-12 text-right">key</span>
                <span className="w-16 text-right">time</span>
                <span className="w-12 text-right">chests</span>
                <span className="w-14 text-right">points</span>
              </div>
              {runs.map((r) => (
                <div key={r.dungeon} className="flex items-baseline gap-4 py-2 px-1">
                  <a href={safeUrl(r.url)} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-fg w-44 shrink-0 truncate hover:text-accent transition-colors">
                    {r.dungeon}
                  </a>
                  <span className={`font-mono text-sm w-12 text-right ${r.num_keystone_upgrades > 0 ? 'text-fg' : 'text-bad'}`}>
                    +{r.mythic_level}
                  </span>
                  <span className="font-mono text-sm text-muted w-16 text-right">{ms(r.clear_time_ms)}</span>
                  <span className="font-mono text-sm text-muted w-12 text-right">
                    {r.num_keystone_upgrades > 0 ? '+'.repeat(r.num_keystone_upgrades) : 'over'}
                  </span>
                  <span className={`font-mono text-sm w-14 text-right ${scoreColor(r.score * 8)}`}>
                    {r.score.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
