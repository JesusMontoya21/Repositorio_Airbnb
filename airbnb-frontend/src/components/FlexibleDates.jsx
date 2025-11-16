import React, { useState } from 'react';

export default function FlexibleDates({ onSelectFlexible }) {
  const [duration, setDuration] = useState('weekend');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  // Generar los próximos 12 meses
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        name: date.toLocaleDateString('es-ES', { month: 'long' }),
        year: date.getFullYear(),
        value: `${date.getFullYear()}-${date.getMonth()}`
      });
    }
    return months;
  };

  const months = generateMonths();

  const handleMonthClick = (monthValue) => {
    const newSelectedMonths = selectedMonths.includes(monthValue) 
      ? selectedMonths.filter(m => m !== monthValue)
      : [...selectedMonths, monthValue];
    
    setSelectedMonths(newSelectedMonths);
    
    // Llamar callback si existe
    if (onSelectFlexible) {
      onSelectFlexible({
        duration,
        months: newSelectedMonths
      });
    }
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    
    if (onSelectFlexible) {
      onSelectFlexible({
        duration: newDuration,
        months: selectedMonths
      });
    }
  };

  const scrollMonths = (direction) => {
    if (direction === 'left' && currentMonthIndex > 0) {
      setCurrentMonthIndex(prev => prev - 1);
    } else if (direction === 'right' && currentMonthIndex < months.length - 6) {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const visibleMonths = months.slice(currentMonthIndex, currentMonthIndex + 6);

  return (
    <div className="space-y-8 py-4">
      {/* Duración */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">
          ¿Cuánto tiempo te gustaría quedarte?
        </h3>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleDurationChange('weekend')}
            className={`py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
              duration === 'weekend'
                ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            Fin de semana
          </button>
          <button
            onClick={() => handleDurationChange('week')}
            className={`py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
              duration === 'week'
                ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => handleDurationChange('month')}
            className={`py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
              duration === 'month'
                ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* Selección de meses */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">¿Cuándo quieres ir?</h3>
        
        <div className="relative">
          {/* Botón izquierdo */}
          {currentMonthIndex > 0 && (
            <button
              onClick={() => scrollMonths('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Grid de meses */}
          <div className="grid grid-cols-6 gap-3">
            {visibleMonths.map((month) => (
              <button
                key={month.value}
                onClick={() => handleMonthClick(month.value)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all ${
                  selectedMonths.includes(month.value)
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-900 bg-white'
                }`}
              >
                <svg 
                  className={`w-8 h-8 mb-2 ${
                    selectedMonths.includes(month.value)
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {month.name}
                  </div>
                  <div className="text-xs text-gray-500">{month.year}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Botón derecho */}
          {currentMonthIndex < months.length - 6 && (
            <button
              onClick={() => scrollMonths('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Resumen de selección */}
      {selectedMonths.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {selectedMonths.length} {selectedMonths.length === 1 ? 'mes seleccionado' : 'meses seleccionados'}
            </span>
            {' '}para estancias de{' '}
            <span className="font-semibold text-gray-900">
              {duration === 'weekend' ? 'fin de semana' : duration === 'week' ? 'una semana' : 'un mes'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}