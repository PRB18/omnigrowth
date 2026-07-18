import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Dealer } from '../lib/supabase'

export default function Dealers() {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(true)
  const [crop, setCrop] = useState('')
  const [state, setState] = useState('')

  useEffect(() => {
    async function load() {
      let query = supabase.from('dealers').select('*').eq('is_active', true)
      if (crop) query = query.contains('crops', [crop])
      if (state) query = query.contains('states', [state])
      const { data } = await query.order('is_verified', { ascending: false })
      if (data) setDealers(data)
      setLoading(false)
    }
    load()
  }, [crop, state])

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="app-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon-sm">🌿</div>
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
            <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>No dealers found yet. Dealers can register and add their profiles.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {dealers.map(d => (
              <div className="card" key={d.id} style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>{d.business_name}</div>
                  {d.is_verified && <span className="badge badge-green">✓ Verified</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 10, textTransform: 'capitalize' }}>{d.dealer_type}</div>
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
      <style>{`
        .app-nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;background:rgba(17,24,39,.8);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
        .nav-logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:700;font-size:1.2rem;color:var(--text);text-decoration:none;}
        .logo-icon-sm{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 0 16px var(--accent-glow);}
      `}</style>
    </div>
  )
}
