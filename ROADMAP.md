# Implementation Plan & Project Roadmap

## Timeline Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 0** | Week 1–2 | Foundation & scaffolding |
| **Phase 1** | Week 3–5 | Core scan flow |
| **Phase 2** | Week 6–7 | Scan enhancements |
| **Phase 3** | Week 8–10 | Collection library |
| **Phase 4** | Week 11–12 | Compare mode & polish |
| **Phase 5** | Week 13–14 | Platform release |

---

## Phase 0: Foundation (Week 1–2)

**Goal:** Scaffold the project, establish tooling, and build the backend infrastructure.

### Tasks

#### Project Scaffolding
- [ ] Initialize React + TypeScript + Vite project
- [ ] Add Capacitor with iOS and Android targets
- [ ] Install and configure Tailwind CSS
- [ ] Set up project directory structure (`src/components`, `src/screens`, `src/hooks`, `src/services`, `src/i18n`, `src/store`, `src/db`, `src/types`)

#### Tooling & Quality
- [ ] Configure ESLint with TypeScript rules
- [ ] Configure Prettier
- [ ] Set up Husky + lint-staged (pre-commit hooks)
- [ ] Set up Vitest for unit testing
- [ ] Set up Playwright for E2E testing
- [ ] Create GitHub Actions CI pipeline (lint → typecheck → test → build)
- [ ] Add bundle size analyzer (vite-plugin-visualizer)

#### State & Data Layer
- [ ] Install and configure Zustand
- [ ] Install and configure TanStack Query
- [ ] Install and configure Dexie.js (IndexedDB wrapper)
- [ ] Define database schema for records, folders, tags, scan history

#### Internationalization
- [ ] Install and configure i18next + react-i18next
- [ ] Create English locale file with all UI strings
- [ ] Set up locale loading infrastructure
- [ ] Add language switcher placeholder

#### Backend Infrastructure
- [ ] Scaffold serverless backend (Cloudflare Workers or Vercel Edge Functions)
- [ ] Implement secure LLM proxy endpoint (API keys server-side only)
- [ ] Implement Discogs API proxy endpoint
- [ ] Define structured JSON schemas for LLM request/response
- [ ] Create prompt templates for Vision LLM (image → record identification)
- [ ] Create prompt templates for Research LLM (record info → rarity/value report)
- [ ] Build response merging logic (LLM + Discogs)
- [ ] Add rate limiting and request validation
- [ ] Write backend tests

#### Deliverables
- Green CI pipeline
- Local dev environment fully functional
- Backend deployed to staging
- Secure API key management in place

---

## Phase 1: Core Scan Flow (Week 3–5)

**Goal:** End-to-end single-scan workflow from capture to report display.

### Tasks

#### Image Capture
- [ ] Integrate Capacitor Camera plugin
- [ ] Build camera screen with viewfinder preview
- [ ] Implement AR-style framing overlay (SVG/Canvas guide matching LP proportions)
- [ ] Integrate Capacitor Filesystem / Picker for gallery upload
- [ ] Implement image preprocessing (resize to max 2048px, compress to < 5MB, convert to JPEG)
- [ ] Add image preview + confirm screen after capture/pick

#### Barcode Scanning
- [ ] Integrate Capacitor Barcode Scanner plugin (or camera fallback with embedded scanner)
- [ ] Map barcode to Discogs API lookup
- [ ] Merge barcode data into the scan pipeline

#### Processing Pipeline
- [ ] Build upload service (image → backend Vision LLM endpoint)
- [ ] Build research service (backend Research LLM endpoint)
- [ ] Build Discogs enrichment service
- [ ] Implement progress indicator component (step-by-step: Vision → Research → Discogs)
- [ ] Handle all error states (no network, LLM timeout, low confidence, Discogs 404)
- [ ] Manual text input fallback screen (artist + album fields)

