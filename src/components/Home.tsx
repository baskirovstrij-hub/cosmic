import { motion } from 'motion/react';
import { Sparkles, Star, User, Heart, Zap, Compass, Users } from 'lucide-react';

interface HomeProps {
  onNavigate: (mode: 'form' | 'synastry' | 'chart' | 'quiz' | 'vibe' | 'zodiac-compat') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden py-8">
      {/* Mystical Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Orbiting Planets/Stars */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full"
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-gold rounded-full shadow-[0_0_15px_#fde047] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-neon-purple rounded-full shadow-[0_0_15px_#8b5cf6] -translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 space-y-6 w-full max-w-5xl mx-auto"
      >
        <div className="flex justify-center gap-3 text-gold">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={32} />
          </motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            <Star size={32} />
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-lg">
            Познай свой <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-neon-purple">Космический</span> Путь
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Древняя мудрость звезд и точные алгоритмы для раскрытия вашего потенциала.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-4">
          <MenuCard 
            icon={<User size={28} />}
            title="Натальная карта"
            desc="Уникальный снимок неба в момент вашего рождения"
            color="from-gold/20 to-gold/5"
            borderColor="border-gold/30"
            hoverColor="group-hover:border-gold"
            onClick={() => onNavigate('form')}
            delay={0.1}
          />
          <MenuCard 
            icon={<Heart size={28} />}
            title="Совместимость"
            desc="Анализ синастрии и кармических связей с партнером"
            color="from-neon-purple/20 to-neon-purple/5"
            borderColor="border-neon-purple/30"
            hoverColor="group-hover:border-neon-purple"
            onClick={() => onNavigate('synastry')}
            delay={0.2}
          />
          <MenuCard 
            icon={<Zap size={28} />}
            title="Гороскоп"
            desc="Персональный гороскоп и энергии текущего момента"
            color="from-emerald-500/20 to-emerald-500/5"
            borderColor="border-emerald-500/30"
            hoverColor="group-hover:border-emerald-500"
            onClick={() => onNavigate('vibe')}
            delay={0.3}
          />
          <MenuCard 
            icon={<Users size={28} />}
            title="Связь знаков"
            desc="Быстрый анализ совместимости по знакам зодиака"
            color="from-blue-400/20 to-blue-400/5"
            borderColor="border-blue-400/30"
            hoverColor="group-hover:border-blue-400"
            onClick={() => onNavigate('zodiac-compat' as any)}
            delay={0.35}
          />
          <MenuCard 
            icon={<Compass size={28} />}
            title="Астро-Квиз"
            desc="Определите свою доминирующую стихию и планету"
            color="from-blue-500/20 to-blue-500/5"
            borderColor="border-blue-500/30"
            hoverColor="group-hover:border-blue-500"
            onClick={() => onNavigate('quiz')}
            delay={0.4}
          />
        </div>
      </motion.div>
    </section>
  );
}

function MenuCard({ icon, title, desc, color, borderColor, hoverColor, onClick, delay }: any) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b ${color} border ${borderColor} ${hoverColor} transition-all overflow-hidden backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="mb-3 p-3 rounded-xl bg-black/40 text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</p>
    </motion.button>
  );
}
