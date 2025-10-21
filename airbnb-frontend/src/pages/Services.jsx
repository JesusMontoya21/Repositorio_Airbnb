import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Mock de la API para que el componente sea runnable
const propertiesAPI = {
  getAll: async (filters) => {
    console.log('Fetching properties with filters:', filters);
    // Simula una respuesta de API con una lista vacía
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockData = {
      data: [
      ],
      meta: { total: 0 }
    };
    return { data: mockData };
  }
};

// --- Datos de Servicios Mock ---
const chefServices = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400',
    title: 'Cocina hiperlócal con ingredientes silvestres con Clek',
    price: 1822,
    rating: 5.0,
    location: 'México'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    title: 'Comida romana auténtica',
    price: 1993,
    rating: 4.97,
    location: 'Italia'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400',
    title: 'Destrás de la llama y los sabores de fusión coreano',
    price: 1300,
    rating: 5.0,
    location: 'Corea'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    title: 'Cocina catalana con Cristina',
    price: 869,
    rating: 4.96,
    location: 'España'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    title: 'Cena privada de lujo con el chef Matsuhisa',
    price: 3027,
    rating: 4.50,
    location: 'Japón'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    title: 'Menús vibrantes de Cali-Mediterráneo por Lisa',
    price: 3129,
    rating: 4.98,
    location: 'Estados Unidos'
  }
];

const trainingServices = [
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400',
    title: 'Entrenamiento personal con Deyten',
    price: 184,
    rating: 4.71,
    location: 'Miami, Estados Unidos'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    title: 'Entrenamiento corporal total con Peter',
    price: 893,
    rating: 5.0,
    location: 'Pasadena, Estados Unidos'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    title: 'Yoga y encarnación con Julia',
    price: 460,
    rating: 4.94,
    location: 'Virtual'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    title: 'Entrenamiento personal y fitness en grupo',
    price: 1534,
    rating: 5.0,
    location: 'Westmount, Canadá'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400',
    title: 'Entrenamientos intensos con Vicky',
    price: 2946,
    rating: 4.92,
    location: 'Redondo Beach, Estados Unidos'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    title: 'Entrenamiento reparador con Tayler',
    price: 820,
    rating: 4.86,
    location: 'Los Ángeles, Estados Unidos'
  }
];

const massageServices = [
  {
    id: 13,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400',
    title: 'Relajación y masaje de tejido profundo con Javier',
    price: 950,
    rating: 5.0,
    location: 'Virtual'
  },
  {
    id: 14,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
    title: 'Masaje de aromaterapia con Jenna',
    price: 3313,
    rating: 4.89,
    location: 'Falmouth, Estados Unidos'
  },
  {
    id: 15,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    title: 'Baño japonés de té matcha',
    price: 32701,
    rating: 4.95,
    location: 'Virtual'
  },
  {
    id: 16,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400',
    title: 'Masaje de tejidos profundos por Olga',
    price: 1850,
    rating: 5.0,
    location: 'Virtual'
  },
  {
    id: 17,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
    title: 'El lujo del escape de masajes',
    price: 3688,
    rating: 4.50,
    location: 'Virtual'
  },
  {
    id: 18,
    image: 'https://images.unsplash.com/photo-1591343395902-bae4ffe06925?w=400',
    title: 'Recuperación y relajación con Daisy',
    price: 3102,
    rating: 4.33,
    location: 'Los Ángeles, Estados Unidos'
  }
];

// --- UTILERÍA DE FECHAS Y MESES ---
const getMonthDetails = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
  
  return { year, month, firstDay, daysInMonth, monthName };
};

const formatDateDisplayShort = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/g, '');
};

// --- Componente ServiceCarousel ---
const ServiceCarousel = ({ title, services }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkArrows = () => {
    const container = scrollRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkArrows);
      checkArrows();
      return () => container.removeEventListener('scroll', checkArrows);
    }
  }, []);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <button className="text-sm font-semibold text-gray-900 hover:underline flex items-center">
          Ver todo
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="flex-none w-72 cursor-pointer group/card"
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-3">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400';
                  }}
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-white stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="px-1">
                <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                  {service.title}
                </p>
                <div className="flex items-center mb-2">
                  <span className="text-xs font-semibold">★ {service.rating}</span>
                </div>
                <div>
                  <span className="text-sm">Desde </span>
                  <span className="font-semibold text-gray-900">${service.price} MXN</span>
                  <span className="text-sm text-gray-600"> por participante</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// --- Componente Selector de Duración por Mes (MonthDurationPicker) ---
