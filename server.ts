import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { calculateNatalData } from "./src/services/astrologyService.js";
import { mapNatalDataToInterpretations } from "./src/services/interpretationService.js";
import { getDailyHoroscope } from "./src/services/horoscopeService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API routes
  app.post("/api/astrology", async (req, res) => {
    try {
      const { date, time, lat, lng, partner, relationshipPartner } = req.body;
      
      if (!date || !time || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: "Missing required fields: date, time, lat, lng" });
      }

      const natalData = await calculateNatalData(date, time, lat, lng);
      const interpretations = await mapNatalDataToInterpretations(natalData);
      
      const sun = natalData.planets.find(p => p.name === 'Sun');
      const horoscope = sun ? await getDailyHoroscope(sun.longitude) : null;
      
      let synastry = null;
      if (partner) {
        const pData = await calculateNatalData(partner.date, partner.time, partner.lat, partner.lng);
        synastry = calculateSynastry(natalData, pData);
      }

      let relationship = null;
      if (relationshipPartner) {
        let pData;
        if (relationshipPartner.date) {
          pData = await calculateNatalData(relationshipPartner.date, relationshipPartner.time || "12:00", relationshipPartner.lat || 0, relationshipPartner.lng || 0);
        } else if (relationshipPartner.sign) {
          // Mock natal data for a specific sign (approximate)
          const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
          const signIndex = signs.indexOf(relationshipPartner.sign);
          const approxLong = signIndex * 30 + 15;
          pData = {
            planets: [
              { name: 'Sun', sign: relationshipPartner.sign, longitude: approxLong },
              { name: 'Moon', sign: relationshipPartner.sign, longitude: approxLong }, // Simplified
              { name: 'Mercury', sign: relationshipPartner.sign, longitude: approxLong },
              { name: 'Venus', sign: relationshipPartner.sign, longitude: approxLong },
              { name: 'Mars', sign: relationshipPartner.sign, longitude: approxLong }
            ]
          };
        }

        if (pData) {
          relationship = calculateRelationshipAnalysis(natalData, pData);
        }
      }

      res.json({
        ...natalData,
        interpretations,
        synastry,
        horoscope,
        relationship
      });
    } catch (error) {
      console.error("Astrology calculation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  function calculateSynastry(u1Data: any, u2Data: any) {
    const getElement = (sign: string) => {
      const fire = ['Aries', 'Leo', 'Sagittarius'];
      const earth = ['Taurus', 'Virgo', 'Capricorn'];
      const air = ['Gemini', 'Libra', 'Aquarius'];
      const water = ['Cancer', 'Scorpio', 'Pisces'];
      if (fire.includes(sign)) return 'fire';
      if (earth.includes(sign)) return 'earth';
      if (air.includes(sign)) return 'air';
      return 'water';
    };

    const u1Planets = u1Data.planets;
    const u2Planets = u2Data.planets;

    const getPlanet = (planets: any[], name: string) => planets.find(p => p.name === name);

    const u1Sun = getPlanet(u1Planets, 'Sun');
    const u2Sun = getPlanet(u2Planets, 'Sun');
    const u1Moon = getPlanet(u1Planets, 'Moon');
    const u2Moon = getPlanet(u2Planets, 'Moon');
    const u1Venus = getPlanet(u1Planets, 'Venus');
    const u2Venus = getPlanet(u2Planets, 'Venus');
    const u1Mars = getPlanet(u1Planets, 'Mars');
    const u2Mars = getPlanet(u2Planets, 'Mars');
    const u1Mercury = getPlanet(u1Planets, 'Mercury');
    const u2Mercury = getPlanet(u2Planets, 'Mercury');

    let score = 0;
    const details = {
      sex: { 
        score: 10, 
        text: 'Ваша сексуальная совместимость требует внимания. Вам нужно время, чтобы изучить желания друг друга и найти общие точки соприкосновения.',
        tips: ['Больше говорите о своих фантазиях', 'Не бойтесь экспериментировать', 'Уделяйте время прелюдии', 'Изучайте эрогенные зоны партнера']
      },
      daily: { 
        score: 10, 
        text: 'В быту вы достаточно разные. Это может стать поводом для конфликтов, если не научиться уступать.',
        tips: ['Четко распределите домашние обязанности', 'Уважайте личное пространство друг друга', 'Создайте общие семейные традиции', 'Ищите компромиссы в мелочах']
      },
      emotions: { 
        score: 10, 
        text: 'Эмоциональный фон нестабилен. Глубокие чувства могут потребовать серьезной работы и терпения.',
        tips: ['Практикуйте активное слушание', 'Делитесь своими переживаниями чаще', 'Проявляйте нежность без повода', 'Не копите обиды']
      },
      intellect: { 
        score: 10, 
        text: 'Ваше общение требует настройки. Иногда вы говорите на разных языках и не понимаете мотивов друг друга.',
        tips: ['Найдите общее хобби или тему для изучения', 'Избегайте менторского тона в спорах', 'Больше читайте и обсуждайте книги', 'Учитесь слушать, а не только говорить']
      },
      passion: { 
        score: 10, 
        text: 'Страсть в ваших отношениях — это то, над чем стоит работать обоим, чтобы искра не угасла.',
        tips: ['Устраивайте спонтанные свидания', 'Вспоминайте моменты первого знакомства', 'Поддерживайте огонь мелкими знаками внимания', 'Флиртуйте друг с другом']
      }
    };

    // Passion & Sex (Sun-Sun, Venus-Mars)
    if (u1Sun && u2Sun) {
      if (getElement(u1Sun.sign) === getElement(u2Sun.sign)) {
        score += 20;
        details.passion.score += 70;
        details.passion.text = 'Ваши жизненные цели и темпераменты совпадают, что создает мощный фундамент для долгой страсти.';
        details.passion.tips = ['Направляйте общую энергию в творческие проекты', 'Ставьте амбициозные совместные цели'];
      } else if (u1Sun.sign === u2Sun.sign) {
        score += 25;
        details.passion.score += 80;
        details.passion.text = 'Вы буквально смотрите в одном направлении. Ваша страсть основана на глубоком родстве душ.';
      }
    }
    
    if (u1Venus && u2Mars && u1Mars && u2Venus) {
      if (getElement(u1Venus.sign) === getElement(u2Mars.sign) && getElement(u1Mars.sign) === getElement(u2Venus.sign)) {
        score += 25;
        details.sex.score += 85;
        details.sex.text = 'Невероятное физическое притяжение! Между вами существует мощная химия, которую невозможно игнорировать.';
        details.sex.tips = ['Доверяйте своим инстинктам', 'Позвольте страсти вести вас', 'Сохраняйте элемент игры в спальне'];
      } else if (getElement(u1Venus.sign) === getElement(u2Mars.sign) || getElement(u1Mars.sign) === getElement(u2Venus.sign)) {
        score += 15;
        details.sex.score += 50;
        details.sex.text = 'Хорошая сексуальная совместимость. Вы умеете доставлять друг другу удовольствие.';
      }
    }

    // Emotions (Moon-Moon)
    if (u1Moon && u2Moon) {
      if (getElement(u1Moon.sign) === getElement(u2Moon.sign)) {
        score += 20;
        details.emotions.score += 75;
        details.emotions.text = 'Глубокая эмоциональная связь. Вы чувствуете настроение друг друга без лишних слов.';
        details.emotions.tips = ['Доверяйте своей интуиции в отношении партнера', 'Создайте безопасное пространство для слез и радости'];
      } else if (u1Moon.sign === u2Moon.sign) {
        score += 25;
        details.emotions.score += 85;
        details.emotions.text = 'Абсолютное эмоциональное слияние. Ваши души резонируют на одной частоте.';
      }
    }

    // Daily (Moon-Sun, Sun-Moon)
    if (u1Moon && u2Sun && u1Sun && u2Moon) {
      if (getElement(u1Moon.sign) === getElement(u2Sun.sign) || getElement(u1Sun.sign) === getElement(u2Moon.sign)) {
        score += 15;
        details.daily.score += 60;
        details.daily.text = 'Отличное понимание в быту. У вас похожие представления о комфорте и домашнем уюте.';
        details.daily.tips = ['Обустраивайте дом вместе', 'Наслаждайтесь простыми радостями совместной жизни'];
      }
    }

    // Intellect (Mercury-Mercury)
    if (u1Mercury && u2Mercury) {
      if (getElement(u1Mercury.sign) === getElement(u2Mercury.sign)) {
        score += 15;
        details.intellect.score += 70;
        details.intellect.text = 'Вам очень легко общаться. Вы понимаете мысли друг друга с полуслова и всегда находите темы для бесед.';
        details.intellect.tips = ['Занимайтесь интеллектуальными играми', 'Обсуждайте сложные философские темы', 'Пишите друг другу длинные письма'];
      } else if (u1Mercury.sign === u2Mercury.sign) {
        score += 20;
        details.intellect.score += 85;
        details.intellect.text = 'Идеальное интеллектуальное взаимопонимание. Вы мыслите одними категориями.';
      }
    }

    return {
      score: Math.min(score, 100),
      details
    };
  }

  function calculateRelationshipAnalysis(u1Data: any, u2Data: any) {
    const u1Sun = u1Data.planets.find((p: any) => p.name === 'Sun');
    const u2Sun = u2Data.planets.find((p: any) => p.name === 'Sun');
    
    if (!u1Sun || !u2Sun) return null;

    const getElement = (sign: string) => {
      const fire = ['Aries', 'Leo', 'Sagittarius'];
      const earth = ['Taurus', 'Virgo', 'Capricorn'];
      const air = ['Gemini', 'Libra', 'Aquarius'];
      const water = ['Cancer', 'Scorpio', 'Pisces'];
      if (fire.includes(sign)) return 'Огонь';
      if (earth.includes(sign)) return 'Земля';
      if (air.includes(sign)) return 'Воздух';
      return 'Вода';
    };

    const el1 = getElement(u1Sun.sign);
    const el2 = getElement(u2Sun.sign);

    let loveText = "";
    let generalText = "";
    let score = 50;

    if (el1 === el2) {
      score = 85;
      loveText = `Ваши знаки принадлежат одной стихии (${el1}). В любви это дает невероятное понимание и общность интересов. Вы буквально чувствуете друг друга.`;
      generalText = `В общих делах и дружбе вы — идеальная команда. Ваши методы работы и взгляды на жизнь совпадают, что делает сотрудничество легким и продуктивным.`;
    } else if ((el1 === 'Огонь' && el2 === 'Воздух') || (el1 === 'Воздух' && el2 === 'Огонь') || (el1 === 'Земля' && el2 === 'Вода') || (el1 === 'Вода' && el2 === 'Земля')) {
      score = 75;
      loveText = `Ваши стихии (${el1} и ${el2}) гармонично дополняют друг друга. Воздух раздувает пламя Огня, а Вода питает Землю. В любви это создает устойчивый и вдохновляющий союз.`;
      generalText = `Вы хорошо работаете вместе. Один подает идеи, другой помогает их реализовать. Это продуктивное партнерство, основанное на взаимном уважении.`;
    } else {
      score = 40;
      loveText = `Ваши стихии (${el1} и ${el2}) находятся в некотором напряжении. Огонь может испарить Воду, а Земля — засыпать Огонь. В любви это требует работы над пониманием различий друг друга.`;
      generalText = `В делах вы можете сталкиваться с разным подходом к задачам. Однако, если вы научитесь использовать сильные стороны друг друга, вы сможете достичь того, что не под силу поодиночке.`;
    }

    return {
      score,
      love: loveText,
      general: generalText,
      partnerSign: u2Sun.sign
    };
  }

  // Serve static files and Vite middleware
  const isProd = process.env.NODE_ENV === "production" || process.env.RENDER === "true";
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
