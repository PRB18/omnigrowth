import { useState, useEffect } from 'react'
import { supabase, type Dealer } from '../lib/supabase'
import { AppNav } from '../components/AppNav'

export default function Dealers() {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(true)
  const [crop, setCrop] = useState('')
  const [state, setState] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
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
    <div className="page-shell">
      <AppNav active="dealers" />
      <div className="page-main">
        <h1 className="section-title">Dealer Discovery</h1>
        <p className="section-sub" style={{ marginBottom: 28 }}>
          Find verified dealers, aggregators and exporters across India
        </p>

        <div className="page-toolbar">
          <input
            className="form-input"
            placeholder="Filter by crop (e.g. Wheat)"
            value={crop}
            onChange={e => setCrop(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Filter by state (e.g. Punjab)"
            value={state}
            onChange={e => setState(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="skeleton-grid" aria-busy="true" aria-label="Loading dealers">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton-card" key={i} style={{ height: 140 }} />
            ))}
          </div>
        ) : dealers.length === 0 ? (
          <div className="card empty-state">
            <p>No dealers found yet. Dealers can register and add their profiles.</p>
          </div>
        ) : (
          <div className="dealer-grid">
            {dealers.map(d => (
              <div className="card dealer-list-card" key={d.id}>
                <div className="dealer-list-top">
                  <div className="dealer-list-name">{d.business_name}</div>
                  {d.is_verified && <span className="badge badge-green">Verified</span>}
                </div>
                <div className="dealer-list-type">{d.dealer_type}</div>
                {d.description && <div className="dealer-list-desc">{d.description}</div>}
                <div className="dealer-list-tags">
                  {d.crops.slice(0, 4).map(c => (
                    <span className="badge badge-green" key={c}>{c}</span>
                  ))}
                  {d.states.slice(0, 3).map(s => (
                    <span className="badge badge-blue" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
