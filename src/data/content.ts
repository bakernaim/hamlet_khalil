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
    badge: null,
    highlights: {
      ar: ["ضريح الإمام علي (ع)", "ضريح الإمام الحسين (ع)", "ضريح الإمامين الكاظمين (ع)"],
      en: ["Imam Ali Shrine", "Imam Hussain Shrine", "Kadhimain Shrine"],
    },
    info: {
      ar: "<h3>برنامج الزيارة</h3><p>رحلة روحانية لمدة سبعة أيام تشمل زيارة العتبات المقدسة في النجف الأشرف وكربلاء المقدسة والكاظمية، برفقة مرشد ديني متخصص.</p><ul><li>زيارة ضريح الإمام علي عليه السلام في النجف الأشرف</li><li>زيارة ضريحي الإمام الحسين وأبي الفضل العباس عليهما السلام</li><li>زيارة الإمامين الكاظمين عليهما السلام وجامع براثا</li></ul><p>تشمل الباقة تذاكر الطيران والإقامة الفندقية قرب الحرم والتنقلات والوجبات.</p>",
      en: "<h3>Ziyarat Itinerary</h3><p>A seven-day spiritual journey covering the holy shrines of Najaf, Karbala and Kadhimiya, accompanied by a specialist religious guide.</p><ul><li>Visit the shrine of Imam Ali (a.s.) in Holy Najaf</li><li>Visit the shrines of Imam Hussain and Abbas (a.s.) in Karbala</li><li>Visit the Kadhimain shrine and Buratha Mosque</li></ul><p>The package includes flights, hotel accommodation near the shrine, transfers and meals.</p>",
    },
    color: "from-[#1a2444] to-[#0a0f2c]",
  },
  {
    id: "iran",
    flag: "🇮🇷",
    name: { ar: "إيران — مشهد وقم المقدسة", en: "Iran — Mashhad & Holy Qom" },
    duration: { ar: "١٠ أيام", en: "10 Days" },
    badge: null,
    highlights: {
      ar: ["ضريح الإمام الرضا (ع)", "ضريح السيدة فاطمة المعصومة (ع)", "جامعة قم الدينية"],
      en: ["Imam Reza Shrine", "Lady Fatima Masumeh Shrine", "Qom Seminary"],
    },
    info: {
      ar: "<h3>برنامج الزيارة</h3><p>عشرة أيام بين مشهد المقدسة وقم المشرفة، مع برنامج زيارات يومي وجلسات دعاء.</p><ul><li>زيارة ضريح الإمام الرضا عليه السلام والمشاركة في صلاة الجماعة</li><li>زيارة السيدة فاطمة المعصومة عليها السلام في قم</li><li>زيارة مسجد جمكران المبارك</li></ul><p>الباقة شاملة الطيران والإقامة والتنقلات والوجبات والمرشد الديني.</p>",
      en: "<h3>Ziyarat Itinerary</h3><p>Ten days between Holy Mashhad and Qom, with a daily ziyarat program and supplication gatherings.</p><ul><li>Visit the shrine of Imam Reza (a.s.) and join congregational prayers</li><li>Visit Lady Fatima Masumeh (a.s.) in Qom</li><li>Visit the blessed Jamkaran Mosque</li></ul><p>The package covers flights, accommodation, transfers, meals and a religious guide.</p>",
    },
    color: "from-[#1a2444] to-[#0a0f2c]",
  },
  {
    id: "arbaeen",
    flag: "🇮🇶",
    name: { ar: "زيارة الأربعين — العراق", en: "Arbaeen Ziyarat — Iraq" },
    duration: { ar: "١٤ يوماً", en: "14 Days" },
    badge: { ar: "الأكثر طلباً 🔥", en: "Most Popular 🔥" },
    highlights: {
      ar: ["مسيرة الأربعين الكبرى", "كربلاء المقدسة", "النجف الأشرف", "تنظيم متكامل"],
      en: ["Grand Arbaeen Walk", "Holy Karbala", "Holy Najaf", "Full Organization"],
    },
    info: {
      ar: "<h3>مسيرة الأربعين</h3><p>أربعة عشر يوماً لإحياء زيارة الأربعين، من النجف الأشرف إلى كربلاء المقدسة سيراً على الأقدام مع خدمة لوجستية متكاملة على طول الطريق.</p><ul><li>المشي من النجف إلى كربلاء مع فريق مرافقة طبي ولوجستي</li><li>الاستراحة في مواكب مجهزة على الطريق</li><li>زيارة الأربعين يوم العشرين من صفر في كربلاء</li></ul><p>يُنصح بالتسجيل المبكر لمحدودية الأماكن في موسم الأربعين.</p>",
      en: "<h3>The Arbaeen Walk</h3><p>Fourteen days for the Arbaeen pilgrimage, walking from Holy Najaf to Holy Karbala with full logistical support along the route.</p><ul><li>Walk from Najaf to Karbala with a medical and logistics team</li><li>Rest stops at equipped mawakib along the way</li><li>Arbaeen ziyarat in Karbala on the 20th of Safar</li></ul><p>Early registration is recommended — places are limited during the Arbaeen season.</p>",
    },
    color: "from-[#2a1a00] to-[#1a0f00]",
  },
  {
    id: "syria",
    flag: "🇸🇾",
    name: { ar: "سوريا — السيدة زينب والسيدة رقية", en: "Syria — Sayyida Zaynab & Sayyida Ruqayya" },
    duration: { ar: "٥ أيام", en: "5 Days" },
    badge: null,
    highlights: {
      ar: ["ضريح السيدة زينب (ع)", "ضريح السيدة رقية (ع)", "جامع الأموي"],
      en: ["Sayyida Zaynab Shrine", "Sayyida Ruqayya Shrine", "Umayyad Mosque"],
    },
    info: {
      ar: "<h3>برنامج الزيارة</h3><p>خمسة أيام في الشام لزيارة مقامات أهل البيت عليهم السلام في دمشق ومحيطها.</p><ul><li>زيارة مقام السيدة زينب عليها السلام</li><li>زيارة مقام السيدة رقية عليها السلام</li><li>زيارة الجامع الأموي ومقام رأس الحسين عليه السلام</li></ul><p>الباقة تشمل النقل البري المكيف والإقامة الفندقية والوجبات.</p>",
      en: "<h3>Ziyarat Itinerary</h3><p>Five days in Syria visiting the shrines of Ahl al-Bayt (a.s.) in and around Damascus.</p><ul><li>Visit the shrine of Sayyida Zaynab (a.s.)</li><li>Visit the shrine of Sayyida Ruqayya (a.s.)</li><li>Visit the Umayyad Mosque and the Ras al-Hussain shrine</li></ul><p>The package includes air-conditioned land transport, hotel accommodation and meals.</p>",
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
    desc: { ar: "إسطنبول، كابادوكيا، طرابزون", en: "Istanbul, Cappadocia, Trabzon" },
    info: {
      ar: "<h3>برنامج الرحلة</h3><p>سبعة أيام بين إسطنبول وكابادوكيا وطرابزون، برنامج عائلي متكامل يجمع بين المدينة والطبيعة.</p><ul><li>جولات في معالم إسطنبول: آيا صوفيا، الجامع الأزرق، البوسفور</li><li>رحلة المناطيد الشهيرة في كابادوكيا</li><li>مرتفعات السلطان مراد وبحيرة أوزنجول في طرابزون</li></ul><p>الباقة تشمل الطيران والفنادق والإفطار والتنقلات مع سائق خاص.</p>",
      en: "<h3>Trip Program</h3><p>Seven days across Istanbul, Cappadocia and Trabzon — a family-friendly program mixing city and nature.</p><ul><li>Istanbul landmarks: Hagia Sophia, the Blue Mosque, the Bosphorus</li><li>The famous hot-air balloon ride in Cappadocia</li><li>Sultan Murad highlands and Uzungöl lake in Trabzon</li></ul><p>The package includes flights, hotels, breakfast and private-driver transfers.</p>",
    },
  },
  {
    id: "dubai",
    flag: "🇦🇪",
    name: { ar: "دبي", en: "Dubai" },
    duration: { ar: "٥ أيام", en: "5 Days" },
    desc: { ar: "برج خليفة، الصحراء، مول دبي", en: "Burj Khalifa, Desert Safari, Dubai Mall" },
    info: {
      ar: "<h3>برنامج الرحلة</h3><p>خمسة أيام في دبي بين ناطحات السحاب والصحراء والأسواق.</p><ul><li>صعود برج خليفة وزيارة دبي مول ونافورة دبي</li><li>سفاري صحراوي مع عشاء بدوي وعروض تراثية</li><li>جولة بحرية في دبي مارينا وزيارة سوق الذهب</li></ul><p>الباقة تشمل الطيران والإقامة الفندقية مع الإفطار والتنقلات.</p>",
      en: "<h3>Trip Program</h3><p>Five days in Dubai between skyscrapers, desert and souks.</p><ul><li>Burj Khalifa observation deck, Dubai Mall and the Dubai Fountain</li><li>Desert safari with a Bedouin dinner and heritage shows</li><li>Dubai Marina cruise and the Gold Souk</li></ul><p>The package includes flights, hotel with breakfast and transfers.</p>",
    },
  },
  {
    id: "georgia",
    flag: "🇬🇪",
    name: { ar: "جورجيا", en: "Georgia" },
    duration: { ar: "٦ أيام", en: "6 Days" },
    desc: { ar: "تبليسي، باتومي، الطبيعة الخلابة", en: "Tbilisi, Batumi, Stunning Nature" },
    info: {
      ar: "<h3>برنامج الرحلة</h3><p>ستة أيام في جورجيا بين العاصمة تبليسي وساحل باتومي وطبيعة القوقاز.</p><ul><li>جولة في المدينة القديمة في تبليسي وقلعة ناريكالا</li><li>رحلة إلى كازبيجي وجبال القوقاز</li><li>باتومي: الكورنيش والحديقة النباتية</li></ul><p>الباقة تشمل الطيران والفنادق والإفطار وسيارة مع سائق.</p>",
      en: "<h3>Trip Program</h3><p>Six days in Georgia between the capital Tbilisi, the Batumi coast and the Caucasus mountains.</p><ul><li>Old Tbilisi walking tour and Narikala Fortress</li><li>Day trip to Kazbegi and the Caucasus range</li><li>Batumi: the boulevard and the botanical garden</li></ul><p>The package includes flights, hotels, breakfast and a car with driver.</p>",
    },
  },
  {
    id: "egypt",
    flag: "🇪🇬",
    name: { ar: "مصر", en: "Egypt" },
    duration: { ar: "٨ أيام", en: "8 Days" },
    desc: { ar: "الأهرامات، الأقصر، شرم الشيخ", en: "Pyramids, Luxor, Sharm El Sheikh" },
    info: {
      ar: "<h3>برنامج الرحلة</h3><p>ثمانية أيام في مصر بين القاهرة التاريخية وآثار الأقصر وشواطئ شرم الشيخ.</p><ul><li>أهرامات الجيزة وأبو الهول والمتحف المصري</li><li>معابد الأقصر ووادي الملوك</li><li>الاستجمام والغوص في شرم الشيخ</li></ul><p>الباقة تشمل الطيران الداخلي والفنادق والإفطار وجولات مع مرشد سياحي.</p>",
      en: "<h3>Trip Program</h3><p>Eight days in Egypt between historic Cairo, the monuments of Luxor and the beaches of Sharm El Sheikh.</p><ul><li>The Giza Pyramids, the Sphinx and the Egyptian Museum</li><li>Luxor temples and the Valley of the Kings</li><li>Relaxation and diving in Sharm El Sheikh</li></ul><p>The package includes domestic flights, hotels, breakfast and guided tours.</p>",
    },
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
