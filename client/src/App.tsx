import { Link } from 'react-router-dom'
import './App.css'

// This component serves as the landing page at /
// The 3pm_krishna/index.html prototype is the real public landing page
// This React version is used when React handles routing from /

export default function App() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-icon">🌿</div>
          <span>Omni<span className="accent">Growth</span></span>
        </div>
        <div className="landing-nav-links">
          <Link to="/app/prices" className="btn-ghost hide-mobile">MSP Prices</Link>
          <Link to="/app/dealers" className="btn-ghost hide-mobile">Find Dealers</Link>
          <Link to="/app/login" className="btn-ghost">Sign In</Link>
          <Link to="/app/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="badge badge-green">🇮🇳 India's B2B Agri Platform</span>
        </div>
        <h1 className="hero-title">
          Right Produce.<br />
          Right Market.<br />
          <span className="gradient-text">Right Time.</span>
        </h1>
        <p className="hero-sub">
          OmniGrowth connects farmers, dealers, and buyers across every state and
          district in India — powered by live MSP data, APMC prices, and verified dealer networks.
        </p>
        <div className="hero-actions">
          <Link to="/app" className="btn-primary">Open Dashboard →</Link>
          <Link to="/app/dealers" className="btn-ghost">Browse Dealers</Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="stat-value accent">820+</div>
            <div className="stat-label">Districts Tracked</div>
          </div>
          <div className="hero-stat">
            <div className="stat-value" style={{color:'var(--blue)'}}>120+</div>
            <div className="stat-label">Crops Monitored</div>
          </div>
          <div className="hero-stat">
            <div className="stat-value gold">28</div>
            <div className="stat-label">States Covered</div>
          </div>
          <div className="hero-stat">
            <div className="stat-value" style={{color:'var(--purple)'}}>₹24MSP</div>
            <div className="stat-label">Price Intelligence</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="card feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const FEATURES = [
  { icon: '🗺️', title: 'Interactive India Map', desc: 'Click any state or district to get crop data, soil profiles, MSP rates, and APMC market prices.' },
  { icon: '₹', title: 'Live Price Intelligence', desc: 'Real MSP data from CACP + APMC market rates from Agmarknet — updated for every crop and region.' },
  { icon: '🤝', title: 'Verified Dealer Network', desc: 'Search 500+ verified dealers, aggregators, and exporters by crop, state, and quantity requirements.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track price trends, seasonal patterns, and regional demand shifts with interactive charts.' },
  { icon: '🚚', title: 'Logistics Partners', desc: 'Connect directly with Ninjacart, WayCool, Delhivery, and other top agri logistics providers.' },
  { icon: '🔒', title: 'Secure B2B Platform', desc: 'GSTIN-verified dealers, role-based access for farmers, dealers, and buyers. Enterprise-grade security.' },
]
