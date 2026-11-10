# Working notes

Notes for whoever picks this up next. The player-facing description is in `README.md`.

## What this is

A one-page hub at `/games/` that links to each browser game. It is the "Games" entry for the root site
(andre-larsson.github.io, the user's project index). The games themselves live in their own repos and
Pages sites; this repo holds only the page, the covers and two small dev tools.

It was made in November 2026, at the same time as the first "final" versions of the two games:

- **Menhir** (puzzle). A push-puzzle with tipping standing stones, dominoes, frost and sun-marked stones:
  twelve islands, with par set by a solver. It merges two earlier prototypes, an earlier *Menhir* and a
  sister game, *Tipstone*, into one build.
- **Brinelight** (roguelike deckbuilder). One run is about 11 map stops and 15 to 25 minutes. The central
  mechanic is a Tide gauge that Crests (damage to all enemies) or hits Low Water (Ward).

Both games are plain static HTML/JS with synthesized audio and generated illustrations. Both are expected
to keep changing; the hub only needs updating when a game's title, pitch, art or URL changes.

## Status

- Built and checked locally. **Not yet published**: the `games` repo, its Pages setup and the root-site
  link are still to do.
- The Play links point at `https://andre-larsson.github.io/menhir/` and `.../brinelight/`. They work only
  once those two repos are deployed.
- Suggested root-site entry (in the root site's `src/App.jsx` `projects` array), once this page is live:
  `{ href: 'https://andre-larsson.github.io/games/', title: 'Games', description: 'Small browser games: Menhir and Brinelight.', type: 'Games' }`

## Decisions

### Confirmed by the user

- There is a separate games page, linked from the root site's list of projects.
- It includes the final versions of Menhir and Brinelight.

### Set by the plan (not discussed with the user)

- Own repo `games`, a Vite + React project site with `base: "/games/"`, following the root site's guide
  for new project pages. The CI workflow uses the same action versions as the root site.
- One card per game, built from a data array (`src/games.js`). Each card has a cover, title, genre,
  a short pitch, a prominent Play link and a quieter Source link, and the whole card is clickable.
- Genres: Menhir "Puzzle", Brinelight "Roguelike deckbuilder". Play and source URLs as in `src/games.js`.
- Covers come from each game's own art.

### Provisional taste calls (each can be changed or undone on its own)

1. **Look copied from the root site.** Same panel gradient and border, radii, Oxanium/Rajdhani fonts,
   scanlines and floating orbs. CSS is duplicated rather than shared, since the two are separate repos.
2. **Hero on one row on desktop**: "GAMES" and its subtitle on the left, the "Main menu" pill on the
   right. On phones (≤720px) the pill sits above the title. This keeps the whole library inside a
   1280×800 window.
3. **Smaller h1 than the root site** (max 4.4rem rather than 5.6rem), so the games, not the header, are the focus.
4. **"Library / Select a game."** as the panel header, mirroring the root's "Projects / Select a project."
5. **16:9 covers.** Menhir uses its title painting, uncropped. Brinelight uses its title-screen background
   (a lighthouse keeper with a lantern above a drowned bell), chosen over the event scenes and creature art
   because it shows the whole premise. That crop cuts off the tip of the bell's clapper at the bottom edge.
6. **Play** is a filled cyan pill, the only filled button on the site. **Source** is an uppercase text link
   with a ↗ arrow. On phones (≤480px) Play stretches to fill the row.
7. **The genre sits above the title** as a small uppercase label. In the source it comes after the h2, so
   heading navigation reads the title first.
8. **Whole-card click** works through a "stretched link": the Play link's `::after` covers the card, and
   Source sits above it. A side effect is that card text can't be selected with the mouse.
9. **Hover and keyboard focus** lift the card by 4px, brighten its border and zoom the cover by 3.5%.
   `prefers-reduced-motion` turns the movement off (the root site doesn't do this).
10. **Copy.** Footer: "Each game runs in the browser, on desktop and phone." The pitches follow each game's
    README: Menhir's premise and its three mechanics, and Brinelight's premise and the Tide.
11. **Card order**: Menhir, then Brinelight.
12. **Toolchain**: the root site's package ranges and lockfile, with `npm audit fix` applied (Vite 7,
    React 19, ESLint 9), rather than a fresh `npm create vite` (Vite 8). CI also runs `npm run lint`,
    which the root site's workflow doesn't.
13. These notes are in `NOTES.md` rather than `GAME_NOTES.md`, since this repo isn't a game.

## Measurements (local build, November 2026)

- **Covers**: 1040×585 WebP, quality 85, about 2× the desktop display size (521×293).
  - Menhir: 72 KB, from the 1672×941 title painting, cropped to 1672×940.
  - Brinelight: 70 KB, from the 1536×1024 title background, cropped to 16:9 starting 4px from the top.
  - Both reproduce byte for byte with `tools/make-cover.py` (Brinelight with `--top 4`).
- **Build**: JS 197 KB (62 KB gzip; almost all of it is React), CSS 7 KB, HTML 0.6 KB. Fonts load from
  Google Fonts, as on the root site.
- **1280×800**: the hero is 148px tall, and the whole library panel fits on screen. The Play buttons end at
  y=759. Page height is 891px; only the footer note is below the fold.
- **390×844**: 16px gutters. The first card's Play button ends at y=701, and the second card's cover
  shows at the bottom as a hint to scroll. Page height is 1309px. Play, Source and Main menu are each 44px tall.
- **Two columns** from about 690px wide; one column below that. There is no horizontal scroll at 320, 390,
  600, 760, 1024, 1280 or 1920px.

## Tools

- `tools/check-page.mjs` drives headless Chrome over its DevTools protocol (Node 22+, no npm dependencies).
  It takes desktop and phone screenshots plus hover and focus states. It fails on horizontal scroll,
  nested links, a cover that doesn't load, a card whose cover or pitch doesn't open its own game, or a
  Source link that the card covers. It expects the preview server to be running (see `AGENTS.md`).
  Screenshots go in `shots/`, which is git-ignored.
- `tools/make-cover.py` crops to 16:9 (centred, or `--top N`), resizes to 1040×585 and writes WebP.
  The current covers were made from Menhir's full-size title painting (`assets-src/title.png` in its repo)
  and Brinelight's `img/bg/bg_title.webp`.

## Open questions

- **More games.** The grid fits as many columns of at least 19rem as there is room for: one card fills the
  full width, three sit in a row, and four would leave one card alone on the second row. Revisit the
  layout (a fixed two columns, or a featured first card) when there are more than three games.
- **More facts per card**, such as "12 islands", "15–25 minute runs" or "keyboard, mouse and touch". These
  were left out to keep the cards short.
- **Social preview.** There is no `og:image` or `og:description` yet.
- **React.** It is most of the page weight, for what is a static list. It was kept because the site guide
  asks for Vite + React project pages.
- **Root-site card.** The root site has no "Games" type yet; the suggested entry above uses type "Games".
