# Graph Report - omnigrowth  (2026-08-07)

## Corpus Check
- 66 files · ~1,184,157 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 427 nodes · 478 edges · 52 communities (36 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d48f90e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Phase 1 — Production Readiness Findings Report
- compilerOptions
- What You Must Do When Invoked
- sync-prices.mjs
- main.tsx
- compilerOptions
- Phase 2 — Security hardening checklist
- graphify reference: extra exports and benchmark
- priceResolve.ts
- OmniGrowth
- devDependencies
- plugins
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- OmniGrowth — Master plan & status
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- tsconfig.json
- extraction-spec.md
- workflows/graphify.md
- CLAUDE.md
- MASTER_PLAN.md
- verify-security.mjs
- dependencies
- Dashboard.tsx
- scripts
- AppDelegate
- Phase 3 — UI pass
- listings
- org.junit.Test
- public.dealers
- gradlew
- MainActivity.java
- capacitor.config.ts
- Package.swift
- CapApp-SPM/README.md
- public.profiles
- public.msp_prices
- public.msp_prices

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `Phase 1 — Production Readiness Findings Report` - 13 edges
4. `What You Must Do When Invoked` - 12 edges
5. `scripts` - 11 edges
6. `AppDelegate` - 10 edges
7. `/graphify` - 10 edges
8. `Phase 2 — Security hardening checklist` - 10 edges
9. `OmniGrowth — Master plan & status` - 9 edges
10. `react` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --calls--> `useMapLogic()`  [EXTRACTED]
  client/src/pages/Dashboard.tsx → client/src/hooks/useMapLogic.ts
- `Login()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/Login.tsx → client/src/lib/auth.ts
- `Register()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/Register.tsx → client/src/lib/auth.ts
- `Prices()` --calls--> `formatInr()`  [EXTRACTED]
  client/src/pages/Prices.tsx → client/src/lib/priceResolve.ts
- `primaryPrice()` --calls--> `formatInr()`  [EXTRACTED]
  client/src/pages/Prices.tsx → client/src/lib/priceResolve.ts

## Import Cycles
- None detected.

## Communities (52 total, 16 thin omitted)

### Community 0 - "Phase 1 — Production Readiness Findings Report"
Cohesion: 0.12
Nodes (17): 1. Feature inventory (run, don’t guess), 2. Duplication / dead code, 3. Security posture (inventory — Phase 2 checklist still applies), 4. Performance, 5. Test and CI gaps, 6. Env / config sanity, Addendum — price overlay fix (2026-07-19), Corrected product description (+9 more)

### Community 1 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 2 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 3 - "sync-prices.mjs"
Cohesion: 0.16
Nodes (20): clientDir, dateCandidates(), __dirname, DRY_RUN, fetchFromResource(), fetchPage(), isPriorityCommodity(), loadMspLookup() (+12 more)

### Community 4 - "main.tsx"
Cohesion: 0.16
Nodes (15): App(), AppNav(), AppNavProps, useAuth(), initNativeShell(), Dealer, Listing, MSPPrice (+7 more)

### Community 5 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 6 - "Phase 2 — Security hardening checklist"
Cohesion: 0.18
Nodes (11): After Phase 2 is green — key rotation, Apply the migration (required — cannot be done from the anon key), Client bundle scan, Dashboard — Auth hardening (manual), Dashboard — Security Advisor (manual), npm audit, Phase 2 — Security hardening checklist, Storage & Edge Functions (+3 more)

### Community 7 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 8 - "priceResolve.ts"
Cohesion: 0.15
Nodes (23): CROP_PRICES, DISTRICT_DATA, STATE_DATA, AggregatedMandi, aggregateMandiForCrop(), CROP_ALIASES, cropsMatch(), cropStem() (+15 more)

### Community 9 - "OmniGrowth"
Cohesion: 0.22
Nodes (7): OmniGrowth client, Deploy on Netlify (share with a friend), Graphify knowledge graph, Mobile (Capacitor), OmniGrowth, Phase docs, Run locally

### Community 10 - "devDependencies"
Cohesion: 0.11
Nodes (19): @capacitor/assets, @capacitor/cli, devDependencies, @capacitor/assets, @capacitor/cli, oxlint, @types/node, @types/react (+11 more)

### Community 11 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 12 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 13 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 14 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 15 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 16 - "OmniGrowth — Master plan & status"
Cohesion: 0.10
Nodes (20): App / data, Confirmed done (migration + live probes), Dashboard Auth / Advisor — founder updates (2026-07-19), Definition of done (original master prompt), Done until now (broader than Phase 2), OmniGrowth — Master plan & status, P0 — Security close-out, P1 — Product decisions (founders) (+12 more)

### Community 24 - "MASTER_PLAN.md"
Cohesion: 0.06
Nodes (24): Architecture Rules, Code Style, Data Sources, OmniGrowth — Project Standards for AI Agents, Security Rules (NON-NEGOTIABLE), What OmniGrowth Is, Workflow Rules, How the app displays prices (live → MSP DB fallback) (+16 more)

### Community 26 - "verify-security.mjs"
Cohesion: 0.29
Nodes (4): clientEnv, env, root, sb

### Community 27 - "dependencies"
Cohesion: 0.09
Nodes (23): @capacitor/android, @capacitor/app, @capacitor/core, @capacitor/ios, @capacitor/keyboard, @capacitor/splash-screen, @capacitor/status-bar, dependencies (+15 more)

### Community 28 - "Dashboard.tsx"
Cohesion: 0.47
Nodes (4): useMapLogic(), Dashboard(), DashboardUI(), Win

### Community 29 - "scripts"
Cohesion: 0.12
Nodes (15): name, private, scripts, assets, build, cap:android, cap:ios, cap:sync (+7 more)

### Community 30 - "AppDelegate"
Cohesion: 0.13
Nodes (13): Any, Bool, Capacitor, AppDelegate, NSUserActivity, UIApplication, UIApplicationDelegate, UIKit (+5 more)

### Community 31 - "Phase 3 — UI pass"
Cohesion: 0.14
Nodes (14): Auth / lists, Design direction (chosen before polishing), Known leftovers (not Phase 3 blockers), Landing (`/` — `App.tsx` + `App.css`), Map (`Dashboard` / `DashboardUI` / `useMapLogic`), Motion (purposeful only), Phase 3 — UI pass, Price intelligence (post–Phase 3) (+6 more)

### Community 33 - "org.junit.Test"
Cohesion: 0.36
Nodes (4): ExampleInstrumentedTest, ExampleUnitTest, org.junit.runner.RunWith, org.junit.Test

### Community 35 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

## Knowledge Gaps
- **215 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+210 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `OmniGrowth — Master plan & status` connect `OmniGrowth — Master plan & status` to `MASTER_PLAN.md`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Phase 1 — Production Readiness Findings Report` connect `Phase 1 — Production Readiness Findings Report` to `MASTER_PLAN.md`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Phase 3 — UI pass` connect `Phase 3 — UI pass` to `MASTER_PLAN.md`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _215 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Phase 1 — Production Readiness Findings Report` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._