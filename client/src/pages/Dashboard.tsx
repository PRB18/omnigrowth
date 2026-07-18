import { Link } from 'react-router-dom'
import '../index.css'

export default function Dashboard() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div className="logo-icon" style={{ width: 48, height: 48, fontSize: '1.4rem', margin: '0 auto 20px' }}>🌿</div>
      <h1 className="section-title">OmniGrowth Dashboard</h1>
      <p className="section-sub" style={{ margin: '12px auto', maxWidth: 400 }}>
        Full dashboard coming soon. The map, prices, and dealer portal are being built.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
        <Link to="/app/prices" className="btn-primary">View MSP Prices</Link>
        <Link to="/app/dealers" className="btn-ghost">Browse Dealers</Link>
        <Link to="/" className="btn-ghost">← Landing Page</Link>
      </div>
    </div>
  )
}
