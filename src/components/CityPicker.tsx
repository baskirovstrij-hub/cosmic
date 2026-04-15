import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { MapPin, Search } from 'lucide-react';

interface CityOption {
  label: string;
  value: {
    lat: number;
    lng: number;
    name: string;
  };
}

interface CityPickerProps {
  onSelect: (lat: number, lng: number, cityName: string) => void;
}

export default function CityPicker({ onSelect }: CityPickerProps) {
  const loadOptions = useCallback(
    debounce((inputValue: string, callback: (options: CityOption[]) => void) => {
      if (!inputValue || inputValue.length < 2) {
        callback([]);
        return;
      }

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&addressdetails=1&limit=5&accept-language=ru`)
        .then(res => res.json())
        .then(data => {
          const options = data.map((item: any) => ({
            label: item.display_name,
            value: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              name: item.display_name
            }
          }));
          callback(options);
        })
        .catch(err => {
          console.error('City search error:', err);
          callback([]);
        });
    }, 500),
    []
  );

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-gold transition-colors">
        <MapPin size={20} />
      </div>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        placeholder="Введите город рождения..."
        noOptionsMessage={({ inputValue }) => !inputValue ? "Начните вводить название..." : "Город не найден"}
        loadingMessage={() => "Поиск..."}
        onChange={(option: any) => {
          if (option) {
            onSelect(option.value.lat, option.value.lng, option.value.name);
          }
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: state.isFocused ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '0.5rem 0.5rem 0.5rem 2.5rem',
            color: 'white',
            boxShadow: 'none',
            '&:hover': {
              borderColor: 'rgba(212, 175, 55, 0.3)',
            }
          }),
          input: (base) => ({
            ...base,
            color: 'white',
          }),
          singleValue: (base) => ({
            ...base,
            color: 'white',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            overflow: 'hidden',
            zIndex: 50
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
            color: state.isFocused ? '#d4af37' : 'white',
            cursor: 'pointer',
            padding: '0.75rem 1rem',
            '&:active': {
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
            }
          }),
          placeholder: (base) => ({
            ...base,
            color: 'rgba(255, 255, 255, 0.3)',
          })
        }}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
}
