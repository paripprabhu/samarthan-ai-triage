import React from 'react'
import { Mic, ShieldCheck, Scale, Phone, Building2 } from 'lucide-react'
import { SupportedLanguage } from '@/lib/i18n/languages'
import { getTranslation } from '@/lib/i18n/translations'

interface HowItWorksProps {
  language: SupportedLanguage
}

interface StepItem {
  n: string
  title: string
  body: string
  points: { icon: React.ReactNode; text: string }[]
  shot: string
}

const SUBTITLE_MAP: Record<string, string> = {
  en: 'Tell us what happened. We help you prepare a report and find the next step.',
  hi: 'बिना किसी जटिल कानूनी फॉर्म के साइबर धोखाधड़ी की शिकायत दर्ज करें, सही धाराएं प्राप्त करें और बैंक खाता फ्रीज कराने की प्रक्रिया शुरू करें।',
  bn: 'জটিল ফর্ম পূরণ ছাড়াই সাইবার প্রতারণার অভিযোগ দায়ের করুন, আইনি ধারা জানুন এবং ব্যাংক অ্যাকাউন্ট ফ্রিজ করার প্রক্রিয়া শুরু করুন।',
  mr: 'जटिल फॉर्म न भरता सायबर फसवणुकीची तक्रार नोंदवा, योग्य कायदेशीर कलमे मिळवा आणि बँक खाते गोठवण्याची प्रक्रिया सुरू करा.',
  te: 'సంక్లిష్టమైన ఫారమ్‌లు లేకుండా సైబర్ క్రైమ్ ఫిర్యాదులను నమోదు చేయండి, సంబంధిత చట్ట విభాగాలను పొందండి మరియు బ్యాంక్ ఫ్రీజ్ ప్రక్రియను ప్రారంభించండి.',
  ta: 'சிக்கலான படிவங்கள் இல்லாமல் சைபர் குற்றப் புகார்களைப் பதிவு செய்து, சட்டப் பிரிவுகளைப் பெற்று, வங்கி முடக்க நடவடிக்கையைத் தொடங்குங்கள்.',
  gu: 'કોઈપણ જટિલ ફોર્મ વગર સાયબર છેતરપિંડીની ફરિયાદ નોંધાવો, કાનૂની કલમો મેળવો અને બેંક એકાઉન્ટ ફ્રીઝ કરવાની પ્રક્રિયા શરૂ કરો.',
  ur: 'کسی پیچیدہ فارم کے بغیر سائبر کرائم کی شکایت درج کریں، قانونی دفعات حاصل کریں اور بینک اکاؤنٹ فریز کرنے کا عمل شروع کریں۔',
  kn: 'ಯಾವುದೇ ಸಂಕೀರ್ಣ ಫಾರ್ಮ್‌ಗಳಿಲ್ಲದೆ ಸೈಬರ್ ಅಪರಾಧ ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಿ, ಕಾನೂನು ವಿಭಾಗಗಳನ್ನು ಪಡೆಯಿರಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ ಫ್ರೀಜ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ.',
  or: 'କୌଣସି ଜଟିଳ ଫର୍ମ ବିନା ସାଇବର୍ ଅପରାଧ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ, ଆଇନଗତ ଧାରା ଜାଣନ୍ତୁ ଏବଂ ବ୍ୟାଙ୍କ ଖାତା ଫ୍ରିଜ୍ ପ୍ରକ୍ରିୟା ଆରମ୍ଭ କରନ୍ତୁ।',
  ml: 'സങ്കീർണ്ണമായ ഫോമുകളില്ലാതെ സൈബർ കുറ്റകൃത്യ പരാതികൾ നൽകുക, നിയമ വകുപ്പുകൾ നേടുക, ബാങ്ക് അക്കൗണ്ട് ഫ്രീസ് ചെയ്യുക.',
  pa: 'ਬਿਨਾਂ ਕਿਸੇ ਗੁੰਝਲਦਾਰ ਫਾਰਮ ਦੇ ਸਾਈਬਰ ਅਪਰਾਧ ਦੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ, ਕਾਨੂੰਨੀ ਧਾਰਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ ਅਤੇ ਬੈਂਕ ਖਾਤਾ ਫ੍ਰੀਜ਼ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਕਰੋ।',
}

