import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Planet {
  name: string;
  longitude: number;
  sign: string;
  degree: number;
}

interface Aspect {
  point1: string;
  point2: string;
  type: string;
  orb: number;
}

interface NatalData {
  planets: Planet[];
  houses: any[];
  aspects: Aspect[];
  interpretations?: any;
}

interface InteractiveZodiacProps {
  data: NatalData;
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇',
};

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#fde047', // Gold
  Opposition: '#ef4444', // Red
  Trine: '#22c55e',      // Green
  Square: '#3b82f6',     // Blue
  Sextile: '#8b5cf6',    // Purple
};

export default function InteractiveZodiac({ data }: InteractiveZodiacProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null);
  
  const centerX = 150;
  const centerY = 150;
  const outerRadius = 120;
  const innerRadius = 90;

  const getCoords = (longitude: number, r: number) => {
    const angleRad = (longitude - 180) * (Math.PI / 180);
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    };
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-full flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute inset-6 bg-gold/5 rounded-full blur-2xl" />

      <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible relative z-10 drop-shadow-2xl">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
          </radialGradient>
        </defs>

        {/* Center Mystical Core */}
        <circle cx={centerX} cy={centerY} r="130" fill="url(#centerGlow)" />
        <motion.circle 
          cx={centerX} cy={centerY} r="10" 
          fill="#fde047" filter="url(#glow-strong)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rotating Outer Zodiac Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          style={{ originX: '150px', originY: '150px' }}
        >
          {/* Decorative Rings */}
          <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="rgba(255,215,0,0.2)" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={outerRadius + 20} fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="1.5" />
          <circle cx={centerX} cy={centerY} r={outerRadius - 20} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Zodiac Segments & Symbols */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30;
            const midAngle = angle + 15;
            const p1 = getCoords(angle, outerRadius - 20);
            const p2 = getCoords(angle, outerRadius + 20);
            const symbolPos = getCoords(midAngle, outerRadius);

            return (
              <g key={`zodiac-${i}`}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
                <text 
                  x={symbolPos.x} y={symbolPos.y} 
                  fill="#fde047" fontSize="14" 
                  textAnchor="middle" dominantBaseline="central"
                  className="opacity-80"
                  transform={`rotate(${midAngle + 90}, ${symbolPos.x}, ${symbolPos.y})`}
                >
                  {ZODIAC_SYMBOLS[i]}
                </text>
              </g>
            );
          })}
        </motion.g>

        {/* Inner Astrolabe Rings (Counter-rotating) */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
          style={{ originX: '150px', originY: '150px' }}
        >
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
          {[...Array(36)].map((_, i) => {
            const p1 = getCoords(i * 10, innerRadius - 8);
            const p2 = getCoords(i * 10, innerRadius + 8);
            return <line key={`tick-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
          })}
        </motion.g>

        {/* Aspect Lines */}
        {data.aspects?.map((aspect, i) => {
          const p1 = data.planets?.find(p => p.name === aspect.point1);
          const p2 = data.planets?.find(p => p.name === aspect.point2);
          if (!p1 || !p2) return null;

          const start = getCoords(p1.longitude, innerRadius - 12);
          const end = getCoords(p2.longitude, innerRadius - 12);
          const isHovered = hoveredAspect === aspect;
          const color = ASPECT_COLORS[aspect.type] || 'white';

          return (
            <g 
              key={`aspect-${i}`}
              onMouseEnter={() => setHoveredAspect(aspect)}
              onMouseLeave={() => setHoveredAspect(null)}
              className="cursor-pointer"
            >
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="12" />
              <motion.line
                x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                stroke={color}
                strokeWidth={isHovered ? "2.5" : "0.8"}
                strokeOpacity={isHovered ? "1" : "0.3"}
                filter={isHovered ? "url(#glow)" : ""}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isHovered ? 1 : 0.3,
                  strokeWidth: isHovered ? 2.5 : 0.8
                }}
                transition={{ duration: 2, delay: i * 0.1, ease: "easeOut" }}
                strokeDasharray={isHovered ? "none" : "3 3"}
              />
            </g>
          );
        })}

        {/* Planets */}
        {[...data.planets || []].sort((a, b) => (a === hoveredPlanet ? 1 : b === hoveredPlanet ? -1 : 0)).map((planet, i, arr) => {
          // Calculate overlap offset
          let overlapOffset = 0;
          const similarLongs = arr.filter(p => Math.abs(p.longitude - planet.longitude) < 5);
          if (similarLongs.length > 1) {
            const indexInCluster = similarLongs.findIndex(p => p.name === planet.name);
            overlapOffset = (indexInCluster - (similarLongs.length - 1) / 2) * 16;
          }

          const planetRadius = innerRadius - 16 + overlapOffset;
          const { x, y } = getCoords(planet.longitude, planetRadius);
          const symbol = PLANET_SYMBOLS[planet.name] || '●';
          const isHovered = hoveredPlanet === planet;

          return (
            <g
              key={`planet-${planet.name}-${i}`}
              onMouseEnter={() => setHoveredPlanet(planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className="cursor-pointer"
            >
              {/* Connection line to center */}
              <line 
                x1={centerX} y1={centerY} x2={x} y2={y} 
                stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="2 2" 
              />
              
              <motion.circle
                cx={x} cy={y} r={isHovered ? "12" : "9"}
                fill="#0f172a"
                stroke={isHovered ? "#fde047" : "rgba(255,255,255,0.5)"}
                strokeWidth={isHovered ? "1.5" : "0.8"}
                filter={isHovered ? "url(#glow)" : ""}
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              <text 
                x={x} y={y} 
                fill={isHovered ? "#fde047" : "#ffffff"} 
                fontSize={isHovered ? "14" : "11"} 
                textAnchor="middle" dominantBaseline="central"
                className="transition-all duration-300 pointer-events-none"
                style={{ textShadow: isHovered ? '0 0 6px rgba(255,215,0,0.8)' : 'none' }}
              >
                {symbol}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Mystical Tooltips */}
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-gold/40 p-4 rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.15)] backdrop-blur-xl z-20 min-w-[200px] text-center"
          >
            <div className="text-2xl mb-1 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">{PLANET_SYMBOLS[hoveredPlanet.name]}</div>
            <div className="text-gold font-bold text-sm uppercase tracking-widest border-b border-gold/20 pb-2 mb-2">
              {translatePlanetName(hoveredPlanet.name)} в {translateSignName(hoveredPlanet.sign)}
            </div>
            <div className="text-xs text-white/80 italic">
              {hoveredPlanet.degree}° — {getPlanetMeaning(hoveredPlanet.name)}
            </div>
          </motion.div>
        )}

        {hoveredAspect && (() => {
          const p1 = data.planets?.find(p => p.name === hoveredAspect.point1);
          const p2 = data.planets?.find(p => p.name === hoveredAspect.point2);
          let diff = 0;
          if (p1 && p2) {
            diff = Math.abs(p1.longitude - p2.longitude);
            if (diff > 180) diff = 360 - diff;
          }

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-white/20 p-4 rounded-xl shadow-2xl backdrop-blur-xl z-20 min-w-[220px] text-center"
              style={{ borderColor: ASPECT_COLORS[hoveredAspect.type] }}
            >
              <div className="font-bold text-sm uppercase tracking-widest pb-2 mb-2 border-b border-white/10" style={{ color: ASPECT_COLORS[hoveredAspect.type] }}>
                {translateAspectName(hoveredAspect.type)}
              </div>
              <div className="text-sm text-white flex justify-center items-center gap-3 mb-2">
                <span className="text-lg">{PLANET_SYMBOLS[hoveredAspect.point1]}</span>
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-full text-white/70">
                  {diff.toFixed(1)}°
                </span>
                <span className="text-lg">{PLANET_SYMBOLS[hoveredAspect.point2]}</span>
              </div>
              <div className="text-xs text-white/60 italic">
                {getAspectMeaning(hoveredAspect.type)}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// Translations and Meanings
function translatePlanetName(name: string) {
  const map: Record<string, string> = {
    Sun: 'Солнце', Moon: 'Луна', Mercury: 'Меркурий', Venus: 'Венера',
    Mars: 'Марс', Jupiter: 'Юпитер', Saturn: 'Сатурн', Uranus: 'Уран',
    Neptune: 'Нептун', Pluto: 'Плутон'
  };
  return map[name] || name;
}

function translateSignName(sign: string) {
  const map: Record<string, string> = {
    Aries: 'Овне', Taurus: 'Тельце', Gemini: 'Близнецах', Cancer: 'Раке',
    Leo: 'Льве', Virgo: 'Деве', Libra: 'Весах', Scorpio: 'Скорпионе',
    Sagittarius: 'Стрельце', Capricorn: 'Козероге', Aquarius: 'Водолее', Pisces: 'Рыбах'
  };
  return map[sign] || sign;
}

function translateAspectName(type: string) {
  const map: Record<string, string> = {
    Conjunction: 'Соединение', Opposition: 'Оппозиция', Trine: 'Трин',
    Square: 'Квадрат', Sextile: 'Секстиль'
  };
  return map[type] || type;
}

function getAspectMeaning(type: string) {
  const meanings: Record<string, string> = {
    Conjunction: "Слияние энергий и мощный фокус",
    Opposition: "Напряжение, требующее баланса",
    Trine: "Гармоничный поток и врожденная удача",
    Square: "Внутренний конфликт и точка роста",
    Sextile: "Возможности и поддержка вселенной",
  };
  return meanings[type] || "Астрологический аспект";
}

function getPlanetMeaning(name: string) {
  const meanings: Record<string, string> = {
    Sun: "Ядро личности, эго и жизненная сила",
    Moon: "Душа, эмоции и подсознание",
    Mercury: "Разум, интеллект и коммуникация",
    Venus: "Любовь, красота и магнетизм",
    Mars: "Воля, страсть и энергия действия",
    Jupiter: "Удача, расширение и мудрость",
    Saturn: "Карма, дисциплина и структура",
    Uranus: "Свобода, озарения и бунт",
    Neptune: "Мистика, иллюзии и высшая любовь",
    Pluto: "Трансформация, власть и перерождение",
  };
  return meanings[name] || "Небесное влияние";
}
