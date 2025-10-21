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


// --- UTILERÍA DE FECHAS Y MESES ---
const getMonthDetails = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sáb)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
  
  return { year, month, firstDay, daysInMonth, monthName };
};

const formatDateDisplayShort = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  // Formato: sáb., 1 nov.
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/g, '');
};


// --- Componente Selector de Duración por Mes (MonthDurationPicker) ---
const MonthDurationPicker = ({ onSelectDuration, onSelectDate }) => {
    const [duration, setDuration] = useState(1); // Duración inicial en meses
    const [selectedMonth, setSelectedMonth] = useState(new Date()); // Mes de inicio

    const durations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    // Cálculo de fechas de inicio y fin (ejemplo: 1 Nov al 1 Dic)
    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + duration, 1);
    
    // Formateo de fechas para el pie de página
    const startDateDisplay = formatDateDisplayShort(startDate.toISOString().split('T')[0]);
    const endDateDisplay = formatDateDisplayShort(endDate.toISOString().split('T')[0]);


    // Componente del Dial (Círculo Giratorio)
    const Dial = () => (
        <div className="relative w-64 h-64 flex items-center justify-center mx-auto my-8">
            {/* Círculo Exterior (Anillo con puntos) */}
            <div className="absolute w-full h-full rounded-full border-2 border-white/50 bg-white shadow-xl">
                {/* Puntos para cada mes de duración */}
                {durations.map((d) => {
                    const angle = (360 / durations.length) * (d - 1) - 90; // Ángulo para rotar (empezando en el tope)
                    return (
                        <div
                            key={d}
                            className="absolute inset-0 flex justify-center items-start"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            {/* Pequeño punto gris en el borde */}
                            <div className={`w-1.5 h-1.5 rounded-full ${d <= duration ? 'bg-gray-400' : 'bg-gray-300'}`} style={{ transform: 'translateY(15px)' }}></div>
                        </div>
                    );
                })}
            </div>

            {/* Selector Rojo/Blanco (El "botón" en el dial) */}
            {/* Este se mueve al ángulo del mes seleccionado */}
            <div
                className="absolute w-full h-full transition-transform duration-300"
                style={{ transform: `rotate(${(360 / durations.length) * (duration - 1) - 90}deg)` }}
            >
                <button 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full shadow-lg bg-[#FF385C] border-2 border-white"
                    onClick={() => setDuration(prev => (prev % 12) + 1)} // Simula un clic para avanzar
                    aria-label="Ajustar duración"
                >
                    {/* Círculo blanco interno */}
                    <div className="w-5 h-5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </button>
            </div>
            
            {/* Círculo Central con el número */}
            <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center bg-white shadow-inner-xl relative z-10">
                <span className="text-5xl font-extrabold text-gray-900">{duration}</span>
                <span className="text-base font-semibold text-gray-700">mes</span>
            </div>
            
             {/* Sombra interna para el efecto neumorphism */}
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
            
            {/* Pie de página con las fechas calculadas */}
            <div className="text-center mt-6 text-base font-medium text-gray-700">
                <span className="underline cursor-pointer hover:text-gray-900 transition-colors">
                    {startDateDisplay}
                </span>
                <span className="mx-1 font-normal text-gray-500">al</span>
                <span className="underline cursor-pointer hover:text-gray-900 transition-colors">
                    {endDateDisplay}
                </span>
            </div>
            
            {/* Botón para seleccionar un mes específico (ejemplo de interacción) */}
            <button 
                className="mt-6 text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))}
            >
                Cambiar mes de inicio (Ej. {new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })})
            </button>
        </div>
    );
};


