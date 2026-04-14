import React from 'react';
import { motion } from 'motion/react';
import { Heart, Home, Zap, Smile, Brain, Flame, Sparkles, Star } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SynastryDetail {
  score: number;
  text: string;
  tips?: string[];
}

interface SynastryResultProps {
  score: number;
  details: {
    sex: SynastryDetail;
    daily: SynastryDetail;
    emotions: SynastryDetail;
    intellect: SynastryDetail;
    passion: SynastryDetail;
  };
}

export default function SynastryResult({ score, details }: SynastryResultProps) {
  const data = [
    { subject: 'Секс', A: details.sex.score, fullMark: 100 },
    { subject: 'Быт', A: details.daily.score, fullMark: 100 },
    { subject: 'Эмоции', A: details.emotions.score, fullMark: 100 },
    { subject: 'Интеллект', A: details.intellect.score, fullMark: 100 },
    { subject: 'Страсть', A: details.passion.score, fullMark: 100 },
  ];

  const detailItems = [
    { key: 'passion', title: 'Страсть', icon: Flame, color: 'text-orange-500', border: 'hover:border-orange-500/50', bg: 'bg-orange-500/5', glow: 'shadow-orange-500/20' },
    { key: 'emotions', title: 'Эмоции', icon: Smile, color: 'text-pink-400', border: 'hover:border-pink-500/50', bg: 'bg-pink-500/5', glow: 'shadow-pink-500/20' },
    { key: 'intellect', title: 'Интеллект', icon: Brain, color: 'text-emerald-400', border: 'hover:border-emerald-500/50', bg: 'bg-emerald-500/5', glow: 'shadow-emerald-500/20' },
    { key: 'sex', title: 'Секс', icon: Zap, color: 'text-red-500', border: 'hover:border-red-500/50', bg: 'bg-red-500/5', glow: 'shadow-red-500/20' },
    { key: 'daily', title: 'Быт', icon: Home, color: 'text-blue-400', border: 'hover:border-blue-500/50', bg: 'bg-blue-500/5', glow: 'shadow-blue-500/20' },
  ];

  const getVerdict = (s: number) => {
    if (s > 85) return "Божественный союз. Ваши души резонируют на высших частотах Вселенной.";
    if (s > 70) return "Гармоничное созвучие. Звезды благоволят вашему совместному пути.";
    if (s > 50) return "Земное притяжение. У вас есть прочный фундамент для роста и трансформации.";
    return "Кармическое испытание. Этот союз дан для глубоких уроков и осознания себя.";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-10 bg-black/40 rounded-[3rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center space-y-4">
        <motion.div variants={itemVariants} className="flex justify-center gap-3 text-gold/40">
          <Star size={20} className="animate-pulse" />
          <Sparkles size={24} className="animate-spin-slow" />
          <Star size={20} className="animate-pulse" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase tracking-tighter">
            Космический Резонанс
          </h3>
          <p className="text-gold font-medium tracking-[0.2em] uppercase text-xs opacity-80">
            {getVerdict(score)}
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <div className="relative group">
            <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-white/5 fill-none"
                strokeWidth="6"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-gold fill-none"
                strokeWidth="6"
                strokeDasharray="100 100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - score }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
                {score}
              </span>
              <span className="text-gold/60 font-bold text-[10px] tracking-widest uppercase">процент</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        <motion.div variants={itemVariants} className="relative aspect-square w-full max-w-[300px] mx-auto bg-white/5 rounded-full border border-white/10 p-6 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-neon-purple/5 rounded-full" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#ffffff15" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '600', letterSpacing: '0.05em' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar 
                name="Compatibility" 
                dataKey="A" 
                stroke="#d4af37" 
                fill="url(#radarGradient)" 
                fillOpacity={0.6} 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Heart className="text-red-500 fill-red-500" size={20} />
              </div>
              Архитектура Связи
            </h4>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Ваши астральные тела вступают в сложный танец энергий. Мы проанализировали пять фундаментальных столпов ваших отношений.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {detailItems.map(item => (
              <div key={item.key} className={`px-3 py-1 rounded-full border border-white/10 ${item.bg} ${item.color} text-[10px] font-bold uppercase tracking-widest`}>
                {item.title}: {details[item.key as keyof typeof details].score}%
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailItems.map((item) => {
          const detail = details[item.key as keyof typeof details];
          return (
            <motion.div 
              key={item.key} 
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`p-6 rounded-[2rem] border border-white/10 space-y-4 transition-all group ${item.border} ${item.bg} backdrop-blur-sm relative overflow-hidden`}
            >
              <div className="flex justify-between items-center">
                <div className={`flex items-center gap-3 ${item.color}`}>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5 shadow-xl">
                    <item.icon size={20} className="group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  <h4 className="font-black text-xl uppercase tracking-tighter">{item.title}</h4>
                </div>
                <div className="text-2xl font-black text-white/10 group-hover:text-white/30 transition-colors">
                  {detail.score}%
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-white/90 text-sm font-light leading-relaxed">
                  {detail.text}
                </p>
                
                {detail.tips && detail.tips.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gold/60">Шепот Звезд:</p>
                    <ul className="space-y-1">
                      {detail.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors">
                          <Sparkles size={10} className={`mt-1 shrink-0 ${item.color}`} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
