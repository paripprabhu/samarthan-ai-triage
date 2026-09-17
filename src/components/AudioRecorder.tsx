'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import clsx from 'clsx'

import { LANGUAGE_MAP, SupportedLanguage, isSupportedLanguage } from '@/lib/i18n/languages'
import type { SpeechLanguageDecision } from '@/lib/speech-normalizer'
import { getTranslation } from '@/lib/i18n/translations'

interface AudioRecorderProps {
  language: SupportedLanguage
  /** Report language can differ from the UI language after an explicit choice. */
  reportLanguage?: SupportedLanguage
  /** A parent fallback may obtain a provisional result after recording stops. */
  proposedLanguage?: SupportedLanguage | null
  languagePreference?: 'auto' | 'manual'
  onAudioReady: (blob: Blob) => void
  onLiveTranscript?: (text: string) => void
  onLanguageDetected?: (language: SupportedLanguage) => void
  onLanguageChoice?: (language: SupportedLanguage, mode: 'manual') => void
  theme?: 'light' | 'dark'
  size?: 'default' | 'lg'
}

const MAX_SECONDS = 60
const BAR_COUNT = 28
const CHUNK_MS = 4000

const MIC_ERROR_I18N: Record<SupportedLanguage, string> = {
  en: 'Microphone access is off. Allow it in your browser settings.',
  hi: 'माइक्रोफोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग में माइक की अनुमति दें।',
  bn: 'মাইক্রোফোনের অনুমতি প্রত্যাখ্যাত হয়েছে। অনুগ্রহ করে ব্রাউজার সেটিংসে মাইকের অনুমতি দিন।',
  mr: 'मायक्रोफोन परवानगी नाकारली. कृपया ब्राउझर सेटिंग्जमध्ये माइकला अनुमती द्या.',
  te: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో మైక్ అనుమతి ఇవ్వండి.',
  ta: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவி அமைப்புகளில் மைக் அணுகலை அனுமதிக்கவும்.',
  gu: 'માઇક્રોફોન પરવાનગી નકારવામાં આવી. કૃપા કરીને બ્રાઉઝર સેટિંગ્સમાં માઇકની પરવાનગી આપો.',
  ur: 'مائیکروفون کی اجازت مسترد کر دی گئی۔ براہ کرم براؤزر کی ترتیبات میں مائیک کی اجازت دیں۔',
  kn: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಯನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಮೈಕ್ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ.',
  or: 'ମାଇକ୍ରୋଫୋନ୍ ଅନୁମତି ପ୍ରତ୍ୟାଖ୍ୟାନ କରାଗଲା। ଦୟାକରି ବ୍ରାଉଜର୍ ସେଟିଂସମୂହରେ ମାଇକ୍ ଅନୁମତି ଦିଅନ୍ତୁ।',
  ml: 'മൈക്രോഫോൺ അനുമതി നിരസിച്ചു. ബ്രൗസർ ക്രമീകരണങ്ങളിൽ മൈക്ക് ആക്‌സസ്സ് അനുവദിക്കുക.',
  pa: 'ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਅਸਵੀਕਾਰ ਕੀਤੀ ਗਈ। ਕਿਰਪਾ ਕਰਕੇ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਮਾਈਕ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।',
  "as": 'মাইক্ৰ’ফোনৰ অনুমতি বন্ধ আছে। ব্ৰাউজাৰ ছেটিংছত অনুমতি দিয়ক।',
  ne: 'माइक्रोफोन अनुमति बन्द छ। ब्राउजर सेटिङमा अनुमति दिनुहोस्।',
  sd: 'مائيڪروفون جي اجازت بند آهي۔ برائوزر سيٽنگن ۾ اجازت ڏيو۔',
}

