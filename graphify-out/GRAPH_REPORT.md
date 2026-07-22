# Graph Report - vinyl (2026-07-21)

## Corpus Check

- 83 files · ~43,615 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 617 nodes · 667 edges · 69 communities (53 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `8a3179fb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- Package Dependencies
- Capacitor Plugins
- Architecture & Tech Choices
- React Screens & Routing
- Serverless Backend
- Project Configuration
- TypeScript App Config
- TypeScript Node Config
- Gemini LLM Provider
- UI Components
- PWA Manifest
- Serverless Dependencies
- API Service Client
- Capacitor & Native Bridge
- Type Definitions
- In-App Purchase
- Zustand State Store
- Library Screen
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
- Android CI Build
- iOS CI Build
- Phase Development Plan
- Product Requirements Document: Vinyl Identifier
- Vinyl Identifier — Agent Guide
- Tasks
- Tasks
- graph-check.mjs
- Translations
- Tasks
- Tasks
- Tasks
- Tasks
- Implementation Plan & Project Roadmap
- React + TypeScript + Vite
- post-commit

## God Nodes (most connected - your core abstractions)

1. `Vinyl Identifier` - 24 edges
2. `compilerOptions` - 20 edges
3. `scripts` - 19 edges
4. `compilerOptions` - 16 edges
5. `Product Requirements Document: Vinyl Identifier` - 13 edges
6. `Vinyl Identifier — Agent Guide` - 11 edges
7. `Implementation Plan & Project Roadmap` - 11 edges
8. `Mobile App Deployment Pipeline — Configuration Breakdown` - 9 edges
9. `6. Functional Requirements` - 8 edges
10. `Tasks` - 8 edges

## Surprising Connections (you probably didn't know these)

- `Social Icons Sprite Sheet` --references--> `Vinyl Identifier` [INFERRED]
  public/icons.svg → PRD.md
- `Vinyl Identifier Favicon` --references--> `Vinyl Identifier` [EXTRACTED]
  public/favicon.svg → PRD.md
- `Tailwind CSS v4` --rationale_for--> `Vinyl Identifier` [EXTRACTED]
  AGENTS.md → PRD.md
- `Capacitor v8` --rationale_for--> `Vinyl Identifier` [EXTRACTED]
  AGENTS.md → PRD.md
- `i18next` --rationale_for--> `Vinyl Identifier` [EXTRACTED]
  AGENTS.md → PRD.md

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **Vinyl Identifier Technology Stack** — agents_react_19, agents_typescript_6, agents_vite, agents_zustand, agents_tanstack_query, agents_dexie_indexeddb, agents_i18next, agents_tailwind_v4, agents_capacitor_v8, agents_cloudflare_workers [EXTRACTED 1.00]
- **Mobile Build and Deployment Pathways** — docs_eas_build, docs_cap_sync, docs_tag_triggered_ci, docs_eas_profiles, docs_capacitor_config, agents_vite [EXTRACTED 1.00]
- **Vinyl Domain Model Types** — agents_vinyl_record_type, agents_rarity_tier_type, agents_vinyl_condition_type, agents_scan_result_type [EXTRACTED 1.00]

## Communities (69 total, 16 thin omitted)

### Community 0 - "Package Dependencies"

Cohesion: 0.04
Nodes (49): @capacitor/cli, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, husky, jsdom (+41 more)

### Community 1 - "Capacitor Plugins"

Cohesion: 0.05
Nodes (42): @capacitor/android, @capacitor/barcode-scanner, @capacitor/camera, @capacitor/core, @capacitor/filesystem, @capacitor/ios, @capacitor/share, @capacitor/splash-screen (+34 more)

### Community 2 - "Architecture & Tech Choices"

Cohesion: 0.08
Nodes (35): Cloudflare Workers / Edge, Dexie (IndexedDB), i18next, Phase-Based Development, RarityTier Type, React 19, ScanResult Type, Screen/Route System (+27 more)

### Community 3 - "React Screens & Routing"

Cohesion: 0.08
Nodes (22): App(), BarcodeScreen, BatchSessionScreen, CameraScreen, CompareScreen, GalleryScreen, HIDE_NAV_ROUTES, HomeScreen (+14 more)

### Community 4 - "Serverless Backend"

Cohesion: 0.17
Nodes (20): Env, handleDiscogs(), JSON_HEADERS, handleIdentify(), JSON_HEADERS, corsHeaders(), fetch(), json() (+12 more)

### Community 5 - "Project Configuration"

Cohesion: 0.07
Nodes (28): lint-staged, _.{json,css,md}, _.{ts,tsx}, name, private, scripts, build, cap:open:android (+20 more)

### Community 6 - "TypeScript App Config"

Cohesion: 0.08
Nodes (25): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations (+17 more)

### Community 7 - "TypeScript Node Config"

Cohesion: 0.10
Nodes (20): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 8 - "Gemini LLM Provider"

Cohesion: 0.17
Nodes (13): GeminiContent, GeminiPart, geminiProvider, GeminiRequest, GeminiResponse, providers, openAICompatProvider, OpenAIRequest (+5 more)

### Community 9 - "UI Components"

Cohesion: 0.13
Nodes (14): AROverlay, conditions, ConditionSelector, ConditionSelectorProps, currencies, CurrencySelector, CurrencySelectorProps, ProgressIndicator (+6 more)

### Community 10 - "PWA Manifest"

Cohesion: 0.12
Nodes (16): background_color, categories, description, display, icons, id, name, orientation (+8 more)

### Community 11 - "Serverless Dependencies"

Cohesion: 0.14
Nodes (13): @cloudflare/workers-types, devDependencies, @cloudflare/workers-types, wrangler, name, private, scripts, deploy (+5 more)

### Community 12 - "API Service Client"

Cohesion: 0.31
Nodes (9): DiscogsBarcodeResult, fetchWithRetry(), IdentifyResponse, identifyVinyl(), isOffline(), NetworkError, OfflineError, searchDiscogsBarcode() (+1 more)

### Community 13 - "Capacitor & Native Bridge"

Cohesion: 0.07
Nodes (27): Capacitor v8, Android Permissions Stale, Capacitor Sync (cap sync), Capacitor Configuration, CI and EAS Disconnected, EAS Build, EAS Build Profiles, 1. Overall Architecture (+19 more)

### Community 14 - "Type Definitions"

Cohesion: 0.18
Nodes (9): Currency, Folder, RarityTier, ScanResult, SimilarRelease, Tag, VinylCondition, VinylRecord (+1 more)

### Community 15 - "In-App Purchase"

Cohesion: 0.40
Nodes (8): InAppPurchase, purchaseAndroid(), purchaseFullVersion(), purchaseIOS(), PurchaseResult, restoreAndroid(), restoreIOS(), restorePurchases()

### Community 16 - "Zustand State Store"

Cohesion: 0.32
Nodes (5): AppState, useAppStore, ScanStage, ScanState, useScanStore

### Community 17 - "Library Screen"

Cohesion: 0.29
Nodes (3): RARITY_ORDER, SortKey, ViewMode

### Community 19 - "Expo/EAS Config"

Cohesion: 0.40
Nodes (4): projectId, expo, extra, eas

### Community 22 - "Barcode Detector Types"

Cohesion: 0.40
Nodes (3): BarcodeDetector, BarcodeDetectorConstructor, BarcodeDetectorResult

### Community 25 - "Camera Screen"

Cohesion: 0.83
Nodes (3): CameraScreen(), captureWithCapacitor(), dataUrlToBlob()

### Community 56 - "Product Requirements Document: Vinyl Identifier"

Cohesion: 0.09
Nodes (21): 10. Release Criteria (v1.0), 11. Future Considerations (Post-v1.0), 1. Executive Summary, 2. Problem Statement, 3. Target Audience, 4. Platform & Distribution, 5. User Flow, 6.1 Image Capture & Input (+13 more)

### Community 57 - "Vinyl Identifier — Agent Guide"

Cohesion: 0.12
Nodes (15): Architecture, Commands (run in this order), Continuing Development, Graph-first query workflow, Graph freshness, Graph outputs, i18n, Knowledge Graph (source of truth) (+7 more)

### Community 58 - "Tasks"

Cohesion: 0.22
Nodes (9): App Store Submission, Beta Testing, Cloud Build, Deliverables, In-App Purchase, Native Build Configuration, Phase 5: Platform Release (Week 13–14), PWA (+1 more)

### Community 59 - "Tasks"

Cohesion: 0.25
Nodes (8): Backend Infrastructure, Deliverables, Internationalization, Phase 0: Foundation (Week 1–2), Project Scaffolding, State & Data Layer, Tasks, Tooling & Quality

### Community 60 - "graph-check.mjs"

Cohesion: 0.32
Nodes (7): GRAPH_PATH, graphStat, IGNORE_PATTERNS, isSourceFile(), MANIFEST_PATH, SOURCE_EXTENSIONS, staleSourceFiles

### Community 61 - "Translations"

Cohesion: 0.29
Nodes (6): Adding a New Language, Contributing to Vinyl Identifier, Questions?, String Keys, Translation Guidelines, Translations

### Community 62 - "Tasks"

Cohesion: 0.29
Nodes (7): Accessibility, Compare Mode, Deliverables, Internationalization, Performance, Phase 4: Compare Mode & Polish (Week 11–12), Tasks

### Community 63 - "Tasks"

Cohesion: 0.29
Nodes (7): Barcode Scanning, Deliverables, Image Capture, Phase 1: Core Scan Flow (Week 3–5), Processing Pipeline, Report Screen, Tasks

### Community 64 - "Tasks"

Cohesion: 0.29
Nodes (7): Batch Mode, Deliverables, Export & Share, Offline Support, Phase 2: Scan Enhancements (Week 6–7), Scan History, Tasks

### Community 65 - "Tasks"

Cohesion: 0.29
Nodes (7): Collection Export, Deliverables, Library Views, Organization, Phase 3: Collection Library (Week 8–10), Search & Filter, Tasks

### Community 66 - "Implementation Plan & Project Roadmap"

Cohesion: 0.33
Nodes (5): Effort Summary, Implementation Plan & Project Roadmap, Post-MVP Feature Backlog, Risk Register, Timeline Overview

### Community 67 - "React + TypeScript + Vite"

Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps

- **302 isolated node(s):** `projectId`, `config`, `name`, `private`, `version` (+297 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Package Dependencies` to `Project Configuration`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Capacitor Plugins` to `Project Configuration`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Vinyl Identifier` connect `Architecture & Tech Choices` to `Vinyl Identifier — Agent Guide`, `Capacitor & Native Bridge`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `projectId`, `config`, `name` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Capacitor Plugins` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Architecture & Tech Choices` be split into smaller, more focused modules?**
  _Cohesion score 0.0773109243697479 - nodes in this community are weakly interconnected._
