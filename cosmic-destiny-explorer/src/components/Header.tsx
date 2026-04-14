import { motion } from 'motion/react';
import { Sparkles, User, Heart, Zap, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (mode: 'form' | 'synastry' | 'chart' | 'zodiac-compat') => void;
  currentMode: string;
}

export default function Header({ onNavigate, currentMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'chart', label: 'Натальная карта', icon: User, color: 'text-gold' },
    { id: 'synastry', label: 'Совместимость', icon: Heart, color: 'text-neon-purple' },
    { id: 'zodiac-compat', label: 'Знаки', icon: Users, color: 'text-blue-400' },
    { id: 'vibe', label: 'Гороскоп', icon: Zap, color: 'text-emerald-400' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('home' as any)}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
            <Sparkles size={22} className="text-black" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">Astro<span className="text-gold">Vibe</span></span>
        </motion.div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                currentMode === item.id 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={item.color} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-slate-900 border-b border-white/10"
      >
        <div className="p-6 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as any);
                setIsMenuOpen(false);
              }}
              className="w-full p-4 rounded-2xl bg-white/5 flex items-center gap-4 text-white font-bold hover:bg-white/10 transition-all"
            >
              <item.icon size={22} className={item.color} />
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