const AUDIO_READY_I18N: Record<SupportedLanguage, string> = {
  en: '✓ Recording is ready',
  hi: '✓ रिकॉर्डिंग तैयार है',
  bn: '✓ রেকর্ডিং প্রস্তুত',
  mr: '✓ रेकॉर्डिंग तयार आहे',
  te: '✓ రికార్డింగ్ సిద్ధంగా ఉంది',
  ta: '✓ பதிவு தயாராக உள்ளது',
  gu: '✓ રેકોર્ડિંગ તૈયાર છે',
  ur: '✓ ریکارڈنگ تیار ہے',
  kn: '✓ ರೆಕಾರ್ಡಿಂಗ್ ಸಿದ್ಧವಾಗಿದೆ',
  or: '✓ ରେକର୍ଡିଂ ପ୍ରସ୍ତୁତ',
  ml: '✓ റെക്കോർഡിംഗ് തയ്യാറാണ്',
  pa: '✓ ਰਿਕਾਰਡਿੰਗ ਤਿਆਰ ਹੈ',
  "as": '✓ ৰেকৰ্ডিং সাজু',
  ne: '✓ रेकर्डिङ तयार छ',
  sd: '✓ رڪارڊنگ تيار آهي',
}

const LANGUAGE_CONFIRMATION_I18N: Record<SupportedLanguage, { heard: string; use: string; keep: string }> = {
  en: { heard: 'We heard {language}. Choose the report language.', use: 'Use {language}', keep: 'Keep {language}' },
  hi: { heard: 'हमें {language} सुनाई दी। रिपोर्ट की भाषा चुनें।', use: '{language} इस्तेमाल करें', keep: '{language} रखें' },
  bn: { heard: 'আমরা {language} শুনেছি। রিপোর্টের ভাষা বেছে নিন।', use: '{language} ব্যবহার করুন', keep: '{language} রাখুন' },
  mr: { heard: 'आम्हाला {language} ऐकू आली. अहवालाची भाषा निवडा.', use: '{language} वापरा', keep: '{language} ठेवा' },
  te: { heard: 'మేము {language} విన్నాము. నివేదిక భాషను ఎంచుకోండి.', use: '{language} వాడండి', keep: '{language} ఉంచండి' },
  ta: { heard: 'நாங்கள் {language} கேட்டோம். அறிக்கை மொழியைத் தேர்ந்தெடுக்கவும்.', use: '{language} பயன்படுத்தவும்', keep: '{language} வைத்திருக்கவும்' },
  gu: { heard: 'અમે {language} સાંભળી. રિપોર્ટની ભાષા પસંદ કરો.', use: '{language} વાપરો', keep: '{language} રાખો' },
  ur: { heard: 'ہم نے {language} سنی۔ رپورٹ کی زبان منتخب کریں۔', use: '{language} استعمال کریں', keep: '{language} رکھیں' },
  kn: { heard: 'ನಾವು {language} ಕೇಳಿದ್ದೇವೆ. ವರದಿಯ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ.', use: '{language} ಬಳಸಿ', keep: '{language} ಇಟ್ಟುಕೊಳ್ಳಿ' },
  or: { heard: 'ଆମେ {language} ଶୁଣିଲୁ। ରିପୋର୍ଟ ଭାଷା ବାଛନ୍ତୁ।', use: '{language} ବ୍ୟବହାର କରନ୍ତୁ', keep: '{language} ରଖନ୍ତୁ' },
  ml: { heard: 'ഞങ്ങൾ {language} കേട്ടു. റിപ്പോർട്ട് ഭാഷ തിരഞ്ഞെടുക്കുക.', use: '{language} ഉപയോഗിക്കുക', keep: '{language} നിലനിർത്തുക' },
  pa: { heard: 'ਅਸੀਂ {language} ਸੁਣੀ। ਰਿਪੋਰਟ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ।', use: '{language} ਵਰਤੋ', keep: '{language} ਰੱਖੋ' },
  "as": { heard: 'আমি {language} শুনিলোঁ। ৰিপোর্টৰ ভাষা বাছক।', use: '{language} ব্যৱহাৰ কৰক', keep: '{language} ৰাখক' },
  ne: { heard: 'हामीले {language} सुन्यौँ। रिपोर्टको भाषा छान्नुहोस्।', use: '{language} प्रयोग गर्नुहोस्', keep: '{language} राख्नुहोस्' },
  sd: { heard: 'اسان {language} ٻڌو۔ رپورٽ جي ٻولي چونڊيو۔', use: '{language} استعمال ڪريو', keep: '{language} رکو' },
}

function languageCopy(template: string, languageName: string) {
  return template.replace('{language}', languageName)
}

