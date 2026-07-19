/**
 * Post-migration security verification using the public anon key only.
 * Run after applying supabase/migrations/20260719_phase2_security_hardening.sql
 *
 *   node client/scripts/verify-security.mjs
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const clientEnv = resolve(root, 'client/.env')
if (!existsSync(clientEnv)) {
  console.error('Missing client/.env')
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(clientEnv, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

let failed = 0
function pass(msg) {
  console.log(`  PASS  ${msg}`)
}
function fail(msg) {
  failed++
  console.log(`  FAIL  ${msg}`)
}

console.log('\n=== Phase 2 security verification (anon key) ===\n')

// msp_prices SELECT should work
{
  const { data, error } = await sb.from('msp_prices').select('id').limit(1)
  if (error) fail(`msp_prices SELECT: ${error.message}`)
  else pass(`msp_prices SELECT (${data?.length ?? 0} row sample)`)
}

// msp_prices INSERT must fail
{
  const crop = `__sec_verify_${Date.now()}__`
  const { error, status } = await sb.from('msp_prices').insert({
    crop,
    msp: 1,
    season: 'Kharif',
    year: '2099',
  })
  if (!error && status >= 200 && status < 300) {
    fail(`msp_prices INSERT still allowed (status ${status}) — policies not applied?`)
    console.warn('    (orphan row may remain until migration DELETE runs; crop=', crop + ')')
  } else {
    pass(`msp_prices INSERT blocked (${error?.message || status})`)
  }
}

// msp_prices UPDATE must fail (or affect 0)
{
  const { data: sample } = await sb.from('msp_prices').select('id,msp').limit(1).maybeSingle()
  if (sample?.id) {
    const { data, error } = await sb
      .from('msp_prices')
      .update({ msp: sample.msp })
      .eq('id', sample.id)
      .select()
    if (!error && data && data.length > 0) {
      fail('msp_prices UPDATE still allowed')
    } else {
      pass(`msp_prices UPDATE blocked (${error?.message || '0 rows'})`)
    }
  } else {
    pass('msp_prices UPDATE skipped (no rows)')
  }
}

// profiles must not be world-readable
{
  const { data, error } = await sb.from('profiles').select('id,name').limit(10)
  if (error) {
    pass(`profiles SELECT denied for anon (${error.message})`)
  } else if ((data?.length ?? 0) > 0) {
    fail(`profiles still world-readable (${data.length} rows) — lock down SELECT`)
  } else {
    pass('profiles SELECT returns 0 rows for anon (OK if empty + RLS)')
  }
}

// dealers INSERT must fail for anon
{
  const { error, status } = await sb.from('dealers').insert({
    business_name: '__sec_verify__',
    crops: ['Wheat'],
    states: ['Punjab'],
    dealer_type: 'aggregator',
    user_id: '00000000-0000-0000-0000-000000000000',
  })
  if (!error && status >= 200 && status < 300) {
    fail('dealers INSERT still allowed for anon')
  } else {
    pass(`dealers INSERT blocked (${error?.message || status})`)
  }
}

// dealers SELECT active still works
{
  const { error } = await sb.from('dealers').select('id').eq('is_active', true).limit(1)
  if (error) fail(`dealers SELECT: ${error.message}`)
  else pass('dealers SELECT (active) allowed')
}

console.log(failed === 0 ? '\nAll checks passed.\n' : `\n${failed} check(s) failed. Apply the Phase 2 SQL migration, then re-run.\n`)
process.exit(failed === 0 ? 0 : 1)
