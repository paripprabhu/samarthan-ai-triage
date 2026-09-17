'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowDown, ShieldCheck, Scale, Wallet, Building2, Loader2, RotateCcw, MessageCircle } from 'lucide-react'
import AudioRecorder from '@/components/AudioRecorder'
import { useTriage } from '@/context/TriageContext'
import WhatsAppChoiceModal from '@/components/WhatsAppChoiceModal'
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal'
import { SupportedLanguage, LANGUAGE_MAP } from '@/lib/i18n/languages'
import { getTranslation } from '@/lib/i18n/translations'

interface HeroSectionProps {
  language: SupportedLanguage
}

// Lightweight keyword pass so the hero result card feels alive without a
// full API round-trip. The real classification happens on /intake.
function quickRead(text: string, lang: SupportedLanguage) {
  const t = text.toLowerCase()
  const isEn = lang === 'en'
  const meta = LANGUAGE_MAP[lang] || LANGUAGE_MAP.en
  if (/invest|trading|stock|crypto|profit|portfolio|मुनाफ़ा|निवेश|বিনিয়োগ|ಹೂಡಿಕೆ|முதலீடு|పెట్టుబడి|રોકાણ|سرمایہ|ਨਿਵੇਸ਼|നിക്ഷേപം|ନିବେଶ/.test(t))
    return { type: isEn ? 'Investment scam' : `${meta.nativeName}: Investment Scam`, law: 'IT Act 66D', action: isEn ? 'Report it on the RBI Sachet portal' : 'Report on RBI Sachet portal + 1930', Icon: Wallet }
  if (/loan app|sextort|blackmail|threat|nude|morph|ब्लैकमेल|धमकी|হুমকি|ಬ್ಲ್ಯಾಕ್‌ಮೇಲ್|மிரட்டல்|బెదిరింపు|ધમકી|بلیک میل|ਧਮਕੀ|ഭീഷണി|ଧମକ/.test(t))
    return { type: isEn ? 'Threats or blackmail' : `${meta.nativeName}: Extortion & Blackmail`, law: 'IT Act 66E + 384 BNS', action: isEn ? 'Call 1930. Save screenshots.' : 'Call 1930, preserve screenshots', Icon: ShieldCheck }
  if (/upi|bank|otp|debit|credit card|imps|neft|account|बैंक|खाता|ব্যাঙ্ক|ಬ್ಯಾಂಕ್|வங்கி|బ్యాంకు|બેંક|بینک|ਬੈਂਕ|ബാങ്ക്|ବ୍ୟାଙ୍କ/.test(t))
    return { type: isEn ? 'Money fraud' : `${meta.nativeName}: Financial Fraud`, law: 'IT Act 66C / 66D', action: isEn ? 'Call your bank and 1930.' : 'Notify bank nodal officer + call 1930', Icon: Building2 }
  if (/instagram|facebook|whatsapp|fake profile|impersonat|फ़र्ज़ी|पहचान|ভুয়া|ನಕಲಿ|போலி|నకిలీ|નકલી|جعلی|ਨਕਲੀ|വ്യാജ|ନକଲି/.test(t))
    return { type: isEn ? 'Identity misuse' : `${meta.nativeName}: Identity Theft`, law: 'IT Act 66C / 66D', action: isEn ? 'Report the profile and file a report.' : 'Report to the platform + NCRP', Icon: Scale }
  return { type: isEn ? 'Other cybercrime' : `${meta.nativeName}: Cyber Crime`, law: 'IT Act 66', action: isEn ? 'Call 1930 for help.' : 'Call 1930 Helpline', Icon: ShieldCheck }
}

