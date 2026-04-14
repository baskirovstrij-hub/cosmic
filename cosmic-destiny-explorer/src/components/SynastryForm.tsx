import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';
import BirthForm from './BirthForm';
import { useSynastryStore } from '../store/synastryStore';

interface SynastryFormProps {
  onCalculate: (u1: any, u2: any) => void;
  loading: boolean;
}

export default function SynastryForm({ onCalculate, loading }: SynastryFormProps) {
  const { user1, user2, setUser1, setUser2 } = useSynastryStore();
  const [step, setStep] = useState(user1 ? 2 : 1);

  const handleUser1Submit = (data: any) => {
    setUser1(data);
    setStep(2);
  };

  const handleUser2Submit = (data: any) => {
    setUser2(data);
    onCalculate(user1, data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4">
      <div className="flex justify-center mb-4">
        <div className="relative flex items-center gap-4 bg-white/5 p-1.5 rounded-[1.2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
          <button 
            onClick={() => setStep(1)}
            className={`relative z-10 px-6 py-2 rounded-xl transition-all duration-500 flex items-center gap-2 ${step === 1 ? 'text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            {step === 1 && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute inset-0 bg-gold rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20 flex items-center gap-2 text-sm">
              <Sun size={16} className={step === 1 ? 'text-black' : 'text-gold'} />
              Вы
            </span>
          </button>
          
          <div className="text-gray-600 animate-pulse">
            <ArrowRight size={18} />
          </div>

          <button 
            disabled={!user1}
            onClick={() => setStep(2)}
            className={`relative z-10 px-6 py-2 rounded-xl transition-all duration-500 flex items-center gap-2 ${step === 2 ? 'text-white font-bold' : 'text-gray-400 hover:text-white disabled:opacity-30'}`}
          >
            {step === 2 && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute inset-0 bg-neon-purple rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20 flex items-center gap-2 text-sm">
              <Moon size={16} className={step === 2 ? 'text-white' : 'text-neon-purple'} />
              Партнер
            </span>
          </button>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="user1"
              initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <div className="text-center mb-4 space-y-1">
                <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
                  <Sparkles className="text-gold animate-spin-slow" size={18} />
                  Ваше Начало
                </h2>
                <p className="text-gray-400 font-light text-xs">Введите данные своего рождения</p>
              </div>
              <BirthForm onSubmit={handleUser1Submit} loading={false} initialData={user1} />
            </motion.div>
          ) : (
            <motion.div
              key="user2"
              initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <div className="text-center mb-4 space-y-1">
                <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
                  <Heart className="text-red-500 fill-red-500 animate-pulse" size={18} />
                  Душа Партнера
                </h2>
                <p className="text-gray-400 font-light text-xs">Откройте тайны вашего взаимодействия</p>
              </div>
              <BirthForm onSubmit={handleUser2Submit} loading={loading} isPartner={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
