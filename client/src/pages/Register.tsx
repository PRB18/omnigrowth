import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Register() {
  const nav = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error: err } = await signUp(form.email, form.password, form.name, form.role)
    setLoading(false)
    if (err) { setError(err.message); return }
    nav('/app')
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 14px', boxShadow: '0 0 20px var(--accent-glow)' }}>🌿</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>Join OmniGrowth</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>India's B2B Agricultural Network</p>
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
            <label className="form-label">I am a...</label>
            <select className="form-input" value={form.role} onChange={set('role')} style={{ cursor: 'pointer' }}>
              <option value="buyer">Buyer / Business</option>
              <option value="farmer">Farmer / FPO</option>
              <option value="dealer">Dealer / Aggregator</option>
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text2)' }}>
          Have an account? <Link to="/app/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
