import { SupportedLanguage } from './languages'

/**
 * Copy that belongs to the app shell rather than a single feature. Keeping it
 * here makes the language audit explicit: every selectable language must have
 * a real value for every visible shell label.
 */
export interface ScreenCopy {
  award: string
  languagePicker: {
    title: string
    subtitle: string
    close: string
    footer: string
  }
  intake: {
    back: string
    sandbox: string
    category: string
    verifiedCitizen: string
    verifiedDetail: string
    signOut: string
    identityTitle: string
    identityDescription: string
    simulateDigiLocker: string
    offline: string
    genericError: string
    anonymousCitizen: string
    autoDetect: string
  }
  dashboard: {
    notFound: string
    loadError: string
    digitalArrestTitle: string
    digitalArrestInfo: string
  }
}

export const SCREEN_COPY: Record<SupportedLanguage, ScreenCopy> = {
  en: {
    award: '3rd Place Winner — Build What Moves India Hackathon',
    languagePicker: { title: 'Select your language', subtitle: 'Choose from 12 Indian languages', close: 'Close language selector', footer: 'You can speak or write in any of these languages for guided incident reporting.' },
    intake: { back: 'Go back', sandbox: 'Sandbox mode — synthetic data', category: 'Category', verifiedCitizen: 'Demo identity checked', verifiedDetail: 'Aadhaar: {aadhaar} • Demo identity only', signOut: 'Sign out', identityTitle: 'Identity check (optional)', identityDescription: 'You can report without signing in. Or try the DigiLocker demo.', simulateDigiLocker: 'Try DigiLocker demo', offline: "You’re offline. Check your connection and try again.", genericError: 'Something went wrong.', anonymousCitizen: 'Anonymous citizen', autoDetect: 'AI auto-detect' },
    dashboard: { notFound: 'Complaint not found', loadError: 'Error loading complaint', digitalArrestTitle: 'Critical warning: digital arrest fraud', digitalArrestInfo: 'Police, CBI, ED, Customs and courts never arrest or conduct trials over video calls, or demand money for verification. Disconnect immediately and call 1930.' },
  },
  hi: {
    award: 'तीसरा स्थान विजेता — बिल्ड व्हाट मूव्स इंडिया हैकथॉन',
    languagePicker: { title: 'अपनी भाषा चुनें', subtitle: '12 भारतीय भाषाओं में से चुनें', close: 'भाषा चयन बंद करें', footer: 'निर्देशित घटना रिपोर्टिंग के लिए आप इनमें से किसी भी भाषा में बोल या लिख सकते हैं।' },
    intake: { back: 'वापस जाएं', sandbox: 'सैंडबॉक्स मोड — सिंथेटिक डेटा', category: 'श्रेणी', verifiedCitizen: 'डिजीलॉकर सत्यापित नागरिक', verifiedDetail: 'आधार: {aadhaar} • MeitY सैंडबॉक्स में सत्यापित', signOut: 'साइन आउट', identityTitle: 'पहचान सत्यापन (वैकल्पिक)', identityDescription: 'बिना साइन इन किए भी रिपोर्ट कर सकते हैं। सत्यापित पहचान के लिए डिजीलॉकर सिमुलेशन का उपयोग करें।', simulateDigiLocker: 'डिजीलॉकर सिमुलेट करें', offline: 'आप ऑफ़लाइन हैं। कनेक्शन जांचें और फिर कोशिश करें।', genericError: 'कुछ गलत हो गया।', anonymousCitizen: 'अज्ञात नागरिक', autoDetect: 'AI ऑटो-डिटेक्ट' },
    dashboard: { notFound: 'शिकायत नहीं मिली', loadError: 'शिकायत लोड करने में त्रुटि', digitalArrestTitle: 'महत्वपूर्ण चेतावनी: डिजिटल अरेस्ट धोखाधड़ी', digitalArrestInfo: 'पुलिस, सीबीआई, ईडी, कस्टम या अदालतें कभी वीडियो कॉल पर गिरफ्तारी या सुनवाई नहीं करतीं और सत्यापन के लिए पैसे नहीं मांगतीं। तुरंत कॉल काटें और 1930 पर कॉल करें।' },
  },
  bn: {
    award: 'তৃতীয় স্থান বিজয়ী — বিল্ড হোয়াট মুভস ইন্ডিয়া হ্যাকাথন',
    languagePicker: { title: 'আপনার ভাষা নির্বাচন করুন', subtitle: '১২টি ভারতীয় ভাষা থেকে বেছে নিন', close: 'ভাষা নির্বাচন বন্ধ করুন', footer: 'নির্দেশিত ঘটনা রিপোর্টিংয়ের জন্য আপনি এই ভাষাগুলির যেকোনো একটিতে বলতে বা লিখতে পারেন।' },
    intake: { back: 'ফিরে যান', sandbox: 'স্যান্ডবক্স মোড — কৃত্রিম ডেটা', category: 'বিভাগ', verifiedCitizen: 'ডিজিলকার যাচাইকৃত নাগরিক', verifiedDetail: 'আধার: {aadhaar} • MeitY স্যান্ডবক্সে যাচাইকৃত', signOut: 'সাইন আউট', identityTitle: 'পরিচয় যাচাইকরণ (ঐচ্ছিক)', identityDescription: 'সাইন ইন না করেও রিপোর্ট করতে পারেন। যাচাইকৃত পরিচয়ের জন্য ডিজিলকার সিমুলেশন ব্যবহার করুন।', simulateDigiLocker: 'ডিজিলকার সিমুলেট করুন', offline: 'আপনি অফলাইনে আছেন। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।', genericError: 'কিছু ভুল হয়েছে।', anonymousCitizen: 'অজ্ঞাত নাগরিক', autoDetect: 'AI স্বয়ংক্রিয় শনাক্তকরণ' },
    dashboard: { notFound: 'অভিযোগ পাওয়া যায়নি', loadError: 'অভিযোগ লোড করতে সমস্যা হয়েছে', digitalArrestTitle: 'জরুরি সতর্কতা: ডিজিটাল গ্রেপ্তার প্রতারণা', digitalArrestInfo: 'পুলিশ, CBI, ED, কাস্টমস বা আদালত কখনও ভিডিও কলে গ্রেপ্তার বা বিচার করে না এবং যাচাইয়ের জন্য টাকা চায় না। সঙ্গে সঙ্গে কল কেটে ১৯৩০-এ ফোন করুন।' },
  },
  mr: {
    award: 'तृतीय क्रमांक विजेता — बिल्ड व्हॉट मूव्हज इंडिया हॅकथॉन',
    languagePicker: { title: 'तुमची भाषा निवडा', subtitle: '१२ भारतीय भाषांमधून निवडा', close: 'भाषा निवड बंद करा', footer: 'मार्गदर्शित घटना नोंदणीसाठी तुम्ही यापैकी कोणत्याही भाषेत बोलू किंवा लिहू शकता.' },
    intake: { back: 'मागे जा', sandbox: 'सँडबॉक्स मोड — कृत्रिम डेटा', category: 'श्रेणी', verifiedCitizen: 'डिजिलॉकर सत्यापित नागरिक', verifiedDetail: 'आधार: {aadhaar} • MeitY सँडबॉक्समध्ये सत्यापित', signOut: 'साइन आउट', identityTitle: 'ओळख पडताळणी (ऐच्छिक)', identityDescription: 'साइन इन न करताही तुम्ही तक्रार नोंदवू शकता. सत्यापित ओळखीसाठी डिजिलॉकर सिम्युलेशन वापरा.', simulateDigiLocker: 'डिजिलॉकर सिम्युलेट करा', offline: 'तुम्ही ऑफलाइन आहात. कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.', genericError: 'काहीतरी चूक झाली.', anonymousCitizen: 'अज्ञात नागरिक', autoDetect: 'AI स्वयंचलित ओळख' },
    dashboard: { notFound: 'तक्रार सापडली नाही', loadError: 'तक्रार लोड करताना त्रुटी', digitalArrestTitle: 'महत्त्वाची सूचना: डिजिटल अटक फसवणूक', digitalArrestInfo: 'पोलीस, CBI, ED, कस्टम्स किंवा न्यायालये कधीही व्हिडिओ कॉलवर अटक किंवा खटला चालवत नाहीत आणि पडताळणीसाठी पैसे मागत नाहीत. लगेच कॉल तोडा आणि १९३० वर कॉल करा.' },
  },
  te: {
    award: '3వ స్థానం విజేత — బిల్డ్ వాట్ మూవ్స్ ఇండియా హ్యాకథాన్',
    languagePicker: { title: 'మీ భాషను ఎంచుకోండి', subtitle: '12 భారతీయ భాషల నుంచి ఎంచుకోండి', close: 'భాష ఎంపికను మూసివేయండి', footer: 'మార్గనిర్దేశిత ఘటన నివేదిక కోసం ఈ భాషల్లో ఏదైనా మాట్లాడవచ్చు లేదా రాయవచ్చు.' },
    intake: { back: 'వెనక్కి వెళ్లండి', sandbox: 'సాండ్‌బాక్స్ మోడ్ — కృత్రిమ డేటా', category: 'వర్గం', verifiedCitizen: 'డిజిలాకర్ ధృవీకరించిన పౌరుడు', verifiedDetail: 'ఆధార్: {aadhaar} • MeitY సాండ్‌బాక్స్‌లో ధృవీకరించబడింది', signOut: 'సైన్ అవుట్', identityTitle: 'గుర్తింపు ధృవీకరణ (ఐచ్ఛికం)', identityDescription: 'సైన్ ఇన్ చేయకుండానే నివేదించవచ్చు. ధృవీకరించిన గుర్తింపు కోసం డిజిలాకర్ సిమ్యులేషన్ ఉపయోగించండి.', simulateDigiLocker: 'డిజిలాకర్‌ను అనుకరించండి', offline: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.', genericError: 'ఏదో తప్పు జరిగింది.', anonymousCitizen: 'అజ్ఞాత పౌరుడు', autoDetect: 'AI స్వయంచాలక గుర్తింపు' },
    dashboard: { notFound: 'ఫిర్యాదు కనుగొనబడలేదు', loadError: 'ఫిర్యాదు లోడ్ చేయడంలో లోపం', digitalArrestTitle: 'ముఖ్యమైన హెచ్చరిక: డిజిటల్ అరెస్ట్ మోసం', digitalArrestInfo: 'పోలీసు, CBI, ED, కస్టమ్స్ లేదా కోర్టులు వీడియో కాల్‌లో అరెస్ట్ లేదా విచారణ చేయవు; ధృవీకరణ కోసం డబ్బు అడగవు. వెంటనే కాల్‌ను తెంచి 1930 కు కాల్ చేయండి.' },
  },
  ta: {
    award: 'மூன்றாம் இட வெற்றியாளர் — பில்ட் வாட் மூவ்ஸ் இந்தியா ஹேக்கத்தான்',
    languagePicker: { title: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', subtitle: '12 இந்திய மொழிகளில் இருந்து தேர்வு செய்யவும்', close: 'மொழித் தேர்வை மூடவும்', footer: 'வழிகாட்டப்பட்ட சம்பவப் புகாருக்கு இந்த மொழிகளில் ஏதேனும் ஒன்றில் பேசவோ எழுதவோலாம்.' },
    intake: { back: 'பின்செல்லவும்', sandbox: 'சாண்ட்பாக்ஸ் பயன்முறை — செயற்கை தரவு', category: 'வகை', verifiedCitizen: 'டிஜிலாக்கர் சரிபார்க்கப்பட்ட குடிமகன்', verifiedDetail: 'ஆதார்: {aadhaar} • MeitY சாண்ட்பாக்ஸில் சரிபார்க்கப்பட்டது', signOut: 'வெளியேறு', identityTitle: 'அடையாளச் சரிபார்ப்பு (விருப்பமானது)', identityDescription: 'உள்நுழையாமல் புகார் செய்யலாம். சரிபார்க்கப்பட்ட அடையாளத்திற்கு டிஜிலாக்கர் சிமுலேஷனைப் பயன்படுத்தவும்.', simulateDigiLocker: 'டிஜிலாக்கரை சிமுலேட் செய்க', offline: 'நீங்கள் இணையமின்றி உள்ளீர்கள். இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.', genericError: 'ஏதோ தவறு நடந்தது.', anonymousCitizen: 'அடையாளம் தெரியாத குடிமகன்', autoDetect: 'AI தானியங்கி கண்டறிதல்' },
    dashboard: { notFound: 'புகார் கிடைக்கவில்லை', loadError: 'புகாரை ஏற்றுவதில் பிழை', digitalArrestTitle: 'முக்கிய எச்சரிக்கை: டிஜிட்டல் கைது மோசடி', digitalArrestInfo: 'காவல்துறை, CBI, ED, சுங்கம் அல்லது நீதிமன்றங்கள் வீடியோ அழைப்பில் கைது அல்லது விசாரணை நடத்தாது; சரிபார்ப்புக்கு பணம் கேட்காது. உடனே அழைப்பை துண்டித்து 1930-ஐ அழைக்கவும்.' },
  },
  gu: {
    award: 'ત્રીજા સ્થાનના વિજેતા — બિલ્ડ વોટ મૂવ્સ ઇન્ડિયા હેકાથોન',
    languagePicker: { title: 'તમારી ભાષા પસંદ કરો', subtitle: '12 ભારતીય ભાષાઓમાંથી પસંદ કરો', close: 'ભાષા પસંદગી બંધ કરો', footer: 'માર્ગદર્શિત ઘટના રિપોર્ટિંગ માટે તમે આમાંથી કોઈપણ ભાષામાં બોલી અથવા લખી શકો છો.' },
    intake: { back: 'પાછા જાઓ', sandbox: 'સેન્ડબોક્સ મોડ — કૃત્રિમ ડેટા', category: 'શ્રેણી', verifiedCitizen: 'ડિજિલૉકર ચકાસાયેલ નાગરિક', verifiedDetail: 'આધાર: {aadhaar} • MeitY સેન્ડબોક્સમાં ચકાસાયેલ', signOut: 'સાઇન આઉટ', identityTitle: 'ઓળખ ચકાસણી (વૈકલ્પિક)', identityDescription: 'સાઇન ઇન કર્યા વગર પણ રિપોર્ટ કરી શકો છો. ચકાસાયેલ ઓળખ માટે ડિજિલૉકર સિમ્યુલેશન વાપરો.', simulateDigiLocker: 'ડિજિલૉકર સિમ્યુલેટ કરો', offline: 'તમે ઑફલાઇન છો. કનેક્શન તપાસી ફરી પ્રયાસ કરો.', genericError: 'કંઈક ખોટું થયું.', anonymousCitizen: 'અજ્ઞાત નાગરિક', autoDetect: 'AI આપમેળે ઓળખ' },
    dashboard: { notFound: 'ફરિયાદ મળી નથી', loadError: 'ફરિયાદ લોડ કરવામાં ભૂલ', digitalArrestTitle: 'મહત્વપૂર્ણ ચેતવણી: ડિજિટલ ધરપકડ છેતરપિંડી', digitalArrestInfo: 'પોલીસ, CBI, ED, કસ્ટમ્સ કે અદાલતો વીડિયો કૉલ પર ક્યારેય ધરપકડ અથવા સુનાવણી કરતી નથી અને ચકાસણી માટે પૈસા માંગતી નથી. તાત્કાલિક કૉલ બંધ કરો અને 1930 પર કૉલ કરો.' },
  },
  ur: {
    award: 'تیسری پوزیشن کے فاتح — بلڈ واٹ مووز انڈیا ہیکاتھون',
    languagePicker: { title: 'اپنی زبان منتخب کریں', subtitle: '12 بھارتی زبانوں میں سے منتخب کریں', close: 'زبان کا انتخاب بند کریں', footer: 'رہنمائی کے ساتھ واقعے کی رپورٹنگ کے لیے آپ ان میں سے کسی بھی زبان میں بول یا لکھ سکتے ہیں۔' },
    intake: { back: 'واپس جائیں', sandbox: 'سینڈ باکس موڈ — مصنوعی ڈیٹا', category: 'زمرہ', verifiedCitizen: 'ڈیجی لاکر سے تصدیق شدہ شہری', verifiedDetail: 'آدھار: {aadhaar} • MeitY سینڈ باکس میں تصدیق شدہ', signOut: 'سائن آؤٹ', identityTitle: 'شناخت کی تصدیق (اختیاری)', identityDescription: 'سائن ان کیے بغیر بھی رپورٹ درج کر سکتے ہیں۔ تصدیق شدہ شناخت کے لیے ڈیجی لاکر سیمولیشن استعمال کریں۔', simulateDigiLocker: 'ڈیجی لاکر سیمولیٹ کریں', offline: 'آپ آف لائن ہیں۔ کنکشن چیک کر کے دوبارہ کوشش کریں۔', genericError: 'کچھ غلط ہو گیا۔', anonymousCitizen: 'گمنام شہری', autoDetect: 'AI خودکار شناخت' },
    dashboard: { notFound: 'شکایت نہیں ملی', loadError: 'شکایت لوڈ کرنے میں خرابی', digitalArrestTitle: 'اہم تنبیہ: ڈیجیٹل گرفتاری کا فراڈ', digitalArrestInfo: 'پولیس، CBI، ED، کسٹمز یا عدالتیں ویڈیو کال پر کبھی گرفتاری یا سماعت نہیں کرتیں اور تصدیق کے لیے رقم نہیں مانگتیں۔ فوراً کال ختم کریں اور 1930 پر کال کریں۔' },
  },
  kn: {
    award: 'ಮೂರನೇ ಸ್ಥಾನ ವಿಜೇತ — ಬಿಲ್ಡ್ ವಾಟ್ ಮೂವ್ಸ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್',
    languagePicker: { title: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', subtitle: '12 ಭಾರತೀಯ ಭಾಷೆಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ', close: 'ಭಾಷೆ ಆಯ್ಕೆಯನ್ನು ಮುಚ್ಚಿ', footer: 'ಮಾರ್ಗದರ್ಶಿತ ಘಟನೆ ವರದಿಗಾಗಿ ಈ ಭಾಷೆಗಳಲ್ಲಿ ಯಾವುದಾದರೂ ಒಂದರಲ್ಲಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಬರೆಯಬಹುದು.' },
    intake: { back: 'ಹಿಂದೆ ಹೋಗಿ', sandbox: 'ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್ ಮೋಡ್ — ಕೃತಕ ಡೇಟಾ', category: 'ವರ್ಗ', verifiedCitizen: 'ಡಿಜಿಲಾಕರ್ ಪರಿಶೀಲಿಸಿದ ನಾಗರಿಕ', verifiedDetail: 'ಆಧಾರ್: {aadhaar} • MeitY ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ', signOut: 'ಸೈನ್ ಔಟ್', identityTitle: 'ಗುರುತಿನ ಪರಿಶೀಲನೆ (ಐಚ್ಛಿಕ)', identityDescription: 'ಸೈನ್ ಇನ್ ಮಾಡದೆಯೂ ವರದಿ ಮಾಡಬಹುದು. ಪರಿಶೀಲಿಸಿದ ಗುರುತಿಗಾಗಿ ಡಿಜಿಲಾಕರ್ ಸಿಮ್ಯುಲೇಶನ್ ಬಳಸಿ.', simulateDigiLocker: 'ಡಿಜಿಲಾಕರ್ ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ', offline: 'ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', genericError: 'ಏನೋ ತಪ್ಪಾಗಿದೆ.', anonymousCitizen: 'ಅನಾಮಧೇಯ ನಾಗರಿಕ', autoDetect: 'AI ಸ್ವಯಂ ಪತ್ತೆ' },
    dashboard: { notFound: 'ದೂರು ಕಂಡುಬಂದಿಲ್ಲ', loadError: 'ದೂರು ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ', digitalArrestTitle: 'ಮುಖ್ಯ ಎಚ್ಚರಿಕೆ: ಡಿಜಿಟಲ್ ಬಂಧನ ವಂಚನೆ', digitalArrestInfo: 'ಪೊಲೀಸ್, CBI, ED, ಕಸ್ಟಮ್ಸ್ ಅಥವಾ ನ್ಯಾಯಾಲಯಗಳು ವೀಡಿಯೊ ಕರೆಯಲ್ಲಿ ಬಂಧನ ಅಥವಾ ವಿಚಾರಣೆ ನಡೆಸುವುದಿಲ್ಲ; ಪರಿಶೀಲನೆಗೆ ಹಣ ಕೇಳುವುದಿಲ್ಲ. ತಕ್ಷಣ ಕರೆ ಕಡಿತಗೊಳಿಸಿ 1930 ಗೆ ಕರೆ ಮಾಡಿ.' },
  },
  or: {
    award: 'ତୃତୀୟ ସ୍ଥାନ ବିଜେତା — ବିଲ୍ଡ ହ୍ୱାଟ୍ ମୁଭ୍ସ ଇଣ୍ଡିଆ ହ୍ୟାକାଥନ୍',
    languagePicker: { title: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ', subtitle: '12ଟି ଭାରତୀୟ ଭାଷାରୁ ବାଛନ୍ତୁ', close: 'ଭାଷା ଚୟନ ବନ୍ଦ କରନ୍ତୁ', footer: 'ନିର୍ଦ୍ଦେଶିତ ଘଟଣା ରିପୋର୍ଟିଂ ପାଇଁ ଆପଣ ଏହି ଭାଷାଗୁଡ଼ିକରେ କହି କିମ୍ବା ଲେଖିପାରିବେ।' },
    intake: { back: 'ପଛକୁ ଯାଆନ୍ତୁ', sandbox: 'ସ୍ୟାଣ୍ଡବକ୍ସ ମୋଡ୍ — କୃତ୍ରିମ ତଥ୍ୟ', category: 'ବର୍ଗ', verifiedCitizen: 'ଡିଜିଲକର ସତ୍ୟାପିତ ନାଗରିକ', verifiedDetail: 'ଆଧାର: {aadhaar} • MeitY ସ୍ୟାଣ୍ଡବକ୍ସରେ ସତ୍ୟାପିତ', signOut: 'ସାଇନ ଆଉଟ', identityTitle: 'ପରିଚୟ ସତ୍ୟାପନ (ବୈକଳ୍ପିକ)', identityDescription: 'ସାଇନ ଇନ୍ ନକରି ମଧ୍ୟ ରିପୋର୍ଟ କରିପାରିବେ। ସତ୍ୟାପିତ ପରିଚୟ ପାଇଁ ଡିଜିଲକର ସିମୁଲେସନ୍ ବ୍ୟବହାର କରନ୍ତୁ।', simulateDigiLocker: 'ଡିଜିଲକର ସିମୁଲେଟ କରନ୍ତୁ', offline: 'ଆପଣ ଅଫଲାଇନ୍ ଅଛନ୍ତି। ସଂଯୋଗ ଯାଞ୍ଚ କରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।', genericError: 'କିଛି ଭୁଲ ହୋଇଛି।', anonymousCitizen: 'ଅଜଣା ନାଗରିକ', autoDetect: 'AI ସ୍ୱୟଂଚାଳିତ ଚିହ୍ନଟ' },
    dashboard: { notFound: 'ଅଭିଯୋଗ ମିଳିଲା ନାହିଁ', loadError: 'ଅଭିଯୋଗ ଲୋଡ୍ କରିବାରେ ତ୍ରୁଟି', digitalArrestTitle: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସତର୍କତା: ଡିଜିଟାଲ ଗିରଫ ଠକେଇ', digitalArrestInfo: 'ପୋଲିସ, CBI, ED, କଷ୍ଟମ୍ସ କିମ୍ବା ଅଦାଲତ ଭିଡିଓ କଲରେ କେବେ ଗିରଫ କିମ୍ବା ଶୁଣାଣି କରନ୍ତି ନାହିଁ ଏବଂ ସତ୍ୟାପନ ପାଇଁ ଟଙ୍କା ମାଗନ୍ତି ନାହିଁ। ତୁରନ୍ତ କଲ୍ କାଟି ୧୯୩୦କୁ କଲ୍ କରନ୍ତୁ।' },
  },
  ml: {
    award: 'മൂന്നാം സ്ഥാന ജേതാവ് — ബിൽഡ് വാട്ട് മൂവ്സ് ഇന്ത്യ ഹാക്കത്തോൺ',
    languagePicker: { title: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക', subtitle: '12 ഇന്ത്യൻ ഭാഷകളിൽ നിന്ന് തിരഞ്ഞെടുക്കുക', close: 'ഭാഷാ തിരഞ്ഞെടുപ്പ് അടയ്ക്കുക', footer: 'നിർദ്ദേശങ്ങളോടെയുള്ള സംഭവ റിപ്പോർട്ടിംഗിന് ഈ ഭാഷകളിൽ ഏതിലും സംസാരിക്കുകയോ എഴുതുകയോ ചെയ്യാം.' },
    intake: { back: 'തിരികെ പോകുക', sandbox: 'സാൻഡ്‌ബോക്സ് മോഡ് — കൃത്രിമ ഡാറ്റ', category: 'വിഭാഗം', verifiedCitizen: 'ഡിജിലോക്കർ പരിശോധിച്ച പൗരൻ', verifiedDetail: 'ആധാർ: {aadhaar} • MeitY സാൻഡ്‌ബോക്സിൽ പരിശോധിച്ചു', signOut: 'സൈൻ ഔട്ട്', identityTitle: 'തിരിച്ചറിയൽ പരിശോധന (ഐച്ഛികം)', identityDescription: 'സൈൻ ഇൻ ചെയ്യാതെ തന്നെ റിപ്പോർട്ട് നൽകാം. പരിശോധിച്ച തിരിച്ചറിയലിന് ഡിജിലോക്കർ സിമുലേഷൻ ഉപയോഗിക്കുക.', simulateDigiLocker: 'ഡിജിലോക്കർ സിമുലേറ്റ് ചെയ്യുക', offline: 'നിങ്ങൾ ഓഫ്‌ലൈനിലാണ്. കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.', genericError: 'എന്തോ പിഴച്ചു.', anonymousCitizen: 'അജ്ഞാത പൗരൻ', autoDetect: 'AI സ്വയം കണ്ടെത്തൽ' },
    dashboard: { notFound: 'പരാതി കണ്ടെത്തിയില്ല', loadError: 'പരാതി ലോഡ് ചെയ്യുന്നതിൽ പിശക്', digitalArrestTitle: 'പ്രധാന മുന്നറിയിപ്പ്: ഡിജിറ്റൽ അറസ്റ്റ് തട്ടിപ്പ്', digitalArrestInfo: 'പോലീസ്, CBI, ED, കസ്റ്റംസ്, കോടതികൾ എന്നിവ വീഡിയോ കോളിൽ ഒരിക്കലും അറസ്റ്റ് അല്ലെങ്കിൽ വിചാരണ നടത്തുകയില്ല; പരിശോധനയ്ക്ക് പണം ആവശ്യപ്പെടുകയുമില്ല. ഉടൻ കോൾ വിച്ഛേദിച്ച് 1930-ലേക്ക് വിളിക്കുക.' },
  },
  pa: {
    award: 'ਤੀਜਾ ਸਥਾਨ ਜੇਤੂ — ਬਿਲਡ ਵ੍ਹਾਟ ਮੂਵਜ਼ ਇੰਡੀਆ ਹੈਕਾਥਾਨ',
    languagePicker: { title: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', subtitle: '12 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚੋਂ ਚੁਣੋ', close: 'ਭਾਸ਼ਾ ਚੋਣ ਬੰਦ ਕਰੋ', footer: 'ਮਾਰਗਦਰਸ਼ਿਤ ਘਟਨਾ ਰਿਪੋਰਟਿੰਗ ਲਈ ਤੁਸੀਂ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਜਾਂ ਲਿਖ ਸਕਦੇ ਹੋ।' },
    intake: { back: 'ਵਾਪਸ ਜਾਓ', sandbox: 'ਸੈਂਡਬਾਕਸ ਮੋਡ — ਸਿੰਥੈਟਿਕ ਡਾਟਾ', category: 'ਸ਼੍ਰੇਣੀ', verifiedCitizen: 'ਡਿਜੀਲਾਕਰ ਪ੍ਰਮਾਣਿਤ ਨਾਗਰਿਕ', verifiedDetail: 'ਆਧਾਰ: {aadhaar} • MeitY ਸੈਂਡਬਾਕਸ ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ', signOut: 'ਸਾਈਨ ਆਊਟ', identityTitle: 'ਪਛਾਣ ਦੀ ਤਸਦੀਕ (ਵਿਕਲਪਿਕ)', identityDescription: 'ਸਾਈਨ ਇਨ ਕੀਤੇ ਬਿਨਾਂ ਵੀ ਰਿਪੋਰਟ ਕਰ ਸਕਦੇ ਹੋ। ਪ੍ਰਮਾਣਿਤ ਪਛਾਣ ਲਈ ਡਿਜੀਲਾਕਰ ਸਿਮੂਲੇਸ਼ਨ ਵਰਤੋ।', simulateDigiLocker: 'ਡਿਜੀਲਾਕਰ ਸਿਮੂਲੇਟ ਕਰੋ', offline: 'ਤੁਸੀਂ ਆਫਲਾਈਨ ਹੋ। ਕਨੈਕਸ਼ਨ ਜਾਂਚ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', genericError: 'ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ।', anonymousCitizen: 'ਅਣਪਛਾਤਾ ਨਾਗਰਿਕ', autoDetect: 'AI ਸਵੈਚਾਲਿਤ ਪਛਾਣ' },
    dashboard: { notFound: 'ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ', loadError: 'ਸ਼ਿਕਾਇਤ ਲੋਡ ਕਰਨ ਵਿੱਚ ਗਲਤੀ', digitalArrestTitle: 'ਮਹੱਤਵਪੂਰਨ ਚੇਤਾਵਨੀ: ਡਿਜੀਟਲ ਗ੍ਰਿਫ਼ਤਾਰੀ ਧੋਖਾਧੜੀ', digitalArrestInfo: 'ਪੁਲਿਸ, CBI, ED, ਕਸਟਮਜ਼ ਜਾਂ ਅਦਾਲਤਾਂ ਵੀਡੀਓ ਕਾਲ ’ਤੇ ਕਦੇ ਗ੍ਰਿਫ਼ਤਾਰੀ ਜਾਂ ਸੁਣਵਾਈ ਨਹੀਂ ਕਰਦੀਆਂ ਅਤੇ ਤਸਦੀਕ ਲਈ ਪੈਸੇ ਨਹੀਂ ਮੰਗਦੀਆਂ। ਤੁਰੰਤ ਕਾਲ ਕੱਟੋ ਅਤੇ 1930 ’ਤੇ ਕਾਲ ਕਰੋ।' },
  },
}

export function formatScreenCopy(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}
