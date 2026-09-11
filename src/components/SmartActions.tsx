import React, { useState } from 'react'
import {
  Mail, Navigation, CheckCircle2, Loader2, Phone, ExternalLink,
  Instagram, Landmark,
} from 'lucide-react'
import { RecommendedChannel } from '@/data/scenarios'
import { getEscalationChannel } from '@/data/escalationChannels'
import { SupportedLanguage } from '@/lib/i18n/languages'
import { SMART_ACTIONS_I18N } from '@/lib/i18n/componentTranslations'

interface SmartActionsProps {
  bankName: string
  incidentId: string
  amount: number
  hi?: boolean
  language?: SupportedLanguage
  fraudsterIdentifier?: string
  summary?: string
  utrNumber?: string
  upiId?: string
  recommendedChannel?: RecommendedChannel
  recommendedChannelTarget?: string
  followUpPoints?: string[]
  onBankNotified?: () => void
  onPlatformReported?: () => void
  onPoliceRouted?: () => void
}

function resolveBankInfo(bankName?: string) {
  const raw = String(bankName || '').trim()
  const lower = raw.toLowerCase()
  if (lower.includes('hdfc')) return { name: raw || 'HDFC Bank', email: 'cyberfraud@hdfcbank.com' }
  if (lower.includes('icici')) return { name: raw || 'ICICI Bank', email: 'antifraud@icicibank.com' }
  if (lower.includes('sbi') || lower.includes('state bank')) return { name: raw || 'State Bank of India', email: 'report.phishing@sbi.co.in' }
  if (lower.includes('axis')) return { name: raw || 'Axis Bank', email: 'nodal.officer@axisbank.com' }
  if (lower.includes('kotak')) return { name: raw || 'Kotak Mahindra Bank', email: 'fraud.control@kotak.com' }
  if (lower.includes('pnb') || lower.includes('punjab national')) return { name: raw || 'Punjab National Bank', email: 'nodalofficer@pnb.co.in' }
  if (lower.includes('baroda')) return { name: raw || 'Bank of Baroda', email: 'nodal@bankofbaroda.co.in' }
  if (raw && raw !== 'Not Provided' && raw !== 'Bank Nodal Desk') {
    const slug = raw.toLowerCase().replace(/[^a-z0-9]/g, '')
    return { name: raw, email: `cyberfraud@${slug || 'bank'}.com` }
  }
  return { name: 'Bank', email: 'nodal.officer@rbi.org.in' }
}

