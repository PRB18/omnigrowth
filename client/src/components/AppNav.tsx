import { Link } from 'react-router-dom'

type AppNavProps = {
  active?: 'map' | 'prices' | 'dealers' | 'login' | 'register'
}

export function AppNav({ active }: AppNavProps) {
  return (
    <nav className="app-nav">
      <Link to="/" className="nav-logo">
        <div className="logo-mark" aria-hidden>O</div>
        <span>Omni<span className="accent">Growth</span></span>
      </Link>
      <div className="app-nav-links">
        <Link to="/app" className={`btn-ghost${active === 'map' ? ' is-active' : ''}`}>Map</Link>
        <Link to="/app/prices" className={`btn-ghost hide-sm${active === 'prices' ? ' is-active' : ''}`}>Prices</Link>
        <Link to="/app/dealers" className={`btn-ghost hide-sm${active === 'dealers' ? ' is-active' : ''}`}>Dealers</Link>
        {active === 'login' || active === 'register' ? null : (
          <Link to="/app/login" className="btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  )
}
