<p align="center">
  <img src="public/icon-192.png" alt="" width="96">
</p>

# WoW Tools

Mythic+, raid, and PvP utilities for the current World of Warcraft season. Runs in the browser, no install, no account.

**[eladser.github.io/wow-tools](https://eladser.github.io/wow-tools/)**

## Tools

**Mythic+** — Character lookup (score, gear, best run per dungeon, live from raider.io), a score planner that reads your runs and picks the cheapest keys toward a target, a two-character compare, the live title cutoff for your region, the affix schedule, a key score calculator, and dungeon timers.

**Raid** — Great Vault planner (enter your keys, see your three slots), the Dawncrest upgrade calculator, reset countdowns, a raid buff coverage matrix you build from a roster, and a weekly checklist that resets itself.

**PvP** — Rating milestones and what each bracket unlocks, plus the weekly conquest cap.

The character pool, dungeon timers, affixes, score, and cutoff come from the public raider.io API. Reward and rating tables are bundled. Everything else is computed locally.

## Staying current

Season data lives in one file with two update paths: a `content.json` for fast changes (news, notices, mid-season hotfixes) that needs no rebuild, and the bundled `season.ts` for a full season roll. See [UPDATING.md](UPDATING.md).

## Development

```bash
git clone https://github.com/eladser/wow-tools.git
cd wow-tools
npm install
npm run dev      # localhost:3002
npm run build
npm run lint
```

React 19, Vite 8, Tailwind 4, TypeScript. No runtime dependencies beyond React.

Not affiliated with Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.

## License

MIT
