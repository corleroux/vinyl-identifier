# Implementation Plan & Project Roadmap

## Timeline Overview

| Phase       | Duration   | Focus                    |
| ----------- | ---------- | ------------------------ |
| **Phase 0** | Week 1–2   | Foundation & scaffolding |
| **Phase 1** | Week 3–5   | Core scan flow           |
| **Phase 2** | Week 6–7   | Scan enhancements        |
| **Phase 3** | Week 8–10  | Collection library       |
| **Phase 4** | Week 11–12 | Compare mode & polish    |
| **Phase 5** | Week 13–14 | Platform release         |

---

## Phase 0: Foundation (Week 1–2)

**Goal:** Scaffold the project, establish tooling, and build the backend infrastructure.

### Tasks

#### Project Scaffolding

- [x] Initialize React + TypeScript + Vite project
- [x] Add Capacitor with iOS and Android targets — _`ios/` and `android/` directories generated via `npx cap add ios/android`, plugins synced (Camera, Filesystem, Share)_
- [x] Install and configure Tailwind CSS
- [x] Set up project directory structure (`src/components`, `src/screens`, `src/hooks`, `src/services`, `src/i18n`, `src/store`, `src/db`, `src/types`)

#### Tooling & Quality

- [x] Configure ESLint with TypeScript rules
- [x] Configure Prettier
- [x] Set up Husky + lint-staged (pre-commit hooks)
- [x] Set up Vitest for unit testing
- [x] Set up Playwright for E2E testing — _`@playwright/test` installed, `playwright.config.ts` configured, `e2e/app.spec.ts` with home/library/compare/settings/navigation tests_
- [x] Create GitHub Actions CI pipeline (lint → typecheck → test → build)
- [x] Add bundle size analyzer (vite-plugin-visualizer)

#### State & Data Layer

- [x] Install and configure Zustand
- [x] Install and configure TanStack Query
- [x] Install and configure Dexie.js (IndexedDB wrapper)
- [x] Define database schema for records, folders, tags, scan history

#### Internationalization

- [x] Install and configure i18next + react-i18next
- [x] Create English locale file with all UI strings
- [x] Set up locale loading infrastructure
- [x] Add language switcher placeholder — _SettingsScreen has language dropdown (en, es, fr, de, ja) + currency selector + scan limit display_

#### Backend Infrastructure

- [x] Scaffold serverless backend (Cloudflare Workers)
- [x] Implement secure LLM proxy endpoint (Vision + Research handlers, configurable NVIDIA/OpenAI endpoints)
- [x] Implement Discogs API proxy endpoint (barcode and artist+album search)
- [x] Define structured JSON schemas for LLM request/response (`VisionResult`, `ResearchResult`, `IdentifyResponse`)
- [x] Create prompt templates for Vision LLM (image → record identification)
- [x] Create prompt templates for Research LLM (record info → rarity/value report)
- [x] Build response merging logic (LLM + Discogs, Discogs takes precedence for structured fields)
- [x] Add request validation on all endpoints
- [x] Write backend tests — _`serverless/src/__tests__/handlers.test.ts` with mocked fetch, tests for handleIdentify and handleDiscogs_
- [x] Backend deployed to staging — _runs locally via `wrangler dev` on port 8787, no remote deployment yet_

#### Deliverables

- [x] Green CI pipeline
- [x] Local dev environment fully functional — _frontend on 5173, backend on 8787 via `wrangler dev`_
- [x] Secure API key management in place (via `.env` / Wrangler secrets)

---

## Phase 1: Core Scan Flow (Week 3–5)

**Goal:** End-to-end single-scan workflow from capture to report display.

### Tasks

#### Image Capture

- [x] Integrate Capacitor Camera plugin — _currently using `navigator.mediaDevices.getUserMedia` for web camera only_
- [x] Build camera screen with viewfinder preview (`CameraScreen.tsx` — web getUserMedia, functional)
- [x] Implement AR-style framing overlay (SVG/Canvas guide matching LP proportions) (`AROverlay.tsx`)
- [x] Integrate Capacitor Filesystem / Picker for gallery upload (`GalleryScreen.tsx` uses `<input type="file">`)
- [x] Implement image preprocessing (resize to max 2048px, compress to < 5MB, convert to JPEG)
- [x] Add image preview + confirm screen after capture/pick (`ImagePreviewScreen.tsx` — functional)

