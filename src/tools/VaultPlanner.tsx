import { useState } from 'react';
import { useSeason } from '@/lib/content';
import { Bench, PaneLabel, Field, Row, RefSection, RefTable, Hint } from '@/components/ui';

function vaultForKey(level: number): { ilvl: number; track: string } {
  if (level >= 10) return { ilvl: 272, track: 'Myth 1/6' };
  if (level >= 7) return { ilvl: 269, track: 'Hero 4/6' };
  if (level >= 6) return { ilvl: 266, track: 'Hero 3/6' };
  if (level >= 4) return { ilvl: 263, track: 'Hero 2/6' };
  if (level >= 2) return { ilvl: 259, track: 'Hero 1/6' };
  return { ilvl: 256, track: 'Champion 4/6' };
}

export function VaultPlanner() {
  const { mplusRewards: MPLUS_REWARDS, raidRewards: RAID_REWARDS } = useSeason();
  // the three M+ slots come from your 1st, 4th, and 8th highest keys of the week
  const [keys, setKeys] = useState('10, 10, 9, 8');

  const levels = keys.split(/[,\s]+/).map(k => parseInt(k)).filter(n => !isNaN(n) && n >= 2).sort((a, b) => b - a);
  const slots = [levels[0], levels[3], levels[7]].map(l => l !== undefined ? vaultForKey(l) : null);
  const slotLabels = ['1 run', '4 runs', '8 runs'];

  return (
    <>
    <div className="mb-5">
      <Hint>
        Type the key levels you finished this week, separated by commas (timed or not, finishing is what counts).
        It shows the three Great Vault rewards you'll get to choose from.
      </Hint>
    </div>
    <Bench
      left={
        <>
          <PaneLabel>your keys this week</PaneLabel>
          <Row>
            <Field label="Levels" grow>
              <input
                type="text"
                value={keys}
                onChange={(e) => setKeys(e.target.value)}
                placeholder="10, 10, 9, 8, 7"
                className="field-input"
              />
            </Field>
          </Row>
          <p className="font-mono text-xs text-faint">
            Comma-separated key levels you completed (timed or not — completion is what counts for the vault).
            Slots unlock at 1, 4, and 8 dungeons; each slot rewards based on your Nth-highest run.
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>mythic+ vault slots</PaneLabel>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s, i) => (
              <div key={i} className={`border rounded-lg px-3 py-3 text-center ${s ? 'border-accent/40 bg-surface' : 'border-dashed border-border'}`}>
                <div className="font-mono text-[11px] uppercase tracking-wider text-faint mb-1">{slotLabels[i]}</div>
                {s ? (
                  <>
                    <div className="font-display text-xl font-bold text-epic">{s.ilvl}</div>
                    <div className="font-mono text-xs text-muted">{s.track}</div>
                  </>
                ) : (
                  <div className="font-mono text-xs text-faint pt-1.5">locked</div>
                )}
              </div>
            ))}
          </div>
        </>
      }
    />
    <RefSection title="m+ reward table">
      <RefTable rows={MPLUS_REWARDS.map(r => [
        r.level,
        `end ${r.endIlvl} (${r.endTrack}) · vault ${r.vaultIlvl} (${r.vaultTrack})`,
      ])} />
    </RefSection>
    <RefSection title="raid drops">
      <RefTable rows={[
        ...RAID_REWARDS.heroic.map(r => [`Heroic · ${r.bosses}`, `${r.ilvl} (${r.track})`] as [string, string]),
        ...RAID_REWARDS.mythic.map(r => [`Mythic · ${r.bosses}`, `${r.ilvl} (${r.track})`] as [string, string]),
      ]} />
    </RefSection>
    </>
  );
}
