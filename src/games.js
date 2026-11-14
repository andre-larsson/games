import menhirCover from './assets/menhir-cover.webp'
import brinelightCover from './assets/brinelight-cover.webp'
import perMyLastRequestCover from './assets/per-my-last-request-cover.webp'

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
  {
    id: 'per-my-last-request',
    title: 'Per My Last ReQuest',
    genre: 'Prompt-writing tactics',
    pitch:
      "Write the standing orders for a sellsword who follows them to the letter. A small language model runs in your browser and plays the hero; rewrite the orders until the guild's training trial comes home alive.",
    playUrl: 'https://a403.space/per-my-last-request/',
    sourceUrl: 'https://github.com/andre-larsson/per-my-last-request',
    cover: perMyLastRequestCover,
    coverAlt: "A scarred sellsword with a sword on one shoulder, chewing a grass stalk and holding a crumpled page of orders at arm's length.",
  },
]