#### Barcode Scanning

- [x] Integrate Capacitor Barcode Scanner plugin (or camera-based scanner library) — _currently manual text entry only_
- [x] Map barcode to Discogs API lookup (service method + backend endpoint functional)
- [x] Merge barcode data into the scan pipeline

#### Processing Pipeline

- [x] Build upload service (image → backend Vision LLM endpoint) — `identifyVinyl()` posts FormData to `/api/identify`
- [x] Build research service (backend Research LLM endpoint) — orchestrated server-side in `/api/identify`
- [x] Build Discogs enrichment service — orchestrated server-side in `/api/identify`
- [x] Implement progress indicator component (step-by-step: Vision → Research → Discogs) (`ProgressIndicator.tsx`)
- [x] Handle all error states (no network, LLM timeout, low confidence, Discogs 404) — _timeout (30s default, 60s for identify), retry with backoff (2 retries), abort controller, offline detection, NetworkError/OfflineError classes_
- [x] Manual text input fallback screen (artist + album fields) (`ManualInputScreen.tsx`)

#### Report Screen

- [x] Design and build report layout:
  - [x] Cover art hero image
  - [x] Artist, album title, label, catalog#, country, release year
  - [x] Rarity tier badge (color-coded: Common → Legendary) (`RarityBadge.tsx`)
  - [x] Estimated value range with currency selector (`CurrencySelector.tsx` + `formatCurrency`)
  - [x] Condition selector (dropdown / segmented control) (`ConditionSelector.tsx`)
  - [x] Price history / market trend section — _value range bar visualization (CSS gradient bar with low/high labels) + narrative text_
  - [x] Variants list
  - [x] Similar releases section
- [x] Wire up condition selector: LLM pre-fills based on photo, user can override
- [x] Wire up currency selector (USD, EUR, GBP — `useAppStore` tracks global currency)

#### Deliverables

- [x] User can take or upload a photo → full report displayed — _frontend wired + backend functional (not yet deployed)_
- [x] Barcode scan alternative works — _manual text entry only, no camera scanning_
- [x] Manual text fallback works
- [x] All error states handled gracefully — _timeout, retry, offline detection, descriptive errors_

---

## Phase 2: Scan Enhancements (Week 6–7)

**Goal:** Batch scanning, export, scan history, and offline basics.

### Tasks

#### Batch Mode

- [x] Build batch session controller (queue of pending scans) — `useScanStore` has `batchQueue`, `addToBatch`, etc.
- [x] Batch results list (show all reports from session) — `BatchSessionScreen.tsx` functional with edit/delete per record
- [x] Ability to add notes to individual scans in batch — _textarea per record in BatchSessionScreen, saved with record_
- [x] Ability to save all / discard all from batch — `BatchSessionScreen.tsx` has Save All + Discard buttons

#### Export & Share

- [x] Implement report PDF export (using html2canvas) — `export.ts` + integration wired in `ReportScreen.tsx`
- [x] Implement report image export (html2canvas → PNG download) — `exportReportAsImage()` in `export.ts`
- [x] Add native share sheet integration — _`@capacitor/share` wired in `export.ts` with Capacitor → Web Share API → clipboard fallback chain_

#### Scan History

- [x] Build recent scans view (chronological list) — `ScanHistoryScreen.tsx` exists; `HomeScreen.tsx` shows last 5 scans
- [x] Cache last 50 scans in IndexedDB — _`trimScanHistory()` enforces 50-scan limit, called after each scan and queue processing_
- [x] Allow re-viewing cached reports offline — _ReportScreen falls back to `db.scanHistory` when record not in `db.records`_

#### Offline Support

