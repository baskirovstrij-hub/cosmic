import SwissEPH from 'sweph-wasm';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Override global fetch to support file:// URLs in Node.js
const originalFetch = global.fetch;
global.fetch = async (url: any, options: any) => {
  const urlString = url.toString();
  if (urlString.startsWith('file://')) {
    const filePath = fileURLToPath(urlString);
    const buffer = fs.readFileSync(filePath);
    return new Response(buffer, {
      status: 200,
      headers: { 'Content-Type': 'application/wasm' }
    });
  }
  return originalFetch(url, options);
};

let swe: any = null;

async function getSwe() {
  if (!swe) {
    // Point to the wasm file in node_modules using a file:// URL
    const wasmPath = path.join(process.cwd(), 'node_modules/sweph-wasm/dist/wasm/swisseph.wasm');
    const wasmUrl = pathToFileURL(wasmPath).href;
    swe = await SwissEPH.init(wasmUrl);
  }
  return swe;
}

export async function calculateNatalData(dateStr: string, timeStr: string, lat: number, lng: number) {
  const sw = await getSwe();
  
  // Parse date and time
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // Calculate Julian Day
  const jd_ut = sw.swe_julday(year, month, day, hour + minute / 60, sw.SE_GREG_CAL);
  
  // 10 Planets
  const planetIds = [
    sw.SE_SUN, sw.SE_MOON, sw.SE_MERCURY, sw.SE_VENUS, sw.SE_MARS,
    sw.SE_JUPITER, sw.SE_SATURN, sw.SE_URANUS, sw.SE_NEPTUNE, sw.SE_PLUTO
  ];
  
  const planetNames = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"
  ];
  
  const planets = planetIds.map((id, index) => {
    const res = sw.swe_calc_ut(jd_ut, id, sw.SEFLG_SWIEPH);
    const longitude = res[0];
    return {
      name: planetNames[index],
      longitude,
      sign: getZodiacSign(longitude),
      degree: Math.floor(longitude % 30)
    };
  });
  
  // 12 Houses (Placidus)
  const houseRes = sw.swe_houses(jd_ut, lat, lng, 'P');
  const houses = houseRes.cusps.slice(1, 13).map((long: number, index: number) => ({
    number: index + 1,
    longitude: long,
    sign: getZodiacSign(long),
    degree: Math.floor(long % 30)
  }));
  
  // Aspects (Orbis 5°)
  const aspects = [];
  const majorAspects = [
    { name: 'Conjunction', angle: 0 },
    { name: 'Opposition', angle: 180 },
    { name: 'Trine', angle: 120 },
    { name: 'Square', angle: 90 },
    { name: 'Sextile', angle: 60 }
  ];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = Math.abs(p1.longitude - p2.longitude);
      const angle = diff > 180 ? 360 - diff : diff;
      
      for (const aspect of majorAspects) {
        const orb = Math.abs(angle - aspect.angle);
        if (orb <= 5) {
          aspects.push({
            point1: p1.name,
            point2: p2.name,
            type: aspect.name,
            orb: parseFloat(orb.toFixed(2))
          });
        }
      }
    }
  }
  
  return {
    planets,
    houses,
    aspects
  };
}

export async function calculateTransitMoon(date: Date) {
  const sw = await getSwe();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;

  const jd_ut = sw.swe_julday(year, month, day, hour, sw.SE_GREG_CAL);
  const res = sw.swe_calc_ut(jd_ut, sw.SE_MOON, sw.SEFLG_SWIEPH);
  const longitude = res[0];

  return {
    name: 'Moon',
    longitude,
    sign: getZodiacSign(longitude),
    degree: Math.floor(longitude % 30)
  };
}

function getZodiacSign(longitude: number) {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[Math.floor(longitude / 30)];
}
