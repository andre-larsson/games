import './App.css'
import { games } from './games.js'

const MAIN_MENU_URL = 'https://andre-larsson.github.io/'

function ArrowLeft() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M9.5 3.5 5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M6 4h6v6M12 4l-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The whole card opens the game without nesting links: the Play link's
// ::after stretches over the card, and the Source link sits above it.
function GameCard({ game, index }) {
  return (
    <article className="game-card">
      <div className="game-cover">
        <img
          src={game.cover}
          alt={game.coverAlt}
          width="1040"
          height="585"
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <div className="game-body">
        <div className="game-heading">
          <h2 className="game-title">{game.title}</h2>
          <p className="game-genre">{game.genre}</p>
        </div>
        <p className="game-pitch">{game.pitch}</p>
        <div className="game-actions">
          <a className="game-play" href={game.playUrl}>
            <PlayIcon />
            Play<span className="sr-only"> {game.title}</span>
          </a>
          <a className="game-source" href={game.sourceUrl}>
            Source<span className="sr-only"> code for {game.title}</span>
            <ExternalIcon />
          </a>
        </div>
      </div>
    </article>
  )
}

function App() {
  return (
    <main className="page">
      <div className="shell">
        <header className="hero-panel">
          <a className="back-link" href={MAIN_MENU_URL}>
            <ArrowLeft />
            Main menu
          </a>
          <div className="hero-copy">
            <h1>Games</h1>
            <p className="subtitle">Small browser games.</p>
          </div>
        </header>

        <section className="menu-panel" aria-labelledby="library-heading">
          <div className="menu-header">
            <span className="menu-kicker" id="library-heading">Library</span>
            <p>Select a game.</p>
          </div>

          <div className="games">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </section>

        <footer className="footer-note">
          <p>Each game runs in the browser, on desktop and phone.</p>
        </footer>
      </div>
      <div className="scanlines" aria-hidden="true" />
      <div className="orbs" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
    </main>
  )
}

export default App