const MonthDurationPicker = ({ onSelectDuration, onSelectDate }) => {
    const [duration, setDuration] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const durations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + duration, 1);
    
    const startDateDisplay = formatDateDisplayShort(startDate.toISOString().split('T')[0]);
    const endDateDisplay = formatDateDisplayShort(endDate.toISOString().split('T')[0]);

    const Dial = () => (
        <div className="relative w-64 h-64 flex items-center justify-center mx-auto my-8">
            <div className="absolute w-full h-full rounded-full border-2 border-white/50 bg-white shadow-xl">
                {durations.map((d) => {
                    const angle = (360 / durations.length) * (d - 1) - 90;
                    return (
                        <div
                            key={d}
                            className="absolute inset-0 flex justify-center items-start"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${d <= duration ? 'bg-gray-400' : 'bg-gray-300'}`} style={{ transform: 'translateY(15px)' }}></div>
                        </div>
                    );
                })}
            </div>

            <div
                className="absolute w-full h-full transition-transform duration-300"
                style={{ transform: `rotate(${(360 / durations.length) * (duration - 1) - 90}deg)` }}
            >
                <button 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full shadow-lg bg-[#FF385C] border-2 border-white"
                    onClick={() => setDuration(prev => (prev % 12) + 1)}
                    aria-label="Ajustar duración"
                >
                    <div className="w-5 h-5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </button>
            </div>
            
            <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center bg-white shadow-inner-xl relative z-10">
                <span className="text-5xl font-extrabold text-gray-900">{duration}</span>
                <span className="text-base font-semibold text-gray-700">mes</span>
            </div>
            
             <style jsx>{`
                .shadow-inner-xl {
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05), inset 0 4px 6px 0 rgba(0, 0, 0, 0.05), 
                                0 0 0 1px rgba(0, 0, 0, 0.05);
                }
            `}</style>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium text-gray-800 mb-6 mt-4">¿En qué fechas viajas?</h3>
            
            <Dial />
            
            <div className="text-center mt-6 text-base font-medium text-gray-700">
                <span className="underline cursor-pointer hover:text-gray-900 transition-colors">
                    {startDateDisplay}
                </span>
                <span className="mx-1 font-normal text-gray-500">al</span>
                <span className="underline cursor-pointer hover:text-gray-900 transition-colors">
                    {endDateDisplay}
                </span>
            </div>
            
            <button 
                className="mt-6 text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))}
            >
                Cambiar mes de inicio (Ej. {new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })})
            </button>
        </div>
    );
};

// --- Componente de Calendario de Fechas ---
const Day = ({ day, monthDate, checkInDate, checkOutDate, handleDayClick }) => {
    const today = new Date();
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    
    const checkIn = checkInDate ? new Date(checkInDate) : null;
    const checkOut = checkOutDate ? new Date(checkOutDate) : null;
    
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = (checkIn && dateString === checkInDate) || (checkOut && dateString === checkOutDate);
    const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;
    
    const isDisabled = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    let baseClasses = `w-10 h-10 flex items-center justify-center text-sm rounded-full transition-colors duration-150 relative z-10`;
    let textClasses = 'text-gray-900';
    let bgClasses = 'hover:border hover:border-gray-900'; 

    if (isDisabled) {
        textClasses = 'text-gray-300 pointer-events-none';
        bgClasses = '';
    } else if (isSelected) {
      bgClasses = 'bg-gray-900';
      textClasses = 'text-white font-semibold';
    } else if (isInRange) {
      bgClasses = 'bg-gray-100 rounded-none'; 
      textClasses = 'text-gray-900';
    } else if (isToday) {
      textClasses = 'font-semibold underline';
    }

    return (
      <div 
        className={`relative w-10 h-10 ${isInRange ? 'bg-gray-100' : 'bg-transparent'}`}
        onClick={isDisabled ? null : () => handleDayClick(date)}
      >
        {isSelected && (
            <div className={`absolute inset-0 z-0 ${isInRange ? 'bg-gray-100' : 'bg-transparent'}`}></div>
        )}
        
        <button
          className={`${baseClasses} ${bgClasses} ${textClasses}`}
          disabled={isDisabled}
        >
            {day}
        </button>
        
        {isInRange && (
            <div className={`absolute top-0 bottom-0 left-0 right-0 z-0 ${bgClasses}`}></div>
        )}
      </div>
    );
  };

const Month = ({ monthDate, checkInDate, checkOutDate, handleDayClick }) => {
    const { year, month, firstDay, daysInMonth, monthName } = getMonthDetails(monthDate);
    
    const daysOfWeek = ['D', 'L', 'M', 'J', 'V', 'S'];
    
    const calendarDays = [];
    
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(
        <Day
          key={day}
          day={day}
          monthDate={monthDate}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          handleDayClick={handleDayClick}
        />
      );
    }

    return (
      <div className="w-1/2 px-4">
        <h4 className="text-base font-medium mb-4 capitalize text-gray-800">
          {monthName} {year}
        </h4>
        
        <div className="grid grid-cols-7 gap-y-2 mb-2">
          {daysOfWeek.map(day => (
            <span key={day} className="text-center text-xs font-semibold text-gray-500 w-10">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {calendarDays}
        </div>
      </div>
    );
  };

// --- Componente Principal DateRangePicker ---
const DateRangePicker = ({ checkIn, checkOut, onSelectDate, onClose }) => {
  const [activeTab, setActiveTab] = useState('Fechas');
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [nextMonth, setNextMonth] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 1));

  const changeMonth = (offset) => {
    const newCurrent = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newCurrent);
    setNextMonth(new Date(newCurrent.getFullYear(), newCurrent.getMonth() + 1, 1));
  };
  
  const handleDayClick = (dayDate) => {
    const dateString = dayDate.toISOString().split('T')[0];
    
    if (!checkIn) {
      onSelectDate({ check_in: dateString, check_out: '' });
    } 
    else if (dayDate < new Date(checkIn)) {
        onSelectDate({ check_in: dateString, check_out: '' });
    }
    else if (!checkOut || dayDate > new Date(checkIn)) {
      onSelectDate({ check_in: checkIn, check_out: dateString });
    } 
    else {
      onSelectDate({ check_in: dateString, check_out: '' });
    }
  };
  
  const flexibilityOptions = [
      { label: 'Fechas exactas', value: 0 },
      { label: '± 1 día', value: 1 },
      { label: '± 2 días', value: 2 },
      { label: '± 3 días', value: 3 },
      { label: '± 7 días', value: 7 },
      { label: '± 14 días', value: 14 },
  ];
  
  const checkInISO = checkIn;
  const checkOutISO = checkOut;

  return (
    <div className="absolute top-full left-0 mt-4 p-6 w-full bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="p-1 bg-gray-100 rounded-full flex space-x-1">
          {['Fechas', 'Meses', 'Flexible'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === tab 
                  ? 'bg-white shadow-md text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Fechas' && (
        <>
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="Mes anterior"
              >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              
              <div className="flex w-full justify-center">
                <Month 
                  monthDate={currentMonth} 
                  checkInDate={checkInISO} 
                  checkOutDate={checkOutISO} 
                  handleDayClick={handleDayClick}
                />
                <Month 
                  monthDate={nextMonth} 
                  checkInDate={checkInISO} 
                  checkOutDate={checkOutISO} 
                  handleDayClick={handleDayClick}
                />
              </div>

              <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="Mes siguiente"
              >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center space-x-3">
                {flexibilityOptions.map(option => (
                    <button
                        key={option.value}
                        className={`py-2 px-4 text-sm rounded-full transition-colors duration-150 ${
                            option.value === 0 
                                ? 'bg-gray-900 text-white font-medium' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-900'
                        }`}
                        onClick={() => console.log('Flexibilidad seleccionada:', option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </>
      )}
      
      {activeTab === 'Meses' && (
          <MonthDurationPicker 
              onSelectDuration={(duration) => console.log('Duración en meses:', duration)} 
              onSelectDate={(date) => console.log('Mes de inicio:', date)}
          />
      )}
      
      {activeTab === 'Flexible' && (
          <div className="text-center py-10 text-gray-500">
              <p>Elige un rango de duración y un mes de inicio para tu estancia flexible.</p>
          </div>
      )}

    </div>
  );
};

// --- Componente de Sugerencias de Destino ---
const DestinationSuggestions = ({ onSelectCity }) => {
  const suggestions = [
    { name: 'Por la zona', description: 'Descubre qué hay a tu alrededor', icon: '✈️', color: 'text-blue-500 bg-blue-50' },
    { name: 'San Carlos, Sonora', description: 'Popular entre los viajeros de tu zona', icon: '🏙️', color: 'text-gray-500 bg-gray-100' },
    { name: 'Guadalajara, Jalisco', description: 'Por lugares de interés como este: Catedral de Guadalajara', icon: '🏰', color: 'text-yellow-600 bg-yellow-50' },
    { name: 'Mazatlán, Sinaloa', description: 'Un destino de playa popular', icon: '🏖️', color: 'text-pink-500 bg-pink-50' },
    { name: 'Ciudad Obregón, Sonora', description: 'Popular entre los viajeros de tu zona', icon: '🌊', color: 'text-cyan-500 bg-cyan-50' },
    { name: 'Bahía de Kino, Sonora', description: 'Ideal para escapadas de fin de semana', icon: '🐠', color: 'text-teal-500 bg-teal-50' },
    { name: 'Tucson, Estados Unidos', description: 'Por lugares de interés como este: Museo del Desierto de Arizona-Sonora', icon: '🏜️', color: 'text-orange-500 bg-orange-50' },
    { name: 'Monterrey, Nuevo León', description: 'Por lugares de interés como este: Parque Fundidora', icon: '🏭', color: 'text-red-500 bg-red-50' },
    { name: 'Phoenix, Estados Unidos', description: 'Para un viaje al extranjero', icon: '🇺🇸', color: 'text-purple-500 bg-purple-50' },
    { name: 'Playa del Carmen, Quintana Roo', description: 'Un destino de playa popular', icon: '🌴', color: 'text-amber-500 bg-amber-50' },
    { name: 'Cancún, Quintana Roo', description: 'Por su animada vida nocturna', icon: '🍹', color: 'text-green-500 bg-green-50' },
    { name: 'Álamos, Sonora', description: 'Popular entre los viajeros de tu zona', icon: '🌳', color: 'text-lime-500 bg-lime-50' },
    { name: 'Los Mochis, Sinaloa', description: 'Una joya escondida', icon: '✨', color: 'text-fuchsia-500 bg-fuchsia-50' },
    { name: 'Nogales, Sonora', description: 'Fuera de las rutas más transitadas', icon: '🚧', color: 'text-sky-500 bg-sky-50' },
    { name: 'Puerto Peñasco, Sonora', description: 'Un destino de playa popular', icon: '🚤', color: 'text-yellow-700 bg-yellow-100' },
    { name: 'Flagstaff, Estados Unidos', description: 'Para los amantes de la naturaleza', icon: '🏔️', color: 'text-emerald-500 bg-emerald-50' },
    { name: 'Ensenada, Baja California', description: 'Por su exquisita gastronomía', icon: '🦤', color: 'text-cyan-600 bg-cyan-100' },
    { name: 'Zapopan, Jalisco', description: 'Por lugares de interés como este: Basílica de Nuestra Señora de Zapopan', icon: '⛪', color: 'text-blue-400 bg-blue-100' },
    { name: 'La Paz, Baja California Sur', description: 'Para los amantes de la naturaleza', icon: '🐳', color: 'text-red-400 bg-red-100' },
    { name: 'Mexicali, Baja California', description: 'Destino popular', icon: '☀️', color: 'text-green-400 bg-green-100' },
    { name: 'Culiacán, Sinaloa', description: 'Una joya escondida', icon: '💎', color: 'text-pink-400 bg-pink-100' },
  ];

  return (
    <div className="absolute top-full left-0 mt-4 p-4 w-[450px] bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 px-2 text-gray-800">Sugerencias de destinos</h3>
      
      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <ul>
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectCity(item.name.split(',')[0].trim())}
            >
              <div className={`p-3 rounded-xl flex items-center justify-center w-12 h-12 ${item.color}`}>
                <span className="text-xl leading-none">{item.icon}</span>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

// --- Componente Selector de Huéspedes ---
const GuestsSelector = ({ guests, onSelectGuests, onClose }) => {
  const [guestCounts, setGuestCounts] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: 0
  });

  useEffect(() => {
    const total = guestCounts.adults + guestCounts.children;
    onSelectGuests({ 
      guests: total,
      ...guestCounts
    });
  }, [guestCounts, onSelectGuests]);

  const increment = (type) => {
    setGuestCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const decrement = (type) => {
    setGuestCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const GuestRow = ({ label, description, type, count }) => (
    <div className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => decrement(type)}
          disabled={count === 0}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
            count === 0 
              ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
              : 'border-gray-400 text-gray-600 hover:border-gray-900'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <span className="w-8 text-center font-medium text-gray-900">{count}</span>
        
        <button
          onClick={() => increment(type)}
          className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-gray-900 flex items-center justify-center transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute top-full right-0 mt-4 p-6 w-96 bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <GuestRow
        label="Adultos"
        description="13 años o más"
        type="adults"
        count={guestCounts.adults}
      />
      <GuestRow
        label="Niños"
        description="De 2 a 12 años"
        type="children"
        count={guestCounts.children}
      />
      <GuestRow
        label="Bebés"
        description="Menos de 2"
        type="babies"
        count={guestCounts.babies}
      />
      <GuestRow
        label="Mascotas"
        description={
          <span className="underline cursor-pointer hover:text-gray-700">
            ¿Traes a un animal de servicio?
          </span>
        }
        type="pets"
        count={guestCounts.pets}
      />
    </div>
  );
};

// --- Componente Principal HOME ---
export default function Services() {
  const [filters, setFilters] = useState({
    city: '',
    check_in: '',
    check_out: '',
    guests: 0,
  });
  
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false); 
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  
  const searchRef = useRef(null); 
  
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertiesAPI.getAll(filters).then(res => res.data),
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleSelectCity = (city) => {
    setFilters(prev => ({ ...prev, city }));
    setIsDestinationOpen(false); 
  };
  
  const handleSelectDates = useCallback((newDates) => {
    setFilters(prev => ({ ...prev, ...newDates }));
  }, []);
  
  const handleSelectGuests = useCallback((guestData) => {
    setFilters(prev => ({ ...prev, ...guestData }));
  }, []);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDestinationOpen(false);
        setIsDatesOpen(false); 
        setIsGuestsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSearchClick = (section) => {
      setIsDestinationOpen(false);
      setIsDatesOpen(false); 
      setIsGuestsOpen(false);

      if (section === 'destination') {
          setIsDestinationOpen(true);
      } else if (section === 'dates') {
          setIsDatesOpen(true);
      } else if (section === 'guests') {
          setIsGuestsOpen(true);
      }
  };

  const formatDateDisplay = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  const datesDisplay = filters.check_in && filters.check_out 
    ? `${formatDateDisplay(filters.check_in)} - ${formatDateDisplay(filters.check_out)}`
    : filters.check_in
        ? `${formatDateDisplay(filters.check_in)} - Salida`
        : 'Agregar fechas';

  const guestsDisplay = filters.guests > 0 
    ? `${filters.guests} huésped${filters.guests > 1 ? 'es' : ''}`
    : '¿Cuántos?';

  return (
    <div>
      {/* Hero Section con búsqueda estilo Airbnb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          
          <div 
            className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            ref={searchRef} 
          >
            <div className="flex items-center divide-x divide-gray-200">
              
              <div 
                className={`relative flex-1 py-2.5 pl-8 pr-6 cursor-pointer rounded-full transition-all duration-200 ${isDestinationOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('destination')}
              >
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">
                  Destino
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Buscar destinos"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full text-sm text-gray-500 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                
                {isDestinationOpen && (
                  <DestinationSuggestions onSelectCity={handleSelectCity} />
                )}
              </div>

              <div 
                className={`relative flex-1 py-2.5 px-6 cursor-pointer rounded-full transition-all duration-200 ${isDatesOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('dates')}
              >
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">
                  Fechas
                </label>
                <div className="text-sm text-gray-500">
                  {datesDisplay}
                </div>
              </div>

              <div 
                className={`relative flex-1 flex items-center py-2.5 pl-6 pr-2 cursor-pointer rounded-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('guests')}
              >
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">
                    Huéspedes
                  </label>
                  <div className="text-sm text-gray-500">
                    {guestsDisplay}
                  </div>
                </div>
                
                <button className="bg-[#FF385C] hover:bg-[#E0314F] text-white rounded-full p-3.5 ml-4 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {isGuestsOpen && (
                  <GuestsSelector 
                    guests={filters.guests}
                    onSelectGuests={handleSelectGuests}
                    onClose={() => setIsGuestsOpen(false)}
                  />
                )}
              </div>
            </div>
            
            {isDatesOpen && (
                <DateRangePicker 
                  checkIn={filters.check_in} 
                  checkOut={filters.check_out} 
                  onSelectDate={handleSelectDates}
                  onClose={() => setIsDatesOpen(false)}
                />
            )}
            
          </div>
        </div>
      </div>

      {/* Carruseles de Servicios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ServiceCarousel 
          title="Chefs"
          services={chefServices}
        />
        
        <ServiceCarousel 
          title="Entrenamiento"
          services={trainingServices}
        />
        
        <ServiceCarousel 
          title="Masaje"
          services={massageServices}
        />
      </div>


    </div>
  );
}