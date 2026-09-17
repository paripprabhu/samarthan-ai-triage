'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneCall, X, Headset, CheckCircle2 } from 'lucide-react'

import { ComplaintUpdate } from '@/hooks/useComplaints'
import { SupportedLanguage } from '@/lib/i18n/languages'

interface CallOperatorModalProps {
  open: boolean
  onClose: () => void
  hotline: string
  hi: boolean
  language?: SupportedLanguage
  incidentId: string
  fraudType: string
  amount: number
  summary: string
  followUpPoints?: string[]
  updates?: ComplaintUpdate[]
}

type Step = 'connecting' | 'connected'

export default function CallOperatorModal({
  open, onClose, hotline, hi, language, incidentId, fraudType, amount, summary, followUpPoints = [], updates = [],
}: CallOperatorModalProps) {
  const [step, setStep] = useState<Step>('connecting')

  useEffect(() => {
    if (!open) {
      setStep('connecting')
      return
    }
    const timer = setTimeout(() => setStep('connected'), 2200)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={hi ? `${hotline} ऑपरेटर कॉल` : `${hotline} operator call`}
          >
            <button onClick={onClose} aria-label="Close dialog" className="absolute right-4 top-4 z-10 cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <X className="w-4 h-4" />
            </button>

            {step === 'connecting' && (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 ring-1 ring-red-100">
                    <PhoneCall className="w-7 h-7 text-red-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {hi ? `${hotline} से जुड़ रहे हैं…` : `Starting ${hotline} call demo…`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {hi ? 'ऑपरेटर को आपकी शिकायत का डेटा भेजा जा रहा है' : 'Your report will not be sent to an operator'}
                  </p>
                </div>
                <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  {hi ? 'डेमो' : 'Demo'}
                </span>
              </div>
            )}

            {step === 'connected' && (
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-600 shadow-sm">
                    <Headset className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground">
                      {hi ? 'ऑपरेटर से जुड़ गए' : 'Demo call ready'}
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </h2>
                    <p className="text-xs text-muted-foreground">{hi ? `हेल्पलाइन ${hotline}` : `Helpline ${hotline}`}</p>
                  </div>
                </div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {hi ? 'ऑपरेटर को भेजा गया डेटा' : 'Report details'}
                </p>
                <div className="mb-4 max-h-[260px] space-y-2 overflow-y-auto rounded-lg border border-border bg-surface p-4 text-xs text-foreground">
                  <p><span className="text-muted-foreground">{hi ? 'घटना ID' : 'Incident ID'}:</span> <span className="font-semibold">{incidentId}</span></p>
                  <p><span className="text-muted-foreground">{hi ? 'श्रेणी' : 'Category'}:</span> {fraudType}</p>
                  {amount > 0 && <p><span className="text-muted-foreground">{hi ? 'राशि' : 'Amount'}:</span> ₹{amount.toLocaleString('en-IN')}</p>}
                  
                  {/* Initial summary */}
                  <div className="pt-1">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {hi ? 'प्रारंभिक सारांश:' : 'Report summary:'}
                    </p>
                    <p className="rounded-md border border-border bg-card p-2.5 leading-relaxed text-foreground">
                      {summary}
                    </p>
                  </div>

                  {/* Fresh Updates / Additional Info */}
                  {updates.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        {hi ? 'नई जानकारी / पूरक विवरण:' : 'New details:'}
                      </p>
                      {updates.map((u, i) => (
                        <div key={u.id || i} className="bg-blue-50/70 border border-blue-200/60 rounded-md p-2.5 space-y-1">
                          <p className="text-xs text-blue-950 font-medium leading-snug">
                            {u.note}
                          </p>
                          {((hi ? u.actionPointsHi : u.actionPoints) || []).length > 0 && (
                            <ul className="space-y-0.5 pt-1 border-t border-blue-200/40 text-xs text-blue-800">
                              {((hi ? u.actionPointsHi : u.actionPoints) || []).map((pt, ptIdx) => (
                                <li key={ptIdx} className="flex gap-1">
                                  <span>•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {updates.length === 0 && followUpPoints.length > 0 && (
                    <div className="border-t border-border pt-2">
                      <p className="mb-1 text-muted-foreground">{hi ? 'नई जानकारी:' : 'Updates:'}</p>
                      <ul className="space-y-0.5">
                        {followUpPoints.map((p, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span className="text-muted-foreground">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <a
                  href={`tel:${hotline}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  {hi ? `${hotline} पर वास्तविक कॉल करें` : `Call ${hotline} now`}
                </a>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {hi ? 'यह डेमो है • ऑपरेटर को डेटा वास्तव में नहीं भेजा गया' : 'Demo only • no report was sent to a real operator'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
