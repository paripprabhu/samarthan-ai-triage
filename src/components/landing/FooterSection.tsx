'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useTriage } from '@/context/TriageContext'
import { SupportedLanguage } from '@/lib/i18n/languages'

interface FooterSectionProps {
  language: SupportedLanguage
}

const FOOTER_I18N: Record<SupportedLanguage, {
  ctaHeadline: string
  ctaDesc: string
  ctaBtn: string
  tagline: string
  linksTitle: string
  howItWorks: string
  whySamarthan: string
  getStarted: string
  emergencyTitle: string
  helpline1930: string
  police100: string
  aboutTitle: string
  portalTag: string
  digilockerVerified: string
  poweredBy: string
  disclaimer: string
}> = {
  en: {
    ctaHeadline: 'Every minute matters in the golden hour.',
    ctaDesc: 'The sooner a fraud is reported, the higher the chance of getting the money back. Start now.',
    ctaBtn: 'Start a report',
    tagline: 'AI cybercrime triage. From panic to FIR.',
    linksTitle: 'Links',
    howItWorks: 'How it works',
    whySamarthan: 'Why Samarthan',
    getStarted: 'Get started',
    emergencyTitle: 'Emergency',
    helpline1930: 'Cyber Helpline: 1930',
    police100: 'Police: 100',
    aboutTitle: 'About',
    portalTag: 'Citizen Cybercrime Triage Initiative',
    digilockerVerified: 'DigiLocker verified identity',
    poweredBy: 'Powered by GPT-4o',
    disclaimer: 'Notice: DigiLocker verification, AI voice triage, legal mapping, and WhatsApp AI assistance are functional live features; police dispatch and bank account freezing are simulated demonstration workflows. Not an official government website (official portal: cybercrime.gov.in). For real emergency assistance, dial 1930.',
  },
  hi: {
    ctaHeadline: 'गोल्डन ऑवर में हर मिनट मायने रखता है।',
    ctaDesc: 'धोखाधड़ी की रिपोर्ट जितनी जल्दी होगी, पैसा वापस मिलने की संभावना उतनी ज़्यादा। अभी शुरू करें।',
    ctaBtn: 'रिपोर्ट शुरू करें',
    tagline: 'AI साइबर अपराध ट्रायज। घबराहट से FIR तक।',
    linksTitle: 'लिंक',
    howItWorks: 'यह कैसे काम करता है',
    whySamarthan: 'समर्थन क्यों?',
    getStarted: 'शुरू करें',
    emergencyTitle: 'आपातकाल',
    helpline1930: 'साइबर हेल्पलाइन: 1930',
    police100: 'पुलिस: 100',
    aboutTitle: 'के बारे में',
    portalTag: 'नागरिक साइबर अपराध ट्रायज पहल',
    digilockerVerified: 'DigiLocker सत्यापित पहचान',
    poweredBy: 'GPT-4o द्वारा संचालित',
    disclaimer: 'सूचना: डिजीलॉकर सत्यापन, AI वॉइस ट्रायज, कानूनी धाराएं और व्हाट्सएप AI सहायता सक्रिय फीचर्स हैं; पुलिस डिस्पैच व बैंक खाता फ्रीज सिमुलेटेड वर्कफ़्लो हैं। आधिकारिक राष्ट्रीय पोर्टल cybercrime.gov.in है। आपातकाल में 1930 डायल करें।',
  },
  bn: {
    ctaHeadline: 'গোল্ডেন আওয়ারের প্রতিটি মিনিট মূল্যবান।',
    ctaDesc: 'যত দ্রুত প্রতারণার অভিযোগ নথিভুক্ত করবেন, টাকা ফেরত পাওয়ার সম্ভাবনা তত বেশি। এখনই শুরু করুন।',
    ctaBtn: 'অভিযোগ শুরু করুন',
    tagline: 'AI সাইবার ক্রাইম ট্রায়াজ। আতঙ্ক থেকে এফআইআর।',
    linksTitle: 'লিঙ্ক',
    howItWorks: 'এটি কীভাবে কাজ করে',
    whySamarthan: 'সমর্থন কেন?',
    getStarted: 'শুরু করুন',
    emergencyTitle: 'জরুরী সহায়তা',
    helpline1930: 'সাইবার হেল্পলাইন: 1930',
    police100: 'পুলিশ: 100',
    aboutTitle: 'আমাদের সম্পর্কে',
    portalTag: 'নাগরিক সাইবার ক্রাইম ট্রায়াজ উদ্যোগ',
    digilockerVerified: 'DigiLocker যাচাইকৃত পরিচয়',
    poweredBy: 'GPT-4o দ্বারা চালিত',
    disclaimer: 'বিজ্ঞপ্তি: ডিজিলকার যাচাইকরণ, AI ভয়েস ট্রায়াজ ও অভিযোগ তৈরি কার্যকরী ফিচার; পুলিশ রুট ও ব্যাংক ফ্রিজ সিমুলেটেড ডেমো। সরকারি পোর্টাল cybercrime.gov.in। জরুরি সহায়তায় 1930 ডায়াল করুন।',
  },
  mr: {
    ctaHeadline: 'गोल्डन अवरमध्ये प्रत्येक मिनिट महत्त्वाचा असतो.',
    ctaDesc: 'फसवणुकीची तक्रार जितक्या लवकर कराल, पैसे परत मिळण्याची शक्यता तितकीच जास्त. आताच सुरू करा.',
    ctaBtn: 'तक्रार सुरू करा',
    tagline: 'AI सायबर गुन्हे ट्रायज. घाबरण्यापासून एफआयआरपर्यंत.',
    linksTitle: 'दुवे',
    howItWorks: 'हे कसे कार्य करते',
    whySamarthan: 'समर्थन का?',
    getStarted: 'सुरू करा',
    emergencyTitle: 'तातडीची मदत',
    helpline1930: 'सायबर हेल्पलाइन: 1930',
    police100: 'पोलीस: 100',
    aboutTitle: 'बद्दल',
    portalTag: 'नागरी सायबर गुन्हे ट्रायज उपक्रम',
    digilockerVerified: 'DigiLocker पडताळलेली ओळख',
    poweredBy: 'GPT-4o द्वारे समर्थित',
    disclaimer: 'सूचना: डिजीलॉकर पडताळणी, AI व्हॉइस ट्रायज आणि तक्रार मसुदा हे कार्यरत फीचर्स आहेत; पोलीस डिस्पॅच व बँक गोठवणे हे सिम्युलेटेड वर्कफ्लो आहेत. अधिकृत पोर्टल cybercrime.gov.in आहे. आणीबाणीत 1930 डायल करा.',
  },
  te: {
    ctaHeadline: 'గోల్డెన్ అవర్‌లో ప్రతి నిమిషం చాలా ముఖ్యం.',
    ctaDesc: 'మోసం గురించి ఎంత త్వరగా ఫిర్యాదు చేస్తే, డబ్బు తిరిగి పొందే అవకాశం అంత ఎక్కువగా ఉంటుంది. ఇప్పుడే ప్రారంభించండి.',
    ctaBtn: 'రిపోర్ట్ ప్రారంభించండి',
    tagline: 'AI సైబర్ క్రైమ్ ట్రయాజ్. భయం నుండి ఎఫ్ఐఆర్ వరకు.',
    linksTitle: 'లింకులు',
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    whySamarthan: 'సమర్థన్ ఎందుకు?',
    getStarted: 'ప్రారంభించండి',
    emergencyTitle: 'అత్యవసర',
    helpline1930: 'సైబర్ హెల్ప్‌లైన్: 1930',
    police100: 'పోలీస్: 100',
    aboutTitle: 'గురించి',
    portalTag: 'పౌర సైబర్ క్రైమ్ ట్రయాజ్ చొరవ',
    digilockerVerified: 'DigiLocker ధృవీకరించబడిన గుర్తింపు',
    poweredBy: 'GPT-4o ద్వారా ఆధారితం',
    disclaimer: 'గమనిక: డిజిలాకర్ ధృవీకరణ, AI వాయిస్ ట్రయాజ్ మరియు ఫిర్యాదు డ్రాఫ్టింగ్ క్రియాత్మక ఫీచర్లు; పోలీసు రౌటింగ్ & బ్యాంక్ ఫ్రీజ్ సిమ్యులేటెడ్ వర్క్‌ఫ్లోలు. అధికారిక పోర్టల్ cybercrime.gov.in. అత్యవసరంలో 1930 డయల్ చేయండి.',
  },
  ta: {
    ctaHeadline: 'தங்க நேரத்தில் ஒவ்வொரு நிமிடமும் முக்கியமானது.',
    ctaDesc: 'மோசடி பற்றி எவ்வளவு விரைவாக புகார் செய்கிறீர்களோ, பணம் திரும்பக் கிடைக்க வாய்ப்பு அதிகம். இப்போதே தொடங்குங்கள்.',
    ctaBtn: 'புகார் தொடங்கவும்',
    tagline: 'AI சைபர் கிரைம் ட்ரையாஜ். பதற்றத்திலிருந்து முதல் தகவல் அறிக்கை வரை.',
    linksTitle: 'இணைப்புகள்',
    howItWorks: 'இது எப்படி செயல்படுகிறது',
    whySamarthan: 'ஏன் சமர்தன்?',
    getStarted: 'தொடங்குங்கள்',
    emergencyTitle: 'அவசரம்',
    helpline1930: 'சைபர் உதவி எண்: 1930',
    police100: 'காவல்துறை: 100',
    aboutTitle: 'பற்றி',
    portalTag: 'குடிமக்கள் இணைய குற்ற ட்ரையாஜ் முயற்சி',
    digilockerVerified: 'DigiLocker சரிபார்க்கப்பட்ட அடையாளம்',
    poweredBy: 'GPT-4o மூலம் இயக்கப்படுகிறது',
    disclaimer: 'அறிவிப்பு: டிஜிலாக்கர் சரிபார்ப்பு, AI குரல் ட்ரையாஜ் மற்றும் புகார் வரைவு ஆகியவை நேரடி அம்சங்கள்; காவல் அனுப்புதல் மற்றும் வங்கி முடக்கம் ஆகியவை மாதிரி பணிப்பாய்வுகள். அதிகாரப்பூர்வ தளம் cybercrime.gov.in. அவசர உதவிக்கு 1930 டயல் செய்யவும்.',
  },
  gu: {
    ctaHeadline: 'ગોલ્ડન અવરમાં દરેક મિનિટ મહત્વપૂર્ણ છે.',
    ctaDesc: 'જેટલી ઝડપથી છેતરપિંડીની જાણ કરશો, પૈસા પાછા મળવાની શક્યતા એટલી જ વધારે. અત્યારે જ શરૂ કરો.',
    ctaBtn: 'રિપોર્ટ શરૂ કરો',
    tagline: 'AI સાયબર ક્રાઇમ ટ્રાયાજ. ગભરાટથી એફઆઈઆર સુધી.',
    linksTitle: 'લિંક્સ',
    howItWorks: 'આ કેવી રીતે કાર્ય કરે છે',
    whySamarthan: 'સમર્થન શા માટે?',
    getStarted: 'શરૂ કરો',
    emergencyTitle: 'કટોકટી',
    helpline1930: 'સાયબર હેલ્પલાઇન: 1930',
    police100: 'પોલીસ: 100',
    aboutTitle: 'વિશે',
    portalTag: 'નાગરિક સાયબર ક્રાઇમ ટ્રાયાજ પહેલ',
    digilockerVerified: 'DigiLocker પ્રમાણિત ઓળખ',
    poweredBy: 'GPT-4o દ્વારા સંચાલિત',
    disclaimer: 'સૂચના: ડિજીલોકર ચકાસણી, AI વૉઇસ ટ્રાયાજ અને ફરિયાદ ડ્રાફ્ટિંગ સક્રિય સુવિધાઓ છે; પોલીસ રૂટિંગ અને બેંક ફ્રીઝ સિમ્યુલેટેડ વર્કફ્લો છે. સત્તાવાર પોર્ટલ cybercrime.gov.in છે. કટોકટીમાં 1930 ડાયલ કરો.',
  },
  ur: {
    ctaHeadline: 'گولڈن آور میں ہر منٹ قیمتی ہے۔',
    ctaDesc: 'دھوکہ دہی کی اطلاع جتنی جلدی دی جائے گی، رقم واپس ملنے کا امکان اتنا ہی زیادہ ہوگا۔ ابھی شروع کریں۔',
    ctaBtn: 'رپورٹ درج کرنا شروع کریں',
    tagline: 'AI سائبر کرائم ٹرائیژ۔ خوف و ہراس سے ایف آئی آر تک۔',
    linksTitle: 'لنکس',
    howItWorks: 'یہ کیسے کام کرتا ہے',
    whySamarthan: 'سمرتھن کیوں؟',
    getStarted: 'شروع کریں',
    emergencyTitle: 'ہنگامی امداد',
    helpline1930: 'سائبر ہیلپ لائن: 1930',
    police100: 'پولیس: 100',
    aboutTitle: 'تعارف',
    portalTag: 'شہری سائبر کرائم ٹرائیژ اقدام',
    digilockerVerified: 'ڈیجی لاکر سے تصدیق شدہ شناخت',
    poweredBy: 'GPT-4o کے ذریعے چلنے والا',
    disclaimer: 'نوٹس: ڈیجی لاکر تصدیق، AI وائس ٹرائیژ اور شکایت ڈرافٹنگ فعال فیچرز ہیں؛ پولیس ڈسپیچ اور بینک فریزنگ سمیولیٹڈ ورک فلو ہیں۔ سرکاری پورٹل cybercrime.gov.in ہے۔ ہنگامی صورت میں 1930 ڈائل کریں۔',
  },
  kn: {
    ctaHeadline: 'ಗೋಲ್ಡನ್ ಅವರ್‌ನಲ್ಲಿ ಪ್ರತಿ ನಿಮಿಷವೂ ಅತ್ಯಂತ ಅಮೂಲ್ಯ.',
    ctaDesc: 'ವಂಚನೆಯ ಬಗ್ಗೆ ಎಷ್ಟು ಬೇಗನೆ ವರದಿ ಮಾಡುತ್ತೀರೋ, ಹಣ ಮರಳಿ ಪಡೆಯುವ ಸಾಧ್ಯತೆ ಅಷ್ಟೇ ಹೆಚ್ಚು. ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ.',
    ctaBtn: 'ವರದಿ ಪ್ರಾರಂಭಿಸಿ',
    tagline: 'AI ಸೈಬರ್ ಕ್ರೈಮ್ ಟ್ರಯಾಜ್. ಆತಂಕದಿಂದ ಎಫ್‌ಐಆರ್‌ವರೆಗೆ.',
    linksTitle: 'ಲಿಂಕ್‌ಗಳು',
    howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    whySamarthan: 'ಸಮರ್ಥನ್ ಏಕೆ?',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    emergencyTitle: 'ತುರ್ತು',
    helpline1930: 'ಸೈಬರ್ ಸಹಾಯವಾಣಿ: 1930',
    police100: 'ಪೊಲೀಸ್: 100',
    aboutTitle: 'ಬಗ್ಗೆ',
    portalTag: 'ನಾಗರಿಕ ಸೈಬರ್ ಕ್ರೈಮ್ ಟ್ರಯಾಜ್ ಉಪಕ್ರಮ',
    digilockerVerified: 'DigiLocker ಪರಿಶೀಲಿಸಿದ ಗುರುತು',
    poweredBy: 'GPT-4o ಮೂಲಕ ಚಾಲಿತ',
    disclaimer: 'ಸೂಚನೆ: ಡಿಜಿಲಾಕರ್ ಪರಿಶೀಲನೆ, AI ವಾಯ್ಸ್ ಟ್ರಯಾಜ್ ಮತ್ತು ದೂರು ಡ್ರಾಫ್ಟಿಂಗ್ ಸಕ್ರಿಯ ವೈಶಿಷ್ಟ್ಯಗಳಾಗಿವೆ; ಪೊಲೀಸ್ ರವಾನೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ ನಿರ್ಬಂಧವು ಸಿಮ್ಯುಲೇಟೆಡ್ ವರ್ಕ್‌ಫ್ಲೋಗಳಾಗಿವೆ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್ cybercrime.gov.in. ತುರ್ತು ಸಹಾಯಕ್ಕಾಗಿ 1930 ಗೆ ಕರೆ ಮಾಡಿ.',
  },
  or: {
    ctaHeadline: 'ଗୋଲ୍ଡେନ୍ ଆୱାର୍‌ରେ ପ୍ରତ୍ୟେକ ମିନିଟ୍ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ।',
    ctaDesc: 'ଯେତେ ଶୀଘ୍ର ଠକେଇ ଅଭିଯୋଗ କରିବେ, ଟଙ୍କା ଫେରି ପାଇବାର ସମ୍ଭାବନା ସେତେ ଅଧିକ। ଏବେ ଆରମ୍ଭ କରନ୍ତୁ।',
    ctaBtn: 'ଅଭିଯୋଗ ଆରମ୍ଭ କରନ୍ତୁ',
    tagline: 'AI ସାଇବର ଅପରାଧ ଟ୍ରାଇଜ୍। ଆତଙ୍କରୁ FIR ଯାଏଁ।',
    linksTitle: 'ଲିଙ୍କ୍',
    howItWorks: 'ଏହା କିପରି କାମ କରେ',
    whySamarthan: 'ସମର୍ଥନ କାହିଁକି?',
    getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
    emergencyTitle: 'ଜରୁରୀକାଳୀନ',
    helpline1930: 'ସାଇବର ହେଲ୍ପଲାଇନ: 1930',
    police100: 'ପୋଲିସ: 100',
    aboutTitle: 'ବିବରଣୀ',
    portalTag: 'ନାଗରିକ ସାଇବର ଅପରାଧ ଟ୍ରାଇଜ୍ ପଦକ୍ଷେପ',
    digilockerVerified: 'DigiLocker ପ୍ରମାଣିତ ପରିଚୟ',
    poweredBy: 'GPT-4o ଦ୍ୱାରା ପରିଚାଳିତ',
    disclaimer: 'ସୂଚନା: ଡିଜିଲକର ଯାଞ୍ଚ, AI ଭଏସ୍ ଟ୍ରାଇଜ୍ ଏବଂ ଅଭିଯୋଗ ଡ୍ରାଫ୍ଟିଂ କାର୍ଯ୍ୟକ୍ଷମ ଫିଚର; ପୋଲିସ ପ୍ରେରଣ ଏବଂ ବ୍ୟାଙ୍କ ଫ୍ରିଜ୍ ସିମୁଲେଟେଡ୍ ଡେମୋ। ସରକାରୀ ପୋର୍ଟାଲ cybercrime.gov.in। ଜରୁରୀକାଳୀନ ପାଇଁ 1930 ଡାଏଲ୍ କରନ୍ତୁ।',
  },
  ml: {
    ctaHeadline: 'ഗോൾഡൻ അവറിൽ ഓരോ മിനിറ്റും നിർണായകമാണ്.',
    ctaDesc: 'തട്ടിപ്പ് എത്രയും വേഗം റിപ്പോർട്ട് ചെയ്യുന്നുവോ, പണം തിരികെ ലഭിക്കാനുള്ള സാധ്യത അത്രയും കൂടും. ഇപ്പോൾ ആരംഭിക്കുക.',
    ctaBtn: 'റിപ്പോർട്ട് ആരംഭിക്കുക',
    tagline: 'AI സൈബർ കുറ്റകൃത്യ ട്രയേജ്. പരിഭ്രാന്തിയിൽ നിന്ന് FIR-ലേക്ക്.',
    linksTitle: 'ലിങ്കുകൾ',
    howItWorks: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    whySamarthan: 'എന്തുകൊണ്ട് സമർത്ഥൻ?',
    getStarted: 'ആരംഭിക്കുക',
    emergencyTitle: 'അടിയന്തിരം',
    helpline1930: 'സൈബർ ഹെൽപ്പ്‌ലൈൻ: 1930',
    police100: 'പോലീസ്: 100',
    aboutTitle: 'കുറിച്ച്',
    portalTag: 'പൗര സൈബർ കുറ്റകൃത്യ ട്രയേജ് സംരംഭം',
    digilockerVerified: 'ഡിജിലോക്കർ സ്ഥിരീകരിച്ച തിരിച്ചറിയൽ',
    poweredBy: 'GPT-4o നൽകുന്നത്',
    disclaimer: 'അറിയിപ്പ്: ഡിജിലോക്കർ പരിശോധന, AI വോയ്സ് ട്രയേജ്, പരാതി തയ്യാറാക്കൽ എന്നിവ ലൈവ് ഫീച്ചറുകളാണ്; പോലീസ് ഡെസ്പാച്ചും ബാങ്ക് ഫ്രീസ് ചെയ്യലും സിമുലേഷൻ വർക്ക്ഫ്ലോകളാണ്. ഔദ്യോഗിക പോർട്ടൽ cybercrime.gov.in. അടിയന്തര ഘട്ടത്തിൽ 1930 ഡയൽ ചെയ്യുക.',
  },
  pa: {
    ctaHeadline: 'ਗੋਲਡਨ ਆਵਰ ਵਿੱਚ ਹਰ ਮਿੰਟ ਕੀਮਤੀ ਹੈ।',
    ctaDesc: 'ਧੋਖਾਧੜੀ ਦੀ ਰਿਪੋਰਟ ਜਿੰਨੀ ਜਲਦੀ ਕਰੋਗੇ, ਪੈਸੇ ਵਾਪਸ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਓਨੀ ਹੀ ਵੱਧ ਹੋਵੇਗੀ। ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ।',
    ctaBtn: 'ਰਿਪੋਰਟ ਸ਼ੁਰੂ ਕਰੋ',
    tagline: 'AI ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਟ੍ਰਾਇਜ। ਘਬਰਾਹਟ ਤੋਂ ਐੱਫ.ਆਈ.ਆਰ. ਤੱਕ।',
    linksTitle: 'ਲਿੰਕ',
    howItWorks: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    whySamarthan: 'ਸਮਰਥਨ ਕਿਉਂ?',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    emergencyTitle: 'ਐਮਰਜੈਂਸੀ',
    helpline1930: 'ਸਾਈਬਰ ਹੈਲਪਲਾਈਨ: 1930',
    police100: 'ਪੁਲਿਸ: 100',
    aboutTitle: 'ਬਾਰੇ',
    portalTag: 'ਨਾਗਰਿਕ ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਟ੍ਰਾਇਜ ਪਹਿਲਕਦਮੀ',
    digilockerVerified: 'DigiLocker ਪ੍ਰਮਾਣਿਤ ਪਛਾਣ',
    poweredBy: 'GPT-4o ਦੁਆਰਾ ਸੰਚਾਲਿਤ',
    disclaimer: 'ਸੂਚਨਾ: ਡਿਜੀਲੌਕਰ ਤਸਦੀਕ, AI ਵੌਇਸ ਟ੍ਰਾਇਜ ਅਤੇ ਸ਼ਿਕਾਇਤ ਡਰਾਫਟਿੰਗ ਕਾਰਜਸ਼ੀਲ ਫੀਚਰ ਹਨ; ਪੁਲਿਸ ਭੇਜਣਾ ਅਤੇ ਬੈਂਕ ਫ੍ਰੀਜ਼ ਕਰਨਾ ਸਿਮੂਲੇਟਿਡ ਵਰਕਫਲੋ ਹਨ। ਅਧਿਕਾਰਤ ਪੋਰਟਲ cybercrime.gov.in ਹੈ। ਐਮਰਜੈਂਸੀ ਲਈ 1930 ਡਾਇਲ ਕਰੋ।',
  },
}

