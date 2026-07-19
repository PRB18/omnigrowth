import { Link } from 'react-router-dom'
import './App.css'

// In-app marketing landing at /. Public prototype at /3pm_krishna/index.html is separate.

export default function App() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-mark" aria-hidden>O</div>
          <span>Omni<span className="accent">Growth</span></span>
        </div>
        <div className="landing-nav-links">
          <Link to="/app/prices" className="btn-ghost hide-mobile">MSP Prices</Link>
          <Link to="/app/login" className="btn-ghost">Sign In</Link>
          <Link to="/app" className="btn-primary">Open Map</Link>
        </div>
      </nav>

      <section className="hero">
        <p className="hero-brand">OmniGrowth</p>
        <h1 className="hero-title">
          Right produce.<br />
          Right market.<br />
          <span className="gradient-text">Right time.</span>
        </h1>
        <p className="hero-sub">
          Agricultural intelligence across every Indian state and district — MSP, APMC rates, and dealer discovery on one map.
        </p>
        <div className="hero-actions">
          <Link to="/app" className="btn-primary">Explore the map</Link>
          <Link to="/app/prices" className="btn-ghost">View MSP prices</Link>
        </div>
      </section>

      <section className="map-invite">
        <div className="map-invite-copy">
          <h2>The map is the product</h2>
          <p>
            Click a state, drill into a district, and read crops, soil, and government price signals without leaving the canvas.
          </p>
          <Link to="/app" className="btn-primary">Open interactive map</Link>
        </div>
      </section>
    </div>
  )
}