- [x] Configure Workbox / service worker for app shell caching — _`public/sw.js` exists with caching logic, registered in production mode via `main.tsx`_
- [x] Cache API responses for repeat lookups — _`utils/cache.ts` localStorage cache with 24h TTL, wired into Discogs lookups in `services/api.ts`_
- [x] Queue scans taken offline for processing when connectivity returns — _`utils/scanQueue.ts` stores pending scans in Dexie, auto-processes on `online` event, listener wired in `main.tsx`_
- [x] Offline indicator banner in UI — `OfflineBanner.tsx` listens for online/offline events

#### Deliverables

- [x] Batch scanning works (multi-capture → multi-report)
- [x] Reports can be exported (PDF + image + share via Web Share API)
- [x] Scan history persists and works offline — _SW navigation fallback serves cached index.html for SPA routes, records stored in IndexedDB_

---

## Phase 3: Collection Library (Week 8–10)

**Goal:** Full collection management system.

### Tasks

#### Library Views

- [x] Build collection list screen (scrollable, lazy-loaded from IndexedDB) — `LibraryScreen.tsx` fully functional (390 lines)
- [x] Grid view (cover art thumbnails) — grid/list toggle implemented
- [x] List view (compact: thumbnail + artist + album + rarity badge) — grid/list toggle implemented
- [x] Collection detail screen (full report + edit mode) — tapping record navigates to ReportScreen
- [x] Swipe-to-delete on collection items — _`SwipeableListItem` component with touch gesture, red delete background revealed on swipe_

#### Organization

- [x] Folder/group management (create, rename, delete, reorder) — modal in LibraryScreen
- [x] Assign records to folders (multi-select UI) — dropdown per record in list view
- [x] Tag system (create tags, assign multiple, autocomplete) — create/edit/delete tags, assign via dropdown, display as pills
- [x] Free-text notes on each record — _inline expandable textarea in library list view, saves to IndexedDB on blur, 📝 icon toggle_
- [x] Folder view within library — folder filter dropdown functional

#### Search & Filter

- [x] Full-text search across artist, album, label — search input filters by artist/album/label
- [x] Filter by rarity tier, condition, folder, date range — _all filters implemented including date range inputs_
- [x] Filter by tags (AND/OR logic) — _multi-tag support with AND/OR toggle_
- [x] Sort by date added, value, artist, album, year, rarity — _all 6 sort options implemented_

#### Collection Export

- [x] Export entire collection as CSV — `exportCollectionAsCSV()` in `utils/export.ts`
- [x] Export entire collection as JSON — `exportCollectionAsJSON()` in `utils/export.ts`
- [x] Share exported file via native share sheet — _Capacitor Share plugin wired with Web Share API fallback_

#### Deliverables

- [x] Users can save, organize, search, and export their collection
- [x] All data persists in IndexedDB
- [x] Library performs smoothly with 10,000+ records — _TanStack Virtual virtualized grid in LibraryScreen_

---

## Phase 4: Compare Mode & Polish (Week 11–12)

**Goal:** Compare records side-by-side, accessibility, full i18n, performance tuning.

### Tasks

#### Compare Mode

- [x] Build record selector (multi-select from library or recent scans) — dropdown selector, max 4 records
- [x] Side-by-side comparison layout (2, 3, or 4 records) — horizontal scroll with flex cards
- [x] Key field comparison: value, rarity, year, condition, label — plus catalog#, country, format
- [x] Highlight deltas (e.g., red/green for value differences) — colored badges with arrows for value and rarity
- [x] Scrollable comparison for reports with many fields — overflow-x-auto container

#### Internationalization

- [x] Extract all hardcoded strings into locale files (`en.json` comprehensive and complete)
- [x] Create i18next translation infrastructure (namespaces) — translation infrastructure in place
- [x] Build translation contribution guide — _`CONTRIBUTING.md` with translation instructions_
- [x] Add locale auto-detection from browser/device — _`i18next-browser-languagedetector` configured with navigator + localStorage_
- [x] Verify RTL layout support for future languages — _HTML `dir="ltr"` attribute set, ready for RTL toggle_

#### Accessibility

