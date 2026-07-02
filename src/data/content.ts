export const WHATSAPP_NUMBER = "96171234567";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const nav = {
  logo: { ar: "حملة الخليل", en: "Hamlet Al Khalil" },
  links: [
    { ar: "الرئيسية", en: "Home", href: "#home" },
    { ar: "الرحلات الحالية", en: "Current Trips", href: "#trips" },
    { ar: "زيارات", en: "Ziyarat", href: "#ziyarat" },
    { ar: "السياحة", en: "Tourism", href: "#tourism" },
    { ar: "عن الوكالة", en: "About", href: "#about" },
    { ar: "تواصل معنا", en: "Contact", href: "#contact" },
  ],
};

export const hero = {
  heading: {
    ar: "رحلاتك إلى الأماكن المقدسة تبدأ من هنا",
    en: "Your Journey to the Holy Shrines Starts Here",
  },
  subheading: {
    ar: "نرافقك في كل خطوة نحو الأماكن المقدسة بخبرة تمتد لأكثر من ١٥ عاماً",
    en: "We accompany you every step of the way to the holy sites, with over 15 years of experience",
  },
  cta1: { ar: "باقات الزيارة", en: "Ziyarat Packages" },
  cta2: { ar: "السياحة", en: "Tourism" },
};

export const ziyaratPackages = [
  {
    id: "iraq",
    flag: "🇮🇶",
    name: { ar: "العراق — نجف وكربلاء والكاظمية", en: "Iraq — Najaf, Karbala & Kadhimiya" },
    duration: { ar: "٧ أيام", en: "7 Days" },
    price: 650,
    badge: null,
    highlights: {
      ar: ["ضريح الإمام علي (ع)", "ضريح الإمام الحسين (ع)", "ضريح الإمامين الكاظمين (ع)"],
      en: ["Imam Ali Shrine", "Imam Hussain Shrine", "Kadhimain Shrine"],
    },
    color: "from-[#1a2444] to-[#0a0f2c]",
  },
  {
    id: "iran",
    flag: "🇮🇷",
    name: { ar: "إيران — مشهد وقم المقدسة", en: "Iran — Mashhad & Holy Qom" },
    duration: { ar: "١٠ أيام", en: "10 Days" },
    price: 950,
    badge: null,
    highlights: {
      ar: ["ضريح الإمام الرضا (ع)", "ضريح السيدة فاطمة المعصومة (ع)", "جامعة قم الدينية"],
      en: ["Imam Reza Shrine", "Lady Fatima Masumeh Shrine", "Qom Seminary"],
    },
    color: "from-[#1a2444] to-[#0a0f2c]",
  },
  {
    id: "arbaeen",
    flag: "🇮🇶",
    name: { ar: "زيارة الأربعين — العراق", en: "Arbaeen Ziyarat — Iraq" },
    duration: { ar: "١٤ يوماً", en: "14 Days" },
    price: 1100,
    badge: { ar: "الأكثر طلباً 🔥", en: "Most Popular 🔥" },
    highlights: {
      ar: ["مسيرة الأربعين الكبرى", "كربلاء المقدسة", "النجف الأشرف", "تنظيم متكامل"],
      en: ["Grand Arbaeen Walk", "Holy Karbala", "Holy Najaf", "Full Organization"],
    },
    color: "from-[#2a1a00] to-[#1a0f00]",
  },
  {
    id: "syria",
    flag: "🇸🇾",
    name: { ar: "سوريا — السيدة زينب والسيدة رقية", en: "Syria — Sayyida Zaynab & Sayyida Ruqayya" },
    duration: { ar: "٥ أيام", en: "5 Days" },
    price: 450,
    badge: null,
    highlights: {
      ar: ["ضريح السيدة زينب (ع)", "ضريح السيدة رقية (ع)", "جامع الأموي"],
      en: ["Sayyida Zaynab Shrine", "Sayyida Ruqayya Shrine", "Umayyad Mosque"],
    },
    color: "from-[#1a2444] to-[#0a0f2c]",
  },
];

