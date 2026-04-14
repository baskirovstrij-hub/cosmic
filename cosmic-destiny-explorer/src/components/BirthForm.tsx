import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Send, Globe, Heart } from 'lucide-react';
import CityPicker from './CityPicker';
import CustomDatePicker from './CustomDatePicker';

interface BirthFormProps {
  onSubmit: (data: { date: string; time: string; lat: number; lng: number }) => void;
  loading: boolean;
  isPartner?: boolean;
  initialData?: { date: string; time: string; lat: number; lng: number } | null;
}

export default function BirthForm({ onSubmit, loading, isPartner, initialData }: BirthFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(() => {
    if (initialData) {
      const [year, month, day] = initialData.date.split('-').map(Number);
      const [hours, minutes] = initialData.time.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    return null;
  });
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(() => {
    if (initialData && initialData.lat !== 0) {
      return { lat: initialData.lat, lng: initialData.lng, name: 'Сохраненный город' };
    }
    return null;
  });

  const handleCitySelect = (lat: number, lng: number, name: string) => {
    setLocation({ lat, lng, name });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;
    
    if (!isPartner && !location) return;

    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const hours = String(startDate.getHours()).padStart(2, '0');
    const minutes = String(startDate.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const finalLat = location ? location.lat : 0;
    const finalLng = location ? location.lng : 0;

    onSubmit({ date: dateStr, time: timeStr, lat: finalLat, lng: finalLng });
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className={`w-full max-w-lg mx-auto space-y-6 ${isPartner ? '' : 'bg-black/40 p-6 md:p-8 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-2xl'}`}
      >
        {!isPartner && (
          <div className="space-y-1 text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
              Ваше рождение
            </h3>
            <p className="text-gray-400 text-sm">
              Выберите дату и время рождения
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-gray-300 ml-1 flex items-center gap-2">
              <Calendar size={14} className="text-gold" />
              {isPartner ? "Дата и время рождения партнера" : "Дата и время рождения"}
            </label>
            <CustomDatePicker 
              value={startDate} 
              onChange={setStartDate} 
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-gray-300 ml-1 flex items-center gap-2">
              <Globe size={14} className="text-gold" />
              {isPartner ? "Город рождения партнера" : "Город рождения"} {isPartner && <span className="text-gray-500 font-normal">(необязательно)</span>}
            </label>
            <CityPicker onSelect={handleCitySelect} />
            {location && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] text-gold/60 ml-1 italic"
              >
                Координаты: {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°
              </motion.p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !startDate || (!isPartner && !location)}
          className={`w-full py-4 bg-gradient-to-r ${isPartner ? 'from-gold via-yellow-500 to-gold text-black' : 'from-neon-purple to-indigo-600 text-white'} font-black text-base rounded-xl hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isPartner ? <Heart size={18} /> : <Send size={18} />}
              {isPartner ? "Анализировать" : "Построить карту"}
            </>
          )}
        </button>
      </motion.form>
    </>
  );
}
