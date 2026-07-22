# Graph Report - . (2026-07-22)

## Corpus Check

- 20 files · ~47,946 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 658 nodes · 717 edges · 72 communities (53 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

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
- Analytics Service
- Bottom Navigation
- Lazy Image Component
- Format Utilities
- Platform Utilities
- TypeScript Base Config
- Capacitor Config
- Offline Banner
- Batch Session Screen
- Gallery Screen
- Home Screen
- Manual Input Screen
- Paywall Screen
- Processing Screen
- Report Screen
- E2E Tests
- ESLint Config
- Android CI Build
- iOS CI Build
- Tasks
- Tasks
- React + TypeScript + Vite

## God Nodes (most connected - your core abstractions)

1. `Tasks` - 33 edges
2. `Vinyl Identifier` - 24 edges
3. `compilerOptions` - 20 edges
4. `scripts` - 19 edges
5. `compilerOptions` - 16 edges
6. `Product Requirements Document: Vinyl Identifier` - 13 edges
7. `Vinyl Identifier — Agent Guide` - 11 edges
8. `Implementation Plan & Project Roadmap` - 11 edges
9. `Mobile App Deployment Pipeline — Configuration Breakdown` - 9 edges
10. `6. Functional Requirements` - 8 edges

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

## Communities (72 total, 19 thin omitted)

### Community 0 - "Package Dependencies"

Cohesion: 0.04
Nodes (49): @capacitor/cli, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, husky, jsdom (+41 more)

### Community 1 - "Capacitor Plugins"

Cohesion: 0.05
Nodes (41): @capacitor/android, @capacitor/barcode-scanner, @capacitor/camera, @capacitor/core, @capacitor/filesystem, @capacitor/ios, @capacitor/splash-screen, dexie (+33 more)

### Community 2 - "Architecture & Tech Choices"

Cohesion: 0.06
Nodes (39): Accessibility, App Store Submission, Backend Infrastructure, Barcode Scanning, Batch Mode, Beta Testing, Cloud Build, Collection Export (+31 more)

### Community 3 - "React Screens & Routing"

Cohesion: 0.12
Nodes (26): Env, handleDiscogs(), JSON_HEADERS, handleGradeCondition(), JSON_HEADERS, handleIdentify(), JSON_HEADERS, handleSyncGet() (+18 more)

### Community 4 - "Serverless Backend"

Cohesion: 0.08
Nodes (35): Cloudflare Workers / Edge, Dexie (IndexedDB), i18next, Phase-Based Development, RarityTier Type, React 19, ScanResult Type, Screen/Route System (+27 more)

### Community 5 - "Project Configuration"

Cohesion: 0.08
Nodes (24): App(), BarcodeScreen, BatchSessionScreen, CameraScreen, CompareScreen, ConditionGradeScreen, GalleryScreen, HIDE_NAV_ROUTES (+16 more)

### Community 6 - "TypeScript App Config"

Cohesion: 0.07
Nodes (28): lint-staged, _.{json,css,md}, _.{ts,tsx}, name, private, scripts, build, cap:open:android (+20 more)

### Community 7 - "TypeScript Node Config"

Cohesion: 0.07
Nodes (27): Capacitor v8, Android Permissions Stale, Capacitor Sync (cap sync), Capacitor Configuration, CI and EAS Disconnected, EAS Build, EAS Build Profiles, 1. Overall Architecture (+19 more)

### Community 8 - "Gemini LLM Provider"

Cohesion: 0.08
Nodes (25): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations (+17 more)

### Community 9 - "UI Components"

Cohesion: 0.16
Nodes (20): ConditionGradeResponse, DiscogsBarcodeResult, fetchWithRetry(), gradeCondition(), IdentifyResponse, identifyVinyl(), isOffline(), NetworkError (+12 more)

### Community 10 - "PWA Manifest"

Cohesion: 0.09
Nodes (21): 10. Release Criteria (v1.0), 11. Future Considerations (Post-v1.0), 1. Executive Summary, 2. Problem Statement, 3. Target Audience, 4. Platform & Distribution, 5. User Flow, 6.1 Image Capture & Input (+13 more)

### Community 11 - "Serverless Dependencies"

Cohesion: 0.10
Nodes (20): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 12 - "API Service Client"

Cohesion: 0.16
Nodes (13): GeminiContent, GeminiPart, geminiProvider, GeminiRequest, GeminiResponse, providers, openAICompatProvider, OpenAIRequest (+5 more)

### Community 13 - "Capacitor & Native Bridge"

Cohesion: 0.12
Nodes (16): background_color, categories, description, display, icons, id, name, orientation (+8 more)

### Community 14 - "Type Definitions"

Cohesion: 0.14
Nodes (6): checkPriceAlerts(), generateAlertMessage(), getEnabledAlerts(), getUnreadNotifications(), markAllNotificationsRead(), PriceCheckResult

### Community 15 - "In-App Purchase"

Cohesion: 0.12
Nodes (15): Architecture, Commands (run in this order), Continuing Development, Graph-first query workflow, Graph freshness, Graph outputs, i18n, Knowledge Graph (source of truth) (+7 more)

### Community 16 - "Zustand State Store"

Cohesion: 0.14
Nodes (13): @cloudflare/workers-types, devDependencies, @cloudflare/workers-types, wrangler, name, private, scripts, deploy (+5 more)

### Community 17 - "Library Screen"

Cohesion: 0.14
Nodes (12): ConditionGrade, Currency, Folder, PriceAlert, PriceAlertNotification, RarityTier, ScanResult, SimilarRelease (+4 more)

### Community 18 - "Export Utilities"

Cohesion: 0.40
Nodes (8): InAppPurchase, purchaseAndroid(), purchaseFullVersion(), purchaseIOS(), PurchaseResult, restoreAndroid(), restoreIOS(), restorePurchases()

### Community 19 - "Expo/EAS Config"

Cohesion: 0.32
Nodes (7): GRAPH_PATH, graphStat, IGNORE_PATTERNS, isSourceFile(), MANIFEST_PATH, SOURCE_EXTENSIONS, staleSourceFiles

### Community 20 - "Service Worker"

Cohesion: 0.32
Nodes (5): AppState, useAppStore, ScanStage, ScanState, useScanStore

### Community 21 - "Database Schema"

Cohesion: 0.29
Nodes (6): Adding a New Language, Contributing to Vinyl Identifier, Questions?, String Keys, Translation Guidelines, Translations

### Community 22 - "Barcode Detector Types"

Cohesion: 0.29
Nodes (3): RARITY_ORDER, SortKey, ViewMode

### Community 24 - "Install Prompt"

Cohesion: 0.40
Nodes (4): projectId, expo, extra, eas

### Community 26 - "Compare Screen"

Cohesion: 0.40
Nodes (4): ProgressIndicator, ProgressIndicatorProps, Step, steps

### Community 28 - "Analytics Service"

Cohesion: 0.40
Nodes (3): BarcodeDetector, BarcodeDetectorConstructor, BarcodeDetectorResult

### Community 30 - "Lazy Image Component"

Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 31 - "Format Utilities"

Cohesion: 0.50
Nodes (3): conditions, ConditionSelector, ConditionSelectorProps

### Community 32 - "Platform Utilities"

Cohesion: 0.50
Nodes (3): currencies, CurrencySelector, CurrencySelectorProps

### Community 35 - "Offline Banner"

Cohesion: 0.50
Nodes (3): RarityBadge, RarityBadgeProps, tierColors

### Community 36 - "Batch Session Screen"

Cohesion: 0.83
Nodes (3): CameraScreen(), captureWithCapacitor(), dataUrlToBlob()

## Knowledge Gaps

- **312 isolated node(s):** `projectId`, `config`, `name`, `private`, `version` (+307 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Package Dependencies` to `TypeScript App Config`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Capacitor Plugins` to `TypeScript App Config`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Vinyl Identifier` connect `Serverless Backend` to `In-App Purchase`, `TypeScript Node Config`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `projectId`, `config`, `name` to the rest of the system?**
  _312 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Capacitor Plugins` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `Architecture & Tech Choices` be split into smaller, more focused modules?**
  _Cohesion score 0.05641025641025641 - nodes in this community are weakly interconnected._