export default function FooterSection({ language }: FooterSectionProps) {
  const t = FOOTER_I18N[language] || FOOTER_I18N.en
  const router = useRouter()
  const { setScenarioId, setInputType } = useTriage()

  const startReport = () => {
    setScenarioId(null)
    setInputType('text')
    router.push('/intake?category=auto')
  }

  const scrollTo = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Final CTA */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground indic-headline">
            {t.ctaHeadline}
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed indic-body">
            {t.ctaDesc}
          </p>
          <button
            onClick={startReport}
            className="mt-6 sm:mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-8 py-3.5 text-sm font-semibold transition-colors min-h-[44px] cursor-pointer"
          >
            <span>{t.ctaBtn}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="text-lg font-bold text-foreground">Samarthan</div>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed indic-body">
                {t.tagline}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                {t.linksTitle}
              </h4>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li><a href="#how-it-works" onClick={(e) => scrollTo('how-it-works', e)} className="hover:text-primary transition-colors">{t.howItWorks}</a></li>
                <li><a href="#comparison" onClick={(e) => scrollTo('comparison', e)} className="hover:text-primary transition-colors">{t.whySamarthan}</a></li>
                <li><a href="#file-report" onClick={(e) => scrollTo('file-report', e)} className="hover:text-primary transition-colors">{t.getStarted}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                {t.emergencyTitle}
              </h4>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li><a href="tel:1930" className="hover:text-primary transition-colors">{t.helpline1930}</a></li>
                <li><a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">cybercrime.gov.in</a></li>
                <li><a href="tel:100" className="hover:text-primary transition-colors">{t.police100}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                {t.aboutTitle}
              </h4>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li>{t.portalTag}</li>
                <li>{t.digilockerVerified}</li>
                <li>{t.poweredBy}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <p className="max-w-3xl leading-relaxed indic-body">
              🏛️ <strong>Citizen Portal Simulation Environment</strong> • ⚠️ <em>{t.disclaimer}</em>
            </p>
            <p className="whitespace-nowrap font-medium text-zinc-400">
              Made with ❤️ for India
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
