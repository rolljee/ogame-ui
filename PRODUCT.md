# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Active OGame players, mostly French-speaking, who keep OGame Tools open in a
browser tab next to the game. They come in for a quick, precise answer in the
middle of a play session: how much they get from a trade, whether a moonbreak is
worth it, what an expedition will bring back, whether a moon spot is free, who a
player or alliance is. They know the game well and use its own vocabulary (RIP,
DM, moonbreak, expé…).

Primary device is desktop, a wide screen shared with the OGame tab. Mobile must
work, but it comes second.

## Product Purpose

A fan-made toolbox of calculators and lookups for OGame, bilingual FR / EN.
Success means a player gets a trustworthy number or answer in seconds, without
reading a manual, and goes back to the game.

## Positioning

The game formulas come from `ogamejs`, the same library behind the sibling
`og-bot-discord` bot, so the web tools and the bot give the same answers. Live
universe data (players, alliances, galaxy, server settings) comes from
Gameforge's public API through a project-owned Cloudflare Worker proxy, so
lookups run on real data for the chosen universe.

## Operating Context

- Used alongside the live game, often for one quick calculation, then closed or
  left in a background tab.
- The player picks a universe (server number + language) for the data-backed
  views.
- Results are often copied and pasted back into the game or into a Discord or
  alliance chat (the trader has a "copy summary" action).

## Capabilities and Constraints

Current tools (all kept through any redesign):

- **Commerce / Trade**: convert one resource into the two others at a given rate
  and split.
- **Destruction de lune / Moonbreak**: odds and losses of destroying a moon with
  Deathstars.
- **Expéditions**: expected expedition outcome for a fleet.
- **Verrou de lune / Moon lock**: moon availability for coordinates.
- **Joueurs / Players**, **Alliances**: search and detail views on live API data.
- **Carte de la galaxie / Galaxy map**: heatmap of where a universe lives.
- **Réglages serveur / Server settings**: universe settings from `serverData.xml`.

Constraints:

- React 19 + Vite + Sass, no CSS framework. Static site on GitHub Pages at
  `ogame.rolljee.fr`. The data proxy is a Cloudflare Worker (`worker/`).
- Every user-facing string goes through the FR / EN i18n layer
  (`src/i18n/translations.js`). French is the default.
- Gameforge's API has no CORS, so every live-data request goes through the Worker.
- The moonbreak loss model has two approximations kept on purpose.

## Brand Commitments

- Name: "OGame Tools". It is fan-made and must say so; it links to OGame and is
  not affiliated with Gameforge.
- Voice: informal French ("tu"), plain and helpful. Jargon is fine where players
  use it, but every input is explained in one short sentence.
- Has its own favicon and app icon (`public/`). They are not the author's blog
  icons.
- A "support" link to buymeacoffee.com/rolljee sits in the footer.

## Evidence on Hand

- Real formulas and their tests in each tool folder (`src/*/formulas.js`).
- Live data from the public Gameforge API for real universes (for example
  s172-fr).
- No user analytics, testimonials or usage numbers. Never invent any.

## Product Principles

1. The answer first. Each tool leads to its result with as little input as
   possible, and the result is the most visible thing on screen.
2. Trustworthy numbers. Show the inputs and assumptions behind a result, and
   flag invalid input clearly instead of returning a silent zero.
3. Built for a quick visit. Sensible defaults, remembered choices and instant
   recalculation, with no submit steps that aren't needed.
4. Bilingual by construction. FR and EN reach full parity, and no layout breaks
   on the longer French strings.
5. Honest fan tool. Never pretend to be official, and never invent data.
