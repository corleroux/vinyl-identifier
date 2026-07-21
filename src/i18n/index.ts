/**
 * i18n initialization — i18next + react-i18next with locale files in this directory.
 * @see AGENTS.md#i18n — Namespace system and locale structure
 * @see AGENTS.md#architecture — i18n layer
 * @see PRD.md §8 — Technology Choices (i18next rationale)
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en.json'

const resources = {
  en: { translation: en },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage'],
      caches: ['localStorage'],
    },
  })

export default i18n
