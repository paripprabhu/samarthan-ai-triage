'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, AlertCircle, FileText, Mic, ImagePlus, ShieldAlert, CheckCircle2, X, Lock, ShieldCheck } from 'lucide-react'
import { useTriage } from '@/context/TriageContext'
import { SCENARIOS, TriageResult, generateId } from '@/data/scenarios'
import { inferChannelFromFraudType } from '@/data/escalationChannels'
import AudioRecorder from '@/components/AudioRecorder'
import LoadingTriage from '@/components/LoadingTriage'
import Navbar from '@/components/Navbar'
import DigiLockerModal from '@/components/DigiLockerModal'
import { useAuth, DigiLockerUser } from '@/hooks/useAuth'
import { getTranslation } from '@/lib/i18n/translations'
import { LANGUAGE_MAP } from '@/lib/i18n/languages'
import {
  extractMultilingualComplainant,
  extractMultilingualOnBehalfOf,
  extractMultilingualAmount,
  extractMultilingualFraudster,
  extractMultilingualUTR,
  extractMultilingualUPI,
  extractMultilingualIFSC,
  inferCategoryFromMultilingualText,
  normalizeCategoryHint,
  getRegionalComplaintDraft
} from '@/lib/i18n/multilingualRegex'

function IntakeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const autoStartParam = searchParams.get('autoStart')
  const textParam = searchParams.get('text')

  const { language, setLanguage, scenarioId, setTriageResult, sharedImage, setSharedImage } = useTriage()
  const t = getTranslation(language)
  const meta = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
  const { getUser, signOut } = useAuth()
  const hi = language === 'hi'
  const scenario = SCENARIOS.find(s => s.id === scenarioId)

  const [currentUser, setCurrentUser] = useState<DigiLockerUser | null>(null)
  const [digiLockerModalOpen, setDigiLockerModalOpen] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const hasAutoStarted = useRef(false)

  useEffect(() => {
    setCurrentUser(getUser())
    const handler = () => setCurrentUser(getUser())
    window.addEventListener('samarthan_auth_change', handler)
    return () => window.removeEventListener('samarthan_auth_change', handler)
  }, [getUser])

  const buildClientFallback = (textOverride?: string): TriageResult => {
    const finalTxt = textOverride !== undefined ? textOverride : [textValue, voiceTranscript].filter(Boolean).join('\n').trim()
    const user = getUser()
    const onBehalfOfTarget = extractMultilingualOnBehalfOf(finalTxt)
    const detectedSelfName = extractMultilingualComplainant(finalTxt)
    const detectedName = detectedSelfName || user?.name || (hi ? 'अज्ञात नागरिक' : 'Anonymous Complainant')

    const rawCat = (categoryParam && categoryParam !== 'auto') ? categoryParam : inferCategoryFromMultilingualText(finalTxt)
    const mappedCat = normalizeCategoryHint(rawCat) || inferCategoryFromMultilingualText(finalTxt)
    const cleanAmount = extractMultilingualAmount(finalTxt)
    const detectedFraudster = extractMultilingualFraudster(finalTxt)
    const utrRes = extractMultilingualUTR(finalTxt)
    const detectedUpi = extractMultilingualUPI(finalTxt) || finalTxt.match(/[\w.-]+@[\w.-]+/)?.[0]
    const detectedIfsc = extractMultilingualIFSC(finalTxt)
    const idNum = generateId()
    const inferred = inferChannelFromFraudType(mappedCat)

    return {
      incidentId: idNum,
      fraudsterIdentifier: detectedFraudster,
      complainantName: detectedName,
      fraudType: mappedCat,
      recommendedChannel: inferred.channel,
      recommendedChannelTarget:
        inferred.channel === 'bank'
          ? (finalTxt.match(/sbi|hdfc|icici|axis|kotak|pnb/i)?.[0]?.toUpperCase() || 'the bank')
          : inferred.target,
      frauderContact: detectedFraudster !== 'Not Identified' ? detectedFraudster : 'Unknown',
      amount: cleanAmount || (mappedCat === 'Financial Fraud' ? 15000 : 0),
      bankName: finalTxt.match(/sbi|hdfc|icici|axis|kotak|pnb/i)?.[0]?.toUpperCase() || 'N/A',
      accountNumber: 'N/A',
      upiId: detectedUpi || undefined,
      ifscCode: detectedIfsc || undefined,
      utrNumber: utrRes.utr || undefined,
      timeline: new Date().toLocaleString('en-IN'),
      summary: finalTxt.length > 20 ? finalTxt.substring(0, 180) + '...' : `Cyber incident reported under ${mappedCat}.`,
      summaryHi: `${mappedCat} के तहत साइबर घटना दर्ज की गई।`,
      summaryRegional: language === 'hi'
        ? `${mappedCat} के तहत साइबर घटना दर्ज की गई।`
        : (language !== 'en' ? `[${meta.nativeName}]: ${finalTxt.substring(0, 140) || mappedCat}` : undefined),
      language,
      complaintDraft: onBehalfOfTarget
        ? `To,\nThe Station House Officer,\nCyber Crime Cell\n\nSubject: Formal Complaint Regarding ${mappedCat}\n\nRespected Sir/Madam,\n\nI, ${detectedName}, hereby lodge a formal complaint on behalf of ${onBehalfOfTarget} regarding an unauthorized incident: ${finalTxt || 'Online cyber fraud'}.\n\nKindly investigate the matter and initiate legal proceedings under IT Act.\n\nYours faithfully,\n${detectedName}`
        : `To,\nThe Station House Officer,\nCyber Crime Cell\n\nSubject: Formal Complaint Regarding ${mappedCat}\n\nRespected Sir/Madam,\n\nI, ${detectedName}, hereby lodge a formal complaint regarding an unauthorized incident: ${finalTxt || 'Online cyber fraud'}.\n\nKindly investigate the matter and initiate legal proceedings under IT Act.\n\nYours faithfully,\n${detectedName}`,
      complaintDraftHi: onBehalfOfTarget
        ? `सेवा में,\nथाना प्रभारी,\nसाइबर क्राइम सेल\n\nविषय: ${mappedCat} के संबंध में औपचारिक शिकायत\n\nमहोदय,\n\nमैं, ${detectedName}, ${onBehalfOfTarget} की ओर से इस अनधिकृत घटना की रिपोर्ट दर्ज करा रहा हूँ: ${finalTxt || 'साइबर धोखाधड़ी'}।\n\nकृपया आईटी अधिनियम के तहत त्वरित कानूनी कार्रवाई करें।\n\nभवदीय,\n${detectedName}`
        : `सेवा में,\nथाना प्रभारी,\nसाइबर क्राइम सेल\n\nविषय: ${mappedCat} के संबंध में औपचारिक शिकायत\n\nमहोदय,\n\nमैं, ${detectedName}, इस अनधिकृत घटना की रिपोर्ट दर्ज करा रहा हूँ: ${finalTxt || 'साइबर धोखाधड़ी'}।\n\nकृपया आईटी अधिनियम के तहत त्वरित कानूनी कार्रवाई करें।\n\nभवदीय,\n${detectedName}`,
      complaintDraftRegional: language === 'hi'
        ? (onBehalfOfTarget
            ? `सेवा में,\nथाना प्रभारी,\nसाइबर क्राइम सेल\n\nविषय: ${mappedCat} के संबंध में औपचारिक शिकायत\n\nमहोदय,\n\nमैं, ${detectedName}, ${onBehalfOfTarget} की ओर से इस अनधिकृत घटना की रिपोर्ट दर्ज करा रहा हूँ: ${finalTxt || 'साइबर धोखाधड़ी'}।\n\nकृपया त्वरित कानूनी कार्रवाई करें।\n\nभवदीय,\n${detectedName}`
            : `सेवा में,\nथाना प्रभारी,\nसाइबर क्राइम सेल\n\nविषय: ${mappedCat} के संबंध में औपचारिक शिकायत\n\nमहोदय,\n\nमैं, ${detectedName}, इस अनधिकृत घटना की रिपोर्ट दर्ज करा रहा हूँ: ${finalTxt || 'साइबर धोखाधड़ी'}।\n\nकृपया त्वरित कानूनी कार्रवाई करें।\n\nभवदीय,\n${detectedName}`)
        : (language !== 'en'
            ? getRegionalComplaintDraft(language, detectedName, onBehalfOfTarget, mappedCat, finalTxt || mappedCat, cleanAmount)
            : undefined),
      freezeSteps: [
        {
          step: 1,
          action: 'Call 1930 Cybercrime Helpline',
          actionHi: '1930 साइबर हेल्पलाइन पर कॉल करें',
          detail: 'Report immediately for emergency bank account freezing and golden hour triage.',
          detailHi: 'आपातकालीन बैंक खाता फ्रीज करने के लिए तुरंत रिपोर्ट करें।',
          hotline: '1930',
          url: 'https://cybercrime.gov.in'
        },
        {
          step: 2,
          action: 'File Official NCRP Complaint',
          actionHi: 'NCRP पोर्टल पर आधिकारिक शिकायत दर्ज करें',
          detail: 'Submit this complaint draft to cybercrime.gov.in for police jurisdiction.',
          detailHi: 'पुलिस अधिकार क्षेत्र के लिए cybercrime.gov.in पर यह शिकायत ड्राफ्ट जमा करें।',
          hotline: undefined,
          url: 'https://cybercrime.gov.in'
        }
      ],
      applicableLaws: [
        {
          section: 'IT Act, Section 66D',
          title: 'Cheating by personation by using computer resource',
          titleHi: 'कंप्यूटर संसाधन का उपयोग करके प्रतिरूपण द्वारा धोखाधड़ी',
          reason: 'Applies to online fraud, digital cheating, and cyber extortion.',
          reasonHi: 'ऑनलाइन धोखाधड़ी और डिजिटल ठगी पर लागू होता है।',
        }
      ],
      urgencyLevel: 'HIGH' as const,
    }
  }

  const handleAIAnalyze = async (forcedText?: string, forcedImg?: File) => {
    setIsLoading(true)
    setError('')
    setIsRateLimited(false)

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError(hi
        ? 'आप ऑफ़लाइन हैं। कृपया इंटरनेट कनेक्शन जांचें और फिर से कोशिश करें।'
        : "You're offline. Check your internet connection and try again.")
      setIsLoading(false)
      return
    }

    // Client abort sits ABOVE the route's own 60s maxDuration so the server
    // always gets to answer first (with a real result, or its own fallback).
    // The client only aborts on a genuine network hang.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)

    const finalTxtForFallback = [forcedText || textValue, voiceTranscript].filter(Boolean).join('\n').trim()

    try {
      const formData = new FormData()
      formData.append('language', language)
      if (categoryParam && categoryParam !== 'auto') formData.append('fraudType', categoryParam)
      if (scenario) formData.append('scenarioId', scenario.id)
      const finalTxt = [forcedText || textValue, voiceTranscript].filter(Boolean).join('\n').trim()
      if (finalTxt) formData.append('text', finalTxt)
      if (audioBlob) formData.append('audio', audioBlob, 'recording.webm')
      const finalImg = forcedImg || imageFile
      if (finalImg) formData.append('image', finalImg)
      // Pass complainant name so AI can reference it in the formal draft
      const user = getUser()
      if (user?.name) formData.append('complainantName', user.name)

      const headers: Record<string, string> = {}
      const userKey = typeof window !== 'undefined' ? (localStorage.getItem('openai_api_key') || localStorage.getItem('user_openai_key')) : null
      if (userKey) headers['x-openai-key'] = userKey

      const resp = await fetch('/api/triage', { method: 'POST', headers, body: formData, signal: controller.signal })

      if (resp.status === 429) {
        setIsRateLimited(true)
        setError(hi
          ? 'आज की मुफ़्त ऑनलाइन AI टेस्ट सीमा पूरी हो गई है (प्रति दिन 5 बार)। आप नीचे दिए गए बटन से तुरंत ऑफलाइन AI ट्रायज के साथ टेस्ट जारी रख सकते हैं।'
          : 'Daily online AI test limit reached (5 per day on this shared demo). You can continue evaluating immediately using the instant offline AI triage below with 0 cost.')
        return
      }

      let result: TriageResult
      if (resp.ok) {
        result = await resp.json()
      } else {
        console.warn('[intake] Serverless triage non-ok, using smart dynamic client fallback')
        result = buildClientFallback(finalTxtForFallback)
      }
      setTriageResult(result)
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Network hang past 90s - don't dead-end the user. Serve the
        // rule-based client result and continue to the dashboard.
        console.warn('[intake] Triage request timed out, using client fallback')
        setTriageResult(buildClientFallback(finalTxtForFallback))
        router.push('/dashboard')
      } else {
        setError(err instanceof Error ? err.message : (hi ? 'कुछ गलत हो गया।' : 'Something went wrong.'))
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const decodedText = textParam ? decodeURIComponent(textParam) : ''
    if (decodedText && !textValue) setTextValue(decodedText)
    if (sharedImage && !imageFile) setImageFile(sharedImage)
    if (autoStartParam === 'true' && !hasAutoStarted.current && decodedText) {
      hasAutoStarted.current = true
      handleAIAnalyze(decodedText)
    }
  }, [textParam, autoStartParam, sharedImage])

  if (isLoading) {
    return <div className="min-h-screen bg-white"><LoadingTriage language={language} /></div>
  }

  let categoryLabel = categoryParam
  if (categoryParam === 'auto') categoryLabel = hi ? 'AI ऑटो-डिटेक्ट' : 'AI Auto-Detect'

  return (
    <main className="min-h-screen bg-background font-sans pb-20">

      <Navbar language={language} onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')} />

      {/* ── BACK BAR ── */}
      <header className="border-b border-border bg-card backdrop-blur sticky top-[58px] sm:top-[72px] z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label={hi ? 'वापस जाएं' : 'Go back'}
            className="p-1.5 rounded-md hover:bg-surface text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <div>
            <p className="text-sm font-semibold text-foreground">{hi ? 'शिकायत विवरण' : 'Incident Details'}</p>
            {(scenario || categoryLabel) && (
              <p className="text-xs text-muted-foreground">
                {scenario
                  ? (hi ? `Sandbox: ${scenario.titleHi}` : `Sandbox: ${scenario.title}`)
                  : (hi ? `श्रेणी: ${categoryLabel}` : `Category: ${categoryLabel}`)}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-6">

        {scenario && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border bg-surface rounded-lg p-3.5 sm:p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              {hi ? 'Sandbox Mode' : 'Sandbox Mode - Synthetic Data'}
            </p>
            <p className="text-xs sm:text-sm text-foreground">{hi ? scenario.descriptionHi : scenario.description}</p>
          </motion.div>
        )}

        {/* ── PAGE TITLE ── */}
        <section className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5 sm:py-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-warning mb-1.5">
                {hi ? 'रिपोर्ट तैयार करें' : 'Prepare your report'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {t.intake.title}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {hi
                  ? 'अपनी बात बोलें, लिखें या प्रमाण संलग्न करें। आगे की कार्रवाई से पहले आप अपने विवरण की समीक्षा कर सकेंगे।'
                  : 'Speak, type, or attach evidence. You will review the details before moving to your action plan.'}
              </p>
            </div>

            <ol className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs sm:min-w-[290px]" aria-label={hi ? 'रिपोर्ट प्रगति' : 'Report progress'}>
              {[
                hi ? 'घटना बताएं' : 'Describe incident',
                hi ? 'विवरण देखें' : 'Review details',
                hi ? 'कार्य योजना' : 'Action plan',
              ].map((step, index) => (
                <li key={step} className="min-w-0">
                  <div className={`h-1 rounded-full ${index === 0 ? 'bg-primary' : 'bg-border'}`} />
                  <p className={`mt-1.5 truncate font-medium ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <span className="font-mono me-1 opacity-70">0{index + 1}</span>{step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── IDENTITY STATUS / DIGILOCKER SIMULATOR CARD ── */}
        {currentUser ? (
          <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 sm:p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-foreground">{currentUser.name}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {hi ? 'डिजीलॉकर सत्यापित नागरिक' : 'DigiLocker Verified Citizen'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Aadhaar: {currentUser.aadhaar} • Verified via MeitY Sandbox</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { signOut(); setCurrentUser(null) }}
              className="text-xs text-muted-foreground hover:text-destructive font-medium px-2.5 py-1.5 rounded-md hover:bg-surface transition cursor-pointer shrink-0"
            >
              {hi ? 'लॉग आउट' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-surface border border-border rounded-xl p-3.5 sm:p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-400/10 flex items-center justify-center flex-shrink-0 text-warning mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {hi ? 'पहचान सत्यापन (वैकल्पिक)' : 'Identity Verification (Optional)'}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {hi
                    ? 'आप बिना लॉगिन किए भी सीधे रिपोर्ट कर सकते हैं (आपके द्वारा बताए गए नाम का उपयोग होगा)। या प्रमाणित शिकायत के लिए डिजीलॉकर सिमुलेशन का उपयोग करें।'
                    : 'You can file directly without signing in — the AI will use the name you mention in your statement. Or simulate DigiLocker for a verified citizen FIR.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDigiLockerModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover active:scale-[0.99] text-primary-foreground text-xs font-semibold px-3.5 py-2.5 rounded-lg transition shadow-sm cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{hi ? 'डिजीलॉकर सिमुलेशन' : 'Simulate DigiLocker'}</span>
            </button>
          </div>
        )}

        {/* ── INCIDENT STATEMENT DESK ── */}
        <section className="rounded-xl border border-border bg-surface p-3 sm:p-4 shadow-card">
          <div className="flex items-start justify-between gap-4 px-1.5 pt-1 pb-3 sm:px-2 sm:pt-2">
            <div>
              <p className="text-sm font-bold text-foreground">{hi ? 'घटना विवरण' : 'Incident statement'}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {hi ? 'जिस तरीके से सहज हों, जानकारी दें।' : 'Add what you know in the way that feels easiest.'}
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-success" />
              {hi ? 'आपकी समीक्षा के लिए' : 'Ready for your review'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          {/* Voice - hero cell, spans both rows on desktop */}
          <div className="md:row-span-2 border border-border rounded-lg bg-card shadow-xs p-4 sm:p-5 flex flex-col min-h-[240px] sm:min-h-[280px]">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" />{t.intake.voiceCardTitle}</span>
            </label>
            <div className="flex-1">
              <AudioRecorder language={language} onAudioReady={setAudioBlob} onLiveTranscript={setVoiceTranscript} theme="light" />
            </div>
          </div>

          {/* Text */}
          <div className="border border-border rounded-lg bg-card shadow-xs p-4 sm:p-5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{t.intake.textCardTitle}</span>
            </label>
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={5}
              placeholder={t.intake.placeholder}
              className="w-full bg-background border border-input rounded-md p-3 sm:p-3.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {voiceTranscript && (
              <p className="mt-2 text-xs text-muted-foreground flex items-start gap-1.5">
                <Mic className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="italic line-clamp-2">{voiceTranscript}</span>
              </p>
            )}
          </div>

          {/* Upload */}
          <div className="border border-border rounded-lg bg-card shadow-xs p-4 sm:p-5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              <span className="flex items-center gap-1.5"><ImagePlus className="w-3.5 h-3.5" />{t.intake.evidenceCardTitle}</span>
            </label>
            {imageFile ? (
              <div className="flex items-center gap-3 border border-emerald-300 dark:border-emerald-500/30 rounded-md p-3 bg-emerald-50 dark:bg-emerald-500/10">
                <div className="w-9 h-9 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{imageFile.name}</p>
                  <p className="text-xs text-muted-foreground">Ready for Evidence Vault</p>
                </div>
                <button
                  onClick={() => { setImageFile(null); setSharedImage(null) }}
                  className="p-1.5 hover:bg-surface rounded-md text-muted-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-24 rounded-lg border-2 border-dashed border-border-strong hover:border-primary bg-background hover:bg-primary-tint flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-all cursor-pointer min-h-[44px]"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs font-medium">{t.intake.uploadScreenshot}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>

          </div>
        </section>

        <aside className="flex gap-3 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3.5 py-3 sm:px-4" aria-label={hi ? 'तत्काल सहायता' : 'Immediate support'}>
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-400/15 text-warning">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{hi ? 'पैसे अभी भेजे गए हैं?' : 'Was money transferred just now?'}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {hi ? 'अपनी रिपोर्ट जारी रखते हुए तुरंत 1930 पर कॉल करें।' : 'Call 1930 immediately while you continue preparing this report.'}
            </p>
          </div>
        </aside>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col gap-3 bg-red-50 border border-red-200 rounded-lg p-3.5 sm:p-4 text-red-700 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
            {isRateLimited && (
              <button
                type="button"
                onClick={() => {
                  const fallbackResult = buildClientFallback()
                  setTriageResult(fallbackResult)
                  router.push('/dashboard')
                }}
                className="self-start inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-sm"
              >
                <span>⚡ {hi ? 'ऑफलाइन AI ट्रायज के साथ जारी रखें (0 API लागत)' : 'Continue with Instant Offline AI (0 API Cost)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}

        {/* ── SUBMIT ── */}
        <div className="rounded-xl border border-border bg-card p-2 shadow-card">
          <button
            onClick={() => handleAIAnalyze()}
            disabled={!textValue && !voiceTranscript && !audioBlob && !imageFile && !scenario}
            className="w-full flex items-center justify-center gap-2 rounded-lg font-semibold text-primary-foreground py-3.5 sm:py-4 text-sm bg-primary hover:bg-primary-hover transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] cursor-pointer"
          >
            <span>{t.intake.submitForTriage.replace(/[\s→➔\->]+$/, '').trim()}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
          <p className="px-2.5 pt-2 text-center text-[10px] text-muted-foreground">
            {hi ? 'अगले चरण में विवरण की समीक्षा और कार्य योजना होगी।' : 'Next: review the details and receive your action plan.'}
          </p>
        </div>

      </div>

      <DigiLockerModal
        open={digiLockerModalOpen}
        onClose={() => setDigiLockerModalOpen(false)}
        onSuccess={() => {
          setDigiLockerModalOpen(false)
          setCurrentUser(getUser())
        }}
      />
    </main>
  )
}

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <IntakeContent />
    </Suspense>
  )
}
