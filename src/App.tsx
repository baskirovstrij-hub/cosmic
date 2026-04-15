/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Header from './components/Header';
import InteractiveZodiac from './components/InteractiveZodiac';
import AstroQuiz from './components/AstroQuiz';
import BirthForm from './components/BirthForm';
import ReadingDashboard, { CATEGORIES } from './components/ReadingDashboard';
import SynastryForm from './components/SynastryForm';
import SynastryResult from './components/SynastryResult';
import DailyVibe from './components/DailyVibe';
import ZodiacCompatibility from './components/ZodiacCompatibility';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, User, Zap, Users } from 'lucide-react';

type AppMode = 'home' | 'quiz' | 'form' | 'chart' | 'synastry' | 'vibe' | 'zodiac-compat';

const MYSTICAL_TEXTS: Record<string, { title: string; desc: string }> = {
  Personality: {
    title: 'Зеркало Души',
    desc: 'Тайные грани вашего воплощения и внутренний свет, ведущий через тернии к истинному «Я».'
  },
  Money: {
    title: 'Поток Изобилия',
    desc: 'Энергия земных благ и сакральные ключи к открытию врат материального процветания.'
  },
  Love: {
    title: 'Слияние Сфер',
    desc: 'Таинство сердечных уз и предначертанные встречи в бескрайнем океане человеческих чувств.'
  },
  Intellect: {
    title: 'Свет Разума',
    desc: 'Архитектура вашей мысли и древняя мудрость, сокрытая в лабиринтах вашего сознания.'
  },
  Talent: {
    title: 'Дар Богов',
    desc: 'Искры божественного пламени, зажженные в вашей крови в момент первого вдоха.'
  },
  Career: {
    title: 'Путь Восхождения',
    desc: 'Ваша реализация в мире форм и социальное служение под неусыпным взором звездных стражей.'
  },
  Health: {
    title: 'Храм Духа',
    desc: 'Гармония телесной оболочки и чистая жизненная сила, питающая ваше земное странствие.'
  },
  Spirituality: {
    title: 'Шепот Вечности',
    desc: 'Связь с высшими планами бытия и поиск сакрального смысла за пределами видимого мира.'
  },
  Destiny: {
    title: 'Космический Код',
    desc: 'Великая миссия вашей бессмертной души и финальная цель этого земного воплощения.'
  }
};

