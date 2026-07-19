/**
 * Shared crop matching + mandi/MSP resolution for map overlay and Prices page.
 * Live Agmarknet rows (market set) win; otherwise fall back to MSP baseline rows
 * (district/market null) from Supabase — not hardcoded data.ts.
 */

export type MandiPriceRow = {
  crop: string
  min_price?: number | null
  max_price?: number | null
  modal_price?: number | null
  msp?: number | null
  arrival_date?: string | null
  state?: string | null
  district?: string | null
  market?: string | null
}

export type MspBaselineRow = {
  crop: string
  msp: number
}

/** Agmarknet naming drift → panel / STATE_DATA crop names */
const CROP_ALIASES: Record<string, string[]> = {
  paddy: ['paddy', 'rice'],
  rice: ['rice', 'paddy'],
  wheat: ['wheat'],
  soybean: ['soybean', 'soyabean'],
  soyabean: ['soybean', 'soyabean'],
  maize: ['maize', 'corn'],
  cotton: ['cotton'],
  groundnut: ['groundnut', 'peanut'],
  mustard: ['mustard', 'rapeseed'],
  arhar: ['arhar', 'tur', 'redgram', 'pigeon'],
  tur: ['arhar', 'tur', 'redgram', 'pigeon'],
  gram: ['gram', 'chana', 'chickpea'],
  moong: ['moong', 'mung'],
  urad: ['urad', 'urd'],
  bajra: ['bajra', 'pearl', 'cumbu'],
  jowar: ['jowar', 'sorghum'],
  chilli: ['chilli', 'chili', 'chillies'],
  chili: ['chilli', 'chili', 'chillies'],
  onion: ['onion'],
  potato: ['potato'],
  tomato: ['tomato'],
  turmeric: ['turmeric'],
  sugarcane: ['sugarcane', 'cane'],
  barley: ['barley'],
  lentil: ['lentil', 'masur'],
  masur: ['lentil', 'masur'],
}

const STOP = new Set([
  'dal', 'raw', 'whole', 'common', 'medium', 'long', 'beans', 'split',
  'grade', 'fine', 'other', 'the', 'and',
])

export function formatInr(n: number): string {
  return Math.round(n).toLocaleString('en-IN')
}

export function cropStem(name: string): string {
  return String(name || '')
    .toLowerCase()
    .split(/[\s(/]+/)[0]
    .replace(/[^a-z0-9]/g, '')
}

function cropTokens(name: string): string[] {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t))
}

/** True when panel crop label refers to the same commodity as a DB crop string. */
export function cropsMatch(panelCrop: string, dbCrop: string): boolean {
  const a = String(panelCrop || '').trim().toLowerCase()
  const b = String(dbCrop || '').trim().toLowerCase()
  if (!a || !b) return false
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return true

  const stemA = cropStem(a)
  const stemB = cropStem(b)
  if (stemA && stemB && (stemA === stemB || stemA.startsWith(stemB) || stemB.startsWith(stemA))) {
    return true
  }

  const aliases = CROP_ALIASES[stemA] || [stemA]
  if (aliases.some((alias) => b.includes(alias) || cropStem(b) === alias)) return true

  const tokensA = cropTokens(a)
  const tokensB = new Set(cropTokens(b))
  if (tokensA.some((t) => tokensB.has(t))) return true

  return false
}

export function findMspBaseline(
  rows: MspBaselineRow[] | null | undefined,
  panelCrop: string,
): number | null {
  if (!rows?.length) return null
  const hit = rows.find((r) => cropsMatch(panelCrop, r.crop) && Number(r.msp) > 0)
  return hit ? Number(hit.msp) : null
}

export type AggregatedMandi = {
  min: number
  max: number
  modal: number
  msp: number
  sampleCrop: string
  arrivalDate: string | null
  marketCount: number
}

