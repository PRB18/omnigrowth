import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { AppNav } from '../components/AppNav'

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
    <div className="auth-shell">
      <AppNav active="register" />
      <div className="auth-body">
        <div className="card auth-card">
          <div className="auth-brand">
            <div className="logo-mark" aria-hidden>O</div>
            <h1>Join OmniGrowth</h1>
            <p>India&apos;s B2B agricultural network</p>
          </div>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" className="form-input" required value={form.name} onChange={set('name')} placeholder="Ramesh Kumar" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input id="reg-email" className="form-input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">
                Password <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(min 8 chars)</span>
              </label>
              <input id="reg-password" className="form-input" type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">I am a...</label>
              <select id="reg-role" className="form-input" value={form.role} onChange={set('role')} style={{ cursor: 'pointer' }}>
                <option value="buyer">Buyer / Business</option>
                <option value="farmer">Farmer / FPO</option>
                <option value="dealer">Dealer / Aggregator</option>
              </select>
            </div>
            <button className="btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer">
            Have an account? <Link to="/app/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
