import React from 'react'
import { ShieldCheck, Fingerprint, TrendingUp, AlertTriangle } from 'lucide-react'
import { SupportedLanguage } from '@/lib/i18n/languages'
import { getTranslation } from '@/lib/i18n/translations'

interface TrustStripProps {
  language: SupportedLanguage
}

const SUB_LABELS: Record<string, { f1: string; f2: string; f3: string; f4: string }> = {
  en: {
    f1: 'Reported on 1930 in 2024',
    f2: 'Lost to digital financial fraud',
    f3: '1-click Aadhaar & PAN verification',
    f4: 'Immediate freeze dossier generated',
  },
  hi: {
    f1: '2024 NCRP भारत रिपोर्ट',
    f2: 'वार्षिक राष्ट्रीय वित्तीय हानि',
    f3: '1-क्लिक आधार व पैन सत्यापन',
    f4: 'घबराहट से FIR व बैंक फ्रीज डोजियर',
  },
  bn: {
    f1: '২০২৪ NCRP রিপোর্ট',
    f2: 'বার্ষিক ডিজিটাল আর্থিক ক্ষতি',
    f3: 'আধার ও প্যান যাচাইকরণ',
    f4: 'তাৎক্ষণিক ব্যাংক ফ্রিজ ডসিয়ার',
  },
  mr: {
    f1: '२०२४ NCRP अहवाल',
    f2: 'वार्षिक डिजिटल आर्थिक नुकसान',
    f3: 'आधार व पॅन पडताळणी',
    f4: 'तात्काळ बँक फ्रीझ डॉसियर',
  },
  te: {
    f1: '2024 NCRP భారతదేశ నివేదిక',
    f2: 'వార్షిక డిజిటల్ ఆర్థిక నష్టం',
    f3: 'ఆధార్ & పాన్ ధృవీకరణ',
    f4: 'తక్షణ బ్యాంక్ ఫ్రీజ్ డోసియర్',
  },
  ta: {
    f1: '2024 NCRP அறிக்கை',
    f2: 'வருடாந்திர டிஜிட்டல் நிதி இழப்பு',
    f3: 'ஆதார் & பான் சரிபார்ப்பு',
    f4: 'உடனடி வங்கி முடக்கம் கோப்பு',
  },
  gu: {
    f1: '2024 NCRP રિપોર્ટ',
    f2: 'વાર્ષિક ડિજિટલ નાણાકીય નુકસાન',
    f3: 'આધાર અને પાન ચકાસણી',
    f4: 'તાત્કાલિક બેંક ફ્રીઝ ડોઝિયર',
  },
  ur: {
    f1: '2024 این سی آر پی رپورٹ',
    f2: 'ڈیجیٹل مالی فراڈ میں سالانہ نقصان',
    f3: 'آدھار اور پین تصدیق',
    f4: 'فوری بینک فریز ڈوزیئر',
  },
  kn: {
    f1: '2024 NCRP ವರದಿ',
    f2: 'ವಾರ್ಷಿಕ ಡಿಜಿಟಲ್ ಆರ್ಥಿಕ ನಷ್ಟ',
    f3: 'ಆಧಾರ ಮತ್ತು ಪ್ಯಾನ್ ಪರಿಶೀಲನೆ',
    f4: 'ತಕ್ಷಣದ ಬ್ಯಾಂಕ್ ಫ್ರೀಜ್ ಡೋಸಿಯರ್',
  },
  or: {
    f1: '୨୦୨୪ NCRP ରିପୋର୍ଟ',
    f2: 'ବାର୍ଷିକ ଡିଜିଟାଲ୍ ଆର୍ଥିକ କ୍ଷତି',
    f3: 'ଆଧାର ଓ ପ୍ୟାନ୍ ଯାଞ୍ଚ',
    f4: 'ତୁରନ୍ତ ବ୍ୟାଙ୍କ ଫ୍ରିଜ୍ ଡୋଜିଅର୍',
  },
  ml: {
    f1: '2024 NCRP റിപ്പോർട്ട്',
    f2: 'വാർഷിക ഡിജിറ്റൽ സാമ്പത്തിക നഷ്ടം',
    f3: 'ആധാർ & പാൻ സ്ഥിരീകരണം',
    f4: 'തൽക്ഷണ ബാങ്ക് ഫ്രീസ് ഡോസിയർ',
  },
  pa: {
    f1: '2024 NCRP ਰਿਪੋਰਟ',
    f2: 'ਸਾਲਾਨਾ ਡਿਜੀਟਲ ਵਿੱਤੀ ਨੁਕਸਾਨ',
    f3: 'ਆਧਾਰ ਅਤੇ ਪੈਨ ਤਸਦੀਕ',
    f4: 'ਤੁਰੰਤ ਬੈਂਕ ਫ੍ਰੀਜ਼ ਡੋਜ਼ੀਅਰ',
  },
}

export default function TrustStrip({ language }: TrustStripProps) {
  const t = getTranslation(language)
  const subs = SUB_LABELS[language] || SUB_LABELS.en

  const items = [
    {
      icon: <TrendingUp className="w-4 h-4 text-primary shrink-0" />,
      label: t.trust.reportedFraudsLabel,
      value: t.trust.reportedFrauds,
      sub: subs.f1,
    },
    {
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
      label: t.trust.lostToFraudLabel,
      value: t.trust.lostToFraud,
      sub: subs.f2,
    },
    {
      icon: <Fingerprint className="w-4 h-4 text-primary shrink-0" />,
      label: t.nav.digiLockerVerified,
      value: 'DigiLocker',
      sub: subs.f3,
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-primary shrink-0" />,
      label: t.trust.triageSpeedLabel,
      value: t.trust.triageSpeed,
      sub: subs.f4,
    },
  ]

  return (
    <section className="w-full bg-surface border-y border-zinc-200/80 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 4 Major Points Grid with exact row heights for absolute horizontal alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-4 sm:p-5 border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between h-full"
            >
              {/* Row 1: Header (Icon + Label) with fixed min-height */}
              <div className="min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center gap-2 mb-2 sm:mb-2.5">
                <span className="shrink-0">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  {item.label}
                </span>
              </div>

              {/* Row 2: Value with fixed height & baseline alignment */}
              <div className="h-10 sm:h-11 flex items-center my-1">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-sans leading-none">
                  {item.value}
                </p>
              </div>

              {/* Row 3: Subtext with fixed min-height */}
              <div className="min-h-[2rem] sm:min-h-[2.25rem] flex items-center border-t border-zinc-100 dark:border-zinc-800/80 pt-2 sm:pt-2.5 mt-2">
                <p className="text-xs leading-snug text-zinc-500 dark:text-zinc-400 font-sans line-clamp-2">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
