import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, X, Clock, ChevronDown } from 'lucide-react';

const MONTHS = [
  'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
  'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
];

export default function CustomDatePicker({ value, onChange }: { value: Date | null, onChange: (d: Date) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [day, setDay] = useState(value ? value.getDate() : 15);
  const [month, setMonth] = useState(value ? value.getMonth() : 4);
  const [year, setYear] = useState(value ? value.getFullYear() : 1990);
  const [hour, setHour] = useState(value ? value.getHours() : 12);
  const [minute, setMinute] = useState(value ? value.getMinutes() : 0);

  useEffect(() => {
    if (value) {
      setDay(value.getDate());
      setMonth(value.getMonth());
      setYear(value.getFullYear());
      setHour(value.getHours());
      setMinute(value.getMinutes());
    }
  }, [value]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, year, day, daysInMonth]);

  const handleSave = () => {
    const newDate = new Date(year, month, day, hour, minute);
    onChange(newDate);
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!value) return '';
    const d = value.getDate().toString().padStart(2, '0');
    const m = MONTHS[value.getMonth()];
    const y = value.getFullYear();
    const hh = value.getHours().toString().padStart(2, '0');
    const mm = value.getMinutes().toString().padStart(2, '0');
    return `${d} ${m} ${y}, ${hh}:${mm}`;
  };

  const SelectWrapper = ({ children, label }: { children: React.ReactNode, label: string }) => (
    <div className="flex flex-col gap-1.5 relative">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</span>
      <div className="relative">
        {children}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white flex items-center justify-between cursor-pointer hover:bg-white/10 hover:border-gold/30 transition-all group"
      >
        <span className={value ? "text-white font-medium text-lg" : "text-gray-400"}>
          {value ? formatDisplay() : "Выберите дату и время"}
        </span>
        <Calendar size={20} className="text-gold group-hover:scale-110 transition-transform" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            >
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gold/10 blur-[50px] rounded-full pointer-events-none" />

              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 flex items-center gap-3">
                  <Calendar className="text-gold" size={22} />
                  Момент рождения
                </h3>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8 relative z-10">
                
                {/* Date Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3">
                      <SelectWrapper label="День">
                        <select 
                          value={day} 
                          onChange={e => setDay(Number(e.target.value))}
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-3.5 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-white/10 transition-all cursor-pointer"
                        >
                          {Array.from({length: daysInMonth}, (_, i) => i + 1).map(d => (
                            <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                          ))}
                        </select>
                      </SelectWrapper>
                    </div>
                    <div className="col-span-5">
                      <SelectWrapper label="Месяц">
                        <select 
                          value={month} 
                          onChange={e => setMonth(Number(e.target.value))}
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-3.5 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-white/10 transition-all cursor-pointer"
                        >
                          {MONTHS.map((m, i) => (
                            <option key={i} value={i} className="bg-slate-900 text-white">{m}</option>
                          ))}
                        </select>
                      </SelectWrapper>
                    </div>
                    <div className="col-span-4">
                      <SelectWrapper label="Год">
                        <select 
                          value={year} 
                          onChange={e => setYear(Number(e.target.value))}
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-3.5 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-white/10 transition-all cursor-pointer"
                        >
                          {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(y => (
                            <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                          ))}
                        </select>
                      </SelectWrapper>
                    </div>
                  </div>
                </div>

                {/* Time Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <label className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> Точное время
                    </label>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-[200px] mx-auto">
                    <SelectWrapper label="Часы">
                      <select 
                        value={hour} 
                        onChange={e => setHour(Number(e.target.value))}
                        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-3.5 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-white/10 transition-all cursor-pointer text-center"
                      >
                        {Array.from({length: 24}, (_, i) => i).map(h => (
                          <option key={h} value={h} className="bg-slate-900 text-white">{h.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </SelectWrapper>
                    <SelectWrapper label="Минуты">
                      <select 
                        value={minute} 
                        onChange={e => setMinute(Number(e.target.value))}
                        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-3.5 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-white/10 transition-all cursor-pointer text-center"
                      >
                        {Array.from({length: 60}, (_, i) => i).map(m => (
                          <option key={m} value={m} className="bg-slate-900 text-white">{m.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </SelectWrapper>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.02] relative z-10">
                <button 
                  type="button"
                  onClick={handleSave}
                  className="w-full py-4 bg-gradient-to-r from-gold via-yellow-500 to-gold text-black font-black text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] bg-[length:200%_auto] animate-gradient"
                >
                  Подтвердить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