#### Report Screen
- [ ] Design and build report layout:
  - Cover art hero image
  - Artist, album title, label, catalog#, country, release year
  - Rarity tier badge (color-coded: Common → Legendary)
  - Estimated value range with currency selector
  - Condition selector (dropdown / segmented control)
  - Price history / market trend section
  - Variants list
  - Similar releases section
- [ ] Wire up condition selector: LLM pre-fills based on photo, user can override
- [ ] Wire up currency selector (USD, EUR, GBP with conversion)

#### Deliverables
- User can take or upload a photo → full report displayed
- Barcode scan alternative works
- Manual text fallback works
- All error states handled gracefully

---

## Phase 2: Scan Enhancements (Week 6–7)

**Goal:** Batch scanning, export, scan history, and offline basics.

### Tasks

#### Batch Mode
- [ ] Build batch session controller (queue of pending scans)
- [ ] Batch results list (show all reports from session)
- [ ] Ability to add notes to individual scans in batch
- [ ] Ability to save all / discard all from batch

#### Export & Share
- [ ] Implement report PDF export (using a library like jsPDF or html2canvas)
- [ ] Implement report image export (screenshot-to-image)
- [ ] Add native share sheet integration (Capacitor Share plugin)

#### Scan History
- [ ] Build recent scans view (chronological list)
- [ ] Cache last 50 scans in IndexedDB
- [ ] Allow re-viewing cached reports offline

#### Offline Support
- [ ] Configure Workbox / service worker for app shell caching
- [ ] Cache API responses for repeat lookups
- [ ] Queue scans taken offline for processing when connectivity returns
- [ ] Offline indicator banner in UI

#### Deliverables
- Batch scanning works (multi-capture → multi-report)
- Reports can be exported (PDF + image + share)
- Scan history persists and works offline

---

## Phase 3: Collection Library (Week 8–10)

**Goal:** Full collection management system.

### Tasks

#### Library Views
- [ ] Build collection list screen (scrollable, lazy-loaded from IndexedDB)
- [ ] Grid view (cover art thumbnails)
- [ ] List view (compact: thumbnail + artist + album + rarity badge)
- [ ] Collection detail screen (full report + edit mode)
- [ ] Swipe-to-delete on collection items

#### Organization
- [ ] Folder/group management (create, rename, delete, reorder)
- [ ] Assign records to folders (multi-select UI)
- [ ] Tag system (create tags, assign multiple, autocomplete)
- [ ] Free-text notes on each record
- [ ] Folder view within library

#### Search & Filter
- [ ] Full-text search across artist, album, label, notes
- [ ] Filter by rarity tier, condition, folder, date range
- [ ] Filter by tags (AND/OR logic)
- [ ] Sort by date added, value, artist, album, year, rarity

#### Collection Export
- [ ] Export entire collection as CSV
- [ ] Export entire collection as JSON
- [ ] Share exported file via native share sheet

#### Deliverables
- Users can save, organize, search, and export their collection
- All data persists in IndexedDB
- Library performs smoothly with 10,000+ records

---

## Phase 4: Compare Mode & Polish (Week 11–12)

**Goal:** Compare records side-by-side, accessibility, full i18n, performance tuning.

### Tasks

#### Compare Mode
- [ ] Build record selector (multi-select from library or recent scans)
- [ ] Side-by-side comparison layout (2, 3, or 4 records)
- [ ] Key field comparison: value, rarity, year, condition, label
- [ ] Highlight deltas (e.g., red/green for value differences)
- [ ] Scrollable comparison for reports with many fields

#### Internationalization
- [ ] Extract all hardcoded strings into locale files
- [ ] Create i18next translation infrastructure (namespaces)
- [ ] Build translation contribution guide
- [ ] Add locale auto-detection from browser/device
- [ ] Verify RTL layout support for future languages

#### Accessibility
- [ ] Screen reader audit (VoiceOver + TalkBack)
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure color contrast ratios meet WCAG 2.1 AA
- [ ] Touch target minimum size (44×44 pt)
- [ ] Keyboard navigation for web/PWA
- [ ] Test with dynamic type / font scaling

