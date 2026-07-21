# Graph Report - . (2026-07-21)

## Corpus Check

- Corpus is ~41,961 words - fits in a single context window. You may not need a graph.

## Summary

- 474 nodes · 517 edges · 55 communities (41 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- Package Dependencies
- Capacitor Plugins
- React Screens & Routing
- Serverless Backend
- Project Configuration
- TypeScript App Config
- TypeScript Node Config
- Gemini LLM Provider
- UI Components
- Documentation & Architecture
- PWA Manifest
- Serverless Dependencies
- API Service Client
- Type Definitions
- In-App Purchase
- Mobile Deployment Pipeline
- Zustand State Store
- Library Screen
- LLM Research Concepts
- Export Utilities
- Expo/EAS Config
- Service Worker
- Database Schema
- Barcode Detector Types
- Cache Utilities
- Install Prompt
- Camera Screen
- Compare Screen
- Settings Screen
- Bottom Navigation
- Lazy Image Component
- Format Utilities
- TypeScript Base Config
- Capacitor Config
- Android Gradle Build
- iOS Xcode Build

## God Nodes (most connected - your core abstractions)

1. `compilerOptions` - 20 edges
2. `scripts` - 17 edges
3. `compilerOptions` - 16 edges
4. `App Architecture Layers` - 11 edges
5. `Env` - 7 edges
6. `handleIdentify()` - 7 edges
7. `searchByBarcode()` - 7 edges
8. `searchByArtistAlbum()` - 7 edges
9. `handleDiscogs()` - 5 edges
10. `fetch()` - 5 edges

## Surprising Connections (you probably didn't know these)

- `App Architecture Layers` --semantically_similar_to--> `Local-First Pattern` [INFERRED] [semantically similar]
  AGENTS.md → PRD.md
- `App Architecture Layers` --references--> `Zustand Client State` [EXTRACTED]
  AGENTS.md → PRD.md
- `App Architecture Layers` --references--> `TanStack Query` [EXTRACTED]
  AGENTS.md → PRD.md
- `App Architecture Layers` --uses--> `i18next` [EXTRACTED]
  AGENTS.md → PRD.md
- `App Architecture Layers` --references--> `Tailwind CSS` [EXTRACTED]
  AGENTS.md → PRD.md

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **Client Architecture Stack** — index_html, agents_architecture, prd_zustand_store, prd_tanstack_query, prd_dexie_indexeddb [INFERRED 0.95]
- **Native Build Pipeline Flow** — prd_vite_build, prd_web_dist, docs_cap_sync, github_workflows_ci_android_job, github_workflows_ci_ios_job, github_workflows_ci_yml_triggers_on_v_tag [EXTRACTED 1.00]

## Communities (55 total, 14 thin omitted)

### Community 0 - "Package Dependencies"

Cohesion: 0.04
Nodes (49): @capacitor/cli, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, husky, jsdom (+41 more)

### Community 1 - "Capacitor Plugins"

Cohesion: 0.05
Nodes (42): @capacitor/android, @capacitor/barcode-scanner, @capacitor/camera, @capacitor/core, @capacitor/filesystem, @capacitor/ios, @capacitor/share, @capacitor/splash-screen (+34 more)

### Community 2 - "React Screens & Routing"

Cohesion: 0.08
Nodes (22): App(), BarcodeScreen, BatchSessionScreen, CameraScreen, CompareScreen, GalleryScreen, HIDE_NAV_ROUTES, HomeScreen (+14 more)

### Community 3 - "Serverless Backend"

Cohesion: 0.17
Nodes (20): Env, handleDiscogs(), JSON_HEADERS, handleIdentify(), JSON_HEADERS, corsHeaders(), fetch(), json() (+12 more)

### Community 4 - "Project Configuration"

Cohesion: 0.08
Nodes (26): lint-staged, _.{json,css,md}, _.{ts,tsx}, name, private, scripts, build, cap:open:android (+18 more)

### Community 5 - "TypeScript App Config"

Cohesion: 0.08
Nodes (25): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations (+17 more)

### Community 6 - "TypeScript Node Config"

Cohesion: 0.10
Nodes (20): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 7 - "Gemini LLM Provider"

Cohesion: 0.17
Nodes (13): GeminiContent, GeminiPart, geminiProvider, GeminiRequest, GeminiResponse, providers, openAICompatProvider, OpenAIRequest (+5 more)

### Community 8 - "UI Components"

Cohesion: 0.13
Nodes (14): AROverlay, conditions, ConditionSelector, ConditionSelectorProps, currencies, CurrencySelector, CurrencySelectorProps, ProgressIndicator (+6 more)

### Community 9 - "Documentation & Architecture"

Cohesion: 0.13
Nodes (16): App Architecture Layers, i18n Namespace System, Tailwind CSS v4 Setup, TypeScript 6.0 Quirks, Vitest Configuration, 5-Scan Free Trial, Capacitor v8, Dexie IndexedDB (+8 more)

### Community 10 - "PWA Manifest"

Cohesion: 0.12
Nodes (16): background_color, categories, description, display, icons, id, name, orientation (+8 more)

### Community 11 - "Serverless Dependencies"

Cohesion: 0.14
Nodes (13): @cloudflare/workers-types, devDependencies, @cloudflare/workers-types, wrangler, name, private, scripts, deploy (+5 more)

### Community 12 - "API Service Client"

Cohesion: 0.31
Nodes (9): DiscogsBarcodeResult, fetchWithRetry(), IdentifyResponse, identifyVinyl(), isOffline(), NetworkError, OfflineError, searchDiscogsBarcode() (+1 more)

### Community 13 - "Type Definitions"

Cohesion: 0.18
Nodes (9): Currency, Folder, RarityTier, ScanResult, SimilarRelease, Tag, VinylCondition, VinylRecord (+1 more)

### Community 14 - "In-App Purchase"

Cohesion: 0.40
Nodes (8): InAppPurchase, purchaseAndroid(), purchaseFullVersion(), purchaseIOS(), PurchaseResult, restoreAndroid(), restoreIOS(), restorePurchases()

### Community 15 - "Mobile Deployment Pipeline"

Cohesion: 0.25
Nodes (9): Capacitor Sync, EAS Build, Mobile Deployment Dual Pathway, Android Native Build, iOS Native Build, GitHub Actions CI, CI Workflow, Vite Build (+1 more)

### Community 16 - "Zustand State Store"

Cohesion: 0.32
Nodes (5): AppState, useAppStore, ScanStage, ScanState, useScanStore

### Community 17 - "Library Screen"

Cohesion: 0.29
Nodes (3): RARITY_ORDER, SortKey, ViewMode

### Community 18 - "LLM Research Concepts"

Cohesion: 0.33
Nodes (6): Discogs API, LLM Processing Pipeline, Multi-Model LLM Architecture, Rarity Tier System, Research LLM, Vision LLM

### Community 20 - "Expo/EAS Config"

Cohesion: 0.40
Nodes (4): projectId, expo, extra, eas

### Community 23 - "Barcode Detector Types"

Cohesion: 0.40
Nodes (3): BarcodeDetector, BarcodeDetectorConstructor, BarcodeDetectorResult

### Community 26 - "Camera Screen"

Cohesion: 0.83
Nodes (3): CameraScreen(), captureWithCapacitor(), dataUrlToBlob()

## Knowledge Gaps

- **211 isolated node(s):** `projectId`, `config`, `name`, `private`, `version` (+206 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Package Dependencies` to `Project Configuration`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Capacitor Plugins` to `Project Configuration`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `projectId`, `config`, `name` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Capacitor Plugins` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `React Screens & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.08374384236453201 - nodes in this community are weakly interconnected._
- **Should `Project Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
