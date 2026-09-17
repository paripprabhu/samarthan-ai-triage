export type SupportedLanguage =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'bn' // Bengali (বাংলা)
  | 'mr' // Marathi (मराठी)
  | 'te' // Telugu (తెలుగు)
  | 'ta' // Tamil (தமிழ்)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'ur' // Urdu (اردو)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'as' // Assamese (অসমীয়া)
  | 'ne' // Nepali (नेपाली)
  | 'sd' // Sindhi (سنڌي)

/** App languages with a first-party Whisper ISO-639-1 hint. */
export type WhisperSupportedLanguage = Exclude<SupportedLanguage, 'or'>

export interface LanguageMeta {
  code: SupportedLanguage
  name: string
  nativeName: string
  script: string
  /** ISO hint accepted by the deployed Whisper model, if one is available. */
  whisperCode: string | null
  rtl?: boolean
  sampleState: string
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', whisperCode: 'en', sampleState: 'National / Central' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', whisperCode: 'hi', sampleState: 'North & Central India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', whisperCode: 'bn', sampleState: 'West Bengal & Tripura' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', whisperCode: 'mr', sampleState: 'Maharashtra' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', whisperCode: 'te', sampleState: 'Andhra Pradesh & Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', whisperCode: 'ta', sampleState: 'Tamil Nadu & Puducherry' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', whisperCode: 'gu', sampleState: 'Gujarat' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', whisperCode: 'ur', rtl: true, sampleState: 'National / J&K / Telangana' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', whisperCode: 'kn', sampleState: 'Karnataka' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', whisperCode: null, sampleState: 'Odisha' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', whisperCode: 'ml', sampleState: 'Kerala' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', whisperCode: 'pa', sampleState: 'Punjab' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali–Assamese', whisperCode: 'as', sampleState: 'Assam' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', whisperCode: 'ne', sampleState: 'Sikkim & Darjeeling' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', script: 'Perso-Arabic', whisperCode: 'sd', rtl: true, sampleState: 'National / Rajasthan & Gujarat' },
]

export const LANGUAGE_MAP: Record<SupportedLanguage, LanguageMeta> = SUPPORTED_LANGUAGES.reduce((acc, l) => {
  acc[l.code] = l
  return acc
}, {} as Record<SupportedLanguage, LanguageMeta>)

/**
 * Language names returned by speech-to-text services are not consistent: the
 * same language may arrive as an ISO code ("od"), an English name ("Oriya"),
 * or a native name. Keep that boundary in one, deliberately conservative map.
 */
const SPOKEN_LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  en: 'en', eng: 'en', english: 'en',
  hi: 'hi', hin: 'hi', hindi: 'hi', hindustani: 'hi', 'हिंदी': 'hi', 'हिन्दी': 'hi',
  bn: 'bn', ben: 'bn', bengali: 'bn', bangla: 'bn', 'বাংলা': 'bn',
  mr: 'mr', mar: 'mr', marathi: 'mr', 'मराठी': 'mr',
  te: 'te', tel: 'te', telugu: 'te', 'తెలుగు': 'te',
  ta: 'ta', tam: 'ta', tamil: 'ta', 'தமிழ்': 'ta',
  gu: 'gu', guj: 'gu', gujarati: 'gu', 'ગુજરાતી': 'gu',
  ur: 'ur', urd: 'ur', urdu: 'ur', 'اردو': 'ur',
  kn: 'kn', kan: 'kn', kannada: 'kn', 'ಕನ್ನಡ': 'kn',
  or: 'or', od: 'or', ori: 'or', oriya: 'or', odia: 'or', odiya: 'or', 'ଓଡ଼ିଆ': 'or', 'ଓଡିଆ': 'or',
  ml: 'ml', mal: 'ml', malayalam: 'ml', 'മലയാളം': 'ml',
  pa: 'pa', pan: 'pa', punjabi: 'pa', panjabi: 'pa', 'ਪੰਜਾਬੀ': 'pa',
  "as": 'as', asm: 'as', assamese: 'as', 'অসমীয়া': 'as', 'অসমিয়া': 'as',
  ne: 'ne', nep: 'ne', nepali: 'ne', 'नेपाली': 'ne',
  sd: 'sd', snd: 'sd', sindhi: 'sd', 'سنڌي': 'sd', 'सिन्धी': 'sd',
}

/**
 * Whisper's public language list does not include Odia. It remains selectable
 * in the app, but is never sent as an ASR hint or presented as auto-detected.
 */
export function isWhisperSupportedLanguage(language: SupportedLanguage | null | undefined): language is WhisperSupportedLanguage {
  return Boolean(language && LANGUAGE_MAP[language]?.whisperCode)
}

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === 'string' && value in LANGUAGE_MAP
}

/** Returns a supported app language only when a provider's value is unambiguous. */
export function resolveSpokenLanguage(value: unknown): SupportedLanguage | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase().replace(/[_\s]+/g, '-')
  if (!normalized) return null

  // Providers sometimes return a BCP-47 tag (hi-IN / pa-Guru-IN).
  const direct = SPOKEN_LANGUAGE_ALIASES[normalized]
  if (direct) return direct

  // Accept actual BCP-47 tags such as hi-IN and pa-Guru-IN, but do not turn
  // arbitrary provider prose (e.g. "Hindi language detected") into a hint.
  const bcp47 = /^([a-z]{2,3})(?:-[a-z0-9]{2,8})+$/i.exec(normalized)
  if (!bcp47) return null
  const base = bcp47[1].toLowerCase()
  return SPOKEN_LANGUAGE_ALIASES[base] || null
}
