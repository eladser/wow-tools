# Updating

Two kinds of change, two paths.

## Fast: edit `public/content.json`, push

No code, no version bump. Pages redeploys in about a minute. The app fetches this
file at load and falls back to the bundled data if it's missing or broken, so a
typo can't take the site down (the worst case is the old data stays).

`content.json` fields, all optional:

- **`news`**: the Dispatches list on the home page. Newest first.
  ```json
  { "date": "2026-07-01", "tag": "Season", "title": "...", "body": "..." }
  ```
- **`notice`**: a one-line banner under the hero. Set to `null` to hide.
  ```json
  { "text": "Season 2 begins next reset.", "tone": "warn" }
  ```
- **`seasonPatch`**: override any slice of the season data without a rebuild.
  Each key replaces that whole slice. Use for mid-season hotfixes, e.g. a timer
  change:
  ```json
  { "seasonPatch": { "dungeons": [ { "id": "...", "name": "...", "short": "...", "timerMin": 29 } ] } }
  ```
  Patchable slices: `season`, `dungeons`, `bargainDesc`, `weekRotation`,
  `tracks`, `crest`, `mplusRewards`, `raidRewards`, `pvp`, `resets`. Shapes are in
  `src/data/season.ts`.

## Full: new season

The dungeon pool, par timers, season name/start date, and the current week's
affixes all fetch live from raider.io, so they update themselves on a season roll
with no edit. What still needs a hand is the reward and rating tables raider.io
doesn't expose.

Edit `src/data/season.ts`, the single source of truth for the bundled data, then
bump the version and push. The checklist:

1. `SEASON`: `keystoneLegendScore` (the Score Planner default). `slug`, `name`, and `startUsIso` are auto-filled from raider.io; the bundled values are just the offline fallback.
2. `TRACKS`, `CREST`, `MPLUS_REWARDS`, `RAID_REWARDS`: reward item levels and upgrade costs.
3. `PVP`: conquest start/step and rating rewards.
4. `WEEK_ROTATION` / `BARGAIN_DESC`: only the fallback affix guess. The live affix feed overrides it, so this rarely matters.
5. `DUNGEONS`: only the offline-fallback pool. The live pool replaces it at runtime.
6. Reset `public/content.json` `news` with a season-launch entry and clear any stale `seasonPatch`.
7. Update the "Last verified" date comment at the top of `season.ts`.

The reward and PvP tables come from method.gg and the wowhead/icy-veins season
guides; raider.io provides the live character, score, cutoff, dungeon, and affix
data at runtime.