export default function SmartActions({
  bankName, incidentId, amount, hi, language, fraudsterIdentifier, summary,
  utrNumber, upiId,
  recommendedChannel, recommendedChannelTarget,
  followUpPoints = [], onBankNotified, onPlatformReported, onPoliceRouted,
}: SmartActionsProps) {
  const lang: SupportedLanguage = language || (hi ? 'hi' : 'en')
  const loc = SMART_ACTIONS_I18N[lang] || SMART_ACTIONS_I18N.en
  const [locating, setLocating] = useState(false)
  const [policeStation, setPoliceStation] = useState<string | null>(null)
  const [primarySimulating, setPrimarySimulating] = useState(false)
  const [primaryDone, setPrimaryDone] = useState(false)
  const [primaryConfirmedTarget, setPrimaryConfirmedTarget] = useState<string | null>(null)
  const primaryTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const policeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (primaryTimeoutRef.current) clearTimeout(primaryTimeoutRef.current)
      if (policeTimeoutRef.current) clearTimeout(policeTimeoutRef.current)
    }
  }, [])

  const ch = getEscalationChannel(recommendedChannel, recommendedChannelTarget)
  const kind = ch.kind
  const bankInfo = resolveBankInfo(bankName)
  const followUpText = followUpPoints.length > 0
    ? `\n\nAdditional updates since filing:\n${followUpPoints.map(p => `- ${p}`).join('\n')}`
    : ''

  const handlePrimarySimulate = () => {
    if (primarySimulating || primaryDone) return
    setPrimarySimulating(true)

    if (kind === 'bank') {
      primaryTimeoutRef.current = setTimeout(() => {
        setPrimaryConfirmedTarget(bankInfo.email)
        setPrimarySimulating(false)
        setPrimaryDone(true)
        onBankNotified?.()
      }, 2000)
    } else {
      const target = recommendedChannelTarget || (kind === 'platform' ? 'Platform Cyber Cell' : 'Agency Desk')
      const offender = fraudsterIdentifier && fraudsterIdentifier !== 'Not Identified' ? fraudsterIdentifier : 'the reported account'
      const draft = [
        `Report to: ${target}`,
        `Incident ID: ${incidentId}`,
        `Reported account / entity: ${offender}`,
        summary ? `\nWhat happened:\n${summary}` : '',
        followUpText,
        `\nRequested action: Take down / block the account and preserve records for law enforcement (NCRP).`,
      ].join('\n')
      navigator.clipboard?.writeText(draft).catch(() => {})

      primaryTimeoutRef.current = setTimeout(() => {
        setPrimaryConfirmedTarget(target)
        setPrimarySimulating(false)
        setPrimaryDone(true)
        onPlatformReported?.()
      }, 2000)
    }
  }

  const handleRoutePolice = () => {
    if (locating || policeStation) return
    setLocating(true)
    policeTimeoutRef.current = setTimeout(() => {
      const stations = ['Cyber Crime Station, Bandra', 'Cyber Cell, HSR Layout', 'Cyber Police, Connaught Place']
      setPoliceStation(stations[Math.floor(Math.random() * stations.length)])
      setLocating(false)
      onPoliceRouted?.()
    }, 2000)
  }

  const primaryIcon = primarySimulating ? (
    <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
  ) : primaryDone ? (
    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
  ) : kind === 'bank' ? (
    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  ) : kind === 'platform' ? (
    <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
  ) : kind === 'agency' ? (
    <Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
  ) : (
    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  )

  // 1) Idle description
  let idleDesc = ''
  if (kind === 'bank') {
    idleDesc = lang === 'hi'
      ? `${bankInfo.name} के नोडल अधिकारी को तत्काल फ्रीज नोटिस भेजें (डेमो)`
      : (loc.bankActionDesc || `Simulates sending freeze notice to ${bankInfo.name} nodal desk`)
  } else if (kind === 'platform') {
    idleDesc = lang === 'hi'
      ? `${recommendedChannelTarget || 'प्लेटफ़ॉर्म'} के लिए टेकडाउन रिपोर्ट भेजने का सिमुलेशन (डेमो)`
      : `Simulates filing takedown report with ${recommendedChannelTarget || 'the platform'}`
  } else {
    idleDesc = lang === 'hi'
      ? `${recommendedChannelTarget || 'एजेंसी'} को विवरण भेजने का सिमुलेशन (डेमो)`
      : `Simulates escalating dossier to ${recommendedChannelTarget || 'the agency'}`
  }

  // 2) Simulating description
  let simulatingDesc = ''
  if (kind === 'bank') {
    simulatingDesc = lang === 'hi'
      ? `${bankInfo.name} नोडल साइबर डेस्क से संपर्क किया जा रहा है (डेमो)...`
      : (loc.bankActionSimulating || `Connecting to ${bankInfo.name} nodal cyber desk (demo)...`)
  } else if (kind === 'platform') {
    simulatingDesc = lang === 'hi'
      ? `${recommendedChannelTarget || 'प्लेटफ़ॉर्म'} को विवरण भेजा जा रहा है (डेमो)...`
      : `Transmitting incident report to ${recommendedChannelTarget || 'the platform'} (demo)...`
  } else {
    simulatingDesc = lang === 'hi'
      ? `${recommendedChannelTarget || 'एजेंसी'} को विवरण भेजा जा रहा है (डेमो)...`
      : `Transmitting incident dossier to ${recommendedChannelTarget || 'the agency'} (demo)...`
  }

  // 3) Done description
  let doneDesc = ''
  if (kind === 'bank') {
    doneDesc = lang === 'hi'
      ? `${bankInfo.name} नोडल अधिकारी को सूचित किया गया • खाता फ्रीज दर्ज (डेमो)`
      : `Notified ${primaryConfirmedTarget || bankInfo.email} • Freeze logged (demo)`
  } else if (kind === 'platform') {
    doneDesc = lang === 'hi'
      ? `${primaryConfirmedTarget || 'प्लेटफ़ॉर्म'} को रिपोर्ट दर्ज की गई (डेमो)`
      : `Report logged with ${primaryConfirmedTarget || 'platform'} Trust & Safety (demo)`
  } else {
    doneDesc = lang === 'hi'
      ? `${primaryConfirmedTarget || 'एजेंसी'} को रिपोर्ट दर्ज की गई (डेमो)`
      : `Dossier submitted to ${primaryConfirmedTarget || 'agency'} (demo)`
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1 uppercase tracking-wide">
        {loc.header}
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{lang === 'hi' ? ch.descHi : ch.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary channel-driven action — Fully Simulated, Never takes user away */}
        <button
          onClick={primaryDone || primarySimulating ? undefined : handlePrimarySimulate}
          disabled={primarySimulating || primaryDone}
          className={`flex flex-col items-start gap-3 p-4 rounded-lg border transition-all text-left ${
            primaryDone
              ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
          }`}
        >
          <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
            primaryDone
              ? 'bg-green-100 dark:bg-green-950/60'
              : kind === 'platform' ? 'bg-pink-100 dark:bg-pink-950/60'
              : kind === 'agency' ? 'bg-indigo-100 dark:bg-indigo-950/60'
              : 'bg-blue-100 dark:bg-blue-950/60'
          }`}>
            {primaryIcon}
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1 flex items-center gap-1.5">
              {kind === 'bank' ? loc.bankActionTitle : (lang === 'hi' ? ch.titleHi : ch.title)}
              <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 rounded-sm px-1.5 py-0.5">
                {loc.simulatedBadge}
              </span>
            </h4>
            {primarySimulating ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{simulatingDesc}</p>
            ) : primaryDone ? (
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">{doneDesc}</p>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{idleDesc}</p>
            )}
          </div>
        </button>

        {/* Route to Police — Beautiful in both Light and Dark Mode */}
        <button
          onClick={policeStation || locating ? undefined : handleRoutePolice}
          disabled={locating || !!policeStation}
          className={`flex flex-col items-start gap-3 p-4 rounded-lg border transition-all text-left ${
            policeStation
              ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20'
          }`}
        >
          <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
            policeStation
              ? 'bg-green-100 dark:bg-green-950/60'
              : 'bg-amber-100 dark:bg-amber-950/80'
          }`}>
            {locating ? (
              <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
            ) : policeStation ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Navigation className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1 flex items-center gap-1.5">
              {loc.routePoliceTitle}
              <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 rounded-sm px-1.5 py-0.5">
                {loc.simulatedBadge}
              </span>
            </h4>
            {locating ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{loc.routePoliceLocating}</p>
            ) : policeStation ? (
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">Routed to: {policeStation} (demo)</p>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{loc.routePoliceDesc}</p>
            )}
          </div>
        </button>
      </div>

      {/* Real helpline numbers + portal for this route */}
      {(ch.hotline || ch.portalUrl) && (
        <div className="mt-4 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1">
            {loc.realContacts}
          </span>
          {ch.hotline && (
            <a href={`tel:${ch.hotline}`} className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-xs">
              <Phone className="w-3.5 h-3.5" />
              {ch.hotline === '1930' ? loc.call1930 : (lang === 'hi' ? ch.hotlineLabelHi : ch.hotlineLabel)}
            </a>
          )}
          {ch.hotline2 && (
            <a href={`tel:${ch.hotline2}`} className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-xs">
              <Phone className="w-3.5 h-3.5" />
              {lang === 'hi' ? ch.hotline2LabelHi : ch.hotline2Label}
            </a>
          )}
          {ch.portalUrl && (
            <a href={ch.portalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              {ch.portalUrl.includes('cybercrime.gov.in') ? loc.openCybercrime : (lang === 'hi' ? ch.portalLabelHi : ch.portalLabel)}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
