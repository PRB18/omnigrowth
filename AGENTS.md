# OmniGrowth — Project Standards for AI Agents

## Security Rules (NON-NEGOTIABLE)
- Validate all user inputs on the client side before sending to Supabase
- Secrets go in `.env` — confirm `.env` is in `.gitignore` before any commit
- Supabase RLS (Row Level Security) must be enabled on every table
- Never log or expose Supabase service_role keys — only use the anon key in frontend
- Use parameterized Supabase queries — never build raw SQL strings
- Sanitize all user inputs before storing to DB

## Workflow Rules
- Show me the implementation plan before touching files for anything involving:
  - Auth flows (login, register, sessions)
  - Payments or billing
  - User data handling or PII
  - Database schema changes
- Commit in small logical chunks — one feature per commit


## Architecture Rules
- Frontend: Vite + React 18 + TypeScript (in `/client`)
- Backend: Supabase (PostgreSQL + Auth + Real-time + Storage)
- No separate Express server — Supabase handles everything
- The existing prototype at `/3pm_krishna/index.html` is the public landing page — do NOT modify it unless explicitly asked
- The SaaS app lives at `/client` and is served at the `/app` route

## Code Style
- TypeScript strict mode on the frontend
- Use async/await — no raw promise chains
- Component files: PascalCase. Utility files: camelCase
- CSS: continue the existing design system (dark theme, `--accent: #4abc64`, `--bg: #09101f`)

## Data Sources
- MSP data: CACP reports (Government of India)
- APMC market rates: Agmarknet (agmarknet.gov.in)
- Crop/district data: data.gov.in, ICAR, MoSPI
- Weather: IMD (imd.gov.in)

## What OmniGrowth Is
A B2B Agricultural Intelligence & Connectivity Platform for India.
Bridges farmers, dealers, and buyers across every state and district.
Core value: Right produce → Right market → Right time.
