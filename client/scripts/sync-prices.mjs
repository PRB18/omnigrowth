/**
 * Sync real APMC / mandi prices from data.gov.in (Agmarknet) into Supabase.
 *
 * Requires repo-root .env (never client/.env / never VITE_* for secrets):
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   DATA_GOV_API_KEY=...
 *
 * Catalog:
 *   https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi
 *
 * Run: node client/scripts/sync-prices.mjs
 * Dry run (no DB writes): node client/scripts/sync-prices.mjs --dry-run
 */
import { createClient } from '@supabase/supabase-js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')
const clientDir = resolve(__dirname, '..')

const DRY_RUN = process.argv.includes('--dry-run')

/** Primary (newer) then older Agmarknet daily mandi resource — tried in order. */
const RESOURCE_IDS = [
  '35985678-0d79-46b4-9ed6-6f13308a1d24',
  '9ef84268-d588-465a-a308-a864a43d0070',
]

/** v1 reliability scope — expand later; do not imply “all India all crops”. */
const PRIORITY_STATES = new Set([
  'Andhra Pradesh',
  'Gujarat',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Telangana',
  'Uttar Pradesh',
  'Haryana',
  'West Bengal',
  'Tamil Nadu',
])

/** Substring match against Agmarknet commodity names (case-insensitive). */
const PRIORITY_CROP_NEEDLES = [
  'wheat',
  'paddy',
  'rice',
  'cotton',
  'onion',
  'soyabean',
  'soybean',
  'maize',
  'groundnut',
  'mustard',
  'turmeric',
  'chilli',
  'chili',
  'potato',
  'tomato',
  'sugarcane',
  'bajra',
  'jowar',
  'arhar',
  'tur',
  'gram',
  'moong',
  'urad',
]

const PAGE_SIZE = 1000
const MAX_PAGES_PER_RESOURCE = 15
const MAX_UPSERT_BATCH = 500

function loadEnvFiles() {
  const candidates = [
    resolve(root, '.env'),
    resolve(clientDir, '.env'),
    resolve(root, '.env.local'),
  ]
  for (const path of candidates) {
    if (!existsSync(path)) continue
    try {
      process.loadEnvFile(path)
    } catch {
      // next file may have the keys
    }
  }
}

loadEnvFiles()

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
const dataGovKey = process.env.DATA_GOV_API_KEY || process.env.DATAGOV_API_KEY

if (!dataGovKey) {
  console.error(
    'Missing DATA_GOV_API_KEY. Add it to the repo-root .env (from data.gov.in → My Account).'
  )
  process.exit(1)
}

if (!DRY_RUN && (!supabaseUrl || !serviceKey)) {
  console.error(
    'Missing Supabase credentials for write. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in repo-root .env — or pass --dry-run to only fetch.'
  )
  process.exit(1)
}

if (serviceKey && serviceKey === process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Refusing to run: SERVICE_ROLE_KEY must not equal the anon key.')
  process.exit(1)
}

const supabase =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null

function pick(row, ...keys) {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== '') return row[k]
  }
  return undefined
}

function toNumber(value) {
  if (value == null || value === '') return null
  const n = Number(String(value).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : null
}

/** Agmarknet often uses DD/MM/YYYY; ISO YYYY-MM-DD also appears. */
function parseArrivalDate(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/)
  if (m) {
    const dd = m[1].padStart(2, '0')
    const mm = m[2].padStart(2, '0')
    return `${m[3]}-${mm}-${dd}`
  }
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return null
}

function isPriorityCommodity(name) {
  const lower = String(name || '').toLowerCase()
  return PRIORITY_CROP_NEEDLES.some((n) => lower.includes(n))
}

function dateCandidates() {
  const out = []
  const now = new Date()
  for (let i = 0; i < 5; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    out.push(`${dd}/${mm}/${yyyy}`) // common Agmarknet filter form
    out.push(`${yyyy}-${mm}-${dd}`)
  }
  return [...new Set(out)]
}

