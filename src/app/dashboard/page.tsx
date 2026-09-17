'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Share2, Printer, RotateCcw, Edit3, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react'
import { useTriage } from '@/context/TriageContext'
import UrgencyBadge from '@/components/UrgencyBadge'
import FreezeStepper from '@/components/FreezeStepper'
import PrintableComplaint from '@/components/PrintableComplaint'
import EvidenceVault from '@/components/EvidenceVault'
import SmartActions from '@/components/SmartActions'
import FIRTracker from '@/components/FIRTracker'
import Navbar from '@/components/Navbar'
import CallOperatorModal from '@/components/CallOperatorModal'
import ApplicableLaws from '@/components/ApplicableLaws'
import ComplaintUpdates from '@/components/ComplaintUpdates'
import CompulsoryDetailsReminder from '@/components/CompulsoryDetailsReminder'
import { useComplaints, EvidenceImage, ComplaintUpdate } from '@/hooks/useComplaints'
import { ComplaintStatus } from '@/data/scenarios'
import { SupportedLanguage, LANGUAGE_MAP } from '@/lib/i18n/languages'
import { getTranslation } from '@/lib/i18n/translations'
import { SCREEN_COPY } from '@/lib/i18n/screenCopy'
import { DASHBOARD_EXTRA_I18N, CRIME_CATEGORY_LABELS_12, EVIDENCE_VAULT_I18N } from '@/lib/i18n/componentTranslations'

const VOICE_DETECTED_LABEL: Record<SupportedLanguage, string> = {
  en: 'Voice detected', hi: 'पहचानी गई आवाज़', bn: 'শনাক্ত করা ভাষা', mr: 'ओळखलेली भाषा',
  te: 'గుర్తించిన భాష', ta: 'கண்டறியப்பட்ட மொழி', gu: 'ઓળખાયેલી ભાષા', ur: 'شناخت شدہ زبان',
  kn: 'ಗುರುತಿಸಿದ ಭಾಷೆ', or: 'ଚିହ୍ନଟ ଭାଷା', ml: 'കണ്ടെത്തിയ ഭാഷ', pa: 'ਪਛਾਣੀ ਗਈ ਭਾਸ਼ਾ',
  "as": 'ভাষা চিনাক্ত কৰা হৈছে',
  ne: 'भाषा पहिचान भयो',
  sd: 'ٻولي سڃاتي وئي',
}

