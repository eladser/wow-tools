# Changelog

## 2.0.0 — 2026-06-13

Rebuilt from scratch. The old version was a Next.js app with server API routes that did not run on static hosting.

### Added
- Mythic+: character lookup, score planner, two-character compare, live title cutoff, affix schedule, key score calculator, dungeon timers.
- Raid: Great Vault planner, Dawncrest upgrade calculator, reset countdowns, raid buff coverage matrix, weekly checklist that clears at reset.
- PvP: rating milestones and conquest cap tracker.
- Live fetch from raider.io for the dungeon pool, par timers, season name and start date, and the current week's affixes, so these update themselves on a season roll.
- Home page with category halls and a Dispatches news feed.
- `content.json` for updating news, notices, and season data without a rebuild. Bundled data is the fallback (see UPDATING.md).
- Each tool opens with a one-line "what to do" prompt.
- Installable as an offline app (PWA).

### Changed
- React, Vite, TypeScript, Tailwind. No backend.
- Midnight Season 1 data: eight-dungeon pool, Dawncrest upgrades, Xal'atath's Bargain affixes.
- Score planner derives points-per-key-level from your own runs, so it tracks the live scoring curve instead of a fixed formula.

### Removed
- The Next.js app and its API routes.
- WarcraftLogs integration (required server-side auth).