export const trustItems = [
  {
    icon: "🕌",
    title: { ar: "خبرة ١٥ سنة", en: "15 Years Experience" },
    desc: { ar: "منذ عام ٢٠١٠ ونحن نخدم الحجاج والزوار", en: "Serving pilgrims and visitors since 2010" },
  },
  {
    icon: "👨‍✈️",
    title: { ar: "مرشد ديني متخصص", en: "Religious Guide Included" },
    desc: { ar: "مرافقة شيخ متخصص في كل رحلة", en: "A specialist religious scholar accompanies every trip" },
  },
  {
    icon: "✅",
    title: { ar: "مرخصون رسمياً", en: "Officially Licensed" },
    desc: { ar: "مرخصون من وزارة السياحة اللبنانية", en: "Licensed by the Lebanese Ministry of Tourism" },
  },
  {
    icon: "💬",
    title: { ar: "دعم واتساب ٢٤/٧", en: "WhatsApp Support 24/7" },
    desc: { ar: "نحن معك قبل وخلال وبعد الرحلة", en: "We're with you before, during and after the trip" },
  },
];

export const tourismPackages = [
  {
    id: "turkey",
    flag: "🇹🇷",
    name: { ar: "تركيا", en: "Turkey" },
    duration: { ar: "٧ أيام", en: "7 Days" },
    price: 780,
    desc: { ar: "إسطنبول، كابادوكيا، طرابزون", en: "Istanbul, Cappadocia, Trabzon" },
  },
  {
    id: "dubai",
    flag: "🇦🇪",
    name: { ar: "دبي", en: "Dubai" },
    duration: { ar: "٥ أيام", en: "5 Days" },
    price: 550,
    desc: { ar: "برج خليفة، الصحراء، مول دبي", en: "Burj Khalifa, Desert Safari, Dubai Mall" },
  },
  {
    id: "georgia",
    flag: "🇬🇪",
    name: { ar: "جورجيا", en: "Georgia" },
    duration: { ar: "٦ أيام", en: "6 Days" },
    price: 620,
    desc: { ar: "تبليسي، باتومي، الطبيعة الخلابة", en: "Tbilisi, Batumi, Stunning Nature" },
  },
  {
    id: "egypt",
    flag: "🇪🇬",
    name: { ar: "مصر", en: "Egypt" },
    duration: { ar: "٨ أيام", en: "8 Days" },
    price: 700,
    desc: { ar: "الأهرامات، الأقصر، شرم الشيخ", en: "Pyramids, Luxor, Sharm El Sheikh" },
  },
];

export const testimonials = [
  {
    name: { ar: "أم محمد الموسوي", en: "Um Mohammad Al-Mousawi" },
    destination: { ar: "زيارة العراق", en: "Iraq Ziyarat" },
    quote: {
      ar: "رحلة لا تُنسى إلى كربلاء والنجف. التنظيم كان ممتازاً والمرشد الديني أضاف بُعداً روحانياً رائعاً. شكراً حملة الخليل!",
      en: "An unforgettable trip to Karbala and Najaf. The organization was excellent and the religious guide added a wonderful spiritual dimension. Thank you Hamlet Al Khalil!",
    },
    stars: 5,
  },
  {
    name: { ar: "الحاج كريم بزي", en: "Hajj Karim Bazzi" },
    destination: { ar: "زيارة إيران — مشهد وقم", en: "Iran Ziyarat — Mashhad & Qom" },
    quote: {
      ar: "ثاني مرة أسافر معهم وفي كل مرة أفضل من السابقة. الفندق والإيوان والمواصلات كل شيء من الدرجة الأولى.",
      en: "Second time traveling with them and each time is better than the last. Hotel, food, and transportation — everything is first class.",
    },
    stars: 5,
  },
  {
    name: { ar: "فاطمة حمدان", en: "Fatima Hamdan" },
    destination: { ar: "رحلة تركيا السياحية", en: "Turkey Tourism Trip" },
    quote: {
      ar: "أخذت عائلتي في رحلة تركيا وكانت تجربة رائعة. الأسعار معقولة جداً والخدمة احترافية. سأحجز معهم دائماً!",
      en: "Took my family on the Turkey trip and it was an amazing experience. Very reasonable prices and professional service. I'll always book with them!",
    },
    stars: 5,
  },
];

// Travel dua — recited when setting out on a journey (Az-Zukhruf 43:13)
export const verse = {
  arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
  translation: {
    ar: "دعاء السفر — سورة الزخرف",
    en: "“Glory be to Him who has subjected this to us, for we could never have done it ourselves — and surely to our Lord we will return.”",
  },
  reference: { ar: "الزخرف ١٣–١٤", en: "Az-Zukhruf 13–14 — The Traveler's Prayer" },
};

