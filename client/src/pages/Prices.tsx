import { useState, useEffect } from 'react'
import { supabase, type MSPPrice } from '../lib/supabase'
import { AppNav } from '../components/AppNav'
import { cropsMatch, formatInr, effectiveSeason } from '../lib/priceResolve'

type ViewFilter = 'All' | 'Mandi' | 'MSP'

function isMandiRow(p: MSPPrice): boolean {
  return Boolean(p.market || p.district || p.modal_price != null || p.min_price != null)
}

function primaryPrice(p: MSPPrice): { label: string; value: number; detail?: string } | null {
  const modal = p.modal_price != null ? Number(p.modal_price) : null
  const min = p.min_price != null ? Number(p.min_price) : null
  const max = p.max_price != null ? Number(p.max_price) : null
  const msp = Number(p.msp) || 0

  if (isMandiRow(p) && (modal != null || min != null || max != null)) {
    const value = modal ?? min ?? max ?? 0
    if (value <= 0) return null
    const detail =
      min != null && max != null && min !== max
        ? `Range ₹${formatInr(min)}–₹${formatInr(max)}`
        : undefined
    return { label: 'Mandi modal', value, detail }
  }

  if (msp > 0) {
    return { label: 'Govt MSP', value: msp }
  }

  return null
}

export default function Prices() {
  const [prices, setPrices] = useState<MSPPrice[]>([])
  const [season, setSeason] = useState<'All' | 'Kharif' | 'Rabi'>('All')
  const [view, setView] = useState<ViewFilter>('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('msp_prices')
        .select('*')
        .order('arrival_date', { ascending: false, nullsFirst: false })
        .order('crop')
        .limit(4000)
      if (data) setPrices(data as MSPPrice[])
      setLoading(false)
    }
    void load()
  }, [])

  const filtered = prices.filter(p => {
    const mandi = isMandiRow(p)
    const rowSeason = effectiveSeason(p.crop, p.season, mandi)
    const matchSeason = season === 'All' || rowSeason === season
    const q = search.trim().toLowerCase()
    const matchSearch = !q
      || p.crop.toLowerCase().includes(q)
      || cropsMatch(search, p.crop)
      || (p.market?.toLowerCase().includes(q) ?? false)
      || (p.state?.toLowerCase().includes(q) ?? false)
      || (p.district?.toLowerCase().includes(q) ?? false)
    const matchView =
      view === 'All'
      || (view === 'Mandi' && mandi)
      || (view === 'MSP' && !mandi && Number(p.msp) > 0)
    const hasDisplayablePrice = primaryPrice(p) != null
    return matchSeason && matchSearch && matchView && hasDisplayablePrice
  })

  return (
    <div className="page-shell">
      <AppNav active="prices" />
      <div className="page-main">
        <h1 className="section-title">Price Intelligence</h1>
        <p className="section-sub" style={{ marginBottom: 28 }}>
          See what crops are selling for in Indian mandis today. If a live market rate isn&apos;t available yet, we show the government MSP instead.
        </p>

        <div className="page-toolbar">
          <input
            className="form-input"
            placeholder="Search crop, market, state…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-btns">
            {(['All', 'Mandi', 'MSP'] as const).map(v => (
              <button
                key={v}
                type="button"
                className={view === v ? 'btn-primary' : 'btn-ghost'}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="filter-btns">
            {(['All', 'Kharif', 'Rabi'] as const).map(s => (
              <button
                key={s}
                type="button"
                className={season === s ? 'btn-primary' : 'btn-ghost'}
                onClick={() => setSeason(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="skeleton-grid" aria-busy="true" aria-label="Loading prices">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton-card" key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card empty-state">
            <p>
              {view === 'Mandi' && season !== 'All'
                ? `No mandi rates for ${season} crops in this view yet. Try All or MSP, or clear the season filter.`
                : 'No prices found for this filter.'}
            </p>
          </div>
        ) : (
          <div className="msp-grid">
            {filtered.map(p => {
              const primary = primaryPrice(p)!
              const msp = Number(p.msp) || 0
              return (
                <div className="card msp-card" key={p.id}>
                  <div className="msp-card-crop">{p.crop}</div>
                  <div className="msp-card-price">
                    ₹{formatInr(primary.value)}
                    <span>/qtl · {primary.label}</span>
                  </div>
                  {primary.detail ? (
                    <div className="msp-card-range">{primary.detail}</div>
                  ) : null}
                  {isMandiRow(p) && msp > 0 ? (
                    <div className="msp-card-range">Govt MSP ₹{formatInr(msp)}</div>
                  ) : null}
                  {(p.market || p.district || p.state) ? (
                    <div className="msp-card-place">
                      {[p.market, p.district, p.state].filter(Boolean).join(' · ')}
                    </div>
                  ) : null}
                  <div className="msp-card-meta">
                    <span className={`badge ${isMandiRow(p) ? 'badge-gold' : 'badge-green'}`}>
                      {isMandiRow(p) ? 'Mandi' : 'MSP'}
                    </span>
                    <span className="msp-card-year">
                      {p.arrival_date || p.year}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="page-source">
          Sources:{' '}
          <a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer">
            Agmarknet
          </a>
          {' · '}
          <a href="https://www.data.gov.in" target="_blank" rel="noreferrer">
            data.gov.in
          </a>
          {' · '}
          <a href="https://cacp.dacnet.nic.in" target="_blank" rel="noreferrer">
            CACP (MSP)
          </a>
        </div>
      </div>
    </div>
  )
}