export default function HeroSection({ language }: HeroSectionProps) {
  const trans = getTranslation(language)
  const ui = trans.hero.ui
  const hi = language === 'hi'
  const isEn = language === 'en'
  const meta = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
  const router = useRouter()
  const { setScenarioId, setInputType } = useTriage()

  const [transcript, setTranscript] = useState('')
  const [committed, setCommitted] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [choicePrefilledText, setChoicePrefilledText] = useState('')

  const result = committed ? quickRead(committed, language) : null

  const handleAudioReady = async (blob: Blob) => {
    let text = transcript.trim()
    if (!text) {
      setIsTranscribing(true)
      try {
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')
        formData.append('language', language)
        const resp = await fetch('/api/transcribe-chunk', { method: 'POST', body: formData })
        if (resp.ok) {
          const data = await resp.json()
          if (data.text) {
            text = data.text.trim()
            setTranscript(text)
          }
        }
      } catch (e) {
        console.error('Audio transcription error:', e)
      } finally {
        setIsTranscribing(false)
      }
    }

    if (!text) {
      text = hi
        ? 'मेरे बैंक खाते से अनधिकृत 45,000 रुपये कट गए हैं।'
        : 'Unauthorized debit of 45,000 rupees from my bank account via a suspicious link.'
    }

    setCommitted(text)
  }

  const handleResetRecord = () => {
    setCommitted('')
    setTranscript('')
  }

  const goToIntake = () => {
    setScenarioId(null)
    setInputType('text')
    const text = (committed || transcript).trim()
    const q = text ? `&text=${encodeURIComponent(text)}&autoStart=true` : ''
    router.push(`/intake?category=auto${q}`)
  }

  const cleanCtaReport = trans.hero.ctaReport.replace(/[\s→➔\->]+$/, '').trim()
  const cleanCtaLearnMore = trans.hero.ctaLearnMore.replace(/[\s↓▼]+$/, '').trim()

  return (
    <section className="relative w-full pt-8 pb-10 sm:pt-10 sm:pb-14 md:pt-12 md:pb-16 overflow-hidden isolate border-b border-border">
      <div aria-hidden="true" className="signal-grid absolute inset-x-0 top-0 h-[34rem] opacity-60 dark:opacity-40" />
      <svg aria-hidden="true" viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute inset-x-0 top-8 h-[23rem] w-full opacity-90 dark:opacity-60">
        <path className="signal-path" d="M-20 255 C 185 135, 310 314, 500 198 S 780 68, 962 206 S 1225 326, 1465 100" fill="none" />
        <circle className="signal-node" cx="500" cy="198" r="4" />
        <circle className="signal-node" cx="962" cy="206" r="4" />
      </svg>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center justify-between">
          {/* Left: copy (wider, commanding presence) */}
          <div className="w-full lg:col-span-7 xl:col-span-7 max-w-[580px] mx-auto lg:mx-0 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-primary uppercase tracking-[0.14em] mb-4 self-start">
              <span className="h-px w-7 bg-amber-500" />
              <span>{ui.eyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[46px] lg:text-[52px] font-bold tracking-[-0.035em] text-zinc-950 dark:text-white leading-[1.1] indic-headline">
              <span className="block py-0.5">{trans.hero.headline1}</span>
              <span className="block text-primary mt-1 py-0.5">{trans.hero.headline2}</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-[540px]">
              {trans.hero.subtitle}
            </p>

            <a href="tel:1930" className="mt-4 inline-flex w-fit items-center gap-2 rounded-md border border-amber-300/80 bg-amber-50/80 px-3 py-2 text-xs font-semibold text-amber-950 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:border-amber-700/70 dark:bg-amber-950/35 dark:text-amber-200 dark:hover:bg-amber-950/55">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span>{ui.emergencyCall}</span>
            </a>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={goToIntake}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-md px-5 sm:px-6 py-3 text-sm font-semibold transition-colors shadow-sm ring-1 ring-primary-active min-h-[44px]"
              >
                <span>{cleanCtaReport}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-white/80 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-md px-5 sm:px-6 py-3 text-sm font-semibold transition-colors shadow-2xs min-h-[44px]"
              >
                <span>{cleanCtaLearnMore}</span>
                <ArrowDown className="w-4 h-4 text-zinc-400" />
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                {ui.demoNotice}
              </p>
            </div>
          </div>

          {/* Right: direct audio is intentionally the dominant hero interaction. */}
          <div className="relative w-full lg:col-span-5 xl:col-span-5 max-w-[480px] mx-auto lg:mx-0 lg:ml-auto">
            <div aria-hidden="true" className="absolute -inset-4 bg-primary-tint blur-3xl rounded-full" />
            <div className="relative w-full rounded-xl border border-border bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md shadow-[var(--shadow-panel)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 via-primary to-emerald-600" />
              {/* Desk header */}
              <div className="flex flex-col items-start gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 py-3 sm:py-3.5 border-b border-border bg-surface shrink-0">
                <div className="flex min-w-0 max-w-full items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[10px] font-bold text-white">01</span>
                  <span title={ui.deskTitle} className="min-w-0 text-start text-xs font-bold text-zinc-700 dark:text-zinc-200 truncate">
                    {ui.deskTitle}
                  </span>
                </div>
                <span title={ui.deskReady} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400 sm:shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="min-w-0 truncate">{ui.deskReady}</span>
                </span>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-xs sm:text-[13px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 sm:mb-4 text-center">
                    {committed
                      ? (isEn ? 'Your report is ready to review' : `${meta.nativeName}: Report captured`)
                      : (isEn ? 'Tap the mic and tell us what happened' : `${meta.nativeName}: Speak your report`)}
                  </p>

                  <div className="py-2 sm:py-3">
                    <AudioRecorder
                      language={language}
                      onAudioReady={handleAudioReady}
                      onLiveTranscript={setTranscript}
                      theme="light"
                      size="lg"
                    />
                  </div>

                  {isTranscribing && (
                    <div className="mt-4 p-4 rounded-lg bg-primary-tint border border-primary flex items-center justify-center gap-2.5 text-xs font-semibold text-primary">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>{trans.intake.analyzingIncident}</span>
                    </div>
                  )}
                </div>

                {/* Sample simulation chips if user hasn't recorded */}
                {!committed && !isTranscribing && (
                  <div className="mt-auto pt-4 sm:pt-5 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                      {hi ? 'या त्वरित सिमुलेशन चुनें:' : 'Or try a demo example:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {[
                        { en: '₹50,000 sent through a UPI link', hi: 'UPI लिंक से ₹50,000 कटे' },
                        { en: 'Loan app threats', hi: 'लोन ऐप से ब्लैकमेल धमकी' },
                        { en: 'Fake Instagram profile', hi: 'इंस्टाग्राम पर फर्जी प्रोफाइल' }
                      ].map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCommitted(hi ? sample.hi : sample.en)}
                          className="text-xs sm:text-[13px] bg-zinc-50 dark:bg-zinc-900 hover:bg-primary-tint border border-zinc-200/80 dark:border-zinc-800 hover:border-primary text-zinc-600 dark:text-zinc-300 hover:text-primary px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
                        >
                          &ldquo;{hi ? sample.hi : sample.en}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!result && !isTranscribing && (
                  <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setChoicePrefilledText(committed || '')
                        setIsChoiceModalOpen(true)
                      }}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-colors cursor-pointer py-1"
                    >
                      <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600 dark:fill-emerald-500 dark:text-emerald-500" />
                      <span>{hi ? 'व्हाट्सएप AI सिम्युलेटर (लाइव बॉट ऑफ़लाइन)' : 'Try the WhatsApp demo'}</span>
                    </button>
                  </div>
                )}

                {result && !isTranscribing && (
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div className="rounded-xl bg-surface border border-zinc-200 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                            {isEn ? 'Report summary' : `${meta.nativeName} Incident Dossier`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                            {trans.nav.digiLockerVerified}
                          </span>
                          <button
                            type="button"
                            onClick={handleResetRecord}
                            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isEn ? 'Record again' : 'Re-record'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="mb-3.5 p-3 rounded-md bg-white border border-zinc-200/90 text-xs text-zinc-800 leading-relaxed font-medium">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                          {isEn ? 'Your statement:' : 'Statement:'}
                        </span>
                        &ldquo;{committed}&rdquo;
                      </div>

                      <div className="space-y-2.5 text-sm">
                        <Row label={isEn ? 'Type of report' : 'Classification'} value={
                          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                            <result.Icon className="w-3.5 h-3.5 text-primary" />
                            {result.type}
                          </span>
                        } />
                        <Row label={isEn ? 'Possible law' : 'Section'} value={<span className="text-xs font-semibold text-zinc-700">{result.law}</span>} />
                        <Row label={isEn ? 'Do this now' : 'Action'} value={<span className="text-zinc-700">{result.action}</span>} />
                      </div>

                      <button
                        onClick={goToIntake}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-3 text-xs font-semibold transition-colors shadow-sm"
                      >
                        <span>{isEn ? 'Review the full report' : `${meta.nativeName}: Proceed to Filing`}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      <div className="mt-2.5 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setChoicePrefilledText(committed || '')
                            setIsChoiceModalOpen(true)
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-colors py-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 dark:fill-emerald-500 dark:text-emerald-500" />
                          <span>{hi ? 'व्हाट्सएप AI सिम्युलेटर (लाइव बॉट ऑफ़लाइन)' : 'Try the WhatsApp demo'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppChoiceModal
        isOpen={isChoiceModalOpen}
        onClose={() => setIsChoiceModalOpen(false)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        language={language}
        prefilledText={choicePrefilledText}
      />

      <WhatsAppSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        language={language}
      />
    </section>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-zinc-400 text-xs pt-0.5 shrink-0">{label}</span>
      <span className="text-right rtl:text-left">{value}</span>
    </div>
  )
}
