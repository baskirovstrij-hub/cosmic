import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Venus, Mars, 
  Star, Shield, Zap, Compass, BookOpen,
  ArrowRight, Sparkles, RefreshCcw
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    planet: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Как вы обычно принимаете важные решения?",
    options: [
      { text: "Слушаю свое сердце и интуицию", planet: "Moon" },
      { text: "Тщательно анализирую все факты и детали", planet: "Mercury" },
      { text: "Быстро и решительно, иду на риск", planet: "Mars" },
      { text: "Ищу наиболее гармоничный и красивый вариант", planet: "Venus" },
      { text: "Оцениваю долгосрочные перспективы и правила", planet: "Saturn" }
    ]
  },
  {
    id: 2,
    text: "Что для вас является лучшим отдыхом?",
    options: [
      { text: "Быть в центре внимания на яркой вечеринке", planet: "Sun" },
      { text: "Уютный вечер дома с близкими", planet: "Moon" },
      { text: "Чтение захватывающей книги или обучение", planet: "Mercury" },
      { text: "Путешествие в далекие и неизведанные страны", planet: "Jupiter" },
      { text: "Активный спорт или соревнование", planet: "Mars" }
    ]
  },
  {
    id: 3,
    text: "Какое качество вы больше всего цените в людях?",
    options: [
      { text: "Искренность и внутреннюю силу", planet: "Sun" },
      { text: "Доброту и сострадание", planet: "Moon" },
      { text: "Острый ум и чувство юмора", planet: "Mercury" },
      { text: "Оптимизм и широту взглядов", planet: "Jupiter" },
      { text: "Надежность и дисциплину", planet: "Saturn" }
    ]
  },
  {
    id: 4,
    text: "Ваша идеальная рабочая обстановка — это...",
    options: [
      { text: "Где я могу проявлять лидерство и творчество", planet: "Sun" },
      { text: "Где царит красота, комфорт и эстетика", planet: "Venus" },
      { text: "Где много общения и обмена информацией", planet: "Mercury" },
      { text: "Где есть четкая структура и понятные цели", planet: "Saturn" },
      { text: "Где каждый день приносит новые вызовы", planet: "Mars" }
    ]
  },
  {
    id: 5,
    text: "Как вы относитесь к переменам в жизни?",
    options: [
      { text: "Вижу в них новые возможности для роста", planet: "Jupiter" },
      { text: "Отношусь с осторожностью, предпочитаю стабильность", planet: "Saturn" },
      { text: "Легко адаптируюсь и нахожу в этом интерес", planet: "Mercury" },
      { text: "Перемены вдохновляют меня на новые свершения", planet: "Mars" },
      { text: "Главное, чтобы перемены не нарушали мой покой", planet: "Venus" }
    ]
  }
];

const PLANET_INFO: Record<string, { name: string, icon: any, color: string, desc: string }> = {
  Sun: { name: "Солнце", icon: Sun, color: "text-yellow-400", desc: "Вы — прирожденный лидер, излучающий свет и уверенность. Ваша сила в творчестве и самовыражении." },
  Moon: { name: "Луна", icon: Moon, color: "text-blue-200", desc: "Ваша душа глубока и интуитивна. Вы обладаете огромной эмпатией и умеете создавать уют вокруг себя." },
  Mercury: { name: "Меркурий", icon: BookOpen, color: "text-emerald-400", desc: "Ваш ум быстр и любознателен. Вы мастер коммуникации и всегда находите общий язык с миром." },
  Venus: { name: "Венера", icon: Star, color: "text-pink-400", desc: "Вы цените красоту, любовь и гармонию. Ваше обаяние и дипломатичность притягивают людей." },
  Mars: { name: "Марс", icon: Zap, color: "text-red-500", desc: "Вы полны энергии и решимости. Ваша страсть и смелость помогают вам преодолевать любые преграды." },
  Jupiter: { name: "Юпитер", icon: Compass, color: "text-purple-400", desc: "Вы — оптимист и искатель истины. Ваша мудрость и щедрость открывают перед вами любые горизонты." },
  Saturn: { name: "Сатурн", icon: Shield, color: "text-slate-400", desc: "Вы обладаете невероятной выдержкой и дисциплиной. Ваша сила в мудрости, терпении и надежности." }
};

interface AstroQuizProps {
  onStartChart: () => void;
}

export default function AstroQuiz({ onStartChart }: AstroQuizProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (planet: string) => {
    const newScores = { ...scores, [planet]: (scores[planet] || 0) + 1 };
    setScores(newScores);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: Record<string, number>) => {
    let maxScore = 0;
    let dominantPlanet = "Sun";

    Object.entries(finalScores).forEach(([planet, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantPlanet = planet;
      }
    });

    setResult(dominantPlanet);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScores({});
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <span className="text-neon-purple font-mono text-sm uppercase tracking-widest">
                Вопрос {currentStep + 1} из {QUESTIONS.length}
              </span>
              <h3 className="text-2xl font-bold text-white leading-tight">
                {QUESTIONS[currentStep].text}
              </h3>
            </div>

            <div className="grid gap-3">
              {QUESTIONS[currentStep].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.planet)}
                  className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-gold/50 group flex items-center justify-between"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {option.text}
                  </span>
                  <ArrowRight size={18} className="text-white/0 group-hover:text-gold transition-all -translate-x-2 group-hover:translate-x-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-10"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-gold via-neon-purple to-gold"
              />
              <div className={`relative p-8 rounded-full bg-white/5 border border-white/10 ${PLANET_INFO[result].color}`}>
                {React.createElement(PLANET_INFO[result].icon, { size: 64, strokeWidth: 1.5 })}
              </div>
            </div>

            <div className="space-y-4">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white"
              >
                Ваша планета-покровитель — <span className="text-gold">{PLANET_INFO[result].name}</span>!
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed"
              >
                {PLANET_INFO[result].desc}
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <button
                onClick={onStartChart}
                className="px-8 py-4 bg-gold text-deep-blue font-bold rounded-full hover:shadow-[0_0_20px_rgba(253,224,71,0.4)] transition-all flex items-center gap-2 group"
              >
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                Построить личную карту
              </button>
              <button
                onClick={resetQuiz}
                className="px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <RefreshCcw size={18} />
                Пройти заново
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
