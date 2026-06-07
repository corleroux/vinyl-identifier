# Product Requirements Document: Vinyl Identifier

## Version 1.0 — Draft

---

## 1. Executive Summary

Vinyl Identifier is a mobile-first application that lets users photograph or upload images of vinyl records, then uses a multi-model LLM approach supplemented by the Discogs API to identify the record and deliver a comprehensive rarity and valuation report. Users can build a personal collection library, organize it with folders and tags, and compare records side-by-side.

Built with **React + Capacitor**, delivered first as a **PWA**, then wrapped for **iOS and Android**.

---

## 2. Problem Statement

Vinyl enthusiasts — from casual listeners to serious collectors — often own records whose pressing, year, country, and current market value are unknown. Existing solutions require manual Discogs lookups via barcode or text search. This app removes friction: take a picture, get answers instantly.

---

## 3. Target Audience

Music lovers and vinyl owners of all levels. No specialized knowledge or account creation required.

- Casual listeners curious about a thrift-store find
- Hobbyist collectors building and valuing their library
- Estate sale shoppers needing instant rarity checks

---

## 4. Platform & Distribution

| Phase | Platform | Technology |
|-------|----------|------------|
| MVP | PWA (web) | React + Vite + Workbox (offline support) |
| v1.0 | iOS + Android | Capacitor wrapping the PWA |
| Future | Native features | Capacitor plugins for camera, haptics, file system |

**Monetization:** One-time purchase via in-app purchase. PWA version serves as a limited trial (5 free scans).

**Internationalization:** i18n from the start (English as base, locale files structured for community contributions).

---

## 5. User Flow

```
[Launch] → [Home: Camera / Gallery / Library]
               │
               ├── Camera: AR-style overlay guides framing → Capture
               ├── Gallery: Pick image from device storage
               └── Barcode: Scan barcode on sleeve
                         │
                         ▼
              [Image Preview + Condition Override]
                         │
                         ▼
              [Processing Spinner w/ progress steps]
                (Vision LLM → Research LLM → Discogs enrichment)
                         │
                         ▼
              [Rarity Report Screen]
                - Album art, artist, title
                - Pressing year, country, label, catalog#
                - Rarity tier (Common / Uncommon / Rare / Very Rare / Legendary)
                - Estimated value range & price history
                - Variants & similar releases
                - Condition assessment (LLM guess + user-set)
                         │
                         ▼
              [Save to Collection?] → [Select Folder / Tags]
                         │
                         ▼
              [Batch: Continue scanning?] → [Yes → next capture]
                         │
                         ▼
              [Library / Compare Mode]
```

---

## 6. Functional Requirements

### 6.1 Image Capture & Input

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1.1 | Camera capture with AR-style framing guide overlay (ellipse/rectangle matching LP proportions) | P0 |
| FR1.2 | Gallery / image picker from device storage | P0 |
| FR1.3 | Barcode / QR code scanner (leveraging Capacitor camera plugin) | P1 |
| FR1.4 | Image cropping / rotation before submission | P1 |
| FR1.5 | Batch mode: sequential captures grouped into a single session | P1 |

### 6.2 LLM Processing Pipeline

| ID | Requirement | Priority |
|----|-------------|----------|
| FR2.1 | Multi-model architecture: Vision LLM (e.g., GPT-4o / Gemini) identifies record; Research LLM (e.g., Claude / GPT-4) provides deep rarity/value analysis | P0 |
| FR2.2 | Structured JSON output schema defining all report fields | P0 |
| FR2.3 | Fallback: if vision model confidence is low, prompt user for manual text input (artist + album) | P1 |
| FR2.4 | Progress indicators showing which stage is active (Vision → Research → Discogs) | P0 |

### 6.3 Discogs Integration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR3.1 | Query Discogs API with identified artist + album + catalog# to fetch structured data | P0 |
| FR3.2 | Merge / reconcile LLM findings with Discogs data (prefer Discogs for structured fields) | P1 |
| FR3.3 | Fallback: if LLM identification fails, attempt Discogs search via barcode or text | P1 |

### 6.4 Rarity Report

| ID | Requirement | Priority |
|----|-------------|----------|
| FR4.1 | Display cover art, artist, album title, label, catalog#, country, release year | P0 |
| FR4.2 | Rarity tier badge (Common / Uncommon / Rare / Very Rare / Legendary) | P0 |
| FR4.3 | Estimated value range (low–high) with currency selector | P0 |
| FR4.4 | Condition selector (Mint / NM / VG+ / VG / G+ / G / Fair / Poor) — LLM pre-fills, user adjusts | P0 |
| FR4.5 | Price history / market trend note (Discogs sales data + LLM commentary) | P1 |
| FR4.6 | Variants list: other pressings of the same release | P1 |
| FR4.7 | Similar releases: related albums / same artist | P2 |
| FR4.8 | Export / share report as PDF or image | P2 |

### 6.5 Collection Library

| ID | Requirement | Priority |
|----|-------------|----------|
| FR5.1 | Grid / list view of all saved records with cover art thumbnails | P1 |
| FR5.2 | Detail view tapping into saved report | P1 |
| FR5.3 | Folders / groups for organizing (e.g., "Rock", "Jazz", "To Sell") | P1 |
| FR5.4 | Tags and notes (user-editable) | P2 |
| FR5.5 | Search & filter by artist, album, year, rarity tier, condition, folder | P1 |
| FR5.6 | Sort by date added, value, artist, year | P1 |
| FR5.7 | Export collection as CSV / JSON | P2 |

