import { useState, useRef, useEffect, useCallback } from 'react';

const getMonthDetails = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
  return { year, month, firstDay, daysInMonth, monthName };
};

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

  if (isDisabled) { textClasses = 'text-gray-300 pointer-events-none'; bgClasses = ''; }
  else if (isSelected) { bgClasses = 'bg-gray-900'; textClasses = 'text-white font-semibold'; }
  else if (isInRange) { bgClasses = 'bg-gray-100 rounded-none'; textClasses = 'text-gray-900'; }
  else if (isToday) { textClasses = 'font-semibold underline'; }

  return (
    <div className={`relative w-10 h-10 ${isInRange ? 'bg-gray-100' : 'bg-transparent'}`} onClick={isDisabled ? null : () => handleDayClick(date)}>
      <button className={`${baseClasses} ${bgClasses} ${textClasses}`} disabled={isDisabled}>{day}</button>
    </div>
  );
};

const Month = ({ monthDate, checkInDate, checkOutDate, handleDayClick }) => {
  const { year, firstDay, daysInMonth, monthName } = getMonthDetails(monthDate);
  const daysOfWeek = ['D', 'L', 'M', 'J', 'V', 'S'];
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(<Day key={day} day={day} monthDate={monthDate} checkInDate={checkInDate} checkOutDate={checkOutDate} handleDayClick={handleDayClick} />);
  }
  return (
    <div className="w-1/2 px-4">
      <h4 className="text-base font-medium mb-4 capitalize text-gray-800">{monthName} {year}</h4>
      <div className="grid grid-cols-7 gap-y-2 mb-2">
        {daysOfWeek.map(day => <span key={day} className="text-center text-xs font-semibold text-gray-500 w-10">{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2">{calendarDays}</div>
    </div>
  );
};

const DateRangePicker = ({ checkIn, checkOut, onSelectDate }) => {
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
    if (!checkIn) onSelectDate({ check_in: dateString, check_out: '' });
    else if (dayDate < new Date(checkIn)) onSelectDate({ check_in: dateString, check_out: '' });
    else if (!checkOut || dayDate > new Date(checkIn)) onSelectDate({ check_in: checkIn, check_out: dateString });
    else onSelectDate({ check_in: dateString, check_out: '' });
  };

  return (
    <div className="absolute top-full left-0 mt-4 p-6 w-full bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="p-1 bg-gray-100 rounded-full flex space-x-1">
          {['Fechas', 'Flexible'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === tab ? 'bg-white shadow-md text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'Fechas' && (
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div className="flex w-full justify-center">
            <Month monthDate={currentMonth} checkInDate={checkIn} checkOutDate={checkOut} handleDayClick={handleDayClick} />
            <Month monthDate={nextMonth} checkInDate={checkIn} checkOutDate={checkOut} handleDayClick={handleDayClick} />
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      )}
      {activeTab === 'Flexible' && (
        <div className="text-center py-10 text-gray-500">
          <p>Elige un rango de duración y un mes de inicio para tu estancia flexible.</p>
        </div>
      )}
    </div>
  );
};

const DestinationSuggestions = ({ onSelectCity }) => {
  const suggestions = [
    { name: 'Por la zona', description: 'Descubre servicios cerca de ti', icon: '✈️', color: 'text-blue-500 bg-blue-50' },
    { name: 'Ciudad de México', description: 'Amplia variedad de servicios', icon: '🏙️', color: 'text-gray-500 bg-gray-100' },
    { name: 'Guadalajara, Jalisco', description: 'Servicios premium', icon: '🏰', color: 'text-yellow-600 bg-yellow-50' },
    { name: 'Mazatlán, Sinaloa', description: 'Servicios en la playa', icon: '🏖️', color: 'text-pink-500 bg-pink-50' },
    { name: 'Cancún, Quintana Roo', description: 'Servicios de lujo', icon: '🌴', color: 'text-green-500 bg-green-50' },
    { name: 'Monterrey, Nuevo León', description: 'Servicios ejecutivos', icon: '🏭', color: 'text-red-500 bg-red-50' },
  ];
  return (
    <div className="absolute top-full left-0 mt-4 p-4 w-[450px] bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 px-2 text-gray-800">Sugerencias de destinos</h3>
      <ul>
        {suggestions.map((item, index) => (
          <li key={index} className="flex items-center space-x-4 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onSelectCity(item.name.split(',')[0].trim())}>
            <div className={`p-3 rounded-xl flex items-center justify-center w-12 h-12 ${item.color}`}>
              <span className="text-xl">{item.icon}</span>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const GuestsSelector = ({ onSelectGuests }) => {
  const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, babies: 0, pets: 0 });
  useEffect(() => {
    onSelectGuests({ guests: guestCounts.adults + guestCounts.children, ...guestCounts });
  }, [guestCounts, onSelectGuests]);

  const GuestRow = ({ label, description, type, count }) => (
    <div className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0">
      <div><p className="font-medium text-gray-900">{label}</p><p className="text-sm text-gray-500">{description}</p></div>
      <div className="flex items-center space-x-4">
        <button onClick={() => setGuestCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))} disabled={count === 0}
          className={`w-8 h-8 rounded-full border flex items-center justify-center ${count === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-gray-900'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <span className="w-8 text-center font-medium text-gray-900">{count}</span>
        <button onClick={() => setGuestCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))}
          className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-gray-900 flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute top-full right-0 mt-4 p-6 w-96 bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <GuestRow label="Adultos" description="13 años o más" type="adults" count={guestCounts.adults} />
      <GuestRow label="Niños" description="De 2 a 12 años" type="children" count={guestCounts.children} />
      <GuestRow label="Bebés" description="Menos de 2" type="babies" count={guestCounts.babies} />
      <GuestRow label="Mascotas" description="¿Traes a un animal de servicio?" type="pets" count={guestCounts.pets} />
    </div>
  );
};

const ServiceCarousel = ({ title, services, activeCategory }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  const checkArrows = () => {
    const c = scrollRef.current;
    if (c) { setShowLeft(c.scrollLeft > 0); setShowRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 10); }
  };

  useEffect(() => {
    const c = scrollRef.current;
    if (c) { c.addEventListener('scroll', checkArrows); checkArrows(); return () => c.removeEventListener('scroll', checkArrows); }
  }, []);

  const filtered = activeCategory === 'Todos' ? services : services.filter(s => s.category === activeCategory);
  if (filtered.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title} →</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-300 hover:shadow-md transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-300 hover:shadow-md transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {filtered.map((service) => (
          <div key={service.id} className="flex-none w-72 cursor-pointer group">
            <div className="relative h-64 rounded-xl overflow-hidden mb-3">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <button className="absolute top-3 right-3 text-white hover:scale-110 transition" onClick={(e) => e.preventDefault()}>
                <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              {service.category && (
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-semibold">{service.category}</div>
              )}
            </div>
            <div className="px-1">
              <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{service.title}</p>
              <p className="text-xs text-gray-500 mb-1">{service.location}</p>
              <div className="flex items-center mb-2">
                <span className="text-xs font-semibold">★ {service.rating}</span>
              </div>
              <p className="text-sm">
                <span className="text-gray-500">Desde </span>
                <span className="font-semibold">${service.price} MXN</span>
                <span className="text-gray-500"> por participante</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Services() {
  const [filters, setFilters] = useState({ city: '', check_in: '', check_out: '', guests: 0 });
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const searchRef = useRef(null);

  const categories = ['Todos', 'Chefs', 'Entrenamiento', 'Masaje', 'Bienestar', 'Belleza'];

  const handleSelectCity = (city) => { setFilters(prev => ({ ...prev, city })); setIsDestinationOpen(false); };
  const handleSelectDates = useCallback((newDates) => { setFilters(prev => ({ ...prev, ...newDates })); }, []);
  const handleSelectGuests = useCallback((guestData) => { setFilters(prev => ({ ...prev, ...guestData })); }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDestinationOpen(false); setIsDatesOpen(false); setIsGuestsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = (section) => {
    setIsDestinationOpen(false); setIsDatesOpen(false); setIsGuestsOpen(false);
    if (section === 'destination') setIsDestinationOpen(true);
    else if (section === 'dates') setIsDatesOpen(true);
    else if (section === 'guests') setIsGuestsOpen(true);
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  const datesDisplay = filters.check_in && filters.check_out
    ? `${formatDateDisplay(filters.check_in)} - ${formatDateDisplay(filters.check_out)}`
    : filters.check_in ? `${formatDateDisplay(filters.check_in)} - Salida` : 'Agregar fechas';

  const guestsDisplay = filters.guests > 0 ? `${filters.guests} huésped${filters.guests > 1 ? 'es' : ''}` : '¿Cuántos?';

  const chefServices = [
    { id: 1, image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400', category: 'Chefs', title: 'Cocina hiperlocal con ingredientes silvestres', price: 1822, rating: 5.0, location: 'Ciudad de México' },
    { id: 2, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', category: 'Chefs', title: 'Comida romana auténtica con el chef Marco', price: 1993, rating: 4.97, location: 'Ciudad de México' },
    { id: 3, image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', category: 'Chefs', title: 'Sabores de fusión coreano-mexicana', price: 1300, rating: 5.0, location: 'Guadalajara' },
    { id: 4, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', category: 'Chefs', title: 'Cocina de autor con Cristina', price: 869, rating: 4.96, location: 'Monterrey' },
    { id: 5, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', category: 'Chefs', title: 'Cena privada de lujo con el chef Matsuhisa', price: 3027, rating: 4.50, location: 'Cancún' },
    { id: 6, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', category: 'Chefs', title: 'Menú mediterráneo de temporada', price: 3129, rating: 4.98, location: 'Ciudad de México' },
  ];

  const trainingServices = [
    { id: 7, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400', category: 'Entrenamiento', title: 'Entrenamiento personal con Deyten', price: 184, rating: 4.71, location: 'Guadalajara' },
    { id: 8, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', category: 'Entrenamiento', title: 'Entrenamiento corporal total con Peter', price: 893, rating: 5.0, location: 'Ciudad de México' },
    { id: 9, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', category: 'Bienestar', title: 'Yoga y meditación con Julia', price: 460, rating: 4.94, location: 'Virtual' },
    { id: 10, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', category: 'Entrenamiento', title: 'Fitness en grupo y personal', price: 1534, rating: 5.0, location: 'Monterrey' },
    { id: 11, image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400', category: 'Entrenamiento', title: 'Entrenamientos intensos con Vicky', price: 2946, rating: 4.92, location: 'Cancún' },
    { id: 12, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', category: 'Bienestar', title: 'Entrenamiento reparador con Tayler', price: 820, rating: 4.86, location: 'Mazatlán' },
  ];

  const massageServices = [
    { id: 13, image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400', category: 'Masaje', title: 'Relajación y masaje de tejido profundo', price: 950, rating: 5.0, location: 'Ciudad de México' },
    { id: 14, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400', category: 'Masaje', title: 'Masaje de aromaterapia con Jenna', price: 3313, rating: 4.89, location: 'Cancún' },
    { id: 15, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', category: 'Masaje', title: 'Masaje japonés de té matcha', price: 2701, rating: 4.95, location: 'Ciudad de México' },
    { id: 16, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400', category: 'Masaje', title: 'Masaje de tejidos profundos por Olga', price: 1850, rating: 5.0, location: 'Guadalajara' },
    { id: 17, image: 'https://images.unsplash.com/photo-1591343395902-bae4ffe06925?w=400', category: 'Bienestar', title: 'Recuperación y relajación con Daisy', price: 3102, rating: 4.33, location: 'Mazatlán' },
    { id: 18, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400', category: 'Belleza', title: 'Spa completo con tratamiento facial', price: 2500, rating: 4.88, location: 'Cancún' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Banner Hero */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1400"
          alt="Servicios"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Servicios</h1>
          <p className="text-xl max-w-2xl">Profesionales expertos para hacer tu estancia perfecta</p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200" ref={searchRef}>
            <div className="flex items-center divide-x divide-gray-200">
              <div className={`relative flex-1 py-2.5 pl-8 pr-6 cursor-pointer rounded-l-full transition-all duration-200 ${isDestinationOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('destination')}>
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Destino</label>
                <input type="text" placeholder="Buscar destinos" value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full text-sm text-gray-500 placeholder-gray-400 focus:outline-none bg-transparent" />
                {isDestinationOpen && <DestinationSuggestions onSelectCity={handleSelectCity} />}
              </div>
              <div className={`relative flex-1 py-2.5 px-6 cursor-pointer transition-all duration-200 ${isDatesOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('dates')}>
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Fechas</label>
                <div className="text-sm text-gray-500">{datesDisplay}</div>
              </div>
              <div className={`relative flex-1 flex items-center py-2.5 pl-6 pr-2 cursor-pointer rounded-r-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('guests')}>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">Huéspedes</label>
                  <div className="text-sm text-gray-500">{guestsDisplay}</div>
                </div>
                <button className="bg-[#FF385C] hover:bg-[#E0314F] text-white rounded-full p-3.5 ml-4 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {isGuestsOpen && <GuestsSelector onSelectGuests={handleSelectGuests} />}
              </div>
            </div>
            {isDatesOpen && <DateRangePicker checkIn={filters.check_in} checkOut={filters.check_out} onSelectDate={handleSelectDates} />}
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carruseles de Servicios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ServiceCarousel title="Chefs privados" services={chefServices} activeCategory={activeCategory} />
        <ServiceCarousel title="Entrenamiento y bienestar" services={trainingServices} activeCategory={activeCategory} />
        <ServiceCarousel title="Masajes y relajación" services={massageServices} activeCategory={activeCategory} />
      </div>
    </div>
  );
}