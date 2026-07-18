import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      localStorage.setItem('og_token', data.data.token)
      nav('/app')
    } catch { setError('Network error. Is the server running?') }
    finally { setLoading(false) }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="logo-icon" style={{ width: 44, height: 44, fontSize: '1.3rem', margin: '0 auto 14px' }}>🌿</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>Join OmniGrowth's B2B network</p>
        </div>
        {error && <div style={{ background: 'rgba(224,85,85,.1)', border: '1px solid rgba(224,85,85,.2)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: '0.8rem', marginBottom: 16 }}>{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" required value={form.name} onChange={set('name')} placeholder="Ramesh Kumar" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(min 8 chars)</span></label>
            <input className="form-input" type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="9876543210" />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select className="form-input" value={form.role} onChange={set('role')} style={{ cursor: 'pointer' }}>
              <option value="buyer">Buyer / Business</option>
              <option value="farmer">Farmer / FPO</option>
              <option value="dealer">Dealer / Aggregator</option>
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text2)' }}>
          Already have an account? <Link to="/app/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
      <style>{`.logo-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 0 16px var(--accent-glow);}`}</style>
    </div>
  )
}