export default function HowItWorks({ language }: HowItWorksProps) {
  const isHi = language === 'hi'
  const t = getTranslation(language)
  const subtitle = SUBTITLE_MAP[language] || SUBTITLE_MAP.en

  const steps: StepItem[] = [
    {
      n: '01',
      title: t.howItWorks.step1Title,
      body: t.howItWorks.step1Desc,
      points: isHi
        ? [
            { icon: <Mic className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'बोलकर या लिखकर त्वरित शिकायत' },
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'डिजीलॉकर से सुरक्षित आधार सत्यापन' },
          ]
        : [
            { icon: <Mic className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'Use voice or text in 12 languages' },
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'Verify your identity with DigiLocker' },
          ],
      shot: '/landing/shot-intake.png',
    },
    {
      n: '02',
      title: t.howItWorks.step2Title,
      body: t.howItWorks.step2Desc,
      points: isHi
        ? [
            { icon: <Scale className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'IT एक्ट और BNS की कानूनी धाराएं' },
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />, text: 'तैयार औपचारिक पुलिस शिकायत पत्र' },
          ]
        : [
            { icon: <Scale className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'See relevant legal sections' },
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />, text: 'Check a clear complaint draft' },
          ],
      shot: '/landing/shot-dashboard.png',
    },
    {
      n: '03',
      title: t.howItWorks.step3Title,
      body: t.howItWorks.step3Desc,
      points: isHi
        ? [
            { icon: <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />, text: '1930 ऑपरेटर को बताने के मुख्य बिंदु' },
            { icon: <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'बैंक नोडल अधिकारी को खाता फ्रीज नोटिस' },
          ]
        : [
            { icon: <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />, text: 'Know what to say when you call 1930' },
            { icon: <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />, text: 'Get steps to share with your bank' },
          ],
      shot: '/landing/shot-complaints.png',
    },
  ]

  return (
    <section id="how-it-works" className="relative py-12 sm:py-16 md:py-20 bg-surface border-t border-border overflow-hidden">
      <div aria-hidden="true" className="absolute right-[-12rem] top-24 h-80 w-80 rounded-full border border-border" />
      <div aria-hidden="true" className="absolute right-[-7rem] top-36 h-52 w-52 rounded-full border border-amber-500/15" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="relative mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.14em] mb-2">
            {t.howItWorks.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-[-0.03em]">
            {t.howItWorks.title}
          </h2>
          <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="relative space-y-14 sm:space-y-20 md:space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Text column (5 cols) */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                  <span className="text-sm sm:text-base font-sans font-extrabold text-primary bg-primary-tint border border-primary px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md">
                    {step.n}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-[-0.025em] leading-snug">{step.title}</h3>
                <p className="mt-2.5 sm:mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">{step.body}</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {step.points.map((point, ptIdx) => (
                    <div
                      key={ptIdx}
                      className="flex items-start gap-2 p-2 sm:p-2.5 rounded-md bg-white/85 dark:bg-zinc-900 border border-border text-xs sm:text-[13px] font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs"
                    >
                      <span className="shrink-0 mt-0.5">{point.icon}</span>
                      <span className="leading-snug">{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshot column: 7 cols */}
              <div className="lg:col-span-7">
                <div className="how-it-works-preview rounded-xl border border-border bg-white dark:bg-zinc-900 shadow-[var(--shadow-panel)] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_52px_-28px_rgba(17,33,54,0.48)] group">
                  {/* Browser top chrome bar */}
                  <div className="h-8 md:h-9 px-3 sm:px-4 bg-zinc-100/90 dark:bg-zinc-850 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 block" />
                    </div>
                    <span className="text-xs font-sans font-medium text-zinc-400 dark:text-zinc-500 tracking-tight select-none">
                      {step.n === '01' ? 'samarthan.app/intake' : step.n === '02' ? 'samarthan.app/dossier' : 'samarthan.app/complaints'}
                    </span>
                    <span className="w-3" />
                  </div>
                  {/* Screenshot display */}
                  <div className="bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.shot}
                      alt={step.title}
                      className="how-it-works-shot w-full h-auto object-cover object-top block transition-transform duration-500 group-hover:scale-[1.012]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
