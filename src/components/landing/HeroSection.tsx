'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowDown, ShieldCheck, Scale, Wallet, Building2, Loader2, RotateCcw, MessageCircle } from 'lucide-react'
import AudioRecorder from '@/components/AudioRecorder'
import { useTriage } from '@/context/TriageContext'
import { RadialBackground } from '@/components/ui/light-theme-tailwind-css-background-snippet'
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
    return { type: isEn ? 'Investment Scam' : `${meta.nativeName}: Investment Scam`, law: 'IT Act 66D', action: isEn ? 'Report on RBI Sachet portal' : 'Report on RBI Sachet portal + 1930', Icon: Wallet }
  if (/loan app|sextort|blackmail|threat|nude|morph|ब्लैकमेल|धमकी|হুমকি|ಬ್ಲ್ಯಾಕ್‌ಮೇಲ್|மிரட்டல்|బెదిరింపు|ધમકી|بلیک میل|ਧਮਕੀ|ഭീഷണി|ଧମକ/.test(t))
    return { type: isEn ? 'Extortion & Blackmail' : `${meta.nativeName}: Extortion & Blackmail`, law: 'IT Act 66E + 384 BNS', action: isEn ? 'Call 1930, preserve screenshots' : 'Call 1930, preserve screenshots', Icon: ShieldCheck }
  if (/upi|bank|otp|debit|credit card|imps|neft|account|बैंक|खाता|ব্যাঙ্ক|ಬ್ಯಾಂಕ್|வங்கி|బ్యాంకు|બેંક|بینک|ਬੈਂਕ|ബാങ്ക്|ବ୍ୟାଙ୍କ/.test(t))
    return { type: isEn ? 'Financial Fraud' : `${meta.nativeName}: Financial Fraud`, law: 'IT Act 66C / 66D', action: isEn ? 'Notify bank nodal officer + call 1930' : 'Notify bank nodal officer + call 1930', Icon: Building2 }
  if (/instagram|facebook|whatsapp|fake profile|impersonat|फ़र्ज़ी|पहचान|ভুয়া|ನಕಲಿ|போலி|నకిలీ|નકલી|جعلی|ਨਕਲੀ|വ്യാജ|ନକଲି/.test(t))
    return { type: isEn ? 'Identity Theft' : `${meta.nativeName}: Identity Theft`, law: 'IT Act 66C / 66D', action: isEn ? 'Report to the platform + NCRP' : 'Report to the platform + NCRP', Icon: Scale }
  return { type: isEn ? 'Other Cyber Crime' : `${meta.nativeName}: Cyber Crime`, law: 'IT Act 66', action: isEn ? 'Call the 1930 helpline' : 'Call 1930 Helpline', Icon: ShieldCheck }
}

