import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="app-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon-sm">🌿</div>
          <span>Omni<span style={{ color: 'var(--accent)' }}>Growth</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/app/prices" className="btn-ghost">MSP Prices</Link>
          <Link to="/app/dealers" className="btn-ghost">Dealers</Link>
          {user ? (
            <button className="btn-ghost" onClick={() => signOut()} style={{ cursor: 'pointer' }}>Sign Out</button>
          ) : (
            <Link to="/app/login" className="btn-primary">Sign In</Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 20px', boxShadow: '0 0 24px var(--accent-glow)' }}>🌿</div>

        {loading ? (
          <p style={{ color: 'var(--text3)' }}>Loading...</p>
        ) : user ? (
          <>
            <h1 className="section-title">Welcome, {profile?.name || 'User'}</h1>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              Role: <span className="badge badge-green" style={{ marginLeft: 6 }}>{profile?.role || 'buyer'}</span>
            </p>
          </>
        ) : (
          <>
            <h1 className="section-title">OmniGrowth Dashboard</h1>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              Sign in to access your personalized agricultural intelligence dashboard.
            </p>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20 }}>
          <Link to="/app/prices" className="card" style={{ textDecoration: 'none', padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>₹</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 6 }}>MSP Prices</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Live CACP rates for all crops</div>
          </Link>
          <Link to="/app/dealers" className="card" style={{ textDecoration: 'none', padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>🤝</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 6 }}>Dealers</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Search verified agri dealers</div>
          </Link>
          <a href="/3pm_krishna/index.html" className="card" style={{ textDecoration: 'none', padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>🗺️</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 6 }}>India Map</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Interactive crop & district explorer</div>
          </a>
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
