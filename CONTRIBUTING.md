# Contributing to Vinyl Identifier

## Development workflow

### Picking up work

1. Check `ROADMAP.md` for the current phase and outstanding tasks.
2. Create a branch from `main`:
   ```bash
   git checkout -b feat/cloud-sync
   ```
   Use prefixes: `feat/`, `fix/`, `chore/`, `docs/`.

### Making changes

1. Implement the feature or fix.
2. Commit frequently with conventional messages (`feat:`, `fix:`, `chore:`, `docs:`).
3. Run the quality pipeline before pushing:
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run build
   ```

### Opening a pull request

1. Push your branch and open a PR against `main`:
   ```bash
   git push -u origin feat/cloud-sync
   gh pr create
   ```
2. Fill in the PR template — reference the roadmap phase/task.
3. CI must pass (lint, typecheck, test, build) before merging.
4. Merge to `main` via squash merge preferred.

### Branch protection (recommended)

Set these rules on `main` in GitHub Settings > Branches:

- Require pull request before merging
- Require status checks to pass (`PR Check`)
- Disallow force pushes

---

## Translations

We welcome translations! Here's how to contribute:

### Adding a New Language

1. Create a new locale file in `src/i18n/` (e.g., `fr.json`, `es.json`)
2. Copy the structure from `src/i18n/en.json`
3. Translate all strings, keeping the same keys
4. Add the import in `src/i18n/index.ts`:
   ```ts
   import fr from './fr.json'
   // Add to resources:
   fr: { translation: fr },
   ```
5. Add the language option in `src/screens/SettingsScreen.tsx`:
   ```ts
   { value: 'fr', label: 'Fran\u00e7ais' }
   ```

### Translation Guidelines

- Keep translations concise for mobile UI
- Use proper capitalization for your language
- Maintain placeholders like `{{count}}` exactly as-is
- Test that translations fit in UI elements (buttons, labels)
- Use gender-neutral language where possible

### String Keys

All strings are organized by namespace:

- `nav` - Navigation labels
- `home` - Home screen
- `scan` - Scan flow
- `report` - Report screen
- `rarity` - Rarity tiers
- `condition` - Vinyl conditions
- `library` - Collection library
- `compare` - Compare mode
- `settings` - Settings screen
- `common` - Shared strings
- `export` - Export labels

### Questions?

Open an issue on GitHub with the `translation` label.