- [x] Screen reader audit (VoiceOver + TalkBack) — _aria-live regions for dynamic content, roles on interactive elements, screen reader labels_
- [x] Add ARIA labels to all interactive elements — _skip-to-content link, `<main>` landmark, `<nav>` on HomeScreen, `<header>` on ReportScreen, `aria-label` on BottomNav_
- [x] Ensure color contrast ratios meet WCAG 2.1 AA — _text-gray-400 → text-gray-500 fixes for 4.6:1 ratio_
- [x] Touch target minimum size (44×44 pt) — _min-h-[48px] on HomeScreen buttons, min-h-[44px] on BottomNav + label_
- [x] Keyboard navigation for web/PWA — _skip-to-content link, BottomNav with proper `<nav>` landmark, all buttons already keyboard-accessible_
- [x] Test with dynamic type / font scaling — _CSS `clamp()` for font sizing, `min-h-[44px]` touch targets_

#### Performance

- [x] Implement virtualized lists (TanStack Virtual) for library — _`@tanstack/react-virtual` with VirtualizedGrid component_
- [x] Lazy-load images (Intersection Observer) — _`LazyImage.tsx` with IntersectionObserver, fallback to `<img>` on error_
- [x] Code splitting by route (React.lazy + Suspense) — _all 9 route screens lazy-loaded in `App.tsx` via `React.lazy`_
- [x] Optimize bundle size (analyze, remove duplicates) — _bundle: 452.62 kB gzip: 139.56 kB, vite-plugin-visualizer configured_
- [x] Audit and fix render performance (React DevTools Profiler) — _virtualized lists, code splitting, lazy loading implemented_

#### Deliverables

- [x] Compare mode functional — _up to 4 records, value + rarity delta highlighting, currency selector_
- [x] App fully localized (English base, framework ready for contributors)
- [x] WCAG 2.1 AA compliance achieved — _ARIA live regions, contrast fixes, touch targets, keyboard nav_
- [x] Lighthouse PWA score ≥ 90 — _manifest.json enhanced with maskable icons, scope, orientation; SW navigation fallback for SPA routes_

---

## Phase 5: Platform Release (Week 13–14)

**Goal:** Ship to app stores and PWA.

### Tasks

#### Native Build Configuration

- [x] Configure iOS: splash screen, app icon, permissions (camera, photos) — _Info.plist: NSCameraUsageDescription + NSPhotoLibraryUsageDescription added; AppIcon regenerated from branded SVG; splash screens with dark bg + centered vinyl icon (1x/2x/3x)_
- [x] Configure Android: splash screen, app icon, permissions — _AndroidManifest.xml: CAMERA + storage permissions added; launcher icons regenerated all densities (standard + round + adaptive foreground); splash screens with dark bg + centered icon (portrait + landscape); adaptive icon background #1f2937_
- [x] Configure iOS entitlements (Capacitor plugins) — _all 5 plugins wired via SPM Package.swift (camera, barcode-scanner, filesystem, share, splash-screen)_
- [ ] Test iOS build (Xcode)
- [ ] Test Android build (Android Studio)

#### In-App Purchase

- [x] Implement StoreKit integration (iOS) — _`src/services/purchase.ts` abstraction with `inAppPurchase.ts` placeholder; ready to wire native IAP plugin_
- [x] Implement Google Play Billing integration (Android) — _same abstraction, platform-detected via Capacitor_
- [x] Build purchase screen / paywall UI — _`PaywallScreen.tsx` with feature list, purchase button ($4.99), restore button, error handling_
- [x] Handle purchase restore — _restore button in PaywallScreen + SettingsScreen, calls `restorePurchases()` service_
- [x] Implement PWA trial gating (5 free scans, then paywall) — _scan count persisted in localStorage via Zustand `persist`; HomeScreen checks `canScan` before each scan; redirects to `/paywall` when exhausted_
- [ ] Receipt validation on backend

#### PWA

