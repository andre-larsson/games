# Games

Small browser games, collected on one page: **<https://andre-larsson.github.io/games/>**

| Game | Genre | What it is |
| --- | --- | --- |
| [Menhir](https://andre-larsson.github.io/menhir/) ([source](https://github.com/andre-larsson/menhir)) | Puzzle | A push-puzzle on walled islands at twilight. Tip standing stones onto their sockets, knock them over like dominoes and slide them across frost. |
| [Brinelight](https://andre-larsson.github.io/brinelight/) ([source](https://github.com/andre-larsson/brinelight)) | Roguelike deckbuilder | Dive through the Drowned Reach as the last lighthouse keeper, and raise the Tide with your cards until it crests over every enemy. |

Each game runs in the browser, on desktop and phone. There is nothing to install.

This page is part of [andre-larsson.github.io](https://andre-larsson.github.io/).

## Running the page locally

It is a small Vite + React site. With Node 22 or newer:

```sh
npm install
npm run dev        # dev server with hot reload
npm run build      # production build into dist/
npm run preview    # serve the build at http://localhost:4173/games/
npm run lint
```

## Adding a game

1. Make a 16:9 cover from the game's own art (needs Python with Pillow):
   `python3 tools/make-cover.py path/to/art.png src/assets/<name>-cover.webp`
2. Add one entry to `src/games.js` (title, genre, pitch, play and source links, cover, alt text).
3. `npm run lint && npm run build`, then push to `main`. The Pages workflow deploys it.