export default function AudioRecorder({ language, reportLanguage, proposedLanguage, languagePreference = 'manual', onAudioReady, onLiveTranscript, onLanguageDetected, onLanguageChoice, theme = 'light', size = 'default' }: AudioRecorderProps) {
  const t = getTranslation(language)
  const languageConfirmation = LANGUAGE_CONFIRMATION_I18N[language]
  const isDark = theme === 'dark'
  const isLg = size === 'lg'

  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0.08))
  const [liveText, setLiveText] = useState('')
  const [captionError, setCaptionError] = useState('')
  const [detectedCaptionLanguage, setDetectedCaptionLanguage] = useState<SupportedLanguage | null>(null)
  const displayedProposal = detectedCaptionLanguage || proposedLanguage || null

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Rolling ~4s chunk recorder for live captions - separate from the main
  // MediaRecorder so the final audio blob sent to Whisper stays one clean
  // continuous file, while captions are a best-effort streaming preview.
  const chunkRecorderRef = useRef<MediaRecorder | null>(null)
  const finalTranscriptRef = useRef('')
  const captionSeqRef = useRef(0)
  const lastAppliedSeqRef = useRef(0)
  const proposedLanguageRef = useRef<SupportedLanguage | null>(null)
  const recordingSessionRef = useRef(0)
  const reportLanguageRef = useRef(reportLanguage || language)
  const uiLanguageRef = useRef(language)
  const languagePreferenceRef = useRef(languagePreference)
  const decisionGenerationRef = useRef(0)

  // Update synchronously during render so an external menu choice cannot lose
  // a race to a resolved caption request while an effect is still pending.
  uiLanguageRef.current = language
  reportLanguageRef.current = reportLanguage || language
  languagePreferenceRef.current = languagePreference

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      try { chunkRecorderRef.current?.stop() } catch { /* already stopped */ }
      audioCtxRef.current?.close?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobUrl])

  const runLevelLoop = () => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteTimeDomainData(data)
      // RMS amplitude of the waveform, mapped into a handful of bars with
      // slight per-bar variance so it reads as a live waveform, not one blob.
      let sumSq = 0
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128
        sumSq += v * v
      }
      const rms = Math.sqrt(sumSq / data.length)
      const amplitude = Math.min(1, rms * 4)

      setLevels((prev) =>
        prev.map((_, i) => {
          const wobble = 0.6 + 0.4 * Math.sin(Date.now() / 120 + i)
          return Math.max(0.08, Math.min(1, amplitude * wobble))
        })
      )

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const uploadChunkForCaption = async (blob: Blob, seq: number, session: number) => {
    if (blob.size < 1000) return // too short to contain speech
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'chunk.webm')
      const decisionGeneration = decisionGenerationRef.current
      formData.append('language', reportLanguageRef.current)
      formData.append('languageMode', languagePreferenceRef.current)
      const resp = await fetch('/api/transcribe-chunk', { method: 'POST', body: formData })
      if (!resp.ok) return
      const data: { text?: string; detectedLanguage?: unknown; languageDecision?: unknown } = await resp.json()
      // Chunks resolve out of order if one Whisper call is slow - only apply
      // a response if it's not older than the last one we already applied.
      // (Every chunk WILL be "behind" the currently-recording chunk by the
      // time its request completes, since Whisper latency > the chunk
      // interval - that's expected, not staleness.)
      if (session !== recordingSessionRef.current || decisionGeneration !== decisionGenerationRef.current || seq <= lastAppliedSeqRef.current) return
      lastAppliedSeqRef.current = seq
      if (
        languagePreferenceRef.current === 'auto' &&
        data.languageDecision === ('confirmed' as SpeechLanguageDecision) &&
        isSupportedLanguage(data.detectedLanguage) &&
        !proposedLanguageRef.current
      ) {
        // Lock the first strong result for this recording. Short chunks can
        // contain a name or a code-switch, so changing language mid-sentence
        // would be more confusing than helpful.
        proposedLanguageRef.current = data.detectedLanguage
        setDetectedCaptionLanguage(data.detectedLanguage)
        onLanguageDetected?.(data.detectedLanguage)
      }
      if (data.text && data.text.trim()) {
        finalTranscriptRef.current = (finalTranscriptRef.current + ' ' + data.text.trim()).trim()
        setLiveText(finalTranscriptRef.current)
        onLiveTranscript?.(finalTranscriptRef.current)
        setCaptionError('')
      }
    } catch {
      // Best-effort - the final Whisper pass on the full recording (in
      // /api/triage) is what actually matters. Only surface an error if we
      // haven't managed a single successful caption yet, so one dropped
      // chunk mid-stream doesn't overwrite text that's already showing.
      if (!finalTranscriptRef.current) {
        setCaptionError(language === 'en' ? 'Live captions are not available right now' : `${t.intake.listening}`)
      }
    }
  }

  const startChunkCaptioning = (stream: MediaStream, session: number) => {
    const mimeType = ['audio/webm;codecs=opus', 'audio/webm']
      .find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || ''

    const launchChunk = () => {
      if (session !== recordingSessionRef.current || !(mediaRef.current && mediaRef.current.state === 'recording')) return

      const seq = ++captionSeqRef.current
      const chunkChunks: Blob[] = []
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunkChunks.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunkChunks, { type: recorder.mimeType || 'audio/webm' })
        uploadChunkForCaption(blob, seq, session)
        if (session === recordingSessionRef.current && mediaRef.current && mediaRef.current.state === 'recording') {
          launchChunk()
        }
      }

      chunkRecorderRef.current = recorder
      recorder.start()
      setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop()
      }, CHUNK_MS)
    }

    launchChunk()
  }

  const startRecording = async () => {
    try {
      const session = recordingSessionRef.current + 1
      recordingSessionRef.current = session
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg'
      ].find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || ''

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type })
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
        onAudioReady(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRef.current = recorder
      recorder.start(250)
      setRecording(true)
      setSeconds(0)
      setLiveText('')
      setCaptionError('')
      finalTranscriptRef.current = ''
      captionSeqRef.current = 0
      lastAppliedSeqRef.current = 0
      proposedLanguageRef.current = null
      decisionGenerationRef.current += 1
      setDetectedCaptionLanguage(null)

      // Waveform visualizer, driven by the mic's actual amplitude.
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioCtx()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioCtxRef.current = audioCtx
      analyserRef.current = analyser
      runLevelLoop()

      startChunkCaptioning(stream, session)

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording()
            return MAX_SECONDS
          }
          return s + 1
        })
      }, 1000)
    } catch {
      setPermissionDenied(true)
    }
  }

  const stopRecording = () => {
    // Keep the final in-flight chunk alive: it may be the only useful
    // provisional detection for a short recording. A new recording or an
    // explicit choice invalidates it synchronously.
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    audioCtxRef.current?.close?.()
    audioCtxRef.current = null
    analyserRef.current = null
    try { chunkRecorderRef.current?.stop() } catch { /* already stopped */ }
    chunkRecorderRef.current = null
    setLevels(Array(BAR_COUNT).fill(0.08))
    setRecording(false)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (permissionDenied) {
    return (
      <div className={clsx("rounded-lg border p-4 text-sm indic-body", isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "border-red-200 bg-red-50 text-red-700")}>
        {MIC_ERROR_I18N[language] || MIC_ERROR_I18N.en}
      </div>
    )
  }

  return (
    <div className={clsx("h-full flex flex-col", isLg ? "space-y-4" : "space-y-3")}>
      {/* Record button + live waveform */}
      <div className={clsx("flex flex-col items-center flex-1 justify-center", isLg ? "gap-4 py-3 sm:py-5" : "gap-3")}>
        <button
          onClick={recording ? stopRecording : startRecording}
          className={clsx(
            'relative flex items-center justify-center rounded-lg border transition-transform duration-150',
            isLg ? 'w-20 h-20' : 'w-16 h-16',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            isDark ? 'focus:ring-offset-zinc-950 border-primary/50' : 'focus:ring-offset-card border-primary-active',
            recording
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500/50 scale-105 border-red-600'
              : 'bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/40'
          )}
          aria-label={recording ? 'Stop recording' : 'Start recording'}
        >
          {recording && (
            <span
              className="absolute inset-0 rounded-lg bg-red-500/30"
              style={{ transform: `scale(${1 + levels[0] * 0.5})`, transition: 'transform 80ms linear' }}
            />
          )}
          {recording
            ? <Square className={clsx("text-white fill-white relative", isLg ? "w-7 h-7" : "w-6 h-6")} />
            : <Mic className={clsx("relative text-white", isLg ? "w-8 h-8" : "w-6 h-6")} />
          }
        </button>

        <div className={clsx(
          "flex items-end justify-center",
          isLg ? "gap-1 h-11 w-full max-w-[260px]" : "gap-[3px] h-10 w-full max-w-[220px]"
        )}>
          {levels.map((lvl, i) => (
            <div
              key={i}
              className={clsx(
                isLg ? 'w-1 rounded-full' : 'w-[3px] rounded-full',
                recording ? 'bg-primary' : (isDark ? 'bg-zinc-700' : 'bg-border')
              )}
              style={{
                height: `${Math.max(3, lvl * (isLg ? 48 : 40))}px`,
                transition: recording ? 'height 60ms linear' : 'height 200ms ease-out',
              }}
            />
          ))}
        </div>

        {recording && (
          <div className={clsx("flex items-center gap-2 font-mono text-xs font-bold", isDark ? "text-red-400" : "text-red-600")}>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {formatTime(seconds)} / {formatTime(MAX_SECONDS)}
          </div>
        )}

        <p className={clsx("text-center", isLg ? "text-xs sm:text-sm font-medium" : "text-xs", isDark ? "text-white/60" : "text-muted-foreground")}>
          {recording
            ? t.intake.stopRecording
            : t.intake.startRecording}
        </p>
      </div>

      {/* Live caption */}
      {(recording || liveText || displayedProposal) && (
        <div className={clsx("max-h-24 min-h-[2.5rem] overflow-y-auto rounded-md p-2.5 text-xs", isDark ? "bg-white/5 text-white/80" : "border border-border bg-surface text-muted-foreground")}>
          {languagePreference === 'auto' && displayedProposal && (
            <div className={clsx("mb-1.5 flex flex-wrap items-center gap-1.5 font-medium", isDark ? "text-blue-300" : "text-primary")}>
              <span>{languageCopy(languageConfirmation.heard, LANGUAGE_MAP[displayedProposal].name)}</span>
              <button
                type="button"
                onClick={() => {
                  decisionGenerationRef.current += 1
                  proposedLanguageRef.current = displayedProposal
                  onLanguageChoice?.(displayedProposal, 'manual')
                }}
                className="rounded border border-current/30 px-1.5 py-0.5 text-[10px] font-semibold hover:bg-primary/10"
              >
                {languageCopy(languageConfirmation.use, LANGUAGE_MAP[displayedProposal].name)}
              </button>
              <button
                type="button"
                onClick={() => {
                  const selected = uiLanguageRef.current
                  decisionGenerationRef.current += 1
                  proposedLanguageRef.current = null
                  setDetectedCaptionLanguage(null)
                  onLanguageChoice?.(selected, 'manual')
                }}
                className="rounded border border-current/30 px-1.5 py-0.5 text-[10px] font-semibold hover:bg-primary/10"
              >
                {languageCopy(languageConfirmation.keep, LANGUAGE_MAP[uiLanguageRef.current].name)}
              </button>
            </div>
          )}
          {liveText || (captionError
            ? <span className="text-amber-600">{captionError}</span>
            : <span className="opacity-50 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" />{t.intake.listening}</span>
          )}
        </div>
      )}

      {/* Playback */}
      {blobUrl && !recording && (
        <div className={clsx("rounded-md border p-2.5", isDark ? "bg-green-500/10 border-green-500/30" : "border-green-200 bg-green-50")}>
          <p className={clsx("text-[10px] font-semibold mb-1.5 uppercase tracking-wide indic-body", isDark ? "text-green-400" : "text-green-700")}>
            {AUDIO_READY_I18N[language] || AUDIO_READY_I18N.en}
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={blobUrl} className={clsx("w-full h-8", isDark ? "opacity-90 grayscale-[0.2]" : "")} />
        </div>
      )}
    </div>
  )
}