// --- Componente de Calendario de Fechas (sin cambios) ---
const Day = ({ day, monthDate, checkInDate, checkOutDate, handleDayClick }) => {
    const today = new Date();
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    
    const checkIn = checkInDate ? new Date(checkInDate) : null;
    const checkOut = checkOutDate ? new Date(checkOutDate) : null;
    
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = (checkIn && dateString === checkInDate) || (checkOut && dateString === checkOutDate);
    // Verificar si está en rango
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
        {/* Fondo para el inicio y fin del rango */}
        {isSelected && (
            <div className={`absolute inset-0 z-0 ${isInRange ? 'bg-gray-100' : 'bg-transparent'}`}></div>
        )}
        
        {/* Elemento del día (botón) */}
        <button
          className={`${baseClasses} ${bgClasses} ${textClasses}`}
          disabled={isDisabled}
        >
            {day}
        </button>
        
        {/* Línea de fondo para el rango (si no es el check-in ni check-out) */}
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
    
    // Días de relleno al inicio (para centrar el 1er día)
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    // Días del mes
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


// --- Componente Principal DateRangePicker (Modificado para ancho global de la barra de búsqueda) ---
const DateRangePicker = ({ checkIn, checkOut, onSelectDate, onClose }) => {
  // Estado para la pestaña activa (Fechas, Meses, Flexible)
  const [activeTab, setActiveTab] = useState('Fechas');
  
  // Meses mostrados: el mes actual y el siguiente
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [nextMonth, setNextMonth] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 1));

  // Función para avanzar o retroceder un mes
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
  
  // Opciones de flexibilidad (solo para la pestaña 'Fechas')
  const flexibilityOptions = [
      { label: 'Fechas exactas', value: 0 },
      { label: '± 1 día', value: 1 },
      { label: '± 2 días', value: 2 },
      { label: '± 3 días', value: 3 },
      { label: '± 7 días', value: 7 },
      { label: '± 14 días', value: 14 },
  ];
  
  // Convertir las fechas a cadenas ISO para el componente Month
  const checkInISO = checkIn;
  const checkOutISO = checkOut;

  return (
    <div className="absolute top-full left-0 mt-4 p-6 w-full bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      {/* 1. Pestañas de selección (Fechas, Meses, Flexible) */}
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

      {/* 2. Contenido de la Pestaña "Fechas" */}
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
      
      {/* 3. Contenido de la Pestaña "Meses" */}
      {activeTab === 'Meses' && (
          <MonthDurationPicker 
              onSelectDuration={(duration) => console.log('Duración en meses:', duration)} 
              onSelectDate={(date) => console.log('Mes de inicio:', date)}
          />
      )}

      
      {/* 4. Contenido para Flexible (Placeholder) */}
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
  // Lista de sugerencias ampliada con datos de las imágenes
  const suggestions = [
    { name: 'Por la zona', description: 'Descubre qué hay a tu alrededor', icon: '✈️', color: 'text-blue-500 bg-blue-50' },
    { name: 'San Carlos, Sonora', description: 'Popular entre los viajeros de tu zona', icon: '🏙️', color: 'text-gray-500 bg-gray-100' },
    { name: 'Guadalajara, Jalisco', description: 'Por lugares de interés como este: Catedral de Guadalajara', icon: '🏰', color: 'text-yellow-600 bg-yellow-50' },
    { name: 'Mazatlán, Sinaloa', description: 'Un destino de playa popular', icon: '🏖️', color: 'text-pink-500 bg-pink-50' },
    { name: 'Ciudad Obregón, Sonora', description: 'Popular entre los viajeros de tu zona', icon: '🌊', color: 'text-cyan-500 bg-cyan-50' },
    { name: 'Bahía de Kino, Sonora', description: 'Ideal para escapadas de fin de semana', icon: '🏠', color: 'text-teal-500 bg-teal-50' },
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
    { name: 'Ensenada, Baja California', description: 'Por su exquisita gastronomía', icon: '🍤', color: 'text-cyan-600 bg-cyan-100' },
    { name: 'Zapopan, Jalisco', description: 'Por lugares de interés como este: Basílica de Nuestra Señora de Zapopan', icon: '⛪', color: 'text-blue-400 bg-blue-100' },
    { name: 'La Paz, Baja California Sur', description: 'Para los amantes de la naturaleza', icon: '🐳', color: 'text-red-400 bg-red-100' },
    { name: 'Mexicali, Baja California', description: 'Destino popular', icon: '☀️', color: 'text-green-400 bg-green-100' },
    { name: 'Culiacán, Sinaloa', description: 'Una joya escondida', icon: '💎', color: 'text-pink-400 bg-pink-100' },
  ];

  return (
    <div className="absolute top-full left-0 mt-4 p-4 w-[450px] bg-white rounded-3xl shadow-2xl z-20 border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 px-2 text-gray-800">Sugerencias de destinos</h3>
      
      {/* Contenedor con altura máxima y scroll */}
      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <ul>
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectCity(item.name.split(',')[0].trim())}
            >
              {/* Usando SVG para iconos más detallados (simulando los iconos de las imágenes) */}
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

      {/* Estilos para una barra de desplazamiento discreta (opcional) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db; /* gray-300 */
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af; /* gray-400 */
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

  // Actualizar el total de huéspedes
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
export default function Home() {
  const [filters, setFilters] = useState({
    city: '',
    check_in: '',
    check_out: '',
    guests: 0,
  });
  
  // Estado para controlar los dropdowns
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false); 
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  
  const searchRef = useRef(null); 
  
  // Consulta de propiedades
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
  
  // Manejador de selección de fechas
  const handleSelectDates = useCallback((newDates) => {
    setFilters(prev => ({ ...prev, ...newDates }));
  }, []);
  
  // Manejador de selección de huéspedes
  const handleSelectGuests = useCallback((guestData) => {
    setFilters(prev => ({ ...prev, ...guestData }));
  }, []);
  
  // Lógica para cerrar los dropdowns cuando se hace clic fuera
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
      // Cierra todos
      setIsDestinationOpen(false);
      setIsDatesOpen(false); 
      setIsGuestsOpen(false);

      // Abre el que corresponde
      if (section === 'destination') {
          setIsDestinationOpen(true);
      } else if (section === 'dates') {
          setIsDatesOpen(true);
      } else if (section === 'guests') {
          setIsGuestsOpen(true);
      }
  };

  // Función auxiliar para formatear la fecha mostrada
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
          
          {/* Barra de búsqueda con manejo de clic fuera */}
          <div 
            className="relative bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            ref={searchRef} 
          >
            <div className="flex items-center divide-x divide-gray-200">
              
              {/* 1. Destino */}
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
                
                {/* Despliegue de Sugerencias de Destino */}
                {isDestinationOpen && (
                  <DestinationSuggestions onSelectCity={handleSelectCity} />
                )}
              </div>

              {/* 2. Fechas */}
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

              {/* 3. Huéspedes */}
              <div 
                className={`relative flex items-center py-2.5 pl-6 pr-2 cursor-pointer rounded-full transition-all duration-200 ${isGuestsOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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

      {/* Listado de propiedades */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties?.data?.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-xl overflow-hidden mb-3">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/FF385C/white?text=${property.city.charAt(0)}` }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400 text-5xl">
                      🏠
                    </div>
                  )}
                  {property.average_rating && (
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center space-x-1">
                      <span className="text-yellow-500 text-sm">⭐</span>
                      <span className="text-sm font-semibold">{property.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <div className="px-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {property.city}, {property.country}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-1 mb-1">
                    {property.title}
                  </p>
                  
                  <p className="text-gray-500 text-sm mb-2">
                    {property.guests} huéspedes · {property.bedrooms} habitaciones
                  </p>
                  
                  <div>
                    <span className="font-semibold text-gray-900">${property.price_per_night}</span>
                    <span className="text-gray-600 text-sm"> noche</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {properties?.data?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}