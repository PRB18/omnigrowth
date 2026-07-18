import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface Dealer {
  _id: string
  businessName: string
  dealerType: string
  crops: string[]
  states: string[]
  description: string
  contactPhone?: string
  contactEmail?: string
  isVerified: boolean
  rating?: number
}

export default function Dealers() {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(true)
  const [crop, setCrop] = useState('')
  const [state, setState] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (crop) params.set('crop', crop)
    if (state) params.set('state', state)
    setLoading(true)
    fetch(`${API}/api/dealers?${params}`)
      .then(r => r.json())
      .then(d => { if (d.success) setDealers(d.data.dealers) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [crop, state])

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="app-nav">
        <Link to="/" className="landing-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>
          <div className="logo-icon">🌿</div>
          <span>Omni<span style={{ color: 'var(--accent)' }}>Growth</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/app" className="btn-ghost">Dashboard</Link>
          <Link to="/app/prices" className="btn-ghost">MSP Prices</Link>
          <Link to="/app/login" className="btn-primary">Sign In</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h1 className="section-title">Dealer Discovery</h1>
        <p className="section-sub" style={{ marginBottom: 28 }}>Find verified dealers, aggregators and exporters across India</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          <input className="form-input" placeholder="Filter by crop (e.g. Wheat)" value={crop} onChange={e => setCrop(e.target.value)} style={{ maxWidth: 240 }} />
          <input className="form-input" placeholder="Filter by state (e.g. Punjab)" value={state} onChange={e => setState(e.target.value)} style={{ maxWidth: 240 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>Loading dealers...</div>
        ) : dealers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>No dealers found. Try different filters or check back after data is seeded.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {dealers.map(d => (
              <div className="card" key={d._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{d.businessName}</div>
                  {d.isVerified && <span className="badge badge-green">✓ Verified</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 10, textTransform: 'capitalize' }}>{d.dealerType}</div>
                {d.description && <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.55, marginBottom: 12 }}>{d.description}</div>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {d.crops.slice(0, 4).map(c => <span className="badge badge-green" key={c}>{c}</span>)}
                  {d.states.slice(0, 3).map(s => <span className="badge badge-blue" key={s}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`.app-nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;background:rgba(17,24,39,.8);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}.logo-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 0 16px var(--accent-glow);}`}</style>
    </div>
  )
}
