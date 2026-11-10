# AGENTS.md instructions for games

<INSTRUCTIONS>
- Primary goal: "Games" hub page that lists the browser games, published at https://andre-larsson.github.io/games/ and linked from the root site.
- Repository: project GitHub Pages site (Vite + React, `base: "/games/"`). Each game lives in its own repo; this one only links to them.
- Build: `npm run build` (output in `dist/`).
- Lint: `npm run lint`.
- Preview/dev: `npm run dev`; `npm run preview` serves the build at http://localhost:4173/games/.
- Tests: No unit tests. Page check: with the preview running, `node tools/check-page.mjs http://localhost:4173/games/ shots` (headless Chrome; desktop and phone screenshots, fails on horizontal scroll, nested links, broken covers or cards that don't open their game). Look at the screenshots.
- Adding a game: `python3 tools/make-cover.py <art> src/assets/<name>-cover.webp`, then one entry in `src/games.js`.
- Look: keep panels, palette, fonts and background effects in step with the root site (andre-larsson.github.io). Work at 390px and 1280px wide.
- Deploy: `.github/workflows/pages.yml` lints, builds and deploys `dist/` on push to `main`.
- Notes: decisions, provisional calls, measurements and open questions are in `NOTES.md`.
- For game design or iteration work, follow the game-iteration skill.
</INSTRUCTIONS>