async function fetchPage(resourceId, offset, dateFilterKey, dateValue) {
  const url = new URL(`https://api.data.gov.in/resource/${resourceId}`)
  url.searchParams.set('api-key', dataGovKey)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', String(PAGE_SIZE))
  url.searchParams.set('offset', String(offset))
  if (dateFilterKey && dateValue) {
    url.searchParams.set(dateFilterKey, dateValue)
  }

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} for ${resourceId}: ${body.slice(0, 200)}`)
  }
  const json = await res.json()
  if (json.status === 'error' || json.message?.toLowerCase?.().includes('not found')) {
    throw new Error(json.message || JSON.stringify(json).slice(0, 200))
  }
  return Array.isArray(json.records) ? json.records : []
}

async function fetchFromResource(resourceId) {
  const dateKeys =
    resourceId.startsWith('35985678')
      ? ['filters[Arrival_Date]', 'filters[arrival_date]']
      : ['filters[arrival_date]', 'filters[Arrival_Date]']

  const dates = dateCandidates()
  const collected = []
  let usedFilter = null

  for (const dateKey of dateKeys) {
    for (const dateValue of dates) {
      try {
        const first = await fetchPage(resourceId, 0, dateKey, dateValue)
        if (!first.length) continue
        usedFilter = `${dateKey}=${dateValue}`
        collected.push(...first)
        console.log(
          `  ${resourceId.slice(0, 8)}… ${usedFilter} → ${first.length} rows (page 0)`
        )

        for (let page = 1; page < MAX_PAGES_PER_RESOURCE; page++) {
          const offset = page * PAGE_SIZE
          const more = await fetchPage(resourceId, offset, dateKey, dateValue)
          if (!more.length) break
          collected.push(...more)
          console.log(`  … page ${page} → +${more.length} (total ${collected.length})`)
          if (more.length < PAGE_SIZE) break
        }
        return { records: collected, filter: usedFilter }
      } catch (err) {
        console.warn(`  skip ${dateKey}=${dateValue}: ${err.message}`)
      }
    }
  }

  // Last resort: unfiltered recent dump (API may return mixed dates)
  console.log(`  ${resourceId.slice(0, 8)}… trying unfiltered sample`)
  const loose = await fetchPage(resourceId, 0, null, null)
  return { records: loose, filter: 'none (unfiltered sample)' }
}

const RABI_CROP_NEEDLES = [
  'wheat',
  'mustard',
  'gram',
  'barley',
  'lentil',
  'masur',
  'potato',
  'peas',
  'rapeseed',
  'chana',
]

function seasonForCommodity(commodity) {
  const lower = String(commodity || '').toLowerCase()
  if (/\b(black|green|moong|mung|urad|urd)\b/.test(lower)) return 'Kharif'
  if (RABI_CROP_NEEDLES.some((n) => lower.includes(n))) return 'Rabi'
  return 'Kharif'
}

function normalizeRecord(row, mspByCrop) {
  const commodity = String(
    pick(row, 'Commodity', 'commodity', 'Crop', 'crop') || ''
  ).trim()
  const state = String(pick(row, 'State', 'state') || '').trim()
  const district = String(pick(row, 'District', 'district') || '').trim()
  const market = String(pick(row, 'Market', 'market') || '').trim()
  const arrival_date = parseArrivalDate(
    pick(row, 'Arrival_Date', 'arrival_date', 'Arrival Date')
  )
  const min_price = toNumber(pick(row, 'Min_x0020_Price', 'Min Price', 'min_price', 'Min_Price'))
  const max_price = toNumber(pick(row, 'Max_x0020_Price', 'Max Price', 'max_price', 'Max_Price'))
  const modal_price = toNumber(
    pick(row, 'Modal_x0020_Price', 'Modal Price', 'modal_price', 'Modal_Price')
  )

  if (!commodity || !state || !market || !arrival_date) return null
  if (!PRIORITY_STATES.has(state)) return null
  if (!isPriorityCommodity(commodity)) return null
  if (modal_price == null && min_price == null && max_price == null) return null

  const mspLookup = mspByCrop.get(commodity.toLowerCase())
    ?? [...mspByCrop.entries()].find(([k]) =>
      commodity.toLowerCase().includes(k) || k.includes(commodity.toLowerCase().split('(')[0].trim())
    )?.[1]

  return {
    crop: commodity,
    msp: mspLookup ?? 0,
    season: seasonForCommodity(commodity),
    year: '2024-25',
    unit: '₹/quintal',
    arrival_date,
    min_price,
    max_price,
    modal_price: modal_price ?? min_price ?? max_price,
    state,
    district: district || market,
    market,
  }
}

async function loadMspLookup() {
  if (!supabase) return new Map()
  const { data, error } = await supabase
    .from('msp_prices')
    .select('crop, msp')
    .is('district', null)

  if (error) {
    console.warn('MSP lookup skipped:', error.message)
    return new Map()
  }
  const map = new Map()
  for (const row of data || []) {
    if (row.crop) map.set(String(row.crop).toLowerCase(), Number(row.msp) || 0)
  }
  return map
}

async function upsertBatches(rows) {
  let ok = 0
  for (let i = 0; i < rows.length; i += MAX_UPSERT_BATCH) {
    const chunk = rows.slice(i, i + MAX_UPSERT_BATCH)
    const { error } = await supabase
      .from('msp_prices')
      .upsert(chunk, { onConflict: 'crop,state,district,market,arrival_date' })
    if (error) {
      console.error(`Upsert failed at offset ${i}:`, error.message)
      throw error
    }
    ok += chunk.length
    console.log(`  upserted ${ok}/${rows.length}`)
  }
}

async function main() {
  console.log('=== OmniGrowth Agmarknet sync ===')
  console.log(DRY_RUN ? 'Mode: DRY RUN (fetch only)' : 'Mode: fetch + write to Supabase')
  console.log(`Priority states: ${PRIORITY_STATES.size}, crop needles: ${PRIORITY_CROP_NEEDLES.length}`)

  let raw = []
  let usedResource = null
  let usedFilter = null

  for (const id of RESOURCE_IDS) {
    try {
      console.log(`\nTrying resource ${id}`)
      const { records, filter } = await fetchFromResource(id)
      if (records.length) {
        raw = records
        usedResource = id
        usedFilter = filter
        break
      }
    } catch (err) {
      console.warn(`Resource ${id} failed:`, err.message)
    }
  }

  if (!raw.length) {
    console.error(
      'No records returned. Check DATA_GOV_API_KEY, try again later (govt API is flaky), or open the catalog in a browser.'
    )
    process.exit(1)
  }

  console.log(`\nFetched ${raw.length} raw rows from ${usedResource} (${usedFilter})`)

  const mspByCrop = await loadMspLookup()
  const normalized = []
  const seen = new Set()

  for (const row of raw) {
    const n = normalizeRecord(row, mspByCrop)
    if (!n) continue
    const key = `${n.crop}|${n.state}|${n.district}|${n.market}|${n.arrival_date}`
    if (seen.has(key)) continue
    seen.add(key)
    normalized.push(n)
  }

  console.log(`After priority filter + dedupe: ${normalized.length} rows`)

  if (!normalized.length) {
    console.error(
      'API returned data but nothing matched priority crops/states. Sample commodities:',
      [...new Set(raw.slice(0, 30).map((r) => pick(r, 'Commodity', 'commodity')))].join(', ')
    )
    process.exit(1)
  }

  const sample = normalized.slice(0, 3)
  console.log('Sample:', JSON.stringify(sample, null, 2))

  if (DRY_RUN) {
    console.log('Dry run complete — no database writes.')
    return
  }

  await upsertBatches(normalized)
  console.log(
    `\nDone. Synced ${normalized.length} Agmarknet mandi rows. Source resource: ${usedResource}`
  )
  console.log('Label these in the product as daily mandi/APMC rates (not live tick-by-tick).')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
