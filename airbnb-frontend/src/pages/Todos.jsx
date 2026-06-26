import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import FlexibleDates from '../components/FlexibleDates';

const PropertyCard = ({ property }) => (
  <Link to={`/property/${property.id}`} className="group flex-shrink-0 w-72">
    <div className="relative h-48 rounded-3xl overflow-hidden mb-3">
      <img
        src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      {property.average_rating >= 4.9 && (
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[11px] font-semibold shadow">
          Favorito
        </div>
      )}
    </div>
    <div className="px-1">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
        <span className="text-sm font-medium text-gray-700">${property.price_per_night}</span>
      </div>
      <p className="text-gray-500 text-xs">{property.city}, {property.country}</p>
      <p className="text-gray-500 text-xs mt-2">{property.guests} huéspedes · {property.bedrooms} hab.</p>
    </div>
  </Link>
);

const ExperienceCard = ({ experience }) => (
  <Link to={`/experiences/${experience.id}`} className="group flex-shrink-0 w-72">
    <div className="relative h-64 rounded-3xl overflow-hidden mb-3">
      <img
        src={experience.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600'}
        alt={experience.title}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      {experience.category && (
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[11px] font-semibold shadow">
          {experience.category}
        </div>
      )}
    </div>
    <div className="px-1">
      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{experience.title}</h3>
      <p className="text-gray-500 text-xs">{experience.location} · {experience.city}</p>
      <p className="text-sm mt-2"><span className="font-semibold">Desde ${experience.price}</span> por persona</p>
    </div>
  </Link>
);

const ServiceCard = ({ service }) => (
  <Link to={`/services/${service.id}`} className="group flex-shrink-0 w-72">
    <div className="relative h-64 rounded-3xl overflow-hidden mb-3">
      <img
        src={service.image || 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600'}
        alt={service.title}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      {service.category && (
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[11px] font-semibold shadow">
          {service.category}
        </div>
      )}
    </div>
    <div className="px-1">
      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{service.title}</h3>
      <p className="text-gray-500 text-xs">{service.location}</p>
      <p className="text-sm mt-2"><span className="font-semibold">Desde ${service.price}</span> MXN</p>
    </div>
  </Link>
);

const SectionCarousel = ({ title, items, renderItem }) => {
  if (!items || items.length === 0) return null;

  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction * 360, behavior: 'smooth' });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="p-2 border border-gray-300 rounded-full hover:shadow-md transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll(1)} className="p-2 border border-gray-300 rounded-full hover:shadow-md transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(renderItem)}
      </div>
    </div>
  );
};

const DestinationSuggestions = ({ onSelectCity }) => {
  const suggestions = [
    { name: 'Mazatlán', icon: '🏖️' },
    { name: 'Guadalajara', icon: '🏰' },
    { name: 'Cancún', icon: '🌴' },
    { name: 'Ciudad de México', icon: '🏙️' },
    { name: 'Culiacán', icon: '✨' },
    { name: 'Los Mochis', icon: '🚤' },
  ];

  return (
    <div className="absolute top-full left-0 mt-4 p-4 w-[370px] bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Sugerencias</h3>
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((item) => (
          <button key={item.name} type="button" onClick={() => onSelectCity(item.name)}
            className="flex items-center gap-3 p-3 rounded-3xl border border-gray-200 hover:bg-gray-50 transition text-left">
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-900">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const GuestsSelector = ({ onSelectGuests }) => {
  const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, babies: 0, pets: 0 });

  useEffect(() => {
    const totalGuests = guestCounts.adults + guestCounts.children;
    onSelectGuests({ guests: totalGuests, ...guestCounts });
  }, [guestCounts, onSelectGuests]);

  const GuestRow = ({ label, description, type, count }) => (
    <div className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setGuestCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))}
          className={`w-8 h-8 rounded-full border flex items-center justify-center ${count === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-gray-900'}`}
          disabled={count === 0}>
          -
        </button>
        <span className="w-8 text-center font-medium text-gray-900">{count}</span>
        <button type="button" onClick={() => setGuestCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))}
          className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-gray-900 flex items-center justify-center">
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute top-full right-0 mt-4 p-6 w-96 bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <GuestRow label="Adultos" description="13 años o más" type="adults" count={guestCounts.adults} />
      <GuestRow label="Niños" description="2 a 12 años" type="children" count={guestCounts.children} />
      <GuestRow label="Bebés" description="Menos de 2" type="babies" count={guestCounts.babies} />
      <GuestRow label="Mascotas" description="Mascota de servicio" type="pets" count={guestCounts.pets} />
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
    if (!checkIn) return onSelectDate({ check_in: dateString, check_out: '' });
    if (new Date(dateString) < new Date(checkIn)) return onSelectDate({ check_in: dateString, check_out: '' });
    if (!checkOut || new Date(dateString) > new Date(checkIn)) return onSelectDate({ check_in: checkIn, check_out: dateString });
    return onSelectDate({ check_in: dateString, check_out: '' });
  };

  const Month = ({ monthDate }) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = monthDate.toLocaleDateString('es-ES', { month: 'long' });
    const daysOfWeek = ['D', 'L', 'M', 'J', 'V', 'S'];
    const calendarDays = [];
    for (let i = 0; i < firstDay; i += 1) calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    for (let day = 1; day <= daysInMonth; day += 1) {
      calendarDays.push(<Day key={day} day={day} monthDate={monthDate} checkInDate={checkIn} checkOutDate={checkOut} handleDayClick={handleDayClick} />);
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

  return (
    <div className="absolute top-full left-0 mt-4 p-6 w-full bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="p-1 bg-gray-100 rounded-full flex space-x-1">
          {['Fechas', 'Flexible'].map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === tab ? 'bg-white shadow-md text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'Fechas' ? (
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex w-full justify-center">
            <Month monthDate={currentMonth} />
            <Month monthDate={nextMonth} />
          </div>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Elige un rango de duración y un mes de inicio para tu estancia flexible.</p>
        </div>
      )}
    </div>
  );
};

