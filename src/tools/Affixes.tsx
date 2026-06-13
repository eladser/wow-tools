import { useSeason, useLiveAffix } from '@/lib/content';
import { safeUrl } from '@/lib/raiderio';
import { RefSection, RefTable, Hint } from '@/components/ui';

export function Affixes() {
  const s = useSeason();
  const live = useLiveAffix();
  const week = s.currentWeek();

  return (
    <div className="space-y-6 max-w-3xl">
      <Hint>
        The affixes in play right now, pulled live. The higher your key, the more stack on top — the table below shows
        what kicks in at each level.
      </Hint>
      <div className="border border-border rounded-lg bg-elevated/40 px-5 py-4">
        <div className="font-mono text-xs text-faint mb-2">week {week} of {s.season.name}</div>
        {live ? (
          <>
            <div className="font-display text-xl font-bold text-gold-bright mb-3">{live.title}</div>
            <div className="space-y-2.5">
              {live.affix_details.map((a) => (
                <div key={a.name} className="flex gap-3">
                  <img src={safeUrl(a.icon_url)} alt="" className="w-8 h-8 rounded border border-border-strong shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-fg">{a.name}</div>
                    <div className="text-sm text-muted leading-snug">{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="font-mono text-sm text-muted">Loading this week's affixes…</div>
        )}
      </div>

      <RefSection title="how the week scales">
        <RefTable rows={[
          ['+2 to +6', 'one seasonal Bargain'],
          ['+7 to +9', 'Bargain plus Fortified or Tyrannical (alternates weekly)'],
          ['+10 and up', 'Bargain plus both Fortified and Tyrannical'],
          ['+12 and up', "Xal'atath's Guile replaces the Bargain (each death costs 15s)"],
        ]} />
      </RefSection>
    </div>
  );
}
