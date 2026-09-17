'use client'

import { TriageResult } from '@/data/scenarios'
import { SupportedLanguage, LANGUAGE_MAP } from '@/lib/i18n/languages'
import { getTranslation } from '@/lib/i18n/translations'

interface PrintableComplaintProps {
  result: TriageResult
  language: SupportedLanguage
  activeDraft?: 'english' | 'regional'
}

function formatAckNumber(id: string) {
  return id.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export default function PrintableComplaint({ result, language, activeDraft }: PrintableComplaintProps) {
  const hi = language === 'hi'
  const t = getTranslation(language)
  const meta = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
  
  let draft = result.complaintDraft
  if (activeDraft === 'regional') {
    draft = language === 'hi'
      ? (result.complaintDraftHi || result.complaintDraft)
      : (result.complaintDraftRegional || result.complaintDraft)
  } else if (activeDraft === 'english') {
    draft = result.complaintDraft
  } else {
    draft = language === 'hi' ? result.complaintDraftHi : (result.complaintDraftRegional || result.complaintDraft)
  }
  const now = new Date()

  const summaryRows: [string, string, string][] = [
    ['Category', 'श्रेणी', result.fraudType],
    ['Urgency', 'प्राथमिकता', result.urgencyLevel],
    ['Your Name', 'शिकायतकर्ता', result.complainantName || 'Citizen'],
    ['Amount', 'राशि', Number(result.amount) > 0 ? `₹${Number(result.amount).toLocaleString('en-IN')}` : 'Not given'],
    ['Reported Account', 'आरोपी', result.fraudsterIdentifier],
    ['Contact', 'संपर्क', result.frauderContact],
    ['Bank', 'बैंक', result.bankName],
    ['When It Happened', 'समयरेखा', result.timeline],
  ]

  if (result.utrNumber) {
    summaryRows.push(['Transaction ID / UTR', 'लेनदेन यूटीआर संदर्भ', result.utrNumber])
  }
  if (result.upiId) {
    summaryRows.push(['UPI ID', 'लाभार्थी यूपीआई / वीपीए', result.upiId])
  }
  if (result.ifscCode) {
    summaryRows.push(['IFSC Code', 'आईएफएससी कोड', result.ifscCode])
  }

  return (
    <div className="print-only bg-white p-10 font-sans text-sm text-black">
      <div className="text-center mb-6">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          {hi ? 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल' : 'Cyber Crime Reporting Portal'}
        </p>
        <h1 className="text-xl font-bold mt-1">
          {hi ? 'शिकायत पावती रसीद' : 'Report receipt'}
        </h1>
        {language !== 'en' && language !== 'hi' && (
          <p className="text-xs text-gray-600 mt-0.5 font-medium">
            ({meta.nativeName} · {meta.name})
          </p>
        )}
      </div>

      <div className="border-2 border-black rounded-none p-4 mb-6 text-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          {hi ? 'पावती संख्या' : 'Report number'}
        </p>
        <p className="text-2xl font-bold font-sans tracking-wider">{formatAckNumber(result.incidentId)}</p>
      </div>

      <table className="w-full text-xs border-collapse mb-6">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-1.5 pr-4 text-gray-500 w-1/3">{hi ? 'दर्ज करने की तिथि' : 'Date filed'}</td>
            <td className="py-1.5 font-medium">
              {now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              {' · '}
              {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
            </td>
          </tr>
          {summaryRows.map(([en, hiLabel, value]) => (
            <tr key={en} className="border-b border-gray-200">
              <td className="py-1.5 pr-4 text-gray-500">{hi ? hiLabel : en}</td>
              <td className="py-1.5 font-medium">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 border-b border-gray-300 pb-1">
          {hi ? 'शिकायत विवरण' : 'Report details'}
        </p>
        <pre className="whitespace-pre-wrap leading-relaxed text-xs font-sans">{draft}</pre>
      </div>

      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 border-b border-gray-300 pb-1">
          {hi ? 'तत्काल सहायता' : 'Get help now'}
        </p>
        <p className="text-xs">
          {hi ? 'राष्ट्रीय साइबर अपराध हेल्पलाइन: ' : 'National Cybercrime Helpline: '}
          <span className="font-bold">1930</span>
          {' · '}
          {hi ? 'पोर्टल: ' : 'Portal: '}
          <span className="font-bold">cybercrime.gov.in</span>
        </p>
      </div>

      <div className="mt-10 border-t-2 border-black pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
          {hi
            ? '⚠ सिंथेटिक डेमो डेटा • सिमुलेटेड पोर्टल इनटेक। यह वास्तविक सरकारी फाइलिंग नहीं है।'
            : '⚠ Demo data • This is not a real government filing.'}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          {hi
            ? 'यह दस्तावेज़ Samarthan द्वारा AI का उपयोग करके तैयार किया गया है और इसे किसी सरकारी एजेंसी द्वारा सत्यापित या प्रस्तुत नहीं किया गया है। कृपया दाखिल करने से पहले cybercrime.gov.in पर सभी विवरण सत्यापित करें।'
            : 'Samarthan used AI to create this document. It has not been checked or filed by a government agency. Check every detail on cybercrime.gov.in before filing.'}
        </p>
      </div>
    </div>
  )
}
