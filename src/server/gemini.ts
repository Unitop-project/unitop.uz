import { GoogleGenAI } from "@google/genai";
import { universities, programs, admissionScores, DATA_YEAR } from "../data/demo";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_PROMPT = `Siz UniTop.uz platformasining rasmiy sun'iy intellekt konsultanti (UniTop AI)siz.
UniTop.uz — O'zbekistondagi barcha abituriyentlar, o'quvchilar va talabalar uchun ${DATA_YEAR}-yil o'tish ballari tahlili, universitet tanlash, testlarga tayyorgarlik va yo'l-yo'riq ko'rsatuvchi yetakchi platforma.

Vazifangiz:
Foydalanuvchilarning har qanday savollariga (universitetlar, yo'nalishlar, ${DATA_YEAR}-yilgi o'tish ballari, DTM/Bilimni baholash agentligi test tizimi, kontrakt va grant shartlari, fanlar majmuasi, o'qishga topshirish tartibi, xorijiy va xususiy OTMlar, imtiyozlar va maslahatlar) samimiy, aniq, to'liq, o'zbek tilida va professional tarzda javob berish.

UniTop.uz rasmiy aloqa ma'lumotlari:
- Telefon: +998 90 506 66 44
- Email: unitop.support@gmail.com
- Telegram kanal: @unitopuz
- Admin bilan bog'lanish: @unitopuz_support
- O'tish ballari yili: ${DATA_YEAR}-yil`;

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ʻʼ'`]/g, "'")
    .trim();
}