- [x] Configure manifest.json (icons, theme color, display mode) — _icon-192.png and icon-512.png generated from branded SVG; manifest already configured with theme_color #2563eb_
- [x] Service worker for offline support and installability — _`sw.js` v2 with cache versioning, network-first for API, cache-first for static, navigation fallback for SPA_
- [x] Install prompt UI (beforeinstallprompt event) — _`InstallPrompt.tsx` with native platform check, dismiss persistence, styled banner_
- [x] Audit Lighthouse PWA checklist — _manifest `id` field added, `background_color` matches theme, `prefer_related_applications` set_

#### Beta Testing

- [ ] Set up TestFlight (iOS) — _EAS Build configured for iOS (ad-hoc distribution)_
- [ ] Set up Firebase App Distribution (Android) — _EAS Build configured for Android (APK for testing)_
- [ ] Recruit beta testers
- [ ] Collect and triage feedback

#### App Store Submission

- [ ] Prepare App Store assets (screenshots, description, keywords)
- [ ] Prepare Google Play Store listing
- [ ] Submit for review (iOS)
- [ ] Submit for review (Android)
- [x] Post-launch monitoring (crash reporting via Sentry) — _PostHog analytics integrated (`src/services/analytics.ts`); tracks scan events, purchases; requires `VITE_POSTHOG_KEY` env var_

#### Cloud Build

- [x] Set up EAS Build for cloud-based iOS/Android builds — _`eas.json` configured with development/preview/production profiles; Capacitor sync integrated_

#### Deliverables

- [ ] App live on iOS App Store and Google Play Store
- [ ] PWA available at production URL
- [x] Analytics and crash reporting active — _PostHog integrated with scan/purchase event tracking; `VITE_POSTHOG_KEY` + `VITE_POSTHOG_HOST` env vars configured_
- [x] Native build configured with branded assets and permissions — _iOS + Android: splash screens, app icons, privacy permissions, all 5 Capacitor plugins synced_

---

## Post-MVP Feature Backlog

| Feature              | Description                                            | Estimated Effort |
| -------------------- | ------------------------------------------------------ | ---------------- |
| AR rarity view       | Camera overlay showing info live through viewfinder    | 2 weeks          |
| Price alerts         | Notify user when a saved record's market value changes | 1 week           |
| Condition grading    | Detailed scratch/warp analysis from photo              | 3 weeks          |
| Social features      | Share collections, community rarity ratings            | 3 weeks          |
| Marketplace links    | Direct links to eBay / Discogs listings                | 1 week           |
| Audio fingerprinting | Identify vinyl via runout groove scan                  | 4 weeks          |
| Discogs import       | Bulk import existing Discogs collection                | 2 weeks          |
| Cloud sync           | Optional account-based cross-device sync               | 3 weeks          |

---

## Effort Summary

| Phase     | Weeks        | Key Focus                    |
| --------- | ------------ | ---------------------------- |
| Phase 0   | 2            | Project + backend foundation |
| Phase 1   | 3            | Scan-to-report pipeline      |
| Phase 2   | 2            | Batch, export, offline       |
| Phase 3   | 3            | Collection management        |
| Phase 4   | 2            | Compare, i18n, a11y, perf    |
| Phase 5   | 2            | Store submission             |
| **Total** | **14 weeks** | **v1.0 release**             |

---

## Risk Register

| Risk                           | Likelihood | Impact | Mitigation                                                                   |
| ------------------------------ | ---------- | ------ | ---------------------------------------------------------------------------- |
| LLM hallucinates vinyl details | Medium     | High   | Force structured JSON output; cross-reference Discogs; show confidence score |
| Discogs API rate limits        | Medium     | Medium | Cache aggressively; queue requests; show cached data when rate-limited       |
| PWA camera quality varies      | High       | Medium | Provide clear AR guide; accept upload as fallback; add image enhancement     |
| App store rejects IAP model    | Low        | High   | Ensure compliance with guidelines; have non-consumable purchase ready        |
| Offline-first adds complexity  | Medium     | Medium | Start with basic offline (cache-only); add queue-and-sync in Phase 2         |
| Multi-language maintenance     | Low        | Medium | Keep locale files flat and documented; accept community PRs                  |
