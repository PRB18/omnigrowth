# OmniGrowth — Project Standards for AI Agents

## Security Rules (NON-NEGOTIABLE)
- Validate every route input with `zod` or `express-validator`
- Secrets go in `.env` — confirm `.env` is in `.gitignore` before any commit
- Mongoose/parameterized queries only — never raw string-built queries
- Never log or expose `MONGODB_URI`, JWT secrets, or API keys
- Sanitize all user inputs before storing to DB
- Use `helmet` middleware on every Express app

## Workflow Rules
- Show me the implementation plan before touching files for anything involving:
  - Auth flows (login, register, JWT, sessions)
  - Payments or billing
  - User data handling or PII
  - Database schema changes
- Commit in small logical chunks — one feature per commit
- Never push directly to `main` — use feature branches

## Architecture Rules
- Frontend: Vite + React 18 + TypeScript (in `/client`)
- Backend: Express.js + Node.js (in `/server`)
- Database: MongoDB via Mongoose (connection string from `.env` as `MONGODB_URI`)
- The existing prototype at `/3pm_krishna/index.html` is the public landing page — do NOT modify it unless explicitly asked
- The SaaS app lives at `/client` and is served at the `/app` route

## Code Style
- TypeScript strict mode on the frontend
- Use async/await — no raw promise chains
- All API responses follow: `{ success: boolean, data?: any, error?: string }`
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