export default function HeroSection({ language }: HeroSectionProps) {
  const trans = getTranslation(language)
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
    <section className="relative w-full pt-4 pb-8 sm:pt-6 sm:pb-12 md:pt-8 md:pb-14 overflow-hidden isolate">
      <RadialBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center justify-between">
          {/* Left: copy */}
          <div className="w-full lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-xs mb-4 backdrop-blur-sm self-start">
              <span className="flex h-2 w-2 relative">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
                {trans.hero.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.14] indic-headline">
              <span className="block py-0.5">{trans.hero.headline1}</span>
              <span className="block text-primary mt-1 py-0.5">{trans.hero.headline2}</span>
            </h1>

            <p className="mt-3.5 sm:mt-4 text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {trans.hero.subtitle}
            </p>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={goToIntake}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 sm:px-6 py-3 text-sm font-semibold transition-colors shadow-sm min-h-[42px]"
              >
                <span>{cleanCtaReport}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg px-5 sm:px-6 py-3 text-sm font-medium transition-colors shadow-2xs min-h-[42px]"
              >
                <span>{cleanCtaLearnMore}</span>
                <ArrowDown className="w-4 h-4 text-zinc-400" />
              </a>
            </div>

            {/* Placed directly in the empty space below buttons */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-zinc-200/80 dark:border-zinc-800">
              {/* Micro trust indicators */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3.5 sm:gap-x-4 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {hi ? 'डिजीलॉकर प्रमाणित पहचान' : 'DigiLocker Verified'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {hi ? 'IT एक्ट व BNS वैधानिक मैपिंग' : 'IT Act & BNS Statutory Routing'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {hi ? '1930 NCRP गोल्डन ऑवर मानक' : '1930 NCRP Golden Hour Protocol'}
                </span>
              </div>

              {/* Explicit simulation disclaimer notice */}
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                {hi
                  ? '⚠️ सिमुलेशन सूचना: AI ट्रायज, वॉइस ट्रांसक्रिप्शन व FIR ड्राफ्टिंग सक्रिय फीचर्स हैं; बैंक फ्रीज व पुलिस रूटिंग डेमो वर्कफ़्लो हैं। आधिकारिक राष्ट्रीय पोर्टल: cybercrime.gov.in।'
                  : '⚠️ Simulation Notice: AI triage, voice transcription & FIR drafting are functional features; bank freezing & police dispatch are simulated demonstration workflows. Official National Portal: cybercrime.gov.in.'}
              </p>
            </div>
          </div>

          {/* Right: Studio Window Terminal (widened to fill space) */}
          <div className="relative w-full lg:col-span-7">
            {/* Outer window frame container */}
            <div className="w-full rounded-[20px] border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-zinc-100 dark:border-zinc-850 bg-surface shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="ml-1.5 sm:ml-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 truncate">
                    {hi ? 'नागरिक इनटेक टर्मिनल' : 'Citizen Rapid Intake (NCRP-1930)'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {hi ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              {/* Terminal Window Body */}
              <div className="p-5 sm:p-7 md:p-8 flex-1 flex flex-col justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-xs sm:text-[13px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 sm:mb-4 text-center">
                    {committed
                      ? (isEn ? 'Report captured: review details or see full report' : `${meta.nativeName}: Report captured`)
                      : (isEn ? 'Try us out: tap the mic and say your report' : `${meta.nativeName}: Speak your report`)}
                  </p>

                  <div className="py-2 sm:py-4">
                    <AudioRecorder
                      language={language}
                      onAudioReady={handleAudioReady}
                      onLiveTranscript={setTranscript}
                      theme="light"
                      size="lg"
                    />
                  </div>

                  {isTranscribing && (
                    <div className="mt-4 p-4 rounded-lg bg-primary-tint border border-primary/20 flex items-center justify-center gap-2.5 text-xs font-semibold text-primary">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>{trans.intake.analyzingIncident}</span>
                    </div>
                  )}
                </div>

                {/* Sample simulation chips if user hasn't recorded */}
                {!committed && !isTranscribing && (
                  <div className="mt-auto pt-5 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                      {hi ? 'या त्वरित सिमुलेशन चुनें:' : 'Or test with a 1-click simulation:'}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {[
                        { en: '₹50,000 lost on UPI link', hi: 'UPI लिंक से ₹50,000 कटे' },
                        { en: 'Loan app blackmail threats', hi: 'लोन ऐप से ब्लैकमेल धमकी' },
                        { en: 'Fake profile on Instagram', hi: 'इंस्टाग्राम पर फर्जी प्रोफाइल' }
                      ].map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCommitted(hi ? sample.hi : sample.en)}
                          className="flex-1 min-w-[150px] text-center text-xs sm:text-[13px] bg-zinc-50 dark:bg-zinc-900 hover:bg-primary-tint border border-zinc-200/80 dark:border-zinc-800 hover:border-primary/30 text-zinc-600 dark:text-zinc-300 hover:text-primary px-3 py-2 rounded-lg transition-all font-medium cursor-pointer"
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
                      <span>{trans.hero.ctaWhatsApp}</span>
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
                            {isEn ? 'Preliminary Incident Dossier (Form NCRP-1930)' : `${meta.nativeName} Incident Dossier`}
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
                            <span>{isEn ? 'Say it again' : 'Re-record'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="mb-3.5 p-3 rounded-md bg-white border border-zinc-200/90 text-xs text-zinc-800 leading-relaxed font-medium">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                          {isEn ? 'Citizen Statement:' : 'Statement:'}
                        </span>
                        &ldquo;{committed}&rdquo;
                      </div>

                      <div className="space-y-2.5 text-sm">
                        <Row label={isEn ? 'Fraud Classification' : 'Classification'} value={
                          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                            <result.Icon className="w-3.5 h-3.5 text-primary" />
                            {result.type}
                          </span>
                        } />
                        <Row label={isEn ? 'Applicable Law' : 'Section'} value={<span className="text-xs font-semibold text-zinc-700">{result.law}</span>} />
                        <Row label={isEn ? 'Golden Hour Action' : 'Action'} value={<span className="text-zinc-700">{result.action}</span>} />
                      </div>

                      <button
                        onClick={goToIntake}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-3 text-xs font-semibold transition-colors shadow-sm"
                      >
                        <span>{isEn ? 'Proceed to Formal Filing (Form NCRP-1930)' : `${meta.nativeName}: Proceed to Filing`}</span>
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
                          <span>{trans.hero.ctaWhatsApp}</span>
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