function hasAnyWord(text: string, words: string[]): boolean {
  return words.some((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(^|[^a-zA-Z0-9а-яА-ЯёЁo'g'])${escaped}([^a-zA-Z0-9а-яА-ЯёЁo'g']|$)`,
      "i",
    );
    return regex.test(text);
  });
}

function hasPhrase(text: string, phrase: string): boolean {
  return text.includes(phrase);
}

export async function handleAIChat(messages: ChatMessage[]): Promise<string> {
  const ai = getAIClient();

  // 1. If GEMINI_API_KEY is configured in Settings, call Google Gemini 3.8 Flash model
  if (ai) {
    try {
      const contents = messages.map((m) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      if (response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: unknown) {
      console.error("Gemini API call failed, switching to local knowledge engine:", err);
    }
  }

  // 2. Intelligent, context-aware local knowledge engine
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  const norm = normalize(lastUserMessage);

  // Greetings
  if (
    hasAnyWord(norm, [
      "salom",
      "assalom",
      "assalomu alaykum",
      "qaleysiz",
      "qalaysiz",
      "salom alaykum",
    ])
  ) {
    return `Assalomu alaykum! Men **UniTop AI** — Oliy ta'lim va abituriyentlar bo'yicha sun'iy intellekt maslahatchisiman. 🎓\n\nSizga quyidagi masalalarda to'liq yordam bera olaman:\n- **${DATA_YEAR}-yil o'tish ballari** (grant va to'lov-shartnoma mezonlari)\n- **Universitetlar va yo'nalishlar** tahlili (TATU, TDIU, O'zMU, ToshDavYUU, SamDU va boshqalar)\n- **DTM test tizimi:** 189 ball mezonlari, fanlar majmuasi va imtiyozlar\n- **To'plagan ballingiz** bo'yicha kirish imkoniyatlarini hisoblash\n\nQaysi universitet yoki soha sizni qiziqtirmoqda?`;
  }

  // Contact / Admin / Phone / Telegram questions
  if (
    hasAnyWord(norm, [
      "aloqa",
      "telefon",
      "admin",
      "telegram",
      "nomer",
      "kontakt",
      "bog'lanish",
      "boglanish",
      "support",
    ]) ||
    hasPhrase(norm, "admin bilan") ||
    hasPhrase(norm, "kimga murojaat")
  ) {
    return `**UniTop.uz bilan bog'lanish va qo'llab-quvvatlash:**\n\n- 📞 **Telefon:** [+998 90 506 66 44](tel:+998905066644)\n- ✉️ **Elektron pochta:** [unitop.support@gmail.com](mailto:unitop.support@gmail.com)\n- 📢 **Rasmiy Telegram kanalimiz:** [@unitopuz](https://t.me/unitopuz)\n- 👤 **Admin / Qo'llab-quvvatlash:** [@unitopuz_support](https://t.me/unitopuz_support)\n\nHar qanday taklif, hamkorlik yoki texnik yordam bo'yicha murojaat qilishingiz mumkin!`;
  }

  // Score evaluation (e.g. "140 ball bilan qayerga kirsa bo'ladi", "165 ball oldim", "110 ball")
  const scoreExtract = norm.match(/(\d{2,3}(?:\.\d+)?)\s*(?:ball|bal)?/);
  if (
    scoreExtract &&
    (norm.includes("ball") ||
      norm.includes("bal") ||
      norm.includes("kirsam") ||
      norm.includes("yetadimi") ||
      norm.includes("kirish"))
  ) {
    const userScore = parseFloat(scoreExtract[1]);
    if (userScore >= 50 && userScore <= 189) {
      // Find programs around this score
      const grantMatches = admissionScores.filter(
        (a) => a.admission_type === "grant" && a.score <= userScore,
      );
      const contractMatches = admissionScores.filter(
        (a) => a.admission_type === "kontrakt" && a.score <= userScore,
      );

      let response = `**${userScore} ball bilan ${DATA_YEAR}-yil qabul imkoniyatlari tahlili:**\n\n`;

      if (userScore >= 165) {
        response += `🌟 **Juda yuqori ball!** Siz ko'plab nufuzli universitetlarning **Davlat granti**ga kirish uchun yuqori imkoniyatga egasiz.\n\n`;
        response += `**Tavsiya etiladigan yo'nalishlar (Grant):**\n`;
        response += `- **TATU** (Axborot xavfsizligi, Kompyuter injiniringi: ~165-172 ball)\n`;
        response += `- **O'zMU** (Iqtisodiyot, Matematika, Fundamental fanlar: ~155-168 ball)\n`;
        response += `- **TDIU** (Moliya, Buxgalteriya, Xalqaro iqtisodiyot: ~160-170 ball)\n`;
        response += `- **SamDU / BuxDU** (Barcha yo'nalishlar grant asosida kafolatlangan)\n`;
      } else if (userScore >= 130) {
        response += `👍 **Yaxshi natija!** Siz OTMlarning ko'pchiligiga **to'lov-shartnoma (kontrakt)** asosida, ba'zi viloyat OTMlariga esa **grant**ga kira olasiz:\n\n`;
        response += `**Kirish ehtimoli yuqori yo'nalishlar:**\n`;
        response += `- **TATU** (Dasturiy injiniring, AKT — kontrakt: ~125-142 ball)\n`;
        response += `- **TDIU** (Iqtisodiyot, Menejment — kontrakt: ~120-138 ball)\n`;
        response += `- **SamDU / BuxDU** (Filologiya, Tarix, Boshlang'ich ta'lim — grant va kontrakt)\n`;
        response += `- **Turin Politexnika / Inha** (Kirish imtihonlari va kontrakt asosida)\n`;
      } else if (userScore >= 100) {
        response += `📈 **O'rtacha ball.** Poytaxt OTMlarining ayrim yo'nalishlari hamda viloyat davlat universitetlariga kontrakt asosida o'tishingiz mumkin:\n\n`;
        response += `- **Viloyat OTMlari:** SamDU, BuxDU, AndDU, FarDU (Tabiiy fanlar, Muhandislik, Pedagogika)\n`;
        response += `- **Sirtqi va kechki ta'lim shakllari** (o'tish ballari odatda 90-120 ball atrofida bo'ladi)\n`;
        response += `- Xususiy va xalqaro universitetlar\n`;
      } else {
        response += `⚠️ **56.7 balldan yuqori**, ammo davlat OTMlari kunduzgi ta'limiga o'tish bali yetmasligi mumkin.\n`;
        response += `Siz uchun variantlar:\n- Sirtqi / masofaviy ta'lim shakllari\n- Tabaqalashtirilgan shartnoma (super-kontrakt)\n- Xususiy va nufuzli akkreditatsiyalangan universitetlar\n`;
      }

      response += `\n💡 Aniqroq hisob-kitob qilish uchun saytimizning **[Ballimni tekshirish kalkulyatori](/calculator)** bo'limiga kiring va fanlar bo'yicha to'plagan ballaringizni kiriting!`;
      return response;
    }
  }

  // Specific University: TATU
  if (
    hasAnyWord(norm, ["tatu", "tuit", "xorazmiy"]) ||
    hasPhrase(norm, "axborot texnologiyalari universiteti")
  ) {
    return (
      `**TATU — Muhammad al-Xorazmiy nomidagi Toshkent Axborot Texnologiyalari Universiteti** 💻\n\n` +
      `- **Hudud:** Toshkent shahri (Yunusobod)\n` +
      `- **Asosiy yo'nalishlar:** Dasturiy injiniring, Kompyuter injiniringi, Axborot xavfsizligi, Sun'iy intellekt, Telekommunikatsiya.\n` +
      `- **Test fanlari:** Matematika (3.1 ball) va Fizika (2.1 ball) + 3 ta majburiy fan.\n` +
      `- **${DATA_YEAR}-yil o'tish ballari ko'rsatkichlari:**\n` +
      `  * Davlat granti: ~165.0 - 176.0 ball\n` +
      `  * To'lov-shartnoma: ~130.0 - 148.0 ball\n` +
      `- **Imtiyozlar:** B2/C1 darajadagi chet tili (IELTS 5.5+) sertifikatlari, IT olimpiada g'oliblariga imtiyozlar mavjud.\n\n` +
      `Batafsil ma'lumotni saytimizning **[OTMlar ro'yxati](/universities)** sahifasidan ko'rishingiz mumkin.`
    );
  }

  // Specific University: TDIU (Narxoz)
  if (
    hasAnyWord(norm, ["tdiu", "narxoz", "tsue"]) ||
    hasPhrase(norm, "iqtisodiyot universiteti") ||
    hasPhrase(norm, "toshkent davlat iqtisodiyot")
  ) {
    return (
      `**TDIU — Toshkent Davlat Iqtisodiyot Universiteti ("Narxoz")** 📊\n\n` +
      `- **Hudud:** Toshkent shahri (Islom Karimov ko'chasi)\n` +
      `- **Asosiy yo'nalishlar:** Iqtisodiyot, Moliya va moliyaviy texnologiyalar, Buxgalteriya hisobi, Bank ishi, Jahon iqtisodiyoti, Menejment.\n` +
      `- **Test fanlari:** Matematika (3.1 ball) va Chet tili / Geografiya (2.1 ball) + majburiy fanlar.\n` +
      `- **${DATA_YEAR}-yil o'tish ballari:**\n` +
      `  * Davlat granti: ~160.0 - 174.0 ball\n` +
      `  * To'lov-shartnoma: ~128.0 - 145.0 ball\n` +
      `- **Eslatma:** Ingliz tili IELTS 5.5+ bo'lgan abituriyentlarga chet tili fanidan maksimal 100% ball beriladi.\n\n` +
      `Saytimizdagi **[Universitetlar](/universities)** bo'limida TDIU yo'nalishlarini solishtirishingiz mumkin.`
    );
  }

  // Specific University: O'zMU (Milliy universitet)
  if (
    hasAnyWord(norm, ["ozmu", "o'zmu", "nuu"]) ||
    hasPhrase(norm, "milliy universitet") ||
    hasPhrase(norm, "mirzo ulug'bek nomidagi")
  ) {
    return (
      `**O'zMU — Mirzo Ulug'bek nomidagi O'zbekiston Milliy Universiteti** 🏛️\n\n` +
      `- **Hudud:** Toshkent shahri (Talabalar shaharchasi)\n` +
      `- **Maqomi:** O'zbekistonning eng qadimiy va eng yirik fundamental oliy ta'lim muassasasi.\n` +
      `- **Asosiy fakultetlar:** Matematika, Amaliy matematika, Fizika, Kimyo, Biologiya, Tarix, Falsafa, Xorijiy filologiya, Psixologiya, Jurnalistika.\n` +
      `- **${DATA_YEAR}-yil o'tish ballari:**\n` +
      `  * Davlat granti: ~145.0 - 172.0 ball (Iqtisodiyot va yurisprudensiya yo'nalishlarida ~170+ ball)\n` +
      `  * To'lov-shartnoma: ~115.0 - 138.0 ball\n` +
      `- Fanlar kombinatsiyasi yo'nalishga qarab: Matematika-Fizika, Biologiya-Kimyo yoki Ona tili-Tarix bo'ladi.`
    );
  }

  // Specific University: Yuridik (TDYU)
  if (
    hasAnyWord(norm, ["tdyu", "tdyuu", "tsul", "yuridik", "yurist"]) ||
    hasPhrase(norm, "yuridik universiteti")
  ) {
    return (
      `**TDYU — Toshkent Davlat Yuridik Universiteti** ⚖️\n\n` +
      `- **Hudud:** Toshkent shahri (Sayilgoh ko'chasi)\n` +
      `- **Yo'nalishlar:** Yurisprudensiya (Davlat-huquqiy faoliyat, Fuqarolik va biznes huquqi, Jinoiy-huquqiy faoliyat, Xalqaro huquq).\n` +
      `- **Test fanlari:** 1-fan: Tarix (3.1 ball), 2-fan: Chet tili (2.1 ball) + 3 ta majburiy fan.\n` +
      `- **O'tish ballari:** Respublikadagi eng yuqori balli OTMlardan biri:\n` +
      `  * Davlat granti: ~175.0 - 186.0 ball\n` +
      `  * To'lov-shartnoma: ~150.0 - 168.0 ball\n` +
      `- **Maslahat:** Tarix va Ingliz tili (IELTS 6.0+) dan kuchli tayyorgarlik talab etiladi.`
    );
  }

  // Specific University: SamDU
  if (hasAnyWord(norm, ["samdu"]) || hasPhrase(norm, "samarqand davlat")) {
    return (
      `**SamDU — Sharof Rashidov nomidagi Samarqand Davlat Universiteti** 🕌\n\n` +
      `- **Hudud:** Samarqand shahri (Universitet xiyoboni)\n` +
      `- **Yo'nalishlar:** Aniq fanlar, Tabiiy fanlar, Filologiya, Tarix, Huquqshunoslik, Muhandislik fizikasi, Psixologiya.\n` +
      `- **${DATA_YEAR}-yil o'tish ballari:**\n` +
      `  * Davlat granti: ~135.0 - 165.0 ball\n` +
      `  * To'lov-shartnoma: ~105.0 - 130.0 ball\n` +
      `- Samarqand va qo'shni viloyat abituriyentlari uchun eng ommabop klassik universitet.`
    );
  }

  // Specific University: BuxDU
  if (hasAnyWord(norm, ["buxdu"]) || hasPhrase(norm, "buxoro davlat")) {
    return (
      `**BuxDU — Buxoro Davlat Universiteti** 📚\n\n` +
      `- **Hudud:** Buxoro shahri\n` +
      `- **Yo'nalishlar:** Pedagogika, Boshlang'ich ta'lim, Kimyo, Biologiya, Tarix, Ingliz tili, Iqtisodiyot.\n` +
      `- **O'tish ballari:**\n` +
      `  * Davlat granti: ~130.0 - 158.0 ball\n` +
      `  * To'lov-shartnoma: ~98.0 - 125.0 ball\n` +
      `- Buxoro viloyatidagi yetakchi ilmiy-tadqiqot va ta'lim markazi.`
    );
  }

  // Specific University: Tibbiyot / ADTI / TMA
  if (
    hasAnyWord(norm, [
      "tibbiyot",
      "adti",
      "tma",
      "vrach",
      "davolash",
      "pediatriya",
      "stomatologiya",
      "doktor",
    ]) ||
    hasPhrase(norm, "tibbiyot akademiyasi") ||
    hasPhrase(norm, "tibbiyot instituti")
  ) {
    return (
      `**Tibbiyot OTMlari (TMA, ADTI, SamDTU va b.) haqida ma'lumot:** 🩺\n\n` +
      `- **Asosiy OTMlar:** Toshkent Tibbiyot Akademiyasi (TMA), Toshkent Pediatriya Tibbiyot Instituti (SAMPI), Toshkent Davlat Stomatologiya Instituti (TDSI), Andijon Davlat Tibbiyot Instituti (ADTI), Samarqand Davlat Tibbiyot Universiteti.\n` +
      `- **Asosiy yo'nalishlar:** Davolash ishi, Pediatriya, Stomatologiya, Farmatsiya, Biotibbiyot.\n` +
      `- **Test fanlari:**\n` +
      `  * 1-fan: Biologiya (30 ta savol × 3.1 ball = 93 ball)\n` +
      `  * 2-fan: Kimyo (30 ta savol × 2.1 ball = 63 ball)\n` +
      `  * + 3 ta majburiy fan (Ona tili, Matematika, Tarix = 33 ball)\n` +
      `- **O'tish ballari:** Davlat granti odatda **170.0 - 184.0 ball**, kontrakt esa **140.0 - 165.0 ball** oralig'ida shakllanadi.`
    );
  }

  // Specific University: Inha (IUT)
  if (hasAnyWord(norm, ["inha", "iut"]) || hasPhrase(norm, "inha universiteti")) {
    return (
      `**Inha University in Tashkent (IUT)** 🎓\n\n` +
      `- **Hudud:** Toshkent shahri (Ziyolilar ko'chasi)\n` +
      `- **Yo'nalishlar:** Computer Science and Engineering (CSE), Business and Information Technology (SBL).\n` +
      `- **Ta'lim tili:** To'liq ingliz tili (Janubiy Koreya Inha universiteti diplomi beriladi).\n` +
      `- **Kirish talablari:** IELTS kamida 5.5 (yoki TOEFL) + Universitetning o'z Matematika va Fizika kirish imtihonlari.\n` +
      `- **Grantlar:** Eng yuqori ball to'plagan talabalarga to'liq homiylik grantlari ajratiladi.`
    );
  }

  // Specific University: Turin Politexnika (TTPU)
  if (hasAnyWord(norm, ["turin", "ttpu"]) || hasPhrase(norm, "turin politexnika")) {
    return (
      `**TTPU — Toshkent shahridagi Turin Politexnika Universiteti** 🏎️\n\n` +
      `- **Hudud:** Toshkent shahri (Olmazor tumani)\n` +
      `- **Yo'nalishlar:** Mashinasozlik muhandisligi, Dasturiy ta'minot muhandisligi, Axborot texnologiyalari, Qurilish va arxitektura.\n` +
      `- **Diplom:** Italiyaning Politècnico di Torino xalqaro diplomi.\n` +
      `- **Talablar:** Ingliz tili (IELTS 5.5+) hamda matematika/fizika imtihonlari asosida qabul qilinadi.`
    );
  }

  // DTM Test rules / Scoring / Questions count / 189 points
  if (
    hasAnyWord(norm, ["189", "mezon", "mezonlari", "qoidalar", "nechtadan", "ballar"]) ||
    hasPhrase(norm, "necha ball") ||
    hasPhrase(norm, "maksimal ball") ||
    hasPhrase(norm, "ball qanday hisoblanadi") ||
    hasPhrase(norm, "test qoidalari") ||
    hasPhrase(norm, "fanlar qanday")
  ) {
    return (
      `**DTM (Bilimni baholash agentligi) Test Tizimi va Ball Hisoblash:** 📝\n\n` +
      `Test sinovlarida jami **90 ta savol** beriladi va maksimal ball **189.0 ball**ni tashkil etadi:\n\n` +
      `1️⃣ **3 ta majburiy fan (jami 30 ta savol = 33 ball):**\n` +
      `- Ona tili — 10 ta savol × 1.1 ball = **11 ball**\n` +
      `- Matematika — 10 ta savol × 1.1 ball = **11 ball**\n` +
      `- O'zbekiston tarixi — 10 ta savol × 1.1 ball = **11 ball**\n\n` +
      `2️⃣ **2 ta mutaxassislik fani (jami 60 ta savol = 156 ball):**\n` +
      `- 1-asosiy fan — 30 ta savol × 3.1 ball = **93 ball**\n` +
      `- 2-asosiy fan — 30 ta savol × 2.1 ball = **63 ball**\n\n` +
      `⏱️ **Umumiy vaqt:** Test topshirish uchun 3 soat (180 daqiqa) vaqt ajratiladi.\n` +
      `💡 Test sinovlariga tayyorlanish uchun saytimizning **[Testlar](/tests)** bo'limidagi namunaviy testlarni yechib ko'rishingiz mumkin!`
    );
  }

  // Privileges / IELTS / CEFR / Olympiad / Military
  if (
    hasAnyWord(norm, [
      "imtiyoz",
      "imtiyozlar",
      "ielts",
      "cefr",
      "sertifikat",
      "olimpiada",
      "harbiy",
      "tavsiyanoma",
      "b2",
      "c1",
    ]) ||
    hasPhrase(norm, "til sertifikati") ||
    hasPhrase(norm, "ingliz tili sertifikat")
  ) {
    return (
      `**Oliy ta'limga kirishdagi asosiy imtiyozlar va sertifikatlar:** 🎖️\n\n` +
      `1. **Chet tili sertifikati (IELTS, CEFR, TOEFL):**\n` +
      `   - B2 daraja (IELTS 5.5 - 6.0+) yoki C1 darajaga ega abituriyentlarga chet tili fanidan imtihonsiz **maksimal 100% ball** (1-fan bo'lsa 93 ball, 2-fan bo'lsa 63 ball) beriladi.\n\n` +
      `2. **Olimpiada g'oliblari:**\n` +
      `   - Xalqaro va Respublika asosiy fan olimpiadalari 1-, 2-, 3-o'rin sohiblari tegishli yo'nalishlarga **davlat granti asosida imtihonsiz** qabul qilinadi.\n\n` +
      `3. **Harbiy imtiyozlar:**\n` +
      `   - Muddatli harbiy xizmatni o'tab, qo'mondonlik tavsiyanomasiga ega bo'lganlarga to'plagan ballining **50 foizi miqdorida qo'shimcha ball** beriladi yoki alohida kvotada qatnashadilar.\n\n` +
      `4. **Ijtimoiy grantlar:**\n` +
      `   - Ehtiyojmand oilalar qizlari, nogironligi bo'lgan shaxslar (2% kvota) va Mehribonlik uyi tarbiyalanuvchilari uchun maxsus davlat grantlari ajratilgan.`
    );
  }

  // Super-contract / Contract tuition
  if (
    hasAnyWord(norm, ["super", "kontrakt", "shartnoma", "tabaqalashtirilgan", "to'lov"]) ||
    hasPhrase(norm, "super kontrakt") ||
    hasPhrase(norm, "kontrakt narxi")
  ) {
    return (
      `**To'lov-shartnoma va Super-kontrakt (Tabaqalashtirilgan kontrakt):** 💰\n\n` +
      `1. **Oddiy kontrakt:**\n` +
      `   - O'tish baliga erishgan talabalar uchun tasdiqlangan yillik bazaviy kontrakt summasi to'lanadi (stipendiyali yoki stipendiyasiz shaklda).\n\n` +
      `2. **Super-kontrakt shartlari:**\n` +
      `   - Kirish balliga **4.05 ballgacha** yetmagan abituriyentlar uchun tabaqalashtirilgan stavka qo'llaniladi:\n` +
      `     * 1.05 ballgacha: 1.5 baravar\n` +
      `     * 1.06 dan 2.05 ballgacha: 2.0 baravar\n` +
      `     * 2.06 dan 3.05 ballgacha: 2.5 baravar\n` +
      `     * 3.06 dan 4.05 ballgacha: 3.0 baravar\n` +
      `   - 4.05 balldan ko'p yetmagan, ammo **56.7 balldan yuqori** to'plaganlar uchun yo'nalishiga qarab 8 baravardan 25 baravargacha oshirilgan to'lov belgilanadi.\n\n` +
      `Batafsil ma'lumotlarni o'quv yili boshlanishida har bir OTM qabul komissiyasidan olish mumkin.`
    );
  }

  // Transfer / Perevod
  if (
    hasAnyWord(norm, ["perevod", "ko'chirish", "transfer"]) ||
    hasPhrase(norm, "o'qishni ko'chirish")
  ) {
    return (
      `**O'qishni ko'chirish (Perevod) qoidalari:** 🔄\n\n` +
      `1. **Davlat OTMdan boshqa davlat OTMiga:**\n` +
      `   - Faqat uzrli sabablar bilan (oilaviy sharoit, turmush qurish munosabati bilan boshqa hududga ko'chish yoki davlat xizmatchisi bo'lgan ota-ona ish joyining o'zgarishi) ruxsat etiladi.\n\n` +
      `2. **Xorijiy yoki xususiy OTMlardan davlat OTMlariga:**\n` +
      `   - Har yili yoz oylarida (15-iyuldan 5-avgustgacha) transfer.edu.uz portali orqali ariza topshiriladi.\n` +
      `   - Bilimni baholash agentligi (DTM) tomonidan maxsus test sinovlari o'tkaziladi va belgilangan o'tish balini to'plaganlar qabul qilinadi.`
    );
  }

  // Registration, Dates, Deadlines (my.uzbmb.uz)
  if (
    hasAnyWord(norm, ["hujjat", "topshirish", "muddat", "qachon", "sana", "ro'yxatdan", "ariza"]) ||
    hasPhrase(norm, "qachon boshlanadi") ||
    hasPhrase(norm, "qanday topshiriladi")
  ) {
    return (
      `**OTMlarga hujjat topshirish va qabul jarayoni tartibi:** 📅\n\n` +
      `1. **Onlayn ro'yxatdan o'tish:**\n` +
      `   - Abituriyentlar har yili **my.uzbmb.uz** yoki **my.gov.uz** portallari orqali onlayn ro'yxatdan o'tishadi (odatda 20-iyundan 20-iyulgacha).\n\n` +
      `2. **Yo'nalishlar tanlovi:**\n` +
      `   - Test topshiriladigan fanlar majmuasi bir xil bo'lgan **5 tagacha davlat OTMi ta'lim yo'nalishini** tanlash mumkin.\n\n` +
      `3. **Test sinovlari o'tkazilishi:**\n` +
      `   - Iyul-avgust oylarida katta pavilonlarda va sport majmualarida o'tkaziladi.\n\n` +
      `4. **Natijalar:**\n` +
      `   - Test natijalari (to'plangan ball) ertasi kuni e'lon qilinadi, yakuniy talabalikka tavsiya etilganlik mandat natijalari esa barcha testlar tugagach chiqadi.`
    );
  }

  // General fallback - intelligent guidance tailored to what user might need
  return (
    `Savolingiz uchun tashakkur! Men **UniTop AI** maslahatchisiman.\n\n` +
    `Sizga aniqroq yordam berishim uchun quyidagilardan birini aniqlashtirib bera olasizmi?\n` +
    `- Qaysi aniq **universitet** (TATU, TDIU, O'zMU, ToshDavYUU, SamDU, Tibbiyot va b.) haqida ma'lumot kerak?\n` +
    `- Qaysi soha yoki **fanlar kombinatsiyasi** (Matematika-Fizika, Biologiya-Kimyo, Tarix-Chet tili) bo'yicha tayyorlanyapsiz?\n` +
    `- Necha ball to'pladingiz yoki maqsad qilyapsiz? (Men sizga mos OTMlarni tahlil qilib beraman)\n\n` +
    `Shuningdek saytimizning **[Ball kalkulyatori](/calculator)** va **[Testlar](/tests)** bo'limlaridan foydalanishingiz yoki adminimiz bilan bog'lanishingiz mumkin: **[@unitopuz_support](https://t.me/unitopuz_support)**.`
  );
}