import { useSynastryStore } from './store/synastryStore';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [natalData, setNatalData] = useState<any>(null);
  const [synastryData, setSynastryData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const vibeRef = useRef<HTMLDivElement>(null);
  const { setUser1 } = useSynastryStore();

  // Persistence: Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('natalData');
    const savedFormData = localStorage.getItem('userFormData');
    
    if (savedFormData) {
      try {
        setUser1(JSON.parse(savedFormData));
      } catch (e) {
        console.error('Failed to parse saved user form data', e);
      }
    }

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setNatalData(parsed);
        // We can keep mode as 'home' initially, or go to 'chart'. Let's keep 'home' as entry point.
      } catch (e) {
        console.error('Failed to parse saved natal data', e);
      }
    }
  }, [setUser1]);

  const handleCalculate = async (formData: { date: string; time: string; lat: number; lng: number }, partnerData?: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, partner: partnerData })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || `Failed to fetch data: ${response.status}`);
      }
      
      if (partnerData) {
        setSynastryData(data.synastry);
        setMode('synastry');
      } else {
        setNatalData(data);
        setUser1(formData);
        setMode('chart');
        // Persistence: Save to localStorage
        localStorage.setItem('natalData', JSON.stringify(data));
        localStorage.setItem('userFormData', JSON.stringify(formData));
      }
      
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Ошибка при расчете. Пожалуйста, проверьте консоль.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (newMode: AppMode) => {
    if (newMode === 'home') {
      setMode('home');
      window.scrollTo(0, 0);
    } else if (newMode === 'chart' || newMode === 'vibe' || newMode === 'form' || newMode === 'zodiac-compat') {
      // Unify 'form' and 'chart' under 'chart' logic
      const targetMode = newMode === 'form' ? 'chart' : newMode;
      
      if (natalData) {
        setMode(targetMode as AppMode);
        window.scrollTo(0, 0);
      } else {
        setMode('form');
        window.scrollTo(0, 0);
      }
    } else {
      setMode(newMode);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {mode === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Home onNavigate={(m) => navigateTo(m as AppMode)} />
          </motion.div>
        ) : (
          <Header onNavigate={(m) => navigateTo(m as AppMode)} currentMode={mode} />
        )}
      </AnimatePresence>
      
      <section className={`px-4 max-w-7xl mx-auto space-y-6 ${mode !== 'home' ? 'pt-24 pb-6' : 'py-6'}`}>
        {/* Main Interaction Area */}
        <div id="main-content" className="relative min-h-[500px] scroll-mt-32">
          <AnimatePresence mode="wait">
            {mode === 'quiz' && (
              <motion.div
                key="quiz-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">Узнайте свою космическую природу</h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Пройдите наш интуитивный квиз, чтобы определить вашу доминирующую планету и получить персональные рекомендации.
                  </p>
                </div>
                <AstroQuiz onStartChart={() => navigateTo('form')} />
              </motion.div>
            )}

            {mode === 'form' && (
              <motion.div
                key="form-section"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-gold">Ваш небесный чертеж</h2>
                  <p className="text-gray-400 text-lg">
                    Введите данные вашего рождения для точного астрономического расчета.
                  </p>
                </div>
                <BirthForm onSubmit={handleCalculate} loading={loading} />
              </motion.div>
            )}

            {mode === 'synastry' && !synastryData && (
              <motion.div
                key="synastry-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-bold text-neon-purple">Анализ совместимости</h2>
                  <p className="text-gray-400 text-sm">
                    Узнайте, как ваши звезды взаимодействуют.
                  </p>
                </div>
                <SynastryForm onCalculate={(u1, u2) => handleCalculate(u1, u2)} loading={loading} />
              </motion.div>
            )}

            {mode === 'synastry' && synastryData && (
              <motion.div
                key="synastry-result"
                ref={chartRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <SynastryResult {...synastryData} />
                <div className="flex justify-center">
                  <button 
                    onClick={() => setSynastryData(null)}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Новый расчет совместимости
                  </button>
                </div>
              </motion.div>
            )}

            {mode === 'vibe' && natalData && (
              <motion.div
                key="vibe-section"
                ref={vibeRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto"
              >
                <DailyVibe horoscope={natalData.horoscope} />
              </motion.div>
            )}

            {mode === 'zodiac-compat' && natalData && (
              <motion.div
                key="zodiac-compat-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto"
              >
                <ZodiacCompatibility userSign={natalData.planets[0].sign} />
              </motion.div>
            )}

            {mode === 'chart' && natalData && (
              <motion.div
                key="chart-section"
                ref={chartRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid lg:grid-cols-2 gap-16 items-start scroll-mt-24"
              >
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-5xl font-bold text-white leading-tight">
                        {activeCategory ? MYSTICAL_TEXTS[activeCategory.id]?.title : (
                          <>Ваша <span className="text-gold">Натальная Карта</span></>
                        )}
                      </h2>
                      <button 
                        onClick={() => navigateTo('form')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gold hover:bg-gold/10 transition-all font-bold text-sm"
                      >
                        Изменить данные
                      </button>
                    </div>
                    <p className="text-gray-400 text-xl leading-relaxed">
                      {activeCategory ? MYSTICAL_TEXTS[activeCategory.id]?.desc : 'Это уникальный снимок неба в момент вашего рождения. Исследуйте расшифровку по ключевым сферам жизни.'}
                    </p>
                  </div>

                  <ReadingDashboard data={natalData.interpretations || []} onTabChange={(tabId) => setActiveCategory(CATEGORIES.find(c => c.id === tabId) || null)} />
                </div>

                <div className="sticky top-24">
                  <InteractiveZodiac data={natalData} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
