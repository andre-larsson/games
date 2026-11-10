import menhirCover from './assets/menhir-cover.webp'
import brinelightCover from './assets/brinelight-cover.webp'

// One entry per game, shown in this order. To add a game, put a 16:9 WebP
// cover (1040×585, under ~100 KB) in src/assets, import it above, and add
// an entry below. Nothing else needs to change.
export const games = [
  {
    id: 'menhir',
    title: 'Menhir',
    genre: 'Puzzle',
    pitch:
      'A push-puzzle on walled islands at twilight. As a keeper with a lantern, tip standing stones onto their sockets, knock them over like dominoes and slide them across frost.',
    playUrl: 'https://andre-larsson.github.io/menhir/',
    sourceUrl: 'https://github.com/andre-larsson/menhir',
    cover: menhirCover,
    coverAlt: 'A hooded keeper with a lantern among standing stones on a walled island at dusk.',
  },
  {
    id: 'brinelight',
    title: 'Brinelight',
    genre: 'Roguelike deckbuilder',
    pitch:
      'As Wren, the last lighthouse keeper, dive through the Drowned Reach to take back the sunken light. Raise the Tide with your cards until it crests over every enemy.',
    playUrl: 'https://andre-larsson.github.io/brinelight/',
    sourceUrl: 'https://github.com/andre-larsson/brinelight',
    cover: brinelightCover,
    coverAlt: 'A keeper with a lantern on a lighthouse rock, above a great bell sunk in the sea.',
  },
]
