import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../index.css'

interface MSPEntry { msp: number; unit: string; season: string; year: string }
interface MSPData { [crop: string]: MSPEntry }

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Prices() {
  const [prices, setPrices] = useState<MSPData>({})
  const [season, setSeason] = useState<'All' | 'Kharif' | 'Rabi'>('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/prices/msp`)
      .then(r => r.json())
      .then(d => { if (d.success) setPrices(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = Object.entries(prices).filter(([crop, v]) => {
    const matchSeason = season === 'All' || v.season === season
    const matchSearch = crop.toLowerCase().includes(search.toLowerCase())
    return matchSeason && matchSearch
  })

  return (
    <div className="prices-page">
      <nav className="app-nav">
        <Link to="/" className="landing-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">🌿</div>
          <span>Omni<span className="accent">Growth</span></span>
        </Link>
        <div className="landing-nav-links">
          <Link to="/app" className="btn-ghost">Dashboard</Link>
          <Link to="/app/dealers" className="btn-ghost">Dealers</Link>
        </div>
      </nav>

      <div className="prices-content">
        <div className="prices-header">
          <h1 className="section-title">MSP Price Intelligence</h1>
          <p className="section-sub">Government Minimum Support Prices — CACP 2024-25 season</p>
        </div>

        <div className="prices-toolbar">
          <input
            className="form-input"
            placeholder="Search crop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <div className="season-tabs">
            {(['All', 'Kharif', 'Rabi'] as const).map(s => (
              <button
                key={s}
                className={season === s ? 'btn-primary' : 'btn-ghost'}
                onClick={() => setSeason(s)}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="prices-loading">Loading price data...</div>
        ) : (
          <div className="prices-grid">
            {filtered.map(([crop, data]) => (
              <div className="price-card card" key={crop}>
                <div className="price-crop">{crop}</div>
                <div className="price-msp">₹{data.msp.toLocaleString('en-IN')}<span className="price-unit">/{data.unit.replace('₹/', '')}</span></div>
                <div className="price-footer">
                  <span className={`badge ${data.season === 'Kharif' ? 'badge-green' : 'badge-blue'}`}>{data.season}</span>
                  <span className="price-year">{data.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="prices-source">
          Source: <a href="https://cacp.dacnet.nic.in" target="_blank" rel="noreferrer">CACP, Government of India</a>
        </div>
      </div>

      <style>{`
        .app-nav { display:flex; align-items:center; justify-content:space-between; padding:0 40px; height:64px; background:rgba(17,24,39,.8); backdrop-filter:blur(12px); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; }
        .prices-page { min-height:100vh; }
        .prices-content { max-width:1100px; margin:0 auto; padding:40px; }
        .prices-header { margin-bottom:28px; }
        .prices-toolbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:24px; }
        .season-tabs { display:flex; gap:6px; }
        .prices-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
        .price-card { padding:18px 16px; }
        .price-crop { font-size:.82rem; color:var(--text2); margin-bottom:8px; font-weight:500; }
        .price-msp { font-family:var(--font-display); font-size:1.5rem; font-weight:700; color:var(--accent); margin-bottom:12px; }
        .price-unit { font-size:.75rem; color:var(--text3); font-weight:400; }
        .price-footer { display:flex; align-items:center; justify-content:space-between; }
        .price-year { font-size:.65rem; color:var(--text3); }
        .prices-loading { text-align:center; padding:60px; color:var(--text3); }
        .prices-source { margin-top:32px; font-size:.72rem; color:var(--text3); }
        .prices-source a { color:var(--accent); text-decoration:none; }
        .accent { color:var(--accent); }
      `}</style>
    </div>
  )
}
