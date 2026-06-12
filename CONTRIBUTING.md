# Contributing to Vinyl Identifier

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
