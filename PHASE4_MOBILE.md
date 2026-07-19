# Phase 4 — Mobile packaging (Capacitor)

**Date:** 2026-07-19  
**Scope:** Package the existing Vite client for iOS and Android via Capacitor — no React Native rewrite.  
**App ID:** `com.omnigrowth.app`  
**App name:** OmniGrowth

---

## What was done

| Item | Status |
|------|--------|
| `@capacitor/core` + `@capacitor/cli` + `android` / `ios` packages | Installed |
| `capacitor.config.ts` | Splash `#09101f`, StatusBar dark, Keyboard resize, `androidScheme: https` |
| `npx cap add android` / `npx cap add ios` | **Both platforms added** under `client/android`, `client/ios` |
| Vite `base: './'` | Set so WebView asset paths resolve |
| Native bootstrap `src/lib/native.ts` | StatusBar color/style, Android back button, SplashScreen hide |
| Icons + splash | Generated via `@capacitor/assets` from `client/assets/icon*.png` / `splash*.png` |
| Favicon | Replaced purple Vite mark with OmniGrowth O mark |
| Safe-area CSS + `viewport-fit=cover` | Added for notched devices |
| npm scripts | `cap:sync`, `cap:android`, `cap:ios`, `assets` |
| Plugins wired | App, Keyboard, SplashScreen, StatusBar |

---

## Daily workflow

```bash
cd client
npm run cap:sync       # npm run build && npx cap sync
npm run cap:android    # sync + open Android Studio
npm run cap:ios        # sync + open Xcode (macOS)
```

Regenerate branded icons/splash after changing source art in `client/assets/`:

```bash
npm run assets
npx cap sync
```

---

## Native permissions — inventory

| Capability | Needed now? | Capacitor approach |
|------------|-------------|--------------------|
| Internet / HTTPS (Supabase, Leaflet CDN, GeoJSON) | **Yes** | Android `INTERNET` already in manifest |
| Location (“dealers near me”) | **Not yet** — feature not built | Add `@capacitor/geolocation` + iOS `NSLocationWhenInUseUsageDescription` + Android fine/coarse location when product ships this |
| Push (price alerts) | **Not yet** | Add `@capacitor/push-notifications` + FCM/APNs when alerts exist |
| Camera / photos | No | — |
| Status bar / splash / keyboard | Yes | Plugins already configured |

Do **not** rely on browser `navigator.geolocation` or Notification API alone on device — use the matching Capacitor plugin when those features land.

---

## Simulator / emulator verification (this machine)

| Target | Result |
|--------|--------|
| `npx cap sync` | **Pass** — web assets copied; 4 plugins registered on both platforms |
| `npx cap doctor` | Android project OK; **Xcode not installed** (expected on Windows) |
| Android emulator run | **Blocked here** — no Android SDK (`%LOCALAPPDATA%\Android\Sdk` missing); system Java is **1.8** (Capacitor 8 / modern AGP need **JDK 17+**, ideally **21**) |
| iOS simulator run | **Blocked here** — requires macOS + Xcode |

### What founders must run to close the Definition of Done checkbox

**Android (Windows or Mac with Android Studio):**

1. Install **Android Studio** + SDK Platform 35 (or whatever `client/android` Gradle targets) + an emulator AVD.
2. Install **JDK 21** and point Android Studio / `JAVA_HOME` at it.
3. `cd client && npm run cap:android` → Run on emulator.
4. Confirm: splash → landing → map loads states → tap a state → prices/dealers navigate → back button does not kill the app incorrectly.

**iOS (Mac only):**

1. Install Xcode + Simulator.
2. `cd client && npm run cap:ios` → select a simulator → Run.
3. Same smoke path as Android; confirm status bar styling on notch devices.

---

## Known App Store / Play risks (carry from Phase 1)

1. **Leaflet + fonts from CDN** — map fails offline / flaky under App Transport; vendoring Leaflet into the bundle is a follow-up before store submission.
2. **Large JS chunk (~543 KB)** — acceptable for first native shell; code-split later.
3. **Empty dealers table** — product/content issue, not Capacitor.
4. **iOS project generated on Windows** — open once on a Mac so CocoaPods / SPM resolves cleanly if Xcode prompts.

---

## What was tested on this pass

1. `cd client && npm run build` — pass (`tsc -b` + Vite) after Capacitor wiring  
2. `cd client && npm run lint` — pass (pre-existing warnings only)  
3. `npx cap add android` / `npx cap add ios` — success  
4. `npx capacitor-assets generate` — icons/splash written into both native trees + PWA icons  
5. `npx cap sync` — success  
6. `npx cap doctor` — Android OK; iOS blocked (no Xcode on this host)  
7. Emulator/simulator launch — **not run** (SDK / Xcode missing) — documented above  

---

## Stop line

**Phase 4 scaffolding is complete in-repo.** Definition of Done item *“App runs end to end on an iOS simulator and Android emulator”* remains **open until a machine with Android Studio (JDK 21) and a Mac with Xcode execute the smoke path above.**

Suggested next product decisions:

- Vend Leaflet (and optionally fonts) into `client` for offline reliability before store review.
- When to add Geolocation / Push plugins.