#### Performance
- [ ] Implement virtualized lists (TanStack Virtual) for library
- [ ] Lazy-load images (Intersection Observer)
- [ ] Code splitting by route (React.lazy + Suspense)
- [ ] Optimize bundle size (analyze, remove duplicates)
- [ ] Audit and fix render performance (React DevTools Profiler)

#### Deliverables
- Compare mode functional
- App fully localized (English base, framework ready for contributors)
- WCAG 2.1 AA compliance achieved
- Lighthouse PWA score ≥ 90

---

## Phase 5: Platform Release (Week 13–14)

**Goal:** Ship to app stores and PWA.

### Tasks

#### Native Build Configuration
- [ ] Configure iOS: splash screen, app icon, permissions (camera, photos)
- [ ] Configure Android: splash screen, app icon, permissions
- [ ] Configure iOS entitlements (Capacitor plugins)
- [ ] Test iOS build (Xcode)
- [ ] Test Android build (Android Studio)

#### In-App Purchase
- [ ] Implement StoreKit integration (iOS)
- [ ] Implement Google Play Billing integration (Android)
- [ ] Build purchase screen / paywall UI
- [ ] Handle purchase restore
- [ ] Implement PWA trial gating (5 free scans, then paywall)
- [ ] Receipt validation on backend

#### PWA
- [ ] Configure manifest.json (icons, theme color, display mode)
- [ ] Service worker for offline support and installability
- [ ] Install prompt UI (beforeinstallprompt event)
- [ ] Audit Lighthouse PWA checklist

#### Beta Testing
- [ ] Set up TestFlight (iOS)
- [ ] Set up Firebase App Distribution (Android)
- [ ] Recruit beta testers
- [ ] Collect and triage feedback

#### App Store Submission
- [ ] Prepare App Store assets (screenshots, description, keywords)
- [ ] Prepare Google Play Store listing
- [ ] Submit for review (iOS)
- [ ] Submit for review (Android)
- [ ] Post-launch monitoring (crash reporting via Sentry)

#### Deliverables
- App live on iOS App Store and Google Play Store
- PWA available at production URL
- Analytics and crash reporting active

---

## Post-MVP Feature Backlog

| Feature | Description | Estimated Effort |
|---------|-------------|-----------------|
| AR rarity view | Camera overlay showing info live through viewfinder | 2 weeks |
| Price alerts | Notify user when a saved record's market value changes | 1 week |
| Condition grading | Detailed scratch/warp analysis from photo | 3 weeks |
| Social features | Share collections, community rarity ratings | 3 weeks |
| Marketplace links | Direct links to eBay / Discogs listings | 1 week |
| Audio fingerprinting | Identify vinyl via runout groove scan | 4 weeks |
| Discogs import | Bulk import existing Discogs collection | 2 weeks |
| Cloud sync | Optional account-based cross-device sync | 3 weeks |

---

## Effort Summary

| Phase | Weeks | Key Focus |
|-------|-------|-----------|
| Phase 0 | 2 | Project + backend foundation |
| Phase 1 | 3 | Scan-to-report pipeline |
| Phase 2 | 2 | Batch, export, offline |
| Phase 3 | 3 | Collection management |
| Phase 4 | 2 | Compare, i18n, a11y, perf |
| Phase 5 | 2 | Store submission |
| **Total** | **14 weeks** | **v1.0 release** |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LLM hallucinates vinyl details | Medium | High | Force structured JSON output; cross-reference Discogs; show confidence score |
| Discogs API rate limits | Medium | Medium | Cache aggressively; queue requests; show cached data when rate-limited |
| PWA camera quality varies | High | Medium | Provide clear AR guide; accept upload as fallback; add image enhancement |
| App store rejects IAP model | Low | High | Ensure compliance with guidelines; have non-consumable purchase ready |
| Offline-first adds complexity | Medium | Medium | Start with basic offline (cache-only); add queue-and-sync in Phase 2 |
| Multi-language maintenance | Low | Medium | Keep locale files flat and documented; accept community PRs |
