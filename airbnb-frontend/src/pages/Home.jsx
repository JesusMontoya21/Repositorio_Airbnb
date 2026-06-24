import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import FlexibleDates from '../components/FlexibleDates';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const mockProperties = [
  { id: 1, city: 'Mazatlán', country: 'México', title: 'Departamento frente al mar', price_per_night: 850, guests: 4, bedrooms: 2, average_rating: 4.91, images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' }] },
  { id: 2, city: 'Mazatlán', country: 'México', title: 'Casa con alberca privada', price_per_night: 1200, guests: 6, bedrooms: 3, average_rating: 4.85, images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }] },
  { id: 3, city: 'Mazatlán', country: 'México', title: 'Habitación en zona dorada', price_per_night: 550, guests: 2, bedrooms: 1, average_rating: 4.78, images: [{ url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400' }] },
  { id: 4, city: 'Mazatlán', country: 'México', title: 'Penthouse con vista al océano', price_per_night: 2100, guests: 8, bedrooms: 4, average_rating: 4.96, images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' }] },
  { id: 5, city: 'Guadalajara', country: 'México', title: 'Loft en Providencia', price_per_night: 780, guests: 2, bedrooms: 1, average_rating: 4.88, images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' }] },
  { id: 6, city: 'Guadalajara', country: 'México', title: 'Casa en Zapopan con jardín', price_per_night: 950, guests: 5, bedrooms: 3, average_rating: 4.82, images: [{ url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400' }] },
  { id: 7, city: 'Cancún', country: 'México', title: 'Villa en zona hotelera', price_per_night: 3200, guests: 10, bedrooms: 5, average_rating: 4.95, images: [{ url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' }] },
  { id: 8, city: 'Cancún', country: 'México', title: 'Departamento frente al mar', price_per_night: 1800, guests: 4, bedrooms: 2, average_rating: 4.87, images: [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' }] },
  { id: 9, city: 'Ciudad de México', country: 'México', title: 'Apartamento en Condesa', price_per_night: 980, guests: 3, bedrooms: 2, average_rating: 4.93, images: [{ url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400' }] },
  { id: 10, city: 'Ciudad de México', country: 'México', title: 'Loft en Roma Norte', price_per_night: 750, guests: 2, bedrooms: 1, average_rating: 4.86, images: [{ url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400' }] },
  { id: 11, city: 'Culiacán', country: 'México', title: 'Casa moderna en Culiacán', price_per_night: 650, guests: 4, bedrooms: 2, average_rating: 4.80, images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' }] },
  { id: 12, city: 'Los Mochis', country: 'México', title: 'Departamento céntrico en Los Mochis', price_per_night: 580, guests: 3, bedrooms: 1, average_rating: 4.75, images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' }] },
];

const mexicanStates = new Set([
  'aguascalientes', 'baja california', 'baja california sur', 'campeche', 'chiapas', 'chihuahua',
  'ciudad de méxico', 'coahuila', 'colima', 'durango', 'estado de méxico', 'guanajuato',
  'guerrero', 'hidalgo', 'jalisco', 'michoacán', 'michoacan', 'morelos', 'nayarit', 'nuevo león',
  'nuevo leon', 'oaxaca', 'puebla', 'querétaro', 'queretaro', 'quintana roo', 'san luis potosí',
  'san luis potosi', 'sinaloa', 'sonora', 'tabasco', 'tamaulipas', 'tlaxcala', 'veracruz',
  'yucatán', 'yucatan', 'zacatecas'
]);

const isPostalSegment = (segment) => /^(c\.?p\.?\s*\d{4,6}|c[oó]digo postal\s*\d{4,6}|\d{4,6})$/iu.test(segment.trim());
const isCountrySegment = (segment) => ['méxico', 'mexico'].includes(segment.trim().toLowerCase());
const isStateSegment = (segment) => mexicanStates.has(segment.trim().toLowerCase());
const looksLikeAddressComponent = (value) => /\d|calle|avenida|\bav\b|boulevard|\bblvd\b|km\b|colonia|residencial|fracc|fraccionamiento|lote|manzana|fase|c\.?p\.?|c[oó]digo postal/iu.test(String(value).trim());

const getLocationFromAddress = (address) => {
  const parts = String(address || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !isPostalSegment(part));

  if (parts.length === 0) {
    return null;
  }

  if (isCountrySegment(parts[parts.length - 1])) {
    parts.pop();
  }

  if (parts.length > 0 && isStateSegment(parts[parts.length - 1])) {
    parts.pop();
  }

  return parts.length > 0 ? parts[parts.length - 1] : null;
};

const getDisplayCity = (property) => {
  const rawCity = String(property?.city || '').trim();
  const addressCity = getLocationFromAddress(property?.address);

  if (addressCity && (!rawCity || looksLikeAddressComponent(rawCity))) {
    return addressCity;
  }

  if (rawCity && !looksLikeAddressComponent(rawCity)) {
    return rawCity;
  }

  if (!property?.address) {
    return rawCity || 'Sin ciudad';
  }

  return addressCity || rawCity || 'Sin ciudad';
};

const PropertyCard = ({ property }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsAnimating(true);
    setIsFavorited(prev => !prev);
    setTimeout(() => setIsAnimating(false), 300);
    await api.post(`/favorites/${property.id}`);
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  return (
    <Link to={`/property/${property.id}`} className="group cursor-pointer flex-shrink-0 w-64">
      <div className="relative h-48 rounded-xl overflow-hidden mb-3">
        <img src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'}
          alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        <button className="absolute top-3 right-3 hover:scale-110 transition-all" onClick={toggleFavorite}>
          <svg className={`w-6 h-6 transition-all duration-300 ${isAnimating ? 'scale-150' : 'scale-100'}`}
            fill={isFavorited ? '#FF385C' : 'none'} stroke={isFavorited ? '#FF385C' : 'white'} strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {property.average_rating >= 4.9 && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow">
            Favorito entre huéspedes
          </div>
        )}
      </div>
      <div className="px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <svg className="w-3 h-3 fill-gray-900" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-xs font-medium">{property.average_rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">{property.guests} huéspedes · {property.bedrooms} hab.</p>
        <p className="text-sm mt-1">
          <span className="font-semibold">${property.price_per_night} MXN</span>
          <span className="text-gray-500"> noche</span>
        </p>
      </div>
    </Link>
  );
};

const CityCarousel = ({ city, properties }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
  };
  const cityProperties = properties.filter((p) => getDisplayCity(p) === city);
  if (cityProperties.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Alojamientos populares en {city} →</h2>
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
        {cityProperties.map(property => <PropertyCard key={property.id} property={property} />)}
      </div>
    </div>
  );
};

const SearchResults = ({ properties, searchCity }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      {properties.length > 0
        ? `${properties.length} alojamientos encontrados para "${searchCity}"`
        : `No se encontraron alojamientos para "${searchCity}"`}
    </h2>
    {properties.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map(property => (
          <Link key={property.id} to={`/property/${property.id}`} className="group cursor-pointer">
            <div className="relative h-48 rounded-xl overflow-hidden mb-3">
              <img src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'}
                alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              {property.average_rating >= 4.9 && (
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                  Favorito entre huéspedes
                </div>
              )}
            </div>
            <div className="px-1">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{getDisplayCity(property)}, {property.country}</p>
              <p className="text-sm mt-1">
                <span className="font-semibold">${property.price_per_night} MXN</span>
                <span className="text-gray-500"> noche</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500">Intenta con otra ciudad o nombre de propiedad</p>
      </div>
    )}
  </div>
);

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
    { name: 'Culiacán, Sinaloa', icon: '💎', color: 'text-pink-400 bg-pink-100' },
    { name: 'Los Mochis, Sinaloa', icon: '✨', color: 'text-fuchsia-500 bg-fuchsia-50' },
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

export default function Home() {
  const [filters, setFilters] = useState({ city: '', check_in: '', check_out: '', guests: 0 });
  const [searchParams, setSearchParams] = useState({ city: '', guests: 0 });
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const searchRef = useRef(null);

  const { data: apiProperties, isLoading } = useQuery({
    queryKey: ['properties', searchParams],
    queryFn: async () => {
      try {
        const res = await api.get('/properties', { params: searchParams });
        return res.data.data || [];
      } catch {
        return [];
      }
    },
  });

  const allProperties = (apiProperties && apiProperties.length > 0) ? apiProperties : mockProperties;

  const cities = Array.from(new Set(
    allProperties
      .map((property) => getDisplayCity(property))
      .filter((city) => typeof city === 'string' && city.trim().length > 0)
  )).sort((a, b) => a.localeCompare(b, 'es'));

  const handleSelectCity = (city) => {
    setFilters(prev => ({ ...prev, city }));
    setIsDestinationOpen(false);
  };
  const handleSelectDates = useCallback((newDates) => { setFilters(prev => ({ ...prev, ...newDates })); }, []);
  const handleSelectGuests = useCallback((guestData) => { setFilters(prev => ({ ...prev, ...guestData })); }, []);

  const handleSearch = () => {
    setSearchParams({ city: filters.city, guests: filters.guests });
    setIsDestinationOpen(false);
    setIsDatesOpen(false);
    setIsGuestsOpen(false);
  };

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

  const isSearching = searchParams.city !== '';

  const filteredProperties = isSearching
    ? allProperties.filter(p =>
        p.city.toLowerCase().includes(searchParams.city.toLowerCase()) ||
        p.title.toLowerCase().includes(searchParams.city.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="sticky top-0 z-40 bg-white border-b shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200" ref={searchRef}>
            <div className="flex items-center divide-x divide-gray-200">
              <div className={`relative flex-1 py-2.5 pl-8 pr-6 cursor-pointer rounded-full transition-all duration-200 ${isDestinationOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('destination')}>
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Destino</label>
                <input type="text" name="city" placeholder="Buscar por ciudad o nombre" value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm text-gray-500 placeholder-gray-400 focus:outline-none bg-transparent" />
                {isDestinationOpen && <DestinationSuggestions onSelectCity={handleSelectCity} />}
              </div>
              <div className={`relative flex-1 py-2.5 px-6 cursor-pointer rounded-full transition-all duration-200 ${isDatesOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('dates')}>
                <label className="block text-xs font-semibold text-gray-900 mb-0.5">Fechas</label>
                <div className="text-sm text-gray-500">{datesDisplay}</div>
              </div>
              <div className={`relative flex-1 flex items-center py-2.5 pl-6 pr-2 cursor-pointer rounded-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => handleSearchClick('guests')}>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">Huéspedes</label>
                  <div className="text-sm text-gray-500">{guestsDisplay}</div>
                </div>
                <button onClick={handleSearch}
                  className="bg-[#FF385C] hover:bg-[#E0314F] text-white rounded-full p-3.5 ml-4 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {isGuestsOpen && <GuestsSelector onSelectGuests={handleSelectGuests} />}
              </div>
            </div>
            {isDatesOpen && <DateRangePicker checkIn={filters.check_in} checkOut={filters.check_out} onSelectDate={handleSelectDates} />}
          </div>

          {isSearching && (
            <div className="flex justify-center mt-3">
              <button onClick={() => { setFilters({ city: '', check_in: '', check_out: '', guests: 0 }); setSearchParams({ city: '', guests: 0 }); }}
                className="text-sm text-gray-600 hover:text-gray-900 underline">
                ✕ Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
          </div>
        ) : isSearching ? (
          <SearchResults properties={filteredProperties} searchCity={searchParams.city} />
        ) : (
          cities.map(city => (
            <CityCarousel key={city} city={city} properties={allProperties} />
          ))
        )}
      </div>
    </div>
  );
}