const REPORT_LANGUAGE_LABEL: Record<SupportedLanguage, string> = {
  en: 'Report language', hi: 'रिपोर्ट की भाषा', bn: 'রিপোর্টের ভাষা', mr: 'अहवालाची भाषा',
  te: 'నివేదిక భాష', ta: 'அறிக்கை மொழி', gu: 'રિપોર્ટની ભાષા', ur: 'رپورٹ کی زبان',
  kn: 'ವರದಿ ಭಾಷೆ', or: 'ରିପୋର୍ଟ ଭାଷା', ml: 'റിപ്പോർട്ട് ഭാഷ', pa: 'ਰਿਪੋਰਟ ਦੀ ਭਾਸ਼ਾ',
  "as": 'ৰিপোর্টৰ ভাষা',
  ne: 'रिपोर्टको भाषा',
  sd: 'رپورٽ جي ٻولي',
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramId = searchParams?.get('id')
  const { triageResult, setTriageResult, language, setLanguage, reset, sharedImage } = useTriage()
  const t = getTranslation(language)
  const screenCopy = SCREEN_COPY[language]
  const dashLoc = DASHBOARD_EXTRA_I18N[language] || DASHBOARD_EXTRA_I18N.en
  const meta = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
  const [activeDraftTab, setActiveDraftTab] = useState<'english' | 'regional'>(language === 'en' ? 'english' : 'regional')
  const { save, getById, advanceStatus, setStatusAtLeast, addEvidenceImage, removeEvidenceImage, addUpdate } = useComplaints()
  const [status, setStatus] = useState<ComplaintStatus>('SUBMITTED')
  const [evidenceImages, setEvidenceImages] = useState<EvidenceImage[]>([])
  const [updates, setUpdates] = useState<ComplaintUpdate[]>([])
  const [callModalHotline, setCallModalHotline] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [loadingRecord, setLoadingRecord] = useState(Boolean(paramId && triageResult?.incidentId !== paramId))
  const hi = language === 'hi'
  const mounted = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialSavedFor = useRef<string | null>(null)
  const paramIdRef = useRef<string | null>(paramId)
  paramIdRef.current = paramId

  useEffect(() => {
    setTimeout(() => { mounted.current = true }, 0)
  }, [])

  // Load complaint if paramId is present in URL
  useEffect(() => {
    if (!paramId) {
      if (mounted.current && !triageResult) {
        router.replace('/')
      }
      return
    }

    if (triageResult && triageResult.incidentId === paramId) {
      setLoadingRecord(false)
      return
    }

    let isCancelled = false
    setLoadingRecord(true)

    getById(paramId)
      .then(record => {
        if (isCancelled || paramIdRef.current !== paramId) return
        if (record) {
          setTriageResult({
            incidentId: record.incidentId,
            fraudType: record.fraudType,
            fraudsterIdentifier: record.fraudsterIdentifier,
            complainantName: record.complainantName,
            amount: record.amount,
            urgencyLevel: record.urgencyLevel,
            summary: record.summary,
            summaryHi: record.summaryHi,
            complaintDraft: record.complaintDraft,
            complaintDraftHi: record.complaintDraftHi,
            complaintDraftRegional: record.complaintDraftRegional,
            summaryRegional: record.summaryRegional,
            language: record.language,
            frauderContact: record.frauderContact,
            bankName: record.bankName,
            accountNumber: record.accountNumber,
            upiId: record.upiId,
            ifscCode: record.ifscCode,
            utrNumber: record.utrNumber,
            timeline: record.timeline,
            freezeSteps: record.freezeSteps,
            applicableLaws: record.applicableLaws,
            recommendedChannel: record.recommendedChannel,
            recommendedChannelTarget: record.recommendedChannelTarget,
          })
          setStatus(record.status)
          setEvidenceImages(record.evidenceImages)
          setUpdates(record.updates)
          initialSavedFor.current = record.incidentId
        } else {
          setToast(screenCopy.dashboard.notFound)
          setTimeout(() => router.replace('/complaints'), 2000)
        }
      })
      .catch(err => {
        console.error('Failed to load complaint by ID:', err)
        if (!isCancelled) {
          setToast(screenCopy.dashboard.loadError)
        }
      })
      .finally(() => {
        if (!isCancelled) setLoadingRecord(false)
      })

    return () => { isCancelled = true }
  }, [paramId, getById, setTriageResult, router, hi])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const buildSavePayload = (r: NonNullable<typeof triageResult>) => ({
    incidentId: r.incidentId,
    fraudType: r.fraudType,
    fraudsterIdentifier: r.fraudsterIdentifier,
    complainantName: r.complainantName,
    amount: r.amount,
    urgencyLevel: r.urgencyLevel,
    summary: r.summary,
    summaryHi: r.summaryHi,
    summaryRegional: r.summaryRegional,
    complaintDraft: r.complaintDraft,
    complaintDraftHi: r.complaintDraftHi,
    complaintDraftRegional: r.complaintDraftRegional,
    frauderContact: r.frauderContact,
    bankName: r.bankName,
    accountNumber: r.accountNumber,
    upiId: r.upiId,
    ifscCode: r.ifscCode,
    utrNumber: r.utrNumber,
    timeline: r.timeline,
    freezeSteps: r.freezeSteps,
    applicableLaws: r.applicableLaws,
    recommendedChannel: r.recommendedChannel ?? 'helpline' as const,
    recommendedChannelTarget: r.recommendedChannelTarget ?? '1930',
    language,
  })

  // Initial persist + load - runs once per incident, immediately (no debounce),
  // so a complaint is saved even if the user leaves the page within 2 seconds.
  useEffect(() => {
    if (!triageResult) return
    if (paramId && triageResult.incidentId !== paramId) return
    if (initialSavedFor.current === triageResult.incidentId) return
    initialSavedFor.current = triageResult.incidentId
    const incidentId = triageResult.incidentId

    save(buildSavePayload(triageResult))
      .then(() => getById(incidentId))
      .then(async record => {
        if (!record) return
        setStatus(record.status)
        if (record.evidenceImages.length === 0 && sharedImage) {
          const dataUrl = await readAsDataUrl(sharedImage)
          const updated = await addEvidenceImage(incidentId, { name: sharedImage.name, dataUrl })
          if (updated) setEvidenceImages(updated)
        } else {
          setEvidenceImages(record.evidenceImages)
        }
        setUpdates(record.updates)
      })
      .catch(err => console.error('Failed to save complaint:', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triageResult?.incidentId])

  // Debounced re-save on subsequent edits (draft, category, amount, …).
  useEffect(() => {
    if (!triageResult) return
    if (initialSavedFor.current !== triageResult.incidentId) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    const snapshot = triageResult
    saveTimeoutRef.current = setTimeout(() => {
      save(buildSavePayload(snapshot)).catch(err => console.error('Failed to re-save complaint:', err))
    }, 2000)
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triageResult, language])

  const handleAddEvidence = async (file: File) => {
    if (!triageResult) return
    const dataUrl = await readAsDataUrl(file)
    const updated = await addEvidenceImage(triageResult.incidentId, { name: file.name, dataUrl })
    if (updated) setEvidenceImages(updated)
  }

  const handleRemoveEvidence = async (imageId: string) => {
    if (!triageResult) return
    const updated = await removeEvidenceImage(triageResult.incidentId, imageId)
    if (updated) setEvidenceImages(updated)
  }

  const [autoFillBanner, setAutoFillBanner] = useState<string | null>(null)

  const handleAddUpdate = async (note: string) => {
    if (!triageResult) return
    let actionPoints: string[] = []
    let actionPointsHi: string[] = []
    let extracted: any = null
    let updatedDraft: string | null = null
    let updatedDraftHi: string | null = null

    try {
      const resp = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note,
          fraudType: triageResult.fraudType,
          summary: triageResult.summary,
          frauderContact: triageResult.frauderContact,
          bankName: triageResult.bankName,
          accountNumber: triageResult.accountNumber,
          upiId: triageResult.upiId,
          ifscCode: triageResult.ifscCode,
          utrNumber: triageResult.utrNumber,
          amount: triageResult.amount,
          complaintDraft: triageResult.complaintDraft,
          complaintDraftHi: triageResult.complaintDraftHi,
        }),
      })
      if (resp.ok) {
        const data = await resp.json()
        actionPoints = data.actionPoints ?? []
        actionPointsHi = data.actionPointsHi ?? []
        extracted = data.extracted
        updatedDraft = data.updatedDraft
        updatedDraftHi = data.updatedDraftHi
      }
    } catch (err) {
      console.warn('Failed to generate follow-up action points:', err)
    }

    const updated = await addUpdate(triageResult.incidentId, note, actionPoints, actionPointsHi)
    if (updated) {
      setUpdates(updated)
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
      const fallbackDraft = (triageResult.complaintDraft || '') + `\n\n[MORE INFORMATION - ${timeStr}]\nI am adding this information: ${note}`
      const fallbackDraftHi = (triageResult.complaintDraftHi || '') + `\n\n[पूरक बयान - ${timeStr}]\nमैं आगे निम्नलिखित नया साक्ष्य/अपडेट रिपोर्ट करता हूँ: ${note}`
      const fallbackDraftRegional = (triageResult.complaintDraftRegional || triageResult.complaintDraft || '') + `\n\n[MORE INFORMATION - ${timeStr}]\nUpdate: ${note}`

      // Handle additional vs replacement amount
      const prevAmt = triageResult.amount || 0
      const updatedAmount = extracted?.amount
        ? (extracted.amountIsAdditional ? prevAmt + extracted.amount : extracted.amount)
        : prevAmt

      // Clean multi-UTR merging
      let updatedContact = triageResult.frauderContact
      if (extracted?.utr) {
        if (!updatedContact || updatedContact.toLowerCase().includes('not provided') || updatedContact.toLowerCase() === 'unknown') {
          updatedContact = `UTR: ${extracted.utr}`
        } else if (!updatedContact.includes(extracted.utr)) {
          updatedContact = `${updatedContact}, UTR: ${extracted.utr}`
        }
      }

      // Auto-update complaint sections with newly extracted fields
      const newTriage = {
        ...triageResult,
        ...(extracted?.bankName ? { bankName: extracted.bankName } : {}),
        ...(extracted?.accountNumber ? { accountNumber: extracted.accountNumber } : {}),
        ...(extracted?.upiId ? { upiId: extracted.upiId } : {}),
        ...(extracted?.ifscCode ? { ifscCode: extracted.ifscCode } : {}),
        ...(extracted?.utr ? { utrNumber: extracted.utr } : {}),
        ...(extracted?.fraudsterIdentifier ? { fraudsterIdentifier: extracted.fraudsterIdentifier } : {}),
        amount: updatedAmount,
        ...(extracted?.complainantName ? { complainantName: extracted.complainantName } : {}),
        frauderContact: updatedContact,
        complaintDraft: updatedDraft || fallbackDraft,
        complaintDraftHi: updatedDraftHi || fallbackDraftHi,
        complaintDraftRegional: fallbackDraftRegional,
        // If an update provides a UTR, elevate urgency to CRITICAL for immediate golden-hour account freeze
        ...(extracted?.utr ? { urgencyLevel: 'CRITICAL' as const } : {}),
      }

      setTriageResult(newTriage)
      await save(buildSavePayload(newTriage))

      // Generate visual notification of what AI auto-filled
      const filledSummary: string[] = []
      if (extracted?.utr) filledSummary.push(`UTR (${extracted.utr})`)
      if (extracted?.bankName) filledSummary.push(`Bank (${extracted.bankName})`)
      if (extracted?.upiId) filledSummary.push(`UPI (${extracted.upiId})`)
      if (extracted?.ifscCode) filledSummary.push(`IFSC (${extracted.ifscCode})`)
      if (extracted?.accountNumber) filledSummary.push(`Account (${extracted.accountNumber})`)
      if (extracted?.complainantName) filledSummary.push(`Complainant (${extracted.complainantName})`)
      if (extracted?.amount) {
        filledSummary.push(
          extracted.amountIsAdditional
            ? `+₹${extracted.amount.toLocaleString('en-IN')} (Total ₹${updatedAmount.toLocaleString('en-IN')})`
            : `₹${extracted.amount.toLocaleString('en-IN')}`
        )
      }

      if (filledSummary.length > 0) {
        setAutoFillBanner(
          hi
            ? `✨ AI ने आपकी शिकायत में स्वचालित रूप से विवरण भर दिया: ${filledSummary.join(', ')}`
            : `✨ AI added details from your update: ${filledSummary.join(', ')}`
        )
        setTimeout(() => setAutoFillBanner(null), 10000)
      }
    }
  }

  const handleAdvanceStatus = async () => {
    if (!triageResult) return
    const next = await advanceStatus(triageResult.incidentId)
    if (next) setStatus(next)
  }

  const handleBankNotified = async () => {
    if (!triageResult) return
    const next = await setStatusAtLeast(triageResult.incidentId, 'BANK_NOTIFIED')
    if (next) setStatus(next)
    const newUpdates = await addUpdate(
      triageResult.incidentId,
      'Demo: a request to freeze the receiving account was marked as sent to the bank.',
      ['Freeze request marked as sent', 'Bank case tracking started in this demo'],
      ['लाभार्थी खाते को फ्रीज करने का अनुरोध भेजा गया', 'बैंक नोडल साइबर डेस्क ट्रैकिंग शुरू की गई']
    )
    if (newUpdates) setUpdates(newUpdates)
  }

  const handlePlatformReported = async () => {
    if (!triageResult) return
    const next = await setStatusAtLeast(triageResult.incidentId, 'PLATFORM_REPORTED')
    if (next) setStatus(next)
    const newUpdates = await addUpdate(
      triageResult.incidentId,
      'Demo: a request to remove the account and keep records was marked as sent.',
      ['Platform team marked as alerted', 'Request to remove the fake profile marked as sent'],
      ['प्लेटफ़ॉर्म ट्रस्ट एंड सेफ्टी को सूचित किया गया', 'फर्जी प्रोफाइल हटाने का अनुरोध किया गया']
    )
    if (newUpdates) setUpdates(newUpdates)
  }

  const handlePoliceRouted = async () => {
    if (!triageResult) return
    const next = await setStatusAtLeast(triageResult.incidentId, 'FIR_FILED')
    if (next) setStatus(next)
    const newUpdates = await addUpdate(
      triageResult.incidentId,
      'Demo: the report was marked as sent to the local cyber police station.',
      ['Local police station selected', 'FIR process marked as started'],
      ['साइबर पुलिस स्टेशन अधिकार क्षेत्र सौंपा गया', 'औपचारिक प्राथमिकी (FIR) पंजीकरण शुरू किया गया']
    )
    if (newUpdates) setUpdates(newUpdates)
  }

  if (loadingRecord || (paramId && triageResult?.incidentId !== paramId)) {
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar language={language} onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 animate-pulse">
            <ShieldAlert className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-base font-bold text-zinc-900">
            {dashLoc.retrievingReport}
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5 font-mono bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200">
            Incident ID: {paramId}
          </p>
        </div>
      </main>
    )
  }

  if (!triageResult) return null

  const r = triageResult
  const allFollowUpPoints = updates.flatMap(u => hi ? u.actionPointsHi : u.actionPoints)
  const evidenceLoc = EVIDENCE_VAULT_I18N[language] || EVIDENCE_VAULT_I18N.en
  const readinessSignalCount = [Boolean(r.utrNumber), Boolean(r.upiId), evidenceImages.length > 0].filter(Boolean).length
  const detectedSpokenLanguage = r.languageDetection?.detectedLanguage
    ? LANGUAGE_MAP[r.languageDetection.detectedLanguage]
    : null

  const handleUpdate = (field: keyof typeof r, value: any) => {
    setTriageResult({ ...r, [field]: value })
  }

  const handleShare = async () => {
    const amt = Number(r.amount) || 0
    const text = hi
      ? `🚨 साइबर धोखाधड़ी की शिकायत\nघटना ID: ${r.incidentId}\nराशि: ₹${amt.toLocaleString('en-IN')}\nतुरंत 1930 पर कॉल करें।`
      : `🚨 Cyber fraud report\nReport ID: ${r.incidentId}\nAmount: ₹${amt.toLocaleString('en-IN')}\nCall 1930 now.`
    if (navigator.share) {
      try { await navigator.share({ title: 'Cyber fraud report', text }) } catch { }
    } else {
      await navigator.clipboard.writeText(text)
      showToast('Copied.')
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20 font-sans relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg border border-zinc-700"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <PrintableComplaint result={r} language={language} activeDraft={activeDraftTab} />

      <div className="no-print">
        <Navbar language={language} onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')} />
      </div>

      <CallOperatorModal
        open={!!callModalHotline}
        onClose={() => setCallModalHotline(null)}
        hotline={callModalHotline || '1930'}
        hi={hi}
        incidentId={r.incidentId}
        fraudType={r.fraudType}
        amount={r.amount}
        summary={r.summaryRegional || (hi ? r.summaryHi : r.summary)}
        followUpPoints={allFollowUpPoints}
        updates={updates}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-9 no-print">

        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              {t.dashboard.title}
            </h1>
            {detectedSpokenLanguage && (
              <p className="mt-1 text-xs text-muted-foreground">
                {r.languageDetection?.decision === 'manual' ? REPORT_LANGUAGE_LABEL[language] : VOICE_DETECTED_LABEL[language]}: {detectedSpokenLanguage.nativeName}
              </p>
            )}
          </div>
          <button
            onClick={() => { reset(); router.push('/') }}
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border hover:bg-surface rounded-md px-3 py-1.5 transition-colors cursor-pointer min-h-[36px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {dashLoc.newReportBtn}
          </button>
        </motion.div>

        {/* Compulsory Details Reminder */}
        {r && (
          <div className="mb-5 sm:mb-6" id="compulsory-details-reminder">
            <CompulsoryDetailsReminder
              triageResult={r}
              language={language}
              onScrollToUpdates={() => {
                const el = document.getElementById('updates-section')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' })
                  const textarea = document.getElementById('update-note')
                  if (textarea) textarea.focus()
                }
              }}
            />
          </div>
        )}

        {/* AI Auto-Fill Alert Banner */}
        <AnimatePresence>
          {autoFillBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-700 text-white shadow-md flex items-center justify-between gap-3 border border-emerald-400/40"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse flex-shrink-0" />
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">{autoFillBanner}</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoFillBanner(null)}
                className="text-xs text-white/80 hover:text-white px-2.5 py-1 rounded-md bg-black/20 hover:bg-black/30 transition-colors flex-shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Digital Arrest High-Harm Statutory Warning Banner */}
        {(r.isDigitalArrest || r.digitalArrestAdvisory) && (
          <div className="mb-5 sm:mb-6 p-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white shadow-lg border border-red-400 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-300 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-bold tracking-wide uppercase text-amber-200">
                {screenCopy.dashboard.digitalArrestTitle}
              </p>
              <p className="leading-relaxed opacity-95">
                {r.digitalArrestAdvisory || screenCopy.dashboard.digitalArrestInfo}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Editable Report Details */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="border border-border rounded-lg bg-card shadow-none overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-border bg-surface flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {dashLoc.complaintDetailsHeader}
                </p>
              </div>
              <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-4">

                {/* Category */}
                <div>
                  <div className="flex items-center h-5 mb-1.5">
                    <label htmlFor="crime-category" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                      {dashLoc.crimeCategoryLabel}
                    </label>
                  </div>
                  <select
                    id="crime-category"
                    value={r.fraudType}
                    onChange={(e) => handleUpdate('fraudType', e.target.value)}
                    className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Financial Fraud">{CRIME_CATEGORY_LABELS_12['Financial Fraud']?.[language] || 'Financial Fraud'}</option>
                    <option value="Women/Children Related Crime">{CRIME_CATEGORY_LABELS_12['Women/Children Related Crime']?.[language] || 'Women/Children Related Crime'}</option>
                    <option value="Extortion & Blackmail">{CRIME_CATEGORY_LABELS_12['Extortion & Blackmail']?.[language] || 'Extortion & Blackmail'}</option>
                    <option value="Identity Theft">{CRIME_CATEGORY_LABELS_12['Identity Theft']?.[language] || 'Identity Theft'}</option>
                    <option value="E-Commerce Scams">{CRIME_CATEGORY_LABELS_12['E-Commerce Scams']?.[language] || 'E-Commerce Scams'}</option>
                    <option value="Other Cyber Crime">{CRIME_CATEGORY_LABELS_12['Other Cyber Crime']?.[language] || 'Other Cyber Crime'}</option>
                  </select>
                </div>

                {/* Complainant Name */}
                <div>
                  <div className="flex items-center h-5 mb-1.5">
                    <label htmlFor="complainant-name" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                      {t.dashboard.complainant}
                    </label>
                  </div>
                  <input
                    id="complainant-name"
                    type="text"
                    value={r.complainantName || ''}
                    onChange={(e) => handleUpdate('complainantName', e.target.value)}
                    placeholder={hi ? 'उदा. राजेश कुमार' : 'e.g. Ramesh Sharma'}
                    className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Fraudster Name + Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center h-5 mb-1.5">
                      <label htmlFor="fraudster-name" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {t.dashboard.fraudster}
                      </label>
                    </div>
                    <input
                      id="fraudster-name"
                      type="text" value={r.fraudsterIdentifier || ''}
                      onChange={(e) => handleUpdate('fraudsterIdentifier', e.target.value)}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex items-center h-5 mb-1.5">
                      <label htmlFor="amount-lost" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {t.dashboard.amount} (₹)
                      </label>
                    </div>
                    <input
                      id="amount-lost"
                      type="number" value={r.amount}
                      onChange={(e) => handleUpdate('amount', Number(e.target.value))}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Fraudster Contact */}
                <div>
                  <div className="flex items-center h-5 mb-1.5">
                    <label htmlFor="fraudster-contact" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                      {dashLoc.fraudsterContactLabel}
                    </label>
                  </div>
                  <input
                    id="fraudster-contact"
                    type="text" value={r.frauderContact}
                    onChange={(e) => handleUpdate('frauderContact', e.target.value)}
                    className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Debited Bank & Account (Complainant's Bank) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center h-5 mb-1.5">
                      <label htmlFor="bank-name" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {hi ? 'डेबिटेड बैंक का नाम (आपका बैंक)' : 'Your bank name'}
                      </label>
                    </div>
                    <input
                      id="bank-name"
                      type="text"
                      value={r.bankName || ''}
                      onChange={(e) => handleUpdate('bankName', e.target.value)}
                      placeholder={hi ? 'उदा. HDFC Bank, SBI' : 'e.g. HDFC Bank, SBI'}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex items-center h-5 mb-1.5">
                      <label htmlFor="account-number" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {hi ? 'खाता / कार्ड नंबर' : 'Account or card number'}
                      </label>
                    </div>
                    <input
                      id="account-number"
                      type="text"
                      value={r.accountNumber || ''}
                      onChange={(e) => handleUpdate('accountNumber', e.target.value)}
                      placeholder={hi ? 'उदा. XXXX-XXXX-5102' : 'e.g. XXXX-XXXX-5102'}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Transaction Ref / UTR, UPI ID & Bank IFSC */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div>
                    <div className="flex items-center justify-between h-5 mb-1.5">
                      <label htmlFor="utr-number" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {hi ? 'यूटीआर संदर्भ' : 'UTR or transaction ID'}
                      </label>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded font-semibold uppercase tracking-normal shrink-0 ml-1.5">
                        {hi ? 'अनिवार्य' : 'Important'}
                      </span>
                    </div>
                    <input
                      id="utr-number"
                      type="text"
                      value={r.utrNumber || ''}
                      onChange={(e) => handleUpdate('utrNumber', e.target.value)}
                      placeholder={hi ? 'उदा. 123456789012' : 'e.g. 123456789012'}
                      title={r.utrNumber || ''}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex items-center h-5 mb-1.5">
                      <label htmlFor="upi-id" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {hi ? 'लाभार्थी यूपीआई / वीपीए' : 'Scammer’s UPI ID'}
                      </label>
                    </div>
                    <input
                      id="upi-id"
                      type="text"
                      value={r.upiId || ''}
                      onChange={(e) => handleUpdate('upiId', e.target.value)}
                      placeholder={hi ? 'उदा. fraudster@okhdfcbank' : 'e.g. fraudster@okhdfcbank'}
                      title={r.upiId || ''}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex items-center h-5 mb-1.5">
                      <label htmlFor="ifsc-code" className="text-xs font-medium text-zinc-500 uppercase tracking-wider truncate">
                        {hi ? 'आईएफएससी कोड' : 'IFSC code'}
                      </label>
                    </div>
                    <input
                      id="ifsc-code"
                      type="text"
                      value={r.ifscCode || ''}
                      onChange={(e) => handleUpdate('ifscCode', e.target.value.toUpperCase())}
                      placeholder={hi ? 'उदा. SBIN0001234' : 'e.g. SBIN0001234'}
                      title={r.ifscCode || ''}
                      className="w-full h-[46px] border border-zinc-200 rounded-md px-3 text-sm text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all uppercase placeholder:normal-case"
                    />
                  </div>
                </div>

                {/* Complaint Draft with Dual-Draft Tabs (English / Regional) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="complaint-draft" className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      <span>{t.dashboard.formalComplaintTitle}</span>
                    </label>
                    <span className="text-zinc-400 text-xs font-normal">{dashLoc.editableLabel}</span>
                  </div>

                  {language !== 'en' && (
                    <div className="flex items-center gap-1.5 mb-2.5 p-1 bg-zinc-100 rounded-lg w-fit flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveDraftTab('english')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                          activeDraftTab === 'english'
                            ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {t.dashboard.tabEnglish}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDraftTab('regional')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                          activeDraftTab === 'regional'
                            ? 'bg-primary text-white shadow-xs font-semibold'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {t.dashboard.tabRegional}
                      </button>
                    </div>
                  )}

                  <textarea
                    id="complaint-draft"
                    value={
                      activeDraftTab === 'english'
                        ? (r.complaintDraft || '')
                        : (language === 'hi'
                            ? (r.complaintDraftHi || r.complaintDraft || '')
                            : (r.complaintDraftRegional || r.complaintDraft || ''))
                    }
                    onChange={(e) => {
                      if (activeDraftTab === 'english') {
                        handleUpdate('complaintDraft', e.target.value)
                      } else if (language === 'hi') {
                        handleUpdate('complaintDraftHi', e.target.value)
                      } else {
                        handleUpdate('complaintDraftRegional', e.target.value)
                      }
                    }}
                    rows={10}
                    className="w-full border border-zinc-200 rounded-md p-3 sm:p-4 text-base sm:text-sm font-mono leading-relaxed text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Evidence Vault */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <EvidenceVault
                hi={hi}
                language={language}
                images={evidenceImages}
                onAdd={handleAddEvidence}
                onRemove={handleRemoveEvidence}
              />
            </motion.div>

            {/* Complaint Updates */}
            <motion.div id="updates-section" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <ComplaintUpdates hi={hi} language={language} updates={updates} onAdd={handleAddUpdate} />
            </motion.div>

            {/* Supporting case actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-1 border border-border hover:bg-surface text-foreground rounded-xl py-3 font-semibold text-xs transition-all min-h-[44px] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    {dashLoc.shareStatusBtn}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
                    {dashLoc.liveBadge}
                  </span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex flex-col items-center justify-center gap-1 border border-border hover:bg-surface text-muted-foreground rounded-xl py-3 font-medium text-xs transition-all min-h-[44px] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Printer className="w-4 h-4" />
                    <span>{t.dashboard.savePdfBtn}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
                    {dashLoc.liveBadge}
                  </span>
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <ApplicableLaws laws={r.applicableLaws} hi={hi} language={language} />
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN (Order-First on mobile so emergency actions & incident ID appear above the fold) ── */}
          <div className="lg:col-span-5 space-y-4 order-first lg:order-last">

            {/* Compact case rail — stays first on mobile so the urgent next action is immediately visible. */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-none">
              <div className="flex items-start justify-between gap-3 border-t-2 border-primary px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t.dashboard.incidentId}
                </p>
                  <p className="mt-1 font-mono text-sm sm:text-base font-semibold tracking-tight text-foreground truncate">{r.incidentId}</p>
                </div>
                <UrgencyBadge level={r.urgencyLevel} language={language} size="sm" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-sm font-semibold text-foreground">{readinessSignalCount}/3</span>
                  <span className="truncate text-[10px] font-medium text-muted-foreground">UTR · UPI · {evidenceLoc.header}</span>
                </div>
                <div className="flex gap-1" role="img" aria-label={`${readinessSignalCount}/3`}>
                  {[Boolean(r.utrNumber), Boolean(r.upiId), evidenceImages.length > 0].map((isReady, index) => (
                    <span key={index} className={`h-1.5 w-5 rounded-full ${isReady ? 'bg-primary' : 'bg-border-strong'}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <button
                onClick={() => setCallModalHotline('1930')}
                className="w-full flex items-center justify-between gap-3 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 font-semibold text-sm transition-all shadow-sm min-h-[54px] cursor-pointer"
              >
                <span className="flex items-center gap-2 text-start">
                  <Phone className="w-5 h-5 shrink-0" />
                  {dashLoc.call1930Btn}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 rounded px-1.5 py-0.5 shrink-0">
                  {dashLoc.liveEmergencyBadge}
                </span>
              </button>
            </motion.div>

            {/* Smart Actions */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SmartActions
                bankName={r.bankName} incidentId={r.incidentId} amount={r.amount} hi={hi} language={language}
                fraudsterIdentifier={r.fraudsterIdentifier} summary={hi ? r.summaryHi : r.summary}
                utrNumber={r.utrNumber} upiId={r.upiId}
                recommendedChannel={r.recommendedChannel}
                recommendedChannelTarget={r.recommendedChannelTarget}
                followUpPoints={allFollowUpPoints}
                onBankNotified={handleBankNotified}
                onPlatformReported={handlePlatformReported}
                onPoliceRouted={handlePoliceRouted}
              />
            </motion.div>

            {/* FIR Tracker */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FIRTracker hi={hi} language={language} status={status} onAdvance={handleAdvanceStatus} />
            </motion.div>

            {/* Freeze Steps */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="border border-border rounded-lg bg-card p-4 sm:p-5 shadow-none">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {dashLoc.recommendedImmediateHeader}
                </p>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
                  {dashLoc.liveGuidanceBadge}
                </span>
              </div>
              <FreezeStepper steps={r.freezeSteps} language={language} onHotlineClick={setCallModalHotline} />
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
