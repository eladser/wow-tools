/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_SEASON, type SeasonData, type Dungeon,
  currentWeekOf, rotationForWeekOf, conquestCapOf,
} from '@/data/season';
import { fetchStaticData, fetchAffixes, type AffixWeek } from '@/lib/raiderio';

export interface NewsItem {
  date: string;
  tag: string;
  title: string;
  body: string;
}

export interface Notice {
  text: string;
  tone?: 'info' | 'warn';
}

// Shape of public/content.json. Every field optional; missing means "use bundled".
interface ContentFile {
  updated?: string;
  notice?: Notice | null;
  news?: NewsItem[];
  // partial override of any season slice, applied over the bundled baseline
  seasonPatch?: Partial<SeasonData>;
}

interface SeasonApi extends SeasonData {
  currentWeek: (now?: Date) => number;
  rotationForWeek: (week: number) => SeasonData['weekRotation'][number];
  conquestCap: (now?: Date) => number;
}

interface ContentValue {
  season: SeasonApi;
  news: NewsItem[];
  notice: Notice | null;
  updated: string | null;
  liveAffix: AffixWeek | null;
}

function bind(data: SeasonData): SeasonApi {
  return {
    ...data,
    currentWeek: (now) => currentWeekOf(data, now),
    rotationForWeek: (week) => rotationForWeekOf(data, week),
    conquestCap: (now) => conquestCapOf(data, now),
  };
}

const DEFAULT_VALUE: ContentValue = {
  season: bind(DEFAULT_SEASON),
  news: [],
  notice: null,
  updated: null,
  liveAffix: null,
};

const Ctx = createContext<ContentValue>(DEFAULT_VALUE);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ContentValue>(DEFAULT_VALUE);

  useEffect(() => {
    let alive = true;

    // Three sources, layered: bundled baseline < live raider.io < content.json
    // patch (manual override always wins). Every source is optional.
    const content = fetch(`${import.meta.env.BASE_URL}content.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? (r.json() as Promise<ContentFile>) : null))
      .catch(() => null);
    const live = fetchStaticData(DEFAULT_SEASON.season.expansionId).catch(() => null);
    const affixes = fetchAffixes('us').catch(() => null);

    Promise.all([content, live, affixes]).then(([c, s, a]) => {
      if (!alive) return;

      let data: SeasonData = DEFAULT_SEASON;

      // live raider.io: real dungeon pool (timers, icons) + season start/slug/name
      if (s) {
        const dungeons: Dungeon[] = s.dungeons.map((d) => ({
          id: d.slug,
          name: d.name,
          short: d.short_name,
          timerMin: d.keystone_timer_seconds / 60,
          iconUrl: d.icon_url,
          bgUrl: d.background_image_url,
        }));
        data = {
          ...data,
          dungeons,
          season: {
            ...data.season,
            slug: s.slug,
            name: s.name,
            startUsIso: s.starts?.us ?? data.season.startUsIso,
          },
        };
      }

      // manual content.json patch overrides anything above
      if (c?.seasonPatch) data = { ...data, ...c.seasonPatch } as SeasonData;

      setValue({
        season: bind(data),
        news: c?.news ?? [],
        notice: c?.notice ?? null,
        updated: c?.updated ?? null,
        liveAffix: a ?? null,
      });
    });

    return () => { alive = false; };
  }, []);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSeason = () => useContext(Ctx).season;
export const useNews = () => useContext(Ctx).news;
export const useNotice = () => useContext(Ctx).notice;
export const useLiveAffix = () => useContext(Ctx).liveAffix;
