# Vinyl Identifier — Agent Guide

## Commands (run in this order)

```
npm run lint       # ESLint on src/
npm run typecheck  # tsc -p tsconfig.app.json --noEmit
npm run test       # vitest run
npm run build      # vite build
```

CI (`.github/workflows/ci.yml`) runs the same sequence. Use `npm run dev` for dev server, `npm run test:watch` for TDD.

## TypeScript quirks

- **vite.config.ts is NOT type-checked** by `tsc`. It lives outside the tsconfig project references. Don't run `tsc -b` — the `-b` flag will fail. Use `tsc -p tsconfig.app.json --noEmit` for typechecking.
- **TS 6.0** with `"ignoreDeprecations": "6.0"` — `baseUrl`+`paths` is deprecated in TS7 but still works here.
- **`verbatimModuleSyntax: true`** — use `import type` for type-only imports or you'll get runtime errors.
- **`@/` path alias** maps to `src/`. Always use it.
- **`noUnusedLocals` + `noUnusedParameters`** are on. Prefix unused params with `_`.

## Vitest

Config lives in `package.json` under the `"vitest"` key (not a separate file). Environment is `jsdom`, globals enabled. Setup file at `src/test/setup.ts`.

## Tailwind CSS v4

No config file. Imported via `@import "tailwindcss"` in `src/index.css`. Configured as a Vite plugin (`@tailwindcss/vite`). No `tailwind.config.*` to edit.

## Architecture

See `PRD.md` §8 (Technology Choices) for the full rationale behind each choice.

| Layer         | Tech                        | Location                            | Key files                                                                       |
| ------------- | --------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- |
| Framework     | React 19 + TypeScript 6     | `src/`                              | `src/App.tsx`, `src/main.tsx`                                                   |
| Routing       | react-router-dom v7         | `src/App.tsx` (all routes)          | `src/App.tsx`                                                                   |
| Client state  | Zustand                     | `src/store/`                        | `src/store/useAppStore.ts` (app state), `src/store/useScanStore.ts` (scan flow) |
| Server state  | TanStack Query              | providers in `src/main.tsx`         | `src/main.tsx` (QueryClientProvider), `src/services/api.ts` (query fns)         |
| Local DB      | Dexie (IndexedDB)           | `src/db/schema.ts`                  | `src/db/schema.ts` (VinylDatabase class), `src/db/index.ts` (singleton)         |
| i18n          | i18next + react-i18next v17 | `src/i18n/`, locale: `en.json`      | `src/i18n/index.ts` (init), `src/i18n/en.json` (strings)                        |
| Styling       | Tailwind v4                 | `src/index.css`                     | `src/index.css` (`@import "tailwindcss"`)                                       |
| Native bridge | Capacitor v8                | `capacitor.config.ts`               | `capacitor.config.ts`, `src/services/api.ts`                                    |
| Backend       | Serverless (Workers/Edge)   | `serverless/` (separate from build) | `serverless/src/functions/identify.ts`, `serverless/src/functions/discogs.ts`   |

- **No user accounts.** Everything is local-first via IndexedDB/Dexie. The Zustand store tracks scan count for the 5-scan free trial.
- **App entrypoint:** `src/main.tsx` mounts QueryClientProvider → BrowserRouter → App. i18n is initialized via side-effect import.
- **Pre-commit hook:** `lint-staged` runs `eslint --fix` and `prettier --write` on staged files. Hook lives in `.husky/pre-commit`.
- **ESLint ignores** `dist/` and `serverless/`.
- **Serverless directory** is front-adjacent but not part of the frontend build pipeline. The `src/services/api.ts` talks to it at `VITE_API_URL`.

## i18n

All user-facing strings live in `src/i18n/en.json`. To add a new string, add the key in the relevant namespace (`nav`, `home`, `scan`, `report`, `rarity`, `condition`, `library`, `compare`, `settings`, `common`). Use `useTranslation()` from `react-i18next` — never hardcode display text.

## Types

All types in `src/types/record.ts`. Key domain types: `VinylRecord`, `RarityTier`, `VinylCondition`, `Currency`, `ScanResult`, `Folder`, `Tag`. Import via `@/types` barrel.

## Screens / Routes

Each screen is a file in `src/screens/`. Routes defined in `src/App.tsx`. Current routes: `/`, `/scan/camera`, `/scan/gallery`, `/scan/barcode`, `/report/:id`, `/library`, `/compare`, `/settings`.

## Continuing Development

This project is built in phases defined in `ROADMAP.md`. Product requirements are in `PRD.md`.

- **Phase 0 (complete):** Project scaffolded, tooling configured (TS, ESLint, Prettier, Husky, CI), Capacitor initialized, all dependencies installed, directory structure created, screens stubbed, backend scaffolded.
- **Next:** Phase 1 — Core scan flow.

When picking up work:

1. Read `ROADMAP.md` to understand the current phase and task breakdown.
2. Check `PRD.md` for functional requirements and priority.
3. After making changes, run the full quality pipeline: `npm run lint && npm run typecheck && npm run test && npm run build`.
4. If the pre-commit hook fails, install missing tools (`prettier`, etc.) and retry.
5. Commit frequently with descriptive messages following conventional commit style.
