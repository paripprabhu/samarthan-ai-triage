'use client'

import { useCallback } from 'react'

export interface DigiLockerUser {
  name: string
  aadhaar: string   // masked e.g. ****-****-1234
  dob: string
  verified: boolean
}

export const DEFAULT_USER: DigiLockerUser = {
  name: 'Aarav Sharma',
  aadhaar: '****-****-8421',
  dob: '15/03/1994',
  verified: true,
}

const STORAGE_KEY = 'samarthan_user'

export function useAuth() {
  const getUser = useCallback((): DigiLockerUser | null => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw || raw === 'SIGNED_OUT') return null
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && parsed.verified && typeof parsed.name === 'string' && parsed.name.trim()) {
        return parsed
      }
      return null
    } catch {
      return null
    }
  }, [])

  const signIn = useCallback((customUser?: Partial<DigiLockerUser>) => {
    if (typeof window === 'undefined') return null
    const user: DigiLockerUser = {
      name: customUser?.name?.trim() || 'Aarav Sharma',
      aadhaar: customUser?.aadhaar?.trim() || '****-****-8421',
      dob: customUser?.dob || '15/03/1994',
      verified: true,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    window.dispatchEvent(new Event('samarthan_auth_change'))
    return user
  }, [])

  const signOut = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, 'SIGNED_OUT')
    window.dispatchEvent(new Event('samarthan_auth_change'))
  }, [])

  return { getUser, signIn, signOut }
}
