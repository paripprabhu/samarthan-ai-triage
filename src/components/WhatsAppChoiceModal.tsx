'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  MessageCircle,
  ExternalLink,
  Laptop,
  Smartphone,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { SupportedLanguage } from '@/lib/i18n/languages'

interface WhatsAppChoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSimulator: () => void
  language?: SupportedLanguage
  prefilledText?: string
}

export default function WhatsAppChoiceModal({
  isOpen,
  onClose,
  onOpenSimulator,
  language = 'en',
  prefilledText,
}: WhatsAppChoiceModalProps) {
  const isHi = language === 'hi'
  const [botOnline, setBotOnline] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    fetch('/api/whatsapp/live')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setBotOnline(data.status === 'CONNECTED')
        }
      })
      .catch(() => {
        if (isMounted) setBotOnline(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

const WA_MODAL_I18N: Record<SupportedLanguage, {
  title: string
  subtitle: string
  defaultText: string
  simTitle: string
  recommended: string
  simDesc: string
  simLaunch: string
  realTitle: string
  realTag: string
  realDesc: string
  evalHeadsUp: string
  evalNotice: string
  botOnline: string
  botStandby: string
  botChecking: string
  openWa: string
  footerAi: string
  close: string
}> = {
  en: {
    title: 'Samarthan WhatsApp AI Triage',
    subtitle: 'Citizen Cybercrime Assistance Portal Simulation',
    defaultText: 'Hi Samarthan, I want to report a cybercrime incident.',
    simTitle: 'In-App WhatsApp Simulator',
    recommended: 'Recommended',
    simDesc: 'Interactive WhatsApp mockup running inside this app. Zero phone needed: test voice notes, screenshot triage, and live complaint generation on the identical GPT-4o engine.',
    simLaunch: 'Launch In-App Simulator',
    realTitle: 'Open Real WhatsApp App',
    realTag: 'WhatsApp AI Agent',
    realDesc: 'Chat directly in your WhatsApp mobile or web app with our AI agent.',
    evalHeadsUp: '💡 Live Gateway vs In-App Simulation:',
    evalNotice: 'The In-App Simulator provides an immediate browser sandbox of the WhatsApp triage flow. The Real WhatsApp button connects to our live host daemon bridge, which runs on a personal phone and may go offline at any time. Both options run on the identical GPT-4o triage and database engine — the simulator always works.',
    botOnline: 'Host Bridge: Connected',
    botStandby: 'Host Bridge: Standby / Sleep',
    botChecking: 'Checking bridge...',
    openWa: 'Open WhatsApp',
    footerAi: 'Both options use the identical Samarthan AI Engine',
    close: 'Close',
  },
  hi: {
    title: 'व्हाट्सएप AI ट्रायज एजेंट',
    subtitle: 'नागरिक साइबर अपराध सहायता पोर्टल सिमुलेशन',
    defaultText: 'नमस्ते समर्थन, मुझे एक साइबर अपराध घटना की रिपोर्ट करनी है।',
    simTitle: 'ब्राउज़र में व्हाट्सएप सिम्युलेटर खोलें',
    recommended: 'अनुशंसित',
    simDesc: 'बिना फोन के सीधे इसी ऐप में पूरी तरह से कार्यात्मक व्हाट्सएप इंटरफेस। वॉइस नोट, टेक्स्ट और स्क्रीनशॉट सपोर्ट के साथ बिल्कुल असली बॉट की तरह।',
    simLaunch: 'सिम्युलेटर शुरू करें',
    realTitle: 'असली व्हाट्सएप ऐप में खोलें',
    realTag: 'व्हाट्सएप AI एजेंट',
    realDesc: 'अपने फोन या व्हाट्सएप डेस्कटॉप ऐप पर सीधे हमारे AI एजेंट से चैट करें।',
    evalHeadsUp: '💡 लाइव गेटवे बनाम ब्राउज़र सिमुलेशन सूचना:',
    evalNotice: 'इन-ऐप सिम्युलेटर सीधे ब्राउज़र में व्हाट्सएप ट्रायज फ्लो का तुरंत अनुभव देता है। असली व्हाट्सएप बटन एक निजी फोन पर चल रहे लाइव होस्ट ब्रिज से कनेक्ट होता है, जो किसी भी समय ऑफ़लाइन हो सकता है। दोनों विकल्प एक ही GPT-4o AI इंजन और डेटाबेस का उपयोग करते हैं — सिम्युलेटर हमेशा काम करता है।',
    botOnline: 'होस्ट बॉट: ऑनलाइन',
    botStandby: 'होस्ट बॉट: स्टैंडबाय',
    botChecking: 'स्थिति जांची जा रही है...',
    openWa: 'व्हाट्सएप खोलें',
    footerAi: 'दोनों विकल्प एक ही AI इंजन से संचालित हैं',
    close: 'बंद करें',
  },
  bn: {
    title: 'হোয়াটসঅ্যাপ AI ট্রায়াজ এজেন্ট',
    subtitle: 'নাগরিক সাইবার ক্রাইম সহায়তা পোর্টাল সিমুলেশন',
    defaultText: 'নমস্কার সমর্থন, আমি একটি সাইবার অপরাধের ঘটনা রিপোর্ট করতে চাই।',
    simTitle: 'ইন-অ্যাপ হোয়াটসঅ্যাপ সিমুলেটর খুলুন',
    recommended: 'সুপারিশকৃত',
    simDesc: 'ফোনের প্রয়োজন ছাড়াই সরাসরি এই অ্যাপে সম্পূর্ণ কার্যকরী হোয়াটসঅ্যাপ ইন্টারফেস। ভয়েস নোট, স্ক্রিনশট এবং লাইভ এফআইআর জেনারেশন সহ হুবহু আসল বট।',
    simLaunch: 'সিমুলেটর চালু করুন',
    realTitle: 'আসল হোয়াটসঅ্যাপ অ্যাপে খুলুন',
    realTag: 'হোয়াটসঅ্যাপ AI এজেন্ট',
    realDesc: 'আপনার ফোন বা ডেস্কটপ হোয়াটসঅ্যাপে সরাসরি আমাদের এআই এজেন্টের সাথে চ্যাট করুন।',
    evalHeadsUp: '💡 লাইভ গেটওয়ে বনাম ইন-অ্যাপ সিমুলেশন বিজ্ঞপ্তি:',
    evalNotice: 'ইন-অ্যাপ সিমুলেটর সরাসরি ব্রাউজারে হোয়াটসঅ্যাপ ট্রায়াজ ফ্লোর তাত্ক্ষণিক অভিজ্ঞতা প্রদান করে। আসল হোয়াটসঅ্যাপ বোতামটি একটি ব্যক্তিগত ফোনে চলা লাইভ হোস্ট গেটওয়েতে সংযোগ করে, যা যেকোনো সময় অফলাইন হয়ে যেতে পারে। উভয় বিকল্পই অভিন্ন GPT-4o ইঞ্জিনে চলে — সিমুলেটর সবসময় কাজ করে।',
    botOnline: 'হোস্ট বট: অনলাইন',
    botStandby: 'হোস্ট বট: স্ট্যান্ডবাই',
    botChecking: 'যাচাই করা হচ্ছে...',
    openWa: 'হোয়াটসঅ্যাপ খুলুন',
    footerAi: 'উভয় বিকল্পই একই AI ইঞ্জিন দ্বারা পরিচালিত',
    close: 'বন্ধ করুন',
  },
  mr: {
    title: 'व्हॉट्सअॅप AI ट्रायज एजंट',
    subtitle: 'नागरी सायबर गुन्हे सहाय्य पोर्टल सिम्युलेशन',
    defaultText: 'नमस्कार समर्थन, मला सायबर गुन्ह्याची तक्रार करायची आहे.',
    simTitle: 'अॅपमधील व्हॉट्सअॅप सिम्युलेटर उघडा',
    recommended: 'शिफारस केलेले',
    simDesc: 'फोनची गरज नसताना थेट या अॅपमध्ये कार्यरत व्हॉट्सअॅप इंटरफेस. व्हॉईस नोट्स, स्क्रीनशॉट आणि थेट तक्रार नोंदणीसह अगदी खऱ्या बॉटसारखा.',
    simLaunch: 'सिम्युलेटर सुरू करा',
    realTitle: 'खऱ्या व्हॉट्सअॅप अॅपमध्ये उघडा',
    realTag: 'व्हॉट्सअॅप AI एजंट',
    realDesc: 'तुमच्या मोबाईलवर थेट आमच्या AI एजंटशी गप्पा मारा.',
    evalHeadsUp: '💡 थेट गेटवे विरुद्ध इन-अॅप सिम्युलेशन सूचना:',
    evalNotice: 'इन-अॅप सिम्युलेटर थेट ब्राउझरमध्ये व्हॉट्सअॅप ट्रायजचा त्वरित अनुभव देतो. खरा व्हॉट्सअॅप पर्याय एका वैयक्तिक फोनवर चालणाऱ्या लाइव्ह होस्ट ब्रिजशी जोडतो, जो कधीही ऑफलाइन होऊ शकतो. दोन्ही पर्याय समान GPT-4o इंजिन वापरतात — सिम्युलेटर नेहमी काम करतो.',
    botOnline: 'होस्ट बॉट: कनेक्टेड',
    botStandby: 'होस्ट बॉट: स्टँडबाय',
    botChecking: 'तपासत आहे...',
    openWa: 'व्हॉट्सअॅप उघडा',
    footerAi: 'दोन्ही पर्याय एकाच AI इंजिनवर चालतात',
    close: 'बंद करा',
  },
  te: {
    title: 'వాట్సాప్ AI ట్రయాజ్ ఏజెంట్',
    subtitle: 'పౌర సైబర్ క్రైమ్ సహాయ పోర్టల్ సిమ్యులేషన్',
    defaultText: 'నమస్కారం సమర్థన్, నేను సైబర్ క్రైమ్ సంఘటనను నివేదించాలనుకుంటున్నాను.',
    simTitle: 'యాప్‌లో వాట్సాప్ సిమ్యులేటర్ ప్రారంభించండి',
    recommended: 'సిఫార్సు చేయబడింది',
    simDesc: 'ఫోన్ అవసరం లేకుండా నేరుగా ఈ యాప్‌లోనే వాట్సాప్ ఇంటర్‌ఫేస్. వాయిస్ నోట్స్, స్క్రీన్‌షాట్ ట్రయాజ్ మరియు లైవ్ ఫిర్యాదు డ్రాఫ్టింగ్‌తో పూర్తి అనుభవం.',
    simLaunch: 'సిమ్యులేటర్ ప్రారంభించండి',
    realTitle: 'నిజమైన వాట్సాప్ యాప్‌లో తెరవండి',
    realTag: 'వాట్సాప్ AI ఏజెంట్',
    realDesc: 'మీ ఫోన్ వాట్సాప్‌లో మా AI ఏజెంట్‌తో నేరుగా చాట్ చేయండి.',
    evalHeadsUp: '💡 లైవ్ గేట్‌వే వర్సెస్ సిమ్యులేషన్ గమనిక:',
    evalNotice: 'ఇన్-యాప్ సిమ్యులేటర్ నేరుగా బ్రౌజర్‌లో వాట్సాప్ ట్రయాజ్ ప్రవాహాన్ని అందిస్తుంది. రియల్ వాట్సాప్ బటన్ ఒక వ్యక్తిగత ఫోన్‌లో నడుస్తున్న లైవ్ హోస్ట్ గేట్‌వేకి కనెక్ట్ అవుతుంది, ఇది ఎప్పుడైనా ఆఫ్‌లైన్ కావచ్చు. రెండూ ఒకే GPT-4o ఇంజిన్‌ను ఉపయోగిస్తాయి — సిమ్యులేటర్ ఎల్లప్పుడూ పని చేస్తుంది.',
    botOnline: 'హోస్ట్ బాట్: కనెక్ట్ చేయబడింది',
    botStandby: 'హోస్ట్ బాట్: స్టాండ్‌బై',
    botChecking: 'తనిఖీ చేస్తోంది...',
    openWa: 'వాట్సాప్ తెరవండి',
    footerAi: 'రెండు ఎంపికలు ఒకే AI ఇంజిన్‌ను ఉపయోగిస్తాయి',
    close: 'మూసివేయి',
  },
  ta: {
    title: 'வாட்ஸ்அப் AI ட்ரையாஜ் முகவர்',
    subtitle: 'குடிமக்கள் இணைய குற்ற உதவி போர்டல் மாதிரி',
    defaultText: 'வணக்கம் சமர்தன், நான் ஒரு சைபர் கிரைம் சம்பவத்தை புகார் செய்ய விரும்புகிறேன்.',
    simTitle: 'செயலியில் வாட்ஸ்அப் சிமுலேட்டரைத் திறக்கவும்',
    recommended: 'பரிந்துரைக்கப்படுகிறது',
    simDesc: 'தொலைபேசி இல்லாமல் நேரடியாக இந்த செயலியில் முழுமையான வாட்ஸ்அப் இடைமுகம். குரல் குறிப்புகள், ஸ்கிரீன்ஷாட் பகுப்பாய்வு ஆகியவற்றுடன் நிஜ பாட் போன்றே செயல்படும்.',
    simLaunch: 'சிமுலேட்டரைத் தொடங்கவும்',
    realTitle: 'உண்மையான வாட்ஸ்அப் செயலியில் திறக்கவும்',
    realTag: 'வாட்ஸ்அப் AI முகவர்',
    realDesc: 'உங்கள் தொலைபேசியில் எங்கள் AI முகவருடன் நேரடியாக அரட்டையடிக்கவும்.',
    evalHeadsUp: '💡 நேரடி கேட்வே vs மாதிரி பயன்பாட்டு அறிவிப்பு:',
    evalNotice: 'இன்-ஆப் சிமுலேட்டர் உலாவியில் உடனடி வாட்ஸ்அப் ட்ரையாஜ் அனுபவத்தை வழங்குகிறது. உண்மையான வாட்ஸ்அப் விருப்பம் ஒரு தனிப்பட்ட தொலைபேசியில் இயங்கும் நேரடி கேட்வேயுடன் இணைகிறது, இது எந்த நேரத்திலும் ஆஃப்லைனாகலாம். இரண்டும் ஒரே GPT-4o இயந்திரத்தைப் பயன்படுத்துகின்றன — சிமுலேட்டர் எப்போதும் வேலை செய்யும்.',
    botOnline: 'பாட்: ஆன்லைன்',
    botStandby: 'பாட்: காத்திருப்பு',
    botChecking: 'சரிபார்க்கிறது...',
    openWa: 'வாட்ஸ்அப்பைத் திறக்கவும்',
    footerAi: 'இரண்டு விருப்பங்களும் ஒரே AI இயந்திரத்தைப் பயன்படுத்துகின்றன',
    close: 'மூடு',
  },
  gu: {
    title: 'વ્હોટ્સએપ AI ટ્રાયાજ એજન્ટ',
    subtitle: 'નાગરિક સાયબર ક્રાઈમ સહાય પોર્ટલ સિમ્યુલેશન',
    defaultText: 'નમસ્તે સમર્થન, મારે સાયબર ક્રાઈમની ફરિયાદ નોંધાવવી છે.',
    simTitle: 'ઇન-એપ વ્હોટ્સએપ સિમ્યુલેટર ખોલો',
    recommended: 'ભલામણ કરેલ',
    simDesc: 'ફોનની જરૂર વગર સીધા આ જ એપમાં સંપૂર્ણ વ્હોટ્સએપ ઇન્ટરફેસ. વૉઇસ નોટ્સ, સ્ક્રીનશૉટ્સ અને લાઇવ ફરિયાદ નિર્માણ સાથે બિલકુલ અસલી બૉટ જેવો અનુભવ.',
    simLaunch: 'સિમ્યુલેટર શરૂ કરો',
    realTitle: 'સાચા વ્હોટ્સએપ એપમાં ખોલો',
    realTag: 'વ્હોટ્સએપ AI એજન્ટ',
    realDesc: 'તમારા ફોનમાં સીધા અમારા AI એજન્ટ સાથે વાત કરો.',
    evalHeadsUp: '💡 લાઇવ ગેટવે વિરુદ્ધ ઇન-એપ સિમ્યુલેશન સૂચના:',
    evalNotice: 'ઇન-એપ સિમ્યુલેટર બ્રાઉઝરમાં સીધો વ્હોટ્સએપ ટ્રાયાજનો અનુભવ આપે છે. વાસ્તવિક વ્હોટ્સએપ બટન એક વ્યક્તિગત ફોન પર ચાલતા લાઇવ ગેટવે સાથે જોડાય છે, જે કોઈપણ સમયે ઓફલાઇન થઈ શકે છે. બંને સમાન GPT-4o એન્જિનનો ઉપયોગ કરે છે — સિમ્યુલેટર હંમેશા કામ કરે છે.',
    botOnline: 'હોસ્ટ બૉટ: ઓનલાઇન',
    botStandby: 'હોસ્ટ બૉટ: સ્ટેન્ડબાય',
    botChecking: 'ચકાસી રહ્યું છે...',
    openWa: 'વ્હોટ્સએપ ખોલો',
    footerAi: 'બંને વિકલ્પો એક જ AI એન્જિનનો ઉપયોગ કરે છે',
    close: 'બંધ કરો',
  },
  ur: {
    title: 'واٹس ایپ AI ٹرائیژ ایجنٹ',
    subtitle: 'شہری سائبر کرائم معاونت پورٹل سمیولیشن',
    defaultText: 'ہیلو سمرتھن، میں ایک سائبر کرائم واقعے کی اطلاع دینا چاہتا ہوں۔',
    simTitle: 'ان-ایپ واٹس ایپ سمیلیٹر کھولیں',
    recommended: 'تجویز کردہ',
    simDesc: 'بغیر فون کے براہ راست اسی ایپ میں فعال واٹس ایپ انٹرفیس۔ وائس نوٹس، اسکرین شاٹس اور لائیو ایف آئی آر مسودہ سازی کی مکمل صلاحیت۔',
    simLaunch: 'سمیلیٹر شروع کریں',
    realTitle: 'اصلی واٹس ایپ میں کھولیں',
    realTag: 'واٹس ایپ AI ایجنٹ',
    realDesc: 'اپنے فون پر براہ راست ہمارے AI ایجنٹ سے بات چیت کریں۔',
    evalHeadsUp: '💡 لائیو گیٹ وے بمقابلہ ان-ایپ سمیولیشن نوٹس:',
    evalNotice: 'ان-ایپ سمیلیٹر براؤزر میں واٹس ایپ ٹرائیژ کا فوری تجربہ فراہم کرتا ہے۔ اصلی واٹس ایپ بٹن ایک ذاتی فون پر چلنے والے لائیو گیٹ وے سے جڑتا ہے، جو کسی بھی وقت آف لائن ہو سکتا ہے۔ دونوں ایک ہی GPT-4o انجن استعمال کرتے ہیں — سمیلیٹر ہمیشہ کام کرتا ہے۔',
    botOnline: 'ہوسٹ بوٹ: آن لائن',
    botStandby: 'ہوسٹ بوٹ: اسٹینڈ بائی',
    botChecking: 'جانچ جاری ہے...',
    openWa: 'واٹس ایپ کھولیں',
    footerAi: 'دونوں آپشنز ایک ہی AI انجن پر کام کرتے ہیں',
    close: 'بند کریں',
  },
  kn: {
    title: 'ವಾಟ್ಸಾಪ್ AI ಟ್ರಯಾಜ್ ಏಜೆಂಟ್',
    subtitle: 'ನಾಗರಿಕ ಸೈಬರ್ ಕ್ರೈಮ್ ಸಹಾಯ ಪೋರ್ಟಲ್ ಸಿಮ್ಯುಲೇಶನ್',
    defaultText: 'ನಮಸ್ಕಾರ ಸಮರ್ಥನ್, ನಾನು ಸೈಬರ್ ಅಪರಾಧ ಘಟನೆಯನ್ನು ವರದಿ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ.',
    simTitle: 'ಇನ್-ಆಪ್ ವಾಟ್ಸಾಪ್ ಸಿಮ್ಯುಲೇಟರ್ ತೆರೆಯಿರಿ',
    recommended: 'ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
    simDesc: 'ಫೋನ್ ಅಗತ್ಯವಿಲ್ಲದೇ ನೇರವಾಗಿ ಈ ಆಪ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ವಾಟ್ಸಾಪ್ ಇಂಟರ್ಫೇಸ್. ಧ್ವನಿ ಟಿಪ್ಪಣಿಗಳು, ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಮತ್ತು ಲೈವ್ ದೂರು ರಚನೆಯೊಂದಿಗೆ ಅಸಲಿ ಬಾಟ್‌ನಂತೆಯೇ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
    simLaunch: 'ಸಿಮ್ಯುಲೇಟರ್ ಪ್ರಾರಂಭಿಸಿ',
    realTitle: 'ನೈಜ ವಾಟ್ಸಾಪ್ ಆಪ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ',
    realTag: 'ವಾಟ್ಸಾಪ್ AI ಏಜೆಂಟ್',
    realDesc: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ನಮ್ಮ AI ಏಜೆಂಟ್ ಜೊತೆ ಚಾಟ್ ಮಾಡಿ.',
    evalHeadsUp: '💡 ಲೈವ್ ಗೇಟ್‌ವೇ ವಿರುದ್ಧ ಸಿಮ್ಯುಲೇಶನ್ ಮಾಹಿತಿ:',
    evalNotice: 'ಇನ್-ಆಪ್ ಸಿಮ್ಯುಲೇಟರ್ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನೇರ ವಾಟ್ಸಾಪ್ ಟ್ರಯಾಜ್ ಅನುಭವವನ್ನು ನೀಡುತ್ತದೆ. ನಿಜವಾದ ವಾಟ್ಸಾಪ್ ಬಟನ್ ಒಂದು ವೈಯಕ್ತಿಕ ಫೋನ್‌ನಲ್ಲಿ ಚಾಲನೆಯಲ್ಲಿರುವ ಲೈವ್ ಗೇಟ್‌ವೇಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ, ಇದು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಆಫ್‌ಲೈನ್ ಆಗಬಹುದು. ಎರಡೂ ಒಂದೇ GPT-4o ಎಂಜಿನ್ ಬಳಸುತ್ತವೆ — ಸಿಮ್ಯುಲೇಟರ್ ಯಾವಾಗಲೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
    botOnline: 'ಹೋಸ್ಟ್ ಬಾಟ್: ಸಂಪರ್ಕದಲ್ಲಿದೆ',
    botStandby: 'ಹೋಸ್ಟ್ ಬಾಟ್: ಸ್ಟ್ಯಾಂಡ್‌ಬೈ',
    botChecking: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    openWa: 'ವಾಟ್ಸಾಪ್ ತೆರೆಯಿರಿ',
    footerAi: 'ಎರಡೂ ಆಯ್ಕೆಗಳು ಒಂದೇ AI ಎಂಜಿನ್ ಅನ್ನು ಬಳಸುತ್ತವೆ',
    close: 'ಮುಚ್ಚಿ',
  },
  or: {
    title: 'ହ୍ୱାଟ୍ସଆପ୍ AI ଟ୍ରାଇଜ୍ ଏଜେଣ୍ଟ',
    subtitle: 'ନାଗରିକ ସାଇବର ଅପରାଧ ସହାୟତା ପୋର୍ଟାଲ୍ ସିମୁଲେସନ୍',
    defaultText: 'ନମସ୍କାର ସମର୍ଥନ, ମୁଁ ଏକ ସାଇବର ଅପରାଧ ଘଟଣା ରିପୋର୍ଟ କରିବାକୁ ଚାହୁଁଛି।',
    simTitle: 'ଇନ୍-ଆପ୍ ହ୍ୱାଟ୍ସଆପ୍ ସିମୁଲେଟର୍ ଖୋଲନ୍ତୁ',
    recommended: 'ସୁପାରିଶ କରାଯାଇଛି',
    simDesc: 'ଫୋନ୍ ବିନା ସିଧାସଳଖ ଏହି ଆପ୍ ମଧ୍ୟରେ କାର୍ଯ୍ୟକ୍ଷମ ହ୍ୱାଟ୍ସଆପ୍ ଇଣ୍ଟରଫେସ୍। ଭଏସ୍ ନୋଟ୍, ସ୍କ୍ରିନଶଟ୍ ଏବଂ ଲାଇଭ୍ ଅଭିଯୋଗ ଡ୍ରାଫ୍ଟ ସହିତ ପୂର୍ଣ୍ଣ ଅନୁଭବ।',
    simLaunch: 'ସିମୁଲେଟର୍ ଆରମ୍ଭ କରନ୍ତୁ',
    realTitle: 'ପ୍ରକୃତ ହ୍ୱାଟ୍ସଆପ୍ ଆପ୍‌ରେ ଖୋଲନ୍ତୁ',
    realTag: 'ହ୍ୱାଟ୍ସଆପ୍ AI ଏଜେଣ୍ଟ',
    realDesc: 'ଆପଣଙ୍କ ଫୋନ୍‌ରେ ଆମ AI ଏଜେଣ୍ଟ ସହିତ ସିଧାସଳଖ ଚାଟ୍ କରନ୍ତୁ।',
    evalHeadsUp: '💡 ଲାଇଭ୍ ଗେଟୱେ ବନାମ ଇନ୍-ଆପ୍ ସିମୁଲେସନ୍ ବିଜ୍ଞପ୍ତି:',
    evalNotice: 'ଇନ୍-ଆପ୍ ସିମୁଲେଟର୍ ବ୍ରାଉଜର୍‌ରେ ତୁରନ୍ତ ହ୍ୱାଟ୍ସଆପ୍ ଟ୍ରାଇଜ୍ ଅନୁଭୂତି ଦିଏ। ପ୍ରକୃତ ହ୍ୱାଟ୍ସଆପ୍ ବଟନ୍ ଏକ ବ୍ୟକ୍ତିଗତ ଫୋନ୍‌ରେ ଚାଲୁଥିବା ଲାଇଭ୍ ଗେଟୱେ ସହିତ ସଂଯୋଗ କରେ, ଯାହା ଯେକୌଣସି ସମୟରେ ଅଫଲାଇନ୍ ହୋଇପାରେ। ଉଭୟ ସମାନ GPT-4o ଇଞ୍ଜିନ୍ ବ୍ୟବହାର କରେ — ସିମୁଲେଟର୍ ସର୍ବଦା କାମ କରେ।',
    botOnline: 'ହୋଷ୍ଟ ବଟ୍: ଅନଲାଇନ୍',
    botStandby: 'ହୋଷ୍ଟ ବଟ୍: ଷ୍ଟାଣ୍ଡବାଏ',
    botChecking: 'ଯାଞ୍ଚ ହେଉଛି...',
    openWa: 'ହ୍ୱାଟ୍ସଆପ୍ ଖୋଲନ୍ତୁ',
    footerAi: 'ଉଭୟ ବିକଳ୍ପ ସମାନ AI ଇଞ୍ଜିନ୍ ବ୍ୟବହାର କରେ',
    close: 'ବନ୍ଦ କରନ୍ତୁ',
  },
  ml: {
    title: 'വാട്ട്‌സ്ആപ്പ് AI ട്രയേജ് ഏജന്റ്',
    subtitle: 'പൗര സൈബർ ക്രൈം സഹായ പോർട്ടൽ സിമുലേഷൻ',
    defaultText: 'നമസ്കാരം സമർത്ഥൻ, എനിക്ക് ഒരു സൈബർ കുറ്റകൃത്യ സംഭവം റിപ്പോർട്ട് ചെയ്യണം.',
    simTitle: 'ഇൻ-ആപ്പ് വാട്ട്‌സ്ആപ്പ് സിമുലേറ്റർ തുറക്കുക',
    recommended: 'ശുപാർശ ചെയ്യുന്നത്',
    simDesc: 'ഫോൺ ആവശ്യമില്ലാതെ തന്നെ ഈ ആപ്പിൽ പൂർണ്ണമായി പ്രവർത്തിക്കുന്ന വാട്ട്‌സ്ആപ്പ് ഇന്റർഫേസ്. വോയ്‌സ് നോട്ടുകൾ, സ്‌ക്രീൻഷോട്ടുകൾ, തത്സമയ പരാതി തയ്യാറാക്കൽ എന്നിവ ലഭ്യമാണ്.',
    simLaunch: 'സിമുലേറ്റർ ആരംഭിക്കുക',
    realTitle: 'യഥാർത്ഥ വാട്ട്‌സ്ആപ്പ് ആപ്പിൽ തുറക്കുക',
    realTag: 'വാട്ട്‌സ്ആപ്പ് AI ഏജന്റ്',
    realDesc: 'നിങ്ങളുടെ ഫോണിൽ ഞങ്ങളുടെ AI ഏജന്റുമായി നേരിട്ട് ചാറ്റ് ചെയ്യുക.',
    evalHeadsUp: '💡 ലൈവ് ഗേറ്റ്‌വേ vs ഇൻ-ആപ്പ് സിമുലേഷൻ അറിയിപ്പ്:',
    evalNotice: 'ഇൻ-ആപ്പ് സിമുലേറ്റർ ബ്രൗസറിൽ ഉടനടി വാട്ട്‌സ്ആപ്പ് ട്രയേജ് അനുഭവം നൽകുന്നു. യഥാർത്ഥ വാട്ട്‌സ്ആപ്പ് ബട്ടൺ ഒരു വ്യക്തിഗത ഫോണിൽ പ്രവർത്തിക്കുന്ന ലൈവ് ഗേറ്റ്‌വേയിലേക്ക് ബന്ധിപ്പിക്കുന്നു, ഇത് എപ്പോൾ വേണമെങ്കിലും ഓഫ്‌ലൈൻ ആകാം. രണ്ടും ഒരേ GPT-4o എഞ്ചിനാണ് ഉപയോഗിക്കുന്നത് — സിമുലേറ്റർ എപ്പോഴും പ്രവർത്തിക്കും.',
    botOnline: 'ഹോസ്റ്റ് ബോട്ട്: ഓൺലൈൻ',
    botStandby: 'ഹോസ്റ്റ് ബോട്ട്: സ്റ്റാൻഡ്‌ബൈ',
    botChecking: 'പരിശോധിക്കുന്നു...',
    openWa: 'വാട്ട്‌സ്ആപ്പ് തുറക്കുക',
    footerAi: 'രണ്ട് ഓപ്ഷനുകളും ഒരേ AI എഞ്ചിനാണ് ഉപയോഗിക്കുന്നത്',
    close: 'അടയ്ക്കുക',
  },
  pa: {
    title: 'ਵਟਸਐਪ AI ਟ੍ਰਾਇਜ ਏਜੰਟ',
    subtitle: 'ਨਾਗਰਿਕ ਸਾਈਬਰ ਅਪਰਾਧ ਸਹਾਇਤਾ ਪੋਰਟਲ ਸਿਮੂਲੇਸ਼ਨ',
    defaultText: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਸਮਰਥਨ, ਮੈਂ ਇੱਕ ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਘਟਨਾ ਦੀ ਰਿਪੋਰਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।',
    simTitle: 'ਇਨ-ਐਪ ਵਟਸਐਪ ਸਿਮੂਲੇਟਰ ਖੋਲ੍ਹੋ',
    recommended: 'ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤੀ ਗਈ',
    simDesc: 'ਬਿਨਾਂ ਫ਼ੋਨ ਦੇ ਸਿੱਧੇ ਇਸ ਐਪ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੰਮ ਕਰਨ ਵਾਲਾ ਵਟਸਐਪ ਇੰਟਰਫੇਸ। ਵੌਇਸ ਨੋਟਸ, ਸਕ੍ਰੀਨਸ਼ੌਟਸ ਅਤੇ ਲਾਈਵ ਸ਼ਿਕਾਇਤ ਡਰਾਫਟਿੰਗ ਦੇ ਨਾਲ ਅਸਲ ਬੋਟ ਵਾਂਗ ਕੰਮ ਕਰਦਾ ਹੈ।',
    simLaunch: 'ਸਿਮੂਲੇਟਰ ਸ਼ੁਰੂ ਕਰੋ',
    realTitle: 'ਅਸਲ ਵਟਸਐਪ ਐਪ ਵਿੱਚ ਖੋਲ੍ਹੋ',
    realTag: 'ਵਟਸਐਪ AI ਏਜੰਟ',
    realDesc: 'ਆਪਣੇ ਫ਼ੋਨ ਵਿੱਚ ਸਿੱਧਾ ਸਾਡੇ AI ਏਜੰਟ ਨਾਲ ਗੱਲ ਕਰੋ।',
    evalHeadsUp: '💡 ਲਾਈਵ ਗੇਟਵੇ ਬਨਾਮ ਇਨ-ਐਪ ਸਿਮੂਲੇਸ਼ਨ ਸੂਚਨਾ:',
    evalNotice: 'ਇਨ-ਐਪ ਸਿਮੂਲੇਟਰ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਤੁਰੰਤ ਵਟਸਐਪ ਟ੍ਰਾਇਜ ਦਾ ਅਨੁਭਵ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਅਸਲ ਵਟਸਐਪ ਬਟਨ ਇੱਕ ਨਿੱਜੀ ਫ਼ੋਨ ਉੱਤੇ ਚੱਲ ਰਹੇ ਲਾਈਵ ਗੇਟਵੇ ਨਾਲ ਜੁੜਦਾ ਹੈ, ਜੋ ਕਿਸੇ ਵੀ ਸਮੇਂ ਆਫ਼ਲਾਈਨ ਹੋ ਸਕਦਾ ਹੈ। ਦੋਵੇਂ ਇੱਕੋ GPT-4o ਇੰਜਣ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਨ — ਸਿਮੂਲੇਟਰ ਹਮੇਸ਼ਾ ਕੰਮ ਕਰਦਾ ਹੈ।',
    botOnline: 'ਹੋਸਟ ਬੋਟ: ਆਨਲਾਈਨ',
    botStandby: 'ਹੋਸਟ ਬੋਟ: ਸਟੈਂਡਬਾਏ',
    botChecking: 'ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
    openWa: 'ਵਟਸਐਪ ਖੋਲ੍ਹੋ',
    footerAi: 'ਦੋਵੇਂ ਵਿਕਲਪ ਇੱਕੋ AI ਇੰਜਣ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਨ',
    close: 'ਬੰਦ ਕਰੋ',
  },
}

  if (!isOpen || !mounted) return null

  const t = WA_MODAL_I18N[language] || WA_MODAL_I18N.en
  const defaultText = t.defaultText

  const textToForward = prefilledText?.trim() || defaultText
  const realWhatsAppUrl = `https://wa.me/916303807967?text=${encodeURIComponent(textToForward)}`

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#075E54] dark:bg-[#064e46] text-white p-4 sm:p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-lg font-bold indic-headline">
                  {t.title}
                </h3>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  24x7 AI
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5 sm:mt-1 leading-relaxed indic-body">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Content */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto">
          {/* Option 1: In-App WhatsApp Web Simulator */}
          <div
            onClick={() => {
              onClose()
              onOpenSimulator()
            }}
            className="group relative p-4 sm:p-5 rounded-xl border-2 border-emerald-500/70 dark:border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors indic-headline">
                      {t.simTitle}
                    </span>
                    <span className="bg-emerald-200/80 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {t.recommended}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed indic-body">
                    {t.simDesc}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    <span className="indic-body">{t.simLaunch}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Real WhatsApp Bot */}
          <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 indic-headline">
                      {t.realTitle}
                    </span>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md indic-body">
                      {t.realTag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed indic-body">
                    {t.realDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Heads-up / Offline notice callout */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5 indic-headline">
                  {t.evalHeadsUp}
                </span>
                <span className="indic-body">
                  {t.evalNotice}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    botOnline === true
                      ? 'bg-emerald-500 animate-pulse'
                      : botOnline === false
                      ? 'bg-amber-500'
                      : 'bg-zinc-400'
                  }`}
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 indic-body">
                  {botOnline === true
                    ? t.botOnline
                    : botOnline === false
                    ? t.botStandby
                    : t.botChecking}
                </span>
              </div>

              <a
                href={realWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <span className="indic-body">{t.openWa}</span>
                <ExternalLink className="w-3.5 h-3.5 rtl:rotate-90" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-5 sm:px-6 py-3 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1 indic-body">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {t.footerAi}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 underline font-medium cursor-pointer indic-body"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
