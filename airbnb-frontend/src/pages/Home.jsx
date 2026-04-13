import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import FlexibleDates from '../components/FlexibleDates';

const propertiesAPI = {
  getAll: async (filters) => {
    console.log('Fetching properties with filters:', filters);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { data: [], meta: { total: 0 } } };
  }
};

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
      <button className={`${baseClasses} ${bgClasses} ${textClasses}`} disabled={isDisabled}>
        {day}
      </button>
    </div>
  );
};

const Month = ({ monthDate, checkInDate, checkOutDate, handleDayClick }) => {
  const { year, firstDay, daysInMonth, monthName } = getMonthDetails(monthDate);
  const daysOfWeek = ['D', 'L', 'M', 'J', 'V', 'S'];
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <Day key={day} day={day} monthDate={monthDate} checkInDate={checkInDate} checkOutDate={checkOutDate} handleDayClick={handleDayClick} />
    );
  }

  return (
    <div className="w-1/2 px-4">
      <h4 className="text-base font-medium mb-4 capitalize text-gray-800">{monthName} {year}</h4>
      <div className="grid grid-cols-7 gap-y-2 mb-2">
        {daysOfWeek.map(day => (
          <span key={day} className="text-center text-xs font-semibold text-gray-500 w-10">{day}</span>
        ))}
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
    if (!checkIn) {
      onSelectDate({ check_in: dateString, check_out: '' });
    } else if (dayDate < new Date(checkIn)) {
      onSelectDate({ check_in: dateString, check_out: '' });
    } else if (!checkOut || dayDate > new Date(checkIn)) {
      onSelectDate({ check_in: checkIn, check_out: dateString });
    } else {
      onSelectDate({ check_in: dateString, check_out: '' });
    }
  };

  return (
    <div className="absolute top-full left-0 mt-4 p-6 w-full bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="p-1 bg-gray-100 rounded-full flex space-x-1">
          {['Fechas', 'Flexible'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === tab ? 'bg-white shadow-md text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Fechas' && (
        <div className="flex justify-between items-center mb-4 text-gray-600">
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
        <FlexibleDates onSelectFlexible={(flexData) => console.log('Flexible:', flexData)} />
      )}
    </div>
  );
};

const DestinationSuggestions = ({ onSelectCity }) => {
  const suggestions = [
    { name: 'Por la zona', icon: '✈️', color: 'text-blue-500 bg-blue-50' },
    { name: 'Mazatlán, Sinaloa', icon: '🏖️', color: 'text-pink-500 bg-pink-50' },
    { name: 'Guadalajara, Jalisco', icon: '🏰', color: 'text-yellow-600 bg-yellow-50' },
    { name: 'Ciudad de México', icon: '🏙️', color: 'text-gray-500 bg-gray-100' },
    { name: 'Cancún, Quintana Roo', icon: '🌴', color: 'text-green-500 bg-green-50' },
    { name: 'Monterrey, Nuevo León', icon: '🏭', color: 'text-red-500 bg-red-50' },
    { name: 'Playa del Carmen', icon: '🌊', color: 'text-cyan-500 bg-cyan-50' },
    { name: 'Culiacán, Sinaloa', icon: '💎', color: 'text-pink-400 bg-pink-100' },
  ];

  return (
    <div className="absolute top-full left-0 mt-4 p-4 w-[450px] bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 px-2 text-gray-800">Sugerencias de destinos</h3>
      <ul>
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="flex items-center space-x-4 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectCity(item.name.split(',')[0].trim())}
          >
            <div className={`p-3 rounded-xl flex items-center justify-center w-12 h-12 ${item.color}`}>
              <span className="text-xl">{item.icon}</span>
            </div>
            <p className="font-medium text-sm text-gray-800">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const GuestsSelector = ({ onSelectGuests }) => {
  const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, babies: 0, pets: 0 });

  useEffect(() => {
    const total = guestCounts.adults + guestCounts.children;
    onSelectGuests({ guests: total, ...guestCounts });
  }, [guestCounts, onSelectGuests]);

  const GuestRow = ({ label, description, type, count }) => (
    <div className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setGuestCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))}
          disabled={count === 0}
          className={`w-8 h-8 rounded-full border flex items-center justify-center ${count === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-gray-900'}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <span className="w-8 text-center font-medium text-gray-900">{count}</span>
        <button
          onClick={() => setGuestCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))}
          className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-gray-900 flex items-center justify-center"
        >
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

export default function Home() {
  const [filters, setFilters] = useState({ city: '', check_in: '', check_out: '', guests: 0 });
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const searchRef = useRef(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertiesAPI.getAll(filters).then(res => res.data),
  });

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = (section) => {
    setIsDestinationOpen(false);
    setIsDatesOpen(false);
    setIsGuestsOpen(false);
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

  return (
    <div>
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200" ref={searchRef}>
            <div className="flex items-center divide-x divide-gray-200">

              <div
                className={`relative flex-1 py-2.5 pl-8 pr-6 cursor-pointer rounded-full transition-all duration-200 ${isDestinationOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('destination')}
              >
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Destino</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Buscar destinos"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full text-sm text-gray-500 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                {isDestinationOpen && <DestinationSuggestions onSelectCity={handleSelectCity} />}
              </div>

              <div
                className={`relative flex-1 py-2.5 px-6 cursor-pointer rounded-full transition-all duration-200 ${isDatesOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('dates')}
              >
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Fechas</label>
                <div className="text-sm text-gray-500">{datesDisplay}</div>
              </div>

              <div
                className={`relative flex-1 flex items-center py-2.5 pl-6 pr-2 cursor-pointer rounded-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleSearchClick('guests')}
              >
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

            {isDatesOpen && (
              <DateRangePicker checkIn={filters.check_in} checkOut={filters.check_out} onSelectDate={handleSelectDates} />
            )}
          </div>
        </div>
      </div>

      {/* Carrusel de propiedades por ciudad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
          </div>
        ) : (
          <>
            {/* Sección: Alojamientos populares */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Alojamientos populares</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties?.data?.length === 0 && (
                  <div className="col-span-4 text-center py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
                    <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
                  </div>
                )}
                {properties?.data?.map((property) => (
                  <Link key={property.id} to={`/property/${property.id}`} className="group cursor-pointer">
                    <div className="relative h-64 rounded-xl overflow-hidden mb-3">
                      {property.images?.[0] ? (
                        <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400 text-5xl">🏠</div>
                      )}
                      {property.average_rating && (
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center space-x-1">
                          <span className="text-yellow-500 text-sm">⭐</span>
                          <span className="text-sm font-semibold">{property.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="px-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{property.city}, {property.country}</h3>
                      <p className="text-gray-600 text-sm line-clamp-1 mb-1">{property.title}</p>
                      <p className="text-gray-500 text-sm mb-2">{property.guests} huéspedes · {property.bedrooms} habitaciones</p>
                      <div>
                        <span className="font-semibold text-gray-900">${property.price_per_night}</span>
                        <span className="text-gray-600 text-sm"> noche</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}