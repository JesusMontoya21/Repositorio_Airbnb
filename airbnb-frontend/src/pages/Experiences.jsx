import { useState, useRef, useEffect, useCallback } from 'react';

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
        description="¿Traes a un animal de servicio?"
        type="pets"
        count={guestCounts.pets}
      />
    </div>
  );
};


// --- Componente de Carrusel de Experiencias ---
const ExperienceCarousel = ({ title, experiences }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-300 hover:border-gray-900 hover:shadow-md transition-all"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-300 hover:border-gray-900 hover:shadow-md transition-all"
            aria-label="Siguiente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="flex-none w-72 group cursor-pointer"
          >
            <div className="relative h-72 rounded-xl overflow-hidden mb-3">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-semibold">
                {exp.category}
              </div>
              {exp.rating && (
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center space-x-1">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-sm font-semibold">{exp.rating}</span>
                </div>
              )}
            </div>
            <div className="px-1">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {exp.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {exp.location}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{exp.duration}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Desde ${exp.price}</span>
                <span className="text-gray-600 text-sm"> por persona</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Componente Principal HOME ---
export default function Experiences() {
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

  // Datos de experiencias
  const experienciasOriginales = [
    {
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
      category: 'Original',
      title: 'Tour de Mezcalería con cóctel',
      location: 'Ciudad de México',
      duration: '2 horas',
      rating: '4.95',
      price: '1,200'
    },
    {
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
      category: 'Original',
      title: 'Taller nacional con un estudio de danza especializado',
      location: 'Ciudad de México',
      duration: '3 horas',
      rating: '4.92',
      price: '850'
    },
    {
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      category: 'Cocina',
      title: 'Sesión de pintura budista sagrada',
      location: 'Ciudad de México',
      duration: '2 horas',
      rating: '4.88',
      price: '950'
    },
    {
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400',
      category: 'Bienestar',
      title: 'Empieza por clase tequila',
      location: 'Ciudad de México',
      duration: '1.5 horas',
      rating: '4.90',
      price: '780'
    },
    {
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
      category: 'Original',
      title: 'Colorea nuestra artística en una ceremonia',
      location: 'Ciudad de México',
      duration: '3 horas',
      rating: '4.87',
      price: '1,100'
    }
  ];

  const experienciasCiudadMexico = [
    {
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400',
      category: 'Alimentos',
      title: 'Clase de cocina con degustación de mezcal',
      location: 'Ciudad de México',
      duration: '3 horas',
      rating: '4.92',
      price: '1,500'
    },
    {
      image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400',
      category: 'Recorridos',
      title: 'Tour a Teotihuacán',
      location: 'Teotihuacán',
      duration: '8 horas',
      rating: '4.85',
      price: '2,300'
    },
    {
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
      category: 'Original',
      title: 'Clase de mezcal y cochinita',
      location: 'Ciudad de México',
      duration: '2.5 horas',
      rating: '4.91',
      price: '1,200'
    },
    {
      image: 'https://images.unsplash.com/photo-1473492201326-7c01dd2e596b?w=400',
      category: 'Recorridos',
      title: 'Descubre la magia de Xochimilco',
      location: 'Xochimilco',
      duration: '4 horas',
      rating: '4.88',
      price: '980'
    },
    {
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400',
      category: 'Bienestar',
      title: 'Temazcal tradicional mexicano',
      location: 'Ciudad de México',
      duration: '2 horas',
      rating: '4.93',
      price: '850'
    }
  ];

  const experienciasGuadalajara = [
    {
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      category: 'Alimentos',
      title: 'Tour a los Tequilas y Cantaritos',
      location: 'Tlaquepaque, Guadalajara',
      duration: '4 horas',
      rating: '4.93',
      price: '1,800'
    },
    {
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
      category: 'Recorridos',
      title: 'Recorre la ruta del tequila desde Guadalajara',
      location: 'Tequila, Jalisco',
      duration: '7 horas',
      rating: '4.87',
      price: '2,500'
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      category: 'Recorridos',
      title: 'Visita la villa del tequila con mariachis',
      location: 'Tequila, Jalisco',
      duration: '6 horas',
      rating: '4.90',
      price: '2,200'
    },
    {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      category: 'Bienestar',
      title: 'Descubre tu Tequila y los mariachis',
      location: 'Guadalajara',
      duration: '3 horas',
      rating: '4.86',
      price: '1,400'
    },
    {
      image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400',
      category: 'Original',
      title: 'Pub Crawl: Tour de bares guadalajara',
      location: 'Guadalajara',
      duration: '4 horas',
      rating: '4.89',
      price: '750'
    }
  ];

  const experienciasZapopan = [
    {
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400',
      category: 'Alimentos',
      title: 'Lucha Libre en Martes de Glamour',
      location: 'Zapopan',
      duration: '3 horas',
      rating: '4.94',
      price: '950'
    },
    {
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
      category: 'Original',
      title: 'Experiencia de Martes VIP',
      location: 'Zapopan',
      duration: '4 horas',
      rating: '4.89',
      price: '1,600'
    },
    {
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400',
      category: 'Recorridos',
      title: 'Recorre la hermosa Guadalajara',
      location: 'Zapopan',
      duration: '5 horas',
      rating: '4.91',
      price: '1,300'
    },
    {
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400',
      category: 'Deportes',
      title: 'Grita y celebra con las Chivas',
      location: 'Zapopan',
      duration: '3 horas',
      rating: '4.87',
      price: '2,100'
    },
    {
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
      category: 'Arte',
      title: 'Descubre el arte de Zapopan',
      location: 'Zapopan',
      duration: '2.5 horas',
      rating: '4.92',
      price: '890'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con búsqueda estilo Airbnb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          
          {/* Barra de búsqueda con manejo de clic fuera */}
          <div 
            className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            ref={searchRef} 
          >
            <div className="flex items-center divide-x divide-gray-200">
              
              {/* 1. Destino */}
              <div 
                className={`relative flex-1 py-2.5 pl-8 pr-6 cursor-pointer rounded-l-full transition-all duration-200 ${isDestinationOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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
                
                {/* Despliegue de Sugerencias de Destino */}
                {isDestinationOpen && (
                  <DestinationSuggestions onSelectCity={handleSelectCity} />
                )}
              </div>

              {/* 2. Fechas */}
              <div 
                className={`relative flex-1 py-2.5 px-6 cursor-pointer transition-all duration-200 ${isDatesOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('dates')}
              >
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">
                  Fechas
                </label>
                <div className="text-sm text-gray-500">
                  {datesDisplay}
                </div>
              </div>

              {/* 3. Huéspedes */}
              <div 
                className={`relative flex-1 flex items-center py-2.5 pl-6 pr-2 cursor-pointer rounded-r-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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
                
                {/* Botón de búsqueda */}
                <button className="bg-[#FF385C] hover:bg-[#E0314F] text-white rounded-full p-3.5 ml-4 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* Selector de huéspedes */}
                {isGuestsOpen && (
                  <GuestsSelector 
                    guests={filters.guests}
                    onSelectGuests={handleSelectGuests}
                    onClose={() => setIsGuestsOpen(false)}
                  />
                )}
              </div>
            </div>
            
            {/* DateRangePicker */}
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

      {/* Carruseles de Experiencias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ExperienceCarousel 
          title="Airbnb Originales"
          experiences={experienciasOriginales}
        />
        
        <ExperienceCarousel 
          title="Popular entre los viajeros de tu zona"
          experiences={experienciasCiudadMexico}
        />
        
        <ExperienceCarousel 
          title="Experiencias en Guadalajara"
          experiences={experienciasGuadalajara}
        />
        
        <ExperienceCarousel 
          title="Experiencias en Zapopan"
          experiences={experienciasZapopan}
        />
      </div>
    </div>
  );
}