export const howItWorks = [
  {
    icon: "🗺️",
    title: { ar: "اختر رحلتك", en: "Choose Your Trip" },
    desc: {
      ar: "تصفّح باقات الزيارة والسياحة واختر ما يناسبك",
      en: "Browse our Ziyarat and tourism packages and pick what suits you",
    },
  },
  {
    icon: "💬",
    title: { ar: "تواصل عبر واتساب", en: "Contact on WhatsApp" },
    desc: {
      ar: "أرسل لنا رسالة وسنجيب على كل استفساراتك فوراً",
      en: "Send us a message and we'll answer all your questions right away",
    },
  },
  {
    icon: "🛂",
    title: { ar: "نجهّز كل شيء", en: "We Arrange Everything" },
    desc: {
      ar: "التأشيرات والحجوزات والنقل — كلها علينا",
      en: "Visas, bookings, and transport — we handle it all",
    },
  },
  {
    icon: "🕌",
    title: { ar: "انطلق بسلام", en: "Travel in Peace" },
    desc: {
      ar: "سافر مطمئناً برفقة مرشد ديني متخصص",
      en: "Travel with peace of mind, accompanied by a specialist religious guide",
    },
  },
];

export const faq = [
  {
    q: { ar: "ما هي الأوراق المطلوبة للسفر؟", en: "What documents do I need to travel?" },
    a: {
      ar: "جواز سفر ساري المفعول لمدة ٦ أشهر على الأقل وصور شخصية. نحن نتولى إجراءات التأشيرة كاملة للعراق وإيران وسوريا.",
      en: "A passport valid for at least 6 months and personal photos. We handle the entire visa process for Iraq, Iran, and Syria.",
    },
  },
  {
    q: { ar: "ماذا تشمل أسعار الباقات؟", en: "What do the package prices include?" },
    a: {
      ar: "تشمل تذاكر الطيران أو النقل البري، الإقامة الفندقية، الوجبات، التنقلات الداخلية، والمرشد الديني المرافق طوال الرحلة.",
      en: "Flights or ground transport, hotel accommodation, meals, internal transfers, and a religious guide accompanying you throughout the trip.",
    },
  },
  {
    q: { ar: "هل الرحلات مناسبة للعائلات وكبار السن؟", en: "Are the trips suitable for families and the elderly?" },
    a: {
      ar: "نعم، رحلاتنا عائلية بامتياز. نوفر مساعدة خاصة لكبار السن وذوي الاحتياجات، وبرامجنا مصممة لتناسب جميع الأعمار.",
      en: "Yes — our trips are very family-friendly. We provide special assistance for the elderly and those with special needs, and our programs suit all ages.",
    },
  },
  {
    q: { ar: "هل يمكن الدفع بالتقسيط؟", en: "Can I pay in installments?" },
    a: {
      ar: "نعم، نوفر إمكانية حجز المقعد بدفعة أولى وتقسيط المبلغ المتبقي قبل موعد الانطلاق. تواصل معنا عبر واتساب للتفاصيل.",
      en: "Yes — you can reserve your seat with a deposit and pay the rest in installments before departure. Contact us on WhatsApp for details.",
    },
  },
  {
    q: { ar: "متى يجب الحجز لموكب الأربعين؟", en: "When should I book for Arbaeen?" },
    a: {
      ar: "ننصح بالحجز قبل شهرين على الأقل، فالأماكن محدودة والطلب كبير جداً في موسم الأربعين.",
      en: "We recommend booking at least two months in advance — seats are limited and demand is very high during Arbaeen season.",
    },
  },
];

export const footer = {
  tagline: {
    ar: "رفقاؤك الموثوقون في كل رحلة مقدسة وسياحية",
    en: "Your trusted companions on every sacred and tourism journey",
  },
  address: {
    ar: "بيروت، لبنان — شارع الحمراء، مبنى الخليل، الطابق الثالث",
    en: "Beirut, Lebanon — Hamra Street, Khalil Building, 3rd Floor",
  },
  phone: "+961 71 234 567",
  copyright: {
    ar: "جميع الحقوق محفوظة © حملة الخليل ٢٠٢٥",
    en: "All Rights Reserved © Hamlet Al Khalil 2025",
  },
};
