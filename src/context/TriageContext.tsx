'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { TriageResult } from '@/data/scenarios'
import { SupportedLanguage, isSupportedLanguage, LANGUAGE_MAP } from '@/lib/i18n/languages'

export type Language = SupportedLanguage
export type LanguagePreference = 'auto' | 'manual'
export type InputType = 'voice' | 'screenshot' | 'text'

interface TriageContextValue {
  language: Language
  languagePreference: LanguagePreference
  setLanguage: (l: Language) => void
  scenarioId: string | null
  setScenarioId: (id: string | null) => void
  inputType: InputType
  setInputType: (t: InputType) => void
  triageResult: TriageResult | null
  setTriageResult: (r: TriageResult | null) => void
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  sharedImage: File | null
  setSharedImage: (f: File | null) => void
  reset: () => void
}

const TriageContext = createContext<TriageContextValue | undefined>(undefined)

const STORAGE_KEY = 'samarthan_triage_v1'

export function TriageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [languagePreference, setLanguagePreference] = useState<LanguagePreference>('auto')
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [inputType, setInputType] = useState<InputType>('text')
  const [triageResult, setTriageResultState] = useState<TriageResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sharedImage, setSharedImage] = useState<File | null>(null)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.triageResult) setTriageResultState(parsed.triageResult)
        if (parsed.scenarioId) setScenarioId(parsed.scenarioId)
        if (isSupportedLanguage(parsed.language)) {
          setLanguageState(parsed.language as Language)
          // Older saved sessions had no preference flag. They came from a
          // deliberate picker choice, so preserve them as manual rather than
          // allowing a new automatic detector to overwrite them.
          setLanguagePreference(parsed.languagePreference === 'auto' ? 'auto' : 'manual')
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Synchronize document language and directionality for Urdu and Sindhi.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
      document.documentElement.dir = LANGUAGE_MAP[language].rtl ? 'rtl' : 'ltr'
    }
  }, [language])

  const setLanguage = (l: Language) => {
    setLanguageState(l)
    setLanguagePreference('manual')
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : {}
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, language: l, languagePreference: 'manual' }))
    } catch { /* ignore storage errors */ }
  }

  const setTriageResult = (r: TriageResult | null) => {
    setTriageResultState(r)
    try {
      if (r) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ triageResult: r, scenarioId, language, languagePreference }))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }

  const reset = () => {
    setScenarioId(null)
    setInputType('text')
    setTriageResultState(null)
    setIsLoading(false)
    setSharedImage(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  const value = React.useMemo(() => ({
    language, languagePreference, setLanguage,
    scenarioId, setScenarioId,
    inputType, setInputType,
    triageResult, setTriageResult,
    isLoading, setIsLoading,
    sharedImage, setSharedImage,
    reset,
  }), [language, languagePreference, scenarioId, inputType, triageResult, isLoading, sharedImage])

  return (
    <TriageContext.Provider value={value}>
      {children}
    </TriageContext.Provider>
  )
}

export function useTriage() {
  const ctx = useContext(TriageContext)
  if (!ctx) throw new Error('useTriage must be used within <TriageProvider>')
  return ctx
}