### 6.6 Compare Mode

| ID | Requirement | Priority |
|----|-------------|----------|
| FR6.1 | Select 2+ records from library or recent scans | P2 |
| FR6.2 | Side-by-side display of key fields: value, rarity, year, condition, label | P2 |
| FR6.3 | Highlight differences (e.g., value delta, rarity difference) | P2 |

### 6.7 Offline / Local-First

| ID | Requirement | Priority |
|----|-------------|----------|
| FR7.1 | All collection data stored locally (IndexedDB / SQLite via Capacitor) | P1 |
| FR7.2 | Scan history cached locally | P1 |
| FR7.3 | Graceful degradation when offline: show cached reports, queue scans for later processing | P2 |

---

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Scan-to-report time** | < 15 seconds (LLM + Discogs) |
| **Image size limit** | Max 10 MB per image |
| **Supported image formats** | JPEG, PNG, WebP, HEIC |
| **Offline storage** | Local collection up to 10,000 records |
| **Internationalization** | English (base), locale system for future expansion |
| **Accessibility** | WCAG 2.1 AA (screen reader support, contrast, touch targets) |
| **Privacy** | Image processing via server API; images not stored permanently; no user accounts means no PII |
| **Performance** | Cold start < 3s, smooth 60fps navigation |
| **Bundle size** | Initial JS bundle < 200 KB (gzipped) |

---

## 8. Technical Architecture

```
┌──────────────────────────────────────────┐
│           PWA / Capacitor App             │
│  ┌───────────┐  ┌─────────────────────┐  │
│  │  Camera /  │  │  React App          │  │
│  │  Gallery   │  │  - Screens          │  │
│  │  Plugins   │  │  - State (Zustand)  │  │
│  └───────────┘  │  - i18n (i18next)    │  │
│                 │  - Local DB (Dexie)   │  │
│  ┌───────────┐  │  - API (TanStack Q)  │  │
│  │  Barcode   │  └─────────────────────┘  │
│  │  Scanner   │                            │
│  └───────────┘                             │
│  ┌──────────────────────────────────────┐ │
│  │  Service Worker (offline cache)      │ │
│  └──────────────────────────────────────┘ │
└──────────────┬────────────────────────────┘
               │ HTTPS / REST
┌──────────────▼────────────────────────────┐
│          Backend API (Serverless)          │
│  ┌────────────┐  ┌──────────┐             │
│  │ Vision LLM  │  │ Research │             │
│  │ (Gemini /   │  │ LLM      │             │
│  │  GPT-4o)    │  │ (Claude /│             │
│  └────────────┘  │  GPT-4)   │             │
│                  └──────────┘             │
│  ┌────────────┐  ┌──────────────────────┐ │
│  │ Discogs    │  │ Prompt pipeline /     │ │
│  │ API Proxy  │  │ response merging      │ │
│  └────────────┘  └──────────────────────┘ │
└────────────────────────────────────────────┘
```

### Technology Choices

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React + TypeScript + Vite | Fast dev, type safety, PWA-native |
| Client state | Zustand | Minimal boilerplate, no providers |
| Server state | TanStack Query | Caching, retries, optimistic updates |
| Local DB | Dexie.js (IndexedDB) | Collection storage, offline-first |
| Styling | Tailwind CSS | Rapid UI, small bundle |
| i18n | i18next | Industry standard, lazy-loaded locales |
| Native bridge | Capacitor | Access to camera, barcode, haptics, filesystem |
| Backend | Cloudflare Workers / Vercel Edge | Edge compute, secure API key management |
| CI/CD | GitHub Actions | Lint, typecheck, test, build, deploy |

---

## 9. Monetization

- **One-time purchase** via in-app purchase (iOS StoreKit / Google Play Billing)
- **PWA trial:** 5 free scans, then paywall overlay
- No subscriptions, no ads
- Purchase includes all future updates within major version

---

## 10. Release Criteria (v1.0)

- [ ] Single & batch scan workflows working end-to-end
- [ ] Barcode scanning functional
- [ ] AR-style framing overlay on camera
- [ ] Multi-model LLM pipeline returns comprehensive report within 15s
- [ ] Discogs enrichment integrated
- [ ] Full collection library (CRUD, folders, tags, search)
- [ ] Compare mode (2+ records side-by-side)
- [ ] Condition input (LLM pre-fill + user override)
- [ ] i18n framework in place (English functional)
- [ ] PWA deployable (offline-capable, installable, 5-scan trial)
- [ ] iOS + Android builds via Capacitor
- [ ] One-time purchase IAP integrated
- [ ] WCAG 2.1 AA compliance
- [ ] All tests passing (unit + E2E)
- [ ] Bundle size budget met

---

## 11. Future Considerations (Post-v1.0)

- AR overlay showing rarity info live through camera viewfinder
- Vinyl condition grading via detailed photo analysis (scratches, warps)
- Price alerts / market tracking for saved records
- Social features (share collections, community rarity ratings)
- External marketplace integration (eBay, Discogs marketplace)
- Vinyl identification via audio fingerprinting (groove / runout analysis)
- Bulk import from Discogs wantlist / collection
- Cloud sync (optional, account-based)
