import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { AppNav } from '../components/AppNav'

export default function Login() {
  const nav = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(form.email, form.password)
    setLoading(false)
    if (err) { setError(err.message); return }
    nav('/app')
  }

  return (
    <div className="auth-shell">
      <AppNav active="login" />
      <div className="auth-body">
        <div className="card auth-card">
          <div className="auth-brand">
            <div className="logo-mark" aria-hidden>O</div>
            <h1>Welcome back</h1>
            <p>Sign in to OmniGrowth</p>
          </div>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <button className="btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-footer">
            No account? <Link to="/app/register">Register free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
