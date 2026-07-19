import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
      <div className="logo-mark" aria-hidden>O</div>
      <h1 className="section-title" style={{ marginBottom: 0 }}>Page not found</h1>
      <p className="section-sub">That route doesn&apos;t exist.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  )
}
