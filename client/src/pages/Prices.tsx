import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type MSPPrice } from '../lib/supabase'

export default function Prices() {
  const [prices, setPrices] = useState<MSPPrice[]>([])
  const [season, setSeason] = useState<'All' | 'Kharif' | 'Rabi'>('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('msp_prices').select('*').order('crop')
      if (data) setPrices(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = prices.filter(p => {
    const matchSeason = season === 'All' || p.season === season
    const matchSearch = p.crop.toLowerCase().includes(search.toLowerCase())
    return matchSeason && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="app-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon-sm">🌿</div>
          <span>Omni<span style={{ color: 'var(--accent)' }}>Growth</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/app" className="btn-ghost">Dashboard</Link>
          <Link to="/app/dealers" className="btn-ghost">Dealers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h1 className="section-title">MSP Price Intelligence</h1>
        <p className="section-sub" style={{ marginBottom: 28 }}>Government Minimum Support Prices — CACP 2024-25 season</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <input className="form-input" placeholder="Search crop..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {(['All', 'Kharif', 'Rabi'] as const).map(s => (
              <button key={s} className={season === s ? 'btn-primary' : 'btn-ghost'} onClick={() => setSeason(s)} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>Loading prices from Supabase...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>📊</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>No prices found. Did you run the SQL schema in Supabase?</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {filtered.map(p => (
              <div className="card" key={p.id} style={{ padding: '18px 16px' }}>
                <div style={{ fontSize: '.82rem', color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>{p.crop}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>
                  ₹{p.msp.toLocaleString('en-IN')}<span style={{ fontSize: '.75rem', color: 'var(--text3)', fontWeight: 400 }}>/{p.unit}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge ${p.season === 'Kharif' ? 'badge-green' : 'badge-blue'}`}>{p.season}</span>
                  <span style={{ fontSize: '.65rem', color: 'var(--text3)' }}>{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, fontSize: '.72rem', color: 'var(--text3)' }}>
          Source: <a href="https://cacp.dacnet.nic.in" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>CACP, Government of India</a>
        </div>
      </div>

      <style>{`
        .app-nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;background:rgba(17,24,39,.8);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
        .nav-logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:700;font-size:1.2rem;color:var(--text);text-decoration:none;}
        .logo-icon-sm{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 0 16px var(--accent-glow);}
      `}</style>
    </div>
  )
}