export default function Todos() {
  const [filters, setFilters] = useState({ city: '', check_in: '', check_out: '', guests: 0 });
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const searchRef = useRef(null);

  const { data: propertiesData = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties', filters.city, filters.guests],
    queryFn: async () => {
      const res = await api.get('/properties', { params: { city: filters.city || undefined, guests: filters.guests || undefined } });
      return res.data?.data ?? [];
    },
  });

  const { data: experiencesData = [], isLoading: isLoadingExperiences } = useQuery({
    queryKey: ['experiences', filters.city],
    queryFn: async () => {
      const res = await api.get('/experiences', { params: { city: filters.city || undefined } });
      return res.data ?? [];
    },
  });

  const { data: servicesData = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', filters.city],
    queryFn: async () => {
      const res = await api.get('/services', { params: { location: filters.city || undefined } });
      return res.data ?? [];
    },
  });

  const handleSelectCity = (city) => {
    setFilters((prev) => ({ ...prev, city }));
    setIsDestinationOpen(false);
  };

  const handleSelectDates = useCallback((newDates) => {
    setFilters((prev) => ({ ...prev, ...newDates }));
  }, []);

  const handleSelectGuests = useCallback((guestData) => {
    setFilters((prev) => ({ ...prev, ...guestData }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDestinationOpen(false);
        setIsDatesOpen(false);
        setIsGuestsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = (section) => {
    setIsDestinationOpen(false);
    setIsDatesOpen(false);
    setIsGuestsOpen(false);
    if (section === 'destination') setIsDestinationOpen(true);
    if (section === 'dates') setIsDatesOpen(true);
    if (section === 'guests') setIsGuestsOpen(true);
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  const datesDisplay = filters.check_in && filters.check_out
    ? `${formatDateDisplay(filters.check_in)} - ${formatDateDisplay(filters.check_out)}`
    : filters.check_in ? `${formatDateDisplay(filters.check_in)} - Salida` : 'Agregar fechas';

  const guestsDisplay = filters.guests > 0 ? `${filters.guests} huésped${filters.guests > 1 ? 'es' : ''}` : '¿Cuántos?';

  const searchKeyword = filters.city.trim().toLowerCase();

  const filteredProperties = useMemo(() => propertiesData.filter((property) =>
    !searchKeyword ||
    property.city?.toLowerCase().includes(searchKeyword) ||
    property.title?.toLowerCase().includes(searchKeyword) ||
    property.country?.toLowerCase().includes(searchKeyword)
  ), [propertiesData, searchKeyword]);

  const filteredExperiences = useMemo(() => experiencesData.filter((experience) =>
    !searchKeyword ||
    experience.city?.toLowerCase().includes(searchKeyword) ||
    experience.location?.toLowerCase().includes(searchKeyword) ||
    experience.title?.toLowerCase().includes(searchKeyword) ||
    experience.category?.toLowerCase().includes(searchKeyword)
  ), [experiencesData, searchKeyword]);

  const filteredServices = useMemo(() => servicesData.filter((service) =>
    !searchKeyword ||
    service.location?.toLowerCase().includes(searchKeyword) ||
    service.title?.toLowerCase().includes(searchKeyword) ||
    service.category?.toLowerCase().includes(searchKeyword)
  ), [servicesData, searchKeyword]);

  const isLoading = isLoadingProperties || isLoadingExperiences || isLoadingServices;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400" alt="Todos"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Todos</h1>
          <p className="text-xl max-w-2xl">Alojamientos, experiencias y servicios juntos en una sola página.</p>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white border-b shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200" ref={searchRef}>
            <div className="flex items-center divide-x divide-gray-200">
              <div className={`relative flex-1 py-3 pl-8 pr-6 cursor-pointer rounded-full transition-all duration-200 ${isDestinationOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('destination')}>
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Destino</label>
                <input
                  type="text"
                  placeholder="Buscar ciudad, experiencia o servicio"
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full text-sm text-gray-500 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                {isDestinationOpen && <DestinationSuggestions onSelectCity={handleSelectCity} />}
              </div>
              <div className={`relative flex-1 py-3 px-6 cursor-pointer transition-all duration-200 ${isDatesOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('dates')}>
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Fechas</label>
                <div className="text-sm text-gray-500">{datesDisplay}</div>
              </div>
              <div className={`relative flex-1 flex items-center py-3 pl-6 pr-3 cursor-pointer rounded-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('guests')}>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">Huéspedes</label>
                  <div className="text-sm text-gray-500">{guestsDisplay}</div>
                </div>
                <button type="button" className="bg-[#FF385C] hover:bg-[#E0314F] text-white rounded-full p-3.5 ml-4 transition-colors duration-200 flex items-center justify-center">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]" />
          </div>
        ) : (
          <>
            <SectionCarousel title="Alojamientos" items={filteredProperties} renderItem={(property) => <PropertyCard key={property.id} property={property} />} />
            <SectionCarousel title="Experiencias" items={filteredExperiences} renderItem={(experience) => <ExperienceCard key={experience.id} experience={experience} />} />
            <SectionCarousel title="Servicios" items={filteredServices} renderItem={(service) => <ServiceCard key={service.id} service={service} />} />
          </>
        )}
      </div>
    </div>
  );
}