/** Prefer newest arrival_date, then aggregate min/max/modal across that day's markets. */
export function aggregateMandiForCrop(
  rows: MandiPriceRow[],
  panelCrop: string,
): AggregatedMandi | null {
  const matched = rows.filter((r) => cropsMatch(panelCrop, r.crop))
  if (!matched.length) return null

  let newest: string | null = null
  for (const r of matched) {
    const d = r.arrival_date || null
    if (d && (!newest || d > newest)) newest = d
  }
  const dayRows = newest
    ? matched.filter((r) => r.arrival_date === newest)
    : matched

  const mins: number[] = []
  const maxs: number[] = []
  const modals: number[] = []
  let msp = 0

  for (const r of dayRows) {
    const min = r.min_price != null ? Number(r.min_price) : NaN
    const max = r.max_price != null ? Number(r.max_price) : NaN
    const modal = r.modal_price != null ? Number(r.modal_price) : NaN
    if (!Number.isNaN(min) && min > 0) mins.push(min)
    if (!Number.isNaN(max) && max > 0) maxs.push(max)
    if (!Number.isNaN(modal) && modal > 0) modals.push(modal)
    const rowMsp = Number(r.msp) || 0
    if (rowMsp > msp) msp = rowMsp
  }

  if (!mins.length && !maxs.length && !modals.length) return null

  const modal =
    modals.length > 0
      ? modals.reduce((s, n) => s + n, 0) / modals.length
      : (mins[0] ?? maxs[0] ?? 0)
  const min = mins.length ? Math.min(...mins) : modal
  const max = maxs.length ? Math.max(...maxs) : modal

  return {
    min,
    max,
    modal,
    msp,
    sampleCrop: dayRows[0]?.crop || panelCrop,
    arrivalDate: newest,
    marketCount: dayRows.length,
  }
}

export function formatMandiRange(agg: AggregatedMandi): string {
  const range =
    agg.min !== agg.max
      ? `₹${formatInr(agg.min)} – ₹${formatInr(agg.max)}`
      : `₹${formatInr(agg.modal)}`
  return `${range}<span style="font-size:0.75rem; display:block; color:var(--text3);">Modal: ₹${formatInr(agg.modal)}${agg.marketCount > 1 ? ` · ${agg.marketCount} markets` : ''}</span>`
}

export function formatMspDisplay(msp: number): string {
  return `₹${formatInr(msp)}/qtl`
}

/** Crops typically harvested / marketed in Rabi (winter–spring). */
const RABI_STEMS = new Set([
  'wheat', 'mustard', 'gram', 'barley', 'lentil', 'masur', 'potato', 'peas',
  'rapeseed', 'chana', 'chickpea', 'safflower',
])

function isRabiCrop(crop: string): boolean {
  const lower = String(crop || '').toLowerCase()
  const stem = cropStem(crop)
  // Kharif pulses that contain "gram" in the name
  if (/\b(black|green|moong|mung|urad|urd)\b/.test(lower)) return false
  if (RABI_STEMS.has(stem)) return true
  if (/\b(wheat|mustard|barley|lentil|masur|potato|safflower|rapeseed)\b/.test(lower)) {
    return true
  }
  // Bengal gram / chana (not black/green gram)
  if (/\b(chana|chickpea|bengal\s*gram)\b/.test(lower)) return true
  if (/\bgram\b/.test(lower)) return true
  return false
}

/**
 * Season for UI filters. Mandi sync historically tagged everything as Kharif,
 * so mandi rows infer season from the crop name. MSP baseline rows keep the DB season.
 */
export function effectiveSeason(
  crop: string,
  storedSeason?: string | null,
  isMandi = false,
): 'Kharif' | 'Rabi' | 'Zaid' {
  if (isMandi || !storedSeason) {
    return isRabiCrop(crop) ? 'Rabi' : 'Kharif'
  }
  if (storedSeason === 'Rabi' || storedSeason === 'Zaid' || storedSeason === 'Kharif') {
    return storedSeason
  }
  return isRabiCrop(crop) ? 'Rabi' : 'Kharif'
}
